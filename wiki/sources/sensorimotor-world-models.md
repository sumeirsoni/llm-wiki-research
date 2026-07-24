---
title: "Sensorimotor World Models: Perception for Action via Inverse Dynamics"
type: source
created: 2026-07-03
updated: 2026-07-11
arxiv_id: "2606.20104"
authors:
  - "Petr Ivashkov"
  - "Randall Balestriero"
  - "Bernhard Schölkopf"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.20104"
tags:
  - jepa
  - world-model
  - vision
  - reinforcement-learning
  - representation-learning
  - representation-collapse
aliases:
  - "SMWM"
  - "Sensorimotor World Models"
---

# Sensorimotor World Models: Perception for Action via Inverse Dynamics

## Summary

Sensorimotor World Models (SMWM) train a [[jepa|JEPA]]-style latent world model end-to-end from offline, reward-free trajectories using **inverse dynamics regularization** as the sole anti-collapse mechanism. An encoder $f_\theta$, forward dynamics model $g_\phi$, and inverse dynamics head $h_\psi$ are jointly optimized with $\mathcal{L} = \mathcal{L}_{fwd} + \lambda \mathcal{L}_{inv}$. The inverse loss forces latent states to preserve action-recoverable information — preventing collapse (collapsed latents cannot predict actions) while biasing representations toward controllable degrees of freedom and away from distractors. On OGBench-Cube 3D manipulation, SMWM reaches **84% planning success** vs **59%** for SIGReg ([[leworldmodel|LeWM]]-style Gaussian regularization); forward-only ($\lambda=0$) fails due to collapse.

## Key Contributions

- **Inverse dynamics as unified regularizer**: single parsimonious term replaces frozen encoders, EMA, or distributional priors (SIGReg/VICReg) for stable end-to-end JEPA world model training.
- **Perception for action**: encoder learns to filter uncontrollable distractors — latent intrinsic dimension matches controllable DoF, not total observable DoF (Dot World, Sprite World).
- **Interpretable latent geometry**: Cartesian coords → linear PCA directions; periodic joint angles → cylindrical/toroidal structure; TwoRoom preserves wall connectivity gap.
- **Competitive planning**: matches SIGReg on 2D tasks (TwoRoom, Reacher, Push-T); outperforms on 3D OGBench-Cube; robust to longer planning horizons vs SIGReg on TwoRoom.
- **Forward-only ablation**: demonstrates collapse without inverse regularization — planning near random.

## Methodology

### Architecture

| Component | Role |
| --- | --- |
| **Encoder** $f_\theta$ | ViT-Tiny → CLS token projected to $d=192$ |
| **Forward model** $g_\phi$ | Small transformer: $(z_t, a_t) \mapsto \hat{z}_{t+1}$ |
| **Inverse model** $h_\psi$ | 2-layer MLP: $(z_t, z_{t+1}) \mapsto \hat{a}_t$ |

### Losses

$$\mathcal{L}_{fwd} = \mathbb{E}\left[\|g_\phi(f_\theta(o_t), a_t) - f_\theta(o_{t+1})\|_2^2\right]$$

$$\mathcal{L}_{inv} = \mathbb{E}\left[\|h_\psi(f_\theta(o_t), f_\theta(o_{t+1})) - a_t\|_2^2\right]$$

Gradients from both losses backprop through the encoder. No stop-gradient, EMA, or frozen backbone.

### Planning

MPC + CEM minimizing terminal latent MSE $C = \|\hat{z}_{H+1} - z_g\|_2^2$ to goal observation $o_g$. Same setup as [[leworldmodel|LeWorldModel]]/SIGReg baseline.

## Key Results

### Controlled environments

- **Dot World**: PCA spectrum drops after 2 components for 2D-controllable dot; distractor dots ignored (dimensionality unchanged).
- **Sprite World**: reconstructions preserve orientation only when rotation is controllable; blurred symmetric blobs when orientation is uncontrollable.
- **Latent action composition**: approximate commutativity — encode-then-predict ≈ act-then-encode.

### Planning (success rates)

| Environment | SMWM | SIGReg | Forward-only |
| --- | --- | --- | --- |
| TwoRoom, Reacher, Push-T | ≈ SIGReg | strong | ~random |
| **OGBench-Cube (3D)** | **84%** | 59% | ~random |

### Probing & geometry

- MLP probes recover physical state with $R^2 \approx 1$ for both SMWM and SIGReg.
- SMWM better on Push-T agent position and Cube quantities under linear probes; SIGReg better on Reacher joint angles.
- SMWM latents more compact with geometry mirroring physics; SIGReg flatter PCA spectra (isotropic Gaussian prior).

## Connections

- Direct alternative to [[leworldmodel|LeWorldModel]]'s SIGReg for collapse prevention — same architecture/planning setup, different regularizer philosophy (action recovery vs isotropic Gaussian matching).
- Complements [[sub-jepa|Sub-JEPA]]: both seek task-intrinsic latent geometry; SMWM uses inverse dynamics where Sub-JEPA uses subspace Gaussian projections.
- Contrasts with [[dino-wm|DINO-WM]] (frozen pretrained encoder) and [[adajepa|AdaJEPA]] (test-time adaptation) — SMWM trains encoder end-to-end from pixels with a task-aligned inductive bias.
- Builds on Pathak et al. (2017) curiosity/inverse dynamics for controllable features; situates within JEPA world model line (Assran et al., 2023).
- [[delta-jepa|Delta-JEPA]] uses the same forward + inverse recipe but decodes actions from $\Delta z_t = z_{t+1} - z_t$ rather than $(z_t, z_{t+1})$; ablations show displacement decoding improves planning (+4 to +12.6 pp) by avoiding action shortcuts in endpoint embeddings.
- Co-authored by [[randall-balestriero|Randall Balestriero]]; empirical baseline is SIGReg from [[leworldmodel|LeWorldModel]].

## Limitations & Open Questions

> [!open-question]
> Does inverse dynamics assume actions are recoverable from single-frame latents — and fail when multiple actions produce identical observations?

> [!open-question]
> Can SMWM combine with [[temporal-straightening|Temporal Straightening]] curvature regularization or [[adajepa|AdaJEPA]] deployment adaptation?

> [!open-question]
> How does inverse-dynamics regularization compare to [[sub-jepa|Sub-JEPA]] subspace SIGReg when controllable DoF dimension varies across tasks?

## Future Work

- Relax the assumption that actions are recoverable from consecutive latent states when multiple actions produce identical observations.
- Scale empirical validation beyond moderate-scale simulated control tasks to larger, more diverse offline trajectory datasets.
- The paper flags future work on planning and representation learning but does not specify concrete methodological extensions beyond broadening dataset coverage and deployment settings.

## Links

- [AlphaXiv](https://www.alphaxiv.org/overview/2606.20104)
- [arXiv](https://arxiv.org/abs/2606.20104)
- [PDF](https://arxiv.org/pdf/2606.20104)
