---
title: "Representation Collapse"
type: concept
created: 2026-04-10
updated: 2026-04-10
tags:
  - representation-learning
  - self-supervised-learning
  - optimization
sources:
  - "[[lejepa]]"
  - "[[leworldmodel]]"
  - "[[rethinking-jepa]]"
  - "[[v-jepa-2-1]]"
aliases:
  - "Collapse"
  - "Mode collapse"
  - "Representation collapse"
---

# Representation Collapse

## Overview

Representation collapse occurs when a [[self-supervised-learning|self-supervised learning]] model learns to map all inputs to the same (or very similar) embedding, trivially minimizing the predictive loss. This is a fundamental problem in [[jepa|JEPA]] and contrastive learning — the model finds a degenerate shortcut rather than learning useful representations.

## Why It Happens

In JEPA, the model predicts masked embeddings from visible embeddings. The trivial solution: if both the encoder and predictor output constant vectors, the prediction loss is zero. The model has no incentive to learn meaningful representations.

## Prevention Mechanisms

The papers in this wiki offer four different approaches to preventing collapse:

### 1. EMA Teacher ([[v-jepa-2-1|V-JEPA 2.1]])
- Teacher network is an exponentially moving average of the student
- Teacher updates slowly, providing relatively stable targets
- Student can't collapse because teacher output evolves independently
- **Criticism**: [[lejepa|LeJEPA]] and [[rethinking-jepa|SALT]] argue this is a heuristic without theoretical justification

### 2. SIGReg Regularization ([[lejepa|LeJEPA]], [[leworldmodel|LeWM]])
- Explicitly regularize embeddings to follow an isotropic Gaussian distribution
- Theoretically motivated: isotropic Gaussian is provably optimal for downstream risk
- Linear time and memory complexity
- **Advantage**: No heuristics, single hyperparameter

### 3. Frozen Teacher ([[rethinking-jepa|SALT]])
- Pre-train teacher with pixel reconstruction, then freeze it
- Static targets guarantee no collapse — teacher can't degenerate
- **Advantage**: Decouples teacher and student optimization
- **Surprising finding**: Teacher quality barely matters

### 4. Multi-Layer Distillation ([[bootleg|Bootleg]])
- Distill from multiple hidden layers, not just the final layer
- Multi-scale targets are harder to collapse than single-scale
- **Advantage**: Richer supervision signal

## Open Debate

> [!contradiction]
> There is no consensus on the best approach. [[v-jepa-2-1|V-JEPA 2.1]] achieves SOTA with EMA, but [[rethinking-jepa|SALT]] outperforms V-JEPA 2 without EMA, and [[lejepa|LeJEPA]] provides theoretical arguments against EMA. The field is actively debating whether EMA is a feature or a crutch.

> [!open-question]
> Do these collapse prevention mechanisms interact? Could SIGReg + frozen teacher + multi-layer distillation be combined?
