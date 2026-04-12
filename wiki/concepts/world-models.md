---
title: "World Models"
type: concept
created: 2026-04-10
updated: 2026-04-10
tags:
  - world-model
  - representation-learning
  - reinforcement-learning
sources:
  - "[[causal-jepa]]"
  - "[[leworldmodel]]"
aliases:
  - "World model"
---

# World Models

## Overview

World models learn a **predictive model of environment dynamics** in a compact latent space. Rather than planning in raw pixel/observation space, agents can imagine future states by rolling out the learned dynamics model in latent space, enabling faster and more efficient planning.

## JEPA-Based World Models

Two papers in this wiki apply [[jepa|JEPA]] to world modeling:

### [[causal-jepa|Causal-JEPA (C-JEPA)]]
- **Focus**: Object-level interactions and causal reasoning
- **Key idea**: Object-level masking forces the model to predict object states from other objects, inducing causal structure
- **Planning**: Uses 1% of the latent features of patch-based world models
- **Evaluation**: Visual QA (counterfactual reasoning), agent control

### [[leworldmodel|LeWorldModel (LeWM)]]
- **Focus**: Stable end-to-end training from pixels
- **Key idea**: Uses [[lejepa|LeJEPA]]'s SIGReg regularizer for collapse-free training with minimal loss terms
- **Planning**: 48x faster than foundation-model-based world models
- **Evaluation**: 2D/3D control tasks, physical quantity probing, surprise detection

## Key Differences

| Aspect | [[causal-jepa\|C-JEPA]] | [[leworldmodel\|LeWM]] |
|--------|---------|------|
| **Input** | Object representations | Raw pixels |
| **Masking** | Object-level | Temporal (next-step prediction) |
| **Collapse prevention** | Object masking structure | SIGReg regularizer |
| **Scale** | Small models | ~15M parameters, single GPU |
| **Causal reasoning** | Explicit (formal analysis) | Implicit (latent structure) |

## Relation to V-JEPA

[[v-jepa-2-1|V-JEPA 2.1]] is not explicitly a world model but learns representations that are highly effective for action anticipation and robotic control — tasks that implicitly require world modeling. The boundary between "representation learning" and "world modeling" is blurry in the JEPA framework.

> [!open-question]
> Is there an optimal level of abstraction for world model latent spaces? Object-level ([[causal-jepa|C-JEPA]]) vs. patch-level ([[leworldmodel|LeWM]]) vs. dense token-level ([[v-jepa-2-1|V-JEPA 2.1]])?
