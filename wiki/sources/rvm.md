---
title: "Recurrent Video Masked Autoencoders"
type: source
created: 2026-04-25
updated: 2026-04-25
arxiv_id: "2512.13684"
authors:
  - "Daniel Zoran"
  - "Nikhil Parthasarathy"
  - "Yi Yang"
  - "Drew A Hudson"
  - "João Carreira"
  - "Andrew Zisserman"
year: 2025
venue: "Google DeepMind"
pdf_path: "raw/Recurrent Video Masked Autoencoders.pdf"
tags:
  - video
  - mae
  - self-supervised-learning
  - representation-learning
  - transformer
aliases:
  - "RVM"
  - "Recurrent Video MAE"
---

# Recurrent Video Masked Autoencoders

## Summary

RVM introduces a **recurrent architecture** for video masked autoencoders that processes frames sequentially with a GRU-Transformer hybrid core. Unlike chunked video models (VideoMAE, V-JEPA) that treat time symmetrically, RVM models temporal dynamics **causally and directionally**. This enables: (1) linear scaling with video length, (2) stable features over long horizons, and (3) a **generalist encoder** that excels at both spatial and spatio-temporal tasks without specialization.

## Key Contributions

- **Recurrent temporal aggregation**: GRU-based core maintains hidden state across frames — sequential processing instead of chunked spatio-temporal attention
- **Asymmetric temporal masking**: Condition on past frames to reconstruct heavily masked future frames (inspired by SiamMAE)
- **Generalist encoder**: Strong on both video tasks (SSv2, K700) AND dense spatial tasks (depth, segmentation) — unlike specialized models
- **Parameter efficient**: 34M RVM-S outperforms 30× larger VideoMAEv2-g in normalized average accuracy
- **No distillation needed**: Strong small-model performance without knowledge distillation (unlike DINOv2-S)
- **Long-term consistency**: Linear scaling with frames; stable features over 80+ frame sequences where chunked models degrade
- **Simple objective**: Just L2 pixel reconstruction loss — no EMA, no complex regularizers

## Methodology

### Architecture

```
Frame → Tokenize+Mask → ViT Encoder (shared) → GRU-Transformer Core → Decoder → Reconstruct
                                                      ↑
                                              Hidden state s_t
```

**Key components**:

1. **Tokenization**: Patches + Fourier positional encoding; 95% masking on target frames
2. **Shared ViT Encoder**: Same weights for all frames (source and target)
3. **GRU-Transformer Core**: The key innovation
   - Update gate `u_t` and reset gate `r_t` (standard GRU)
   - Candidate state via Transformer: cross-attention (current input queries, gated previous state as K/V)
   - New state: `s_t = (1-u_t) ⊙ s_{t-1} + u_t ⊙ h_t`
4. **Decoder**: Cross-attention from masked target tokens to aggregated source features

### Training

- **Data**: 8.4M video clips from HowTo100M, K700, SSv2, YTBB, YT8M (no ImageNet!)
- **Sampling**: 4 source frames → predict 4 target frames with random gap (4-48 frames)
- **Loss**: Simple L2 reconstruction (no patch normalization)
- **Scale**: 1M-4M steps on 256 TPU-v6 cores

## Key Results

### Generalist Performance

| Model | Params | Spatio-temporal | Spatial | Avg Normalized |
|-------|--------|-----------------|---------|----------------|
| DINOv2-L | 300M | Poor | **Strong** | Lower |
| VideoMAE-L | 300M | **Strong** | Poor | Lower |
| V-JEPA2-L | 300M | **Strong** | Moderate | Moderate |
| RVM-L | 300M | **Strong** | **Strong** | **Highest** |

RVM is the only model that doesn't sacrifice one category for the other.

### Parameter Efficiency

| Model | Params | SSv2 | K700 | Notes |
|-------|--------|------|------|-------|
| VideoMAEv2-g | ~1B | High | High | Giant model |
| RVM-S | **34M** | Competitive | Competitive | **30× smaller** |

### Long-Term Stability

On DAVIS segmentation over 80+ frames:
- **RVM**: Slow performance decline (recurrent state maintains consistency)
- **VideoMAE**: Fast degradation (chunked processing loses context)
- **DINOv2**: Moderate (no temporal modeling, but stable per-frame)

## Connections

- **Contrasts with [[v-jepa-2-1|V-JEPA 2.1]]**: Both target video SSL, but V-JEPA uses JEPA objective in latent space with EMA; RVM uses pixel reconstruction with recurrent core
- **Extends [[mae|MAE]]**: From images to video with explicit temporal recurrence
- Related to [[rethinking-jepa|SALT]]'s asymmetric temporal conditioning (past→future), but RVM uses pixel reconstruction rather than latent prediction
- The "generalist encoder" goal aligns with efforts to unify representation types across the wiki
- Complements [[foveal-ssl|Foveal SSL]]'s resolution agnosticism — RVM achieves temporal efficiency, Foveal SSL achieves spatial efficiency
- **[[hyperloop-transformers|Hyperloop Transformers]]**: Both demonstrate parameter-efficient recurrent architectures. RVM uses GRU-Transformer for video; Hyperloop uses looped Transformers with hyper-connections for LLMs. Both show recurrence enables efficiency without sacrificing quality.

> [!insight]
> RVM suggests that **simple pixel reconstruction + proper temporal architecture** may be sufficient for learning strong video representations — no need for JEPA's latent prediction, EMA teachers, or complex regularizers. This challenges the assumption that pixel-level objectives are inherently limited.

## Limitations & Open Questions

> [!open-question]
> How does RVM compare to V-JEPA 2.1 on identical benchmarks? Both claim generalist video encoders but use fundamentally different objectives.

> [!open-question]
> Can RVM's recurrent core be combined with JEPA-style latent prediction for even stronger representations?

> [!open-question]
> Would RVM benefit from representation alignment (REPA-style) to frozen encoders, or does the recurrent architecture already learn sufficient semantics?

> [!gap]
> No direct comparison between RVM and JEPA methods on shared protocols in the wiki yet.

## Links

- [arXiv](https://arxiv.org/abs/2512.13684)
