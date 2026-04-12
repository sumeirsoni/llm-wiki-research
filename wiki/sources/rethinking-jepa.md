---
title: "Rethinking JEPA: Compute-Efficient Video SSL with Frozen Teachers"
type: source
created: 2026-04-10
updated: 2026-04-10
arxiv_id: "2509.24317"
authors:
  - "Xianhang Li"
  - "Chen Huang"
  - "Chun-Liang Li"
  - "Eran Malach"
  - "Josh Susskind"
  - "Vimal Thilak"
  - "Etai Littwin"
year: 2025
venue: "Apple"
tags:
  - jepa
  - self-supervised-learning
  - video
  - self-distillation
  - ema
  - representation-learning
pdf_path: "seed-papers/Rethinking JEPA_ Compute-Efficient Video SSL with Frozen Teachers.pdf"
aliases:
  - "SALT"
  - "Rethinking JEPA"
---

# Rethinking JEPA: Compute-Efficient Video SSL with Frozen Teachers

## Summary

This paper proposes **SALT** (Static-teacher Asymmetric Latent Training), a two-stage approach that replaces the [[ema|EMA]]-updated teacher in video JEPA with a **frozen teacher**. The teacher is first trained with a pixel-reconstruction objective, then frozen while a student learns to predict the teacher's latents on masked regions. This decouples optimization, increasing transparency, efficiency, and scalability.

## Key Contributions

- Shows that a **frozen teacher suffices** for masked-latent prediction — EMA is not necessary
- Proposes **SALT**: a two-stage scheme that decouples teacher training (pixel reconstruction) from student training (masked latent prediction)
- **Outperforms V-JEPA 2** encoders under frozen backbone evaluation across diverse benchmarks
- More **compute-optimal**: higher probing accuracy at matched pretraining FLOPs
- SALT's scaling curves **dominate V-JEPA's accuracy-FLOPs Pareto frontier**
- Surprising finding: **student quality is robust to teacher quality** — high-performing students emerge even with small, sub-optimal teachers

## Methodology

SALT operates in two stages:

1. **Stage 1 — Teacher training**: Train a target encoder with a pixel-reconstruction objective (like [[mae|MAE]]) under V-JEPA masking. This gives the teacher grounding in low-level statistics.
2. **Stage 2 — Student training**: Freeze the teacher. Train a student to predict the teacher's latent representations on masked regions. No EMA, no regularization needed.

This decoupling has several benefits:
- **Transparency**: Each stage has a clear, well-understood objective
- **Efficiency**: No EMA overhead; teacher is computed once
- **Scalability**: Teacher and student can have different architectures
- **Model selection**: Easier to evaluate and select models without EMA coupling

## Key Results

- **Outperforms V-JEPA 2** on frozen backbone evaluation across multiple benchmarks
- **Compute-optimal**: Better accuracy-FLOPs tradeoff than V-JEPA
- **Teacher robustness**: Small, sub-optimal teachers still produce high-performing students
- **Budget allocation insight**: Compute budget should overwhelmingly favor the student over the teacher

## Connections

- Directly challenges the EMA paradigm used in [[v-jepa-2-1|V-JEPA 2.1]] and [[jepa|JEPA]]
- Contrasts with [[lejepa|LeJEPA]] — both remove EMA, but via different mechanisms (LeJEPA uses SIGReg regularization; SALT uses a frozen teacher)
- Related to [[bootleg|Bootleg]] — both rethink the teacher-student relationship in SSL
- The pixel-reconstruction teacher stage connects to generative methods like [[mae|MAE]]
- From Apple research — a different institutional perspective vs. the Meta FAIR JEPA line

## Limitations & Open Questions

> [!open-question]
> Why is student quality so robust to teacher quality? What does this imply about what the student is actually learning from the teacher?

> [!open-question]
> Can the frozen teacher approach extend to other modalities beyond video?

> [!contradiction]
> SALT's finding that EMA is unnecessary contrasts with [[v-jepa-2-1|V-JEPA 2.1]]'s continued reliance on EMA-based self-distillation, yet both achieve strong results. This suggests EMA may be sufficient but not necessary for preventing collapse.

## Links

- [arXiv](https://arxiv.org/abs/2509.24317)
