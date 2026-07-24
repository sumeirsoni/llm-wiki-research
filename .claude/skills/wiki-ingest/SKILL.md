---
name: wiki-ingest
description: Ingest a paper or research source into the wiki with grounded claims, cross-links, bookkeeping, and validation. Use when adding a new source page or integrating a paper.
argument-hint: "<paper URL, PDF path, or title>"
---

Read `AGENTS.md` sections **Page Format Conventions**, **Workflows → Ingest**, **Index Format**, and **Log Format** before editing.

Acceptance criteria:

1. Ground claims in the primary source; distinguish author-stated future work from inference.
2. Create/update the source and warranted concept/entity pages with reciprocal wikilinks.
3. Update `wiki/index.md` for every new content page.
4. Append an ingest/update entry to `wiki/log.md` with a `Verification:` line.
5. State whether `wiki/overview.md` needs synthesis changes and why.
6. Run `npm run wiki:validate`; when hooks are active, also let the final Stop review and qmd reindex complete.
7. Report exact files changed, validation result, qmd result, and caveats.
