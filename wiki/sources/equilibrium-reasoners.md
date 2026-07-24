---
title: "Equilibrium Reasoners: Learning Attractors Enables Scalable Reasoning"
type: source
created: 2026-05-20
updated: 2026-07-11
arxiv_id: "2605.21488"
authors:
  - "Benhao Huang"
  - "Zhengyang Geng"
  - "Zico Kolter"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.21488"
tags:
  - transformer
  - language
  - theory
  - optimization
aliases:
  - "EqR"
  - "Equilibrium Reasoners"
---

# Equilibrium Reasoners: Learning Attractors Enables Scalable Reasoning

## Summary

Equilibrium Reasoners (EqR) frame iterative reasoning models as learned dynamical systems whose latent trajectories converge to task-conditioned attractors. The paper identifies training and inference interventions—Segmented Online Training, randomized initialization, noise injection, and adaptive halting—that shape attractor landscapes and enable scalable depth/breadth test-time compute without external verifiers.

## Key Contributions

- **Attractor-based theory**: explains test-time scaling in HRM/TRM-style models via stable fixed points aligned with correct solutions.
- **Segmented Online Training (SOT)**: interleaves parameter updates with trajectory segments, critical for depth scaling (Sudoku 47.1% → 74.7%).
- **Landscape shaping**: Randomized Initialization (RI) and Noise Injection (NI) improve baseline accuracy and raise the scaling ceiling.
- **Two-axis inference scaling**: depth (iterations) and breadth (parallel restarts); Top-1 convergence by fixed-point residual beats majority vote.
- **Adaptive Computation Time**: reduces average NFE by 17× at D=1024 with minimal accuracy loss.

## Methodology

EqR builds from weight-tied iterative updates z_{k+1} = f_θ(z_k; x) with hierarchical high/low states (HRM/TRM structure), truncated gradients, and deep supervision. Key additions:

- **SOT**: apply loss and optimizer step at segment boundaries rather than only at trajectory end.
- **RI**: sample initial latent states from an input-conditioned distribution.
- **NI**: inject Gaussian noise each iteration with damping.
- **Inference**: scale depth D and breadth B (NFE = D × B); select outputs by smallest fixed-point residual ||f_θ(z) - z||.

Evaluated on Sudoku-Extreme and Maze-Unique (unambiguous shortest paths, unlike ambiguous Maze-1k).

## Key Results

- Feedforward Sudoku baseline: 2.6%; weight-tied iterative: 32.6%.
- EqR baseline (D=16, B=1): Sudoku 86.4%, Maze 82.2% vs 84.8%/44.9% without shaping.
- Full scaling (D=64, B=128): Sudoku 99.8%, Maze 93.0%.
- Fixed-point residual becomes a reliable correctness proxy after landscape shaping.
- Ambiguous labels (Maze-1k) prevent stable attractor learning; unique-path Maze-Unique is essential.

## Connections

- Mechanistic companion to [[attractor-models|Attractor Models]] and [[probabilistic-tiny-recursive-model|PTRM]] within [[iterative-refinement|iterative refinement]].
- Contrasts with [[generative-recursive-reasoning|GRAM]]: EqR shapes deterministic attractors during training, while GRAM uses variational stochastic trajectories.
- Shares authors with [[representation-frechet-loss|Representation Fréchet Loss]] (Zhengyang Geng); both concern scalable generative/reasoning systems.
- Ambiguous-task findings connect to [[convergent-world-representations-and-divergent-tasks|Convergent World Representations and Divergent Tasks]]: task definition affects whether shared representations remain coherent under adaptation.

## Limitations & Open Questions

> [!open-question]
> Do EqR attractor diagnostics transfer to language-model reasoning beyond algorithmic puzzles?

> [!open-question]
> Can convergence-residual selection replace learned Q-heads in PTRM-style inference?

## Future Work

- Conduct a more systematic study of initialization priors in iterative reasoning models, including alternative parameterizations, architectures, objectives, and regularization strategies beyond the zero-mean Gaussian RI baseline.
- Extend path-stochasticity and landscape-shaping analyses to determine which noise-injection and initialization designs generalize across reasoning tasks and model families.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2605.21488)
- [arXiv](https://arxiv.org/abs/2605.21488)
