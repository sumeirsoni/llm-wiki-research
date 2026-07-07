---
title: "Layer Contribution in RL Post-Training"
type: concept
created: 2026-07-06
updated: 2026-07-06
tags:
  - reinforcement-learning
  - language
  - transformer
  - optimization
  - theory
sources:
  - "[[is-one-layer-enough-rl-training]]"
aliases:
  - "Layer contribution"
  - "Layer-wise RL adaptation"
  - "Single-layer RL training"
---

# Layer Contribution in RL Post-Training

## Overview

**Layer contribution** measures how much of the improvement from full-parameter RL post-training can be recovered by training a single transformer layer in isolation. Introduced by [[is-one-layer-enough-rl-training|Is One Layer Enough?]], it reveals that RL gains in LLMs are highly uneven across depth — concentrated in middle layers — rather than uniformly distributed as standard full-parameter training implicitly assumes.

## Definition

For layer $k$, with base performance $S_{\text{base}}$, single-layer performance $S_k$, and full-parameter performance $S_{\text{full}}$:

$$C(k) = \frac{S_k - S_{\text{base}}}{S_{\text{full}} - S_{\text{base}}}$$

- $C = 1.0$: single-layer training matches full RL gain
- $C > 1.0$: surpasses full-parameter training (suggesting joint training dilutes improvement)
- $C \approx 0$: layer fails to capture meaningful RL signal in isolation

Gradients are computed through the full network; only the target layer's parameters are updated.

## Empirical Structure

Across seven models, three RL algorithms (GRPO, GiGPO, Dr. GRPO), and tasks (math, code, agentic):

1. **Dramatic variation**: Best layers reach $C \geq 1.0$; worst layers often $< 0.5$ (sometimes negative, e.g., Layer 0 on Qwen3-8B at $C = -0.51$).
2. **Middle-layer concentration**: High-contribution layers consistently sit at ~40–60% relative network depth; input-adjacent and output-adjacent layers contribute less.
3. **Stability across conditions**: Rankings correlate across datasets ($\rho = 0.76$ for two math sets), tasks ($\rho = 0.59$ math vs code), model families, and RL algorithms.
4. **OOD generalization**: Layers that improve in-domain math also improve out-of-distribution code, reasoning, and language benchmarks.

## Practical Implications

[[is-one-layer-enough-rl-training|Is One Layer Enough?]] derives three layer-aware strategies from contribution profiles:

| Strategy | Mechanism | Result |
|----------|-----------|--------|
| LR boosting | Higher LR on top-$k$ contribution layers | Consistent gains over uniform LR |
| Selective training | Freeze all but top-$k$ layers | Best on larger models (Only-B10 on Qwen3-8B: +2.68 pts) |
| Middle-layer heuristic | Train middle $k$ layers by position, no profiling | Beats full-parameter RL without per-layer scans |

High-contribution layer-trained models also exhibit **complementary problem-solving** (low Jaccard overlap), enabling majority-voting ensembles that exceed full-parameter baselines.

## Relation to Other Layer-Wise Work

Prior work on layer importance focused on **inference-time pruning** (cornerstone layers, mathematical-reasoning critical layers) and **SFT efficiency** (LISA random layer sampling, MISA importance sampling, AdaGradSelect gradient-guided selection). [[is-one-layer-enough-rl-training|Is One Layer Enough?]] is the first systematic study in **RLVR**, finding that:

- Middle-layer importance in RL parallels but is not identical to SFT layer-heterogeneity findings
- Weight change magnitude during full training is **uniform** across layers despite non-uniform contribution — contribution reflects subspace effectiveness, not update size
- Layer contribution appears determined by **pretrained weights**, not the specific RL dataset

This connects to [[representation-geometry|representation geometry]] (which layers encode RL-improvable structure?) and [[on-the-geometry-of-on-policy-distillation|OPD geometry]] (how parameter updates distribute during post-training).

## Open Questions

> [!open-question]
> Can layer contribution profiles be predicted from pretrained model properties (e.g., layer-wise probing, NTK analysis) without expensive per-layer RL runs?

> [!open-question]
> Does the middle-layer concentration pattern hold for multimodal or vision-language RL post-training?

> [!open-question]
> How does layer contribution interact with parameter-efficient fine-tuning (LoRA rank, adapter placement)?
