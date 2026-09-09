---
title: "Gaoyue Zhou"
type: entity
created: 2026-07-25
updated: 2026-07-25
tags:
  - researcher
  - robotics
  - world-model
  - representation-learning
sources:
  - "[[dino-wm]]"
  - "[[temporal-straightening]]"
  - "[[patch-policy]]"
aliases:
  - "G. Zhou"
---

# Gaoyue Zhou

## Overview

Gaoyue Zhou is a researcher affiliated with New York University's Courant Institute in [[patch-policy|Patch Policy]]. Across the sources represented in this wiki, Zhou's work connects frozen pretrained visual features, latent world-model planning, representation geometry, and efficient robot control.

## Role in This Wiki

- First author of [[dino-wm|DINO-WM]], which learns action-conditioned latent dynamics over frozen DINOv2 patch features for zero-shot visual planning.
- Co-author of [[temporal-straightening|Temporal Straightening]], which regularizes latent trajectory curvature to make pretrained-feature world models more compatible with gradient-based planning.
- Equal-contribution first author and corresponding author of [[patch-policy|Patch Policy]], which directly feeds frozen dense ViT features to lightweight imitation policies.

## Research Thread

The three papers form a progression across the robot-control stack:

1. **Representation as planning state**: DINO-WM shows that frozen dense visual features can serve as a spatial latent state for model-predictive control.
2. **Geometry as planning interface**: Temporal Straightening shows that semantic quality alone is insufficient when latent distances and trajectories are poorly conditioned for optimization.
3. **Representation as direct policy input**: Patch Policy shows that dense pretrained features can also support high-frequency reactive control without an explicit learned dynamics model.

Together, this line separates several questions that are often conflated: whether a representation retains local visual state, whether its geometry supports planning, and whether direct policy learning can consume it efficiently.
