import { createHash } from "node:crypto";

export function diagnostic(rule, severity, path, message, options = {}) {
  const key = options.key ?? message;
  const id = createHash("sha256")
    .update(`${rule}\0${path}\0${key}`)
    .digest("hex")
    .slice(0, 16);

  return {
    id,
    rule,
    severity,
    path,
    line: options.line,
    message,
    help: options.help,
  };
}

export function sortDiagnostics(items) {
  const rank = { error: 0, warning: 1 };
  return [...items].sort(
    (a, b) =>
      rank[a.severity] - rank[b.severity] ||
      a.path.localeCompare(b.path) ||
      (a.line ?? 0) - (b.line ?? 0) ||
      a.rule.localeCompare(b.rule),
  );
}

export function summarizeDiagnostics(items) {
  return items.reduce(
    (summary, item) => {
      summary[item.severity] += 1;
      return summary;
    },
    { error: 0, warning: 0 },
  );
}

export function formatDiagnostics(items, root) {
  if (items.length === 0) {
    return "Wiki validation passed: 0 errors, 0 warnings.";
  }

  const lines = items.map((item) => {
    const location = item.line ? `${item.path}:${item.line}` : item.path;
    const help = item.help ? `\n    ${item.help}` : "";
    return `${item.severity.toUpperCase()} ${item.rule} ${location}\n    ${item.message}${help}`;
  });
  const summary = summarizeDiagnostics(items);
  lines.push(
    `\nWiki validation: ${summary.error} error(s), ${summary.warning} warning(s) in ${root}.`,
  );
  return lines.join("\n");
}

export function newDiagnostics(current, baselineIds) {
  const baseline = new Set(baselineIds);
  return current.filter((item) => !baseline.has(item.id));
}
