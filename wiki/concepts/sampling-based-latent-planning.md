---
title: "Sampling-Based Latent Planning"
type: concept
created: 2026-07-24
updated: 2026-09-09
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
  - "[[intact]]"
  - "[[latent-geometry-beyond-search]]"
  - "[[generalization-theory-for-jepa-world-models]]"
  - "[[viscore]]"
  - "[[leflow]]"
  - "[[latent-energy-action-planning]]"
aliases:
  - "Latent model-predictive control"
  - "Sampling-based MPC in latent space"
  - "World-model trajectory optimization"
---

# Sampling-Based Latent Planning

## Overview

Sampling-based latent planning uses a learned [[world-models|world model]] to score candidate action sequences in representation space. Given current latent $z_t$ and goal latent $z_g$, a planner such as CEM or MPPI samples action sequences, predicts their terminal latents, and shifts its sampling distribution toward candidates minimizing a cost such as $\|\hat z_{t+H}-z_g\|_2^2$.

Recent sources show that closed-loop performance depends on at least four separable interfaces:

1. **Representation:** whether the latent preserves task-relevant state and has geometry suitable for optimization.
2. **Dynamics query:** how candidate actions are converted into predicted future latents.
3. **Proposal distribution:** which candidate actions the planner evaluates under a finite sampling budget.
4. **Direct inverse-control interface:** whether a desired latent change can be amortized into an action without mandatory candidate evaluation.

Improving only world-model prediction accuracy does not automatically solve the other interfaces.

## Representation and Cost Geometry

[[dino-wm|DINO-WM]] uses frozen DINOv2 patch features and CEM to plan toward arbitrary goal images. Patch features preserve spatial detail better than global tokens, but their latent geometry can be curved for gradient optimization.

[[temporal-straightening|Temporal Straightening]] regularizes trajectory curvature so Euclidean latent distance better approximates action-space reachability. This improves gradient-based planning and Hessian conditioning without replacing the basic latent goal cost.

[[leworldmodel|LeWorldModel]] instead trains a compact end-to-end JEPA encoder with SIGReg, producing task-adapted latents and fast reward-free CEM planning from pixels.

## Cross-representation terminal agreement

[[latent-energy-action-planning|LEAP]] keeps LeWM's encoder and autoregressive predictor frozen but changes how the planner scores and refines action sequences. It adds a decoder-predicted terminal-state energy to LeWM's terminal latent-goal cost, averages that state error over the final two predictions, initializes candidates from a frozen goal-conditioned action proposal, and refines the full horizon with L-BFGS before projecting actions into the admissible range.

This targets a planner-specific failure mode. An optimizer can lower latent cost by finding a rollout where model error is favorable, even as the predicted physical state and the demonstrated action move away from the goal. In the matched four-domain study, the full LEAP system reaches 94.8% mean success versus 77.5% for native LeWM+CEM, with 0.08 seconds more planning time per trial and 5.35 fewer budgeted environment steps. The paired ablation is more informative than the headline: latent-goal-only planning reaches 91.0%, terminal-state-only planning reaches 52.0%, and the combination reaches 96.5%.

The extra energy is a correction signal, not a support guarantee. LEAP does not constrain plans to the offline action or latent distribution, and its decoder assumes a numerical goal descriptor. See [[viscore|VISCORE]] for the broader distinction between on-manifold prediction, action influence, and search exploitation.

## Dynamics Query Interface

One-step world models evaluate an $H$-step candidate by recursively feeding predicted latents back into the transition model. This requires $H$ model calls and exposes later predictions to earlier errors.

[[fast-leworldmodel|Fast-LeWM]] replaces this chain with state-conditioned action-prefix tokens. A causal encoder represents each prefix, and a parallel predictor directly maps the observed anchor latent plus each prefix to its future latent. Under LeWM's benchmark protocol, this cuts dynamics evaluation from 31.4 seconds to 8.0 seconds and raises average success from 85.8% to 90.5%.

The design tradeoff is that direct prefix prediction is trained only over a bounded horizon. Longer horizons still require composition or a larger trained prefix window.

## Proposal Distribution Interface

Vanilla CEM and MPPI commonly begin from an uninformed Gaussian, spending many evaluations rediscovering action directions already present in demonstrations.

[[prism-prior-guided-imagination-sampling|PRISM]] predicts a state- and goal-conditioned Gaussian action prior from the frozen world-model encoder. Product-of-Gaussians fusion combines its mean and per-coordinate precision with MPPI's default distribution. Confident coordinates narrow the search, while uncertain ones approach the vanilla planner.

At 32 candidates, PRISM-MPPI exceeds vanilla LeWM MPPI at 128 candidates by 25 percentage points on PushT and 35 points on Cube. A mean-only warm start is weaker, showing that predicted uncertainty is a functional part of the planner rather than optional calibration metadata.

## Amortizing or Bypassing Search

[[intact|INTACT]] trains one conditional action operator on attached local physical displacement and detached future-goal displacement. Its Direct interface uses the learned conditional mean with zero sampled candidates, while the forward model remains available for recurrent imagined rollout and replanning.

