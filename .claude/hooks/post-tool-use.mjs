#!/usr/bin/env node
import { blockOutput, contextOutput, readHookInput, writeHookOutput } from "../../scripts/hooks/hook-io.mjs";
import { relativeToolPath } from "../../scripts/hooks/policy.mjs";
import { recordPostTool } from "../../scripts/hooks/session-review.mjs";
import { findRepoRoot } from "../../scripts/wiki/discover.mjs";

try {
  const input = await readHookInput();
  const root = await findRepoRoot(process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd());
  const result = await recordPostTool(root, input.session_id ?? "unknown", input, {
    explicitPath: relativeToolPath(root, input.tool_input),
  });

  if (result.errors.length > 0) {
    const reason = result.errors.map((item) => `${item.path}: ${item.message}`).join("\n");
    writeHookOutput(blockOutput(reason));
  } else if (result.warnings.length > 0) {
    const warning = result.warnings.map((item) => `${item.path}: ${item.message}`).join("\n");
    writeHookOutput(contextOutput("PostToolUse", `New workflow warning(s):\n${warning}`));
  } else {
    writeHookOutput({});
  }
} catch (error) {
  writeHookOutput(blockOutput(`Post-change workflow validation failed: ${error.message}`));
}
