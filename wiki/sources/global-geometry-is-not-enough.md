---
title: "Global Geometry Is Not Enough for Vision Representations"
type: source
created: 2026-05-16
updated: 2026-07-11
arxiv_id: "2602.03282"
authors:
  - "Jiwan Chung"
  - "Seon Joo Kim"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2602.03282"
tags:
  - representation-learning
  - vision
  - self-supervised-learning
  - theory
aliases:
  - "JER"
  - "Jacobian Effective Rank"
---

# Global Geometry Is Not Enough for Vision Representations

## Summary

Global Geometry Is Not Enough challenges the assumption that good embedding geometry, such as isotropy or high effective rank, is sufficient for strong vision representations. Across 21 encoders, standard geometry metrics fail to predict compositional binding, while Jacobian Effective Rank (JER), a functional sensitivity measure, correlates strongly with compositional competence.

## Key Contributions

- **Negative result for global metrics**: global participation ratio and isotropy have near-zero correlation with compositional binding accuracy.
- **Jacobian Effective Rank**: introduces JER as a diagnostic for local input-output sensitivity.
- **Compositional binding benchmark**: tests whether models preserve shape-position bindings across disjoint color sets.
- **Objective-sensitivity account**: argues that different SSL losses constrain different components of the encoder Jacobian.
- **Mechanism for rank collapse**: traces where sensitivity collapses across model depth.

## Methodology

The paper evaluates 21 pretrained vision encoders across contrastive, variance-decorrelation, clustering, self-distillation, masked prediction, vision-language, and supervised families. It compares global geometry metrics on ImageNet embeddings with performance on synthetic compositional binding and same/different structural probes.

JER estimates the effective rank of the input-output Jacobian using randomized range-finding and Jacobian-vector products. The authors analyze singular-value spectra and depth-wise JER to localize functional sensitivity loss.

## Key Results

- Global participation ratio has Pearson r = -0.00 with compositional binding accuracy; global isotropy and local isotropy are also insignificant.
- JER correlates strongly with binding accuracy (r = 0.65, p = 0.001).
- JER plus same/different structural discrimination explains 74% of binding-performance variance.
- Barlow Twins and VICReg show higher JER and stronger binding than CLIP, DINOv2, and MAE.
- Geometry-based readouts such as kNN and local PCA do not recover binding information when it is absent from the representation.

## Connections

- Complicates [[lejepa|LeJEPA]]'s isotropic-Gaussian story by suggesting that global geometry can be necessary but not sufficient for compositional representation.
- Complements [[steerable-visual-representations|Steerable Visual Representations]], which also asks whether embeddings can respond functionally to structured task cues.
- Relevant to [[representation-collapse|representation collapse]] because it identifies a softer failure mode: not total collapse, but collapse of functional sensitivity to structured variations.
- Provides a diagnostic lens for evaluating representations used by [[repa|REPA]], [[representation-frechet-loss|FD-loss]], and robot world models.

## Limitations & Open Questions

> [!open-question]
> Can JER be directly regularized during pretraining without harming semantic invariance or robustness?

> [!open-question]
> How do JEPA-style dense video models score under JER and compositional binding diagnostics?

## Future Work

- Design training objectives that regulate functional sensitivity directly rather than relying on geometry-based criteria or linear probing.
- Develop evaluation benchmarks that target functional structure beyond static embedding statistics such as isotropy and effective rank.
- Extend the local Jacobian analysis to global and trajectory-level geometric properties of the representation manifold.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2602.03282)
- [arXiv](https://arxiv.org/abs/2602.03282)
