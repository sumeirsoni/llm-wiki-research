#!/usr/bin/env node
import { blockOutput, readHookInput, writeHookOutput } from "../../scripts/hooks/hook-io.mjs";
import { reviewStop } from "../../scripts/hooks/session-review.mjs";
import { findRepoRoot } from "../../scripts/wiki/discover.mjs";

try {
  const input = await readHookInput();
  const root = await findRepoRoot(process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd());
  const result = await reviewStop(root, input.session_id ?? "unknown", input);
  if (!result.allow) {
    writeHookOutput(blockOutput(result.reason));
  } else if (result.systemMessage) {
    writeHookOutput({ systemMessage: result.systemMessage });
  } else {
    writeHookOutput({});
  }
} catch (error) {
  writeHookOutput(blockOutput(`Final workflow review failed: ${error.message}`));
}
