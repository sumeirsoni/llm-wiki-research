---
title: "INTACT: Isomorphic Intent-to-Action Learning for Search-Free World Models"
type: source
created: 2026-07-30
updated: 2026-07-30
arxiv_id: "2607.26056"
authors:
  - "Junhan Sun"
  - "Hao Zhao"
  - "Guofeng Zhang"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.26056"
tags:
  - jepa
  - world-model
  - reinforcement-learning
  - robotics
  - representation-learning
aliases:
  - "INTACT"
  - "INtent-To-ACTion"
---

# INTACT: Isomorphic Intent-to-Action Learning for Search-Free World Models

## Summary

INTACT augments a [[jepa|JEPA]] world model with a shared conditional action operator that maps latent motion intent to an action distribution. The same operator is trained on an attached one-step physical displacement and a stop-gradient future-goal displacement, so action supervision shapes the encoder while also supplying a deployable goal-conditioned controller. On four simulated LeWM tasks, separately trained one-epoch models reach 95.33% macro success with Direct control and no candidate search; a bounded local verifier raises this to 96.86%. The paper's narrower claim is not that search is universally unnecessary, but that a learned inverse control interface can make search optional within the demonstrated task and goal support.

## Key Contributions

- Identifies a **representation-control asymmetry** in latent world models: training learns what actions do, while deployment often recovers actions through expensive CEM or MPPI search.
- Introduces one shared intent-to-action predictor for local physical transitions and future deployment goals, using identical input structure and parameters for both condition families.
- Routes gradients differently by intent: the local successor remains attached to shape action-recoverable representations, while the future goal is a detached deployment anchor.
- Supports **Direct** zero-candidate control while retaining the forward model for recurrent rollout, replanning, and optional local verification.
- Shows that intent supervision improves actor-disabled CEM as well as the direct controller, indicating that it changes the encoder and forward-model stack rather than only adding a policy head.
- Trains one visual encoder across PushT, Cube, Reacher, and TwoRoom with task-specific dynamics and action heads.

## Methodology

A visual encoder maps observation $o_t$ to latent state $z_t$. A LeWM-style action-conditioned forward predictor models the next latent and retains SIGReg for representation stability. The INTACT predictor outputs a diagonal Gaussian action distribution from the shared grammar

$$
[z_t,\; m_t,\; z_t \odot m_t,\; A(a_{t-1})],
$$

where $m_t$ is one of two motion intents:

1. **Local physical intent:** $m_t^{local}=z_{t+1}-z_t$. The real successor remains attached to encoder gradients, grounding the representation in action-recoverable physical changes.
2. **Goal intent:** $m_t^{goal}=\operatorname{sg}(z_g)-z_t$. The future endpoint is stop-gradient, so it acts as a deployment request rather than being forced into a one-step physical-successor role.

The paper calls the two calls isomorphic in a structural and conditional-semantic sense: they share the same predictor graph, and supported intent families correspond through their induced action laws. It does not claim pointwise equality between local and goal latent coordinates.

At deployment, **Direct** control autoregressively uses the predictor mean as the action, advances the imagined latent through the forward model, executes the first action chunk, and replans from the next real observation. **Guarded A** centers a small 128-candidate, three-iteration CEM correction around the Direct plan. Pure CEM remains an actor-disabled baseline.

The goal branch is a GCSL-like goal-conditioned imitation objective. The authors explicitly do not place INTACT outside behavior cloning; their claim is that a goal-only or frozen-representation actor is incomplete because the local and goal branches share an operator, local action likelihood shapes the encoder, and actor-disabled planning also improves.

## Key Results

### Separately trained single-task models

After one epoch, Direct control without candidate search achieves:

| Task | Success rate |
| --- | ---: |
| PushT | 85.78% |
| Cube | 100.00% |
| Reacher | 97.67% |
| TwoRoom | 97.89% |
| **Macro** | **95.33%** |

The paper compares this macro result with a published LeWM CEM result of 85.75%. Planner-side Direct latency is 2.9-5.5 ms versus 1.48 s for the measured actor-initialized CEM 300x30 configuration, an approximately 300x reduction. This is a planner-side measurement, not an end-to-end VLA or robot-system latency benchmark.

Guarded A reaches 96.86% macro and 92.22% worst-task success using 384 candidate sequences rather than 9,000. It is 16.00 percentage points above the matched pure-CEM result, supporting optional bounded verification rather than a blanket rejection of search.

### Representation shaping

