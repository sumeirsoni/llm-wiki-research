import path from "node:path";

const GENERATED_PATTERNS = [
  /^\.qmd\/index\.yml$/,
  /^\.qmd\/index\.sqlite(?:-shm|-wal)?$/,
  /^\.obsidian\/(?:graph|workspace)\.json$/,
];

export function relativeToolPath(root, toolInput = {}) {
  const value = toolInput.file_path ?? toolInput.notebook_path ?? toolInput.path;
  if (typeof value !== "string" || !value.trim()) return null;
  const absolute = path.resolve(root, value);
  const relative = path.relative(root, absolute).split(path.sep).join("/");
  if (relative.startsWith("../") || relative === "..") return null;
  return relative;
}

export function protectedPathReason(relative) {
  if (!relative) return null;
  if (relative === "raw" || relative.startsWith("raw/")) return "raw/ contains immutable source documents.";
  if (relative === "seed-papers" || relative.startsWith("seed-papers/")) return "seed-papers/ contains immutable source documents.";
  if (relative === ".claude/settings.local.json") return ".claude/settings.local.json is user-owned local configuration.";
  if (GENERATED_PATTERNS.some((pattern) => pattern.test(relative))) return `${relative} is generated or per-user application state.`;
  return null;
}

export function bashPolicyReason(command) {
  if (typeof command !== "string") return null;
  const destructiveGit = [
    /(?:^|[;&|]\s*)git\s+reset\s+--hard\b/,
    /(?:^|[;&|]\s*)git\s+clean\b/,
    /(?:^|[;&|]\s*)git\s+restore\b/,
    /(?:^|[;&|]\s*)git\s+checkout\s+--\b/,
    /(?:^|[;&|]\s*)git\s+stash\b/,
  ];
  if (destructiveGit.some((pattern) => pattern.test(command))) {
    return "This command could discard or hide the pre-existing dirty working tree.";
  }

  const protectedMutation = [
    /(?:>|>>|tee\s+|rm\s+|mv\s+|cp\s+|install\s+)[^\n;&|]*(?:raw|seed-papers)\//,
    /(?:>|>>|tee\s+|rm\s+|mv\s+|cp\s+)[^\n;&|]*\.claude\/settings\.local\.json/,
  ];
  if (protectedMutation.some((pattern) => pattern.test(command))) {
    return "This command appears to mutate a protected project path.";
  }
  return null;
}
