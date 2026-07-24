---
paths:
  - "wiki/**/*.md"
---

# Wiki content rule

Before editing wiki content, read the relevant schema and workflow in `AGENTS.md`.

- Preserve valid YAML frontmatter, the page-type schema, the matching H1, and Obsidian wikilinks.
- Source pages must preserve the canonical section structure defined in `AGENTS.md`.
- New content pages require `wiki/index.md`; new source pages also require `wiki/log.md`.
- Decide explicitly whether a broad ingest changes `wiki/overview.md`; do not update it mechanically.
- Run `npm run wiki:validate` when working outside Claude Code hooks or when troubleshooting them.
- Never modify immutable source documents to make a wiki reference pass validation.
