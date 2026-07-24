---
name: wiki-discover
description: Discover relevant new papers, assess novelty against the wiki, and prepare selected sources for ingestion. Use for literature discovery or coverage-gap searches.
argument-hint: "<topic or research question>"
---

Read `AGENTS.md` sections **Workflows → Discover** and **AlphaXiv MCP Integration**.

- Search through multiple complementary retrieval strategies when available.
- Deduplicate results against `wiki/sources/` and distinguish genuinely new coverage from close variants.
- Present title, year, authors, primary URL, relevance, and the wiki gap each paper would fill.
- Do not ingest automatically unless requested; for selected papers, hand off to the `wiki-ingest` workflow.
