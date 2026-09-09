---
title: "LeFlow: Generative Latent Flow Planning for World Models"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2608.24855"
authors:
  - "Hsiang-Wei Huang"
  - "Jianxu Shangguan"
  - "Junbin Lu"
  - "Jenq-Neng Hwang"
year: 2026
venue: "arXiv preprint (cs.CV)"
pdf_path: "https://arxiv.org/pdf/2608.24855v1"
code_url: "https://github.com/hsiangwei0903/LeFlow"
tags:
  - world-model
  - flow-matching
  - reinforcement-learning
  - robotics
  - representation-learning
  - optimization
aliases:
  - "LeFlow"
---

# LeFlow: Generative Latent Flow Planning for World Models

## Summary

LeFlow amortizes goal-conditioned planning on top of a frozen [[leworldmodel|LeWorldModel]] instead of solving a fresh action-space optimization problem at every model-predictive-control step. A conditional rectified-flow planner generates the interior of a latent trajectory between encoded start and goal observations, an inverse-dynamics decoder converts each latent transition into an action chunk, and the frozen world model reranks candidates by their actual rollout distance to the goal. Across four LeWM control benchmarks, this proposal-and-verification interface improves success while reducing end-to-end planning time by roughly an order of magnitude.

## Key Contributions

- Recasts planning as conditional generation of latent-state trajectories rather than direct generation or optimization of action sequences.
- Clamps the start and goal latents and uses rectified flow to generate only the interior path, creating a reusable offline planning prior.
- Separates multi-step latent planning from local control with an inverse-dynamics decoder conditioned on the current latent, next latent, and their displacement.
- Adds consistency training and rollout reranking so generated paths are grounded in the frozen predictor's controllable latent manifold.
- Shows that latent-path generation and stochastic candidate selection each contribute beyond direct action flow or deterministic latent regression.

## Methodology

LeFlow keeps the LeWM encoder and autoregressive latent predictor frozen. Given current and goal observations, the encoder produces $z_{start}$ and $z_{goal}$. A conditional rectified-flow velocity model generates the $H-1$ interior states of a path whose endpoints are fixed to those anchors. The path is trained from offline trajectories with a flow-matching objective.

For each transition, a three-layer MLP predicts an action chunk:

$$a_t = g_\omega([z_t, z_{t+1}, z_{t+1}-z_t]).$$

The planner and decoder are jointly trained with flow, inverse-dynamics, and one-step consistency losses. At inference, 64 latent paths are sampled with 16 Euler steps, decoded to actions, rolled out in parallel through the frozen LeWM predictor, and ranked by terminal latent distance. The default horizon is $H=5$ with five-step action blocks; the main comparison uses 50 episodes and five evaluation seeds for LeFlow.

## Key Results

| Benchmark | LeWM + CEM | LeFlow | Planning speedup |
| --- | ---: | ---: | ---: |
| TwoRoom | 82.0% | 100.0% | 14.4x |
| PushT | 89.3% | 95.2% | 11.4x |
| Reacher | 68.0% | 86.8% | 11.8x |
| OGBench-Cube | 73.3% | 100.0% | 4.5x |

- On non-saturated PushT and Reacher, latent-path planning beats direct action flow by 3.0 and 4.5 percentage points, respectively.
- A deterministic latent-path regressor trails LeFlow by 1.0 points on PushT and 4.5 points on Reacher, consistent with multimodal paths being poorly represented by a single mean trajectory.
- Training on 80% of episodes and evaluating on held-out episodes preserves performance within reported seed variation.
- Horizon scaling is a clear boundary: PushT success falls from 94.0% at $H=5$ to 32.0% at $H=10$ and 6.0% at $H=20$ under the reported protocol.

## Connections

- Extends [[sampling-based-latent-planning|sampling-based latent planning]] by learning the proposal distribution itself, while retaining bounded model-based verification.
- Uses [[flow-matching|rectified flow]] as a few-step generative prior, linking trajectory planning to the wiki's flow-based generation work.
- Treats [[leworldmodel|LeWM]] as representation backbone, dynamics prior, and feasibility verifier without modifying its parameters.
- Complements [[fast-leworldmodel|Fast-LeWM]], which accelerates the dynamics-query interface, and [[prism-prior-guided-imagination-sampling|PRISM]], which improves action proposals while retaining sampling.
- The reranking stage is a planning-side instance of the verifier pattern also discussed in [[candidate-exploration|candidate exploration]].

## Limitations & Open Questions

> [!open-question]
> The demonstrated method is short-horizon. Longer paths increase generation dimensionality and compound frozen-predictor error, and the reported PushT sweep degrades sharply beyond $H=5$.

> [!open-question]
> The planner learns from offline trajectories and depends on the coverage and geometry of the frozen LeWM latent space. Its behavior under unseen goals, stochastic dynamics, sparse data, or substantially more complex environments is not established.

> [!open-question]
> Reranking still requires a fixed batch of world-model rollouts. Whether hierarchical segment chaining or uncertainty-triggered verification can retain the speedup at long horizons remains open.

## Future Work

The authors identify hierarchical decomposition that chains shorter-horizon LeFlow segments and coupling the planner with a stronger world model that reduces long-range rollout error as natural next steps. They also point to combining the goal-conditioned planner with task-specific reward or offline-RL objectives.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.24855)
- [arXiv](https://arxiv.org/abs/2608.24855)
- [HTML](https://arxiv.org/html/2608.24855v1)
- [PDF](https://arxiv.org/pdf/2608.24855v1)
- [Code](https://github.com/hsiangwei0903/LeFlow)

