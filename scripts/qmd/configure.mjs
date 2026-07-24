#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stringify } from "yaml";
import { findRepoRoot } from "../wiki/discover.mjs";
import { reindexQmd } from "./reindex.mjs";

export function qmdConfig(root) {
  return {
    collections: {
      wiki: {
        path: path.join(root, "wiki"),
        pattern: "**/*.md",
        context: {
          sources: "Paper summaries — one page per ingested source",
          concepts: "Concept and topic pages synthesizing ideas across papers",
          entities: "Researchers, models, datasets, and organizations",
          comparisons: "Filed comparison analyses and tables",
          meta: "Reading lists, open questions, and knowledge gaps",
        },
      },
    },
    models: {
      embed: "hf:ggml-org/embeddinggemma-300M-GGUF/embeddinggemma-300M-Q8_0.gguf",
      generate: "hf:tobil/qmd-query-expansion-1.7B-gguf/qmd-query-expansion-1.7B-q4_k_m.gguf",
      rerank: "hf:ggml-org/Qwen3-Reranker-0.6B-Q8_0-GGUF/qwen3-reranker-0.6b-q8_0.gguf",
    },
    global_context: "ML research wiki covering self-supervised learning, world models, post-training, reasoning, and representation geometry",
  };
}

export async function configureQmd(root) {
  const directory = path.join(root, ".qmd");
  const target = path.join(directory, "index.yml");
  await mkdir(directory, { recursive: true });
  const content = stringify(qmdConfig(root), { lineWidth: 0 });
  let existing = null;
  try {
    existing = await readFile(target, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (existing !== content) await writeFile(target, content);
  return { target, changed: existing !== content };
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    const rootArg = process.argv.find((arg) => arg.startsWith("--root="));
    const root = await findRepoRoot(rootArg ? rootArg.slice("--root=".length) : process.cwd());
    const result = await configureQmd(root);
    process.stdout.write(`${result.changed ? "Updated" : "Verified"} ${result.target}\n`);
    if (process.argv.includes("--reindex")) await reindexQmd(root);
  } catch (error) {
    process.stderr.write(`qmd setup failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
