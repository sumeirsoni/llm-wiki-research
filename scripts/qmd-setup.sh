#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Setting up qmd for $ROOT/wiki ..."

npx qmd init 2>/dev/null || true

WIKI_PATH="$ROOT/wiki"

if npx qmd collection list 2>/dev/null | grep -q '^wiki'; then
  echo "Collection 'wiki' already exists"
else
  npx qmd collection add wiki --path "$WIKI_PATH" --mask "**/*.md"
fi

npx qmd context add / "ML research wiki on self-supervised representation learning, JEPA, world models, and related methods"
npx qmd context add qmd://wiki/sources "Paper summaries — one page per ingested source"
npx qmd context add qmd://wiki/concepts "Concept and topic pages synthesizing ideas across papers"
npx qmd context add qmd://wiki/entities "Researchers, models, datasets, and organizations"
npx qmd context add qmd://wiki/comparisons "Filed comparison analyses and tables"
npx qmd context add qmd://wiki/meta "Reading lists, open questions, and knowledge gaps"

npx qmd update
npx qmd embed

echo "qmd ready. Run 'npm run qmd:status' to verify."
