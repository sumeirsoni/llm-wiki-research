---
name: wiki-audit
description: Audit wiki structure and research quality using the deterministic validator plus semantic review. Use for linting, broken links, stale claims, contradictions, or coverage gaps.
argument-hint: "[scope or concern]"
---

Read `AGENTS.md` section **Workflows → Lint**.

1. Run `npm run wiki:validate` and separate hard errors from warnings.
2. Review semantic concerns the validator cannot prove: contradictions, stale synthesis, missing concepts/entities, weak source grounding, and knowledge gaps.
3. Rank findings by impact and confidence with clickable file references.
4. Do not auto-fix semantic findings unless requested. Deterministic repairs must preserve surrounding user changes.
5. If fixes are applied, rerun validation and record the verification result in the relevant log entry.
