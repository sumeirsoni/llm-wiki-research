---
title: "Looped Transformers"
type: concept
created: 2026-09-04
updated: 2026-09-04
tags:
  - transformer
  - language
  - optimization
  - theory
sources:
  - "[[hyperloop-transformers]]"
  - "[[generative-recursive-reasoning]]"
  - "[[fixed-point-reasoners]]"
  - "[[lotus]]"
  - "[[smelt]]"
  - "[[looped-transformers-jacobian-lens]]"
  - "[[loop-think-generalize]]"
aliases:
  - "Weight-shared Transformers"
  - "Depth-recurrent Transformers"
  - "Layer looping"
---

# Looped Transformers

## Overview

Looped Transformers reuse a block of Transformer layers across multiple visits, increasing effective depth without adding a distinct parameter set for every executed layer. The central design question is whether the second visit performs useful refinement or merely repeats computation, and whether its benefit survives fair matching of FLOPs, parameters, width, and KV-cache size.

## Design Axes

- **Loop span**: full-stack, middle-block, or selected layers.
- **Loop count**: fixed two-pass reuse, deeper recurrence, or adaptive halting.
- **State interface**: residual-stream refinement, padded latent tokens, cross-token feedback, or fixed-point attractor state.
- **Budget**: unique parameter count, active parameters, training FLOPs, inference FLOPs, cache size, and wall-clock latency can point in different directions.
- **Readout and supervision**: next-token loss, parallel latent-CoT readout, verifier feedback, or convergence-based stopping.

## SMELT's Compute-Matched Result

[[smelt|SMELT]] provides a clean MoE comparison by matching per-token FLOPs, total non-embedding parameters, and KV cache. Its preferred recipe loops the middle 50% of layers twice, narrows width, increases the expert pool, and scales looped residual updates by one half. Across four scales and sparsity levels, SMELT saves 6.8% to 18.0% of training FLOPs on the fitted validation-loss frontier. The gain is strongest on structured data, long samples, and in-context examples.

Mechanistically, the second visit writes larger residual updates and reduces the attention sink while directing mass toward content-relevant tokens. This supports an iterative-refinement interpretation, but the paper does not establish which internal change is causal.

## Related Families

- [[hyperloop-transformers|Hyperloop Transformers]] use looped blocks with hyper-connections for parameter-efficient language modeling.
- [[fixed-point-reasoners|FPRM]] uses pre-norm, residual scaling, and convergence-based halting for algorithmic reasoning.
- [[lotus|LOTUS]] refines fixed latent prefixes over shared looped blocks and supervises them against gold Chain-of-Thought steps in parallel.
- [[generative-recursive-reasoning|GRAM]] explores width-based multi-trajectory recursive reasoning rather than only deeper single-path looping.
- [[recirculation|Recirculation]] and [[full-bandwidth-transformer|Full-Bandwidth Transformer]] move processed state across depth or token boundaries, but do not share exactly the same middle-block recipe.

## Workspace transport across loops

[[looped-transformers-jacobian-lens|Looped Transformers under the Jacobian Lens]] shows that tied depth does not define one universal state interface. Ouro-2.6B reconstructs workspace content at each deeply supervised loop checkpoint, but transport across a loop boundary weakens sharply. Huginn-0125 carries content across 16 recurrences, yet its reads, writes, and ablations operate within a window of roughly two recurrences. The distinction matters for both interpretation and architecture: decodability at a checkpoint does not establish persistent or causally usable state. See [[jacobian-lens-workspace]] for the measurement framework.

## Compositional generalization and depth extrapolation

[[loop-think-generalize|Loop, Think, & Generalize]] gives looped depth a controlled reasoning test. On synthetic permutation-based knowledge graphs, recurrent models learn to compose atomic facts that were never combined during training, while vanilla Transformers fail the systematic split. More training-time recurrence also increases the depth that can be learned and makes inference-time iteration useful for longer chains. The result is conditional: default initialization is unstable across seeds, and excessive recurrence causes overthinking. See [[compositional-generalization]] for the task and its anti-shortcut checks.

## Open Questions

> [!open-question]
> Do SMELT's gains persist after matching wall-clock latency and communication overhead on modern accelerators?

> [!open-question]
> Is attention-sink reduction the cause of better in-context learning, a consequence of another refinement mechanism, or a correlated signature?

> [!open-question]
> Can adaptive loop counts, per-visit adapters, or cross-token state reuse retain the CE Gain under the same three-way budget matching?
