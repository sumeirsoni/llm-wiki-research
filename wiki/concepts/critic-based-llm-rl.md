---
title: "Critic-Based LLM Reinforcement Learning"
type: concept
created: 2026-09-04
updated: 2026-09-04
tags:
  - language
  - reinforcement-learning
  - optimization
  - transformer
sources:
  - "[[best-practice-critic-optimization]]"
aliases:
  - "Critic-based RL"
  - "Single-rollout LLM RL"
---

# Critic-Based LLM Reinforcement Learning

## Overview

Critic-based LLM reinforcement learning uses a learned value function to estimate token-level advantages from a single response per prompt. It contrasts with group-based methods such as GRPO, which avoid a critic by sampling several responses and comparing their rewards. The main difficulty is estimator stability: critic error, value extrapolation, bootstrapped targets, advantage normalization, and long-response credit assignment can each distort the policy signal.

## Design Axes

- **Policy objective**: PPO uses a common probability-ratio clip, while DPPO constrains the sampled token's absolute probability change.
- **Value range**: bounded heads encode known reward support; unconstrained linear heads can produce impossible values.
- **Critic target**: Monte Carlo outcome targets remove bootstrapping bias, while policy advantages can still use lower-variance GAE.
- **Advantage scale**: raw advantages preserve the natural decay of the update near convergence; batch normalization can amplify late-stage noise.
- **Length handling**: length-adaptive GAE keeps terminal reward influence more stable across response lengths.
- **Training-only information**: a critic may see references, solutions, or rubrics hidden from the policy because it is discarded at deployment.

## BPCO as a Reference Recipe

[[best-practice-critic-optimization|BPCO]] combines all six choices in a single-rollout actor-critic recipe. It uses DPPO, reward-range-bounded values, Monte Carlo critic targets, raw advantages, optional privileged information, and length-adaptive GAE. The paper's controlled study shows that the choices interact: DPPO alone does not stabilize a bootstrapped critic at $\lambda<1$, and privileged information can improve critic fit while increasing small-data overfitting.

## Comparison with Group-Based and Distillation Methods

Group-based RL spends rollout budget on within-prompt reward comparisons. Critic-based RL spends training memory and compute on value estimation, then obtains token-level credit from one rollout. BPCO reports that the latter can match or exceed a 16-response group baseline on the tested mathematical tasks.

This is distinct from [[on-policy-distillation]], which uses teacher-derived token supervision on student rollouts, and from [[opsa]], which removes the teacher and reward model by suppressing low-probability student tokens. BPCO retains outcome rewards and introduces a critic to estimate their prefix-level consequences.

## Tradeoffs and Open Questions

- Critics reduce rollout multiplicity but add parameters, memory, optimization steps, and possible estimator bias.
- Privileged critic inputs can make value learning easier, but the policy benefit depends on task difficulty and overfitting.
- Known reward ranges are convenient for mathematical and rubric tasks but may not exist for open-ended agentic objectives.
- Trajectory-matched comparisons do not fully capture wall-clock or total-memory cost.
- It remains unclear whether critic stability transfers to sparse, noisy, delayed, or tool-mediated rewards.
