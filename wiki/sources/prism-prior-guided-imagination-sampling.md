---
title: "PRISM: Prior-Guided Imagination Sampling in World Models"
type: source
created: 2026-07-24
updated: 2026-07-24
arxiv_id: "2606.07974"
authors:
  - "Yuhai Wang"
  - "Jiawei Xia"
  - "Rongxuan Zhou"
  - "Xiao Hu"
  - "Yongliang Shi"
  - "Jing Du"
  - "Yang Ye"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.07974"
code_url: "https://github.com/YuhaiW/prism-jepa"
project_url: "https://yuhaiw.github.io/PRISM_web/"
tags:
  - jepa
  - world-model
  - reinforcement-learning
  - robotics
  - optimization
aliases:
  - "PRISM"
  - "PRior-guided Imagination Sampling in world Models"
---

# PRISM: Prior-Guided Imagination Sampling in World Models

## Summary

PRISM improves [[sampling-based-latent-planning|sampling-based planning]] by learning a state- and goal-conditioned Gaussian action prior from the same demonstrations and frozen JEPA encoder used by [[leworldmodel|LeWorldModel]]. A lightweight MLP predicts both mean and uncertainty, then a closed-form product of Gaussians fuses this prior with MPPI's default sampling distribution. The fused mean guides candidate actions while the fused variance preserves state-dependent confidence. On PushT and OGBench-Cube, PRISM raises matched-compute planning success by 23 to 35 percentage points with negligible inference overhead and demonstrates preliminary transfer to two real-robot systems.

## Key Contributions

- Extracts an action prior from the world model's own frozen latent representation, avoiding a second vision encoder or large external policy.
- Predicts a Gaussian over future action sequences, including per-coordinate uncertainty rather than only a behavior-cloning mean.
- Integrates the prior through precision-weighted product-of-Gaussians fusion before MPPI optimization.
- Preserves the fused covariance across MPPI iterations, retaining prior confidence and avoiding the low-sample variance collapse observed with CEM.
- Provides graceful degradation: as predicted uncertainty grows or prior scale is inflated, the fused sampler approaches vanilla MPPI.
- Demonstrates the same pipeline on Franka FR3 PushT and ARX X5 cube manipulation without algorithmic modification.

## Methodology

A frozen JEPA encoder maps current and goal images to $z_t$ and $z_g$. A three-layer GELU MLP with roughly 0.5M to 1.0M parameters predicts a diagonal Gaussian over the next $H\times B$ actions:

$$
g_\phi([z_t,z_g])=(\mu_p,\sigma_p).
$$

The head trains offline with $\beta$-NLL at $\beta=0.5$ on demonstration tuples whose goal is the episode's final observation. The encoder and world-model predictor remain frozen.

Before each MPPI solve, PRISM fuses the default planner Gaussian $\mathcal{N}(\mu_\pi,\sigma_\pi^2)$ with the learned prior $\mathcal{N}(\mu_p,(s\sigma_p)^2)$. For precisions $\tau_\pi=\sigma_\pi^{-2}$ and $\tau_p=(s\sigma_p)^{-2}$,

$$
\sigma_{fused}^2=(\tau_\pi+\tau_p)^{-1},
$$

$$
\mu_{fused}=\sigma_{fused}^2(\tau_\pi\mu_\pi+\tau_p\mu_p).
$$

MPPI then updates only the mean for 30 iterations while holding $\sigma_{fused}$ fixed. Confident prior coordinates narrow search; uncertain coordinates revert toward the default planner. The only added scale hyperparameter is $s=1$, and the standard deviation is floored at 0.05.

## Key Results

### Simulation

At 128 candidates:

| Method | PushT success | Cube success |
| --- | ---: | ---: |
| Vanilla MPPI with LeWM | $57\pm6$ | $44\pm4$ |
| Mean-only warm start | $66\pm1$ | $55\pm3$ |
| PRISM-MPPI | $89\pm4$ | $79\pm6$ |
| Diffusion Policy | $41\pm10$ | $77\pm5$ |

PRISM with only 32 candidates reaches $82\pm4$ on PushT and $79\pm2$ on Cube, exceeding vanilla MPPI with 128 candidates by 25 and 35 percentage points. Across 32, 64, and 128 candidates, PRISM consistently improves over vanilla LeWM MPPI.

