---
title: "LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels"
type: source
created: 2026-04-10
updated: 2026-09-04
arxiv_id: "2603.19312"
authors:
  - "Lucas Maes"
  - "Quentin Le Lidec"
  - "Damien Scieur"
  - "Yann LeCun"
  - "Randall Balestriero"
year: 2025
tags:
  - jepa
  - world-model
  - self-supervised-learning
  - representation-learning
  - optimization
pdf_path: "raw/LeWorldModel_ Stable End-to-End Joint-Embedding Predictive Architecture from Pixels.pdf"
aliases:
  - "LeWM"
  - "LeWorldModel"
---

# LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels

## Summary

LeWorldModel (LeWM) is the **first JEPA that trains stably end-to-end from raw pixels** using only two loss terms: a next-embedding prediction loss and a regularizer enforcing Gaussian-distributed latent embeddings. This builds directly on [[lejepa|LeJEPA]]'s SIGReg regularizer, reducing tunable loss hyperparameters from six to one compared to existing end-to-end alternatives.

## Key Contributions

- **First stable end-to-end JEPA** from raw pixels without EMA, pre-trained encoders, or auxiliary supervision
- **Minimal loss design**: Only two terms — prediction loss + Gaussian regularizer (derived from [[lejepa|LeJEPA]]'s SIGReg)
- **Single hyperparameter**: Reduces tunable loss hyperparameters from 6 to 1 vs. existing alternatives
- **Efficient**: ~15M parameters, trainable on a single GPU in a few hours
- **Fast planning**: Plans up to **48x faster** than foundation-model-based [[world-models|world models]]
- **Meaningful latent space**: Encodes physical structure (verifiable via probing of physical quantities)
- **Surprise detection**: Reliably detects physically implausible events

## Methodology

LeWM applies the [[lejepa|LeJEPA]] framework to the [[world-models|world model]] setting:

1. **Encoder** maps raw pixel observations to latent embeddings
2. **Predictor** predicts next-step embeddings in latent space
3. **SIGReg regularizer** (from LeJEPA) prevents representation collapse by enforcing Gaussian-distributed embeddings

The key insight is that SIGReg is sufficient to prevent collapse without needing:
- EMA teacher networks
- Pre-trained encoders
- Complex multi-term losses (6 terms → 2 terms)
- Auxiliary supervision signals

## Key Results

- **Planning speed**: 48x faster than foundation-model-based world models
- **Control tasks**: Competitive across diverse 2D and 3D control tasks
- **Physical structure**: Latent space probing reveals meaningful physical quantities
- **Surprise evaluation**: Successfully detects physically implausible events
- **Training efficiency**: ~15M parameters, single GPU, few hours training

## Connections

- Directly builds on [[lejepa|LeJEPA]]'s SIGReg regularizer
- Related to [[causal-jepa|Causal-JEPA]] — both apply JEPA to world models, but Causal-JEPA uses object-level masking while LeWM trains end-to-end from pixels
- Part of the [[yann-lecun|LeCun]] / [[randall-balestriero|Balestriero]] line of work on theoretically grounded JEPA
- Addresses the [[representation-collapse|representation collapse]] problem that plagues [[jepa|JEPA]] training
- [[sensorimotor-world-models|SMWM]] uses the same planning setup but replaces SIGReg with inverse dynamics regularization — **84% vs 59%** on OGBench-Cube
- [[delta-jepa|Delta-JEPA]] replaces SIGReg with Latent Difference Action Decoding — **79.3% vs 64.1%** on OGB-Cube in a shared benchmark table with Sub-JEPA and PLDM
- [[fast-leworldmodel|Fast-LeWM]] retains LeWM's visual encoder and SIGReg but replaces one-step autoregressive rollout with dense action-prefix prediction, improving average success from 85.8% to 90.5% and halving CEM solve time
- [[prism-prior-guided-imagination-sampling|PRISM]] freezes LeWM and learns a lightweight uncertainty-aware action prior from its latents, improving MPPI sample efficiency without a second visual encoder
- [[intact|INTACT]] retains LeWM's forward JEPA and SIGReg foundation but learns a shared local/goal intent-to-action operator, enabling direct zero-candidate control with optional bounded verification
- [[latent-energy-action-planning|LEAP]] retains LeWM's frozen encoder and autoregressive predictor but adds decoder-predicted terminal-state agreement to the latent planning objective, improving matched four-domain success over native LeWM+CEM
- See [[sampling-based-latent-planning]] for how LeWM's representation, rollout interface, planner proposal distribution, and direct inverse-control interface form separate optimization surfaces
- [[obsessed-encoder|The Obsessed Encoder]] reproduces [[feature-suppression|feature suppression]] on LeWM: a 5x5 px per-episode color square (<0.05% of the image) and the natural RandGoal PushT variant (fixed start, randomized goal pose) both drive prediction loss below baseline while planner success stays at chance - despite SIGReg. This offers a candidate explanation for failures LeWM's own authors had reported under mild PushT variations without explanation (Maes et al., 2026)
- [[lpwm|LpWM]] is the direct sparse-geometry successor from an overlapping team (Maes, Le Lidec, Balestriero, LeCun): same architecture and CEM planning, but RDMReg replaces SIGReg's dense isotropic Gaussian with a Rectified Laplace target. On PushT at intermediate predictor capacity LpWM beats dense LeWM by 24-57% planning success; they tie at full DiT capacity and both fail at linear-predictor capacity. LeWM's dense Gaussian is recovered as the p=2 no-ReLU special case of RDMReg's target family

## Limitations & Open Questions

> [!open-question]
> How does LeWM scale to more complex, high-dimensional environments beyond 2D/3D control tasks?

> [!open-question]
> Can the latent space be used for more complex reasoning tasks beyond planning and surprise detection?

## Future Work

- Hierarchical world modeling to extend planning and reasoning beyond short horizons.
- Pre-training on large, diverse natural video datasets to supply representation priors and reduce dependence on domain-specific offline interaction data.
- Learning future action representations via inverse dynamics modeling, reducing reliance on costly explicit action annotations.

## Links

- [arXiv](https://arxiv.org/abs/2603.19312)
- [GitHub](https://github.com/lucas-maes/le-wm)
- [Project Page](https://le-wm.github.io/)
