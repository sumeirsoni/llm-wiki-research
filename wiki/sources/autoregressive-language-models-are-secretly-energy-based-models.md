---
title: "Autoregressive Language Models are Secretly Energy-Based Models"
type: source
created: 2026-05-16
updated: 2026-07-11
arxiv_id: "2512.15605"
authors:
  - "Mathieu Blondel"
  - "Michaël E. Sander"
  - "Germain Vivier-Ardisson"
  - "Tianlin Liu"
  - "Vincent Roulet"
year: 2025
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2512.15605"
tags:
  - language
  - generative-modeling
  - theory
aliases:
  - "ARMs are Secretly EBMs"
---

# Autoregressive Language Models are Secretly Energy-Based Models

## Summary

This paper gives a theoretical bridge between autoregressive models (ARMs), energy-based models (EBMs), and maximum-entropy reinforcement learning. It shows that in function space, next-token models can represent globally normalized sequence distributions by implicitly encoding future value functions in their local logits.

## Key Contributions

- **ARM-EBM bijection**: derives an exact mapping between an EBM's reward/energy function and an ARM's next-token scoring function.
- **Soft Bellman connection**: shows the mapping is an explicit solution of the soft Bellman equation in a finite-horizon language-model MDP.
- **Teacher forcing equivalence**: proves that supervised ARM training and EBM training have equivalent optima in function space.
- **Distillation bounds**: bounds the KL divergence between an ARM and target EBM by the maximum logit error times sequence length.
- **Lookahead interpretation**: argues ARMs are not structurally myopic; practical failures come from approximation and optimization.

## Methodology

The paper defines EBMs over full responses and ARMs over next-token conditionals. Using the chain rule, it derives a recursive mapping where the ARM local score equals immediate reward plus the soft value of continuing from the next state. The inverse mapping subtracts that future value term.

This turns sequence modeling into an entropy-regularized dynamic-programming problem. Numerical experiments with synthetic tiny language models validate the theory because exact EBM partitions can be computed at small vocabulary and horizon sizes.

## Key Results

- The ARM-EBM mapping is bijective in function space and preserves the same conditional sequence distribution.
- The ARM's initial log-partition corresponds to the EBM sequence log-partition.
- Teacher forcing reaches equivalent minima to supervised EBM learning under perfect capacity and optimization.
- Synthetic experiments show ARM logits converge toward the optimal EBM-derived logits after applying the mapping.
- The KL bound clarifies how finite ARM approximation error accumulates over sequence length.

## Connections

- Provides a theory counterpart to [[energy-based-transformers|Energy-Based Transformers]], which builds explicit transformer EBMs for scalable iterative inference.
- Reframes RLHF/MaxEnt alignment as distilling an EBM-like optimal policy into an ARM.
- Relevant to [[self-supervised-learning|self-supervised learning]] because it defends next-token prediction as capable of learning global structure in principle.

## Limitations & Open Questions

> [!open-question]
> If ARMs can encode global lookahead in principle, which training signals or architectures best help finite transformers learn the required value functions?

> [!open-question]
> Does adding latent reasoning traces make the ARM approximation easier, or does it merely shift the EBM-to-ARM distillation problem into a larger space?

## Future Work

- Study how latent variables (thinking traces) affect the expressivity of autoregressive language models and ease of reaching the EBM-equivalent optimum.
- Build further bridges between autoregressive models, energy-based models, and maximum-entropy reinforcement learning communities.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2512.15605)
- [arXiv](https://arxiv.org/abs/2512.15605)
