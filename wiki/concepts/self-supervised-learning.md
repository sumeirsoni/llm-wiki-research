---
title: "Self-Supervised Learning"
type: concept
created: 2026-04-10
updated: 2026-04-10
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

### Contrastive Methods
Learn by **distinguishing positive pairs from negative pairs** in embedding space.

- **Examples**: SimCLR, MoCo, CLIP
- **Strengths**: Strong semantic representations, scalable
- **Weaknesses**: Require careful augmentation design, negative mining

### Joint-Embedding Predictive ([[jepa|JEPA]])
Learn by **predicting masked embeddings** in latent space.

- **Examples**: I-JEPA, [[v-jepa-2-1|V-JEPA 2.1]], [[lejepa|LeJEPA]]
- **Strengths**: Focuses on semantic content, discards irrelevant low-level details
- **Weaknesses**: Susceptible to [[representation-collapse|representation collapse]]
- **In this wiki**: The primary focus — 6 of 7 papers are in or related to this paradigm

### Self-Supervised Generative ([[self-flow|Self-Flow]])
Learn representations **within** the generative framework itself.

- **Examples**: [[self-flow|Self-Flow]] with Dual-Timestep Scheduling
- **Strengths**: Unifies representation learning and generation
- **Weaknesses**: Newer approach, less established

## Key Challenges

1. **[[representation-collapse|Representation collapse]]** — embeddings converge to trivial solutions
2. **Evaluation** — how to fairly compare SSL methods across downstream tasks
3. **Scaling behavior** — do all paradigms scale equally well?
4. **Multi-modality** — how to learn unified representations across modalities

## Current Trends (from this wiki)

- **Removing heuristics**: [[lejepa|LeJEPA]] eliminates EMA, stop-gradient, and schedulers
- **Dense features**: [[v-jepa-2-1|V-JEPA 2.1]] and [[bootleg|Bootleg]] emphasize spatial information
- **World models**: [[causal-jepa|Causal-JEPA]] and [[leworldmodel|LeWorldModel]] learn dynamics, not just static representations
- **Unifying generation and representation**: [[self-flow|Self-Flow]] integrates both
