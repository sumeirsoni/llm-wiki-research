---
title: "Variable-Dimensional Generative Flows"
type: concept
created: 2026-07-28
updated: 2026-07-28
tags:
  - flow-matching
  - generative-modeling
  - variable-length-generation
  - flow-map
sources:
  - "[[expanding-flow-maps]]"
aliases:
  - "Expanding Generative Flows"
  - "EFlows"
  - "Adaptive-dimensional flows"
---

# Variable-Dimensional Generative Flows

## Overview

Variable-dimensional generative flows transport probability distributions while allowing the active state dimension, graph size, or sequence length to change during generation. Unlike fixed-canvas diffusion and [[flow-matching|flow-matching]] models, they treat output size as a modeled variable rather than a shape chosen before sampling.

[[expanding-flow-maps|Expanding Flow Maps]] provides the wiki's first concrete framework in this family. It introduces an expanding interpolant whose state grows through conditional insertion and then moves toward data through continuous or discrete transport.

## Expand-Transport Decomposition

A transition from time $s$ to $t$ has two parts:

1. **Expand**: insert noisy coordinates, nodes, edges, or tokens conditioned on the current state.
2. **Transport**: denoise and move the enlarged state toward the target marginal.

The expand operator determines how many elements appear, where they are placed, and how they are initialized. The transport model determines their values and their interactions with existing elements. When expansion is the identity, the construction reduces to an ordinary fixed-dimensional flow.

## Local Time

Elements inserted at different global times have experienced different amounts of denoising. A local clock records time since insertion, allowing each active component to follow an appropriate schedule. This is useful for coarse-to-fine structures, such as inserting hydrogens after a molecular backbone, and for sequences whose tokens emerge at different stages.

Local time also creates a scaling challenge: the model must condition on a larger and more heterogeneous family of schedules than a fixed-canvas model with one shared timestep.

## Multi-Step Flows and Few-Step Maps

- **Expanding Generative Flows (EFlows)** integrate a learned velocity or denoising field over many small steps while interleaving insertion events.
- **Expanding Flow Maps (EFMs)** distill the same process into larger stochastic jumps that each perform expansion and transport.

This separation parallels other few-step generative approaches, but the central approximation problem is broader: the student must predict both future content and future active structure.

## Continuous and Discrete Instantiations

### Continuous coordinates

Expansion adds real-valued coordinates initialized from conditional noise. Placement may be concatenative, positional, or parent-relative. The paper's conformer model uses parent-relative hydrogen insertion while preserving equivariance in coordinate transport.

### Discrete sequences and graphs

A learned insertion head predicts additions per gap or graph location. Newly inserted simplex-valued elements are then denoised into token, node, and edge categories. Practical implementations still use a maximum buffer, but active length or graph size varies within that bound.

## Why It Matters

Variable-dimensional flows address data whose size is part of its semantics:

- variable-length language;
- molecular graphs with different atom counts;
- adaptive-resolution images and 3D structures;
- audio or video with unknown duration;
- multimodal outputs whose component dimensions differ.

The framework also supports stochastic branching from an intermediate state because inserted noise can produce multiple continuations. This may connect adaptive generation with posterior sampling or reward-guided selection.

## Current Evidence

[[expanding-flow-maps]] reports:

- competitive conformer generation with substantially fewer evaluations than diffusion baselines;
- robust variable-size graph generation at one to four steps;
- lower LM1B generative perplexity than a fixed-length flow model across multi-step budgets;
- coherent two- and four-step variable-length language generation, but mode collapse in the one-step setting.

The evidence establishes feasibility across continuous coordinates and discrete structures, not unrestricted scaling. Evaluations remain bounded by 181 atoms and length-128 language sequences.

## Open Questions

- How should insertion counts remain calibrated beyond training-time size ranges?
- Can variable-size generation avoid allocating a fixed maximum buffer?
- Which insertion orders best reflect hierarchical or causal structure?
- Can the conditional insertion distribution itself be learned without destabilizing transport?
- How should decreasing-dimensionality operations compose with expansion?
- Can one-step maps avoid jointly collapsing output length and content diversity?

## Related Concepts

- [[flow-matching]] supplies the continuous transport objective used by EFlows.
- [[normalizing-trajectory-models]] targets few-step generation on a fixed canvas using richer conditional transitions rather than state expansion.
- [[self-flow]] varies token noise levels for representation learning but does not change active dimensionality during generation.