[[latent-geometry-beyond-search|GC-IDM]] takes a closely related route through a frozen [[leworldmodel|LeWM]] latent space. It predicts the next action from the current latent, the goal latent, and the remaining horizon, then re-encodes the real observation after each action. On the four LeWM tasks, GC-IDM matches or exceeds CEM in seven of eight protocol cells and cuts per-plan-call cost by 100 to 130 times.

GC-IDM differs from INTACT in its training interface and control claim. GC-IDM fits a goal-conditioned inverse map separately for each environment from the same offline demonstrations as LeWM. It does not use imagined rollouts or candidate verification at inference. Push-T is its clear weak case, which supports the paper's view that long contact sequences can require more than local inverse recovery.

This differs from [[prism-prior-guided-imagination-sampling|PRISM]], which improves the proposal distribution but still samples and scores candidates. INTACT's Guarded A mode occupies an intermediate point: it centers a bounded 128-candidate, three-iteration CEM correction around the Direct plan. On the paper's four simulated tasks, Direct reaches 95.33% macro success and Guarded A reaches 96.86% using 384 rather than 9,000 candidate sequences.

The result does not establish that search is obsolete outside demonstrated task and goal support. Multimodal actions, obstacle-induced nonlinearity, latent rollout drift, and distribution shift may increase the value of uncertainty-triggered verification.

## CEM versus MPPI

Both planners iteratively improve a Gaussian proposal, but their variance treatment differs:

- **CEM** refits mean and variance from elite samples. It can adapt aggressively but may collapse variance around a poor low-sample elite set.
- **MPPI** in PRISM updates the mean while retaining fused variance. This preserves prior confidence across iterations and is robust at small candidate budgets.

PRISM's comparison is budget-dependent. At 32 PushT candidates, fixed-variance MPPI scores 82% versus CEM's 43%; at 128 candidates, CEM reaches 91% versus MPPI's 89%. This does not establish a universally superior planner, but shows that uncertainty updates should match the sample regime.

## Learned Latent-Trajectory Proposals

[[leflow|LeFlow]] amortizes the proposal distribution in latent trajectory space. A conditional rectified-flow model generates diverse paths between encoded start and goal states, an inverse-dynamics decoder recovers action chunks, and the frozen world model reranks the candidates by actual terminal distance. On the four LeWM tasks, this removes the repeated CEM optimization loop and reduces evaluation time by 4.5x to 14.4x while improving reported success.

LeFlow therefore targets the proposal and planning-loop bottleneck rather than the dynamics-query bottleneck. It remains a sampled controller because its feasibility filter still performs batched predictor rollouts; [[intact|INTACT]] is the stronger search-bypass comparison, while [[fast-leworldmodel|Fast-LeWM]] accelerates the rollout side.

## Diagnosing the Complete Planning Stack

[[viscore|VIScore]] adds veracity, influence, and sobriety diagnostics for the encoder-predictor-planner system. This makes explicit that good static probes or straight latent trajectories do not guarantee that actions produce distinguishable effects or that search avoids exploiting model error. Its transfer results are strongest for ranking checkpoints, not for universally calibrated success scores.

[[generalization-theory-for-jepa-world-models|JEPA World Model Generalization Theory]] supplies a complementary statistical view: under its spectral objective and planning assumptions, prediction risk bounds observation-space planning regret, with approximation and estimation terms controlled by latent rank. The theory does not yet cover the full practical planner and regularizer diversity summarized here.

## Combined Design Space

The approaches are complementary:

| Bottleneck | Representative approach | Main intervention |
| --- | --- | --- |
| Latent geometry | [[temporal-straightening]] | Make distance align with reachable trajectories |
| Rollout cost and compounding error | [[fast-leworldmodel|Fast-LeWM]] | Parallel action-prefix prediction |
| Candidate sample efficiency | [[prism-prior-guided-imagination-sampling|PRISM]] | Confidence-weighted learned proposal |
| Mandatory candidate search | [[intact|INTACT]] | Shared intent-to-action conditional with optional local verification |
| Direct goal-conditioned control | [[latent-geometry-beyond-search|GC-IDM]] | Horizon-conditioned inverse action from frozen latents |
| Deployment shift | [[adajepa|AdaJEPA]] | Adapt encoder and predictor during MPC |

A natural combined controller would use task-relevant latents, parallel prefix prediction, a calibrated direct action conditional or proposal, uncertainty-triggered verification, and closed-loop adaptation. These components may interact, so their gains should not be assumed additive without shared ablations.

## Open Questions

> [!open-question]
> Do Fast-LeWM's parallel dynamics evaluation and PRISM's low-budget proposal guidance combine multiplicatively, or does a stronger proposal reduce the value of accelerating large candidate sets?

> [!open-question]
> How should a planner allocate compute among better representations, longer prediction horizons, more candidates, and online adaptation?

> [!open-question]
> Can a geometry-aware goal representation replace LEAP's numerical descriptor while preserving cross-representation terminal checks under occlusion, domain shift, and longer horizons?

> [!open-question]
> Can multimodal action priors preserve closed-form or similarly reliable fusion without causing mode collapse in low-budget MPC?

> [!open-question]
> Which uncertainty matters most for robust planning: action-prior uncertainty, world-model epistemic uncertainty, rollout inconsistency, or latent-distance calibration?
