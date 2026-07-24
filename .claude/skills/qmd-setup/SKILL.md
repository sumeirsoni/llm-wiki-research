---
name: qmd-setup
description: Configure or troubleshoot the repository-local qmd search index. Use when qmd is missing, points to another clone, fails to index, or needs a full rebuild.
argument-hint: "[setup or error details]"
---

Read `AGENTS.md` section **QMD Search Integration**.

- Use `npm run qmd:setup` for clone-local configuration plus initial indexing.
- Use `npm run qmd:reindex` for an explicit rebuild and `npm run qmd:status` for diagnostics.
- Do not edit `.qmd/index.sqlite*` directly or commit machine-specific qmd state.
- First-run model downloads are expected and must not run in unit tests or CI.
- Report configuration path, indexed/pending counts, and any failure accurately.
