---
title: "Contrastive Learning"
type: concept
created: 2026-07-03
updated: 2026-07-03
tags:
  - contrastive-learning
  - self-supervised-learning
  - representation-learning
  - vision
  - multi-modal
sources:
  - "[[levljepa]]"
  - "[[repa]]"
  - "[[steerable-visual-representations]]"
  - "[[reconstruction-or-semantics-robotic-world-models]]"
  - "[[self-supervised-learning]]"
aliases:
  - "Contrastive SSL"
  - "Instance discrimination"
---

# Contrastive Learning

## Overview

Contrastive learning is a [[self-supervised-learning|SSL]] paradigm that learns embeddings by **pulling positive pairs together** and **pushing negatives apart** in representation space. It dominated vision SSL before [[jepa|JEPA]] and remains the default for vision-language pretraining (CLIP, SigLIP).

Unlike [[jepa|JEPA]], which predicts masked latents, contrastive methods optimize **relative similarity structure** — typically via InfoNCE or sigmoid losses over augmented views or caption pairs.

## Canonical Methods

| Method | Key idea | Strength |
|--------|----------|----------|
| **SimCLR** | Large-batch InfoNCE with strong augmentations | Simple, strong ImageNet linear eval |
| **MoCo** | Momentum queue of negative keys | Decouples batch size from negatives |
| **DINO** | Self-distillation with centering; no explicit negatives | Strong dense features; ViT-friendly |
| **CLIP / SigLIP** | Image-text contrastive alignment | Scalable multimodal representations |

These methods are **reference baselines** in the wiki rather than primary ingested sources — they appear when JEPA and semantic-latent papers compare against established SSL.

## How Contrastive Differs from JEPA

| Axis | Contrastive | [[jepa|JEPA]] |
|------|-------------|----------------|
| **Objective** | Similarity of views / pairs | Prediction of masked embeddings |
| **Negatives** | Often required (InfoNCE) or implicit (DINO) | Not used in standard JEPA |
| **Augmentations** | Critical design choice | Used in I/V-JEPA; reduced in [[temporal-difference-vision|TDV]] |
| **Dense features** | Often byproduct of global pooling objective | Explicit in [[v-jepa-2-1|V-JEPA 2.1]], [[levljepa|LeVLJEPA]] |
| **Collapse prevention** | Negative samples, momentum, centering | [[ema|EMA]], SIGReg, masking structure |

## Role in This Wiki

### Baseline for JEPA claims

[[levljepa|LeVLJEPA]] positions non-contrastive cross-modal JEPA as producing **stronger dense patch features** than CLIP/SigLIP for frozen VLM backbones and segmentation — despite weaker zero-shot classification. This inverts the usual assumption that contrastive VL pretraining is uniformly superior.

### Semantic latents for robotics

[[reconstruction-or-semantics-robotic-world-models|Reconstruction or Semantics]] evaluates **SigLIP 2** alongside V-JEPA 2.1 and Web-DINO as semantic latents for robotic diffusion world models — contrastive pretraining is a viable latent source, not just a JEPA competitor.

### External encoder guidance

[[repa|REPA]] aligns diffusion transformers to **DINOv2** (self-distillation lineage, not pure InfoNCE contrastive) — showing that discriminative/semantic encoders from the contrastive/self-distillation family accelerate generative training.

### Steerable representations

[[steerable-visual-representations|Steerable Visual Representations]] adapts frozen visual encoders (often contrastive-pretrained) with language prompts — contrastive geometry is a substrate for controllable features.

## Strengths and Weaknesses

**Strengths**

- Mature scaling recipes for image and image-text pretraining
- Strong zero-shot retrieval and classification (CLIP)
- Well-understood collapse modes (collapse to constant, dimensional collapse)

**Weaknesses** (as argued by wiki JEPA sources)

- Batch-size and negative-mining sensitivity (SimCLR, MoCo)
- Global alignment may under-supervise patch tokens ([[levljepa|LeVLJEPA]] critique)
- Augmentation design encodes strong inductive biases
- Less natural fit for predictive world modeling than latent prediction ([[jepa|JEPA]], [[world-models|world models]])

## Open Questions

> [!open-question]
> Does the JEPA vs contrastive gap close at sufficient scale, or do the objectives learn fundamentally different geometry ([[representation-geometry|representation geometry]])?

> [!open-question]
> Can non-contrastive JEPA ([[levljepa|LeVLJEPA]]) match CLIP zero-shot while retaining superior dense features — or is there an inherent tradeoff?

> [!open-question]
> Should the wiki ingest primary SimCLR/MoCo/DINO source papers for direct benchmark tables against [[lejepa|LeJEPA]] and [[v-jepa-2-1|V-JEPA 2.1]]?

## Related Pages

- [[self-supervised-learning]] — paradigm overview
- [[jepa]] — predictive alternative
- [[ema]] — shared collapse-prevention mechanism (DINO, V-JEPA)
- [[representation-collapse]] — shared failure mode
- [[levljepa]] — non-contrastive vision-language JEPA vs CLIP/SigLIP
