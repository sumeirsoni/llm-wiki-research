#!/usr/bin/env node
import { denyPreToolUse, readHookInput, writeHookOutput } from "../../scripts/hooks/hook-io.mjs";
import { bashPolicyReason, protectedPathReason, relativeToolPath } from "../../scripts/hooks/policy.mjs";
import { recordPreTool } from "../../scripts/hooks/session-review.mjs";
import { findRepoRoot } from "../../scripts/wiki/discover.mjs";

try {
  const input = await readHookInput();
  const root = await findRepoRoot(process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd());
  const relative = relativeToolPath(root, input.tool_input);
  const reason =
    protectedPathReason(relative) ??
    (input.tool_name === "Bash" ? bashPolicyReason(input.tool_input?.command) : null);

  if (reason) {
    writeHookOutput(denyPreToolUse(reason));
  } else {
    await recordPreTool(root, input.session_id ?? "unknown", input);
    writeHookOutput({});
  }
} catch (error) {
  writeHookOutput(denyPreToolUse(`Workflow safety check failed: ${error.message}`));
}
