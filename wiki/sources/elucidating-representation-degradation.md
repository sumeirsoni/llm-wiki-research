---
title: "Elucidating Representation Degradation Problem in Diffusion Model Training"
type: source
created: 2026-05-16
updated: 2026-05-16
arxiv_id: "2605.10790"
authors:
  - "Zhipeng Yao"
  - "Dazhou Li"
  - "Zitong Zhang"
  - "Durude Mahee"
  - "Fan Zhu"
  - "Wenbin Zhang"
  - "Xinwei He"
  - "Yeying Jin"
  - "Rui Yu"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.10790"
tags:
  - diffusion
  - generative-modeling
  - representation-learning
  - optimization
  - theory
aliases:
  - "ERD"
  - "Elucidated Representation Diffusion"
---

# Elucidating Representation Degradation Problem in Diffusion Model Training

## Summary

This paper identifies representation degradation as an intrinsic bottleneck in diffusion training: as noise increases, the model's predicted geometry can distort, collapse, and contaminate shared representation parameters. The proposed Elucidated Representation Diffusion (ERD) framework reweights training by target recoverability to stabilize representations and accelerate convergence.

## Key Contributions

- **Representation degradation**: names and analyzes structural distortion/collapse across diffusion noise levels.
- **NTK-based theory**: connects degradation to recoverability mismatch, weakened spectral contraction, and Bayes-noise gradient contamination.
- **Recoverability weighting**: derives a target-adaptive loss weight from the recoverable amplitude of the prediction target.
- **Architecture-agnostic ERD**: improves DiT, U-ViT, and UNet training without external priors or extra alignment networks.
- **Empirical validation**: combines 2D GMM diagnostics with ImageNet and CelebA generation results.

## Methodology

The paper analyzes diffusion training in the log-SNR domain under neural tangent kernel dynamics. It decomposes local ELBO terms into irreducible Bayes floor and optimizable excess, showing how shared parameters can receive noisy gradients from weakly recoverable regimes.

ERD computes a recoverability score for the target y_lambda = c_x(lambda)x0 + c_epsilon(lambda)epsilon. The loss weight is proportional to the root-mean-square amplitude of the target components that are actually expressed in the corrupted input. This downweights weakly learnable noise regimes and emphasizes recoverable signals.

## Key Results

- Toy GMM experiments show feature-space topological collapse, NTK rank collapse, and loss domination in high-Bayes-floor regimes.
- ERD improves FID across DiT, U-ViT, and UNet ablations.
- On ImageNet 256 without classifier-free guidance, ERD improves DiT-XL/2 FID from 19.5 to 15.0 and U-ViT-H/2 from 13.7 to 8.9.
- With classifier-free guidance, U-ViT-H/2 + ERD reaches FID 1.45 and IS 312.4, close to REPA-level performance.
- ERD outperforms Min-SNR and P2 weighting across multiple prediction objectives.

## Connections

- Complements [[repa|REPA]] and [[representation-frechet-loss|Representation Fréchet Loss]] by treating representation quality as central to diffusion training efficiency.
- Relates to [[flow-matching|flow matching]] because recoverability-aware weighting may apply broadly to continuous denoising or transport objectives.
- Adds a diffusion-specific form of representation collapse/degradation to the broader [[representation-collapse|collapse]] page.
- Contrasts with external alignment: ERD is intrinsic and does not require DINO/CLIP-style priors.

## Limitations & Open Questions

> [!open-question]
> Does ERD still help when combined with external representation alignment methods such as [[repa|REPA]]?

> [!open-question]
> Can recoverability weighting improve video, audio, or robot-world-model diffusion training where signals vary across space, time, and action conditioning?

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2605.10790)
- [arXiv](https://arxiv.org/abs/2605.10790)
