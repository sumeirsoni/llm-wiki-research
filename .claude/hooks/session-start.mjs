#!/usr/bin/env node
import { contextOutput, readHookInput, writeHookOutput } from "../../scripts/hooks/hook-io.mjs";
import { ensureState, pruneStates } from "../../scripts/hooks/session-state.mjs";
import { findRepoRoot } from "../../scripts/wiki/discover.mjs";

try {
  const input = await readHookInput();
  const root = await findRepoRoot(process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd());
  const sessionId = input.session_id ?? "unknown";
  const { created } = await ensureState(root, sessionId);
  await pruneStates();
  if (created) {
    writeHookOutput(
      contextOutput(
        "SessionStart",
        "Workflow baseline captured. Pre-existing changes and validation debt are preserved; only new regressions introduced in this session will block completion.",
      ),
    );
  } else {
    writeHookOutput({});
  }
} catch (error) {
  writeHookOutput({ systemMessage: `Workflow baseline could not be captured: ${error.message}` });
}
