---
title: "Solve the Loop: Attractor Models for Language and Reasoning"
type: source
created: 2026-05-17
updated: 2026-07-11
arxiv_id: "2605.12466"
authors:
  - "Jacob Fein-Ashley"
  - "Paria Rashidinejad"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.12466"
tags:
  - transformer
  - language
  - theory
  - optimization
aliases:
  - "Attractor Models"
  - "Solve the Loop"
---

# Solve the Loop: Attractor Models for Language and Reasoning

## Summary

Attractor Models introduce a fixed-point architecture for language and reasoning that performs latent refinement in output-embedding space. A standard transformer backbone produces an initial output embedding, then a smaller weight-tied attractor module solves for a fixed point initialized from that meaningful proposal. The goal is to capture the benefits of recurrent or looped computation without unstable training, linear memory growth, or fixed train-time recurrence depth.

## Key Contributions

- **Fixed-point latent refinement**: replaces explicit recurrent unrolling with a root-finding problem in tied output-embedding space.
- **Meaningful solver initialization**: initializes refinement from the backbone's next-token proposal rather than zeros or noise.
- **Persistent proposal injection**: feeds the initial proposal into every attractor step so the equilibrium remains input-dependent.
- **Implicit differentiation**: trains through the fixed point with constant memory in the recurrent block.
- **Equilibrium internalization**: the backbone learns to produce initial embeddings close to the final fixed point, making inference-time refinement minimal or sometimes unnecessary.

## Methodology

The architecture has a tied embedding/unembedding matrix, a causal transformer backbone, and an attractor module. Given input tokens, the backbone produces an initial output embedding y0. The attractor module iterates yt+1 = Ta(yt, y0) and solves for y* such that Ta(y*, y0) - y* = 0, using Anderson acceleration. The fixed-point embedding is decoded with the tied unembedding matrix.

Training uses standard next-token cross-entropy on the fixed-point output. Gradients are computed with implicit differentiation, and the language-model experiments use a one-step approximation to avoid the full linear solve. For small hard reasoning tasks such as Sudoku-Extreme and Maze-Hard, the authors use a phantom-gradient scheme for a stronger training signal.

## Key Results

- At 140M, 370M, and 770M parameters, Attractor Models outperform parameter-matched transformers and Parcae looped language models on validation perplexity, Lambada OOD perplexity, and CORE/CORE-Extended downstream accuracy.
- A 140M Attractor Model reduces validation perplexity by 14.8% and Lambada perplexity by 46.6% compared with a 140M transformer baseline.
- A 770M Attractor Model reaches performance comparable to a 1.3B transformer trained on twice as many tokens.
- Training uses 25-31% fewer FLOPs than Parcae and keeps attractor-block memory nearly constant with solver iterations.
- On Sudoku-Extreme and Maze-Hard, 27M Attractor Models reach 91.4% and 93.1% accuracy, while scaled Tiny Recursive Models collapse and several frontier LLMs fail in the reported setup.

## Connections

- Closely related to [[hyperloop-transformers|Hyperloop Transformers]]: both explore architectural recurrence for language models, but Hyperloop uses explicit parameter-sharing loops while Attractor Models solve an implicit fixed point.
- Complements [[generative-recursive-reasoning|GRAM]]: both target hard reasoning with compact recursive models; Attractor Models use deterministic fixed points while GRAM uses variational stochastic trajectories.
- Related to [[equilibrium-reasoners|Equilibrium Reasoners]] and [[probabilistic-tiny-recursive-model|PTRM]] as alternative attractor/width-scaling approaches to recursive reasoning.
- Connects to [[iterative-refinement|iterative refinement]] as a broader theme spanning recurrent-depth transformers, fixed-point models, and energy-based inference.
- Related to [[energy-based-transformers|Energy-Based Transformers]] in spirit: both turn prediction into refinement rather than a single feed-forward pass, though Attractor Models solve for an activation fixed point rather than minimizing an explicit energy.
- Tangential to the wiki's core [[self-supervised-learning|self-supervised representation learning]] focus, but relevant to representation dynamics because the model appears to internalize iterative computation into the initial embedding.

## Limitations & Open Questions

> [!open-question]
> Why does equilibrium internalization emerge, and does it mean the attractor is mainly a training-time regularizer rather than a test-time reasoning mechanism?

> [!open-question]
> Can attractor-style fixed-point refinement extend to vision, video, or [[world-models|world models]] where iterative latent correction may be useful?

> [!open-question]
> How does the method compare with explicit token-level chain-of-thought on reasoning tasks where intermediate symbolic structure matters?

## Future Work

- Further study the equilibrium internalization phenomenon: why the backbone learns to make inference-time attractor refinement largely unnecessary after training.
- Characterize systematic differences between Attractor Models and finite-loop recurrent architectures in when and how iterative refinement is internalized versus executed at inference.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2605.12466)
- [arXiv](https://arxiv.org/abs/2605.12466)
