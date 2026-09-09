---
title: "SMELT: Scaling Laws for Compute-Matched MoE Looped Transformers"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2609.01343"
authors:
  - "Shaowen Wang"
  - "Ge Zhang"
  - "Kairong Luo"
  - "Yuhao Wu"
  - "Shaofan Liu"
  - "Jiaheng Liu"
  - "Wenhao Huang"
  - "Shen Yan"
  - "Jian Li"
year: 2026
venue: "arXiv preprint (cs.LG)"
pdf_path: "https://arxiv.org/pdf/2609.01343v1"
tags:
  - transformer
  - language
  - optimization
  - theory
aliases:
  - "SMELT"
  - "Sparse MoE Transformer, middle layers Loop Twice"
---

# SMELT: Scaling Laws for Compute-Matched MoE Looped Transformers

## Summary

SMELT studies whether looping genuinely improves Transformer language models after controlling the confound that looped models normally receive extra computation or memory. It matches per-token FLOPs, total non-embedding parameters, and KV-cache size between a sparse MoE baseline and a model that re-executes the middle half of its layers twice. The resulting recipe, Sparse MoE Transformer with middle layers Loop Twice, has a steeper compute-scaling frontier and improves downstream performance, especially on structured data, long samples, and in-context learning. Mechanistic probes suggest that the second pass is a refinement step: it writes larger residual updates and reduces the attention sink while redirecting mass toward content-relevant tokens.

## Key Contributions

- Introduces a three-way budget-matched comparison of looped and unlooped sparse MoE Transformers.
- Identifies looping the middle 50% of layers exactly twice as the best recipe in the tested search space.
- Fits separate Chinchilla-style scaling laws across four model scales and several compute-equivalent sparsity levels.
- Finds downstream gains beyond what validation loss predicts, concentrated on Code and other structured domains, long samples, and in-context examples.
- Provides mechanistic evidence that the second visit reuses retrieval coordinates, amplifies residual writes, and reduces attention-sink mass.

## Methodology

The model family is a decoder-only sparse MoE Transformer with top-8 routing and grouped-query attention. SMELT loops the middle half of the unique layers twice, narrows hidden width, increases the expert pool to recover total non-embedding parameters, and scales looped residual updates by $1/2$. The matching procedure controls per-token training FLOPs, total non-embedding parameters, and KV-cache size. The study evaluates 100M, 200M, 600M, and 1.6B active non-embedding scales, with the largest configuration storing 54B non-embedding parameters.

Scaling fits use validation data across Code, Math/STEM, Finance, Knowledge, and Web at compute-equivalent sparsity levels near 85%, 95%, and 97%. Downstream evaluation uses the 22-task DCLM Core suite and MMLU. Mechanistic probes compare expert routing, residual writes, attention maps, and a controlled Dyck-language in-context task.

## Key Results

- SMELT's validation-loss frontier saves 6.8% to 18.0% of training FLOPs at the reported compute budgets and sparsity levels; at $10^{21}$ FLOPs the savings range from 14.7% to 18.0%.
- The recipe consistently beats its matched baseline across four scales and four sparsity levels. Code has the largest domain-level CE Gain at 20.4%, followed by Finance at 16.8% and Math/STEM at 16.6% in the reported analysis.
- The gain concentrates on long samples: normalized improvement across 512 to 4096 tokens is 1.52x that across 32 to 256 tokens, while parameter-only and expert-only controls show no comparable tilt.
- Average few-shot accuracy gap grows from 0.9 points at zero demonstrations to 1.9 points once examples are present. On the demonstration-sensitive Dyck task, SMELT reaches 29.8% versus 26.4% at 32 shots.
- In the Dyck case study, second-pass BOS attention falls from 0.60 to 0.02 while attention to demonstration answers rises from 0.24 to 0.85.
- Across scales, the second visit writes larger residual updates than the first and reduces segment-start attention mass, countering the ordinary depth trend of stronger attention sinks.

## Connections

- Extends [[iterative-refinement|iterative refinement]] with a compute-matched language-model scaling study rather than a fixed-task reasoning demonstration.
- Complements [[hyperloop-transformers|Hyperloop Transformers]], [[fixed-point-reasoners|FPRM]], and [[lotus|LOTUS]], which explore looped or recurrent computation for parameter efficiency, halting, or latent reasoning under different budgets.
- Adds a budget-matched architectural counterpart to [[full-bandwidth-transformer]] and [[recirculation]], which return processed state across token or layer boundaries.
- Supports the new [[looped-transformers]] synthesis: middle-layer reuse can act as iterative refinement, but its measured value depends on matching width, parameter capacity, FLOPs, and cache.
- The attention-sink mechanism connects to representation and information-flow questions in [[topological-trouble-with-transformers]] and to the broader role of context retrieval in language models.

## Limitations & Open Questions

> [!open-question]
> FLOPs, parameters, and KV-cache size are matched, but wall-clock latency is not. Serial block re-execution and sparse routing may introduce hardware-efficiency gaps that the scaling analysis does not measure.

> [!open-question]
> The reported causal mechanism for the gain is descriptive. It remains unresolved which part of the second visit, including residual amplification, value changes, expert routing, or sink reduction, is necessary.

> [!open-question]
> The preferred loop span and count are established for this MoE family and search space. Adaptive depth, per-visit adapters, block-selective sharing, and cross-token state reuse are not tested under the same full budget protocol.

## Future Work

The authors propose testing richer loop variants under the same budget matching, closing the gap between arithmetic and wall-clock efficiency, and developing causal mechanistic accounts of the second visit. They also identify scaling weight sharing across depth to larger compute budgets as an open direction.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2609.01343)
- [arXiv](https://arxiv.org/abs/2609.01343)
- [HTML](https://arxiv.org/html/2609.01343v1)
- [PDF](https://arxiv.org/pdf/2609.01343v1)

