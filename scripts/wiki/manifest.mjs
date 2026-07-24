import { readFile } from "node:fs/promises";
import path from "node:path";
import { categoryCounts, contentPages } from "./discover.mjs";
import { diagnostic } from "./diagnostics.mjs";

const INDEX_SECTIONS = new Map([
  ["Sources", "sources"],
  ["Concepts", "concepts"],
  ["Entities", "entities"],
  ["Comparisons", "comparisons"],
  ["Meta", "meta"],
]);

function parseIndex(body) {
  const entries = [];
  const diagnostics = [];
  const lines = body.split(/\r?\n/);
  let section = null;

  lines.forEach((line, index) => {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      section = INDEX_SECTIONS.get(heading[1]) ?? null;
      return;
    }
    const entry = line.match(/^-\s+\[\[([^\]|#]+)(?:\|[^\]]+)?\]\]\s+—\s+(.+)$/);
    if (entry && section) {
      entries.push({ section, target: entry[1].trim().replace(/\.md$/i, ""), summary: entry[2].trim(), line: index + 1 });
    }
  });
  return { entries, diagnostics };
}

function validateDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export async function validateManifest(root, pages) {
  const diagnostics = [];
  const byPath = new Map(pages.map((page) => [page.file.relative, page]));
  const indexPage = byPath.get("wiki/index.md");
  const expected = contentPages(pages.map((page) => page.file));

  if (indexPage?.parsed.data) {
    const { entries } = parseIndex(indexPage.parsed.body);
    const seen = new Map();
    for (const entry of entries) {
      const key = `${entry.section}/${entry.target}`;
      seen.set(key, (seen.get(key) ?? 0) + 1);
      const target = expected.find((file) => file.stem === entry.target);
      if (!target) {
        diagnostics.push(diagnostic("index-stale", "error", "wiki/index.md", `Index entry points to a missing content page: [[${entry.target}]]`, { line: entry.line, key: entry.target }));
      } else if (target.directory !== entry.section) {
        diagnostics.push(diagnostic("index-category", "error", "wiki/index.md", `[[${entry.target}]] is under '${entry.section}' but belongs under '${target.directory}'.`, { line: entry.line, key: entry.target }));
      }
    }
    for (const file of expected) {
      const key = `${file.directory}/${file.stem}`;
      const count = seen.get(key) ?? 0;
      if (count === 0) {
        diagnostics.push(diagnostic("index-missing", "error", "wiki/index.md", `Content page is missing from the index: ${file.relative}`, { key: file.relative }));
      } else if (count > 1) {
        diagnostics.push(diagnostic("index-duplicate", "error", "wiki/index.md", `Content page appears ${count} times in its index section: ${file.relative}`, { key: file.relative }));
      }
    }
  }

  const files = pages.map((page) => page.file);
  const counts = categoryCounts(files);
  const fourCategoryTotal = counts.sources + counts.concepts + counts.entities + counts.comparisons;
  const markdownTotal = files.length;

  const readmePath = path.join(root, "README.md");
  const readme = await readFile(readmePath, "utf8");
  const readmeMatch = readme.match(/\*\*(\d+) sources\*\*\s*[·|]\s*\*\*(\d+) concepts\*\*\s*[·|]\s*\*\*(\d+) entities\*\*\s*[·|]\s*\*\*(\d+) comparisons\*\*/);
  if (!readmeMatch || readmeMatch.slice(1).map(Number).join(",") !== [counts.sources, counts.concepts, counts.entities, counts.comparisons].join(",")) {
    diagnostics.push(
      diagnostic(
        "readme-counts",
        "error",
        "README.md",
        `Current State must report ${counts.sources} sources, ${counts.concepts} concepts, ${counts.entities} entities, and ${counts.comparisons} comparisons.`,
        { key: "current-state" },
      ),
    );
  }

  const overviewPage = byPath.get("wiki/overview.md");
  if (overviewPage) {
    const overviewCounts = overviewPage.file.content.match(/\*\*(\d+) sources ingested\*\*\s*\|\s*\*\*(\d+) concept pages\*\*\s*\|\s*\*\*(\d+) entity pages\*\*\s*\|\s*\*\*(\d+) comparison pages\*\*/);
    if (!overviewCounts || overviewCounts.slice(1).map(Number).join(",") !== [counts.sources, counts.concepts, counts.entities, counts.comparisons].join(",")) {
      diagnostics.push(diagnostic("overview-counts", "error", "wiki/overview.md", "Overview category counts do not match the wiki filesystem.", { key: "categories" }));
    }
    const fourTotalMatch = overviewPage.file.content.match(/\b(\d+) source\/concept\/entity\/comparison pages\b/);
    if (!fourTotalMatch || Number(fourTotalMatch[1]) !== fourCategoryTotal) {
      diagnostics.push(diagnostic("overview-counts", "error", "wiki/overview.md", `Overview must report ${fourCategoryTotal} source/concept/entity/comparison pages.`, { key: "four-total" }));
    }
    const markdownTotalMatch = overviewPage.file.content.match(/\b(\d+) wiki Markdown files\b/);
    if (markdownTotalMatch && Number(markdownTotalMatch[1]) !== markdownTotal) {
      diagnostics.push(diagnostic("overview-counts", "error", "wiki/overview.md", `Overview total must report ${markdownTotal} wiki Markdown files.`, { key: "markdown-total" }));
    }
  }

  const logPage = byPath.get("wiki/log.md");
  if (logPage?.parsed.data) {
    const entries = [];
    const lines = logPage.parsed.body.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      if (!lines[index].startsWith("## ")) continue;
      const match = lines[index].match(/^## \[(\d{4}-\d{2}-\d{2})\] ([a-z][a-z0-9-]*) \| (.+)$/);
      if (!match) {
        diagnostics.push(diagnostic("log-heading", "error", "wiki/log.md", `Invalid operation-log heading: ${lines[index]}`, { line: logPage.parsed.bodyLine + index, key: lines[index] }));
        continue;
      }
      entries.push({ date: match[1], operation: match[2], subject: match[3], line: logPage.parsed.bodyLine + index });
      if (!validateDate(match[1])) {
        diagnostics.push(diagnostic("log-date", "error", "wiki/log.md", `Invalid calendar date in log heading: ${match[1]}`, { line: logPage.parsed.bodyLine + index, key: match[1] }));
      }
    }
    for (let index = 1; index < entries.length; index += 1) {
      if (entries[index].date < entries[index - 1].date) {
        diagnostics.push(diagnostic("log-order", "error", "wiki/log.md", "Operation-log dates must be monotonic oldest-to-newest.", { line: entries[index].line, key: `${entries[index - 1].date}:${entries[index].date}` }));
      }
    }
    if (entries.length > 0 && logPage.parsed.data.updated !== entries.at(-1).date) {
      diagnostics.push(diagnostic("log-updated", "error", "wiki/log.md", `Frontmatter 'updated' must equal the last log date (${entries.at(-1).date}).`, { key: "updated" }));
    }
  }

  return diagnostics;
}
