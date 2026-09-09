---
title: "Goal-Conditioned Inverse Dynamics Model"
type: entity
created: 2026-09-09
updated: 2026-09-09
tags:
  - world-model
  - reinforcement-learning
  - optimization
  - representation-learning
sources:
  - "[[latent-geometry-beyond-search]]"
aliases:
  - "GC-IDM"
  - "Goal-conditioned inverse dynamics"
---

# Goal-Conditioned Inverse Dynamics Model

## Identity

GC-IDM is a 1.5M-parameter goal-conditioned inverse dynamics controller from [[latent-geometry-beyond-search]]. It predicts the next action from the current LeWorldModel latent, the goal latent, and the remaining horizon.

## Role in planning

GC-IDM replaces CEM's candidate rollouts with one MLP forward pass per closed-loop action. It trains on frozen LeWM embeddings from the same offline demonstrations as the world model. On the four tested LeWM tasks, it matches or exceeds CEM in seven of eight protocol cells and reduces per-plan-call cost by 100 to 130 times.
