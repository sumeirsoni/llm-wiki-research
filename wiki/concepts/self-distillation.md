---
title: "Self-Distillation"
type: concept
created: 2026-04-10
updated: 2026-07-06
tags:
  - self-distillation
  - self-supervised-learning
  - representation-learning
sources:
  - "[[bootleg]]"
  - "[[v-jepa-2-1]]"
  - "[[rethinking-jepa]]"
  - "[[foveal-ssl]]"
  - "[[on-policy-representation-distillation]]"
  - "[[on-the-geometry-of-on-policy-distillation]]"
  - "[[is-one-layer-enough-rl-training]]"
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

### Sequential-to-Global Distillation ([[foveal-ssl|Foveal SSL]])
- Extends DINO to **iterative/recurrent** architectures
- Teacher processes full view; student processes **sequence of local glimpses**
- Student output at **every step** compared to teacher's final-step target
- **Key**: Stop-gradients between steps — no BPTT needed
- **Pro**: Enables constant-compute processing at any resolution
- **Finding**: Performance improves monotonically with each step, confirming effective memory accumulation

### On-Policy Representation Distillation ([[on-policy-representation-distillation|OPRD]])
- Lifts on-policy distillation from **output-space KL** to **hidden-state MSE** alignment
- Supervises student intermediate representations against teacher hidden states on the student's own rollouts
- **Pro**: Zero-variance deterministic gradients; bypasses LM-head information bottleneck; monotonic late-stage improvement
- **Finding**: Closes student–teacher gap on math reasoning where output-space OPD stagnates; 1.44× faster and 32–54% less GPU memory

### Parameter-Space Geometry of OPD ([[on-the-geometry-of-on-policy-distillation|OPD Geometry]])
- Characterizes on-policy distillation updates in **parameter space** relative to SFT and RLVR
- OPD occupies a "relaxed off-principal regime" with **subspace locking** — updates rapidly enter a low-dimensional, functionally sufficient channel
- **Finding**: Objective composition (not token density or rollout policy) controls the update trajectory; early rank-16 subspace is sufficient for OPD but not SFT

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

## Layer Heterogeneity in Post-Training

Beyond self-distillation variants, transformer layers play markedly different roles during LLM post-training:

- **SFT**: Layer-wise importance sampling (LISA, MISA) and gradient-guided selection (AdaGradSelect) exploit uneven adaptation across depth.
- **RLVR**: [[is-one-layer-enough-rl-training|Is One Layer Enough?]] shows a single layer can match or exceed full-parameter GRPO; [[layer-contribution-rl|layer contribution]] concentrates in middle layers with stable rankings across datasets and tasks.
- **Distillation**: [[on-policy-representation-distillation|OPRD]] supervises all 28 layers uniformly, while [[on-the-geometry-of-on-policy-distillation|OPD geometry]] shows updates lock into a low-dimensional subspace regardless of layer.

The consistent theme: pretrained LLMs possess **stable layer-wise structural organization** that uniform full-parameter training does not exploit.
