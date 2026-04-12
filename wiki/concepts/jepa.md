---
title: "Joint-Embedding Predictive Architecture (JEPA)"
type: concept
created: 2026-04-10
updated: 2026-04-10
tags:
  - jepa
  - self-supervised-learning
  - representation-learning
  - architecture
sources:
  - "[[causal-jepa]]"
  - "[[lejepa]]"
  - "[[leworldmodel]]"
  - "[[rethinking-jepa]]"
  - "[[bootleg]]"
  - "[[v-jepa-2-1]]"
aliases:
  - "JEPA"
  - "I-JEPA"
  - "V-JEPA"
---

# Joint-Embedding Predictive Architecture (JEPA)

## Overview

JEPA is a family of [[self-supervised-learning|self-supervised learning]] architectures that learn representations by **predicting masked regions in latent (embedding) space** rather than in pixel/input space. The core idea, proposed by [[yann-lecun|Yann LeCun]], is that predicting abstract representations is more useful than predicting raw inputs: it forces the model to capture semantic structure rather than low-level statistics.

## How It Works

1. **Encoder** maps input (e.g., an image or video) to a sequence of latent embeddings
2. **Masking**: A portion of the input is masked (hidden from the encoder)
3. **Predictor** takes the embeddings of visible regions and predicts the embeddings of masked regions
4. **Target**: The prediction targets come from a teacher network (typically updated via [[ema|EMA]])
5. **Loss**: Computed in latent space — the predicted embeddings should match the target embeddings

## Key Distinction from Other SSL

| Approach | Predicts | Space | Example |
|----------|----------|-------|---------|
| **Generative** (MAE) | Raw pixels | Input space | [[mae|MAE]] |
| **Contrastive** (SimCLR) | Same vs. different | Embedding space | SimCLR, CLIP |
| **JEPA** | Masked embeddings | Latent space | I-JEPA, V-JEPA |

JEPA's advantage: predicting in latent space discards irrelevant low-level details and focuses on semantic content.

## The Collapse Problem

A fundamental challenge in JEPA training is [[representation-collapse|representation collapse]] — the model can trivially minimize the loss by mapping everything to the same embedding. Several mechanisms have been proposed to prevent this:

| Method | Collapse Prevention | Used By |
|--------|-------------------|---------|
| [[ema|EMA teacher]] | Slowly-updating teacher provides stable targets | [[v-jepa-2-1\|V-JEPA 2.1]], I-JEPA |
| [[lejepa\|SIGReg]] | Regularize embeddings to isotropic Gaussian | [[lejepa\|LeJEPA]], [[leworldmodel\|LeWM]] |
| Frozen teacher | Pre-trained, fixed teacher provides static targets | [[rethinking-jepa\|SALT]] |
| Multi-layer distillation | Distill from multiple hidden layers | [[bootleg\|Bootleg]] |

> [!open-question]
> Which collapse prevention mechanism is best? This is an active debate — [[lejepa|LeJEPA]] and [[rethinking-jepa|SALT]] both argue EMA is unnecessary, but [[v-jepa-2-1|V-JEPA 2.1]] achieves SOTA with EMA.

## JEPA Variants in This Wiki

### By Domain
- **Images**: I-JEPA (original), [[lejepa|LeJEPA]], [[bootleg|Bootleg]]
- **Video**: [[v-jepa-2-1|V-JEPA 2.1]], [[rethinking-jepa|SALT]]
- **World models**: [[causal-jepa|Causal-JEPA]], [[leworldmodel|LeWorldModel]]

### By Innovation
- **Theoretical foundations**: [[lejepa|LeJEPA]] (isotropic Gaussian theory + SIGReg)
- **Object-centric**: [[causal-jepa|Causal-JEPA]] (object-level masking)
- **Multi-layer**: [[bootleg|Bootleg]] (hidden layer distillation), [[v-jepa-2-1|V-JEPA 2.1]] (deep self-supervision)
- **Frozen teacher**: [[rethinking-jepa|SALT]]
- **End-to-end**: [[leworldmodel|LeWorldModel]] (from pixels, no EMA)
- **Dense features**: [[v-jepa-2-1|V-JEPA 2.1]] (all-token prediction)

## Key Open Questions

> [!open-question]
> Is JEPA fundamentally superior to generative or contrastive approaches, or does the gap close at sufficient scale?

> [!open-question]
> What is the optimal masking strategy? Grid-based patches vs. object-level ([[causal-jepa|Causal-JEPA]]) vs. heterogeneous noise ([[self-flow|Self-Flow]])?
