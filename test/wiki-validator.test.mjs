import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateWiki } from "../scripts/wiki/validate.mjs";

async function write(root, relative, content) {
  const target = path.join(root, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content);
}

async function makeValidRepo() {
  const root = await mkdtemp(path.join(os.tmpdir(), "wiki-validator-"));
  await write(root, "package.json", "{}\n");
  await write(
    root,
    "README.md",
    "## Current State\n\n**1 sources** · **1 concepts** · **0 entities** · **0 comparisons**\n",
  );
  await write(
    root,
    "wiki/index.md",
    `---
title: "Wiki Index"
type: meta
created: 2026-01-01
updated: 2026-01-01
tags: [meta]
---

# Wiki Index

## Sources

- [[paper]] — A paper (2026)

## Concepts

- [[concept]] — A concept

## Entities

## Comparisons

## Meta
`,
  );
  await write(
    root,
    "wiki/log.md",
    `---
title: "Operation Log"
type: meta
created: 2026-01-01
updated: 2026-01-01
tags: [meta]
---

# Operation Log

## [2026-01-01] init | Test wiki

Created fixtures.
`,
  );
  await write(
    root,
    "wiki/overview.md",
    `---
title: "Overview"
type: meta
created: 2026-01-01
updated: 2026-01-01
tags: [meta]
---

# Overview

**1 sources ingested** | **1 concept pages** | **0 entity pages** | **0 comparison pages** | 2 source/concept/entity/comparison pages | 5 wiki Markdown files
`,
  );
  await write(
    root,
    "wiki/sources/paper.md",
    `---
title: "Paper"
type: source
created: 2026-01-01
updated: 2026-01-01
arxiv_id: "2601.00001"
authors: ["A. Author"]
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2601.00001"
tags: [test]
aliases: []
---

# Paper

## Summary

See [[concept]].

## Key Contributions

- One.

## Methodology

Method.

## Limitations & Open Questions

- Unknown.

## Future Work

- More work.

## Links

- [arXiv](https://arxiv.org/abs/2601.00001)
`,
  );
  await write(
    root,
    "wiki/concepts/concept.md",
    `---
title: "Concept"
type: concept
created: 2026-01-01
updated: 2026-01-01
tags: [test]
sources: ["[[paper]]"]
aliases: []
---

# Concept

Grounded in [[paper]].
`,
  );
  return root;
}

function rules(result) {
  return result.diagnostics.map((item) => item.rule);
}

test("valid fixture has no errors", async () => {
  const root = await makeValidRepo();
  const result = await validateWiki(root);
  assert.deepEqual(result.diagnostics.filter((item) => item.severity === "error"), []);
});

test("detects unclosed frontmatter", async () => {
  const root = await makeValidRepo();
  await write(root, "wiki/index.md", "---\ntitle: Broken\n# Wiki Index\n");
  const result = await validateWiki(root);
  assert.ok(rules(result).includes("frontmatter-delimiter"));
});

test("detects broken links and source section regressions", async () => {
  const root = await makeValidRepo();
  const source = await import("node:fs/promises").then(({ readFile }) =>
    readFile(path.join(root, "wiki/sources/paper.md"), "utf8"),
  );
  await write(
    root,
    "wiki/sources/paper.md",
    source
      .replace("[[concept]]", "[[missing-page]]")
      .replace("## Limitations & Open Questions", "## Limitations"),
  );
  const result = await validateWiki(root);
  assert.ok(rules(result).includes("wikilink-broken"));
  assert.ok(rules(result).includes("source-section"));
});

test("detects stale counts and missing index entries", async () => {
  const root = await makeValidRepo();
  await write(root, "README.md", "**0 sources** · **0 concepts** · **0 entities** · **0 comparisons**\n");
  const index = await import("node:fs/promises").then(({ readFile }) =>
    readFile(path.join(root, "wiki/index.md"), "utf8"),
  );
  await write(root, "wiki/index.md", index.replace("- [[concept]] — A concept\n", ""));
  const result = await validateWiki(root);
  assert.ok(rules(result).includes("readme-counts"));
  assert.ok(rules(result).includes("index-missing"));
});

test("allows a web source without paper metadata", async () => {
  const root = await makeValidRepo();
  const sourcePath = path.join(root, "wiki/sources/paper.md");
  const source = await import("node:fs/promises").then(({ readFile }) => readFile(sourcePath, "utf8"));
  await write(
    root,
    "wiki/sources/paper.md",
    source
      .replace('arxiv_id: "2601.00001"\n', "")
      .replace('pdf_path: "https://arxiv.org/pdf/2601.00001"\n', 'project_url: "https://example.com/model"\n'),
  );
  const result = await validateWiki(root);
  assert.equal(result.diagnostics.some((item) => item.rule === "arxiv-id-missing"), false);
});
