---
title: "Normalizing Trajectory Models"
type: source
created: 2026-05-16
updated: 2026-07-11
arxiv_id: "2605.08078"
authors:
  - "Jiatao Gu"
  - "Tianrong Chen"
  - "Ying Shen"
  - "David Berthelot"
  - "Shuangfei Zhai"
  - "Josh Susskind"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.08078"
tags:
  - generative-modeling
  - flow-matching
  - diffusion
  - vision
aliases:
  - "NTM"
---

# Normalizing Trajectory Models

## Summary

Normalizing Trajectory Models (NTMs) address the Gaussian bottleneck in few-step diffusion and flow-matching generation. Instead of assuming each large reverse step is Gaussian, NTM models each reverse transition with a conditional normalizing flow, preserving exact trajectory likelihood while enabling high-quality generation in a small number of steps.

## Key Contributions

- **Conditional flow reverse steps**: each p(x_s | x_t) is modeled through an invertible transporter and Gaussian predictor in latent u-space.
- **Exact trajectory likelihood**: unlike distillation, consistency, or adversarial acceleration methods, NTM keeps tractable likelihoods.
- **Deep-shallow architecture**: shallow invertible transporters capture local non-Gaussian residuals while a deep transformer predictor handles trajectory-level structure.
- **Pretrained-model finetuning**: initializes from flow-matching backbones with a mean-alignment auxiliary loss to avoid catastrophic forgetting.
- **Fast learned denoiser**: distills score-based trajectory refinement into one forward pass for large speedups.

## Methodology

NTM uses an invertible shared transporter f_T to map both noisy and cleaner states into u-space. A stochastic predictor f_P then models the cleaner u_s as a Gaussian conditioned on u_t. The composition gives an exact conditional normalizing flow for each reverse step, with log-likelihood computed by change of variables.

Training can occur from scratch over stochastic forward trajectories or by finetuning a pretrained flow-matching model. During sampling, the model proceeds through a few reverse steps and can apply trajectory score denoising using gradients of the exact NTM loss. A separate denoiser can later amortize the expensive refinement.

## Key Results

- From scratch, NTM reaches GenEval 0.82 and DPG-Bench 79.64 at 256x256 with only 4 denoising steps.
- Finetuned from FLUX.2-klein, NTM reaches DPG-Bench 83.38 at 512x512 with 4 steps.
- On ImageNet 256, NTM reaches FID 3.83 with 4 steps and 2.80 with 16 steps.
- The learned denoiser gives roughly 9x speedup while staying close to score-refined outputs.
- Removing the transporter collapses quality in few-step settings, confirming the importance of non-Gaussian transition modeling.

## Connections

- Extends [[flow-matching|flow matching]] by replacing simple Gaussian large-step reverse conditionals with exact-likelihood conditional flows.
- Related to [[representation-frechet-loss|Representation Fréchet Loss]] as another path to one-step or few-step high-quality generation.
- Complements [[energy-based-transformers|Energy-Based Transformers]]: both replace simple direct prediction with iterative or likelihood-based refinement.
- The exact-likelihood framing may be useful for uncertainty-aware [[world-models|world models]], though this paper focuses on image generation.

## Limitations & Open Questions

> [!open-question]
> Can NTM-style conditional flows scale to video and robot action-conditioned world models without prohibitive autoregressive decoding cost?

> [!open-question]
> What is the best balance between exact likelihood, learned denoiser speed, and sample quality when deploying few-step generators?

## Future Work

- Apply distribution-level post-training (e.g., adversarial or perceptual losses) to further improve few-step generation quality while retaining exact trajectory likelihood.
- Scale NTM to higher image resolutions and explore the transporter-depth versus denoising-step tradeoff across the architecture spectrum.
- Pursue architectural designs—such as adaptive-depth transporters or progressive capacity allocation across timesteps—that push exact-likelihood generation toward single-step or even fewer-step sampling.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2605.08078)
- [arXiv](https://arxiv.org/abs/2605.08078)
