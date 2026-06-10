---
title: "Probabilistic Tiny Recursive Model"
type: source
created: 2026-05-20
updated: 2026-05-20
arxiv_id: "2605.19943"
authors:
  - "Amin Sghaier"
  - "Ali Parviz"
  - "Alexia Jolicoeur-Martineau"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.19943"
tags:
  - transformer
  - language
  - theory
aliases:
  - "PTRM"
  - "Probabilistic TRM"
---

# Probabilistic Tiny Recursive Model

## Summary

Probabilistic Tiny Recursive Model (PTRM) is an inference-time extension for Tiny Recursive Models that injects Gaussian noise into latent states during parallel rollouts and uses the pretrained Q-head to select the best candidate. It requires no retraining and introduces width scaling as a practical complement to depth scaling in recursive reasoning.

## Key Contributions

- **Retraining-free stochastic inference**: adds noise to latent inputs at each deep recursion step across K parallel rollouts.
- **Q-head as internal verifier**: repurposes TRM's correctness classifier (normally discarded at inference) for best-Q@K selection.
- **Escape from bad basins**: analysis on PPBench shows trajectories can escape oscillating low-accuracy latent basins when perturbed.
- **Width scaling axis**: parallel rollouts often outperform simply increasing recursion depth.
- **Cost-efficient SOTA on puzzles**: 91.2% on PPBench golden set at ~$0.001/attempt, beating frontier LLM ensembles.

## Methodology

Standard TRM iteratively refines latent state z and answer y through weight-tied updates with deep supervision and ACT during training. PTRM at inference:

1. Run K independent rollouts for depth D supervision steps.
2. Inject Gaussian noise ε ~ N(0, σ²I) into z at each deep recursion step.
3. Score final latent outputs with the Q-head f_Q.
4. Return the decoded answer from the rollout with highest Q-value.

Task-dependent σ is tuned per benchmark. PTRM can be combined with depth scaling for further gains.

## Key Results

- PPBench: 62.6% (deterministic TRM, K=1, D=16) → 91.2% (PTRM, K=100, D=48); Sudoku puzzles 46.7% → 97.8%.
- Sudoku-Extreme: 87.3% → 98.75% best-Q@K (99.06% pass@K).
- Maze-Hard: 83.8% → 86.73% mode@K; pass@K reaches 95.63% though Q-head selection is weaker.
- ARC-AGI-2: pass@100 improves from 14.31% to 15.97% in augmentation-voting pipeline.
- Outperforms Claude-Opus-4-6@thinking (34.7%) and a 7-LLM ensemble (55.1%) on PPBench aggregate.

## Connections

- Lightweight inference-time counterpart to [[generative-recursive-reasoning|GRAM]], which retrains TRM-style models with full variational stochastic dynamics.
- Complements [[equilibrium-reasoners|Equilibrium Reasoners]] (training-time attractor shaping) and [[attractor-models|Attractor Models]] (fixed-point output refinement).

## Limitations & Open Questions

> [!open-question]
> Can a stronger or calibrated verifier close the gap between best-Q@K and pass@K on Maze-Hard and ARC-AGI-2?

> [!open-question]
> How does PTRM compare with training-time probabilistic methods like GRAM when both are allowed similar compute budgets?

## Links

- [AlphaXiv](https://www.alphaxiv.org/overview/2605.19943)
- [arXiv](https://arxiv.org/abs/2605.19943)
