---
title: "OPRD: On-Policy Representation Distillation"
type: source
created: 2026-06-09
updated: 2026-07-11
arxiv_id: "2606.06021"
authors:
  - "Shenzhi Yang"
  - "Guangcheng Zhu"
  - "Bowen Song"
  - "Haobo Wang"
  - "Mingxuan Xia"
  - "Xing Zheng"
  - "Yingfan Ma"
  - "Zhongqi Chen"
  - "Weiqiang Wang"
  - "Gang Chen"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.06021"
tags:
  - language
  - self-distillation
  - representation-learning
  - optimization
aliases:
  - "OPRD"
  - "On-Policy Representation Distillation"
---

# OPRD: On-Policy Representation Distillation

## Summary

On-Policy Representation Distillation (OPRD) is the first method to lift on-policy distillation from output-space KL objectives into hidden-state alignment. By supervising student intermediate representations against teacher hidden states via layer-averaged MSE, OPRD provides zero-variance deterministic gradients, bypasses the LM-head information bottleneck, and closes the student–teacher gap on math reasoning benchmarks where output-space OPD stagnates.

## Key Contributions

- **Hidden-state on-policy distillation**: aligns student and teacher intermediate representations on the student's own rollouts, with optional learnable projection for dimension mismatches.
- **Zero-variance gradients (Theorem 1)**: per-sample gradient has no sampling variance, unlike sampled-token OPD whose SNR collapses as policies converge.
- **Information beyond LM head (Theorem 2)**: output-space OPD is blind to hidden-state perturbations in the LM head's null space; OPRD directly penalizes these invisible directions.
- **Monotonic late-stage improvement**: unlike OPD top-1/top-16 which plateau below teacher, OPRD climbs steadily to near-teacher accuracy.
- **Efficiency**: 1.44× faster training, 32–54% less GPU memory (avoids vocabulary-sized logit tensors), and shorter reasoning chains (~5,700 vs ~7,000 tokens).

## Methodology

Given on-policy rollouts ŷ ~ π_θ(·|x), OPRD minimizes:

$$L_{OPRD} = \mathbb{E}\left[\frac{1}{|L_{layer}|}\sum_{l \in L_{layer}} \frac{1}{\sum m_t}\sum_t m_t \frac{1}{d}\|h^{(l)}_{\theta,t} - \text{sg}(h^{(l)}_{T,t})\|_2^2\right]$$

Supervision targets the last 2000 response tokens across all 28 transformer layers. OPRD composes additively with output-space OPD: L = L_OPD + μ L_OPRD.

Experiments use JustRL-1.5B teacher and R1-distill-1.5B student on DAPO-Math-17K, evaluated on AIME 2024/2025 and AIMO.

## Key Results

- **AIME 2024**: 49.8% (OPRD) vs 47.1% (OPD top-16) vs 50.8% (teacher).
- **AIME 2025**: 34.6% vs 34.0% vs 35.6%.
- **AIMO**: 79.1% vs 77.0% vs 79.5%.
- **Composability**: adding OPRD to OPD top-1 with μ=1 surpasses OPD top-16 alone; higher μ yields monotonic gains.
- **Mechanistic**: cosine similarity between student/teacher hidden states increases throughout training; RL phase transition occurs earlier with OPRD; pass@k diversity preserved under latent RL.

## Connections

- Extends [[self-distillation|self-distillation]] from output distributions to internal representations; complements [[bootleg|Bootleg]]'s multi-layer distillation in SSL but in the on-policy LLM post-training setting.
- Directly paired with [[on-the-geometry-of-on-policy-distillation|On the Geometry of On-Policy Distillation]], which characterizes the parameter-space dynamics that OPRD's richer signal operates within.
- The LM-head bottleneck analysis connects to [[representation-geometry|representation geometry]] — hidden states can differ substantially while producing identical output distributions.
- OPRD's zero-variance property addresses the same late-stage stagnation that [[on-the-geometry-of-on-policy-distillation|geometry analysis]] identifies as subspace locking in OPD.
- [[oprd-literature-review|OPRD Literature Review]] identifies three immediate follow-up directions: contrastive hidden-state objectives, position-aware OPRD weighting, and stable-rank/subspace diagnostics for OPRD update geometry.

## Limitations & Open Questions

> [!open-question]
> How does OPRD perform for cross-architecture distillation where hidden dimensions and layer counts differ substantially?

> [!open-question]
> Can adaptive layer/position selection based on student–teacher disagreement further improve efficiency beyond the fixed last-2000-token strategy?

> [!open-question]
> Would contrastive or hidden-flow objectives preserve OPRD's zero-variance benefit while transferring more relational structure than pointwise MSE?

> [!open-question]
> Does representation-level distillation transfer to vision or multimodal post-training, or is the benefit specific to reasoning-heavy LLM domains?

## Future Work

- Deploy OPRD-Vanilla as a memory-efficient drop-in for multi-model RL merging and checkpoint consolidation, replacing top-k or full-vocabulary OPD where materializing [B, T, |V|] logit tensors is prohibitive.
- Apply OPRD to on-policy self-distillation (OPSD) settings where teacher and student share weights and privileged information is injected into the prompt, replacing reverse-KL output-space objectives with lower-variance representation-level supervision.
- Establish representational alignment during pre-training—via shared layer initialization, periodic representation-matching regularization, or co-distillation across model scales—so cross-architecture pairs can use OPRD-Vanilla with a simple dimension adapter instead of a learned bridge.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2606.06021)
- [arXiv](https://arxiv.org/abs/2606.06021)
- [PDF](https://arxiv.org/pdf/2606.06021)
