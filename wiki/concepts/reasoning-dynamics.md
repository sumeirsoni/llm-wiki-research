---
title: "Reasoning dynamics"
type: concept
created: 2026-09-09
updated: 2026-09-09
tags:
  - language
  - transformer
  - optimization
  - theory
  - representation-learning
sources:
  - "[[fractal-basins-trap-latent-reasoning]]"
  - "[[equilibrium-reasoners]]"
  - "[[fixed-point-reasoners]]"
  - "[[attractor-models]]"
  - "[[loop-think-generalize]]"
aliases:
  - "Latent reasoning dynamics"
  - "Fractal reasoning basins"
---

# Reasoning dynamics

## Overview

Reasoning dynamics treats repeated latent computation as a state-transition system. The input and model weights define the transition rule. A correct answer can act as a stable fixed point, while incorrect or incomplete answers can act as other fixed points, saddle points, or transient states.

## Basin structure explains slow reasoning

[[fractal-basins-trap-latent-reasoning|Fractal basins trap latent reasoning]] varies initial latent states and labels each state by its settling time. Difficult Sudoku, maze, visual, and logic tasks produce complex basins whose local structure becomes fractal. Nearby initial states can therefore take very different routes and times before reaching the same answer.

The paper links these patterns to transient chaos. A trajectory that passes near a weakly unstable saddle can stay near a nearly correct solution, then escape along one of several directions. Maze dead ends and invalid Sudoku grids are concrete examples. Basin entropy measures local variation in settling time, while the fast Lyapunov indicator highlights boundaries between routes.

## Training changes the fixed points

In a finite-field linear-system experiment, a looped transformer begins with stable fixed points for many incorrect answers. As solving ability appears, those incorrect points lose stability and become saddles. Positive finite-time Lyapunov exponents appear in the variables that require multi-step elimination. The result ties multi-step reasoning to the ability to escape incorrect solutions, even though that escape creates longer transients.

This finding adds a cost to more capable reasoning. A model that can leave a nearly correct answer may also spend longer near the failed route before it reaches the correct one. The useful control target is therefore not zero transient complexity. It is a reliable path to the correct fixed point with a bounded settling time.

## Relation to attractor models

[[equilibrium-reasoners|Equilibrium Reasoners]] shapes attractor state spaces so correct solutions become reliable fixed points and fixed-point residuals can guide selection. [[fixed-point-reasoners|Fixed-Point Reasoning Models]] makes convergence a native halting condition. [[attractor-models|Attractor Models]] studies fixed-point refinement in output-embedding space. The fractal-basin results add a route-level diagnostic to these endpoint-focused methods.

## Open Questions

> [!open-question]
> Can a model reduce time spent near failed saddles without losing the ability to escape them?

> [!open-question]
> Do basin entropy and finite-time Lyapunov exponents transfer from algorithmic puzzles to open-ended language reasoning?
