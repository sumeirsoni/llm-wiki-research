---
title: "Iterative Refinement"
type: concept
created: 2026-05-17
updated: 2026-06-09
tags:
  - transformer
  - language
  - optimization
  - theory
  - generative-modeling
sources:
  - "[[attractor-models]]"
  - "[[generative-recursive-reasoning]]"
  - "[[hyperloop-transformers]]"
  - "[[energy-based-transformers]]"
  - "[[probabilistic-tiny-recursive-model]]"
  - "[[equilibrium-reasoners]]"
  - "[[arc-is-a-vision-problem]]"
  - "[[latent-reasoning-with-normalizing-flows]]"
  - "[[pretraining-recurrent-networks-without-recurrence]]"
aliases:
  - "Latent thinking"
  - "Architectural recurrence"
  - "Fixed-point refinement"
---

# Iterative Refinement

## Overview

Iterative refinement is a family of model designs where prediction is improved through repeated latent computation rather than a single feed-forward pass. In this wiki, it appears in looped transformers, fixed-point attractor models, stochastic recursive reasoning, and energy-based inference.

## Patterns

### Explicit Loops

[[hyperloop-transformers|Hyperloop Transformers]] reuse a middle transformer block multiple times and add loop-level hyper-connections. This gives parameter efficiency and lower perplexity than a larger vanilla transformer, but the computation is still explicitly unrolled.

### Fixed Points

[[attractor-models|Attractor Models]] solve for a fixed point in tied output-embedding space using an attractor module initialized from a backbone proposal. Training uses implicit differentiation, so memory in the recurrent block does not grow with solver iterations.

### Energy Minimization

[[energy-based-transformers|Energy-Based Transformers]] refine candidate predictions by gradient descent on a learned energy function. This turns inference into optimization and gives a natural way to spend more compute on difficult predictions.

### Stochastic Multi-Trajectory Recursion

[[generative-recursive-reasoning|GRAM]] extends Recursive Reasoning Models with learned stochastic high-level transitions. Instead of one deterministic latent path, GRAM samples multiple reasoning trajectories and scales inference by both depth (more supervision steps) and width (parallel trajectory samples). This helps on multi-solution tasks where deterministic RRMs mode-collapse.

### Attractor Landscapes

[[equilibrium-reasoners|Equilibrium Reasoners]] treat HRM/TRM-style models as dynamical systems with task-conditioned attractors. Segmented Online Training, randomized initialization, and noise injection shape the landscape so depth and breadth scaling converge to correct solutions; fixed-point residual becomes a verifier.

### Inference-Time Width Scaling

[[probabilistic-tiny-recursive-model|PTRM]] adds retraining-free width scaling to TRM by injecting noise during parallel rollouts and selecting candidates with the pretrained Q-head. It complements training-time stochastic methods like GRAM.

### Vision-Centric Reasoning ([[arc-is-a-vision-problem|VARC]])

Vision ARC reframes abstract reasoning as image-to-image translation with visual priors (canvas, 2D RoPE, scale/translation augmentation) rather than language-token sequences. A 18M ViT trained from scratch on ARC data matches average human performance, suggesting that visual inductive biases can substitute for LLM-scale pre-training on abstraction benchmarks.

### Continuous Latent CoT ([[latent-reasoning-with-normalizing-flows|NF-CoT]])

NF-CoT replaces verbose textual Chain-of-Thought with autoregressive normalizing-flow latents that preserve tractable likelihoods, KV-cache compatibility, and direct RL optimization. Continuous thoughts occupy the same causal stream as answer tokens, enabling efficient probabilistic reasoning without iterative diffusion.

### Supervised Memory Training ([[pretraining-recurrent-networks-without-recurrence|SMT]])

SMT trains nonlinear RNNs without BPTT by using a Transformer teacher to generate optimal memory labels, then supervising one-step memory transitions. This decouples memory representation from dynamics, enabling time-parallel training with O(1) credit paths and fixed-memory inference — combining Transformer training efficiency with RNN expressivity.

## Key Tension

The central tradeoff is between extra computation and useful refinement. Attractor Models complicate this story with **equilibrium internalization**: the model learns to make the first proposal close to the fixed point, so iterative refinement shapes training but may add little at inference. GRAM adds a complementary axis: **width-based scaling** can explore multiple hypotheses in parallel rather than only refining one trajectory deeper.

## Open Questions

> [!open-question]
> When does iterative latent computation produce genuinely new reasoning ability, and when does it act mainly as a training-time regularizer?

> [!open-question]
> Can fixed-point or energy-based refinement be made efficient enough for long-context language models and real-time [[world-models|world models]]?
