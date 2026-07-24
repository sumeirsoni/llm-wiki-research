import { diagnostic } from "./diagnostics.mjs";

export function scanHeadings(parsed) {
  const headings = [];
  const lines = parsed.body.split(/\r?\n/);
  let fence = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      fence = fence === marker ? null : fence ?? marker;
      continue;
    }
    if (fence) continue;
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (match) {
      headings.push({
        level: match[1].length,
        title: match[2].trim(),
        line: parsed.bodyLine + index,
      });
    }
  }
  return headings;
}

export function validateMarkdown(file, parsed) {
  if (!parsed.data) return [];
  const diagnostics = [];
  const headings = scanHeadings(parsed);
  const h1s = headings.filter((heading) => heading.level === 1);

  if (h1s.length !== 1) {
    diagnostics.push(
      diagnostic("page-h1", "error", file.relative, `Expected exactly one H1 heading, found ${h1s.length}.`, {
        key: `count:${h1s.length}`,
      }),
    );
  } else if (h1s[0].title !== parsed.data.title) {
    diagnostics.push(
      diagnostic("page-title", "error", file.relative, `H1 '${h1s[0].title}' does not match frontmatter title '${parsed.data.title}'.`, {
        line: h1s[0].line,
        key: parsed.data.title,
      }),
    );
  }

  if (file.directory === "sources") {
    const h2s = headings.filter((heading) => heading.level === 2);
    const requiredStart = ["Summary", "Key Contributions", "Methodology"];
    let lastIndex = -1;
    for (const title of requiredStart) {
      const index = h2s.findIndex((heading) => heading.title === title);
      if (index === -1) {
        diagnostics.push(diagnostic("source-section", "error", file.relative, `Missing required source section '## ${title}'.`, { key: title }));
      } else if (index <= lastIndex) {
        diagnostics.push(diagnostic("source-section-order", "error", file.relative, `'## ${title}' is out of order.`, { key: title }));
      }
      lastIndex = Math.max(lastIndex, index);
    }

    const tail = ["Limitations & Open Questions", "Future Work", "Links"];
    const tailIndexes = tail.map((title) => h2s.findIndex((heading) => heading.title === title));
    tail.forEach((title, index) => {
      if (tailIndexes[index] === -1) {
        diagnostics.push(diagnostic("source-section", "error", file.relative, `Missing required source section '## ${title}'.`, { key: title }));
      }
    });
    if (tailIndexes.every((index) => index >= 0)) {
      if (!(tailIndexes[0] < tailIndexes[1] && tailIndexes[1] < tailIndexes[2])) {
        diagnostics.push(
          diagnostic(
            "source-section-order",
            "error",
            file.relative,
            "The required source tail must be Limitations & Open Questions, Future Work, then Links.",
            { key: "canonical-tail" },
          ),
        );
      }
      if (tailIndexes[2] !== h2s.length - 1) {
        diagnostics.push(diagnostic("source-links-last", "error", file.relative, "'## Links' must be the final H2 section.", { key: "links-last" }));
      }
    }
  }

  return diagnostics;
}
