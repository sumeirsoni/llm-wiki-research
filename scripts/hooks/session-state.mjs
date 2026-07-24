import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile, readdir, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { canonicalRoot, protectedManifest, repositoryManifest } from "./snapshot.mjs";
import { validateWiki } from "../wiki/validate.mjs";

function safeSessionId(value) {
  const text = String(value ?? "unknown");
  return /^[A-Za-z0-9._-]{1,160}$/.test(text) ? text : createHash("sha256").update(text).digest("hex");
}

export function stateBaseDir(options = {}) {
  return (
    options.stateRoot ??
    process.env.WIKI_WORKFLOW_STATE_ROOT ??
    path.join(process.env.XDG_CACHE_HOME ?? path.join(os.homedir(), ".cache"), "claude-code", "llm-wiki-research", "workflow-sessions")
  );
}

export async function statePath(root, sessionId, options = {}) {
  const canonical = await canonicalRoot(root);
  const repoHash = createHash("sha256").update(canonical).digest("hex").slice(0, 16);
  return path.join(stateBaseDir(options), repoHash, safeSessionId(sessionId), "state.json");
}

export async function loadState(root, sessionId, options = {}) {
  const target = await statePath(root, sessionId, options);
  try {
    return JSON.parse(await readFile(target, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

export async function saveState(root, sessionId, state, options = {}) {
  const target = await statePath(root, sessionId, options);
  await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, target);
  return target;
}

export async function ensureState(root, sessionId, options = {}) {
  const existing = await loadState(root, sessionId, options);
  if (existing) return { state: existing, created: false };

  const [baselineManifest, baselineProtected, validation] = await Promise.all([
    repositoryManifest(root),
    protectedManifest(root),
    validateWiki(root),
  ]);
  const state = {
    version: 1,
    root: await canonicalRoot(root),
    sessionId: safeSessionId(sessionId),
    createdAt: new Date().toISOString(),
    baselineManifest,
    baselineProtected,
    baselineDiagnosticIds: validation.diagnostics.map((item) => item.id),
    attributedPaths: [],
    preTools: {},
    emittedWarningIds: [],
    lastReindexedDigest: null,
    lastFailureDigest: null,
  };
  await saveState(root, sessionId, state, options);
  return { state, created: true };
}

export async function pruneStates(options = {}) {
  const base = stateBaseDir(options);
  const cutoff = Date.now() - (options.maxAgeMs ?? 14 * 24 * 60 * 60 * 1000);
  let repos;
  try {
    repos = await readdir(base, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  for (const repo of repos) {
    if (!repo.isDirectory()) continue;
    const repoPath = path.join(base, repo.name);
    const sessions = await readdir(repoPath, { withFileTypes: true });
    for (const session of sessions) {
      if (!session.isDirectory()) continue;
      const sessionPath = path.join(repoPath, session.name);
      const info = await stat(sessionPath);
      if (info.mtimeMs < cutoff) await rm(sessionPath, { recursive: true, force: true });
    }
  }
}
