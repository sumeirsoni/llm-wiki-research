---
title: "Contrastive Hidden-State Distillation"
type: concept
created: 2026-07-08
updated: 2026-07-08
tags:
  - contrastive-learning
  - self-distillation
  - representation-learning
sources:
  - "[[contrastive-representation-distillation]]"
  - "[[codir]]"
  - "[[distiller]]"
  - "[[phf]]"
  - "[[on-policy-representation-distillation]]"
aliases:
  - "Contrastive KD"
  - "Contrastive representation distillation"
  - "Contrastive hidden-state distillation"
---

# Contrastive Hidden-State Distillation

## Overview

Contrastive hidden-state distillation transfers teacher knowledge by matching relational structure in representation space rather than matching each hidden dimension independently. Positive pairs usually come from teacher and student representations of the same input, while negatives come from other inputs, classes, examples, or trajectory states.

This is the natural literature base for a **contrastive OPRD** experiment: [[on-policy-representation-distillation|OPRD]] currently uses pointwise hidden-state MSE, while [[contrastive-representation-distillation|CRD]] and [[codir|CoDIR]] argue that contrastive objectives can transfer richer structural information.

## Core Design Choices

### Positive Pairs

For static datasets, the positive pair is teacher and student representation of the same example. For OPRD, possible positives include:

- same prompt, token, and layer;
- same rollout segment under teacher and student;
- hidden transitions between adjacent tokens, as in [[phf|PHF]];
- trajectories with the same final answer or verifier outcome.

### Negatives

Negatives can be drawn in-batch, from a memory bank, from other prompts, from incorrect trajectories, or from mismatched layers/positions. OPRD must avoid false negatives: two different reasoning traces may be semantically equivalent even if their token paths differ.

### Representation Object

The contrastive object can be a pooled sequence embedding ([[codir|CoDIR]]), a per-token hidden vector, a layer aggregate, a projected bridge representation, or a transition/Gram object ([[phf|PHF]]).

## Relationship to OPRD

OPRD's MSE loss is coordinate-wise and dense. A contrastive variant could:

- preserve relative teacher geometry rather than exact coordinates;
- reduce sensitivity to teacher-student hidden-space drift;
- provide stronger separation among misleading trajectories;
- introduce instability through stale negatives or false negative pairs.

[[distiller|Distiller]] suggests this should be benchmarked against MSE, cosine, MI-style objectives, CKA/relational losses, and layer-mapping variants.

> [!open-question]
> Is contrastive OPRD best applied at token level, segment level, layer level, or transition level?

> [!open-question]
> Can contrastive negatives be chosen from incorrect rollouts without needing expensive verifier labels?

## Related Pages

- [[contrastive-learning]]
- [[on-policy-distillation]]
- [[on-policy-representation-distillation]]
- [[representation-geometry]]
