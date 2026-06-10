---
title: "World Models"
type: concept
created: 2026-04-10
updated: 2026-05-20
tags:
  - world-model
  - representation-learning
  - reinforcement-learning
sources:
  - "[[causal-jepa]]"
  - "[[leworldmodel]]"
  - "[[sub-jepa]]"
  - "[[reconstruction-or-semantics-robotic-world-models]]"
  - "[[world-model-for-robot-learning-survey]]"
  - "[[world-action-models]]"
  - "[[convergent-world-representations-and-divergent-tasks]]"
aliases:
  - "World model"
---

# World Models

## Overview

World models learn a **predictive model of environment dynamics** in a compact latent space or observation space. Rather than planning only from the current observation, agents can imagine future states by rolling out learned dynamics, enabling planning, policy evaluation, and data generation.

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

### [[sub-jepa|Sub-JEPA]]
- **Focus**: Better regularization geometry for end-to-end JEPA world models
- **Key idea**: Applies Gaussian regularization in multiple frozen low-dimensional subspaces instead of the full ambient embedding space
- **Planning**: Improves over LeWM across Two-Room, Reacher, PushT, and OGB-Cube
- **Mechanism**: Lets latent geometry contract toward task-intrinsic dimensionality while avoiding collapse

## Key Differences

| Aspect | [[causal-jepa\|C-JEPA]] | [[leworldmodel\|LeWM]] | [[sub-jepa\|Sub-JEPA]] |
|--------|---------|------|------|
| **Input** | Object representations | Raw pixels | Raw pixels |
| **Masking / prediction** | Object-level | Temporal next-step latent prediction | Temporal next-step latent prediction |
| **Collapse prevention** | Object masking structure | Full-space SIGReg | Subspace Gaussian regularization |
| **Geometry bias** | Object-centric structure | Isotropic ambient Gaussian | Low-dimensional projected Gaussianity |
| **Causal/control focus** | Explicit causal analysis | Efficient latent planning | Planning with intrinsic-dimensional latent geometry |

## Robot World Models

Recent robot-focused sources broaden the page beyond JEPA:

- [[world-model-for-robot-learning-survey|World Model for Robot Learning]] surveys world models as policy components, learned simulators, evaluators, and robotic video generators.
- [[world-action-models|World Action Models]] defines WAMs as joint models of future states and actions, bridging reactive VLA policies and predictive world models.
- [[reconstruction-or-semantics-robotic-world-models|Reconstruction or Semantics]] shows that semantic latents such as V-JEPA 2.1, Web-DINO, and SigLIP 2 can outperform VAE-style reconstruction latents for action recovery and policy-in-the-loop evaluation.
- [[convergent-world-representations-and-divergent-tasks|Convergent World Representations and Divergent Tasks]] studies how multi-task pretraining builds shared world geometry in LLMs and how fine-tuning can fracture it when tasks are divergent.

## Relation to V-JEPA

[[v-jepa-2-1|V-JEPA 2.1]] is not explicitly a world model but learns representations that are highly effective for action anticipation and robotic control — tasks that implicitly require world modeling. The boundary between "representation learning" and "world modeling" is blurry in the JEPA framework.

> [!open-question]
> Is there an optimal level of abstraction for world model latent spaces? Object-level ([[causal-jepa|C-JEPA]]) vs. patch-level ([[leworldmodel|LeWM]]) vs. dense token-level ([[v-jepa-2-1|V-JEPA 2.1]])?

> [!open-question]
> Should robot world models explicitly generate pixels/videos, predict only semantic latents, or jointly model future states and actions as [[world-action-models|WAMs]]?
