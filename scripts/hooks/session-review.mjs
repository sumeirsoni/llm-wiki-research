import { newDiagnostics } from "../wiki/diagnostics.mjs";
import { validateWiki } from "../wiki/validate.mjs";
import { reindexQmd } from "../qmd/reindex.mjs";
import { diffManifests, protectedManifest, repositoryManifest, wikiDigest, hashText } from "./snapshot.mjs";
import { ensureState, saveState } from "./session-state.mjs";

function toolKey(input) {
  return String(input.tool_use_id ?? input.toolUseId ?? `${input.tool_name ?? "tool"}-latest`);
}

function relevantNewDiagnostics(diagnostics, changedPaths) {
  const changed = new Set(changedPaths);
  const wikiChanged = changedPaths.some((relative) => relative.startsWith("wiki/"));
  const globalPaths = new Set(["README.md", "wiki/index.md", "wiki/log.md", "wiki/overview.md"]);
  return diagnostics.filter((item) => changed.has(item.path) || (wikiChanged && globalPaths.has(item.path)));
}

export async function recordPreTool(root, sessionId, input, options = {}) {
  const { state } = await ensureState(root, sessionId, options);
  state.preTools[toolKey(input)] = await repositoryManifest(root);
  await saveState(root, sessionId, state, options);
  return state;
}

export async function recordPostTool(root, sessionId, input, options = {}) {
  const { state } = await ensureState(root, sessionId, options);
  const key = toolKey(input);
  const before = state.preTools[key];
  const current = await repositoryManifest(root);
  const changed = before ? diffManifests(before, current) : [];

  const attributed = new Set(state.attributedPaths);
  for (const item of changed) attributed.add(item.path);
  const explicitPath = options.explicitPath;
  if (!before && explicitPath && state.baselineManifest[explicitPath] !== current[explicitPath]) {
    attributed.add(explicitPath);
  }
  state.attributedPaths = [...attributed].sort();
  delete state.preTools[key];

  const validation = await validateWiki(root);
  const newItems = newDiagnostics(validation.diagnostics, state.baselineDiagnosticIds);
  const relevant = relevantNewDiagnostics(newItems, [...attributed]);
  const emitted = new Set(state.emittedWarningIds);
  const warnings = relevant.filter((item) => item.severity === "warning" && !emitted.has(item.id));
  warnings.forEach((item) => emitted.add(item.id));
  state.emittedWarningIds = [...emitted];
  await saveState(root, sessionId, state, options);

  return {
    state,
    changed,
    errors: relevant.filter((item) => item.severity === "error"),
    warnings,
  };
}

function companionErrors(state, finalChanges, attributedFinal) {
  const errors = [];
  const currentPaths = new Set(Object.keys(finalChanges.current));
  const attributed = new Set(attributedFinal.map((item) => item.path));
  const newSources = attributedFinal.filter(
    (item) => item.kind === "added" && item.path.startsWith("wiki/sources/") && item.path.endsWith(".md"),
  );

  if (newSources.length > 0 && !attributed.has("wiki/log.md")) {
    errors.push({
      id: "companion-log",
      rule: "companion-log",
      severity: "error",
      path: "wiki/log.md",
      message: "A new source page requires an attributed ingest/update entry in wiki/log.md.",
    });
  }
  for (const source of newSources) {
    if (!currentPaths.has(source.path)) continue;
    if (!attributed.has("wiki/index.md")) {
      errors.push({
        id: `companion-index:${source.path}`,
        rule: "companion-index",
        severity: "error",
        path: "wiki/index.md",
        message: `New source ${source.path} requires an attributed wiki/index.md update.`,
      });
    }
  }
  return errors;
}

export async function reviewStop(root, sessionId, input = {}, options = {}) {
  const { state } = await ensureState(root, sessionId, options);
  const [current, currentProtected, validation] = await Promise.all([
    repositoryManifest(root),
    protectedManifest(root),
    validateWiki(root),
  ]);
  const finalDelta = diffManifests(state.baselineManifest, current);
  const protectedDelta = diffManifests(state.baselineProtected, currentProtected);
  const attributed = new Set(state.attributedPaths);
  const attributedFinal = finalDelta.filter((item) => attributed.has(item.path));
  const unattributedFinal = finalDelta.filter((item) => !attributed.has(item.path));
  const relevantDiagnostics = relevantNewDiagnostics(
    newDiagnostics(validation.diagnostics, state.baselineDiagnosticIds),
    attributedFinal.map((item) => item.path),
  );

  const errors = [
    ...protectedDelta.map((item) => ({
      id: `protected:${item.path}`,
      rule: "protected-path",
      severity: "error",
      path: item.path,
      message: `Protected path changed during the session (${item.kind}): ${item.path}`,
    })),
    ...relevantDiagnostics.filter((item) => item.severity === "error"),
    ...companionErrors(state, { current }, attributedFinal),
  ];

  if (errors.length > 0) {
    const failureDigest = hashText(JSON.stringify(errors.map((item) => item.id).sort()));
    const repeatedActiveFailure = input.stop_hook_active === true && state.lastFailureDigest === failureDigest;
    state.lastFailureDigest = failureDigest;
    await saveState(root, sessionId, state, options);
    const reason = errors.map((item) => `${item.path}: ${item.message}`).join("\n");
    if (repeatedActiveFailure) {
      return {
        allow: true,
        systemMessage: `Workflow checks remain unresolved and were not blocked again:\n${reason}`,
        errors,
      };
    }
    return { allow: false, reason, errors };
  }

  let qmdStatus = "not needed";
  const wikiChanged = attributedFinal.some((item) => item.path.startsWith("wiki/") && item.path.endsWith(".md"));
  if (wikiChanged) {
    const digest = wikiDigest(current);
    if (state.lastReindexedDigest === digest) {
      qmdStatus = "already current";
    } else {
      const runner = options.reindex ?? reindexQmd;
      try {
        await runner(root, options.qmdOptions);
        state.lastReindexedDigest = digest;
        qmdStatus = "reindexed";
      } catch (error) {
        const reason = `qmd reindex failed: ${error.message}`;
        const failureDigest = hashText(reason);
        const repeatedActiveFailure = input.stop_hook_active === true && state.lastFailureDigest === failureDigest;
        state.lastFailureDigest = failureDigest;
        await saveState(root, sessionId, state, options);
        if (repeatedActiveFailure) return { allow: true, systemMessage: reason, errors: [] };
        return { allow: false, reason, errors: [] };
      }
    }
  }

  state.lastFailureDigest = null;
  await saveState(root, sessionId, state, options);

  if (attributedFinal.length === 0) return { allow: true, silent: true, attributedFinal, unattributedFinal };
  const warnings = relevantDiagnostics.filter((item) => item.severity === "warning").length;
  const receipt = `Workflow verified: ${attributedFinal.length} session file(s) reviewed, 0 new errors, ${warnings} warning(s), qmd ${qmdStatus}.`;
  const unattributedNote = unattributedFinal.length > 0 ? ` ${unattributedFinal.length} pre-existing or unattributed final change(s) were left untouched.` : "";
  return {
    allow: true,
    systemMessage: `${receipt}${unattributedNote}`,
    attributedFinal,
    unattributedFinal,
  };
}
