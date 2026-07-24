---
title: "SelecTKD: Selective Token-Weighted Knowledge Distillation for LLMs"
type: source
created: 2026-07-08
updated: 2026-07-11
arxiv_id: "2510.24021"
authors:
  - "Haiduo Huang"
  - "Ji Young Song"
  - "Yadong Zhang"
  - "Pengju Ren"
year: 2025
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2510.24021"
tags:
  - language
  - self-distillation
  - model-compression
  - optimization
aliases:
  - "SelecTKD"
  - "Selective Token-Weighted KD"
---

# SelecTKD: Selective Token-Weighted Knowledge Distillation for LLMs

## Summary

SelecTKD is a plug-and-play token weighting framework for LLM knowledge distillation. Instead of changing the divergence objective, it changes **where** the objective is applied: the student proposes tokens and the teacher verifies whether each token is reliable. Accepted tokens receive full loss; rejected tokens are masked or downweighted. The method works with multiple divergences and both on-policy and off-policy data.

## Key Contributions

- **Objective-agnostic token gating**: applies verification weights to KL, reverse KL, symmetric KL, or related token losses.
- **Propose-and-verify mechanism**: uses teacher verification of student proposals rather than a separate reward model.
- **Greedy Top-k and Spec-k variants**: supports both greedy and non-greedy verification procedures.
- **Implicit curriculum**: token acceptance rate tracks how many tokens are considered reliable as training progresses.
- **Broad evaluation**: improves small models across instruction following, math, code, and VLM settings.

## Methodology

SelecTKD rewrites a token-wise distillation objective as:

$$\sum_t V_t D(p_t \| q_t),$$

where `V_t` is a verifier-derived token weight. Accepted tokens receive weight 1, rejected tokens can receive 0 or a small residual weight. Since the weighting sits outside the divergence, the mechanism can combine with multiple KD losses.

## Relevance to OPRD

SelecTKD is relevant because OPRD can treat hidden-state loss as the base divergence and place a verifier-derived weight around it. Compared with [[tip-token-importance-opd|TIP]] or [[fire-opd|FiRe-OPD]], SelecTKD is less tied to a specific OPD formula and more directly "plug-in":

- `V_t * ||h_S - h_T||^2` for weighted OPRD;
- `V_t * L_contrastive` for contrastive OPRD;
- accepted/rejected token rates as a diagnostic for OPRD position bias.

## Limitations & Open Questions

> [!open-question]
> The verifier uses output-space agreement. Tokens whose logits agree but hidden states differ may be accepted even when OPRD would still benefit from representation supervision.

> [!open-question]
> Hard masking may conflict with OPRD's all-layer dense representation-alignment benefits unless a residual weight is retained.

## Future Work

- Scale SelecTKD to frontier-scale LLM and VLM teachers beyond the 9B/8B models evaluated.
- Adaptively learn Top-k and rejected-token weight β, or condition them on token- or context-level uncertainty.
- Extend selective token-weighted distillation to multi-image/video, speech, and preference-aligned training pipelines.

## Links

- [arXiv](https://arxiv.org/abs/2510.24021)
- [PDF](https://arxiv.org/pdf/2510.24021)
