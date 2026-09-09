---
title: "Continuous language modeling"
type: concept
created: 2026-09-09
updated: 2026-09-09
tags:
  - language
  - flow-matching
  - generative-modeling
  - representation-learning
  - theory
sources:
  - "[[convergeflow]]"
  - "[[latent-reasoning-with-normalizing-flows]]"
  - "[[self-flow]]"
  - "[[normalizing-trajectory-models]]"
  - "[[jepa-paradox-in-language]]"
aliases:
  - "Continuous language models"
  - "Embedding-space language generation"
---

# Continuous language modeling

## Overview

Continuous language models generate or refine token representations in a continuous space before mapping them to discrete vocabulary items. This design supports parallel updates and flow or diffusion tools, but it creates an endpoint problem: a continuous state may finish between valid token embeddings.

## Endpoint structure matters

[[convergeflow|ConvergeFlow]] constrains each data prediction to the convex hull of the vocabulary embeddings. Its learned weights also include the exact Gaussian corruption kernel. The paper proves convergence to a vocabulary embedding under regularity conditions, so nearest-neighbor projection can decode the final state without a cross-entropy-trained decoder.

The fixed embedding matrix is a real constraint. The flow-matching MSE objective alone allows degenerate joint solutions when the embeddings are learned with the predictor. ConvergeFlow therefore uses the embedding matrix from LangFlow and trains the predictor around it. The result is a clean endpoint guarantee, but not a complete answer to joint continuous representation learning.

## Related continuous methods

[[latent-reasoning-with-normalizing-flows|NF-CoT]] uses autoregressive normalizing-flow latents for intermediate reasoning states. [[self-flow|Self-Flow]] uses unequal noise levels to create a self-supervised signal while training a generative model. [[normalizing-trajectory-models|Normalizing Trajectory Models]] enriches each few-step reverse transition with an exact-likelihood flow. These methods address different parts of the continuous-generation problem.

[[jepa-paradox-in-language|The JEPA Paradox in Language]] supplies a different warning. When one context has several valid targets, deterministic squared-error prediction can place the latent at their centroid. Preventing collapse and ensuring endpoint validity do not guarantee that one continuous target captures the conditional distribution.

## Open Questions

> [!open-question]
> Can a continuous objective learn both useful token embeddings and a convergent flow without fixing the embedding matrix?

> [!open-question]
> How should continuous language models represent multiple valid completions without losing the endpoint guarantee?
