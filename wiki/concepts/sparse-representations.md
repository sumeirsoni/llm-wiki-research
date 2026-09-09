---
title: "Sparse Representations in World Models"
type: concept
created: 2026-08-25
updated: 2026-08-25
tags:
  - representation-learning
  - world-model
  - jepa
  - theory
  - optimization
sources:
  - "[[lpwm]]"
aliases:
  - "Sparse latents"
  - "Sparse latent geometry"
  - "Mode-factored representations"
  - "Distributed sparse codes"
---

# Sparse Representations in World Models

## Overview

Most [[jepa|JEPA]] collapse prevention ([[lejepa|SIGReg]], [[visreg|VISReg]], VICReg) targets maximum-entropy *dense* distributions, so all latent coordinates are nonzero almost surely. The sparse-geometry position, argued by [[lpwm|LpWM]], asks whether that is the right geometry for modeling dynamics at all: if a sufficiently high-dimensional **one-hot** code makes any Lipschitz controlled system exactly linear in latent space (rollout error $O(N^{-1/d})$, vanishing with code size), then distributed sparse codes are the learnable relaxation that may simplify the transition function a predictor must fit.

## The Linearization Argument

[[lpwm|LpWM]]'s Proposition 1: for compact state/action spaces and uniformly Lipschitz dynamics, there exists a finite one-hot encoding whose action-conditioned latent transitions are exactly linear matrices $\mathbf{P}_\varepsilon(\mathbf{a}) \in \{0,1\}^{N\times N}$, with one-step error bounded by $(L+1)\varepsilon$. This reinterprets classical symbolic state-space abstractions as sparse codes, joining the Koopman/SINDy lineage of linearizing nonlinear dynamics.

The catch is explicit: the guarantee degrades as $O(N^{-1/d})$ - the curse of dimensionality. Distributed sparsity (~30-65% active coordinates via RDMReg) trades exact linearity for tractability, and its benefit is empirical: lower-capacity predictors plan successfully over sparse codes where they fail over dense ones.

## Mode-Factored Structure

The empirically striking finding: learned non-negative sparse codes spontaneously factor into two complementary channels:

- **Binary support** = discrete dynamical regime (zone identity in piecewise force fields, decodable at 94-99%; contact vs free motion on OGBench-Cube given a temporal prior)
- **Feature magnitudes** = continuous within-regime state (e.g., agent position)

This structure emerged from training pressure, not architectural enforcement - but it required help to become semantically aligned: without temporal regularization, support transitions track whichever signal varies fastest (generic motion), not physical regime changes.

## Relation to Discrete Representations

Sparse continuous codes sit between dense embeddings and fully discrete codebooks:

| Geometry | Wiki anchors | Notes |
|----------|-------------|-------|
| Dense Gaussian | [[lejepa|LeWM]], [[sub-jepa|Sub-JEPA]] | Maximum-entropy default; all coordinates active |
| Sparse non-negative | [[lpwm|LpWM]] | Exact zeros; support/magnitude factorization |
| Categorical / VQ states | DreamerV2 (cited, not ingested); [[what-matters-latent-actions|VQ latent actions]] | Mode-committing; DreamerV2 found categorical latents beat Gaussians |
| Vocabulary-indexed sparse coefficients | [[j-cot|J-CoT]] | Sparse recurrence interface in reasoning models |

DreamerV2's categorical states are described by [[lpwm|LpWM]]'s related work as structured sparse binary representations whose benefit may itself come from sparsity - an open connection this wiki has not yet tested.

## Open Questions

> [!open-question]
> Does the predictor-simplification benefit survive against expressive predictors once dynamics are complex enough (the capacity-window hypothesis), or does it only matter in the compute-limited regime?

> [!open-question]
> Is the mode-factored support/magnitude split robust, or an artifact of low-dimensional environments with clean regime boundaries?

> [!open-question]
> Do folded low-dimensional degenerate sheets ([[feature-suppression|feature suppression]]) pass sparse-distribution checks like they pass Gaussianity projections? RDMReg constrains rectified projection marginals, which plausibly constrains folding more tightly than SIGReg - untested against planted features.

## Connections

- [[lpwm]] - primary source: RDMReg regularizer, one-hot linearization theory, mode-factoring evidence
- [[representation-collapse]] - sparse targets are another distribution-matching prevention mechanism; notably not maximum-entropy
- [[multimodal-futures-in-latent-world-models]] - discrete regimes in the support relate to the discrete-codebook escape family
- [[orthogonal-jepa]] - parallel structural alternative reducing effective transition complexity via factorized prediction instead of sparsified states
