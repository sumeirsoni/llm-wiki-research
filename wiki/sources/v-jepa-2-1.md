---
title: "V-JEPA 2.1: Unlocking Dense Features in Video Self-Supervised Learning"
type: source
created: 2026-04-10
updated: 2026-04-10
arxiv_id: "2603.14482"
authors:
  - "Lorenzo Mur-Labadia"
  - "Matthew Muckley"
  - "Amir Bar"
  - "Mido Assran"
  - "Koustuv Sinha"
  - "Mike Rabbat"
  - "Yann LeCun"
  - "Nicolas Ballas"
  - "Adrien Bardes"
year: 2025
venue: "Meta FAIR"
tags:
  - jepa
  - self-supervised-learning
  - video
  - vision
  - representation-learning
  - self-distillation
  - ema
  - segmentation
  - depth-estimation
  - object-detection
pdf_path: "raw/V-JEPA 2.1_ Unlocking Dense Features in Video Self-Supervised Learning.pdf"
aliases:
  - "V-JEPA 2.1"
---

# V-JEPA 2.1: Unlocking Dense Features in Video Self-Supervised Learning

## Summary

V-JEPA 2.1 is a family of self-supervised models from [[meta-fair|Meta FAIR]] that learns **dense, high-quality visual representations** for both images and videos while retaining strong global scene understanding. It combines four key innovations: dense predictive loss, deep self-supervision, multi-modal tokenizers, and effective scaling.

## Key Contributions

- **Dense predictive loss**: Unlike standard JEPA which only evaluates on masked tokens, V-JEPA 2.1 applies the predictive loss to **all tokens** (both visible and masked), forcing every token to be spatially and temporally grounded
- **Deep self-supervision**: Applies the self-supervised objective **hierarchically across multiple intermediate encoder layers**, preserving local spatial information throughout the network
- **Multi-modal tokenizers**: Uses modality-specific tokenizers (2D for images, 3D for video) for unified image+video training without artifacts
- **Effective scaling**: Scales to 2B parameters (ViT-G) and 163M training images/videos
- **State-of-the-art** on dense and global tasks simultaneously

## Methodology

V-JEPA 2.1 builds on the [[jepa|JEPA]] framework with four modifications:

1. **Dense predictive loss**: Standard JEPA only computes loss on masked tokens. V-JEPA 2.1 computes loss on ALL tokens — both visible context and masked tokens must be predicted accurately. This prevents the model from treating visible tokens as "free" context and forces explicit spatial/temporal grounding.

2. **Deep self-supervision**: Rather than only distilling from the final encoder layer (as in [[jepa|I-JEPA]]), the self-supervised objective is applied at multiple intermediate layers. This is qualitatively similar to [[bootleg|Bootleg]]'s multi-layer distillation, ensuring spatial information from early layers is preserved.

3. **Multi-modal tokenizers**: Separate 2D (image) and 3D (video) tokenizers enable unified training without treating images as single-frame videos (which introduces artifacts).

4. **Scaling**: ViT-G architecture (2B parameters), 163M training images/videos.

## Key Results

| Benchmark | Metric | Score |
|-----------|--------|-------|
| Ego4D (short-term anticipation) | mAP | 7.71 |
| EPIC-KITCHENS (action anticipation) | Recall@5 | 40.8 |
| Real-robot grasping | Success rate improvement | +20pts over V-JEPA-2 AC |
| TartanDrive (robotic navigation) | ATE | 5.687 |
| NYUv2 (depth estimation, linear probe) | RMSE | 0.307 |
| Something-Something-V2 (recognition) | Accuracy | 77.7 |

## Connections

- The latest and most capable model in the [[jepa|JEPA]] family from [[meta-fair|Meta FAIR]]
- **Deep self-supervision** is closely related to [[bootleg|Bootleg]]'s multi-layer distillation idea — both papers independently arrive at the importance of intermediate-layer supervision
- Still uses [[ema|EMA]]-based self-distillation, which [[rethinking-jepa|SALT]] and [[lejepa|LeJEPA]] argue is unnecessary
- Demonstrates the value of dense features — [[causal-jepa|Causal-JEPA]] shows that object-level representations can be even more efficient for planning
- Key researchers: [[yann-lecun|Yann LeCun]], Adrien Bardes, Mido Assran

> [!contradiction]
> V-JEPA 2.1 continues to use EMA-based self-distillation, while [[rethinking-jepa|SALT]] shows that a frozen teacher can outperform V-JEPA 2 on frozen backbone evaluation. This contradiction suggests the EMA debate is not settled.

## Limitations & Open Questions

> [!open-question]
> Would replacing EMA with SALT's frozen teacher or LeJEPA's SIGReg improve V-JEPA 2.1's already strong results?

> [!open-question]
> How much of the performance comes from scale (2B parameters, 163M data) vs. the architectural innovations?

## Links

- [arXiv](https://arxiv.org/abs/2603.14482)
- [GitHub](https://github.com/facebookresearch/vjepa2)
