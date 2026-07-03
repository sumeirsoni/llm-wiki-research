---
title: "You Don't Need Strong Assumptions: Visual Representation Learning via Temporal Differences"
type: source
created: 2026-06-09
updated: 2026-06-09
arxiv_id: "2606.15956"
authors:
  - "Ninad Daithankar"
  - "Alexi Gladstone"
  - "Yann LeCun"
  - "Heng Ji"
year: 2026
venue: "ICML 2026"
pdf_path: "https://arxiv.org/pdf/2606.15956"
code_url: "https://github.com/ninaddaithankar/TDV"
project_url: "https://temporal-difference-vision.github.io/"
tags:
  - self-supervised-learning
  - vision
  - video
  - jepa
  - representation-learning
aliases:
  - "TDV"
  - "Temporal Difference in Vision"
---

# You Don't Need Strong Assumptions: Visual Representation Learning via Temporal Differences

## Summary

Temporal Difference in Vision (TDV) is a self-supervised learning paradigm that trains image encoders from video using only a causal assumption — the past causes the future — without augmentations, masking, cropping, or other hand-crafted inductive biases. A frame encoder and motion encoder are jointly trained so that z_t + Δz_t = z_{t+1}, where the motion encoder maps low-rank RGB frame differences (conditioned on the current frame via cross-attention) into latent-space shifts. TDV matches DINO/iBOT on dense spatial tasks (segmentation, optical flow, stereo depth) while lagging on semantic benchmarks.

## Key Contributions

- **Minimal-assumption SSL**: replaces augmentation/masking/cropping inductive biases with a single causal next-frame prediction principle applied in latent space.
- **Additive latent composition**: frame encoder f_θ(x_t) → z_t; motion encoder m_φ(Δx_t; z_t) → Δz_t; predicted next state ẑ_{t+1} = z_t + Δz_t supervised against teacher EMA embedding of x_{t+1}.
- **Scale-dependent bias hypothesis**: controlled experiments show optimal inductive bias strength decreases as data scale increases, motivating weaker-assumption methods.
- **Dense spatial performance**: competitive with DINO/iBOT on semantic segmentation (ADE20K, Cityscapes); outperforms on optical flow EPE and stereo depth bad-pixel rates.
- **Collapse prevention without augmentations**: DINO-style prototype cross-entropy on [CLS] token plus EMA teacher prevents collapse where removing DINO augmentations causes representation collapse.

## Methodology

Given consecutive video frames x_t, x_{t+1}, TDV computes RGB difference Δx_t = x_{t+1} - x_t (intrinsically low-rank due to temporal consistency). The frame encoder maps x_t to patch tokens z_t; the motion encoder predicts Δz_t conditioned on z_t via cross-attention. The predicted next representation ẑ_{t+1} = z_t + Δz_t is supervised with MSE against the teacher EMA encoder's embedding of x_{t+1}. A DINO-style categorical cross-entropy on prototype distributions prevents collapse. Training uses Something-Something V2 video without any hand-crafted augmentations.

## Key Results

- **Segmentation (UperNet, frozen backbone)**: competitive mIoU/mAcc with DINO and iBOT on ADE20K and Cityscapes despite no augmentations.
- **Optical flow**: consistently lower endpoint error (EPE) than DINO/iBOT on Sintel/KITTI benchmarks.
- **Stereo depth**: lower bad-pixel rates at 0.5px and 1px thresholds; slightly higher average disparity error in ambiguous regions.
- **Semantic gap**: lags DINO/iBOT on ImageNet KNN and SSv2 action recognition (expected without semantic inductive biases).
- **Ablations**: motion encoder, MSE loss, DINO [CLS] loss, centering, and cross-attention are all critical; removing motion encoder or MSE causes collapse.
- **No-augmentation baseline**: TDV avoids collapse where progressively stripped DINO recipes collapse (Table 1 on SSv2).

## Connections

- Positions itself within the [[jepa|JEPA]] trajectory of weakening inductive biases — predicting in latent space rather than pixel space, but replacing masking/augmentations with temporal causality.
- Authors include [[yann-lecun|Yann LeCun]], architect of JEPA; TDV argues the next step is removing even augmentation-based biases.
- Temporal delta encoding parallels [[delta-world|DeltaWorld]]'s delta-token compression and [[pretraining-recurrent-networks-without-recurrence|SMT]]'s focus on modeling change rather than full state re-encoding.
- Contrasts with [[lejepa|LeJEPA]]/[[visreg|VISReg]] regularization approaches — TDV removes biases rather than replacing EMA/augmentations with alternative regularizers.
- Supports the wiki's theme that weaker assumptions may win at scale ([[learn-from-your-own-latents|Learn From Your Own Latents]] sample-complexity arguments).

## Limitations & Open Questions

> [!open-question]
> Can TDV close the semantic performance gap (ImageNet KNN, action recognition) at larger data scales without reintroducing augmentations?

> [!open-question]
> Does the causal next-frame objective generalize beyond video to other modalities where temporal structure is available?

> [!open-question]
> Can TDV's motion encoder integrate with [[sub-jepa|Sub-JEPA]]-style regularization or [[visreg|VISReg]] shape matching for combined bias reduction and stability?

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2606.15956)
- [arXiv](https://arxiv.org/abs/2606.15956)
- [PDF](https://arxiv.org/pdf/2606.15956)
- [Project Page](https://temporal-difference-vision.github.io/)
- [Code](https://github.com/ninaddaithankar/TDV)
