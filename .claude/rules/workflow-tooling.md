---
paths:
  - ".claude/**/*"
  - "scripts/**/*"
  - "test/**/*"
  - "package.json"
  - "package-lock.json"
---

# Workflow tooling rule

- Preserve `.claude/settings.local.json`; shared automation belongs in `.claude/settings.json`.
- Hook adapters must be thin, read hook JSON from stdin, and write only valid hook JSON to stdout.
- Put reusable logic under `scripts/` and test it through isolated temporary repositories.
- Compare session changes with the captured session baseline, never directly with `HEAD`.
- Never reset, clean, restore, stash, stage, or revert the user’s pre-existing working tree.
- Automatic hooks may validate, review, and reindex; they must not append success logs or rewrite content silently.
- Keep qmd/model downloads out of unit tests and CI by injecting runners or fake executables.
