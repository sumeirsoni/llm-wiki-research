---
title: "Self-Supervised Learning"
type: concept
created: 2026-04-10
updated: 2026-09-04
tags:
  - self-supervised-learning
  - representation-learning
sources:
  - "[[causal-jepa]]"
  - "[[lejepa]]"
  - "[[leworldmodel]]"
  - "[[rethinking-jepa]]"
  - "[[bootleg]]"
  - "[[self-flow]]"
  - "[[v-jepa-2-1]]"
  - "[[global-geometry-is-not-enough]]"
  - "[[steerable-visual-representations]]"
  - "[[visreg]]"
  - "[[learn-from-your-own-latents]]"
  - "[[temporal-difference-vision]]"
  - "[[levljepa]]"
  - "[[intelligence-from-learnable-novelty]]"
  - "[[patch-policy]]"
  - "[[jepa-paradox-in-language]]"
  - "[[self-supervised-visual-on-policy-distillation]]"
  - "[[levjepa]]"
  - "[[predicting-order-upcoming-tokens]]"
aliases:
  - "SSL"
  - "Self-supervised learning"
---

# Self-Supervised Learning

## Overview

Self-supervised learning (SSL) is a paradigm where models learn representations from unlabeled data by solving pretext tasks derived from the data itself. The goal is to learn general-purpose representations that transfer well to downstream tasks without requiring large labeled datasets.

## Major Paradigms

### Generative Methods
Learn by **reconstructing raw inputs** from corrupted versions.

- **Examples**: [[mae|MAE]] (Masked Autoencoders), denoising autoencoders
- **Strengths**: Strong grounding in low-level data statistics
- **Weaknesses**: Computationally expensive for high-redundancy data (images/video); objective doesn't prioritize high-level features
- **In this wiki**: [[rethinking-jepa|SALT]] uses a generative teacher (Stage 1)

### Token-Level Auxiliary Objectives

[[token-order-prediction|Token Order Prediction (TOP)]] adds a second self-supervised target to next-token prediction. It ranks upcoming vocabulary items by proximity instead of predicting exact tokens at several future offsets. This gives language models a future-oriented training signal with one additional unembedding head. The initial study improves most of its eight benchmark tasks across 340M, 1.8B, and 7B models, but it does not yet test coding, summarization, or speculative decoding.

### Contrastive Methods
Learn by **distinguishing positive pairs from negative pairs** in embedding space.

- **Examples**: SimCLR, MoCo, DINO, CLIP, SigLIP — see [[contrastive-learning|Contrastive Learning]]
- **Strengths**: Strong semantic representations, scalable; dominant for vision-language pretraining
- **Weaknesses**: Require careful augmentation design, negative mining; batch-size dependent; optimize pooled global alignment — patch tokens supervised only as byproduct ([[levljepa|LeVLJEPA]] critique)

### Joint-Embedding Predictive ([[jepa|JEPA]])
Learn by **predicting masked embeddings** in latent space.

- **Examples**: I-JEPA, [[v-jepa-2-1|V-JEPA 2.1]], [[lejepa|LeJEPA]]
- **Efficient video example**: [[levjepa|LeVJEPA]] uses LeJEPA's SIGReg objective with sparse random token processing and block-causal attention
- **Strengths**: Focuses on semantic content, discards irrelevant low-level details
- **Weaknesses**: Susceptible to [[representation-collapse|representation collapse]]; deterministic point prediction can also be ill-posed when conditional targets remain multimodal, as argued by [[jepa-paradox-in-language|The JEPA Paradox in Language]]
- **In this wiki**: The primary focus — 6 of 7 papers are in or related to this paradigm

### Self-Supervised Behavioral Distillation

[[self-supervised-visual-on-policy-distillation|S²VOPD]] derives teacher privilege from unequal observations rather than labels: the teacher sees a clean image while the student acts from a degraded view. Its results show that augmentation can support behavioral on-policy distillation, but only when corruption preserves the task and correct answer.

### Self-Supervised Generative ([[self-flow|Self-Flow]])
Learn representations **within** the generative framework itself.

- **Examples**: [[self-flow|Self-Flow]] with Dual-Timestep Scheduling
- **Strengths**: Unifies representation learning and generation
- **Weaknesses**: Newer approach, less established

### Bounded-Observer Objectives
Learn representations by maximizing structure recoverable by a deliberately capacity-limited observer.

- **Example**: [[intelligence-from-learnable-novelty|Intelligence from Learnable Novelty]] trains an encoder to maximize [[learnable-novelty|learnable novelty]] under a frozen random reservoir and ridge readout
- **Strengths**: Requires no labels, augmentations, negatives, masking, reconstruction target, or teacher network
- **Weaknesses**: The learned structure depends directly on observer architecture and regularization; evidence is currently limited to [[mnist|MNIST]]

## Key Challenges

1. **[[representation-collapse|Representation collapse]]** — embeddings converge to trivial solutions
2. **Evaluation** — how to fairly compare SSL methods across downstream tasks
3. **Scaling behavior** — do all paradigms scale equally well?
4. **Multi-modality** — how to learn unified representations across modalities
5. **Functional sensitivity** — whether embeddings respond to structured input changes and task prompts, not just whether their global geometry looks healthy

## Current Trends (from this wiki)

- **Removing heuristics**: [[lejepa|LeJEPA]] eliminates EMA, stop-gradient, and schedulers
- **Efficient video without heuristics**: [[levjepa|LeVJEPA]] extends this recipe to video, using 95% token dropping and causal attention while retaining competitive appearance and motion transfer
- **Dense features**: [[v-jepa-2-1|V-JEPA 2.1]] and [[bootleg|Bootleg]] emphasize spatial information; [[patch-policy|Patch Policy]] shows that frozen SSL patch tokens can transfer directly to lightweight robot policies when their [[dense-visual-representations|spatial structure]] is retained
- **World models**: [[causal-jepa|Causal-JEPA]] and [[leworldmodel|LeWorldModel]] learn dynamics, not just static representations
- **Unifying generation and representation**: [[self-flow|Self-Flow]] integrates both
- **Beyond static geometry**: [[global-geometry-is-not-enough|Global Geometry Is Not Enough]] and [[steerable-visual-representations|Steerable Visual Representations]] shift attention toward functional sensitivity and prompt-steerable representations
- **Latent vs. token learning**: [[learn-from-your-own-latents|Learn from your own latents]] proves latent prediction can be exponentially more sample-efficient than token-level SSL on hierarchical data
- **Non-contrastive vision-language**: [[levljepa|LeVLJEPA]] extends SIGReg + cross-modal prediction to image–text pretraining without CLIP-style negatives; strongest on dense patch features for VLM backbones
- **JEPA regularization advances**: [[visreg|VISReg]] refines collapse prevention with decoupled scale/shape regularization and strong OOD transfer
- **Minimal-assumption SSL**: [[temporal-difference-vision|TDV]] removes even augmentation/masking biases, learning from video via causal next-frame prediction alone
- **Latent dynamics for transformers**: [[next-latent-prediction|NextLat]] adds belief-state pressure to next-token training via self-supervised hidden-state prediction
- **Future-token ranking**: [[token-order-prediction|TOP]] adds a listwise proximity target to next-token training; unlike MTP, its auxiliary head does not grow with the look-ahead window
- **Observer-relative objectives**: [[intelligence-from-learnable-novelty|Learnable Novelty]] organizes a label-free [[mnist|MNIST]] representation by maximizing structure recoverable through a bounded random-feature observer
