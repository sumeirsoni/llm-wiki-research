---
title: "Lost in Backpropagation: The LM Head is a Gradient Bottleneck"
type: source
created: 2026-08-14
updated: 2026-08-14
arxiv_id: "2603.10145"
authors:
  - "Nathan Godey"
  - "Yoav Artzi"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2603.10145v2"
tags:
  - language
  - transformer
  - optimization
  - theory
  - representation-learning
aliases:
  - "Lost in Backpropagation"
  - "The LM Head is a Gradient Bottleneck"
---

# Lost in Backpropagation: The LM Head is a Gradient Bottleneck

## Summary

The paper argues that the standard language-model head is not only a softmax expressivity bottleneck but also a backward optimization bottleneck. Cross-entropy produces a vocabulary-space error that can have rank near the vocabulary size, while a width-$D$ output head transmits only a $D$-dimensional view of that error to the backbone. Across several model families, the authors measure 95-99% of the logit-gradient Frobenius norm in directions annihilated by the head transpose, and controlled pretraining experiments associate higher head rank with substantially faster convergence. These measurements diagnose compression of the gradient norm, not an equivalent loss of useful learning information, and the paper does not demonstrate a successful replacement head.

## Key Contributions

- **Backward bottleneck formulation**: distinguishes the classical rank limit on representable output distributions from compression of the training signal propagated into hidden states.
- **Rank-constrained update analysis**: shows that a first-order logit update produced by jointly changing hidden states and a linear output matrix has rank at most $2D$, while the desired vocabulary-space error can approach rank $V-1$.
- **Gradient-compression diagnostics**: introduces the destroyed-gradient ratio and projected-gradient cosine to measure how much logit-gradient norm and direction survive projection through the LM head.
- **Cross-family evidence**: measures the bottleneck in GPT-2, Pythia, Llama 3/3.1, OLMo 2, and Qwen3-Base models.
- **Controlled optimization evidence**: varies output rank in approximately 2B-parameter pretraining and varies vocabulary-to-width ratio in the synthetic SpamLang task to separate representational capacity from trainability.

## Methodology

For $C$ contexts, vocabulary size $V$, hidden width $D$, hidden states $H \in \mathbb{R}^{C \times D}$, and output weights $W \in \mathbb{R}^{V \times D}$, the logits are

$$L = HW^\top,$$

so $\operatorname{rank}(L) \leq D$. If $P = \operatorname{softmax}(L)$, $\tilde N$ is the empirical next-token distribution, and $f$ contains context frequencies, the logit gradient is

$$G = \nabla_L \mathcal{L} = \operatorname{diag}(f)(P - \tilde N),$$

while the signal reaching the hidden states is

$$\nabla_H \mathcal{L} = GW.$$

The paper derives $\operatorname{rank}(\Delta L) \leq 2D$ for the first-order logit update induced by jointly updating $H$ and $W$. It then compares this realizable update channel with the singular spectrum of $G$, whose rank can grow toward $V-1$ as a batch contains more distinct observed continuations.

Let $K = \ker(W^\top)$. The destroyed-gradient ratio is

$$r_{\mathrm{destroyed}} = \frac{\|P_K(G)\|_F}{\|G\|_F},$$

and the visible component is $G_{\mathrm{visible}} = P_{K^\perp}(G)$. The projected-gradient cosine is

$$c_{\mathrm{visible}} = \frac{\langle G, G_{\mathrm{visible}}\rangle_F}{\|G\|_F\|G_{\mathrm{visible}}\|_F}.$$

Empirically, the authors analyze gradient compression on 10,000 shuffled FineWeb documents, numerical and effective gradient rank on Pythia with the Pile, equal-norm update directions on FineWeb, controlled rank-factorized heads trained for about 11B FineWeb-Edu tokens, and SpamLang sequences that repeat a single sampled symbol.

## Key Results

- Across the evaluated model families, **95-99% of logit-gradient Frobenius norm** lies in $\ker(W^\top)$ and is removed before reaching preceding layers.
- The surviving projection has a reported cosine with the original gradient mostly around **0.1-0.3**. Both norm loss and misalignment generally improve as hidden width increases.
- Gradient compression remains nearly constant across intermediate OLMo2-1B checkpoints, suggesting it is not confined to initialization or late training.
- In batches up to 500,000 tokens, logit-gradient rank rises rapidly toward the vocabulary limit. Fewer than 1,000 components capture about 70% of the norm, but recovering 99.9% can require as many as 30,000 components.
- In controlled approximately 2B-parameter pretraining with head ranks from 32 to 4096, the rank-4096 model reaches the rank-32 model's final loss after about **700M rather than 11B tokens**, reported as a **16x convergence-speed difference**. A downstream gap of **+0.55 average points** remains between ranks 2048 and 4096.
- On SpamLang, increasing $V/D$ makes training progressively harder, and some large-vocabulary settings fail to converge within the tested learning-rate range even though a width of at least two can represent the task's top-1 mapping.
- Equal-norm logit updates induced through hidden-state gradients reduce loss orders of magnitude less efficiently than updates along the direct logit gradient. Curves for models with the same hidden width nearly coincide despite different total parameter counts.

## Connections

- [[lm-head-gradient-bottleneck]] separates the paper's backward optimization mechanism from the classical softmax expressivity bottleneck.
- [[representation-geometry]] supplies a geometric view: the head selects a narrow vocabulary-space subspace, and both the removed norm and alignment of the surviving component matter.
- [[on-policy-representation-distillation|OPRD]] identifies a complementary observability problem. OPRD shows that output-space supervision cannot distinguish hidden-state directions in the head's null space, while this paper studies vocabulary-space error directions that cannot propagate backward through the head. This comparison is wiki synthesis; the paper does not study distillation.

## Limitations & Open Questions

- The rank results establish unavoidable compression, but rank alone does not determine practical severity because discarded singular directions may carry little useful signal.
- The 95-99% figure concerns Frobenius norm in vocabulary space, not the percentage of downstream learning utility destroyed.
- Controlled pretraining varies total parameter count from roughly 1.8B to 2.0B. The authors argue that this is too small to explain the observed gap, but it remains a confound.
- SpamLang conclusions are limited to the tested model, vocabulary sizes, and learning-rate range.
- Several theoretical results rely on an expressive deterministic backbone and, for mini-batches, uniqueness, density, connectivity, or near-convergence assumptions.
- The experiments diagnose the bottleneck but do not show that the same convergence multiplier holds at frontier scale.
- Preliminary orthogonality regularization, update-alignment loss, and feedback-alignment attempts all converge more slowly, leaving the mitigation question unresolved.

> [!open-question]
> Which parts of the discarded high-rank tail contain task-relevant credit rather than redundant or low-value error?

> [!open-question]
> Can an output mapping preserve more useful gradient information without making vocabulary projection or decoding prohibitively expensive?

## Future Work

The authors identify the following directions:

- Design output mappings whose Jacobians preserve more gradient information and have better conditioning.
- Develop preconditioning or optimization methods that explicitly account for high-dimensional logit error.
- Revisit softmax alternatives from the perspective of backward gradient flow rather than output expressivity alone.
- Incorporate hidden width, not only parameter count and token count, into language-model scaling analyses.
- Release the paper's code, data, and checkpoints, which are described as forthcoming rather than currently available.

## Links

- [arXiv](https://arxiv.org/abs/2603.10145v2)
- [HTML](https://arxiv.org/html/2603.10145v2)
- [PDF](https://arxiv.org/pdf/2603.10145v2)
