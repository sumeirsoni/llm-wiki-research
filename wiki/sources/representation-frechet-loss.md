---
title: "Representation Fréchet Loss for Visual Generation"
type: source
created: 2026-05-16
updated: 2026-07-11
arxiv_id: "2604.28190"
authors:
  - "Jiawei Yang"
  - "Yue Wang"
  - "Zhengyang Geng"
  - "Xuan Ju"
  - "Yonglong Tian"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2604.28190"
tags:
  - generative-modeling
  - diffusion
  - representation-learning
  - vision
  - benchmark
aliases:
  - "FD-loss"
  - "FDr_k"
---

# Representation Fréchet Loss for Visual Generation

## Summary

Representation Fréchet Loss turns Fréchet Distance from an evaluation metric into a practical post-training loss for visual generators. The central trick is to estimate large-population feature statistics with a queue or EMA while backpropagating only through the current batch, making direct distribution-level optimization feasible.

## Key Contributions

- **FD-loss**: directly optimizes Fréchet Distance in frozen representation spaces.
- **Population/gradient decoupling**: large effective statistics stabilize FD estimation without backpropagating through tens of thousands of samples.
- **Multi-representation optimization**: combines Inception, DINOv2, MAE, SigLIP, CLIP, and ConvNeXt-style feature spaces.
- **FDr_k metric**: normalizes Fréchet Distance against validation-vs-training distance across K representations.
- **One-step generator post-training**: improves existing one-step models and repurposes multi-step models into one-step generators.

## Methodology

FD-loss computes Fréchet Distance between real and generated feature distributions in a frozen representation space. Instead of estimating generated statistics from only the current batch, it maintains either a large feature queue or EMA estimates of generated first and second moments. During backpropagation, past features are detached and only the current batch receives gradients.

The method can optimize multiple representation spaces at once by normalizing each FD term by its current stop-gradient value. The proposed FDr_k evaluation metric averages normalized Fréchet Distance ratios across several representation models, reducing dependence on a single saturated feature space such as Inception-v3.

## Key Results

- EMA statistics with beta 0.999 outperform batch-only FD and queue variants while using less memory.
- Optimizing Inception gives extremely low FID but can misrank perceptual quality; modern representations improve FDr_k more reliably.
- FD-SIM, a multi-representation variant, improves FDr_6 with little Inception-FID tradeoff.
- A pretrained JiT-L/16 model with terrible naive one-step FID is converted into a strong one-step generator after FD-loss post-training.
- Human preferences favor FD-loss post-trained models over their bases, while still preferring real images over the best generated images.

## Connections

- Extends [[repa|REPA]]'s theme that frozen representation models can improve diffusion/generative training, but uses distribution-level Fréchet objectives instead of patchwise feature alignment.
- Pairs with [[elucidating-representation-degradation|Elucidating Representation Degradation]]: both study representation quality as a bottleneck in diffusion training.
- Related to [[self-flow|Self-Flow]], but keeps representations external rather than learning them intrinsically.
- The FDr_k argument reinforces that representation choice strongly shapes how generative quality is measured.

## Limitations & Open Questions

> [!open-question]
> Which set of representation models gives the most faithful FDr_k signal across domains beyond ImageNet?

> [!open-question]
> Can FD-loss be combined with intrinsic representation learning methods such as [[self-flow|Self-Flow]] or ERD-style recoverability weighting?

## Future Work

- Extend distribution-level post-training via FD-loss to other modalities, data-scarce settings where real samples are restricted during post-training, and generative paradigms beyond image generation.
- Study which representation spaces should define the Fréchet distance, since different feature extractors induce different notions of visual similarity and no single space captures perceptual quality fully.
- Develop distribution-level objectives and representation-diverse evaluation protocols for generative models once distributional distances become optimizable at scale.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2604.28190)
- [arXiv](https://arxiv.org/abs/2604.28190)
