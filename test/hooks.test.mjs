import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { bashPolicyReason, protectedPathReason } from "../scripts/hooks/policy.mjs";
import { recordPostTool, recordPreTool, reviewStop } from "../scripts/hooks/session-review.mjs";
import { ensureState } from "../scripts/hooks/session-state.mjs";

async function write(root, relative, content) {
  const target = path.join(root, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
}

async function makeRepo() {
  const root = await mkdtemp(path.join(os.tmpdir(), "workflow-hooks-repo-"));
  await write(root, "package.json", "{}\n");
  await write(root, "README.md", "**0 sources** · **1 concepts** · **0 entities** · **0 comparisons**\n");
  const rootPage = (title, body) => `---\ntitle: "${title}"\ntype: meta\ncreated: 2026-01-01\nupdated: 2026-01-01\ntags: [meta]\n---\n\n# ${title}\n\n${body}\n`;
  await write(root, "wiki/index.md", rootPage("Wiki Index", "## Sources\n\n## Concepts\n\n- [[concept]] — Test concept\n\n## Entities\n\n## Comparisons\n\n## Meta"));
  await write(root, "wiki/overview.md", rootPage("Overview", "**0 sources ingested** | **1 concept pages** | **0 entity pages** | **0 comparison pages** | 1 source/concept/entity/comparison pages | 4 wiki Markdown files"));
  await write(root, "wiki/log.md", rootPage("Operation Log", "## [2026-01-01] init | Fixture\n\nCreated."));
  await write(root, "wiki/concepts/concept.md", `---\ntitle: "Concept"\ntype: concept\ncreated: 2026-01-01\nupdated: 2026-01-01\ntags: [test]\nsources: []\naliases: []\n---\n\n# Concept\n\nInitial text.\n`);
  await write(root, "raw/source.txt", "immutable\n");
  return root;
}

test("policy protects source, local settings, generated state, and destructive Git", () => {
  assert.match(protectedPathReason("raw/paper.pdf"), /immutable/);
  assert.match(protectedPathReason("seed-papers/paper.pdf"), /immutable/);
  assert.match(protectedPathReason(".claude/settings.local.json"), /user-owned/);
  assert.match(protectedPathReason(".qmd/index.yml"), /generated/);
  assert.match(protectedPathReason(".qmd/index.sqlite-wal"), /generated/);
  assert.match(bashPolicyReason("git reset --hard HEAD"), /discard/);
  assert.match(bashPolicyReason("git clean -fd"), /discard/);
  assert.equal(bashPolicyReason("git status --short"), null);
});

test("post-tool validation reports a new regression", async () => {
  const root = await makeRepo();
  const stateRoot = await mkdtemp(path.join(os.tmpdir(), "workflow-hooks-cache-"));
  const input = { tool_name: "Edit", tool_use_id: "tool-1" };
  await recordPreTool(root, "session", input, { stateRoot });
  const target = path.join(root, "wiki/concepts/concept.md");
  const original = await readFile(target, "utf8");
  await writeFile(target, original.replace("# Concept", "# Wrong title"));
  const result = await recordPostTool(root, "session", input, { stateRoot, explicitPath: "wiki/concepts/concept.md" });
  assert.ok(result.errors.some((item) => item.rule === "page-title"));
});

test("reverted edit disappears from the attributed final delta", async () => {
  const root = await makeRepo();
  const stateRoot = await mkdtemp(path.join(os.tmpdir(), "workflow-hooks-cache-"));
  const input = { tool_name: "Edit", tool_use_id: "tool-2" };
  const target = path.join(root, "wiki/concepts/concept.md");
  const original = await readFile(target, "utf8");
  await recordPreTool(root, "session", input, { stateRoot });
  await writeFile(target, `${original}\nTemporary.\n`);
  await writeFile(target, original);
  await recordPostTool(root, "session", input, { stateRoot, explicitPath: "wiki/concepts/concept.md" });
  const result = await reviewStop(root, "session", {}, { stateRoot, reindex: async () => assert.fail("qmd should not run") });
  assert.equal(result.silent, true);
});

test("valid wiki change reindexes exactly once per final digest", async () => {
  const root = await makeRepo();
  const stateRoot = await mkdtemp(path.join(os.tmpdir(), "workflow-hooks-cache-"));
  const input = { tool_name: "Edit", tool_use_id: "tool-3" };
  const target = path.join(root, "wiki/concepts/concept.md");
  const original = await readFile(target, "utf8");
  await recordPreTool(root, "session", input, { stateRoot });
  await writeFile(target, original.replace("Initial text.", "Initial text.\n\nVerified addition."));
  const post = await recordPostTool(root, "session", input, { stateRoot, explicitPath: "wiki/concepts/concept.md" });
  assert.equal(post.errors.length, 0);

  let calls = 0;
  const reindex = async () => {
    calls += 1;
  };
  const first = await reviewStop(root, "session", {}, { stateRoot, reindex });
  const second = await reviewStop(root, "session", {}, { stateRoot, reindex });
  assert.equal(first.allow, true);
  assert.equal(second.allow, true);
  assert.equal(calls, 1);
});

test("indirect protected-path changes block at Stop", async () => {
  const root = await makeRepo();
  const stateRoot = await mkdtemp(path.join(os.tmpdir(), "workflow-hooks-cache-"));
  await ensureState(root, "session", { stateRoot });
  await writeFile(path.join(root, "raw/source.txt"), "changed\n");
  const result = await reviewStop(root, "session", {}, { stateRoot, reindex: async () => {} });
  assert.equal(result.allow, false);
  assert.match(result.reason, /Protected path changed/);
});
