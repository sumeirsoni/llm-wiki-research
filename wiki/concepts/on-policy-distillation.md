---
title: "On-Policy Distillation"
type: concept
created: 2026-07-08
updated: 2026-07-08
tags:
  - self-distillation
  - language
  - optimization
  - reinforcement-learning
sources:
  - "[[on-policy-representation-distillation]]"
  - "[[on-the-geometry-of-on-policy-distillation]]"
  - "[[on-the-position-bias-of-on-policy-distillation]]"
  - "[[learning-beyond-teacher]]"
  - "[[entropy-aware-opd]]"
  - "[[tip-token-importance-opd]]"
  - "[[fire-opd]]"
aliases:
  - "OPD"
  - "On-policy KD"
---

# On-Policy Distillation

## Overview

On-policy distillation (OPD) trains a student on trajectories sampled from the student's current policy, then uses a teacher to provide dense token-level supervision on those visited states. This avoids the train-test mismatch of off-policy teacher-generated data while preserving richer feedback than sparse outcome-reward RL.

In the current wiki, OPD is the shared substrate for three research directions: representation-level distillation ([[on-policy-representation-distillation|OPRD]]), token/position weighting ([[on-the-position-bias-of-on-policy-distillation|Position Bias OPD]], [[tip-token-importance-opd|TIP]], [[fire-opd|FiRe-OPD]]), and parameter-space geometry ([[on-the-geometry-of-on-policy-distillation|OPD Geometry]]).

## Objective Families

### Standard OPD

Standard OPD applies reverse-KL-style teacher correction on student-generated rollouts. It gives dense token-level supervision but usually weights all positions uniformly, which recent work shows is inefficient.

### Generalized and Extrapolative OPD

[[learning-beyond-teacher|G-OPD / ExOPD]] reinterprets OPD as dense KL-constrained RL with a reference model and reward scale. ExOPD sets reward scale above one, extrapolating beyond the teacher rather than only imitating it.

### Entropy-Aware OPD

[[entropy-aware-opd|EOPD]] gates in forward KL when teacher entropy is high. It treats uncertain teacher positions as mode-covering rather than mode-seeking targets, preserving diversity on reasoning tasks.

### Representation-Level OPD

[[on-policy-representation-distillation|OPRD]] moves supervision before the LM head by aligning hidden states on student rollouts. This bypasses output-space bottlenecks but raises new questions about contrastive objectives, position bias, and update geometry.

## Key Design Axes

- **Rollout source**: student on-policy, teacher off-policy, or mixtures.
- **Supervision target**: output logits, hidden states, hidden transitions, or projected low-rank bridges.
- **Token weighting**: uniform, prefix-aware, entropy/divergence-based, verifier-gated, or soft teacher-confidence/student-confusion weighting.
- **Objective composition**: standalone OPD, OPD + OPRD, OPD + RLVR, or extrapolated reward scaling.
- **Geometry**: whether the update remains in OPD's locked low-dimensional channel or moves into a different subspace.

## Experimental Implications for OPRD

OPRD should be compared against stronger OPD baselines, not only standard reverse-KL OPD. The relevant controls include [[learning-beyond-teacher|ExOPD]] for reward scaling, [[entropy-aware-opd|EOPD]] for teacher uncertainty, [[tip-token-importance-opd|TIP]] for entropy/disagreement token selection, [[fire-opd|FiRe-OPD]] for trajectory filtering plus soft token weights, and [[on-the-position-bias-of-on-policy-distillation|IW-OPD]] for cumulative prefix drift.

> [!open-question]
> Does OPRD preserve OPD's main benefit, learning on student-visited states, while changing the objective enough to escape OPD's output-space stagnation and subspace lock?

## Related Pages

- [[on-policy-representation-distillation]]
- [[token-selective-distillation]]
- [[contrastive-representation-distillation]]
- [[representation-geometry]]
- [[self-distillation]]
