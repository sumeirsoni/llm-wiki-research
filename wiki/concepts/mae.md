---
title: "Masked Autoencoder (MAE)"
type: concept
created: 2026-04-10
updated: 2026-04-25
tags:
  - masked-modeling
  - self-supervised-learning
  - generative-modeling
  - vision
sources:
  - "[[bootleg]]"
  - "[[rethinking-jepa]]"
  - "[[rvm]]"
aliases:
  - "MAE"
  - "Masked Autoencoder"
  - "Masked Autoencoders"
---

# Masked Autoencoder (MAE)

## Overview

Masked Autoencoders are a generative [[self-supervised-learning|self-supervised learning]] method that learns representations by **masking random patches** of an input image and **reconstructing the missing pixels**. Unlike [[jepa|JEPA]], which predicts in latent space, MAE predicts in pixel space.

## Relation to JEPA

MAE and JEPA represent two sides of the SSL spectrum:

| Aspect | MAE (Generative) | JEPA (Predictive) |
|--------|-------------------|-------------------|
| **Prediction target** | Raw pixels | Latent embeddings |
| **Strengths** | Low-level grounding | High-level semantics |
| **Weaknesses** | Doesn't prioritize semantics | May lose spatial detail |
| **Collapse risk** | None (pixel targets are fixed) | High (embedding targets can degenerate) |

## In This Wiki

- [[bootleg|Bootleg]] argues MAE and JEPA represent a false dichotomy — its multi-layer distillation captures both low-level (MAE-like) and high-level (JEPA-like) features
- [[rethinking-jepa|SALT]] uses MAE-style pixel reconstruction to train the teacher (Stage 1), then freezes it for JEPA-style latent prediction (Stage 2) — a direct hybrid
- [[v-jepa-2-1|V-JEPA 2.1]]'s dense predictive loss (all-token prediction) bridges toward MAE's approach of grounding every spatial location

### Video MAE with Recurrence

[[rvm|RVM (Recurrent Video MAE)]] demonstrates that MAE with proper temporal architecture can match JEPA methods:
- **GRU-Transformer core** maintains state across frames (vs. chunked spatio-temporal attention)
- **Simple L2 pixel loss** — no EMA, no complex regularizers
- Achieves **generalist encoder** (strong on both spatial AND temporal tasks)
- 34M model matches 30× larger VideoMAEv2

> [!insight]
> RVM suggests the MAE vs. JEPA debate may be less about the objective (pixel vs. latent) and more about the architecture. With proper recurrent temporal modeling, even pixel reconstruction can learn strong semantic features.
