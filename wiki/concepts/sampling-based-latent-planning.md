---
title: "Sampling-Based Latent Planning"
type: concept
created: 2026-07-24
updated: 2026-07-24
tags:
  - world-model
  - reinforcement-learning
  - robotics
  - optimization
sources:
  - "[[leworldmodel]]"
  - "[[dino-wm]]"
  - "[[temporal-straightening]]"
  - "[[adajepa]]"
  - "[[fast-leworldmodel]]"
  - "[[prism-prior-guided-imagination-sampling]]"
aliases:
  - "Latent model-predictive control"
  - "Sampling-based MPC in latent space"
  - "World-model trajectory optimization"
---

# Sampling-Based Latent Planning

## Overview

Sampling-based latent planning uses a learned [[world-models|world model]] to score candidate action sequences in representation space. Given current latent $z_t$ and goal latent $z_g$, a planner such as CEM or MPPI samples action sequences, predicts their terminal latents, and shifts its sampling distribution toward candidates minimizing a cost such as $\|\hat z_{t+H}-z_g\|_2^2$.

Recent sources show that closed-loop performance depends on at least three separable interfaces:

1. **Representation:** whether the latent preserves task-relevant state and has geometry suitable for optimization.
2. **Dynamics query:** how candidate actions are converted into predicted future latents.
3. **Proposal distribution:** which candidate actions the planner evaluates under a finite sampling budget.

Improving only world-model prediction accuracy does not automatically solve the other two bottlenecks.

## Representation and Cost Geometry

[[dino-wm|DINO-WM]] uses frozen DINOv2 patch features and CEM to plan toward arbitrary goal images. Patch features preserve spatial detail better than global tokens, but their latent geometry can be curved for gradient optimization.

[[temporal-straightening|Temporal Straightening]] regularizes trajectory curvature so Euclidean latent distance better approximates action-space reachability. This improves gradient-based planning and Hessian conditioning without replacing the basic latent goal cost.

[[leworldmodel|LeWorldModel]] instead trains a compact end-to-end JEPA encoder with SIGReg, producing task-adapted latents and fast reward-free CEM planning from pixels.

## Dynamics Query Interface

One-step world models evaluate an $H$-step candidate by recursively feeding predicted latents back into the transition model. This requires $H$ model calls and exposes later predictions to earlier errors.

[[fast-leworldmodel|Fast-LeWM]] replaces this chain with state-conditioned action-prefix tokens. A causal encoder represents each prefix, and a parallel predictor directly maps the observed anchor latent plus each prefix to its future latent. Under LeWM's benchmark protocol, this cuts dynamics evaluation from 31.4 seconds to 8.0 seconds and raises average success from 85.8% to 90.5%.

The design tradeoff is that direct prefix prediction is trained only over a bounded horizon. Longer horizons still require composition or a larger trained prefix window.

## Proposal Distribution Interface

Vanilla CEM and MPPI commonly begin from an uninformed Gaussian, spending many evaluations rediscovering action directions already present in demonstrations.

[[prism-prior-guided-imagination-sampling|PRISM]] predicts a state- and goal-conditioned Gaussian action prior from the frozen world-model encoder. Product-of-Gaussians fusion combines its mean and per-coordinate precision with MPPI's default distribution. Confident coordinates narrow the search, while uncertain ones approach the vanilla planner.

At 32 candidates, PRISM-MPPI exceeds vanilla LeWM MPPI at 128 candidates by 25 percentage points on PushT and 35 points on Cube. A mean-only warm start is weaker, showing that predicted uncertainty is a functional part of the planner rather than optional calibration metadata.

## CEM versus MPPI

Both planners iteratively improve a Gaussian proposal, but their variance treatment differs:

- **CEM** refits mean and variance from elite samples. It can adapt aggressively but may collapse variance around a poor low-sample elite set.
- **MPPI** in PRISM updates the mean while retaining fused variance. This preserves prior confidence across iterations and is robust at small candidate budgets.

PRISM's comparison is budget-dependent. At 32 PushT candidates, fixed-variance MPPI scores 82% versus CEM's 43%; at 128 candidates, CEM reaches 91% versus MPPI's 89%. This does not establish a universally superior planner, but shows that uncertainty updates should match the sample regime.

## Combined Design Space

The approaches are complementary:

| Bottleneck | Representative approach | Main intervention |
| --- | --- | --- |
| Latent geometry | [[temporal-straightening]] | Make distance align with reachable trajectories |
| Rollout cost and compounding error | [[fast-leworldmodel|Fast-LeWM]] | Parallel action-prefix prediction |
| Candidate sample efficiency | [[prism-prior-guided-imagination-sampling|PRISM]] | Confidence-weighted learned proposal |
| Deployment shift | [[adajepa|AdaJEPA]] | Adapt encoder and predictor during MPC |

A natural combined planner would use task-relevant latents, parallel prefix prediction, a calibrated action prior, and closed-loop adaptation. These components may interact, so their gains should not be assumed additive without shared ablations.

## Open Questions

> [!open-question]
> Do Fast-LeWM's parallel dynamics evaluation and PRISM's low-budget proposal guidance combine multiplicatively, or does a stronger proposal reduce the value of accelerating large candidate sets?

> [!open-question]
> How should a planner allocate compute among better representations, longer prediction horizons, more candidates, and online adaptation?

> [!open-question]
> Can multimodal action priors preserve closed-form or similarly reliable fusion without causing mode collapse in low-budget MPC?

> [!open-question]
> Which uncertainty matters most for robust planning: action-prior uncertainty, world-model epistemic uncertainty, rollout inconsistency, or latent-distance calibration?
