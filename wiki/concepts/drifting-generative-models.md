---
title: "Drifting Generative Models"
type: concept
created: 2026-09-04
updated: 2026-09-04
tags:
  - generative-modeling
  - world-model
  - video
  - robotics
sources:
  - "[[driftworld]]"
aliases:
  - "Drifting"
  - "Drifting generative modeling"
---

# Drifting Generative Models

## Overview

Drifting generative models learn a generator whose samples are progressively moved toward the data distribution by a learned vector field during training. At inference, the generator can map noise and conditioning information to a sample in one forward pass, avoiding the iterative denoising loop used by diffusion models. [[driftworld|DriftWorld]] adapts this idea to action-conditioned video rollouts for robotics.

## Core Mechanism

Let $q=f_\#p_\epsilon$ be the generator's current distribution and $p$ the data distribution. A drifting field combines attraction toward positive data samples and repulsion from generated negative samples:

$$V_{p,q}(x)=V_p^+(x)-V_q^-(x).$$

Training updates the generator toward a fixed point where the generated distribution matches the target. In DriftWorld, the conditioning is an observation history plus future actions, and the output is a future frame or video chunk.

## DriftWorld Design Pattern

- **Action conditioning**: frame-wise FiLM and cross-attention associate each action with the future frame it should influence.
- **Feature-space supervision**: DINOv2 or DINOv3 feature maps preserve sharp semantic structure in cluttered real-world scenes.
- **Motion weighting**: moving regions receive more loss than static backgrounds, reducing the copy-the-last-frame shortcut.
- **Self-forcing**: a second stage conditions on generated history to improve autoregressive consistency.
- **Planning interface**: fast rollouts rank candidate action proposals and can estimate policy performance offline.

## Relation to Other Generative Objectives

Drifting and [[flow-matching|flow matching]] both use vector fields, but their computational roles differ. Flow matching generally trains a continuous transport field that is numerically integrated at inference, while drifting seeks a one-step generator by evolving the generator distribution during training. Diffusion and consistency models also trade generation quality against sampling cost, but their denoising or consistency formulations are not identical to the attractive-repulsive drifting field.

## Open Questions

> [!open-question]
> Can drifting preserve long-horizon temporal consistency when context and generation windows grow, without the negative-sample memory cost dominating training?

> [!open-question]
> How much of DriftWorld's real-world quality comes from the drifting objective versus DINO feature supervision, motion weighting, and self-forcing?

> [!open-question]
> Can one-step drifting world models provide calibrated uncertainty or multimodal futures for low-budget planning rather than only fast point or sample generation?

