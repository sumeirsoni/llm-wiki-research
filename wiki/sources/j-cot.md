---
title: "J-CoT: Chain-of-Thought in J-Space"
type: source
created: 2026-08-20
updated: 2026-08-20
arxiv_id: "2607.21981"
authors:
  - "Junde Wu"
  - "Jiayuan Zhu"
  - "Fengling Liu"
  - "Minhao Hu"
  - "Jiazhen Pan"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.21981v1"
tags:
  - language
  - transformer
  - representation-learning
  - iterative-refinement
  - reasoning
aliases:
  - "J-CoT"
  - "J-CoT-Zero"
  - "J-CoT-Train"
  - "Chain-of-Thought in J-Space"
---

# J-CoT: Chain-of-Thought in J-Space

## Summary

J-CoT introduces a recurrent reasoning boundary between explicit linguistic chain-of-thought and unrestricted dense latent recurrence. Transformer computation within each cycle remains in ordinary residual space, but cross-cycle information is compressed into a sparse, nonnegative **J-thought** whose coordinates are indexed by vocabulary items. Layer-specific dictionaries map these stable coordinate identities to different dense directions at the read and write layers. On a controlled Qwen3-8B-Base comparison, J-CoT-Train reports the best score on all eight evaluated reasoning and coding tasks and raises the unweighted average from 47.5 for SIM-Coconut to 50.2.

## Key Contributions

- **Vocabulary-indexed recurrent state:** represents cross-cycle information as nonnegative coefficients over vocabulary-associated directions rather than as text or a complete hidden vector.
- **Layer-aware transport:** constructs layer-specific dictionaries by pulling output-unembedding directions backward through an estimated average downstream Jacobian while retaining vocabulary indices as shared addresses.
- **Sparse read-compute-write recurrence:** reconstructs a J-thought at a read layer, applies ordinary dense Transformer blocks, and extracts the next J-thought at a write layer using nonnegative elastic-net regression.
- **Training-free and trained variants:** J-CoT-Zero uses fixed dictionaries and unit-strength read-in; J-CoT-Train learns carrier embeddings and a read gate while freezing the backbone and dictionaries.
- **Adaptive recurrent depth:** stops after two consecutive small normalized state changes or at a fixed cycle cap.

## Methodology

### Recurrent interface

For prompt $x$, frozen backbone parameters $\theta$, optional interface parameters $\phi$, and recurrent state $A_t$, the method defines:

$$
A_t=\mathcal T_{x,\phi}(A_{t-1}),\qquad
\mathcal T_{x,\phi}=\mathsf W_{\ell_w}\circ F_{\theta,x}^{\ell_r:\ell_w}\circ\mathsf R_{\ell_r,\phi},\qquad A_0=0.
$$

Here $\mathsf R$ reads the state into residual space at layer $\ell_r$, $F$ performs ordinary Transformer computation through layer $\ell_w$, and $\mathsf W$ writes the result back into recurrent-state space.

### J-space dictionaries and sparse extraction

At layer $\ell$, the paper estimates an average downstream Jacobian:

$$
J_\ell=\mathbb E_{x,t,t'\ge t}\left[\frac{\partial\widetilde h_{L,t'}}{\partial h_{\ell,t}}\right].
$$

It pulls output-unembedding directions backward through this Jacobian and normalizes each vocabulary-associated column:

$$
\widetilde D_\ell=J_\ell^\top W_U^\top,\qquad
d_{\ell,v}=\frac{\widetilde d_{\ell,v}}{\|\widetilde d_{\ell,v}\|_2+\epsilon}.
$$

A dense activation $h$ is converted to coefficients by nonnegative elastic-net regression:

$$
\Phi_\ell(h)=\arg\min_{a\ge0}\frac12\|h-D_\ell a\|_2^2+\lambda_1\|a\|_1+\frac{\lambda_2}{2}\|a\|_2^2,
\qquad \Psi_\ell(a)=D_\ell a.
$$

The $L_1$ term encourages selective support, $L_2$ stabilizes correlated dictionary directions, and nonnegativity prevents positive-negative cancellation. Transport from layer $\ell$ to $m$ is $\Psi_m\circ\Phi_\ell$.

The coefficient-recovery defect is

