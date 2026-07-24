---
title: "Manifold Steering Reveals the Shared Geometry of Neural Network Representation and Behavior"
type: source
created: 2026-05-16
updated: 2026-07-11
arxiv_id: "2605.05115"
authors:
  - "Daniel Wurgaft"
  - "Can Rager"
  - "Matthew Kowal"
  - "Vasudev Shyam"
  - "Tal Haklay"
  - "Raphael Sarfati"
  - "Thomas McGrath"
  - "Owen Lewis"
  - "Jack Merullo"
  - "Sheridan Feucht"
  - "Usha Bhalla"
  - "Eric Bigelow"
  - "Noah D. Goodman"
  - "Thomas Fel"
  - "Atticus Geiger"
  - "Ekdeep Singh Lubana"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.05115"
tags:
  - representation-learning
  - theory
  - language
  - vision
  - world-model
aliases:
  - "Manifold Steering"
---

# Manifold Steering Reveals the Shared Geometry of Neural Network Representation and Behavior

## Summary

Manifold Steering argues that neural representation geometry has a causal role in model behavior. Instead of steering activations along straight Euclidean lines, the paper fits intrinsic activation and behavior manifolds and shows that interventions following the activation manifold produce smoother, more natural behavioral trajectories.

## Key Contributions

- **Shared geometry claim**: activation manifolds and behavior manifolds are approximately scaled isometries across several conceptual domains.
- **Manifold steering**: replaces linear activation interpolation with geodesic movement along a fitted activation manifold.
- **Causal evidence**: on-manifold interventions produce natural behavior; optimizing for natural behavior recovers the activation manifold.
- **Cross-domain validation**: results span Llama weekday/month/letter/age tasks, in-context graph tasks, and a visual Mountain Car world model.
- **Geometric framework**: casts steering strategies as geodesics under flat, density-derived, or behavior-derived metrics.

## Methodology

The authors compute concept centroids in activation space and fit low-dimensional splines or thin-plate splines to form an activation manifold. They also fit a behavior manifold to output probability distributions embedded in Hellinger space. They then compare geodesic distances across the two manifolds and perform interventions by replacing residual-stream activations with points along linear or manifold paths.

A pullback experiment solves the inverse problem: find an activation-space path that induces a target geodesic trajectory in behavior space. If the optimized path follows the activation manifold, that supports a bidirectional link between representation and behavior geometry.

## Key Results

- Activation and behavior geodesic distances correlate extremely strongly for many tasks, including 0.99 for weekdays and near 0.999 for letters and ages.
- Linear activation distances correlate much worse and often distort the conceptual structure.
- Manifold steering produces smooth ordered transitions, while linear steering can cause probability mass to teleport to non-adjacent concepts.
- Pullback paths recover the curvature of activation manifolds better than linear baselines.
- A visual Mountain Car world model shows the same pattern: manifold steering yields coherent car-position changes while linear steering blurs or mixes positions.

## Connections

- Extends [[global-geometry-is-not-enough|Global Geometry Is Not Enough]] from diagnostics to interventions: geometry matters when it is the intrinsic geometry of model behavior, not just a global covariance summary.
- Relevant to [[world-models|world models]] because the visual experiment suggests latent manifolds can be navigated to control predicted physical states.
- Related to [[steerable-visual-representations|Steerable Visual Representations]] as another approach to controllable representations, though this paper steers internal geometry rather than adding language adapters.

## Limitations & Open Questions

> [!open-question]
> Can useful manifolds be discovered without labeled concept coordinates, especially for abstract behaviors such as refusal, sycophancy, or task planning?

> [!open-question]
> How stable are fitted manifolds across prompts, layers, model sizes, and training checkpoints?

## Future Work

- Extend validation to abstract concepts such as refusal, sycophancy, and persuasion, where behavioral signatures of conceptual structure are subtler than in weekday or letter tasks.
- Test whether conceptual geometry for such abstract behaviors can still be inferred from behavior and related to activation representations as in the simpler domains.
- Investigate the origins of shared geometry between behavior and representation manifolds, including how conceptual structure constrains both spaces beyond training-data statistics.
- Develop intrinsic manifold coordinates as primitive units for causal analysis of neural network internals, constraining degenerate causal-abstraction solutions.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2605.05115)
- [arXiv](https://arxiv.org/abs/2605.05115)