### Why uncertainty matters

- Mean-only warm starting improves over vanilla MPPI but degrades from 75% to 66% on PushT as the sample budget grows.
- Full mean-plus-variance fusion rises from 82% to 89% on PushT and beats warm start by 7 to 23 points on PushT and 21 to 28 points on Cube.
- Runtime at 128 candidates is statistically similar: 210.1 ms for vanilla MPPI, 210.7 ms for warm start, and 211.6 ms for PRISM.

### MPPI versus CEM

At 32 candidates on PushT, fixed-variance PRISM-MPPI reaches $82\pm4$ while adaptive-variance PRISM-CEM reaches $43\pm1$. CEM recovers at larger budgets, reaching 91% versus MPPI's 89% at 128 candidates. The result supports a narrower claim: retaining prior precision is especially robust when the candidate budget is small.

### Encoder ablation

A DINO-WM-style DINOv2 CLS encoder still benefits from PRISM relative to its own vanilla MPPI baseline, but absolute PushT success remains only 10% to 15%. The authors attribute this to global CLS features discarding fine 2D position, reinforcing [[dino-wm|DINO-WM]]'s finding that spatial patch features matter for manipulation.

### Real robots

- Franka FR3 PushT succeeds in 35% of 20 trials using one third-person camera and local planning.
- ARX X5 cube manipulation succeeds in 45% of 20 trials with one third-person camera.
- These deployments are presented as proof of concept, not matched comparative evaluations.

## Connections

- Extends [[leworldmodel|LeWorldModel]] without retraining its encoder or dynamics predictor, using its latents for both physical and action intuition.
- Adds the proposal-distribution branch of [[sampling-based-latent-planning]]: improving which imagined trajectories are evaluated rather than changing the world model that scores them.
- Complements [[fast-leworldmodel|Fast-LeWM]], which reduces cost and error inside each candidate rollout through parallel action-prefix prediction.
- Connects to [[dino-wm|DINO-WM]] through an encoder ablation showing that prior fusion is representation-agnostic but cannot recover spatial information absent from a global visual token.
- Strengthens the planner-interface dimension in [[world-models]] and [[robot-world-model-architectures]], where world-model quality alone does not determine closed-loop success.

## Limitations & Open Questions

- The authors state that PRISM requires task-specific, near-expert demonstrations, limiting zero-shot generalization. Graceful degradation reduces harm from a weak prior but does not create useful guidance from poor data.
- The local prior may become unreliable on long-horizon tasks requiring temporal memory.
- A single diagonal Gaussian underfits genuinely multimodal action distributions. PushT results show planning can still recover strong behavior, but a richer prior could raise the ceiling.
- Controlled comparisons cover only PushT and Cube. The two real-robot demonstrations each use 20 trials and lack a matched vanilla-planner baseline.
- MPPI's fixed covariance is central to low-budget robustness. PRISM-CEM can equal or exceed MPPI at larger budgets, so the best variance update depends on available samples.
- The DINOv2 CLS ablation performs poorly on PushT, showing that good sampler initialization cannot compensate for a representation that omits task-critical spatial state.

## Future Work

- The authors explicitly plan to extend precision-weighted fusion to alternative prior sources and planning algorithms.
- They identify mixture-of-Gaussians or other multimodal heads as a route beyond the current unimodal prior's ceiling.
- A matched real-robot baseline comparison is still in progress according to the paper.
- Broader evaluation should test longer-horizon tasks and priors with temporal memory, following the limitations stated by the authors.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2606.07974)
- [arXiv](https://arxiv.org/abs/2606.07974)
- [PDF](https://arxiv.org/pdf/2606.07974)
- [Project page](https://yuhaiw.github.io/PRISM_web/)
- [Code](https://github.com/YuhaiW/prism-jepa)
- [Franka PushT dataset](https://huggingface.co/datasets/Rongxuan-Zhou/pusht_lewm_fr3)
- [Cube checkpoint](https://huggingface.co/YuhaiW/prism-jepa-cube)
- [PushT checkpoint](https://huggingface.co/YuhaiW/prism-jepa-pusht)