$$
\varepsilon_\ell(a)=\|\Phi_\ell(\Psi_\ell(a))-a\|_2.
$$

Proposition 1 bounds multi-hop transport error by the initial extraction error plus accumulated recovery defects. The result is conditional: it does not establish that these defects stay small for arbitrary recurrent states.

### Carriers and recurrent cycle

A J-thought is $A_t\in\mathbb R_{\ge0}^{M\times|\mathcal V|}$, with one coefficient row per carrier position. Carriers are appended after the prompt, attend to the prompt and one another, receive no language-modeling targets, and are not decoded. The prompt-conditioned carrier baseline is cached once.

Each cycle computes:

$$
C_t^r=B_x^r+G_\phi^r(B_x^r,A_{t-1})\odot\Psi_{\ell_r}(A_{t-1}),
$$

$$
Z_t^w=F_{\theta,x}^{\ell_r:\ell_w}(C_t^r),\qquad A_t=\Phi_{\ell_w}(Z_t^w).
$$

The default stopping statistic is

$$
r_t=\frac{\|A_t-A_{t-1}\|_F}{\|A_t\|_F+\|A_{t-1}\|_F+\epsilon},
$$

with stopping when $r_t<0.02$ for two consecutive cycles or after eight cycles. The final carriers are processed through the remaining Transformer layers and provide a fixed key-value prefix for ordinary autoregressive answer generation.

### Experimental setup

The main controlled study uses Qwen3-8B-Base with 36 layers, hidden size 4,096, eight carriers, read layer 12, write layer 28, $\lambda_1=0.05$, and $\lambda_2=10^{-3}$. Dictionaries are calibrated from 1,000 pretraining-like sequences of 128 tokens. J-CoT-Train learns carriers and a two-layer gate with bottleneck width 256 for 10,000 AdamW steps while freezing the backbone and dictionaries.

Evaluation uses greedy single-solution decoding without retrieval, tools, self-consistency, external verification, or execution-guided repair. Benchmarks are GSM8K, MATH-500, AIME 2024, GPQA-Diamond, HumanEval+, MBPP+, LiveCodeBench, CRUXEval, and ProsQA. Baselines include standard CoT, Plan-and-Solve Plus, Coconut, CODI, and SIM-Coconut.

## Key Results

### Eight-task comparison

Table 1 reports percentages averaged over three seeds on a shared Qwen3-8B-Base setup.

| Benchmark | SIM-Coconut | J-CoT-Zero | J-CoT-Train |
| --- | ---: | ---: | ---: |
| GSM8K | 84.0±0.5 | 84.3±0.6 | **86.1±0.4** |
| MATH-500 | 50.4±0.9 | 51.0±0.8 | **54.0±0.7** |
| AIME 2024 | 7.8±3.2 | 7.8±3.5 | **10.0±3.0** |
| GPQA-Diamond | 35.5±1.0 | 36.0±1.1 | **38.0±0.9** |
| HumanEval+ | 59.8±0.9 | 60.2±0.8 | **62.6±0.7** |
| MBPP+ | 64.5±0.7 | 65.0±0.6 | **67.1±0.5** |
| LiveCodeBench | 21.0±0.8 | 21.5±0.7 | **23.8±0.6** |
| CRUXEval | 56.6±0.7 | 57.2±0.7 | **59.8±0.6** |
| **Average** | 47.5±1.1 | 47.9±1.1 | **50.2±0.9** |

J-CoT-Train is numerically best on every task and improves the average over SIM-Coconut by 2.7 points. J-CoT-Zero reaches 47.9 without interface-specific training, versus 47.5 for SIM-Coconut and 45.8 for standard CoT. The paper does not report significance tests or confidence intervals.

### Model and recurrence scaling

Figure 2 reports that increasing both model capacity and cycle budget improves performance. Exact values stated in the text include:

- MATH-500, Qwen2.5-7B: 27.4 at up to 4 cycles and 38.5 at up to 16, a gain of 11.1 points.
- MATH-500, Llama-3.1-405B: 45.0 to 63.4, a gain of 18.4 points.
- LiveCodeBench, Qwen2.5-7B: 7.1 to 13.0, a gain of 5.9 points.
- LiveCodeBench, Llama-3.1-405B: 16.8 to 30.4, a gain of 13.6 points.

