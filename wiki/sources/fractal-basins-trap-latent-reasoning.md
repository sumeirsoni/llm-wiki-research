---
title: "Fractal basins trap latent reasoning"
type: source
created: 2026-09-09
updated: 2026-09-09
arxiv_id: "2609.04963"
authors:
  - "Jeffrey Lai"
  - "Anthony Bao"
  - "John Quinn"
  - "William Gilpin"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2609.04963"
code_url: "https://github.com/GilpinLab/loopscape"
tags:
  - language
  - transformer
  - optimization
  - theory
  - representation-learning
aliases:
  - "Fractal reasoning basins"
  - "Reasoning dynamics"
---

# Fractal basins trap latent reasoning

## Summary

Lai et al. model recurrent reasoning as a discrete dynamical system. They vary the initial latent state while holding the model and problem fixed, then measure how many loops each trajectory needs before its decoded solution stops changing. Across Sudoku, mazes, visual puzzles, and mathematical logic, difficult problems produce fractal convergence-time basins. The paper links these basins to transient chaos near weakly unstable saddle points that represent nearly correct but invalid solution attempts.

## Key Contributions

- Shows that basin fractality grows with task difficulty across several reasoning architectures and tasks.
- Uses basin entropy, boundary basin entropy, and the uncertainty exponent to measure basin complexity.
- Connects long reasoning traces to transient chaos caused by trajectories that pass near saddle points.
- Decodes saddle regions as concrete failed attempts, such as maze dead ends and Sudoku grids with repeated digits.
- Tracks a training bifurcation in which incorrect fixed points become saddles as a looped transformer learns to solve finite-field linear systems.

## Methodology

The paper treats the problem statement and model weights as defining a map over latent states. A correct solution is a stable fixed point. The researchers sample random two-dimensional slices through the full initial-state space and run the model from each grid point. They define the settling time as the number of loops before the decoded output stops changing.

The study probes Equilibrium Reasoners on Sudoku-Extreme and maze tasks, Fixed-Point Reasoning Models on Sudoku and mazes, a fine-tuned Parcae model on Countdown arithmetic, and a Tiny Recursive Model on ARC-AGI-1. The supplementary experiments add an Equilibrium Reasoner maze checkpoint and an encoder-only looped transformer for Countdown. Population statistics exclude slices with fewer than 90% successful convergences or more than 1% of points at the loop cap.

The basin entropy averages the Shannon entropy of settling times inside non-overlapping boxes. Boundary basin entropy uses only boxes containing more than one settling time. The uncertainty exponent fits how the fraction of nearby initial-state pairs with different settling times changes with separation. The fast Lyapunov indicator identifies initial states whose nearby trajectories separate before they reconverge.

For trajectory analysis, the authors project latent states with principal component analysis and decode states near high-indicator regions. They also train an encoder-only looped transformer on systems of the form $Ax=b$ over a finite field with $p=3$ and $M=N=8$. They track basin structure, solvability, Jacobian eigenvalues, and finite-time Lyapunov exponents during training.

## Key results

- Harder tasks have higher basin entropy and require more loops on average. The relationship persists across the tested model and task pairings.
- Fast trajectories move directly toward the correct solution. Slow trajectories take indirect routes through weakly unstable saddle regions.
- Saddle states decode to nearly correct solutions. In mazes they include dead ends. In Sudoku they include grids with repeated digits.
- The fast Lyapunov indicator correlates with how often a trace changes its decoded candidate solution before convergence.
- During finite-field training, incorrect stable fixed points lose stability and become saddles near the point where accurate solving first appears. Positive finite-time Lyapunov exponents emerge after this transition, and they occur in the core variables that require multi-step elimination rather than in variables solvable by direct substitution.
- Some models produce scale-free fractals. Others produce slim fractals whose boundary dimension changes with resolution, which the paper relates to dissipative dynamics.

## Connections

- [[reasoning-dynamics]] gives the cross-paper concept page for settling-time basins, transient chaos, and saddle-mediated reasoning.
- [[equilibrium-reasoners|Equilibrium Reasoners]] supplies the attractor-based reasoning model used in the main experiments.
- [[fixed-point-reasoners|Fixed-Point Reasoning Models]] and [[iterative-refinement|Iterative Refinement]] provide related fixed-point and looped-transformer views.
- [[representation-geometry|Representation Geometry]] gains a dynamical test of a latent space: nearby initial states can lead to very different convergence paths even when the final solution is shared.

## Limitations & Open Questions

The paper does not include a separate limitations section. The evidence comes from released recurrent models, selected algorithmic tasks, and two-dimensional probes of much larger latent spaces. A basin map therefore samples the dynamics rather than describing the full basin boundary.

The population analysis removes multistable or non-convergent slices. This is needed for the reported correlations, but it also limits what those correlations say about models that fail to settle. The saddle interpretation relies on decoded intermediate states and trajectory geometry. It does not prove that the same mechanism explains every form of overthinking in large language models.

> [!open-question]
> Do the same basin measurements predict slowdowns in pretrained language models and open-ended tasks where a single correct fixed point is not known?

## Future Work

The paper does not list a separate future-work agenda. Its conclusion points to studying reasoning traces as dynamical systems and to using their basin and saddle structure to understand, control, and optimize inference. Testing other architectures, training objectives, and halting rules follows directly from that aim.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2609.04963)
- [arXiv](https://arxiv.org/abs/2609.04963)
- [Code](https://github.com/GilpinLab/loopscape)
