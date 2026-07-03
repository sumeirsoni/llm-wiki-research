# ML Research Wiki — Agent Schema

This document defines how LLM agents should operate on this wiki. It is the single source of truth for structure, conventions, and workflows.

## Domain

Self-supervised representation learning and related ML research. The wiki covers papers, concepts, models, datasets, researchers, and organizations in this space.

## Directory Structure

```
llm-wiki-research/
├── AGENTS.md              # This file — schema & conventions
├── .qmd/                  # qmd search index config (index.yml; index.sqlite is gitignored)
├── scripts/               # Tooling scripts (qmd setup, etc.)
├── raw/                   # Immutable source documents (PDFs, clipped articles)
│   └── assets/            # Downloaded images
├── seed-papers/           # Initial seed papers (PDFs)
├── wiki/                  # LLM-generated & maintained wiki
│   ├── index.md           # Content catalog (all pages with summaries)
│   ├── log.md             # Chronological operation log
│   ├── overview.md        # High-level synthesis & front page
│   ├── sources/           # One summary page per ingested source
│   ├── concepts/          # Concept & topic pages
│   ├── entities/          # Entity pages (researchers, orgs, models, datasets)
│   ├── comparisons/       # Filed comparison analyses & tables
│   └── meta/              # Reading list, open questions, knowledge gaps
└── .obsidian/             # Obsidian vault configuration
```

### Rules

- **`raw/` and `seed-papers/` are immutable.** Never modify source documents.
- **`wiki/` is LLM-owned.** The LLM creates, updates, and maintains all wiki pages. The user reads them.
- **`AGENTS.md` is co-evolved.** The user and LLM update this file together as conventions evolve.

---

## Page Format Conventions

### Frontmatter

Every wiki page MUST have YAML frontmatter:

```yaml
---
title: "Page Title"
type: source | concept | entity | comparison | meta
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - relevant-tag
  - another-tag
sources:
  - "[[Source Page Name]]"
aliases:
  - "Alternative Name"
---
```

**Source pages** additionally include:

```yaml
---
arxiv_id: "XXXX.XXXXX"
authors:
  - "Author Name"
year: YYYY
venue: "Conference/Journal"
pdf_path: "raw/filename.pdf"
code_url: "https://github.com/..." # if available
project_url: "https://..." # project page, if available
---
```

### Wikilinks

Use Obsidian-style wikilinks for all cross-references:

- `[[Page Name]]` — link to a page
- `[[Page Name|display text]]` — link with custom display text
- `[[Page Name#Section]]` — link to a specific section

### Headings

- `# Title` — page title (matches frontmatter title)
- `## Section` — major sections
- `### Subsection` — subsections

### Callouts for Special Notes

Use Obsidian callouts for important annotations:

```markdown
> [!contradiction]
> This claim contradicts [[Other Page]] which states...

> [!open-question]
> It remains unclear whether...

> [!gap]
> No source in the wiki currently addresses...

> [!updated]
> Updated on YYYY-MM-DD based on [[New Source]] which supersedes...
```

### File Naming

- Use kebab-case for filenames: `self-supervised-learning.md`
- Source pages: use a short descriptive slug based on the paper title
- No spaces in filenames

---

## Tag Taxonomy

Initial tags for ML research. Extend as needed.

### Paradigms

- `#self-supervised-learning`
- `#contrastive-learning`
- `#generative-modeling`
- `#reinforcement-learning`
- `#supervised-learning`

### Architectures & Methods

- `#transformer`
- `#cnn`
- `#jepa` (Joint-Embedding Predictive Architecture)
- `#world-model`
- `#flow-matching`
- `#self-distillation`
- `#masked-modeling`
- `#ema` (Exponential Moving Average)

### Modalities

- `#vision`
- `#video`
- `#language`
- `#multi-modal`
- `#audio`

### Tasks & Applications

- `#representation-learning`
- `#object-detection`
- `#segmentation`
- `#image-classification`
- `#video-understanding`
- `#depth-estimation`

### Meta

- `#benchmark`
- `#dataset`
- `#optimization`
- `#theory`
- `#survey`

---

## Workflows

### 1. Ingest

Process a new source and integrate it into the wiki.

**Input:** A paper (PDF in `raw/`, or an arXiv URL).

**Steps:**

1. **Read the source.** If PDF, use AlphaXiv MCP `get_paper_content` with the arXiv URL, or `answer_pdf_queries` for specific questions. If markdown, read directly.
2. **Create a source page** in `wiki/sources/`. Include:
   - Full frontmatter (title, authors, arXiv ID, year, tags)
   - One-paragraph abstract/summary
   - Key contributions (bulleted list)
   - Methodology summary
   - Key results and findings
   - Connections to existing wiki pages (wikilinks)
   - Limitations and open questions noted by the authors
   - **Links section** with arXiv, GitHub code repo, and project page (when available)
3. **Update or create concept pages** in `wiki/concepts/` for each major concept covered. Add the new source as a reference. Note if the new source confirms, extends, or contradicts existing content.
4. **Update or create entity pages** in `wiki/entities/` for key researchers, models, datasets, and organizations mentioned.
5. **Update `wiki/index.md`** — add entries for all new pages.
6. **Append to `wiki/log.md`** — record the ingest with timestamp.
7. **Update `wiki/overview.md`** if the new source significantly changes the overall synthesis.
8. **Reindex search** — run `npm run qmd:reindex` so qmd picks up new/changed pages.

