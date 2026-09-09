---
title: "On-Policy Distillation"
type: concept
created: 2026-07-08
updated: 2026-09-04
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
  - "[[beta-opsd]]"
  - "[[latent-on-policy-self-distillation]]"
  - "[[simpleopd]]"
  - "[[self-supervised-visual-on-policy-distillation]]"
  - "[[opsa]]"
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

### Generalized, Regularized, and Extrapolative OPD

[[learning-beyond-teacher|G-OPD / ExOPD]] reinterprets OPD as dense KL-constrained RL with a reference model and reward scale. ExOPD sets reward scale above one, extrapolating beyond the teacher rather than only imitating it. [[beta-opsd|β-OPSD]] derives a complementary regularized family whose closed-form target geometrically interpolates between a reference policy and privileged teacher. Scheduled token-level logit interpolation and return-to-go credit improve stability and math accuracy over vanilla OPSD, but the tested gains shrink from 1.7B to 8B.

### Learned Privileged Context

[[latent-on-policy-self-distillation|LOPD]] learns the privileged information supplied to a frozen self-teacher instead of selecting a fixed answer, skill, feedback artifact, or trajectory. Retrieved successful experiences are compressed into continuous latent tokens, and an outcome-weighted margin prevents joint composer optimization from collapsing the teacher toward the student. This separates **privilege construction** from the distillation objective and preserves the ordinary student architecture at deployment.

### Entropy-Aware OPD

[[entropy-aware-opd|EOPD]] gates in forward KL when teacher entropy is high. It treats uncertain teacher positions as mode-covering rather than mode-seeking targets, preserving diversity on reasoning tasks.

### Teacher-Free Self-Adaptation

[[opsa|OPSA]] questions whether standard OPD gains require teacher information at all. Its analysis finds teacher advantages on student-generated trajectories are noisy and that learning concentrates on low-log-probability tokens. OPSA therefore selects the lowest-log-probability 20% of sampled tokens, assigns negative advantages, and scales their magnitude with token entropy. It suppresses unlikely tails while redistributing probability among head tokens at high-entropy reasoning forks, preserving response diversity without a teacher, reward, or hint.

### Tokenizer-Agnostic Long-Context OPD

[[simpleopd|SimpleOPD]] aligns independently tokenized student-generated text only where teacher and student tokens occupy exactly the same surface span. Termination-token masking and reference KL stabilize transfer from much longer-context teachers, adding tokenizer overlap, context asymmetry, and stopping behavior to the OPD design space.

### Self-Supervised Visual OPD

[[self-supervised-visual-on-policy-distillation|S²VOPD]] creates privilege from observation asymmetry: an EMA teacher sees the clean image while the student rolls out from an information-reduced view. Moderate, answer-preserving corruption improves perception, while symmetric self-distillation and overly destructive augmentation fail.

### Representation-Level OPD

[[on-policy-representation-distillation|OPRD]] moves supervision before the LM head by aligning hidden states on student rollouts. This bypasses output-space bottlenecks but raises new questions about contrastive objectives, position bias, and update geometry.

## Key Design Axes

- **Rollout source**: student on-policy, teacher off-policy, or mixtures.
- **Supervision target**: output logits, hidden states, hidden transitions, or projected low-rank bridges.
- **Token weighting**: uniform, prefix-aware, entropy/divergence-based, verifier-gated, or soft teacher-confidence/student-confusion weighting.
- **Objective composition**: standalone OPD, reference-anchored [[beta-opsd|β-OPSD]], OPD + OPRD, OPD + RLVR, or extrapolated reward scaling.
- **Teacher dependence**: external teacher as in standard OPD, privileged self-teacher as in [[latent-on-policy-self-distillation|LOPD]], or no teacher with entropy-adaptive negative advantages as in [[opsa|OPSA]].
- **Privilege construction**: fixed answers, traces, feedback, or skills; retrieved experience compressed into learned context as in [[latent-on-policy-self-distillation|LOPD]]; or clean versus information-reduced observations as in [[self-supervised-visual-on-policy-distillation|S²VOPD]].
- **Interface compatibility**: shared tokenization, exact surface-span alignment as in [[simpleopd|SimpleOPD]], or hidden-state alignment that bypasses vocabulary matching.
- **Geometry**: whether the update remains in OPD's locked low-dimensional channel or moves into a different subspace.

## Experimental Implications for OPRD

OPRD should be compared against stronger OPD baselines, not only standard reverse-KL OPD. The relevant controls include [[beta-opsd|β-OPSD]] for reference anchoring and sequence-level return credit, [[learning-beyond-teacher|ExOPD]] for reward scaling, [[entropy-aware-opd|EOPD]] for teacher uncertainty, [[tip-token-importance-opd|TIP]] for entropy/disagreement token selection, [[fire-opd|FiRe-OPD]] for trajectory filtering plus soft token weights, and [[on-the-position-bias-of-on-policy-distillation|IW-OPD]] for cumulative prefix drift.

> [!open-question]
> Does OPRD preserve OPD's main benefit, learning on student-visited states, while changing the objective enough to escape OPD's output-space stagnation and subspace lock?

## Related Pages

- [[on-policy-representation-distillation]]
- [[latent-on-policy-self-distillation]]
- [[token-selective-distillation]]
- [[contrastive-representation-distillation]]
- [[representation-geometry]]
- [[self-distillation]]
