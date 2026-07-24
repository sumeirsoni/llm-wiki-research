---
title: "Pretraining Recurrent Networks without Recurrence"
type: source
created: 2026-06-09
updated: 2026-07-11
arxiv_id: "2606.06479"
authors:
  - "Akarsh Kumar"
  - "Phillip Isola"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.06479"
tags:
  - transformer
  - theory
  - optimization
  - generative-modeling
aliases:
  - "SMT"
  - "Supervised Memory Training"
  - "DAgger Memory Training"
---

# Pretraining Recurrent Networks without Recurrence

## Summary

Supervised Memory Training (SMT) trains nonlinear RNNs without backpropagation through time by using a Transformer teacher to generate optimal memory labels at each timestep, then supervising one-step memory transitions. This decouples memory representation (predictive state encoding) from memory dynamics (RNN updates), enabling time-parallel training with O(1) credit path length, stable gradients, and fixed-memory inference — combining Transformer training efficiency with RNN expressivity.

## Key Contributions

- **Supervised Memory Training (SMT)**: a Transformer encoder-decoder generates Markovian memory labels via a predictive-state objective; the RNN learns one-step transitions m_{t+1} = f_θ(m_t, x_{t+1}) supervised by these labels.
- **Time-parallel RNN pretraining**: eliminates BPTT's sequential unrolling during training; gradient magnitudes for memory states are independent of timestep.
- **DAgger Memory Training (DMT)**: lightweight fine-tuning phase exposing the RNN to its own induced memory distribution to mitigate train-test drift.
- **Compression as a scaling axis**: SMT-trained encoders achieve higher compression (same performance with smaller memory) when given more training compute.
- **Length generalization**: SMT→DMT RNNs generalize to sequences longer than training length on state-tracking tasks, outperforming the Transformer teacher at OOD lengths.

## Methodology

A bidirectional Transformer encoder E_φ compresses past context x_{0:t} into memory m_t = E_φ(x_{0:t}). A causal decoder D_ψ predicts future outputs from m_t and future inputs via cross-entropy (predictive state objective). The RNN f_θ learns dynamics: m̂_{t+1} = f_θ(m_t, x_{t+1}) with MSE loss against teacher labels m_{t+1}. A uniformity loss prevents memory collapse.

The full objective is L_smt = λ_dec E[L_dec] + λ_dyn E[L_dyn] + λ_unif L_unif, with one random timestep sampled per step for efficiency. Sequence-to-set reparameterization enables parallel encoder computation.

After SMT, DMT fine-tunes by training on (m̂_t, x_{t+1}) → m_{t+1} where m̂_t are RNN-generated states.

## Key Results

- **Synthetic tasks**: SMT→DMT outperforms BPTT on all five tasks (Retrieval, String Copy, Stack, Keys-Values, Modular Arithmetic), especially at long sequence lengths.
- **Pixel sequences (Attneave's task)**: SMT RNNs generate coherent MNIST digits and Sketchy strokes; BPTT RNNs show recency bias and fail on long-range structure.
- **TinyStories**: comparable or better data efficiency than BPTT; significantly better on MNIST pixel sequences.
- **Scaling**: smooth improvements with context length, memory size, and model width/depth; RNN performance approaches Transformer teacher at larger scales.
- **Memory geometry**: SMT learns task-dependent structures — finite-state-machine collapse for retrieval, tree-like geometry for string copying.

## Connections

- Provides an alternative to BPTT for training recurrent components in [[iterative-refinement|iterative refinement]] architectures like [[hyperloop-transformers|Hyperloop Transformers]] and [[generative-recursive-reasoning|GRAM]].
- The predictive-state memory objective connects to [[world-models|world models]] — compressed sufficient statistics of past experience for predicting future observations.
- Complements [[learn-from-your-own-latents|Learn From Your Own Latents]]: both argue that latent/memory prediction can be more sample-efficient than token-level prediction.
- DMT's on-policy imitation learning parallels the on-policy training paradigm in [[on-policy-representation-distillation|OPRD]] and [[on-the-geometry-of-on-policy-distillation|OPD geometry analysis]].

## Limitations & Open Questions

> [!open-question]
> Can SMT scale to foundation-model sizes and natural language, or does the teacher-student overhead limit practical deployment?

> [!open-question]
> Does SMT's fixed-memory inductive bias benefit embodied [[world-models|world models]] processing unbounded sensory streams?

> [!open-question]
> Can SMT pretraining combine with [[equilibrium-reasoners|Equilibrium Reasoners]]-style attractor dynamics for reasoning tasks?

## Future Work

- BPTT fine-tuning after SMT pretraining to recover expressivity beyond the time-parallel Transformer teacher, which is itself constrained in expressivity.
- Training on all per-timestep memories [m₀, …, m_T] rather than a single sampled m_t, which may help at larger scales despite offering no gain in current settings.
- Parallelizing DAgger Memory Training (DMT) via DEER-style methods to retain on-policy drift correction without sacrificing time-parallel training.
- Applying the O(1) credit-path SMT recipe to lifelong learning over unbounded horizons, where memories must remain useful many steps later.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2606.06479)
- [arXiv](https://arxiv.org/abs/2606.06479)
- [PDF](https://arxiv.org/pdf/2606.06479)
