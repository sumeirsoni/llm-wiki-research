---
title: "Masked Autoencoder (MAE)"
type: concept
created: 2026-04-10
updated: 2026-04-10
tags:
  - masked-modeling
  - self-supervised-learning
  - generative-modeling
  - vision
sources:
  - "[[bootleg]]"
  - "[[rethinking-jepa]]"
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
