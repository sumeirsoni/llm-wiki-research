---
title: "Flow Matching"
type: concept
created: 2026-04-10
updated: 2026-04-12
tags:
  - flow-matching
  - generative-modeling
sources:
  - "[[self-flow]]"
  - "[[repa]]"
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

## Training Efficiency: External vs. Intrinsic Representations

Two approaches exist for learning representations in flow matching / diffusion models:

### External Alignment — [[repa|REPA]]

REPA accelerates diffusion transformer training by **aligning internal representations with frozen visual encoders** (DINOv2, CLIP):
- 17.5x faster training convergence
- State-of-the-art generation quality (FID 1.42 on ImageNet)
- Only early layers need alignment — later layers focus on high-frequency details

### Intrinsic Learning — [[self-flow|Self-Flow]]

Self-Flow learns representations **without external models** via Dual-Timestep Scheduling:
- No external model training needed
- No objective misalignment
- Follows expected scaling laws (unlike external-model-dependent approaches)

> [!comparison]
> REPA uses external representations to accelerate training; Self-Flow learns them intrinsically. Both achieve strong results — the tradeoff is training simplicity (REPA) vs. self-contained learning (Self-Flow).
