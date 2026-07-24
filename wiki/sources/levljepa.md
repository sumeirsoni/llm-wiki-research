---
title: "LeVLJEPA: End-to-End Vision-Language Pretraining Without Negatives"
type: source
created: 2026-07-03
updated: 2026-07-11
arxiv_id: "2607.00784"
authors:
  - "Lukas Kuhn"
  - "Giuseppe Serra"
  - "Randall Balestriero"
  - "Florian Buettner"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.00784"
tags:
  - jepa
  - self-supervised-learning
  - multi-modal
  - representation-learning
  - representation-collapse
  - vision
  - language
aliases:
  - "LeVLJEPA"
---

# LeVLJEPA: End-to-End Vision-Language Pretraining Without Negatives

## Summary

LeVLJEPA is the first fully **non-contrastive** end-to-end vision-language pretraining method. It extends [[lejepa|LeJEPA]]'s SIGReg anti-collapse framework to image–text pairs using **asymmetric cross-modal prediction** with stop-gradient targets: image embeddings predict detached text embeddings (and vice versa) through modality-specific MLP predictors, plus per-modality SIGReg on vision and text marginals. No negatives, temperature, momentum encoder, or teacher-student schedule. On Datacomp-L (ViT-B/16, 819M samples seen), LeVLJEPA trails CLIP/SigLIP on zero-shot but matches on linear probing — and **outperforms contrastive baselines on dense patch-token tasks**: +2.25 mIoU ADE20K segmentation, best frozen VLM backbone on GQA/VQAv2/POPE across Llama-1B and Qwen-1.5B. Zero-shot accuracy is inversely related to VLM backbone quality (SigLIP strongest zero-shot, weakest backbone).

## Key Contributions

- **Non-contrastive VLP**: first end-to-end vision-language method without InfoNCE/SigLIP-style negatives.
- **Asymmetric cross-modal JEPA**: SimSiam/BYOL-style predictors + stop-gradient prevent symmetric MSE collapse; SIGReg per modality preserves high-rank embeddings.
- **Batch-size invariance**: no batch-level negative term — stable across $B \in \{1024, 2048, 4096\}$ while CLIP improves with $B$.
- **Dense > global evaluation gap**: contrastive objectives optimize pooled CLS alignment; LeVLJEPA learns stronger **patch-token** semantics for VLM backbones and segmentation.
- **Background robustness**: best ImageNet-9 Mixed-Same / Mixed-Rand accuracy among evaluated encoders.

## Methodology

### Architecture

| Component | Details |
| --- | --- |
| **Vision encoder** $f_\theta$ | ViT-B/16 → CLS + 196 patch tokens |
| **Text encoder** $g_\phi$ | GPT-2 → final-token hidden state |
| **Projections** | 1-layer MLP (2048 hidden, GELU, BN, dropout) → shared dim $d$; applied before SIGReg (LayerNorm in backbones blocks direct SIGReg) |
| **Predictors** $h_v, h_t$ | Depth-4 MLP (2048 width, BN, GELU, 10% dropout) |

### Objective

$$\mathcal{L}_{cross} = \frac{1}{B}\sum_i \left[\|h_v(z_v^i) - \mathrm{sg}(z_t^i)\|_2^2 + \|h_t(z_t^i) - \mathrm{sg}(z_v^i)\|_2^2\right]$$

$$\mathcal{L}_{LeVLJEPA} = (1 - \lambda_v - \lambda_t)\,\mathcal{L}_{cross} + \lambda_v\,\mathrm{SIGReg}(Z_v) + \lambda_t\,\mathrm{SIGReg}(Z_t)$$

Default $\lambda_v = \lambda_t = 0.01$. Embeddings are **not** $\ell_2$-normalized during training (SIGReg targets isotropic Gaussian in $\mathbb{R}^d$).

### Why not direct symmetric MSE?

Direct $\|z_v - z_t\|^2$ + SIGReg **collapses** (vision effective rank → 3) or yields poor transfer. Symmetric regression couples encoders into a coarse shared subspace under-specified by captions. Predictor + stop-gradient asymmetry (like SimSiam) lets SIGReg shape each modality independently.

