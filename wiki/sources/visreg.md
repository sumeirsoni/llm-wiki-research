---
title: "VISReg: Variance-Invariance-Sketching Regularization for JEPA training"
type: source
created: 2026-05-20
updated: 2026-05-20
arxiv_id: "2606.02572"
authors:
  - "Haiyu Wu"
  - "Randall Balestriero"
  - "Morgan Levine"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.02572"
tags:
  - jepa
  - self-supervised-learning
  - representation-learning
  - theory
  - optimization
aliases:
  - "VISReg"
---

# VISReg: Variance-Invariance-Sketching Regularization for JEPA training

## Summary

VISReg is a heuristic-free JEPA regularizer that decouples scale, shape, and centering of the embedding space. It combines VICReg-style variance control with sliced Wasserstein shape matching on normalized projections, aiming to prevent collapse with stronger gradients than SIGReg while enforcing full distributional shape rather than only second-order statistics.

## Key Contributions

- **Decoupled regularization**: separate scale (`L_scale`), shape (`L_shape`), and centering (`L_center`) terms with independent weights.
- **Sliced Wasserstein shape loss**: aligns 1D projections of normalized embeddings to Gaussian quantiles, going beyond covariance regularization.
- **Robust anti-collapse gradients**: maintains strong corrective signal when embeddings approach collapse, unlike SIGReg's diminishing gradients.
- **Linear scaling**: O(N D K) complexity, more efficient than VICReg's O(N D²) and scalable via distributed slice computation.
- **Strong OOD generalization**: outperforms DINO, LeJEPA, VICReg, and SIGReg on average across six OOD datasets.

## Methodology

VISReg follows the LeJEPA-style invariance objective: minimize L2 distance between each augmented view embedding and the mean of global views. The regularization term combines:

1. **Scale**: push per-dimension standard deviation toward 1 (VICReg-inspired, constant gradient under collapse).
2. **Shape**: normalize centered embeddings by stop-gradient std, project onto K random unit directions, and match sorted samples to Gaussian quantiles via sliced Wasserstein distance.
3. **Center**: penalize batch mean norm.

Total objective: `L = (1 - λ) L_pred + λ L_reg`. Trained on ViT-B/16 and ViT-L/14 with DINO-style multi-crop augmentation on ImageNet-1K and ImageNet-22K.

## Key Results

- Maintains strong gradient magnitudes under near-collapse, while SIGReg gradients diminish (Figure 2).
- On ImageNet-LT, VISReg dominates all baselines across overall/many/medium/few-shot; DINO fails entirely.
- On Galaxy10 (low-rank), VISReg matches or beats other regularizers while DINO struggles.
- OOD: ViT-L/14 on ImageNet-22K matches DINOv2 OOD performance despite 10× less pretraining data.
- Transfer fine-tuning beats DINO and supervised baselines on CIFAR10, CIFAR100, Flowers, ImageNet, Galaxy10.
- Training loss correlates with online linear probe accuracy at r = -0.996.

## Connections

- Direct successor/alternative to [[lejepa|LeJEPA]]'s SIGReg within the [[jepa|JEPA]] framework; authored in part by [[randall-balestriero|Randall Balestriero]].
- Addresses [[representation-collapse|representation collapse]] with explicit distributional control rather than EMA or stop-gradient heuristics.
- Complements [[sub-jepa|Sub-JEPA]]'s subspace Gaussian idea by asking whether scale/shape decoupling and SWD are better priors than Epps-Pulley normality tests.
- Relevant to [[learn-from-your-own-latents|Learn from your own latents]] as another theoretical lens on why latent-space objectives can be more efficient than token-level learning.

## Limitations & Open Questions

> [!open-question]
> How does VISReg compare directly to SIGReg and Sub-JEPA on the same JEPA world-model or video benchmarks?

> [!open-question]
> Does sliced Wasserstein shape matching help compositional or functional sensitivity metrics such as Jacobian Effective Rank?

## Links

- [AlphaXiv](https://www.alphaxiv.org/overview/2606.02572)
- [arXiv](https://arxiv.org/abs/2606.02572)
