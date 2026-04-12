---
title: "Flow Matching"
type: concept
created: 2026-04-10
updated: 2026-04-10
tags:
  - flow-matching
  - generative-modeling
sources:
  - "[[self-flow]]"
aliases:
  - "Flow matching"
  - "Continuous normalizing flows"
---

# Flow Matching

## Overview

Flow matching is a framework for training generative models by learning continuous transformations (flows) between noise distributions and data distributions. It is related to diffusion models but avoids the discretization of the denoising process, operating with continuous-time dynamics.

## In This Wiki

### [[self-flow|Self-Flow]]

Self-Flow is the first method to use flow matching for **self-supervised representation learning** alongside generation. The key innovation is **Dual-Timestep Scheduling**:

- Different tokens receive different noise levels
- Tokens with less noise provide context for denoising tokens with more noise
- This asymmetry forces the model to learn semantic representations to bridge the information gap
- Result: representations and generation quality emerge from the same training process

## Relation to JEPA

Flow matching and [[jepa|JEPA]] share a conceptual connection:
- Both create **information asymmetry** to drive representation learning
- JEPA masks regions in embedding space; Self-Flow applies heterogeneous noise
- Both force the model to infer missing information using semantic understanding

> [!open-question]
> Are JEPA and flow matching with Dual-Timestep Scheduling fundamentally equivalent under some transformation? Both create asymmetric information access patterns.

## Advantage Over External Representations

Standard flow matching / diffusion models rely on external representation models (CLIP, DINO) for semantic conditioning. Self-Flow eliminates this dependency:
- No external model training needed
- No objective misalignment
- Follows expected scaling laws (unlike external-model-dependent approaches)
