---
title: "Augmented Lagrangian Predictive Coding"
type: source
created: 2026-06-09
updated: 2026-07-11
arxiv_id: "2605.31022"
authors:
  - "Jeffrey Seely"
  - "Julian Gould"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.31022"
tags:
  - theory
  - optimization
  - transformer
aliases:
  - "PC-ALM"
  - "Predictive Coding with Augmented Lagrangian"
---

# Augmented Lagrangian Predictive Coding

## Summary

Augmented Lagrangian Predictive Coding (PC-ALM) reframes deep network training as a constrained optimization problem solved via the method of multipliers. By introducing Lagrange multipliers alongside the standard predictive-coding penalty, PC-ALM achieves exact backpropagation gradients at equilibrium in linear networks and closes the performance gap between predictive coding and BP in deep nonlinear MLPs — all while retaining layer-local updates and a fixed inference budget.

## Key Contributions

- **Augmented Lagrangian formulation of PC**: treats layer activations as optimization variables with Lagrange multipliers that accumulate prediction errors, generalizing standard PC (which corresponds to zeroed multipliers).
- **Exact BP gradients at equilibrium (linear case)**: proves that at the fixed point, multipliers align with BP adjoints and weight updates equal BP gradients.
- **Ballistic credit propagation**: dual ascent accelerates credit signal spread across layers compared to PC's diffusive propagation, with group velocity scaling as √(α η_h) layers per inference step.
- **Closes PC–BP gap empirically**: matches BP on Fashion-MNIST and MNIST across depths L=8–128 and widths N=8–128 with inference budget T=2L.
- **Robustness to reparameterization**: maintains BP-level performance across lazy-to-rich mean-field parameterization sweeps where standard PC degrades.

## Methodology

Training is formulated as minimizing supervised loss subject to layer constraints h_i = σ(W_i h_{i-1}). Standard PC relaxes constraints via a quadratic penalty; PC-ALM adds Lagrange multipliers λ_i:

$$\mathcal{L}_\rho(h, \theta, \lambda) = \frac{1}{2}\|y - W_L h_{L-1}\|^2 + \sum_i \lambda_i^\top (h_i - \sigma(W_i h_{i-1})) + \frac{\rho}{2}\sum_i \|h_i - \sigma(W_i h_{i-1})\|^2$$

Each inference cycle performs one primal step (gradient descent on h w.r.t. L_ρ) and one dual step (λ_i ← λ_i + α r_i where r_i is the layer residual), repeated T times. Weights are then updated via ∇_{W_i} L_ρ. Setting α=0 recovers standard PC.

## Key Results

- **Linear networks**: converges to unique fixed point with h = forward pass, λ = exact BP adjoints, and weight gradient = BP gradient under stability conditions (spectral radius < 1).
- **Nonlinear MLPs**: PC-ALM matches BP test accuracy across all tested width/depth regimes with T=2L; standard PC underperforms especially in deep narrow networks.
- **Gradient alignment**: cosine similarity to BP shows a predictable inflection at t ≈ L/√(α η_h); PC-ALM reaches 0.9 BP alignment with fewer FLOPs than widening PC.
- **Oscillatory dynamics**: complex eigenvalues produce stable oscillatory transients absent in PC's pure gradient flow.

## Connections

- Connects biologically plausible local learning (predictive coding) to distributed optimization via augmented Lagrangians; related to [[energy-based-models|energy-based inference]] as both replace global BP with local iterative dynamics.
- Complements [[learn-from-your-own-latents|Learn From Your Own Latents]] in the broader theme of alternative credit-assignment mechanisms beyond standard backpropagation.
- The dual-variable accumulation of prediction errors parallels [[iterative-refinement|iterative refinement]] patterns where inference steps refine internal states before committing to weight updates.

## Limitations & Open Questions

> [!open-question]
> Can PC-ALM extend to convolutional, attention, and recurrent architectures while preserving equilibrium BP alignment guarantees?

> [!open-question]
> Does ballistic credit propagation translate to large-scale natural datasets and multi-epoch training, or is the benefit limited to the current MNIST-scale evaluation?

> [!gap]
> PC-ALM does not address the weight transport problem; full biological plausibility remains an open challenge.

## Future Work

- The paper defers current limitations to Appendix G rather than listing forward experiments; natural extensions implied by the discussion are scaling PC-ALM beyond the verified linear/nonlinear regimes and comparing more systematically to related Lagrangian / Equilibrium Propagation methods.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2605.31022)
- [arXiv](https://arxiv.org/abs/2605.31022)
- [PDF](https://arxiv.org/pdf/2605.31022)
