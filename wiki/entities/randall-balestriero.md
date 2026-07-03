---
title: "Randall Balestriero"
type: entity
created: 2026-04-10
updated: 2026-07-03
tags:
  - researcher
  - meta-fair
  - jepa
  - theory
sources:
  - "[[causal-jepa]]"
  - "[[lejepa]]"
  - "[[leworldmodel]]"
  - "[[temporal-straightening]]"
  - "[[sensorimotor-world-models]]"
  - "[[levljepa]]"
aliases:
  - "Balestriero"
---

# Randall Balestriero

## Overview

Researcher at [[meta-fair|Meta FAIR]], working closely with [[yann-lecun|Yann LeCun]] on the theoretical and practical foundations of [[jepa|JEPA]] and [[self-supervised-learning|self-supervised learning]].

## Role in This Wiki

Co-author on several key JEPA papers focused on principled, theoretically-grounded representation learning:

- [[lejepa|LeJEPA]] — developed the SIGReg regularizer and theoretical framework
- [[leworldmodel|LeWorldModel]] — applied LeJEPA's ideas to world models
- [[causal-jepa|Causal-JEPA]] — extended JEPA to object-centric representations
- [[temporal-straightening|Temporal Straightening]] — curvature regularization for latent planning geometry (ICML 2026, with Wang, LeCun, Ren)
- [[sensorimotor-world-models|SMWM]] — inverse dynamics regularization for action-aligned end-to-end JEPA world models (with Ivashkov, Schölkopf)
- [[levljepa|LeVLJEPA]] — non-contrastive vision-language pretraining via cross-modal prediction + SIGReg (with Kuhn, Serra, Buettner)

## Research Theme

Balestriero's work consistently emphasizes **theoretical rigor** and **simplicity**:

- [[lejepa|LeJEPA]] proves the isotropic Gaussian is optimal and derives SIGReg (~50 lines of code)
- [[leworldmodel|LeWM]] reduces loss hyperparameters from 6 to 1
- [[sensorimotor-world-models|SMWM]] replaces distributional regularizers with a single inverse dynamics term
- All papers eliminate heuristics (EMA, stop-gradient, schedulers) where possible
