---
title: "TIP: Token Importance in On-Policy Distillation"
type: source
created: 2026-07-08
updated: 2026-07-11
arxiv_id: "2604.14084"
authors:
  - "Yuanda Xu"
  - "Hejian Sang"
  - "Zhengze Zhou"
  - "Ran He"
  - "Zhipeng Wang"
  - "Alborz Geramifard"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2604.14084"
code_url: "https://github.com/HJSang/OPSD_OnPolicyDistillation"
tags:
  - language
  - self-distillation
  - optimization
aliases:
  - "TIP"
  - "Token Importance in OPD"
---

# TIP: Token Importance in On-Policy Distillation

## Summary

TIP studies which token positions carry useful learning signal in OPD. It argues that informative tokens come from two regions: high student entropy, where the student is uncertain, and low-entropy/high-divergence positions, where the student is confident but wrong relative to the teacher. Entropy alone is useful but structurally blind to overconfident errors, so TIP proposes a two-axis taxonomy and a parameter-free Soft-OR score combining student entropy and teacher-student divergence.

## Key Contributions

- **Two-axis token taxonomy**: crosses student entropy with teacher-student divergence to identify informative token regions.
- **Overconfident-error blind spot**: shows entropy-only token selection misses low-entropy, high-divergence tokens.
- **Soft-OR score**: combines normalized entropy and divergence as `s_t = h_t + delta_t - h_t delta_t`.
- **Memory savings**: retaining 50% entropy-selected tokens can match or exceed all-token OPD while cutting peak memory; more aggressive selection exposes the value of overconfident-error tokens.
- **Long-horizon validation**: tests math reasoning and DeepPlanning rollouts.

## Methodology

TIP computes two per-token quantities already available in OPD: student entropy and KL divergence between student and teacher distributions. The Soft-OR score gives high weight when either uncertainty or disagreement is high, avoiding the entropy-only failure mode. Training can use top-k token selection under this score instead of all-token supervision.

## Relevance to OPRD

TIP provides a natural diagnostic for **position-aware OPRD**:

- Replace output KL divergence with hidden-state discrepancy to test whether OPRD has an analogous "confident but representationally wrong" region.
- Compare entropy-only, hidden-discrepancy-only, prefix-drift, and Soft-OR-style weighting.
- Use TIP-selected tokens as a compute-saving baseline against OPRD's fixed last-2000-token strategy.

## Limitations & Open Questions

> [!open-question]
> TIP uses output-space divergence as both a diagnostic and selection criterion; OPRD may surface hidden-state divergence even when output distributions agree.

> [!open-question]
> Hard token selection saves memory but may introduce optimization brittleness compared with soft weighting.

## Future Work

- Test whether the entropy–divergence quadrant structure and Q3 overconfident-error concentration hold at trillion-parameter scale and with extremely long agentic tool-calling rollouts.
- Apply the two-axis token-importance framing to other on-policy token-level supervision settings, including process reward fine-tuning and speculative decoding.

## Links

- [arXiv](https://arxiv.org/abs/2604.14084)
- [PDF](https://arxiv.org/pdf/2604.14084)
- [Code](https://github.com/HJSang/OPSD_OnPolicyDistillation)
