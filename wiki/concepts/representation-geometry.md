---
title: "Representation Geometry"
type: concept
created: 2026-05-16
updated: 2026-07-03
tags:
  - representation-learning
  - theory
sources:
  - "[[global-geometry-is-not-enough]]"
  - "[[manifold-steering]]"
  - "[[steerable-visual-representations]]"
  - "[[sub-jepa]]"
  - "[[convergent-world-representations-and-divergent-tasks]]"
  - "[[on-the-geometry-of-on-policy-distillation]]"
  - "[[on-policy-representation-distillation]]"
  - "[[temporal-straightening]]"
  - "[[dino-wm]]"
aliases:
  - "Embedding geometry"
  - "Representation manifolds"
---

# Representation Geometry

## Overview

Representation geometry studies the structure of learned embedding spaces: their global distribution, local sensitivity, manifolds, and how those structures affect downstream behavior. The newer papers in this wiki complicate a simple "good geometry equals good representation" story.

## Global vs. Functional Geometry

[[global-geometry-is-not-enough|Global Geometry Is Not Enough]] shows that global isotropy and participation ratio do not predict compositional binding across vision encoders. Jacobian Effective Rank, which measures local input-output sensitivity, is much more predictive.

This matters for [[lejepa|LeJEPA]] and [[sub-jepa|Sub-JEPA]] because Gaussian regularization improves stability, but global geometric regularity alone may not guarantee compositional or action-relevant structure.

## Manifold Geometry and Control

[[manifold-steering|Manifold Steering]] argues that intrinsic activation manifolds are causally tied to model behavior. Steering along a fitted manifold produces smoother behavioral trajectories than straight-line activation interpolation, suggesting that useful representation geometry can be curved and task-specific.

## Task-Dependent and Divergent Geometry

[[convergent-world-representations-and-divergent-tasks|Convergent World Representations and Divergent Tasks]] shows that single-task training yields distinct world geometries for the same underlying entities, while multi-task training drives CKA convergence. However, fine-tuning on divergent tasks can fracture shared manifolds when integrating new entities, revealing a gap between forward coherence and backward adaptability.

## Prompt-Steered Geometry

[[steerable-visual-representations|Steerable Visual Representations]] adds another axis: text prompts can reorganize visual embedding spaces toward queried objects, parts, or attributes. This is not just a better static embedding; it is a controllable representation whose geometry depends on the task prompt.

## Trajectory Geometry for Planning

[[temporal-straightening|Temporal Straightening]] adds a control-relevant geometric criterion: **latent trajectory curvature**. Pretrained DINOv2 features ([[dino-wm|DINO-WM]]) encode rich semantics but produce highly curved latent paths where Euclidean distance misaligns with geodesic (shortest-action) distance. Penalizing curvature during JEPA world model training straightens trajectories, improves planning Hessian conditioning, and makes gradient-based MPC viable. This complements global isotropy metrics ([[lejepa|LeJEPA]]) with geometry tailored to dynamical reachability.

## Parameter-Space Update Geometry

[[on-the-geometry-of-on-policy-distillation|On the Geometry of On-Policy Distillation]] extends geometric analysis from embedding spaces to **parameter-space update trajectories** during LLM post-training. On-policy distillation occupies a relaxed off-principal regime between SFT (dense, principal-aligned) and RLVR (sparse, off-principal), with subspace locking — cumulative updates rapidly enter a narrow low-dimensional channel that is functionally sufficient.

[[on-policy-representation-distillation|OPRD]] shows that hidden-state geometry can differ substantially from output distributions: the LM head's null space hides representational differences that output-space distillation cannot see. Representation-level alignment provides strictly richer supervision than token-level KL alone.

## Open Questions

> [!open-question]
> What combination of global regularity, local Jacobian sensitivity, and manifold structure best predicts transfer in real downstream tasks?

> [!open-question]
> Can representation geometry diagnostics guide the design of robot [[world-models|world models]], where latent spaces must preserve both semantics and controllable physical dynamics?
