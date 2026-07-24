#!/usr/bin/env node
import { findRepoRoot } from "./discover.mjs";
import { formatDiagnostics, summarizeDiagnostics } from "./diagnostics.mjs";
import { validateWiki } from "./validate.mjs";

function parseArgs(argv) {
  const args = { command: "validate", format: "text" };
  for (const value of argv) {
    if (value === "validate") args.command = value;
    else if (value === "--format=json" || value === "--json") args.format = "json";
    else if (value.startsWith("--root=")) args.root = value.slice("--root=".length);
    else throw new Error(`Unknown argument: ${value}`);
  }
  return args;
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.command !== "validate") throw new Error(`Unknown command: ${args.command}`);
  const root = await findRepoRoot(args.root ?? process.cwd());
  const result = await validateWiki(root);
  const summary = summarizeDiagnostics(result.diagnostics);

  if (args.format === "json") {
    process.stdout.write(`${JSON.stringify({ root, summary, diagnostics: result.diagnostics }, null, 2)}\n`);
  } else {
    process.stdout.write(`${formatDiagnostics(result.diagnostics, root)}\n`);
  }
  process.exitCode = summary.error > 0 ? 1 : 0;
} catch (error) {
  process.stderr.write(`Wiki validator failed: ${error.stack ?? error.message}\n`);
  process.exitCode = 2;
}
