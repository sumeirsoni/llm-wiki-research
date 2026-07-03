---
title: "Sub-JEPA: Subspace Gaussian Regularization for Stable End-to-End World Models"
type: source
created: 2026-05-16
updated: 2026-07-03
arxiv_id: "2605.09241"
authors:
  - "Kai Zhao"
  - "Dongliang Nie"
  - "Yuchen Lin"
  - "Yixiao Gu"
  - "Dan Zeng"
  - "Zhehan Luo"
  - "Deng-Ping Fan"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.09241"
tags:
  - jepa
  - world-model
  - representation-collapse
  - representation-learning
  - robotics
aliases:
  - "Sub-JEPA"
---

# Sub-JEPA: Subspace Gaussian Regularization for Stable End-to-End World Models

## Summary

Sub-JEPA refines LeWorldModel's SIGReg-style full-space Gaussian regularization by applying Gaussian normality tests in multiple frozen, low-dimensional orthogonal subspaces. This relaxes the global isotropic prior while preserving anti-collapse pressure, improving planning performance in end-to-end JEPA world models.

## Key Contributions

- **Subspace Gaussian regularization**: applies Epps-Pulley normality statistics after fixed random orthogonal projections.
- **Bias-variance correction**: argues full ambient isotropic Gaussian regularization can over-bias dynamics that live on low-dimensional manifolds.
- **Stable end-to-end training**: keeps the LeWorldModel recipe without frozen pretrained encoders or complex auxiliary losses.
- **Mechanistic evidence**: links performance gains to lower effective rank, straighter latent trajectories, and better long-horizon stability.

## Methodology

Sub-JEPA uses an encoder and predictor trained to predict next latent states from observations and actions. Instead of regularizing full D-dimensional embeddings toward an isotropic Gaussian, it samples K fixed row-orthonormal projection matrices and applies the Gaussian normality statistic independently within each projected subspace. The total loss combines latent prediction with the average subspace regularization term.

The projections are frozen to prevent co-adaptation and orthogonalized to give balanced non-redundant views of the latent representation. The implementation otherwise follows LeWorldModel, with D=192 and task-dependent K values.

## Key Results

- Outperforms LeWorldModel across Two-Room, Reacher, PushT, and OGB-Cube.
- Two-Room success improves from 84.33% to 95.00%, the largest gain in a low-intrinsic-dimensional task.
- OGB-Cube improves from 67.33% to 76.33% without using pretrained visual features.
- Effective-rank reductions correlate with planning gains, supporting the intrinsic-dimensionality hypothesis.
- Frozen orthogonal projections outperform random non-orthogonal or trainable projections.

## Connections

- Direct continuation of [[leworldmodel|LeWorldModel]] and [[lejepa|LeJEPA]], replacing full-space SIGReg with subspace-wise Gaussian constraints.
- Updates the [[representation-collapse|representation collapse]] debate: avoiding collapse is not enough if the anti-collapse prior is too rigid.
- Adds another JEPA-based branch to [[world-models|world models]], especially for continuous-control planning.
- [[delta-jepa|Delta-JEPA]] is a complementary alternative: replaces Gaussian/subspace regularization entirely with Latent Difference Action Decoding; beats Sub-JEPA on all four shared benchmark tasks in its evaluation.
- Relates to [[global-geometry-is-not-enough|Global Geometry Is Not Enough]] because both caution against treating global geometry as the whole story.

## Limitations & Open Questions

> [!open-question]
> How should K and subspace dimension be selected when the task's intrinsic dimensionality is unknown?

> [!open-question]
> Can subspace regularization improve large-scale video JEPA models, or is it mainly useful in smaller control environments?

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2605.09241)
- [arXiv](https://arxiv.org/abs/2605.09241)
