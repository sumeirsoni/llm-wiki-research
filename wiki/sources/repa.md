---
title: "REPA: Representation Alignment for Generation"
type: source
created: 2026-04-12
updated: 2026-04-12
arxiv_id: "2410.06940"
authors:
  - "Sihyun Yu"
  - "Sangkyung Kwak"
  - "Huiwon Jang"
  - "Jongheon Jeong"
  - "Jonathan Huang"
  - "Jinwoo Shin"
  - "Saining Xie"
year: 2024
venue: "ICLR 2025 (Oral)"
tags:
  - flow-matching
  - diffusion
  - representation-learning
  - self-supervised-learning
  - vision
  - transformer
code_url: "https://github.com/sihyun-yu/REPA"
project_url: "https://sihyun.me/REPA"
aliases:
  - "REPA"
  - "Representation Alignment"
---

# REPA: Representation Alignment for Generation

## Summary

REPA (REPresentation Alignment) proposes a simple regularization technique that aligns the internal representations of diffusion transformers with those from **pretrained frozen visual encoders** (e.g., DINOv2). The key insight: learning high-quality internal representations is a major bottleneck in training diffusion models, and this can be bypassed by distilling external representations into the generative model.

## Key Contributions

- **Identifies the representation bottleneck**: Shows that diffusion models learn weaker representations than dedicated SSL methods (DINOv2, CLIP) — this "semantic gap" slows training
- **REPA regularization**: Aligns diffusion transformer hidden states with frozen visual encoder representations via a simple projection head + similarity loss
- **17.5x faster training**: SiT-XL/2 achieves FID 7.9 in <400K iterations vs. 7M for vanilla (FID 8.3)
- **State-of-the-art generation**: Achieves FID 1.42 on ImageNet 256×256 (vs. 2.06 for vanilla SiT-XL/2)
- **Early-layer alignment**: Only aligning early layers (e.g., layer 8) is optimal — later layers focus on high-frequency details

## Methodology

REPA adds a regularization loss to diffusion transformer training:

1. **Clean image → frozen encoder**: Get representation $y^* = f(x^*)$ from pretrained visual encoder (DINOv2, CLIP, etc.)
2. **Noisy latent → diffusion transformer**: Get hidden state $h_t = f_\theta(z_t)$ from the diffusion model processing noisy input
3. **Project and align**: Train a projection head to align $h_t$ with $y^*$ via patch-wise similarity loss
4. **Combined objective**: $L = L_{velocity} + \lambda L_{REPA}$

The key insight is aligning representations of the **noisy input** (what the diffusion model sees) with representations of the **clean image** (what the encoder sees). This forces the diffusion model to "see through" the noise semantically.

## Key Results

- **Training speedup**: >17.5x faster convergence to same FID
- **ImageNet 256×256**: FID 1.42 (SOTA at time of publication)
- **Representation quality**: Significantly higher linear probing accuracy and CKNNA alignment scores
- **Generalizes**: Works across model sizes, encoder choices, and extends to text-to-image (MS-COCO)

## Connections

- **Reverse of [[rethinking-jepa|SALT]]**: SALT aligns visual encoder → frozen generative teacher; REPA aligns generative model → frozen visual encoder
- Related to [[self-flow|Self-Flow]]'s thesis that generation and representation should be unified — but REPA uses external representations while Self-Flow learns them jointly
- Uses encoders like DINOv2 which are related to the [[jepa|JEPA]] family of methods
- Demonstrates that discriminative representations can directly improve generative models

> [!insight]
> REPA and SALT form a symmetric pair: both bridge generative and discriminative learning, but in opposite directions. REPA makes diffusion models more like visual encoders; SALT makes visual encoders learn from generative objectives.

## Limitations & Open Questions

> [!open-question]
> Why is early-layer-only alignment optimal? What happens in later layers that makes full-depth alignment counterproductive?

> [!open-question]
> Could REPA be combined with Self-Flow's Dual-Timestep Scheduling for even better results — external guidance + internal representation learning?

> [!open-question]
> How do REPA-trained diffusion models compare to JEPA methods as feature extractors for downstream tasks?

## Links

- [arXiv](https://arxiv.org/abs/2410.06940)
- [GitHub](https://github.com/sihyun-yu/REPA)
- [Project Page](https://sihyun.me/REPA)
