---
title: "LM-Head Gradient Bottleneck"
type: concept
created: 2026-08-14
updated: 2026-08-14
tags:
  - language
  - transformer
  - optimization
  - theory
  - representation-learning
sources:
  - "[[lost-in-backpropagation]]"
  - "[[on-policy-representation-distillation]]"
aliases:
  - "LM-head gradient bottleneck"
  - "Output-head gradient bottleneck"
  - "Backward softmax bottleneck"
---

# LM-Head Gradient Bottleneck

## Overview

The **LM-head gradient bottleneck** is the compression of vocabulary-space training error as it passes backward through a language model's output mapping. In a standard linear head with vocabulary size $V$ and hidden width $D \ll V$, the cross-entropy gradient can occupy many vocabulary directions, but the backbone receives only the projection transmitted through a rank-at-most-$D$ channel. [[lost-in-backpropagation|Lost in Backpropagation]] formalizes this distinction and measures severe norm loss and directional misalignment in existing language models.

## Three Distinct Bottlenecks

1. **Output expressivity**: because $L = HW^\top$, the logit matrix has rank at most $D$. This is the classical softmax bottleneck.
2. **Hidden-state observability**: two hidden states that differ in $\ker(W)$ can produce identical logits, so an output-space objective cannot supervise the difference. [[on-policy-representation-distillation|OPRD]] uses this argument to motivate representation-level distillation.
3. **Backward gradient bandwidth**: components of the vocabulary-space gradient in $\ker(W^\top)$ produce no hidden-state gradient. This is the mechanism diagnosed by [[lost-in-backpropagation]].

The second and third statements concern opposite sides of the same linear map, but they are not interchangeable. One concerns hidden directions invisible at the output; the other concerns output-error directions unable to reach the hidden representation.

## Geometry

For logit gradient $G$ and output matrix $W$, the backbone receives $GW$. The vocabulary space decomposes into a visible subspace and the null space of $W^\top$:

$$G = P_{\ker(W^\top)^\perp}(G) + P_{\ker(W^\top)}(G).$$

Two properties determine the severity of this projection:

- **Norm preservation**: how much of $\|G\|_F$ remains in the visible component.
- **Directional alignment**: whether the surviving component points in a direction close to the original error.

The source paper reports that 95-99% of measured logit-gradient Frobenius norm lies in the removed component and that projected-gradient cosine is usually about 0.1-0.3 across the tested models. These values do not imply that the same fraction of useful credit is lost. A low-norm direction can still matter, while a high-norm direction can be redundant.

The first-order logit update from jointly changing hidden states and a linear head has rank at most $2D$. By contrast, a batch's prediction-error matrix can approach rank $V-1$ as the number of distinct observed continuations grows. The singular-value tail beyond the realizable rank determines a lower bound on the mismatch, so effective rank and spectral decay matter alongside formal rank.

## Empirical Signatures

Evidence consistent with a harmful bottleneck includes:

- convergence improving as controlled output rank increases;
- sensitivity worsening as vocabulary-to-width ratio grows despite adequate top-1 representational capacity;
- direct logit-gradient updates reducing loss more efficiently than equal-norm updates realizable through hidden states;
- compression remaining stable through training rather than disappearing after early optimization;
- the learned head failing to align with the dominant singular directions of the current logit gradient.

These are diagnostic signatures, not proof that every discarded direction should be preserved.

## Mitigation Design Space

Potential mitigation families include:

- wider or structured higher-rank output channels;
- nonlinear heads with better-conditioned Jacobians;
- preconditioners that emphasize useful discarded directions;
- auxiliary hidden-state objectives that route supervision before the output head;
- softmax alternatives designed for gradient transmission as well as expressivity.

[[on-policy-representation-distillation|OPRD]] exemplifies the auxiliary-objective family in a distillation setting, but it does not by itself solve the bottleneck for ordinary next-token pretraining. [[lost-in-backpropagation]] reports that preliminary orthogonality, alignment-loss, and feedback-alignment variants did not improve convergence, so an effective replacement remains open.

## Relation to Representation Geometry

The bottleneck extends [[representation-geometry]] from the geometry of embeddings and parameter trajectories to the geometry of the supervision channel. Useful diagnostics include:

- numerical and effective rank of the vocabulary-space error;
- singular-value mass beyond rank $D$ or $2D$;
- destroyed-gradient ratio;
- cosine between the full and visible gradients;
- alignment between the learned output subspace and dominant gradient singular vectors;
- loss reduction per unit norm of realizable versus direct logit updates.

## Open Questions

> [!open-question]
> Can a head learn a dynamically useful output subspace without introducing unstable co-adaptation between the head and backbone?

> [!open-question]
> Which gradient components predict future loss reduction or downstream transfer better than raw Frobenius norm?

> [!open-question]
> How should hidden width enter scaling laws when vocabulary size, data diversity, and the effective rank of prediction error all grow?

> [!open-question]
> Can auxiliary representation objectives recover suppressed credit while preserving the calibration and likelihood semantics of next-token training?
