---
title: "LeVJEPA: Efficient & Scalable Video Pretraining without the Heuristics"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2608.27395"
authors:
  - "Lukas Kuhn"
  - "Lucas Maes"
  - "Giuseppe Serra"
  - "Quentin Le Lidec"
  - "Yann LeCun"
  - "Randall Balestriero"
  - "Florian Buettner"
year: 2026
venue: "arXiv preprint (cs.CV)"
pdf_path: "https://arxiv.org/pdf/2608.27395v1"
code_url: "https://github.com/MLO-lab/LeVJEPA"
project_url: "https://levjepa.github.io"
tags:
  - jepa
  - video
  - vision
  - self-supervised-learning
  - representation-learning
aliases:
  - "LeVJEPA"
  - "LeVJEPA video pretraining"
---

# LeVJEPA: Efficient & Scalable Video Pretraining without the Heuristics

## Summary

LeVJEPA applies [[lejepa|LeJEPA]]'s SIGReg-based collapse-free objective to video with a single shared encoder and no target encoder, predictor, stop-gradient, or masked-token reconstruction. A global clip view and several local views are aligned with an MSE invariance term while random token dropping reduces the processed sequence. The default 95% drop rate unexpectedly improves representation quality, and block-causal attention adds temporal ordering without a measured accuracy penalty. Under matched-epoch and matched-FLOP comparisons, LeVJEPA matches or exceeds V-JEPA 2 with substantially less pretraining compute while retaining useful motion and dense patch structure.

## Key Contributions

- Brings LeJEPA's invariance plus SIGReg objective to video without architectural asymmetry or a teacher-student schedule.
- Processes only a sparse random subset of patch tokens, with 95% dropping as the default, reducing attention and feed-forward cost while acting as a stochastic augmentation.
- Shows block-causal attention can replace bidirectional video attention without measurable loss on the reported frozen-probe evaluations.
- Finds per-frame patch embedding ($\tau=1$) is at least as good as temporal patch aggregation at matched token budgets.
- Demonstrates emergent semantic organization in patch tokens even though pretraining supervision is read only from the clip-level [CLS] embedding.

## Methodology

Each clip produces one global view and $V$ local spatially cropped views sharing the same temporal window. Uniform random dropping keeps only a small fraction of patch tokens in each view. A shared ViT encoder uses block-causal attention by default: tokens attend bidirectionally within a frame and causally across frames. The loss is

$$\mathcal{L}=\mathcal{L}_{inv}+\lambda\mathcal{L}_{SIGReg},$$

where the invariance term is MSE between the global and local [CLS] embeddings and SIGReg matches random one-dimensional projections to a standard Gaussian. Gradients flow through both branches, and the fixed regularization weight is $\lambda=0.02$. Patch tokens receive no direct loss.

The controlled comparisons retrain baselines on the same video data and schedule, then freeze the encoders for attentive probing on ImageNet-1K, Something-Something-v2, and Kinetics-400. A larger ViT-L/16 is also trained on a combined corpus of K710, Something-Something-v2, Walking Tours, and the PE Video Dataset.

## Key Results

- At matched epochs on identical data, LeVJEPA matches or surpasses V-JEPA 2 across ViT-S/B/L with 5.6x to 20.8x less pretraining compute.
- At matched total FLOPs, the paper reports a 7.6-point ImageNet-1K advantage over the strongest video baseline while remaining competitive on Something-Something-v2.
- Raising token dropping from 0% to 95% improves ImageNet attentive-probe accuracy from 33.9% to 47.6% in the reported sweep; halving retained tokens from a 90% to a 95% drop leaves accuracy statistically similar.
- At a matched token budget, per-frame patching with $\tau=1$ scores 50.7 on ImageNet-1K and 30.4 on Something-Something-v2 versus 47.4 and 28.8 for $\tau=2$ temporal aggregation.
- Block-causal attention scores 51.2 ImageNet top-1 versus 50.7 for bidirectional attention under the matched small-scale setup.
- A ViT-L/16 trained on the larger corpus reaches 69.5% ImageNet-1K and 55.0% Something-Something-v2 under frozen attentive probing. A ViT-Tiny trains for 12 hours on one RTX 5080 using less than 8 GB at batch size 128 in the reported consumer experiment.
- Although only [CLS] is supervised, patch tokens organize into spatially coherent semantic regions in visualizations and support motion-sensitive transfer.

## Connections

- Extends [[jepa|JEPA]] and [[lejepa|LeJEPA]] from image or latent regularization studies to an efficient video encoder.
- Provides a video counterpart to [[v-jepa-2-1|V-JEPA 2.1]]: LeVJEPA removes EMA-style architectural machinery, while V-JEPA 2.1 emphasizes deep self-supervision and dense masked-token prediction.
- Adds a strong new entry to [[dense-visual-representations]]: sparse input tokens can still produce semantically organized dense patch features, but the patch tokens themselves are not directly supervised.
- Reinforces the anti-collapse comparison in [[representation-collapse]] and the ``remove heuristics'' direction tracked in [[self-supervised-learning]].
- Block-causal encoding makes the model a plausible visual front end for streaming and [[world-models|world-model]] systems, although this paper does not train a dynamics predictor.

## Limitations & Open Questions

> [!open-question]
> The controlled corpus is restricted to a 20% K710 subsample for most baseline comparisons and reaches only ViT-L scale. Behavior at the model, data, and batch sizes of current video foundation models remains uncharacterized.

> [!open-question]
> Only the clip-level [CLS] embedding receives pretraining loss. The emergent patch organization is promising, but dense tasks such as segmentation and tracking are not evaluated.

> [!open-question]
> The high-drop regime can remove motion correspondences from individual views. The paper leaves the interaction between temporal information, dropping strategy, and very sparse observations for future study.

## Future Work

The discussion points to scaling the fixed objective to larger video models and corpora, evaluating the unsupervised patch tokens on dense prediction and tracking, and designing dropping schemes that preserve motion information at high sparsity.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.27395)
- [arXiv](https://arxiv.org/abs/2608.27395)
- [HTML](https://arxiv.org/html/2608.27395v1)
- [PDF](https://arxiv.org/pdf/2608.27395v1)
- [Project](https://levjepa.github.io)
- [Code](https://github.com/MLO-lab/LeVJEPA)
- [Models](https://huggingface.co/galilai-group)

