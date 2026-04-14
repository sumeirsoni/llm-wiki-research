---
title: "LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels"
type: source
created: 2026-04-10
updated: 2026-04-12
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
pdf_path: "seed-papers/LeWorldModel_ Stable End-to-End Joint-Embedding Predictive Architecture from Pixels.pdf"
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

## Limitations & Open Questions

> [!open-question]
> How does LeWM scale to more complex, high-dimensional environments beyond 2D/3D control tasks?

> [!open-question]
> Can the latent space be used for more complex reasoning tasks beyond planning and surprise detection?

## Links

- [arXiv](https://arxiv.org/abs/2603.19312)
- [GitHub](https://github.com/lucas-maes/le-wm)
- [Project Page](https://le-wm.github.io/)