Exact numbers for all intermediate models and eight-cycle settings are not printed and should not be inferred from the plot.

### Dense-to-J-space-to-language spectrum

On ProsQA in Figure 3:

- dense latent recurrence: 84.0%;
- J-space recurrence: **88.8%**;
- explicit linguistic recurrence: 79.0%.

J-space is 4.8 points above the dense endpoint and 9.8 points above the linguistic endpoint within the paper's interpolation family.

### Ablations

Table 2 averages MATH-500, AIME 2024, HumanEval+, and ProsQA.

| Variant | Average | Change from full |
| --- | ---: | ---: |
| Without J-Thought Reading | 49.5 | -4.4 |
| Learned Latent State | 50.9 | -3.0 |
| Learned Transport Adapter | 51.5 | -2.4 |
| Single J-Thought Carrier | 51.8 | -2.1 |
| No Inter-Carrier Attention | 52.6 | -1.3 |
| Fixed-Size J-Thought, $k=6$ | 53.0 | -0.9 |
| Full J-CoT | **53.9** | 0 |

The ablations support persistent state read-in, canonical J-space transport, multiple interacting carriers, and adaptive support. No per-dataset ablation values or uncertainty estimates are reported.

## Connections

- Extends [[iterative-refinement]] with a recurrent boundary that is neither decoded text nor an unrestricted full hidden state.
- Closely complements [[lotus|LOTUS]]: both retain a language-linked latent interface, but LOTUS supervises padded latent blocks through the LM head while J-CoT transports vocabulary-indexed coefficients between cycles.
- Contrasts with [[latent-reasoning-with-normalizing-flows|NF-CoT]], which models a probability distribution over continuous thoughts with exact likelihoods rather than a sparse deterministic recurrent state.
- Contrasts with [[full-bandwidth-transformer]]: full-bandwidth recurrence forwards a complete top-layer state, whereas J-CoT imposes a vocabulary-indexed bottleneck.
- Relates to [[attractor-models|Attractor Models]] through repeated computation near the vocabulary interface, but uses finite cycles rather than an explicit fixed-point objective.
- Creates a useful tension with [[on-policy-representation-distillation|OPRD]] and [[lm-head-gradient-bottleneck]], which emphasize information in hidden states that output-facing projections may not preserve.
- Adds vocabulary-aligned recurrent coordinates as a new case for [[representation-geometry]].

## Limitations & Open Questions

The authors do not provide a dedicated limitations section. They label v1 as a **work in progress**, condition the transport argument on small recovery defects, and do not claim that vocabulary-coordinate labels prove faithful human interpretability. Controlled comparisons exclude retrieval, tools, self-consistency, verifiers, and execution-guided repair.

A major reproducibility caveat is that v1 refers to appendices for the transport proof, Jacobian estimator, dictionary calibration, elastic-net solver, implicit differentiation, stopping algorithm, contamination filtering, baseline optimization, checkpoints, software, hardware, and complete evaluation rules, but those appendices are absent from the released HTML/PDF.

> [!open-question]
> **Inferred:** How much useful hidden-state information is discarded by routing recurrence through vocabulary-indexed coordinates, and does J-space inherit rank or null-space limitations from the output interface?

> [!open-question]
> **Inferred:** Can dictionary construction and per-cycle elastic-net inference be made memory- and latency-efficient enough for deployment?

> [!open-question]
> **Inferred:** How sensitive are results to read/write layer selection, stopping thresholds, calibration data, language, and task domain?

> [!open-question]
> **Inferred:** Are J-thought coordinates causally faithful enough for interpretation, and how does J-CoT combine with retrieval, execution, verification, or self-consistency?

## Future Work

Author-stated directions are:

- investigate model-native recurrent interfaces between fully verbalized and fully dense intermediate states;
- test whether J-CoT's gains continue for future larger-capacity models;
- study more deeply how model capacity interacts with recurrent reasoning depth.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2607.21981)
- [arXiv](https://arxiv.org/abs/2607.21981)
- [HTML](https://arxiv.org/html/2607.21981v1)
- [PDF](https://arxiv.org/pdf/2607.21981v1)