### 2. Query

Answer a question using the wiki.

**Steps:**

1. **Search the wiki** with qmd (preferred) or read `wiki/index.md`:
   - MCP: use the `qmd` server's `query` tool with typed sub-queries (`lex` for keywords, `vec` for semantic, `hyde` for hypothetical answers). Filter with `collections: ["wiki"]`.
   - CLI: `npm run qmd:search -- "your question"` (hybrid search + reranking), or `npx qmd search "keywords"` for fast BM25-only lookup.
   - Fallback: read `wiki/index.md` to identify relevant pages by category.
2. **Retrieve content** — use qmd `get` / `multi_get` (MCP or `npx qmd get …`) for the top hits, or read wiki pages directly.
3. Synthesize an answer with `[[wikilinks]]` citations to wiki pages.
4. If the answer is substantial and reusable, file it as a new page in `wiki/comparisons/` or `wiki/meta/` and update the index.
5. If new pages were filed, run `npm run qmd:reindex`.

### 3. Discover

Find new papers on a topic using AlphaXiv MCP.

**Steps:**

1. Use `embedding_similarity_search` and/or `agentic_paper_retrieval` to find papers.
2. Present results to the user with title, abstract, and relevance assessment.
3. For papers the user wants to ingest, use `get_paper_content` to retrieve content, then follow the Ingest workflow.

### 4. Lint

Health-check the wiki.

**Steps:**

1. Scan all wiki pages for:
   - **Orphan pages** — pages with no inbound wikilinks
   - **Broken links** — wikilinks that point to non-existent pages
   - **Missing pages** — concepts/entities mentioned but lacking their own page
   - **Contradictions** — claims that conflict across pages
   - **Stale content** — pages not updated after newer sources arrived
   - **Gaps** — important related topics not yet covered
2. Report findings and suggest fixes.
3. Optionally, suggest new papers to look up via AlphaXiv MCP to fill gaps.

---

## QMD Search Integration

Local hybrid search over wiki pages via [qmd](https://github.com/tobi/qmd) — BM25 + vector search + LLM reranking, all on-device.

**Setup (once per clone):**

```sh
npm install
npm run qmd:setup
```

This creates a project-local index in `.qmd/`, indexes `wiki/**/*.md`, and downloads embedding models to `~/.cache/qmd/models/` (~350MB on first run).

**Cursor MCP:** `.cursor/mcp.json` registers the qmd MCP server. Enable it in Cursor Settings → MCP if not auto-detected. Tools: `query`, `get`, `multi_get`, `status`.

**Reindex after wiki changes:**

```sh
npm run qmd:reindex
```

**CLI quick reference:**

| Command | Use When |
| ------- | -------- |
| `npm run qmd:search -- "question"` | Best-quality hybrid search (default for queries) |
| `npx qmd search "keyword"` | Fast BM25 keyword lookup |
| `npx qmd vsearch "conceptual question"` | Semantic search only |
| `npx qmd get "sources/jepa.md"` | Retrieve full page content |
| `npm run qmd:status` | Check index health |

**Collection context** (helps qmd rank results):

- `wiki/sources` — paper summaries
- `wiki/concepts` — topic synthesis pages
- `wiki/entities` — researchers, models, datasets, orgs
- `wiki/comparisons` — filed analyses
- `wiki/meta` — reading lists and open questions

---

## AlphaXiv MCP Integration

**Endpoint:** `https://api.alphaxiv.org/mcp/v1`
**Authentication:** Open access (no API key required)

### Available Tools

| Tool                                | Use When                                                             |
| ----------------------------------- | -------------------------------------------------------------------- |
| `embedding_similarity_search`       | Finding papers by concept/method (use 2-3 sentence queries)          |
| `full_text_papers_search`           | Searching by keyword, method name, author, or benchmark              |
| `agentic_paper_retrieval`           | Comprehensive multi-turn search for a research question              |
| `get_paper_content`                 | Retrieving paper text (default: AI report; `fullText: true` for raw) |
| `answer_pdf_queries`                | Asking specific questions about a paper                              |
| `read_files_from_github_repository` | Exploring a paper's code repository                                  |

### Recommended Patterns

- **Comprehensive search:** Run `embedding_similarity_search`, `full_text_papers_search`, and `agentic_paper_retrieval` in parallel with varied queries for maximum recall.
- **Deep paper read:** Use `get_paper_content` first for the AI report, then `answer_pdf_queries` for specific follow-up questions.
- **Code analysis:** Find the GitHub URL from paper results, then use `read_files_from_github_repository` to explore.

---

## Index Format

`wiki/index.md` uses this format:

```markdown
## Sources

- [[source-page-name]] — One-line summary (YYYY)

## Concepts

- [[concept-page-name]] — One-line summary

## Entities

- [[entity-page-name]] — One-line summary (type: researcher | model | dataset | org)

## Comparisons

- [[comparison-page-name]] — One-line summary

## Meta

- [[meta-page-name]] — One-line summary
```

## Log Format

`wiki/log.md` uses this format for parseability:

```markdown
## [YYYY-MM-DD] ingest | Paper Title

Summary of what was done and pages affected.

## [YYYY-MM-DD] query | Question Asked

Summary of the answer and any pages filed.

## [YYYY-MM-DD] lint | Health Check

Summary of findings and fixes applied.
```