On matched PushT experiments with the actor disabled, LeWM CEM 30x10 scores 42.22%; adding physical inverse supervision reaches 57.67%; adding matched goal-intent supervision reaches 61.44%; and waypoint INTACT with SIGReg 0.03 reaches $69.44\pm1.64\%$. These results support the interpretation that action likelihood changes the learned representation and dynamics, not only the final action head.

### Shared four-task encoder

At epoch 5, a single encoder with task-specific heads reaches $89.39\pm0.77\%$ macro under Direct control, compared with $66.17\pm2.67\%$ for matched shared-encoder LeWM. Actor-disabled INTACT pure CEM reaches $70.08\pm1.13\%$, and Guarded A reaches $90.47\pm0.84\%$. Adding the physical-intent branch over the matched goal-only cell contributes $8.78\pm1.63$ macro points. These shared-encoder results are distinct from the 95.33% macro of separately trained single-task models.

### Mechanism diagnostics

Across 45 eligible checkpoints, predicted-expert action-family kNN overlap correlates with Direct success at $r=0.954$, action-family CKA at $r=0.897$, and pointwise action $R^2$ at $r=0.815$. The kNN correlation remains $r=0.902$ after controlling for epoch and cohort. These are mechanism diagnostics and correlations, not causal certificates.

## Connections

- Extends [[leworldmodel|LeWorldModel]] by retaining its forward JEPA and SIGReg foundation while amortizing the inverse goal-to-action query that LeWM solves through CEM.
- Generalizes the action-sensitive displacement idea in [[delta-jepa|Delta-JEPA]]: Delta-JEPA decodes local physical displacement to shape MPC latents, while INTACT adds a detached future-goal displacement interpreted by the same action operator and deploys it directly.
- Builds on [[sensorimotor-world-models|SMWM]]'s attached inverse-dynamics supervision, adding a shared goal-intent branch and a search-free deployment interface.
- Contrasts with [[prism-prior-guided-imagination-sampling|PRISM]], which freezes LeWM and learns an uncertainty-aware proposal while preserving sampled evaluation. INTACT jointly shapes the representation and can use the conditional mean without candidate evaluation.
- Complements [[fast-leworldmodel|Fast-LeWM]]: Fast-LeWM reduces the cost of evaluating candidates, while INTACT attempts to avoid mandatory candidate evaluation.
- Adds a direct inverse/action interface to the representation, rollout, and proposal dimensions summarized in [[sampling-based-latent-planning]] and [[robot-world-model-architectures]].

## Limitations & Open Questions

- Experiments cover four simulated tasks, fixed image goals, offline expert trajectories, and task-specific action heads. Real-robot, out-of-distribution-goal, distractor, and cross-embodiment generalization are not established.
- Three training seeds provide only a coarse estimate of variability.
- The conditional action quotient is identified only on demonstrated support and does not identify arbitrary counterfactual goals or all equally valid actions.
- Raw goal displacement is approximate around obstacles, contacts, and multimodal demonstrations; autoregressive predicted latents can drift from encoded demonstration-state distributions.
- A diagonal-Gaussian mean can lie between valid action modes.
- Family-level diagnostics share parts of the deployed predictor and remain necessary checks rather than independent certificates. Effective-rank statistics can also reward isotropic noise, and t-SNE evidence is qualitative.
- Gauge equivalence is task-manifold conditioned. Cross-task and leave-one-task-out transfer fail without stronger alignment or coverage.
- Results reported for concurrent systems use different data, schedules, and evaluators and should not be treated as matched success-rate comparisons.

> [!open-question]
> When should uncertainty trigger local verification rather than Direct execution, especially under multimodal actions or latent rollout drift?

## Future Work

The authors identify the following extensions:

- Use mixture action actors to represent multimodal controls and select among action-equivalent modes.
- Sample from INTACT's learned conditional uncertainty instead of a unit-variance raw-action proposal.
- Trigger optional verification from uncertainty rather than using a fixed verifier schedule.
- Develop quotient-aware action-mode selection and stronger counterfactual tests pairing action-equivalent and action-distinct conditions.
- Add normalized Jacobian-spectrum diagnostics and test whether diagnostics predict held-out checkpoint failures without refitting thresholds.
- Pursue explicit cross-task alignment, adapters, or stronger joint coverage toward a universal actor.

## Related Pages

- [[multimodal-futures-in-latent-world-models]] - files this paper's diagonal-Gaussian head among the wiki's unimodal-predictor cluster and surveys the escape routes (mixture heads, diffusion, discrete codes)

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2607.26056)
- [arXiv](https://arxiv.org/abs/2607.26056)
- [PDF](https://arxiv.org/pdf/2607.26056)
