import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { ensureState, loadState } from "../scripts/hooks/session-state.mjs";

async function makeRepo() {
  const root = await mkdtemp(path.join(os.tmpdir(), "workflow-state-repo-"));
  await mkdir(path.join(root, "wiki"), { recursive: true });
  await writeFile(path.join(root, "package.json"), "{}\n");
  await writeFile(path.join(root, "README.md"), "**0 sources** · **0 concepts** · **0 entities** · **0 comparisons**\n");
  const rootPage = (title, body) => `---\ntitle: "${title}"\ntype: meta\ncreated: 2026-01-01\nupdated: 2026-01-01\ntags: [meta]\n---\n\n# ${title}\n\n${body}\n`;
  await writeFile(path.join(root, "wiki/index.md"), rootPage("Wiki Index", "## Sources\n\n## Concepts\n\n## Entities\n\n## Comparisons\n\n## Meta"));
  await writeFile(path.join(root, "wiki/overview.md"), rootPage("Overview", "**0 sources ingested** | **0 concept pages** | **0 entity pages** | **0 comparison pages** | 0 source/concept/entity/comparison pages | 3 wiki Markdown files"));
  await writeFile(path.join(root, "wiki/log.md"), rootPage("Operation Log", "## [2026-01-01] init | Fixture\n\nCreated."));
  return root;
}

test("session baseline is created once and preserved", async () => {
  const root = await makeRepo();
  const stateRoot = await mkdtemp(path.join(os.tmpdir(), "workflow-state-cache-"));
  const first = await ensureState(root, "session-a", { stateRoot });
  await writeFile(path.join(root, "README.md"), "changed\n");
  const second = await ensureState(root, "session-a", { stateRoot });
  const stored = await loadState(root, "session-a", { stateRoot });

  assert.equal(first.created, true);
  assert.equal(second.created, false);
  assert.deepEqual(second.state.baselineManifest, first.state.baselineManifest);
  assert.deepEqual(stored.baselineManifest, first.state.baselineManifest);
});

test("different session IDs receive independent baselines", async () => {
  const root = await makeRepo();
  const stateRoot = await mkdtemp(path.join(os.tmpdir(), "workflow-state-cache-"));
  const first = await ensureState(root, "session-a", { stateRoot });
  await writeFile(path.join(root, "README.md"), "changed\n");
  const second = await ensureState(root, "session-b", { stateRoot });
  assert.notDeepEqual(second.state.baselineManifest, first.state.baselineManifest);
});
