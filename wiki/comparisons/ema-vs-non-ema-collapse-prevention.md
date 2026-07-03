---
title: "EMA vs Non-EMA Collapse Prevention"
type: comparison
created: 2026-07-03
updated: 2026-07-03
tags:
  - ema
  - jepa
  - self-distillation
  - representation-collapse
  - self-supervised-learning
sources:
  - "[[v-jepa-2-1]]"
  - "[[rethinking-jepa]]"
  - "[[lejepa]]"
  - "[[leworldmodel]]"
  - "[[bootleg]]"
  - "[[causal-jepa]]"
  - "[[visreg]]"
  - "[[sub-jepa]]"
  - "[[sensorimotor-world-models]]"
  - "[[delta-jepa]]"
aliases:
  - "EMA debate"
  - "Collapse prevention comparison"
---

# EMA vs Non-EMA Collapse Prevention

## Question

What is the best mechanism for preventing [[representation-collapse|representation collapse]] in [[jepa|JEPA]] and related [[self-supervised-learning|SSL]] methods: [[ema|EMA]] teachers, distributional regularizers, frozen teachers, task-structure losses, or hybrids?

## Summary

The wiki documents a **live debate**, not a settled answer. [[v-jepa-2-1|V-JEPA 2.1]] and [[bootleg|Bootleg]] achieve strong results with EMA; [[lejepa|LeJEPA]], [[rethinking-jepa|SALT]], and [[leworldmodel|LeWM]] argue EMA is unnecessary or suboptimal and propose principled alternatives. Newer world-model papers add **action-aligned** collapse prevention ([[sensorimotor-world-models|SMWM]], [[delta-jepa|Delta-JEPA]]) that may subsume distributional regularization in planning settings.

> [!contradiction]
> [[v-jepa-2-1|V-JEPA 2.1]] continues EMA-based self-distillation while [[rethinking-jepa|SALT]] shows a frozen teacher can outperform V-JEPA 2 on frozen-backbone evaluation — yet both are credible SOTA claims on different axes.

## Comparison Table

| Method | Uses EMA? | Collapse prevention | Primary domain | Key claim |
|--------|-----------|---------------------|----------------|-----------|
| [[v-jepa-2-1|V-JEPA 2.1]] | Yes | EMA teacher + deep self-supervision | Video SSL | SOTA dense video features at 2B scale |
| [[bootleg|Bootleg]] | Yes | Multi-layer EMA distillation | Image SSL | +10% over I-JEPA |
| [[causal-jepa|C-JEPA]] | Yes | EMA + object-level masking structure | World model | Causal/object-centric latents |
| [[rethinking-jepa|SALT]] | No | Frozen generative teacher | Video SSL | Beats V-JEPA 2 without EMA |
| [[lejepa|LeJEPA]] | No | SIGReg (isotropic Gaussian) | Image SSL | Theoretical grounding; 79% ImageNet linear |
| [[leworldmodel|LeWM]] | No | SIGReg | Pixel world model | Stable end-to-end JEPA WM |
| [[visreg|VISReg]] | No | Decoupled scale/shape/center + sliced Wasserstein | Image SSL | Stronger OOD than SIGReg |
| [[sub-jepa|Sub-JEPA]] | No | Subspace Gaussian regularization | Pixel world model | Better planning than LeWM |
| [[sensorimotor-world-models|SMWM]] | No | Concat inverse dynamics | Pixel world model | 84% vs 59% on OGB-Cube |
| [[delta-jepa|Delta-JEPA]] | No | Latent-difference action decoding | Pixel world model | Best mean on LeWM-style tasks |

## Axes of Disagreement

### 1. Theory vs. scale

[[lejepa|LeJEPA]] argues EMA lacks theoretical justification and that SIGReg provably regularizes toward an optimal isotropic Gaussian. [[v-jepa-2-1|V-JEPA 2.1]] demonstrates that EMA-based training **scales** to 2B parameters and dense video benchmarks — empirical success without closed-form theory.

### 2. Teacher dynamics

| Approach | Teacher update | Tradeoff |
|----------|---------------|----------|
| EMA | Slow momentum of student | Stable targets; couples architectures |
| Frozen teacher ([[rethinking-jepa|SALT]]) | Fixed after pretraining | Decouples student/teacher capacity; requires Stage-1 generative teacher |
| No teacher ([[lejepa|LeJEPA]], [[visreg|VISReg]]) | Regularizer on batch statistics | Fewer hyperparameters; relies on distributional prior |

### 3. World-model-specific mechanisms

For planning, collapse prevention may need **action sensitivity**, not just distributional spread:

- [[leworldmodel|LeWM]] / [[sub-jepa|Sub-JEPA]]: SIGReg / subspace SIGReg
- [[sensorimotor-world-models|SMWM]]: inverse dynamics from $(z_t, z_{t+1})$
- [[delta-jepa|Delta-JEPA]]: inverse dynamics from $\Delta z_t$ only — beats concat IDM and SIGReg baselines on shared benchmarks

## When Each Approach May Win

| Setting | Favored direction (from wiki evidence) |
|---------|----------------------------------------|
| Large-scale video SSL | EMA still default ([[v-jepa-2-1|V-JEPA 2.1]]) |
| Minimal hyperparameters / theory | SIGReg family ([[lejepa|LeJEPA]], [[leworldmodel|LeWM]]) |
| OOD generalization | [[visreg|VISReg]] over full-space SIGReg |
| End-to-end pixel planning | [[delta-jepa|Delta-JEPA]] > [[sub-jepa|Sub-JEPA]] > [[leworldmodel|LeWM]] on shared tasks |
| Object-centric causal reasoning | [[causal-jepa|C-JEPA]] masking structure |

## Open Questions

> [!open-question]
> Would [[v-jepa-2-1|V-JEPA 2.1]] at 2B scale match or exceed current results with SIGReg instead of EMA?

> [!open-question]
> Can mechanisms be combined without redundancy — e.g., SIGReg + frozen teacher + multi-layer distillation ([[bootleg|Bootleg]])?

> [!open-question]
> Does [[delta-jepa|Delta-JEPA]]'s LDAD make SIGReg and concat inverse dynamics redundant for action-conditioned world models?

## Related Pages

- [[ema]] — mechanism overview
- [[representation-collapse]] — problem definition
- [[jepa]] — paradigm context
- [[self-distillation]] — teacher-student framing
