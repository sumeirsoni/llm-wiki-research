---
title: "Object-Centric World Models"
type: concept
created: 2026-09-04
updated: 2026-09-04
tags:
  - world-model
  - jepa
  - vision
  - representation-learning
  - robotics
sources:
  - "[[causal-jepa]]"
  - "[[better-slots-better-worlds]]"
aliases:
  - "OCWM"
  - "Object-centric world modeling"
---

# Object-Centric World Models

## Overview

Object-centric world models represent a scene as a set of slots intended to bind to individual objects or entities. Their appeal is structural: object slots may factorize dynamics, preserve object identity across time, and support compositional generalization under changes to backgrounds, object counts, or interactions. In this wiki, [[causal-jepa|Causal-JEPA]] uses object-level masking to induce interaction reasoning, while [[better-slots-better-worlds|Better Slots Better Worlds]] isolates slot quality and robustness in planning.

## Representation and Dynamics

An object-centric encoder maps each frame to slots $s_1,\ldots,s_K$. A world-model predictor then forecasts future slots, and the planner compares predicted slots with goal slots. Stable slot identity matters because temporal permutation would force matching before dynamics prediction; SlotContrast is used in the newer study to avoid this matching step.

Object-centricity is not a single intervention. It includes:

- **Binding**: whether slots consistently isolate task-relevant objects.
- **Temporal identity**: whether a slot tracks the same object across frames.
- **Interaction structure**: whether the predictor models how objects affect one another rather than only their self-dynamics.
- **Planning geometry**: whether slot distances correspond to reachable goals.
- **Robustness**: whether object-level factors survive appearance and scene shifts.

## Evidence from This Wiki

[[causal-jepa|Causal-JEPA]] masks objects and predicts their latent states from visible objects, adding a causal-intervention interpretation to JEPA training. [[better-slots-better-worlds|Better Slots Better Worlds]] finds that planning success tracks FG-ARI and mBO until slot quality saturates. Once SlotContrast slots are well bound, proprioception and slot masking become unnecessary on the tested manipulation tasks.

The robustness result is more nuanced. SlotContrast-WM is strongest under object-level appearance shifts, but [[dino-wm|DINO-WM]] remains similarly robust because it also uses frozen pretrained visual features. End-to-end [[leworldmodel|LeWM]] degrades more under these shifts. This suggests that pretrained visual features and object binding are partially separable contributors.

## Tradeoffs

- **Compositional structure**: slots can make object interactions explicit and reduce entanglement.
- **Small-object sensitivity**: global slot metrics can underweight small but action-critical objects.
- **Physical invariance**: object identity does not automatically preserve contact dynamics under shape or geometry changes.
- **Encoder dependence**: a weak slot encoder may require masking or proprioception shortcuts, hiding the value of object-centric dynamics.
- **Planner dependence**: better slots can improve a CEM cost without guaranteeing robustness under other planners or stochastic futures.

## Open Questions

> [!open-question]
> Can task-aware slot metrics predict planning success better than generic segmentation quality when target objects are small or contact events are decisive?

> [!open-question]
> Can object-centric world models learn geometry- and embodiment-invariant interaction dynamics rather than only robust appearance factors?

> [!open-question]
> Should slot encoders and dynamics predictors be trained end to end, or does a frozen pretrained feature foundation provide the more reliable robustness prior?

