---
title: "On the Geometry of On-Policy Distillation"
type: source
created: 2026-06-09
updated: 2026-06-09
arxiv_id: "2606.07082"
authors:
  - "Zhennan Shen"
  - "Yanshu Li"
  - "Qingyu Yin"
  - "Chak Tou Leong"
  - "Zhilin Wang"
  - "Yanxu Chen"
  - "Rongduo Han"
  - "Sunbowen Lee"
  - "Yi R. Fung"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.07082"
tags:
  - language
  - self-distillation
  - theory
  - optimization
aliases:
  - "OPD Geometry"
  - "Parameter-Space Geometry of OPD"
---

# On the Geometry of On-Policy Distillation

## Summary

This paper provides the first systematic characterization of on-policy distillation (OPD) in parameter space, showing that OPD occupies a "relaxed off-principal regime" between SFT (dense, principal-aligned updates) and RLVR (sparse, off-principal updates). OPD exhibits "subspace locking" — cumulative updates rapidly enter a narrow, low-dimensional, functionally sufficient channel that is robust to runtime perturbations but sensitive to objective composition.

## Key Contributions

- **Relaxed off-principal regime**: OPD update sparsity (51.6% unchanged weights) falls between SFT (8.1%) and RLVR (77.2%); subspace rotation (~1°) and spectral drift (10⁻⁴) are intermediate between SFT's aggressive distortion and RLVR's geometry preservation.
- **Subspace locking**: OPD's stable rank rapidly enters and remains in a low-dimensional band from early training; the locked subspace is functionally sufficient (rank-16 projection preserves OPD performance but degrades SFT).
- **Three-Gate account extended**: dense token-level teacher supervision provides broader active directions within the geometry-anchored, off-principal context established by RLVR-like constraints.
- **Objective composition controls trajectory**: mixing OPD with RLVR signals (via α) changes rank dynamics; token sparsification and off-policy rollouts preserve the lock but rescale update magnitude.
- **Early subspace emergence**: top-16 right singular subspace aligns with final subspace from earliest checkpoints, unlike SFT's progressive expansion.

## Methodology

Controlled experiments on Qwen3-8B (SFT from base, OPD/RLVR from SFT checkpoint) on dapo-math-17k using bf16 precision. Diagnostics include:

- **Static localization**: update sparsity, principal-angle rotation, normalized spectral shift (NSS), update-mask overlap with principal/low-magnitude regions.
- **Trajectory analysis**: stable rank, Frobenius norm, Hill tail estimate, subspace similarity over training, functional sufficiency via rank-16 gradient projection.
- **Control experiments**: token sparsification (25%/50%), off-policy rollouts (teacher policy), objective mixing (OPD + RLVR with coefficient α).

## Key Results

- **Sparsity spectrum**: SFT 8.1% → OPD 51.6% → RLVR 77.2% unchanged weights (Qwen3-8B, global).
- **Update localization**: principal-mask overlap decreases SFT→OPD→RLVR; low-magnitude overlap increases, with OPD intermediate.
- **Subspace locking**: OPD stable rank locks early and stays low; SFT expands progressively; RLVR diffuses then contracts.
- **Functional sufficiency**: constraining to early rank-16 subspace preserves OPD on AIME 2024 but substantially degrades SFT.
- **Control**: token sparsification and off-policy rollouts preserve spectral shape; objective mixing (α ≤ 0.25) deviates from OPD baseline rank trajectory.

## Connections

- Provides the parameter-space foundation for [[on-policy-representation-distillation|OPRD]], which operates within OPD's locked subspace but adds representation-level signal invisible to output-space objectives.
- Extends [[representation-geometry|representation geometry]] from embedding spaces to parameter-space update geometry during post-training.
- Complements [[self-distillation|self-distillation]] analysis: OPD's geometry differs from both SFT-style dense alignment and RLVR-style sparse reward shaping.
- The subspace locking phenomenon relates to [[iterative-refinement|iterative refinement]] — OPD converges to a low-dimensional update channel rather than exploring the full parameter space.

## Limitations & Open Questions

> [!open-question]
> Does subspace locking generalize beyond Qwen3-family math reasoning to other architectures, modalities, and task domains?

> [!open-question]
> Can geometry-aware OPD algorithms explicitly exploit the locked subspace for faster training or reduced compute?

> [!open-question]
> How does adding representation-level distillation ([[on-policy-representation-distillation|OPRD]]) alter the subspace locking dynamics?

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2606.07082)
- [arXiv](https://arxiv.org/abs/2606.07082)
- [PDF](https://arxiv.org/pdf/2606.07082)
