---
title: "DINO-WM: World Models on Pre-trained Visual Features enable Zero-shot Planning"
type: source
created: 2026-07-03
updated: 2026-07-24
arxiv_id: "2411.04983"
authors:
  - "Gaoyue Zhou"
  - "Hengkai Pan"
  - "Yann LeCun"
  - "Lerrel Pinto"
year: 2025
venue: "ICML 2025"
pdf_path: "https://arxiv.org/pdf/2411.04983"
code_url: "https://github.com/gaoyuezhou/dino_wm"
project_url: "https://dino-wm.github.io"
tags:
  - jepa
  - world-model
  - vision
  - reinforcement-learning
  - representation-learning
aliases:
  - "DINO-WM"
  - "DINO World Model"
---

# DINO-WM: World Models on Pre-trained Visual Features enable Zero-shot Planning

## Summary

DINO-WM is a task-agnostic offline latent world model that predicts future **DINOv2 patch features** rather than pixels. A frozen DINOv2 encoder maps observations to spatial embeddings; a causal ViT transition model predicts next-step latents from action-conditioned history. Trained only on reward-free offline trajectories with latent consistency loss, DINO-WM enables **zero-shot visual planning** at test time: given current and goal RGB images, MPC with CEM optimizes actions to minimize $\|\hat{z}_T - z_g\|_2^2$. On six environments (Maze, Wall, Reach, PushT, Rope, Granular), DINO-WM matches or beats DreamerV3/IRIS/TD-MPC2 — with 45% average SR improvement on manipulation tasks and up to 56% better LPIPS on predicted futures.

## Key Contributions

- **Frozen DINOv2 as observation model**: decouples perception from dynamics; no task-specific encoder training; patch features preserve spatial detail critical for manipulation.
- **Latent-only training**: transition model trained with MSE on future DINOv2 embeddings — no pixel reconstruction during world model training.
- **Optional independent decoder**: transposed-conv decoder for visualization only; decoupling from predictor slightly improves planning vs joint reconstruction training.
- **Zero-shot goal reaching**: no expert demos, rewards, or inverse models at test time — arbitrary visual goals via MPC.
- **Frame-level causal ViT predictor**: predicts all patches of next frame simultaneously with causal temporal attention (ablation: token-level autoregression hurts with longer history).

## Methodology

### Components

1. **Observation model**: frozen DINOv2 → $z_t \in \mathbb{R}^{N \times E}$ patch embeddings
2. **Transition model**: causal ViT decoder-only transformer; actions/proprioception concatenated to each patch token
3. **Decoder** (optional): independent pixel reconstruction for interpretability

### Training

$$\mathcal{L}_{pred} = \|p_\theta(\text{enc}(o_{t-H:t}), \phi(a_{t-H:t})) - \text{enc}(o_{t+1})\|^2$$

Teacher forcing on offline trajectory segments; no rewards or task labels.

### Test-time planning

MPC + CEM (100 samples × 10 iterations default) minimizing terminal latent MSE to goal embedding. Differentiable GD also explored; CEM empirically stronger without additional regularization.

## Key Results

| Environment | DINO-WM SR/CD | Best baseline |
| --- | --- | --- |
| Maze | 0.98 SR | DreamerV3 1.00 |
| Wall | 0.96 SR | DreamerV3 1.00 |
| Reach | 0.92 SR | DreamerV3 0.64 |
| PushT | 0.90 SR | IRIS 0.32 |
| Rope | 0.41 CD | IRIS 1.11 |
| Granular | 0.26 CD | IRIS 0.37 |

### Generalization (unseen configs)

- **WallRandom**: 0.82 SR vs DreamerV3 0.76
- **PushObj** (novel shapes): 0.34 SR vs 0.18 — still challenging for all methods
- **GranularRandom** (fewer particles): 0.63 CD vs IRIS 0.86

### Encoder ablation

Patch DINOv2 >> global encoders (R3M, ResNet, DINO CLS) on complex manipulation — spatial detail essential.

### Efficiency

- Inference: 0.014s/step vs 3.0s simulation rollout (deformable envs)
- PushT LPIPS: 0.007 vs R3M 0.045

## Connections

- Bridges [[self-supervised-learning|SSL]] ([[repa|REPA]]/DINOv2 lineage) and [[world-models|world models]] — pretrained visual features as planning latents without end-to-end pixel modeling.
- Primary baseline and experimental setup for [[temporal-straightening|Temporal Straightening]], which addresses DINO-WM's curved latent geometry limiting GD planning.
- [[adajepa|AdaJEPA]] evaluates on PushT/PushObj/PointMaze from DINO-WM setups; frozen DINO-WM degrades under distribution shift where AdaJEPA adapts online.
- Contrasts with [[leworldmodel|LeWM]]/[[sub-jepa|Sub-JEPA]]: trains dynamics in learned latents from scratch with SIGReg/subspace regularization rather than frozen foundation features.
- Co-authored by [[yann-lecun|Yann LeCun]]; Gaoyue Zhou also co-authors [[temporal-straightening|Temporal Straightening]].
- [[prism-prior-guided-imagination-sampling|PRISM]] finds that its learned proposal still improves a DINO-WM-style planner, but a global DINOv2 CLS token performs poorly on PushT, reinforcing this paper's patch-over-global encoder ablation
- See [[sampling-based-latent-planning]] for the interaction between DINO-WM's representation choice and downstream proposal and trajectory optimization

## Limitations & Open Questions

> [!open-question]
> Can exploration + continual data collection extend DINO-WM beyond offline coverage limits?

> [!open-question]
> How to train from internet video without ground-truth actions?

> [!gap]
> Frozen DINOv2 latents are not optimized for planning geometry — addressed by [[temporal-straightening|Temporal Straightening]] and [[adajepa|AdaJEPA]] (deployment adaptation).

## Future Work

- Combine DINO-WM with exploration strategies and continually update the world model as new offline/online experiences become available.
- Train from internet-scale video without ground-truth action labels.
- Develop a hierarchical planner that integrates high-level latent planning with low-level control policies for fine-grained manipulation.

## Links

- [AlphaXiv](https://www.alphaxiv.org/overview/2411.04983)
- [arXiv](https://arxiv.org/abs/2411.04983)
- [PDF](https://arxiv.org/pdf/2411.04983)
- [ICML proceedings](https://proceedings.mlr.press/v267/zhou25t.html)
- [Project page](https://dino-wm.github.io)
- [GitHub](https://github.com/gaoyuezhou/dino_wm)
