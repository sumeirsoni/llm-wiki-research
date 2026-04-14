---
title: "LeJEPA: Provable and Scalable Self-Supervised Learning Without the Heuristics"
type: source
created: 2026-04-10
updated: 2026-04-12
arxiv_id: "2511.08544"
authors:
  - "Randall Balestriero"
  - "Yann LeCun"
year: 2025
tags:
  - jepa
  - self-supervised-learning
  - representation-learning
  - theory
  - optimization
pdf_path: "seed-papers/LeJEPA_ Provable and Scalable Self-Supervised Leaning Without the Heuristics.pdf"
aliases:
  - "LeJEPA"
---

# LeJEPA: Provable and Scalable Self-Supervised Learning Without the Heuristics

## Summary

LeJEPA provides a comprehensive theoretical foundation for [[jepa|JEPA]] and instantiates it in a lean, scalable, and theoretically grounded training objective. The key insight is that JEPA embeddings should follow an **isotropic Gaussian distribution** to minimize downstream prediction risk. This is enforced by a novel regularizer called **SIGReg** (Sketched Isotropic Gaussian Regularization), which replaces all the heuristics commonly used in self-supervised learning.

## Key Contributions

- **Theoretical result**: Identifies the isotropic Gaussian as the optimal distribution for JEPA embeddings to minimize downstream prediction risk
- **SIGReg**: A novel regularization objective that constrains embeddings to follow the ideal isotropic Gaussian distribution, with linear time and memory complexity
- **Heuristics-free**: Eliminates the need for stop-gradient, teacher-student (EMA), and hyperparameter schedulers — all common heuristics in [[self-supervised-learning|SSL]]
- **Simplicity**: Single trade-off hyperparameter, ~50 lines of code for the core implementation
- **Broad validation**: Tested across 10+ datasets, 60+ architectures (ResNets, ViTs, ConvNets), and multiple domains
- **Strong performance**: 79% linear evaluation accuracy on ImageNet-1K with ViT-H/14

## Methodology

LeJEPA combines two components:

1. **JEPA predictive loss**: The standard masked prediction objective in latent space
2. **SIGReg regularizer**: Constrains the embedding distribution to be isotropic Gaussian

The theoretical foundation proves that:
- The isotropic Gaussian is the optimal target distribution for minimizing downstream risk
- SIGReg achieves this with O(n) time and memory (unlike covariance-based methods which are O(n²))

This eliminates the need for:
- **Stop-gradient** (used in BYOL, SimSiam)
- **EMA teacher** (used in DINO, [[v-jepa-2-1|V-JEPA]])
- **Hyperparameter schedulers** (used in most SSL methods)

## Key Results

- **ImageNet-1K linear evaluation**: 79% with ViT-H/14 (frozen backbone)
- **Stability**: Robust across architectures (ResNet, ViT, ConvNet) and hyperparameter choices
- **Scalability**: Linear complexity enables training at scale
- **Distributed training friendly**: Minimal communication overhead

## Connections

- Provides the **theoretical foundation** for the JEPA framework introduced by [[yann-lecun|Yann LeCun]]
- SIGReg regularizer directly adopted by [[leworldmodel|LeWorldModel]] for stable end-to-end training
- Contrasts with [[rethinking-jepa|Rethinking JEPA (SALT)]] — LeJEPA removes EMA entirely, while SALT replaces EMA with a frozen teacher
- Contrasts with [[bootleg|Bootleg]] which still uses teacher-student distillation but across hidden layers
- Part of the broader effort by [[randall-balestriero|Randall Balestriero]] and [[yann-lecun|Yann LeCun]] to put SSL on rigorous theoretical footing

## Limitations & Open Questions

> [!open-question]
> How does the isotropic Gaussian assumption hold for highly structured downstream tasks where non-Gaussian embeddings might be beneficial?

> [!open-question]
> Can SIGReg be applied to other SSL paradigms beyond JEPA (e.g., contrastive learning)?

## Links

- [arXiv](https://arxiv.org/abs/2511.08544)
- [GitHub](https://github.com/galilai-group/lejepa)
