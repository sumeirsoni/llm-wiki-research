---
title: "Expanding Flow Maps"
type: source
created: 2026-07-28
updated: 2026-07-28
arxiv_id: "2607.21585"
authors:
  - "Sophia Tang"
  - "Pranam Chatterjee"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.21585"
code_url: "https://github.com/sophtang/ExpandingFlowMaps"
project_url: "https://huggingface.co/ChatterjeeLab/ExpandingFlowMaps"
tags:
  - flow-matching
  - generative-modeling
  - flow-map
  - variable-length-generation
  - graph-generation
  - language
aliases:
  - "EFM"
  - "Expanding Generative Flows"
  - "EFlow"
---

# Expanding Flow Maps

## Summary

Expanding Flow Maps introduces Expanding Generative Flows (EFlows) and their few-step distillation, Expanding Flow Maps (EFMs), for generation when output dimensionality or sequence length is not fixed in advance. The framework replaces the fixed canvas of conventional flows with an expanding interpolant. Each transition first applies an expand operator that inserts conditionally sampled coordinates, graph elements, or tokens, then applies a transport map that denoises the enlarged state. The paper validates this shared construction on continuous molecular conformers, variable-size molecular graphs, and variable-length language generation.

## Key Contributions

- **Expanding generative flows**: defines transport between distributions of increasing dimensionality and formulates it as a piecewise-deterministic Markov process with smooth transport and discrete expansion jumps.
- **Expand-transport factorization**: decomposes a transition from time $s$ to $t$ into conditional noise insertion followed by transport in the enlarged state space.
- **Few-step expanding flow maps**: adapts diagonal and consistency objectives to distill EFlows into one- to four-step EFMs.
- **Continuous and discrete unification**: supports coordinate insertion in Euclidean spaces and learned token or node insertion in discrete simplex spaces.
- **Adaptive output size**: makes dimensionality or length a learned part of generation instead of a canvas fixed at initialization.

## Methodology

### Expanding interpolants and EFlows

An expanding interpolant uses a non-decreasing active dimension $d(t)$. When $d(t)>d(s)$, an expand operator $E_{s,t}$ lifts the state from $\mathbb{R}^{d(s)}$ to $\mathbb{R}^{d(t)}$ by inserting conditional noise according to a placement scheme such as concatenation, positional insertion, or parent-child expansion. Each inserted component receives a local clock based on its insertion time, so recently added dimensions can begin noisy and denoise over their remaining trajectory.

The resulting EFlow combines:

- a transport field trained with conditional flow matching on active dimensions;
- an expansion jump kernel that adds coordinates or discrete elements;
- an insertion intensity or learned insertion rule controlling when and where growth occurs.

This process is characterized as a piecewise-deterministic Markov process. Fixed-dimensional flows are recovered when the expand operator is the identity.

### Expanding Flow Maps

An EFM directly learns a transition $\Phi_{s,t}=X_{s,t}\circ E_{s,t}$, where $E_{s,t}$ expands the state and $X_{s,t}$ transports the expanded state toward the target distribution. Training combines a diagonal objective that matches the underlying EFlow velocity or denoiser with Lagrangian, Eulerian, and semigroup consistency objectives across nonzero time intervals. Because expansion injects conditional noise, the learned map is stochastic rather than a single deterministic trajectory.

### Discrete expansion

For sequences and graphs, an insertion head predicts expected additions in each gap. Sampled counts determine how many latent tokens or nodes to insert, after which a mean denoiser predicts categorical distributions for tokens, node types, and edges. Local time conditioning allows elements inserted at different global times to follow distinct denoising schedules.

The three experiments instantiate expansion differently:

- **Molecular conformers**: heavy atoms are present initially and hydrogens are inserted on a prescribed parent-conditioned schedule; atom count is known, so no learned count head is needed.
- **Molecular graphs**: a learned insertion head grows QM9 graphs while the graph denoiser predicts node and edge categories.
- **Language**: per-gap insertion grows LM1B sentences from empty to variable length while a shared network denoises token identities.

## Key Results

### Molecular conformer generation

