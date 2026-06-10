---
title: "Energy-Based Models"
type: concept
created: 2026-05-16
updated: 2026-06-09
tags:
  - generative-modeling
  - theory
  - transformer
sources:
  - "[[energy-based-transformers]]"
  - "[[autoregressive-language-models-are-secretly-energy-based-models]]"
  - "[[attractor-models]]"
  - "[[augmented-lagrangian-predictive-coding]]"
aliases:
  - "EBM"
  - "Energy-based model"
---

# Energy-Based Models

## Overview

Energy-Based Models (EBMs) define compatibility with a scalar energy: lower energy means a candidate output is more plausible for a given input. In this wiki, EBMs matter because two new papers connect them to scalable transformers and language-model alignment.

## In This Wiki

### [[energy-based-transformers|Energy-Based Transformers]]

EBTs make the energy function explicit. A transformer scores candidate predictions, and inference refines candidates through gradient descent on that energy. This turns prediction into an optimization process and gives the model intrinsic mechanisms for dynamic compute, uncertainty, and self-verification.

### [[autoregressive-language-models-are-secretly-energy-based-models|Autoregressive LMs as EBMs]]

This theoretical paper shows that autoregressive models and EBMs are equivalent in function space. The ARM's next-token logits can implicitly encode the future value function needed to represent a globally normalized sequence distribution.

## Why It Matters

- EBMs provide an internal verifier rather than requiring a separate reward model or external evaluator.
- They offer a framework for "thinking longer" by spending more inference compute on difficult predictions.
- They connect language-model post-training, maximum-entropy RL, and generative modeling under a shared mathematical view.
- They may be useful for [[world-models|world models]], where planning can be framed as optimizing candidate states or actions under a learned energy.

## Neighboring Fixed-Point Models

[[attractor-models|Attractor Models]] are not EBMs, but they are adjacent: they also replace one-shot prediction with a refinement process. The distinction is that EBTs refine candidates by minimizing an explicit scalar energy, while Attractor Models solve for an activation fixed point in output-embedding space.

## Predictive Coding as Local Energy Minimization

[[augmented-lagrangian-predictive-coding|PC-ALM]] reframes predictive coding as augmented Lagrangian optimization over layer activations. Standard PC minimizes a local energy function with quadratic penalties; PC-ALM adds dual variables that accumulate prediction errors, enabling exact BP gradients at equilibrium and ballistic (rather than diffusive) credit propagation. This connects biologically plausible local learning to the same energy-minimization paradigm as EBMs.

## Open Questions

> [!open-question]
> Can explicit EBT-style architectures outperform standard autoregressive transformers at frontier scale, or is the practical advantage mostly in smaller/OOD regimes?

> [!open-question]
> If autoregressive models are already EBMs in function space, what training objective best helps finite models learn the implicit value functions needed for lookahead?
