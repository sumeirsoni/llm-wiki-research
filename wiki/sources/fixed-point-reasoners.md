---
title: "Fixed-Point Reasoners: Stable and Adaptive Deep Looped Transformers"
type: source
created: 2026-07-03
updated: 2026-07-16
arxiv_id: "2606.18206"
authors:
  - "Sajad Movahedi"
  - "Vera Milovanović"
  - "Shlomo Libo Feigin"
  - "Alexander Theus"
  - "Thomas Hofmann"
  - "Valentina Boeva"
  - "T. Konstantin Rusch"
  - "Antonio Orvieto"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.18206"
code_url: "https://github.com/nilskiKonjIzDunava/fprm"
tags:
  - transformer
  - language
  - theory
  - optimization
aliases:
  - "FPRM"
  - "Fixed-Point Reasoning Model"
  - "Fixed-Point Reasoners"
---

# Fixed-Point Reasoners: Stable and Adaptive Deep Looped Transformers

## Summary

FPRM (Fixed-Point Reasoning Model) is a non-hierarchical looped Transformer that halts when hidden states converge to a fixed point, replacing external Adaptive Computation Time (ACT) modules. The key architectural fix: switch from post-norm to **pre-norm with learnable residual scaling** (layer-wise α₁, β₁ and iteration-wise α₂, β₂) to resolve the signal propagation vs. activation boundedness tradeoff in deep looped models. A damped fixed-point optimizer (FPOPT) suppresses oscillatory convergence. At 7M parameters, FPRM reaches 94.2% on Sudoku-Extreme, 87.0% on Maze-Hard, 47.5% pass@2 on ARC-AGI-1, and 98%+ on A₅/S₅ state-tracking at length 128 — outperforming TRM/HRM baselines while adaptively scaling compute to task difficulty.

## Key Contributions

- **Pre-norm + residual scaling for looped Transformers**: theoretically grounded boundedness (Theorem 1) and contractive convergence (Theorem 2) enable stable training at large effective depth where post-norm saturates early and naive pre-norm diverges.
- **Fixed-point halting**: halt when $\|f_\theta(z_i; x) - z_i\|_\infty / (\|f_\theta(z_i; x)\|_\infty + \epsilon) \leq \tau$ — no external ACT module; compute scales with input difficulty.
- **Damped FPOPT**: patience-based step-size decay (Algorithm 1) stabilizes oscillatory fixed-point dynamics (Theorem 3) without changing fixed-points.
- **Truncated BPTT training**: deep supervision with fixed memory via truncated implicit gradients (Proposition 1: O(σ^k) error decay).
- **Hierarchy may be unnecessary**: FPRM matches or beats hierarchical TRM/HRM without fast/slow loops — hypothesis: hierarchy partially compensates for post-norm signal propagation issues.

## Methodology

### Looped recurrence

$$z_{i+1} = f_\theta(z_i; x)$$

where $f_\theta$ is a weight-tied L-layer Transformer block applied repeatedly.

### Pre-norm with residual scaling

Within each block application (layer ℓ = 1, …, 2L):

$$z_\ell = \alpha_1 z_{\ell-1} + \beta_1 f_\ell^\theta(Norm_{pre}(z_{\ell-1}))$$

Between iterations:

$$z_0^{i+1} = \alpha_2 z_{2L}^i + \beta_2 x$$

α₁, α₂ are learnable; initialization with high α₁ and low α₂ works best.

### FPOPT (inference halting)

Damped update: $z \leftarrow \eta \tilde{z} + (1-\eta) z$. Patience mechanism decays η when residual stops improving. Decay rate γ controls compute-accuracy Pareto frontier.

### Training (Algorithm 2)

Outer loop runs until FPOPT detects convergence. Inner loop: K-step truncated BPTT windows with deep supervision cross-entropy; detach z between windows. At inference, k=1.

## Key Results

