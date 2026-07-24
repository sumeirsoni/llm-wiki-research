---
name: wiki-query
description: Answer a research question from the local wiki using qmd-first retrieval and wikilink-grounded synthesis. Use for questions requiring evidence from multiple wiki pages.
argument-hint: "<research question>"
---

Read `AGENTS.md` section **Workflows → Query**.

1. Search with `npm run qmd:search -- "<question>"` or the qmd MCP, then retrieve the most relevant pages.
2. Synthesize with `[[wikilinks]]` to the supporting wiki pages; separate consensus, disagreement, and uncertainty.
3. File a comparison/meta page only when the result is substantial and reusable.
4. If filing, update `wiki/index.md`, append an appropriate log entry with `Verification:`, and run `npm run wiki:validate`.
5. Let the Stop hook reindex qmd once if wiki content changed.