### Training protocol

- Hyperparameters tuned on **CC12M**; fixed config transferred to **Datacomp-L** (~92M surviving pairs, 819M samples seen).
- Baselines: InfoNCE (CLIP) and SigLIP with OpenCLIP hyperparameters; matched ViT-B/16, compute, evaluation.

## Key Results

### Global readouts (Datacomp-L)

| Metric | InfoNCE | SigLIP | LeVLJEPA |
| --- | --- | --- | --- |
| Zero-shot ImageNet | 47.3 | **50.8** | 42.5 |
| Linear probe ImageNet | 65.8 | **66.3** | 65.4 |
| ImageNet-9 Mixed-Rand | 77.3 | 78.4 | **79.8** |

At CC12M scale, all three objectives are nearly on par on zero-shot and linear probing.

### Dense readouts (frozen encoder)

| Task | Best contrastive | LeVLJEPA |
| --- | --- | --- |
| Segmentation ADE20K (linear on patches) | 20.9 (InfoNCE) | **23.2** |
| Segmentation COCO-Stuff | 29.0 (InfoNCE) | **31.1** |
| VQAv2 (Qwen-1.5B frozen VLM) | 49.4 (InfoNCE) | **54.1** (+4.8 pp) |
| POPE accuracy (Qwen-1.5B) | 71.5 (InfoNCE) | **75.0** |

LeVLJEPA wins every GQA / VQAv2 / POPE column under both Llama-1B and Qwen-1.5B with only an MLP bridge trained.

### Ablations (CC12M)

| Variant | Outcome |
| --- | --- |
| Direct MSE, no SIGReg | Collapse (eff. rank 3 vision) |
| Direct MSE + SIGReg | High rank, poor alignment |
| Predictor + stop-grad, no SIGReg | Unstable / weak probing |
| Full LeVLJEPA | Stable, best among ablations |

## Connections

- Direct cross-modal extension of [[lejepa|LeJEPA]] / SIGReg to vision-language pretraining; co-authored by [[randall-balestriero|Randall Balestriero]].
- Contrasts with **CLIP/SigLIP** (contrastive pooled embedding alignment) and **VL-JEPA** (JEPA framing but InfoNCE between predicted and target embeddings — still contrastive).
- Complements [[v-jepa-2-1|V-JEPA 2.1]] dense-token story: LeVLJEPA shows non-contrastive VLP also favors patch-level semantics over global zero-shot metrics.
- Relevant to [[reconstruction-or-semantics-robotic-world-models|semantic latents for robotics]] and VLM deployment (LLaVA-style frozen backbones) — evaluation should include token-level dense tasks, not only zero-shot.
- Uses **stop-gradient** for cross-modal stability — nuance vs vision-only [[lejepa|LeJEPA]] which claims to eliminate stop-gradient in unimodal SSL.

## Limitations & Open Questions

> [!open-question]
> Can dense-feature advantages be combined with competitive zero-shot alignment in a single objective?

> [!open-question]
> Does LeVLJEPA's patch-token advantage persist at ViT-L/14+ scale and beyond Datacomp-L?

> [!open-question]
> How does LeVLJEPA compare to [[steerable-visual-representations|steerable visual encoders]] or [[repa|REPA]]-style alignment for diffusion/VLM pipelines?

## Future Work

- Combine the dense patch-token advantages of non-contrastive JEPA-style pretraining with competitive zero-shot image-text alignment in a single objective.
- Verify that LeVLJEPA's dense-feature and VLM-backbone gains persist at larger ViT backbones and data scales beyond ViT-B/16 on Datacomp-L.
- Reorient vision-language pretraining objectives and evaluation protocols around dense token features consumed by visual instruction tuning, segmentation, and language-conditioned control.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2607.00784)
- [arXiv](https://arxiv.org/abs/2607.00784)
- [PDF](https://arxiv.org/pdf/2607.00784)
