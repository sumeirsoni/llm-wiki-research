---
title: "Generative Recursive Reasoning"
type: source
created: 2026-05-17
updated: 2026-05-17
arxiv_id: "2605.19376"
authors:
  - "Junyeob Baek"
  - "Mingyu Jo"
  - "Minsu Kim"
  - "Mengye Ren"
  - "Yoshua Bengio"
  - "Sungjin Ahn"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.19376"
tags:
  - transformer
  - language
  - generative-modeling
  - theory
aliases:
  - "GRAM"
  - "Generative Recursive Reasoning Models"
---

# Generative Recursive Reasoning

## Summary

Generative Recursive Reasoning introduces GRAM (Generative Recursive reAsoning Models), a probabilistic extension of Recursive Reasoning Models (RRMs) such as HRM and TRM. Instead of following a single deterministic latent trajectory, GRAM treats reasoning as a stochastic latent process with hierarchical inner/outer refinement, enabling multi-hypothesis exploration, multi-solution coverage, and unconditional generation while keeping the parameter-efficient recursive structure.

## Key Contributions

- **Probabilistic recursive reasoning**: formulates recursive latent computation as a latent-variable generative process with learned stochastic high-level transitions.
- **Width-based inference scaling**: samples multiple parallel latent trajectories and selects the best candidate via majority vote or a Latent Process Reward Model (LPRM).
- **Multi-solution reasoning**: avoids the mode collapse of deterministic RRMs on tasks with many valid solutions.
- **Unconditional generation**: extends the same recursive process to generate structured outputs such as Sudoku boards and binarized MNIST digits.
- **Deep supervision + truncated gradients**: trains with dense supervision signals while propagating gradients only through the final transition of each supervision step for memory efficiency.

## Methodology

GRAM models p(y|x) by marginalizing over stochastic latent reasoning trajectories. An encoder maps input x to a persistent embedding. The latent state z = (h, l) evolves through nested loops:

1. **Inner loop**: the low-level state l is refined K times deterministically for fine-grained computation.
2. **Outer loop**: the high-level state h is updated stochastically as h_t = u_t + epsilon_t, where u_t is a deterministic proposal and epsilon_t is Gaussian noise with learned mean and variance.

Multiple supervision steps stack these transitions, with deep supervision at each step. Training maximizes a trajectory-level ELBO with a variational posterior conditioned on the target y. Inference can scale by depth (more supervision steps, optionally with Adaptive Computation Time) or width (parallel trajectory samples).

## Key Results

- **Sudoku-Extreme**: GRAM reaches 97.0% accuracy versus 87.4% for TRM; with N=20 parallel samples at 16 iterations it beats deterministic baselines at 320 iterations (97.0% vs 90.5% for TRM).
- **ARC-AGI**: GRAM outperforms deterministic recursive baselines (Looped TF, HRM, TRM); frontier LLMs score higher but with much larger training/inference budgets.
- **N-Queens / Graph Coloring**: deterministic RRMs collapse to low solution coverage (at most 36.1%); GRAM reaches 99.7% accuracy and 90.3% coverage on N-Queens 8×8.
- **Unconditional Sudoku generation**: 99.05% valid unique boards from empty input, beating D3PM baselines with fewer parameters and steps.
- **Binarized MNIST**: GRAM matches D3PM quality while deterministic TRM mode-collapses (FID 303.29).
- **Ablations**: learned stochastic guidance is essential; naive noise injection into TRM does not help.

## Connections

- Extends the [[iterative-refinement|iterative refinement]] theme by adding probabilistic multi-trajectory recursion alongside looped transformers, fixed-point models, and energy-based inference.
- Directly compares against TRM and looped transformers; complements [[attractor-models|Attractor Models]], which also targets hard reasoning with compact recursive computation but uses fixed-point refinement rather than stochastic trajectories.
- Related to [[hyperloop-transformers|Hyperloop Transformers]] as another looped/recurrent architecture family, though Hyperloop focuses on language-model pretraining efficiency rather than puzzle reasoning.
- Uses [[ema|EMA]] for training stability, connecting to the wiki's broader debate on EMA as a stabilization mechanism.

## Limitations & Open Questions

> [!open-question]
> Can width-based parallel trajectory sampling be combined with fixed-point attractor refinement or energy-based self-verification for even stronger reasoning?

> [!open-question]
> Does GRAM's sequential deep-supervision training limit scalability to foundation-model sizes compared with highly parallel transformer pretraining?

> [!open-question]
> How should multi-sample inference be calibrated in high-stakes settings where plausible but invalid solutions remain possible?

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2605.19376)
- [arXiv](https://arxiv.org/abs/2605.19376)
- [PDF](https://arxiv.org/pdf/2605.19376)
