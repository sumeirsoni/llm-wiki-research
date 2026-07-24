import { createHash } from "node:crypto";
import { readdir, readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";

const EXCLUDED_DIRS = new Set([".git", "node_modules", ".tmp", ".qmd"]);
const ROOT_FILES = new Set([
  ".gitignore",
  "AGENTS.md",
  "CLAUDE.md",
  "README.md",
  "package.json",
  "package-lock.json",
]);
const INCLUDED_ROOT_DIRS = new Set(["wiki", "scripts", "test", ".claude", ".github"]);

export function hashText(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function hashFile(absolute) {
  return createHash("sha256").update(await readFile(absolute)).digest("hex");
}

async function walk(root, directory, manifest, options = {}) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    if (entry.name === ".DS_Store") continue;
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(root, absolute).split(path.sep).join("/");
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      if (relative === ".obsidian/plugins") continue;
      await walk(root, absolute, manifest, options);
    } else if (entry.isFile()) {
      if (options.metadataOnly) {
        const info = await stat(absolute);
        manifest[relative] = `${info.size}:${Math.trunc(info.mtimeMs)}`;
      } else {
        manifest[relative] = await hashFile(absolute);
      }
    }
  }
}

export async function repositoryManifest(root) {
  const manifest = {};
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory() && INCLUDED_ROOT_DIRS.has(entry.name)) {
      await walk(root, absolute, manifest);
    } else if (entry.isFile() && ROOT_FILES.has(entry.name)) {
      manifest[entry.name] = await hashFile(absolute);
    }
  }
  return manifest;
}

export async function protectedManifest(root) {
  const manifest = {};
  for (const relative of ["raw", "seed-papers"]) {
    await walk(root, path.join(root, relative), manifest);
  }
  for (const relative of [".claude/settings.local.json"]) {
    try {
      manifest[relative] = await hashFile(path.join(root, relative));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  return manifest;
}

export function diffManifests(before, after) {
  const paths = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changes = [];
  for (const relative of [...paths].sort()) {
    if (before[relative] === after[relative]) continue;
    const kind = !(relative in before) ? "added" : !(relative in after) ? "deleted" : "modified";
    changes.push({ path: relative, kind, before: before[relative], after: after[relative] });
  }
  return changes;
}

export function wikiDigest(manifest) {
  const entries = Object.entries(manifest)
    .filter(([relative]) => relative.startsWith("wiki/") && relative.endsWith(".md"))
    .sort(([a], [b]) => a.localeCompare(b));
  return hashText(JSON.stringify(entries));
}

export async function canonicalRoot(root) {
  return realpath(root);
}
