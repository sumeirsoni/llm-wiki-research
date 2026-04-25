---
title: "Self-Supervised Flow Matching for Scalable Multi-Modal Synthesis"
type: source
created: 2026-04-10
updated: 2026-04-12
arxiv_id: "2603.06507"
authors:
  - "Hila Chefer"
  - "Patrick Esser"
  - "Dominik Lorenz"
  - "Dustin Podell"
  - "Vikash Raja"
  - "Vinh Tong"
  - "Antonio Torralba"
  - "Robin Rombach"
year: 2025
tags:
  - self-supervised-learning
  - flow-matching
  - generative-modeling
  - multi-modal
  - vision
  - video
  - audio
  - representation-learning
pdf_path: "raw/Self-Supervised Flow Matching for Scalable Multi-Modal Synthesis.pdf"
aliases:
  - "Self-Flow"
---

# Self-Supervised Flow Matching for Scalable Multi-Modal Synthesis

## Summary

Self-Flow introduces a self-supervised [[flow-matching|flow matching]] paradigm that integrates representation learning within the generative framework itself, eliminating the need for external representation models. The key mechanism — **Dual-Timestep Scheduling** — applies heterogeneous noise levels across tokens, creating information asymmetry that forces the model to infer missing information from corrupted inputs.

## Key Contributions

- **Self-supervised flow matching**: Integrates representation learning directly into the generative framework — no external models needed
- **Dual-Timestep Scheduling**: Applies different noise levels to different tokens, creating information asymmetry that drives semantic representation learning
- **Multi-modal**: Generalizes across image, video, and audio generation
- **Proper scaling**: Follows expected scaling laws, unlike approaches depending on external representation models which exhibit unexpected scaling behavior
- **State-of-the-art generation**: Superior image, video, and audio generation quality

## Methodology

Standard [[flow-matching|flow matching]] / diffusion models pose a denoising task that doesn't incentivize learning semantic representations. They typically rely on external models (e.g., CLIP, DINO) for semantic conditioning, which:
- Require separate training
- Operate on misaligned objectives
- Exhibit unexpected scaling behavior

Self-Flow solves this with **Dual-Timestep Scheduling**:
1. Tokens in a sequence are corrupted with **different noise levels** (different timesteps)
2. Tokens with less noise must help denoise tokens with more noise
3. This creates an **information asymmetry** — the model must learn semantic representations to bridge the gap
4. The result: strong representations emerge alongside generative capabilities, all in one model

This is conceptually related to [[jepa|JEPA]]'s masked prediction approach — both create information asymmetry that forces semantic understanding — but Self-Flow operates in the generative (flow matching) framework rather than the joint-embedding framework.

## Key Results

- **Image generation**: Superior quality compared to baselines with external representation models
- **Video generation**: Strong multi-modal generation capability
- **Audio generation**: Extends to audio modality
- **Scaling behavior**: Follows expected scaling laws (unlike external-model-dependent approaches)

## Connections

- Conceptually related to [[jepa|JEPA]] — both use information asymmetry (masking vs. dual-timestep) to drive representation learning
- Challenges the separation of representation learning and generation — argues they should be unified
- Related to [[self-supervised-learning|self-supervised learning]] but approaches it from the generative side
- Different from all other papers in this wiki which are in the joint-embedding paradigm — Self-Flow is in the generative paradigm
- Contrasts with [[repa|REPA]] — REPA uses external frozen encoders to guide diffusion training; Self-Flow learns representations intrinsically via Dual-Timestep Scheduling
- From Stability AI / MIT — different institutional context than the Meta FAIR JEPA line

## Limitations & Open Questions

> [!open-question]
> How do Self-Flow's learned representations compare to JEPA representations for downstream discriminative tasks?

> [!open-question]
> Can Dual-Timestep Scheduling be combined with JEPA-style objectives for even stronger representations?

> [!gap]
> No direct comparison between Self-Flow and JEPA methods on shared benchmarks in the wiki yet.

## Links

- [arXiv](https://arxiv.org/abs/2603.06507)
- [GitHub](https://github.com/black-forest-labs/Self-Flow)
- [Project Page](https://bfl.ai/research/self-flow)