On GEOM-QM9 and GEOM-Drugs, 20-step EFlow is competitive with diffusion baselines using 500 to 1,000 denoising steps. A 4-step EFM followed by a 10-step refiner, EFM+R, reports the best values in the paper across all four GEOM-Drugs conformer metrics. The refinement stage is important: few-step EFM alone supplies efficient coarse generation, while the additional denoiser improves local geometry.

### Variable-size molecular graphs

| Method and budget | Validity | Uniqueness | FCD |
| --- | ---: | ---: | ---: |
| EFlow, 4 steps | 91.7% | 92.8% | not highlighted |
| DeFoG, 4 steps | 53.6% | not highlighted | degraded sharply |
| EFM, 1 step | not highlighted | 97.7% | **0.44** |
| Categorical Flow Maps, 1 step | not highlighted | 91.8% | 2.14 |

At 100 steps, EFlow also improves Fréchet ChemNet Distance over DeFoG, 0.116 versus 0.134. The low-step results indicate that learned expansion is more robust than forcing a fixed-canvas graph flow to operate under a very small evaluation budget.

### Variable-length language generation

On LM1B, multi-step EFlow improves generative perplexity over the fixed-length Flow Language Model at every tested budget from 64 to 1,024 steps. At 1,024 steps, EFlow obtains 103.63 generative perplexity versus 111.36 for FLM.

| Method | 1-step PPL | 2-step PPL | 4-step PPL |
| --- | ---: | ---: | ---: |
| EFM | **98.35** | 125.95 | 99.85 |
| FMLM | 119.34 | **110.19** | **98.76** |
| Categorical Flow Maps | 269.72 | 267.39 | 267.97 |

The one-step EFM perplexity is paired with lower entropy and author-reported mode collapse, so it should not be interpreted as uniformly better generation. The paper's stronger qualitative claim is that two- and four-step EFM generates coherent variable-length text and substantially outperforms the evaluated distilled diffusion and categorical-flow-map baselines.

## Connections

- Extends [[flow-matching]] beyond fixed-dimensional transport by allowing the active state space itself to grow during inference.
- Establishes the reusable method family summarized in [[variable-dimensional-generative-flows]].
- Complements [[normalizing-trajectory-models]]: both target efficient few-step generation, but NTM enriches transitions on a fixed canvas while EFM composes state expansion with transport.
- Relates to [[self-flow]] through conditional flow matching, but its objective is adaptive-dimensional generation rather than self-supervised representation learning.
- The stochastic expand operator provides multiple possible continuations from an intermediate state, which the authors identify as potentially useful for posterior sampling and reward alignment.

## Limitations & Open Questions

### Author-stated limitations

- Experiments are limited to GEOM-QM9 with at most 29 atoms, GEOM-Drugs with at most 181 atoms, and LM1B sequences capped at length 128.
- Per-dimension local-time conditioning and the larger family of interpolants increase optimization and scaling difficulty.
- Larger-dimensional experiments were not fully explored because of computational expense.
- One-step language sampling exhibits mode collapse, and sample entropy remains below fixed-length baselines.

### Evaluation caveats

- The conformer experiment uses deterministic insertion schedules and known molecular graphs, so it does not test learned output size in that continuous setting.
- The graph and language experiments use bounded buffers or maximum lengths even though active size is variable within those bounds.
- EFM+R's strongest conformer scores include 10 refinement evaluations beyond the 4-step flow map.
- Results cover three domains but do not yet validate variable-resolution images, arbitrary-duration audio or video, or mixed-modality expansion proposed in the motivation.

> [!open-question]
> Can learned expansion remain calibrated when output sizes are much larger than those seen during training, or when no practical maximum canvas can be allocated?

## Future Work

The authors explicitly propose:

- learning the conditional noise distribution, including parameterized means and covariances, instead of restricting inserted dimensions to fixed Gaussian noise;
- conditioning interpolants on insertion time;
- imposing structure on insertion ordering;
- extending the piecewise-deterministic construction to decreasing dimensionality;
- tuning local-time schedules and conditioning to scale to larger dimensions and improve language entropy and one-step stability.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2607.21585)
- [arXiv](https://arxiv.org/abs/2607.21585)
- [PDF](https://arxiv.org/pdf/2607.21585)
- [GitHub repository](https://github.com/sophtang/ExpandingFlowMaps)
- [Hugging Face models and materials](https://huggingface.co/ChatterjeeLab/ExpandingFlowMaps)
