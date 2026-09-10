---
title: "SG-JEPA"
type: entity
created: 2026-09-10
updated: 2026-09-10
tags:
  - jepa
  - world-model
  - representation-learning
sources:
  - "[[semigroup-jepa]]"
aliases:
  - "SG-JEPA world model"
  - "Gravity-conditioned JEPA model"
---

# SG-JEPA

## Identity

SG-JEPA is a gravity-conditioned JEPA world model introduced by [[semigroup-jepa|Semigroup-JEPA]]. It extends [[leworldmodel|LeWorldModel]] with recursive latent-rollout training and tests whether a learned representation transfers across gravitational fields.

## Design

SG-JEPA supplies gravity as an action coordinate, predicts five future latents autoregressively, and regularizes the encoded latents with SIGReg. Its main variants use GRU or state-space predictors. The encoder and predictor train together, and predicted latents re-enter the next history window.

## Reported behavior

SG-JEPA improves long-horizon physical prediction and closed-loop control on MuJoCo tasks under held-out gravity values. The paper's crossover experiments attribute the main advantage to the dynamics-relevant representation learned with the GRU predictor.
