import { readdir, readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

export const CONTENT_DIRS = ["sources", "concepts", "entities", "comparisons", "meta"];
export const ROOT_WIKI_PAGES = new Set(["wiki/index.md", "wiki/log.md", "wiki/overview.md"]);

async function walkMarkdown(directory) {
  const results = [];
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return results;
    throw error;
  }

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkMarkdown(absolute)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(absolute);
    }
  }
  return results;
}

export async function findRepoRoot(start = process.cwd()) {
  let current = await realpath(start);
  while (true) {
    try {
      const packageInfo = await stat(path.join(current, "package.json"));
      const wikiInfo = await stat(path.join(current, "wiki"));
      if (packageInfo.isFile() && wikiInfo.isDirectory()) return current;
    } catch {
      // Continue toward the filesystem root.
    }
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(`Could not find repository root from ${start}`);
    }
    current = parent;
  }
}

export function relativePath(root, absolute) {
  return path.relative(root, absolute).split(path.sep).join("/");
}

export async function discoverWiki(root) {
  const wikiRoot = path.join(root, "wiki");
  const files = (await walkMarkdown(wikiRoot)).sort();
  return Promise.all(
    files.map(async (absolutePath) => {
      const relative = relativePath(root, absolutePath);
      const content = await readFile(absolutePath, "utf8");
      const stem = path.basename(absolutePath, ".md");
      const parts = relative.split("/");
      const directory = parts.length > 2 ? parts[1] : null;
      return {
        absolutePath,
        relative,
        content,
        stem,
        directory,
        isRootPage: ROOT_WIKI_PAGES.has(relative),
      };
    }),
  );
}

export function contentPages(files) {
  return files.filter((file) => CONTENT_DIRS.includes(file.directory));
}

export function categoryCounts(files) {
  const counts = Object.fromEntries(CONTENT_DIRS.map((name) => [name, 0]));
  for (const file of contentPages(files)) counts[file.directory] += 1;
  return counts;
}
