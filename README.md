# ML Research Wiki

A persistent, LLM-maintained knowledge base for self-supervised representation learning research. Built using Andrej Karpathy's [LLM Wiki](llm-wiki.md) pattern.

## Structure

| Directory | Purpose |
|-----------|---------|
| `raw/` | Immutable source documents (clipped articles, PDFs) |
| `seed-papers/` | Initial seed papers (PDFs) |
| `wiki/` | LLM-generated and maintained wiki pages |
| `wiki/sources/` | One summary page per ingested paper |
| `wiki/concepts/` | Concept and topic pages |
| `wiki/entities/` | Researchers, models, datasets, organizations |
| `wiki/comparisons/` | Filed comparison analyses |
| `wiki/meta/` | Reading list, open questions, knowledge gaps |

## Key Files

- **`AGENTS.md`** — Schema file defining conventions, workflows, and AlphaXiv MCP integration
- **`wiki/index.md`** — Content catalog of all wiki pages
- **`wiki/log.md`** — Chronological log of all operations
- **`wiki/overview.md`** — High-level synthesis (the wiki's "front page")

## Usage

This wiki is designed to be:
1. **Browsed in [Obsidian](https://obsidian.md)** — open this directory as a vault
2. **Maintained by LLM agents** — agents follow the conventions in `AGENTS.md`
3. **Augmented by [AlphaXiv MCP](https://www.alphaxiv.org/docs/mcp)** — for discovering and retrieving new research papers

## Current Focus

Self-supervised representation learning, particularly JEPA (Joint-Embedding Predictive Architecture) variants and related methods.