| Model | Params | Sudoku-Ext. | Maze-Hard | ARC-1 pass@2 | ARC-2 pass@2 |
| --- | --- | --- | --- | --- | --- |
| TRM | 7M | 74.7% | 85.3% | 44.6% | 7.8% |
| HRM | 27M | 55.0% | 74.5% | 40.3% | 5.0% |
| Attractor Model | 7M | 54.3% | 46.7% | — | — |
| **FPRM** | **7M** | **94.2%** | **87.0%** | **47.5%** | **6.2%** |

### Adaptivity

- **State-tracking (A₅, S₅)**: FPRM scales compute smoothly with sequence length; 98.1% A₅ and 98.8% S₅ at length 128. TRM+conv+ACT drops to 65.3% on A₅ despite scaling compute.
- **Sudoku-Extreme**: FPRM adapts effective layers to empty-cell difficulty; more accurate and efficient than TRM with ACT.
- **Depth utilization**: pre-norm + scaling saturates at ~2× the effective depth of post-norm FPRM on Sudoku; gap vs TRM widens at higher compute budgets.

### Signal propagation

- Pre-norm without scaling: activation norms grow exponentially → training diverges at depth.
- Post-norm and pre-norm + scaling: bounded activations; only pre-norm + scaling improves expressivity with depth on state-tracking (identity y=x line).

## Connections

- Directly extends [[iterative-refinement|iterative refinement]] and complements [[attractor-models|Attractor Models]] (Anderson acceleration fixed-point) and [[equilibrium-reasoners|Equilibrium Reasoners]] (attractor landscapes) — FPRM focuses on **signal propagation** and **native fixed-point halting** without hierarchy.
- Contrasts with [[hyperloop-transformers|Hyperloop Transformers]]: both loop depth, but Hyperloop uses hyper-connections for LM perplexity; FPRM targets algorithmic reasoning with adaptive halting.
- Related to [[lotus|LOTUS]]: both use looped Transformers for latent compute; LOTUS targets parallel latent CoT with fixed R and gold-token readout on math LMs, while FPRM targets fixed-point halting on algorithmic tasks.
- Related to [[topological-trouble-with-transformers|Topological Trouble With Transformers]]: looped depth provides explicit recurrence for state-tracking, though FPRM still shows sub-logarithmic scaling on A₅.
- Concurrent with [[attractor-models|Attractor Models]] and [[equilibrium-reasoners|EqR]] — FPRM's contribution is orthogonal (pre-norm + residual scaling, no hierarchical TRM structure).
- Builds on TRM codebase; ablation shows naively swapping FPRM modifications into TRM hurts performance — careful redesign required.

## Limitations & Open Questions

> [!open-question]
> Does FPRM's compositional reasoning on algorithmic tasks transfer to natural language, or is the fixed-point halting mechanism domain-specific?

> [!open-question]
> Is hierarchy in HRM/TRM primarily a signal-propagation workaround, or does it provide irreducible algorithmic structure beyond what single-loop FPRM captures?

> [!open-question]
> Can a latent reasoning architecture achieve logarithmic complexity on state-tracking while remaining Turing-complete?

## Future Work

- Efficient inference-time implementation of adaptive halting so halted samples are removed from the batch immediately rather than waiting for the last sample.
- Theoretical explanation of hierarchy's role in HRM/TRM through the lens of optimization and signal propagation, rather than biological or scratch-pad metaphors.
- Latent reasoning architectures that achieve logarithmic-time state-tracking (vs. the super-logarithmic CoT requirement for A₅) while remaining Turing-complete.
- Demonstrate that compositional reasoning on algorithmic tasks transfers to natural language and other domains beyond the current Transformer-only, algorithmic-task evaluation.

## Links

- [AlphaXiv](https://www.alphaxiv.org/overview/2606.18206)
- [arXiv](https://arxiv.org/abs/2606.18206)
- [PDF](https://arxiv.org/pdf/2606.18206)
- [Code](https://github.com/nilskiKonjIzDunava/fprm)
- [Hugging Face checkpoints](https://huggingface.co/fixed-point-reasoners/fprm)
