# ML Research Wiki

A persistent, LLM-maintained knowledge base for **representation learning and related ML research** — self-supervised learning, world models, generative modeling, LLM post-training, reasoning architectures, and representation geometry. Built using Andrej Karpathy's [LLM Wiki](llm-wiki.md) pattern.

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

## Scope

The wiki started with **self-supervised representation learning** (especially JEPA) and has grown to cover adjacent areas that share representation-learning foundations:

| Area | Examples in the wiki |
|------|----------------------|
| **SSL & JEPA** | LeJEPA, V-JEPA 2.1, Bootleg, Causal-JEPA, LeVLJEPA, Temporal Difference Vision |
| **World models** | LeWorldModel, DINO-WM, Delta-JEPA, AdaJEPA, robot WM surveys |
| **Generative modeling** | Self-Flow, REPA, DeltaWorld, normalizing flows, oscillator-based generation |
| **LLM post-training** | On-policy distillation geometry, OPRD, layer contribution in RLVR |
| **Reasoning & inference** | Fixed-point reasoners, GRAM, NF-CoT, energy-based transformers, ARC-as-vision |
| **Representation geometry** | Global vs functional geometry, manifold steering, layer-wise adaptation |

See `wiki/overview.md` for a synthesized view of current themes and open questions.

## Current State

**62 sources** · **17 concepts** · **6 entities** · **3 comparisons**

Primary anchor: **JEPA** and its variants, with growing coverage of world models, post-training geometry, and reasoning architectures.
