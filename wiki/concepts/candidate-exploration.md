---
title: "Explorative Modeling"
type: concept
created: 2026-08-01
updated: 2026-08-20
tags:
  - generative-modeling
  - optimization
  - flow-matching
sources:
  - "[[explorative-modeling]]"
  - "[[delta-world]]"
  - "[[why-the-third-axis-is-freedom]]"
  - "[[roms-imle]]"
aliases:
  - "Explorative Models"
  - "XM"
  - "Best-of-Many training"
  - "Best-of-K training"
---

# Explorative Modeling

## Overview

Explorative modeling trains a generator by searching over multiple candidate-to-target couplings and updating the best match. In Forward XM, $K$ outputs compete to explain one target; in Reverse XM, one output is matched to the closest of $K$ targets. This shifts part of multimodality handling from a factorized inference path, such as many diffusion steps, into the training loop.

The candidate count $K$ is proposed as a third pretraining axis alongside model parameters and data. Increasing it adds training compute and generative expressivity without necessarily increasing inference cost, but the useful range depends on the search latent, candidate diversity, and whether winner selection learns calibrated mode probabilities.

## Core Objectives

### Forward Exploration

Forward XM samples $K$ generations for each target and updates only the minimum-cost candidate:

$$
\min_i J(\hat y_i,x).
$$

Its main bias is toward coverage: candidates can specialize instead of averaging across incompatible modes. [[delta-world|DeltaWorld]] independently applies this pattern as Best-of-Many training for diverse future-video features.

### Reverse Exploration

Reverse XM generates once and searches among $K$ data targets. This avoids $K$ model forward passes and favors precision, but the objective can improve by contracting onto common modes. It therefore needs an entropy bonus, a Forward term, or another explicit coverage constraint.

## Relation to Other Generative Axes

- **Generation depth**: diffusion, autoregression, and [[flow-matching|flow matching]] reduce ambiguity through many conditional prediction stages. XM increases the number of candidate couplings considered during training.
- **Transition expressivity**: [[normalizing-trajectory-models|Normalizing Trajectory Models]] preserve few-step diversity with richer conditional distributions at each reverse transition.
- **Distribution-level losses**: [[representation-frechet-loss|Representation Frechet Loss]] directly matches generated and real representation statistics rather than selecting the closest pointwise candidate.
- **Variable output structure**: [[variable-dimensional-generative-flows|Variable-Dimensional Generative Flows]] scale the active state dimension during inference; XM scales candidate search during training while leaving output dimensionality fixed.
- **Inference-time width**: best-of-$N$ sampling spends compute after training. XM spends analogous width during pretraining so a single deployed sample can benefit from candidate specialization.

### IMLE matching as a related but different search

[[roms-imle|ROMS-IMLE]] also samples a candidate pool and selects a nearest generated sample, but its hard assignment couples each training example to a generator output during IMLE optimization. It is therefore a training-time matching mechanism rather than the explicit best-of-many target-selection objective used by Forward XM. The connection is useful because both methods move some multimodality handling into candidate search, while their coverage and gradient behavior differ.

## Scaling Evidence

[[explorative-modeling|Explorative Modeling]] reports monotonic image and video improvements across its tested $K$ values, plus larger relative gains at larger model, data, and compute scales. XRAE matches baseline quality with 4.1x fewer estimated FLOPs and 6.2x fewer processed samples despite the added candidate passes. These observations motivate exploration scaling laws, but they do not yet establish a compute-optimal frontier or unlimited scaling behavior.

## Exploration Versus Freedom

[[why-the-third-axis-is-freedom|Why the Third Axis Is Freedom]] distinguishes the candidate budget $K$ from the property it may select. Under IID candidates, best-of-$K$ replaces acceptable-set miss probability with $(1-q)^K$; under uniform targets and balanced support, larger $K$ favors policies retaining more valid completions. Broader support is not sufficient when probability mass is badly concentrated, and the current evidence is synthetic. The proposed third axis is therefore better stated as behavioral freedom accessed through exploration, not candidate count alone.

## Failure Modes

- Forward cost grows with $K$ and may become prohibitive for high-mode-count distributions.
- Hard winner selection gives no gradient to losing candidates and can produce unstable or underused hypotheses.
- Hard-min support coverage does not guarantee correct mode frequencies or likelihood calibration.
- Reverse exploration is explicitly mode-seeking and can collapse without coverage regularization.
- Search requires a useful latent variable; autoregressive language models do not expose one as naturally as continuous generators expose noise.
- Training losses change with $K$, so external distribution and downstream metrics are required for comparison.

## Open Questions

> [!open-question]
> What is the compute-optimal allocation among model size, training data, candidate count, and generation depth?

> [!open-question]
> Can soft assignment, structured latent search, or explicit distributional objectives preserve the efficiency of winner-selected training while calibrating mode probabilities?

> [!open-question]
> When does exploration during training dominate richer few-step transitions, distribution-level losses, or inference-time best-of-$N$ sampling at matched total compute?
