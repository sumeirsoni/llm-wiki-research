---
title: "Latent Geometry Beyond Search: Amortizing Planning in World Models"
type: source
created: 2026-09-09
updated: 2026-09-09
arxiv_id: "2605.08732"
authors:
  - "Hoang Nguyen"
  - "Xiaohao Xu"
  - "Xiaonan Huang"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.08732"
tags:
  - jepa
  - world-model
  - reinforcement-learning
  - representation-learning
  - optimization
aliases:
  - "Goal-conditioned inverse dynamics planning"
---

# Latent Geometry Beyond Search: Amortizing Planning in World Models

## Summary

Nguyen, Xu, and Huang test whether a structured latent space can replace online action-sequence search. They freeze a pretrained [[leworldmodel|LeWorldModel]] encoder and train a small Goal-Conditioned Inverse Dynamics Model, or GC-IDM, to map the current latent state, goal latent state, and remaining horizon to the next action. On four LeWM benchmarks, GC-IDM matches or exceeds CEM in seven of eight evaluation cells and reduces per-decision planning cost by 100 to 130 times.

## Key Contributions

- Recasts goal-conditioned planning in a regularized JEPA latent space as a learned inverse problem.
- Replaces CEM rollouts with one closed-loop MLP inference step per environment action.
- Shows that the result holds across CEM, MPPI, iCEM, and gradient-based trajectory optimization baselines.
- Measures a trade-off between success, planning cost, action jerk, and monotonic progress toward the goal.
- Shows that the remaining-horizon input is necessary for multi-step control.

## Methodology

The backbone is a frozen LeWM encoder and predictor. The GC-IDM receives the current embedding $z_t$, a goal embedding $z_g$, and a horizon $h$. It concatenates the two embeddings and passes them through a three-layer MLP with hidden width 512, LayerNorm, GELU, and 10% dropout. A two-layer horizon branch uses a 64-dimensional sinusoidal encoding. Zero-initialized AdaLN-Zero scale and bias terms apply the horizon signal before the action head. The model has about 1.5 million parameters.

The authors train GC-IDM on the same offline demonstrations used for LeWM. They freeze the LeWM encoder and sample a time and a future horizon from each trajectory. The regression target is the action at the sampled starting time, and the input goal embedding comes from the observation at the sampled future time. Training uses mean squared error and needs no new environment interaction.

At inference, the controller encodes the goal once. At each step it re-encodes the current observation, computes the remaining horizon, predicts one action, and applies that action. The reported experiments set the maximum horizon and evaluation budget to 50 steps. The controller does not roll out imagined latents and does not commit to a multi-step action block.

## Key results

The study uses Two-Room navigation, Push-T contact-rich manipulation, OGBench-Cube 3D manipulation, and Reacher continuous control. The main comparison uses the frozen LeWM checkpoint and the original CEM setup at sample counts of 50 and 200.

| Environment | GC-IDM at 200 samples | CEM at 200 samples | GC-IDM planning speedup |
| --- | ---: | ---: | ---: |
| Two-Room | 100.0% | 84.0% | 104 times |
| Push-T | 84.2% | 82.5% | 106 times |
| OGBench-Cube | 98.7% | 67.0% | 130 times |
| Reacher | 99.7% | 70.3% | 110 times |

GC-IDM wins seven of the eight environment and protocol cells. CEM leads only on Push-T at 50 samples, where longer contact sequences make local inverse recovery harder. Across the broader planner comparison, GC-IDM has the highest success in every environment at the 200-sample protocol. It exceeds the best sampling baseline by 12.5 percentage points on Two-Room, 1.7 points on Push-T, 28.2 points on OGBench-Cube, and 29.4 points on Reacher.

The per-plan-call speedup over CEM is 104 to 130 times. It is 103 to 134 times over iCEM, 29 to 34 times over MPPI, and 2.0 to 2.4 times over GradientSolver. A 500-times CEM compute sweep finds no CEM setting that is both faster and more successful than GC-IDM on any environment.

GC-IDM produces 15 to 36 times lower action jerk than CEM. Its latent distance to the goal decreases at every step in a larger fraction of episodes on three of four environments. The ablations show that increasing the maximum training horizon from 5 to 50 helps most on Push-T, and removing horizon supervision causes a large success drop that extra network depth does not recover.

## Connections

- [[gc-idm|GC-IDM]] records the method as a reusable planning interface.
- [[sampling-based-latent-planning|Sampling-Based Latent Planning]] places GC-IDM beside CEM, Fast-LeWM, PRISM, LeFlow, and INTACT as a direct search-bypass method.
- [[leworldmodel|LeWorldModel]] supplies the frozen encoder and predictor whose latent geometry the paper tests.
- [[representation-geometry|Representation Geometry]] connects latent regularity to local action recovery rather than treating geometry as a static statistic.
- [[world-models|World Models]] records the separation between world-model prediction and the control interface.

## Limitations & Open Questions

The evaluation covers four simulated LeWM tasks, fixed 50-step budgets, and offline demonstration data. Each environment has its own GC-IDM fit. The paper does not establish the same result for higher-dimensional action spaces, severe irreversibility, much longer horizons, or latent spaces from other world models.

Push-T is the main weak case. CEM wins at the 50-sample protocol, and performance falls as the start and goal become farther apart. The method predicts a point action with squared-error regression, so the paper does not test multimodal action distributions or uncertainty-triggered fallback.

## Future Work

- Test GC-IDM with other JEPA-style world models and latent architectures.
- Evaluate higher-dimensional robots, including settings with seven action degrees of freedom.
- Combine GC-IDM proposals with occasional CEM correction for irreversible or long-horizon contact tasks.
- Compare isotropic and non-isotropic latent regularizers on the same environments.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2605.08732)
- [arXiv](https://arxiv.org/abs/2605.08732)
