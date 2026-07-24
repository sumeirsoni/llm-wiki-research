---
title: "Entropy-Aware On-Policy Distillation of Language Models"
type: source
created: 2026-07-08
updated: 2026-07-11
arxiv_id: "2603.07079"
authors:
  - "Weiwei Jin"
  - "Taywon Min"
  - "Yongjin Yang"
  - "Swanand Kadhe"
  - "Yi Zhou"
  - "Dennis Wei"
  - "Nathalie Baracaldo"
  - "Kimin Lee"
year: 2026
venue: "ICML"
pdf_path: "https://arxiv.org/pdf/2603.07079"
code_url: "https://github.com/WLS04/EOPD"
tags:
  - language
  - self-distillation
  - optimization
  - reinforcement-learning
aliases:
  - "EOPD"
  - "Entropy-Aware OPD"
---

# Entropy-Aware On-Policy Distillation of Language Models

## Summary

Entropy-Aware OPD (EOPD) addresses a failure mode of reverse-KL on-policy distillation: when the teacher distribution has high entropy, reverse KL is mode-seeking and can collapse diversity by forcing the student toward one continuation. EOPD keeps efficient reverse-KL imitation in low-entropy regions but adds forward-KL supervision when teacher entropy is high, preserving more of the teacher's uncertainty and improving Pass@8 on math reasoning benchmarks.

## Key Contributions

- **Teacher-entropy diagnosis**: standard OPD retains far fewer high-entropy tokens than the teacher, indicating diversity collapse.
- **Hybrid KL objective**: applies reverse KL generally and gates in forward KL for high teacher-entropy tokens.
- **Diversity preservation**: improves student-teacher alignment in high-entropy positions and sustains token-level entropy.
- **Reasoning gains**: reports Pass@8 gains over OPD across Qwen3-0.6B, 1.7B, and 4B students.

## Methodology

For each on-policy token context, EOPD computes teacher entropy. Low-entropy contexts use reverse KL for efficient mode-seeking imitation. High-entropy contexts activate a forward-KL term so the student covers the teacher's broader distribution rather than collapsing to a single mode. The method stays within the standard OPD workflow: student rollout, teacher scoring, token-level loss, update.

## Relevance to OPRD

EOPD gives a **teacher-confidence axis** for position-aware OPRD:

- If OPRD hidden-state targets are noisy when the teacher is uncertain, teacher entropy can gate or downweight hidden-state alignment.
- If high-entropy positions are reasoning branch points, OPRD may need representation alignment there even when output-space reverse KL is unstable.
- EOPD is complementary to [[on-the-position-bias-of-on-policy-distillation|IW-OPD]], which weights by accumulated prefix drift rather than local teacher entropy.

## Limitations & Open Questions

> [!open-question]
> Teacher entropy is an output-space uncertainty signal; it may not identify hidden-state positions where representation transfer is most useful.

> [!open-question]
> EOPD does not test whether high-entropy tokens have distinct parameter-space geometry or affect OPD subspace locking.

## Future Work

- The paper does not include an explicit future-work section; implied next steps follow from the entropy-aware hybrid KL framing — broader domains beyond math reasoning, and tighter coupling of teacher-uncertainty gating with other on-policy distillation variants.


## Links

- [arXiv](https://arxiv.org/abs/2603.07079)
- [PDF](https://arxiv.org/pdf/2603.07079)
- [Code](https://github.com/WLS04/EOPD)
