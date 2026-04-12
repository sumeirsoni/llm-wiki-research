---
title: "Exponential Moving Average (EMA)"
type: concept
created: 2026-04-10
updated: 2026-04-10
tags:
  - ema
  - self-distillation
  - optimization
sources:
  - "[[v-jepa-2-1]]"
  - "[[rethinking-jepa]]"
  - "[[lejepa]]"
aliases:
  - "EMA"
  - "EMA teacher"
  - "Momentum teacher"
---

# Exponential Moving Average (EMA)

## Overview

EMA is a widely-used mechanism in [[self-supervised-learning|self-supervised learning]] where a teacher network's parameters are updated as an exponential moving average of the student network's parameters:

$$\theta_{\text{teacher}} \leftarrow \alpha \cdot \theta_{\text{teacher}} + (1 - \alpha) \cdot \theta_{\text{student}}$$

where $\alpha$ is typically close to 1 (e.g., 0.996–0.999), meaning the teacher updates slowly.

## Purpose

EMA prevents [[representation-collapse|representation collapse]] in teacher-student SSL:
- The teacher provides slowly-changing targets
- The student can't collapse because its targets (from the teacher) evolve on a different timescale
- The momentum creates a natural form of regularization

## Usage in This Wiki

| Paper | Uses EMA? | Alternative |
|-------|-----------|-------------|
| [[v-jepa-2-1\|V-JEPA 2.1]] | ✅ Yes | — |
| [[rethinking-jepa\|SALT]] | ❌ No | Frozen teacher |
| [[lejepa\|LeJEPA]] | ❌ No | SIGReg regularizer |
| [[leworldmodel\|LeWM]] | ❌ No | SIGReg regularizer |
| [[bootleg\|Bootleg]] | ✅ Yes | Multi-layer targets |
| [[causal-jepa\|C-JEPA]] | ✅ Yes | Object-level masking |

## The EMA Debate

Three of the seven papers in this wiki argue against EMA:

- [[lejepa|LeJEPA]]: EMA is a heuristic without theoretical justification; SIGReg is provably better
- [[rethinking-jepa|SALT]]: A frozen teacher outperforms EMA-based V-JEPA 2; EMA couples architectures and complicates scaling
- [[leworldmodel|LeWM]]: SIGReg enables stable training without EMA, reducing hyperparameters from 6 to 1

Meanwhile, [[v-jepa-2-1|V-JEPA 2.1]] achieves state-of-the-art results with EMA, suggesting it works well at scale even if not theoretically optimal.

> [!open-question]
> Is the EMA debate about principle (theoretical elegance) or practice (what works best at scale)? The answer may depend on compute budget.
