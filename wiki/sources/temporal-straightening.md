---
title: "Temporal Straightening for Latent Planning"
type: source
created: 2026-07-03
updated: 2026-07-24
arxiv_id: "2603.12231"
authors:
  - "Ying Wang"
  - "Oumayma Bounou"
  - "Gaoyue Zhou"
  - "Randall Balestriero"
  - "Tim G. J. Rudner"
  - "Yann LeCun"
  - "Mengye Ren"
year: 2026
venue: "ICML 2026"
pdf_path: "https://arxiv.org/pdf/2603.12231"
project_url: "https://agenticlearning.ai/temporal-straightening/"
tags:
  - jepa
  - world-model
  - vision
  - reinforcement-learning
  - representation-learning
  - theory
aliases:
  - "Temporal Straightening"
  - "Latent Straightening"
---

# Temporal Straightening for Latent Planning

## Summary

Temporal straightening regularizes [[jepa|JEPA]] latent world models so that feasible trajectories become locally straight: consecutive latent velocity vectors are aligned via a curvature loss $\mathcal{L}_{curv} = 1 - \cos(v_t, v_{t+1})$. Combined with standard latent prediction loss, this makes Euclidean distance in latent space a better proxy for geodesic (shortest-path) distance and improves conditioning of gradient-based planning objectives. On Wall, PointMaze, and PushT, open-loop planning success improves 20–60% and MPC 20–30% over [[dino-wm|DINO-WM]]-style frozen-DINOv2 baselines — enabling gradient descent planners to rival CEM with far lower latency.

## Key Contributions

- **Curvature regularization for JEPA world models**: explicit temporal straightening loss on top of latent prediction; JEPA training alone induces implicit straightening, but explicit $\mathcal{L}_{curv}$ strengthens and stabilizes it.
- **Theory linking straightness to planning**: under linear latent dynamics, ε-straight transitions ($\|A - I\|_2 \leq \varepsilon$) bound the planning Hessian condition number; cosine similarity is a practical proxy encouraging $A \approx I$.
- **Faithful latent distances**: after straightening, Euclidean MSE to goal aligns with A* geodesic distance in mazes — even when trained on suboptimal trajectories.
- **GD planning viability**: straightened spaces reach 100% MPC success on Wall/UMaze within few replans; closes much of the gap between GD and CEM.
- **Flexible encoders**: works with frozen DINOv2 + projector or ResNet-from-scratch; learnable aggregation head for spatial features outperforms per-patch straightening on PushT.

## Methodology

### World model (JEPA)

- **Sensory encoder** $\mathcal{E}_s$: DINOv2 + CNN projector or ResNet → spatial latents $z_t \in \mathbb{R}^{m \times d}$.
- **Action encoder** $\mathcal{E}_a$: MLP on actions.
- **Predictor** $f_\theta$: causal ViT predicting next latent from K-frame history.

### Training objective

$$\mathcal{L}_{total} = \mathcal{L}_{pred} + \lambda \mathcal{L}_{curv}$$

- $\mathcal{L}_{pred} = \|\hat{z}_{t+1} - \text{sg}(z_{t+1})\|_2^2$
- $\mathcal{L}_{curv} = 1 - C$ where $C$ is cosine similarity of consecutive latent velocities $v_t = z_{t+1} - z_t$
- Stop-gradient on targets prevents collapse

### Planning

Goal-reaching via GD or MPC minimizing $\|\hat{z}_T - z_g\|_2^2$ over action sequences. Default: frameskip 5, horizon H=5.

## Key Results

| Setting | Example gain |
| --- | --- |
| UMaze open-loop (proj 14×14×8) | 44% → 94% with straightening |
| UMaze MPC | 81% → 100% |
| PushT open-loop (ResNet 14×14×8) | 71% → 91% |
| Long horizon (50 steps, Medium-Maze MPC) | 72% → 98% (ResNet) |
| Teleported-PointMaze | Plans exploit teleport dynamics, not just visual similarity |

- **Feature compression**: DINOv2 channels reducible 384→8 without degrading planning (spatial structure preserved).
- **Ablations**: smoothness and temporal contrastive regularizations do not match straightening gains; CEM still wins absolute SR but straightening narrows GD–CEM gap ~10× faster wall-clock.
- **Implicit vs explicit**: JEPA prediction alone straightens trajectories; explicit $\mathcal{L}_{curv}$ adds 10%+ on most setups.

## Connections

- Directly improves [[dino-wm|DINO-WM]]'s limitation: frozen DINOv2 features are semantically strong but geometrically curved for planning.
- Training methodology used by [[adajepa|AdaJEPA]] (same author team: Wang, Bounou, LeCun, Ren).
- Extends [[jepa|JEPA]] world-model line beyond collapse prevention ([[lejepa|LeJEPA]], [[sub-jepa|Sub-JEPA]]) toward **planning-aware representation geometry**.
- Connects to [[representation-geometry|representation geometry]]: latent curvature and distance faithfulness matter for control, not just semantic richness.
- Inspired by perceptual straightening hypothesis (Hénaff et al., 2019); related to plannable representation literature (Eysenbach et al., 2024; Plan2Vec).
- Provides the representation-geometry branch of [[sampling-based-latent-planning]], complementary to [[fast-leworldmodel|Fast-LeWM]]'s rollout interface and [[prism-prior-guided-imagination-sampling|PRISM]]'s candidate proposal

## Limitations & Open Questions

> [!open-question]
> Do straightening benefits extend to asymmetric/irreversible dynamics requiring quasimetric planning costs?

> [!open-question]
> Should dynamics learning and planning objectives operate in decoupled latent spaces (world model in one geometry, planner in a projected geometry)?

> [!open-question]
> Can temporal straightening combine with [[adajepa|AdaJEPA]] test-time adaptation for both better-conditioned training geometry and deployment recalibration?

## Future Work

- Extend beyond continuous goal-conditioned planning with symmetric Euclidean goal costs to asymmetric or irreversible dynamics using directional costs such as quasimetrics.
- Decouple dynamics learning from planning objectives by optimizing in a projected latent space while the world model trains in a separate representation geometry.
- Apply temporal straightening to more challenging environments beyond the 2D goal-reaching tasks studied here.

## Links

- [AlphaXiv](https://www.alphaxiv.org/overview/2603.12231)
- [arXiv](https://arxiv.org/abs/2603.12231)
- [PDF](https://arxiv.org/pdf/2603.12231)
- [Project page](https://agenticlearning.ai/temporal-straightening/)
