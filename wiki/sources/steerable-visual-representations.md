---
title: "Steerable Visual Representations"
type: source
created: 2026-05-16
updated: 2026-07-11
arxiv_id: "2604.02327"
authors:
  - "Jona Ruthardt"
  - "Manu Gaur"
  - "Deva Ramanan"
  - "Makarand Tapaswi"
  - "Yuki M. Asano"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2604.02327"
tags:
  - representation-learning
  - vision
  - multi-modal
  - transformer
aliases:
  - "SteerViT"
---

# Steerable Visual Representations

## Summary

Steerable Visual Representations introduces SteerViT, a lightweight way to make frozen vision transformers steerable by natural-language prompts while preserving the representation quality of the base encoder. The method inserts gated cross-attention adapters into a frozen ViT so text can influence visual feature extraction early, not merely after-the-fact through late fusion.

## Key Contributions

- **Text-steerable global and local features**: prompts redirect the representation toward specified concepts, including non-salient objects.
- **Early vision-language fusion**: frozen text features are projected into the ViT hidden dimension and used as keys/values in gated cross-attention layers inserted inside the visual encoder.
- **Lightweight adaptation**: the backbone remains frozen and only about 21M adapter parameters are trained.
- **New steerability benchmarks**: CORE, MOSAIC, and PODS probe conditional retrieval, targeted attention, and prompt-controlled semantic granularity.
- **Zero-shot transfer**: anomaly-focused prompts adapt visual features to industrial anomaly segmentation without task-specific training.

## Methodology

SteerViT starts with a frozen ViT such as DINOv2, SigLIP, or MAE and a frozen text encoder such as RoBERTa. Text token embeddings pass through a trainable MLP and then condition visual patch tokens through gated cross-attention layers inserted every other transformer block. The gates are initialized at zero, so training starts from the unmodified visual encoder and gradually activates text conditioning.

The training signal is referential segmentation: given an image and a referring expression, a patch-level classifier predicts the fraction of foreground pixels in each ViT patch. This teaches the adapters to route language information into the relevant visual tokens while leaving the base feature space mostly intact.

## Key Results

- CORE conditional retrieval: SteerViT reaches 96.0% top-1 accuracy versus 43.7% for DINOv2 and 21.8% for MAE on non-salient target retrieval.
- MOSAIC localization: prompt-steered attention reaches 50.2% PR-AUC versus 14.3% for DINOv2.
- PODS: detailed instance prompts improve personal-object discrimination, showing prompt specificity controls embedding granularity.
- Anomaly segmentation: anomaly prompts match or outperform several dedicated zero-shot anomaly methods on MVTec AD and VisA.
- Ablations show early fusion and zero-initialized gating are central to retaining representation quality while gaining steerability.

## Connections

- Extends the wiki's [[self-supervised-learning|representation learning]] thread by asking not only whether representations are strong, but whether users can steer what they encode at inference time.
- Complements [[global-geometry-is-not-enough|Global Geometry Is Not Enough]]: both argue that static embedding quality is incomplete without functional control or sensitivity.
- Relates to [[repa|REPA]] and [[representation-frechet-loss|Representation Fréchet Loss]] through their shared reliance on pretrained visual representation spaces.
- Contrasts with late-fusion vision-language models such as CLIP, whose text features do not alter visual feature extraction itself.

## Limitations & Open Questions

> [!open-question]
> How much steerability can be added before the frozen visual representation's general-purpose transfer quality degrades?

> [!open-question]
> Can steerable visual features improve robot world models, where prompts might select task-relevant objects or state variables?

## Future Work

- The paper does not spell out a dedicated future-work agenda; the conclusion positions text-conditioned cross-attention as a lightweight post-hoc steering mechanism for frozen ViTs, suggesting further domains and backbones as natural extensions of the SteerViT results.


## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2604.02327)
- [arXiv](https://arxiv.org/abs/2604.02327)
