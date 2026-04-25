---
title: "Self-supervised Pretraining for an Iterative Image Size Agnostic Vision Transformer"
type: source
created: 2026-04-25
updated: 2026-04-25
arxiv_id: "2604.20392"
authors:
  - "Nedyalko Prisadnikov"
  - "Danda Pani Paudel"
  - "Yuqian Fu"
  - "Luc Van Gool"
year: 2026
venue: "INSAIT, Sofia University"
pdf_path: "raw/Self-supervised pretraining for an iterative image size agnostic vision transformer.pdf"
tags:
  - self-supervised-learning
  - self-distillation
  - transformer
  - vision
  - representation-learning
aliases:
  - "Foveal SSL"
  - "Sequential-to-Global Distillation"
---

# Self-supervised Pretraining for an Iterative Image Size Agnostic Vision Transformer

## Summary

This paper introduces a **self-supervised pretraining framework** for foveal-inspired vision transformers that can process images of **any resolution with constant compute**. The key innovation is **sequential-to-global self-distillation** — extending DINO to train a model that iteratively accumulates scene understanding from sparse glimpses. The model achieves 75% ImageNet accuracy while being robust at extreme resolutions (>1024px) where standard ViTs collapse.

## Key Contributions

- **Sequential-to-global self-distillation**: Adapts DINO for iterative, recurrent-like architectures without backpropagation through time (BPTT)
- **Image-size agnosticism**: Constant compute budget regardless of input resolution — avoids "patch distribution shift" that degrades standard ViTs at high resolutions
- **Efficient patch extraction via integral images**: O(1) per-pixel extraction cost, decoupling compute from resolution
- **Active gaze policy**: Learned attention policy (GRPO-trained) that selects discriminative regions
- **Monotonic knowledge accumulation**: Performance improves consistently with each iterative step, demonstrating effective memory aggregation

## Methodology

### Sequential-to-Global Self-Distillation

Extends DINO's local-to-global spatial correspondence to temporal/sequential correspondence:

**Three view types**:
1. **Global view**: 16×16 foveal patch grid covering >32% of image
2. **Local view**: 7×7 grid covering <32% of image  
3. **Sequential view**: 8 random foveal glimpses processed iteratively

**Asymmetric processing**:
- **Teacher**: Processes global + sequential views; only uses *final* step embedding
- **Student**: Processes different global, 8 local, and different sequential views; output at *every* step is compared to teacher's static target

**Key insight**: Stop-gradients between sequential steps force the student to approximate global context from local glimpses without BPTT. The model learns to accumulate scene understanding over time.

### Foveal Patch Extraction

- **Multi-zoom patches**: Sparse logarithmic patches around gaze center (from prior work)
- **Focused Foveal Grid**: Dense G×G high-resolution patches around gaze — critical for self-attention performance
- **Integral images**: Pre-compute summed-area table once; extract any patch in O(P²) regardless of source image size

### Gaze Policy

Trained separately after backbone pretraining:
1. Lightweight 6-block transformer predicts next gaze (x, y) via Gaussian Mixture Model
2. Optimized with GRPO using classification confidence as reward
3. Learns to seek discriminative regions

## Key Results

| Mode | ImageNet Top-1 | Notes |
|------|----------------|-------|
| Static ViT (16×16 grid) | 76.1% | Competitive with DINO baseline |
| Dynamic (random gaze) | 71.7% | 8 iterative steps |
| Dynamic (learned gaze) | **75.0%** | Policy improves over random |

**Resolution robustness**: At >1024px evaluation, outperforms supervised baseline by **+10%** — standard ViTs collapse due to patch distribution shift.

**Fine-grained classification**:
- CUB-200-2011: 80.5% (learned policy) vs 73.8% (random)
- Oxford Flowers: 97.7%

**Monotonic accumulation**: Accuracy increases consistently from 57.7% (step 1) → 75.0% (step 8), confirming iterative memory works without BPTT.

## Connections

- Extends [[self-distillation|DINO-style self-distillation]] to sequential/recurrent architectures
- Related to [[self-supervised-learning]] — novel paradigm for iterative SSL
- Addresses resolution scaling problem that [[repa|REPA]] and standard ViT backbones face
- The "constant compute regardless of resolution" goal aligns with [[elt|ELT]]'s parameter efficiency aims — both decouple model capacity from input complexity
- Biologically inspired (foveal attention) like [[jepa|JEPA]]'s predictive coding motivation

> [!insight]
> This sequential-to-global distillation could potentially be combined with JEPA methods — both involve learning to predict/accumulate context from partial observations, but this work operates spatially over glimpses while JEPA operates over masked embeddings.

## Limitations & Open Questions

> [!open-question]
> Can sequential-to-global distillation be combined with JEPA's masked prediction? Both create information asymmetry for representation learning.

> [!open-question]
> How does this compare to [[v-jepa-2-1|V-JEPA 2.1]]'s dense features at high resolutions? Both address the resolution/detail tradeoff differently.

> [!open-question]
> Could the learned gaze policy be used to guide masking strategies in JEPA methods (selective masking of non-attended regions)?

## Links

- [arXiv](https://arxiv.org/abs/2604.20392)
