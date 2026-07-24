import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { parse } from "yaml";
import { configureQmd } from "../scripts/qmd/configure.mjs";
import { reindexQmd } from "../scripts/qmd/reindex.mjs";

test("qmd configuration uses the active clone path and is idempotent", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "qmd-config-"));
  await mkdir(path.join(root, "wiki"));
  await writeFile(path.join(root, "package.json"), "{}\n");

  const first = await configureQmd(root);
  const second = await configureQmd(root);
  const config = parse(await readFile(first.target, "utf8"));

  assert.equal(first.changed, true);
  assert.equal(second.changed, false);
  assert.equal(config.collections.wiki.path, path.join(root, "wiki"));
  assert.equal(config.collections.wiki.pattern, "**/*.md");
});

test("qmd reindex runs update then embed", async () => {
  const calls = [];
  await reindexQmd("/tmp/repo", {
    executable: "/tmp/qmd",
    runner: async (command, args, options) => calls.push({ command, args, cwd: options.cwd }),
  });
  assert.deepEqual(calls, [
    { command: "/tmp/qmd", args: ["update"], cwd: "/tmp/repo" },
    { command: "/tmp/qmd", args: ["embed"], cwd: "/tmp/repo" },
  ]);
});

test("qmd reindex stops after update failure", async () => {
  const calls = [];
  await assert.rejects(
    reindexQmd("/tmp/repo", {
      executable: "/tmp/qmd",
      runner: async (_command, args) => {
        calls.push(args[0]);
        throw new Error("update failed");
      },
    }),
    /update failed/,
  );
  assert.deepEqual(calls, ["update"]);
});
