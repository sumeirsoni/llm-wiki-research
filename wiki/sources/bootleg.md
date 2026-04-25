---
title: "Self-Distillation of Hidden Layers for Self-Supervised Representation Learning"
type: source
created: 2026-04-10
updated: 2026-04-10
arxiv_id: "2603.15553"
authors:
  - "Scott C. Lowe"
  - "Anthony Fuller"
  - "Sageev Oore"
  - "Evan Shelhamer"
  - "Graham W. Taylor"
year: 2025
tags:
  - self-supervised-learning
  - self-distillation
  - jepa
  - representation-learning
  - vision
  - segmentation
pdf_path: "raw/Self-Distillation of Hidden Layers for Self-Supervised Representation Learning.pdf"
aliases:
  - "Bootleg"
---

# Self-Distillation of Hidden Layers for Self-Supervised Representation Learning

## Summary

Bootleg bridges the gap between generative methods (like [[mae|MAE]]) and predictive methods (like [[jepa|I-JEPA]]) by tasking the model with predicting latent representations from **multiple hidden layers** of a teacher network, rather than only the final layer. This hierarchical objective forces the model to capture features at varying levels of abstraction simultaneously.

## Key Contributions

- **Hierarchical self-distillation**: Predicts representations from multiple intermediate teacher layers, not just the final layer
- **Bridges generative and predictive SSL**: Captures both low-level grounding (from early layers) and high-level semantics (from later layers)
- **Significant improvements**: +10% over I-JEPA on ImageNet-1K classification
- **Strong dense predictions**: Excellent performance on semantic segmentation (ADE20K, Cityscapes)
- Addresses [[self-distillation|self-distillation]]'s instability by stabilizing targets through multi-layer supervision

## Methodology

Standard predictive SSL (like I-JEPA) only distills from the **final layer** of the teacher, which:
- Provides high-level semantic targets
- But discards spatial/structural information from earlier layers
- Creates non-stationary targets that cause training instability

Bootleg instead predicts representations from **multiple hidden layers**:
- Early layers → low-level features (edges, textures, spatial structure)
- Middle layers → mid-level features (parts, shapes)
- Late layers → high-level features (objects, semantics)

This creates a hierarchical objective that:
1. Forces the student to learn features at all levels of abstraction
2. Stabilizes training through multi-scale supervision
3. Preserves spatial information that pure final-layer distillation loses

## Key Results

- **ImageNet-1K classification**: +10% over I-JEPA
- **iNaturalist-21**: Significant improvement over baselines
- **ADE20K semantic segmentation**: Strong dense prediction performance
- **Cityscapes segmentation**: Strong dense prediction performance

## Connections

- Directly improves upon [[jepa|I-JEPA]]'s final-layer distillation approach
- Related to [[v-jepa-2-1|V-JEPA 2.1]]'s **deep self-supervision** — both apply supervision to intermediate layers, though V-JEPA 2.1 does this for all tokens while Bootleg does it for self-distillation targets
- Contrasts with [[lejepa|LeJEPA]] which abandons distillation entirely in favor of regularization
- Contrasts with [[rethinking-jepa|SALT]] which freezes the teacher rather than modifying the distillation target
- Relates to [[mae|MAE]]'s approach of capturing low-level information, but operates in latent space rather than pixel space

## Limitations & Open Questions

> [!open-question]
> What is the optimal selection of hidden layers for distillation? Is it architecture-dependent?

> [!open-question]
> Can this multi-layer distillation approach be combined with [[lejepa|LeJEPA]]'s SIGReg regularization for even better results?

## Links

- [arXiv](https://arxiv.org/abs/2603.15553)
