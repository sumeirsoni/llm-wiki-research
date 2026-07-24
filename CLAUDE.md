# Project workflow

- `AGENTS.md` is the canonical source for wiki schema and research workflows. Read the relevant section before changing wiki content.
- Preserve the existing dirty working tree. Never stash, reset, clean, restore, or discard changes you did not create.
- Never modify `raw/`, `seed-papers/`, or `.claude/settings.local.json`.
- Use the project skills for ingest, query, discovery, audit, and qmd setup when they match the task.
- Use a brief plan for broad multi-file, configuration-heavy, ambiguous, or experimental work.
- New content pages require index bookkeeping; new source pages also require an operation-log entry.
- Claude Code hooks validate session-introduced changes and reindex qmd once at Stop when final wiki content changed.
- Do not claim completion if tests, validation, companion checks, or qmd reindexing failed.
