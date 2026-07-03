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
3. **Searched with [qmd](https://github.com/tobi/qmd)** — local hybrid search over wiki pages (see below)
4. **Augmented by [AlphaXiv MCP](https://www.alphaxiv.org/docs/mcp)** — for discovering and retrieving new research papers

### Search setup

```sh
npm install
npm run qmd:setup    # first time: index wiki pages + download models
npm run qmd:search -- "how does JEPA differ from MAE?"
```

After ingesting or editing wiki pages, reindex with `npm run qmd:reindex`.

Cursor agents can use the qmd MCP server (configured in `.cursor/mcp.json`) for native `query` / `get` tools during the Query workflow.

## Current Focus

Self-supervised representation learning, particularly JEPA (Joint-Embedding Predictive Architecture) variants and related methods.
