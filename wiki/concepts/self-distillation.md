---
title: "Self-Distillation"
type: concept
created: 2026-04-10
updated: 2026-04-10
tags:
  - self-distillation
  - self-supervised-learning
  - representation-learning
sources:
  - "[[bootleg]]"
  - "[[v-jepa-2-1]]"
  - "[[rethinking-jepa]]"
aliases:
  - "Self-distillation"
  - "Knowledge distillation"
---

# Self-Distillation

## Overview

Self-distillation is a learning paradigm where a model learns from its own outputs or representations, typically through a teacher-student framework where the teacher is derived from the student itself (e.g., via [[ema|EMA]]). It is the primary training mechanism in [[jepa|JEPA]] and related SSL methods.

## Variants in This Wiki

### Final-Layer Distillation (Standard JEPA)
- Predict the **final layer** output of the teacher
- Used by I-JEPA, [[v-jepa-2-1|V-JEPA 2.1]] (alongside other innovations)
- **Pro**: Captures high-level semantics
- **Con**: Loses spatial/structural information; non-stationary targets cause instability

### Multi-Layer Distillation ([[bootleg|Bootleg]])
- Predict representations from **multiple hidden layers** of the teacher
- Captures features at multiple levels of abstraction
- **Pro**: Richer supervision, more stable training
- **Con**: More complex loss function

### Deep Self-Supervision ([[v-jepa-2-1|V-JEPA 2.1]])
- Apply the self-supervised objective at **multiple intermediate encoder layers**
- Similar in spirit to Bootleg's multi-layer idea but integrated differently
- **Pro**: Preserves spatial information throughout the network

### Frozen Teacher ([[rethinking-jepa|SALT]])
- Teacher trained once, then **frozen** — not self-distillation in the strict sense
- Student learns from static targets
- **Pro**: Stable targets, decoupled optimization
- **Finding**: Student quality is surprisingly robust to teacher quality

## The Instability Problem

A key challenge with self-distillation is target non-stationarity — because the teacher is derived from the student, the targets change as the student learns. This creates a moving-target problem that can cause:
- Training instability
- Oscillation
- [[representation-collapse|Collapse]]

Each paper addresses this differently:
- **EMA**: Slows teacher updates (partially stabilizes)
- **Frozen teacher** ([[rethinking-jepa|SALT]]): Eliminates non-stationarity entirely
- **Multi-layer** ([[bootleg|Bootleg]]): Adds redundancy to stabilize
- **Regularization** ([[lejepa|LeJEPA]]): Constrains the embedding space directly
