---
title: "DINOv3"
type: entity
created: 2026-08-25
updated: 2026-08-25
tags:
  - vision
  - self-supervised-learning
  - self-distillation
  - image-classification
sources:
  - "[[obsessed-encoder]]"
  - "[[delta-world]]"
  - "[[patch-policy]]"
  - "[[v-jepa-2-1]]"
  - "[[driftworld]]"
  - "[[better-slots-better-worlds]]"
aliases:
  - "DINO v3"
---

# DINOv3

## Overview

DINOv3 ([arXiv:2508.10104](https://arxiv.org/abs/2508.10104)) is Meta FAIR's industry-standard self-supervised vision encoder, scaled up to 7B parameters. It uses **self-distillation**: a student network matches an [[ema|EMA]] of itself, with Sinkhorn-Knopp centering keeping teacher outputs statistically balanced and a KoLeo term pushing each embedding away from its nearest neighbor. Gram anchoring is a later-phase addition in the flagship pipeline. The reference ImageNet recipe is `vitl_im1k_lin834` (ViT-L/16).

## Role in This Wiki

DINO-family features are the dominant frozen-backbone choice across the wiki's control and generation work:

- [[delta-world|DeltaWorld]] operates entirely in frozen DINOv3 feature space; DeltaTok compresses each frame's change to one delta token, beating Cosmos at 2,000x fewer FLOPs
- [[patch-policy|Patch Policy]] freezes DINOv3 (alongside DINOv2, WebSSL, V-JEPA 2, SigLIP 2) as one of five backbones for direct robot control
- [[v-jepa-2-1|V-JEPA 2.1]] cites DINOv3's 7B results as evidence for scaling vision transformers further
- [[obsessed-encoder|The Obsessed Encoder]] trains DINOv3 from scratch and shows a faint predictable watermark collapses its representation despite the full defense stack - see [[feature-suppression]]
- [[driftworld|DriftWorld]] uses DINOv3 feature maps as a training-time semantic loss space for sharp action-conditioned video rollouts.
- [[better-slots-better-worlds|Better Slots Better Worlds]] uses DINOv3 as the frozen visual foundation for SlotContrast-WM and finds that pretrained features contribute substantially to robustness under appearance shifts.

## Connections

- Predecessor DINOv2 remains the frozen backbone in [[dino-wm|DINO-WM]], [[repa|REPA]], and [[dense-visual-representations]]
- Organization: Meta FAIR ([[meta-fair]], [[yann-lecun]])
