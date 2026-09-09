---
title: "Dynamic Compression in Recurrent Networks"
type: source
created: 2026-08-25
updated: 2026-08-25
arxiv_id: "2608.17896"
authors:
  - "Jyothish Pari"
  - "Ryan Bahlous-Boldi"
  - "Pulkit Agrawal"
year: 2026
venue: "arXiv preprint (cs.LG)"
pdf_path: "https://arxiv.org/pdf/2608.17896"
code_url: "https://github.com/jyopari/dynamic-compression"
tags:
  - transformer
  - optimization
  - representation-learning
  - theory
aliases:
  - "Dynamic Compression"
---

# Dynamic Compression in Recurrent Networks

## Summary

Recurrent models compress history into a fixed-size state in a single causal pass, so each input must be compressed before the model knows how it will be used - forcing the state to compromise across possible future demands. This paper introduces **dynamic compression**: the model keeps an O(t) raw record of tokens and selectively **revisits** past positions through additional recurrent updates, revising its fixed-size state once a query reveals what matters. On a controlled continual function-reuse task, single-pass models need roughly three orders of magnitude more state going from K=1 to K=3 functions (~3k to ~3M elements), while oracle re-scanning with a ~111k-element state beats single-pass at ~3.1M elements. A self-supervised codebook policy - distilled from the model's own write-strength patterns on a repeated context - recovers most of the oracle benefit without labels. The results demonstrate a computation-memory tradeoff: recurrent models can spend extra compute revisiting history to make far better use of a fixed-size state.

## Key Contributions

- **Problem framing**: identifies the "compress before you know why" bottleneck of single-pass recurrent models; identifying relevant information needs far less memory than storing it at high fidelity
- **Selective re-scanning as writes**: unlike transformer retrieval (a pure read), re-visiting tokens through the recurrence is a new *write* - it changes both what is stored and at what fidelity
- **Oracle analysis**: with ground-truth supervision of which block to re-scan, a small state suffices - scaling exponents with the number of stored functions drop from ~6.1 (single-pass) to ~2.3 (dynamic)
- **Self-supervised selection without labels**: write-strength gate patterns ($\beta$) from a repeat-model second pass are k-means clustered into a codebook of re-scan strategies; a selection head predicts which strategy to apply after seeing the query
- **Two-level memory interpretation** (Discussion): raw sequence storage as lossless long-term memory; recurrent matrix state as task-specialized working memory

## Methodology

- **Architecture**: Gated DeltaNet - matrix state $\mathbf{S}_t \in \mathbb{R}^{d_v \times d_k}$ updated by a gated delta rule with global forgetting gate $\alpha_t$ and key-specific write strength $\beta_t$; $d_v = 2 d_{head}$ (value expansion), state size = $n_{layer} \cdot n_{head} \cdot d_{head}^2 \cdot 2$ with $n_{layer}{=}4$, $n_{head}{=}6$ fixed; only $d_{head}$ varies to set the memory budget
- **Task**: continual function-reuse - a Basis Phase presents K random matrices $\mathbf{A}_i \in \mathbb{R}^{8\times8}$ via b=16 labeled pairs each (overdetermined since b > d), carrying one-hot basis identifiers; a Query Phase gives T query groups of f=4 few-shot pairs (< d, so not learnable from scratch) plus a query input. Few-shot pairs are a *search signal*, not a learning signal
- **Oracle setup**: selection head predicts the basis index; the full b-token basis block is re-scanned through the recurrence before answering
- **Learned pipeline**: train a *repeat model* on sequences where the full prefix is replayed before the query; its final-layer $\beta$ patterns over the 52-token repeat region vary systematically with the queried basis; k-means clusters them into C=3 codes (more clusters yield little further loss reduction), each thresholded to n=21 re-scan positions; the dynamic model trains to predict a code after the few-shot block, then re-scan then answer. At inference no repeated context is needed

## Key Results

- **State savings**: at K=3, oracle dynamic re-scanning with a ~111k-element state reaches lower error than the single-pass model at ~3.1M elements; largest gains under tight memory budgets
- **Scaling**: fitted power-law error exponents vs K: ~6.1 single-pass vs ~2.3 dynamic - selective re-scanning degrades far more gracefully as stored functions grow
- **Four-family comparison** ($d_{head}{=}16$, best validation MSE x $10^{-3}$): single-pass 67.06 ± 95.99 (median 17.4 - mean inflated by one high-variance seed), repeat 1.38 ± 0.44, oracle dynamic 2.30 ± 2.44, codebook dynamic 4.91 ± 1.53. The codebook model sits well below baseline and partway toward the oracle/repeat bounds
- **Selection is easy, application is hard**: the selection head alone identifies the correct basis at near-perfect accuracy with only ~3k state elements
- **Re-scanning changes compression behavior**: first-pass writes are spread evenly across bases; after selection, the model re-writes the chosen basis with much higher strength

## Connections

- Extends [[iterative-refinement|iterative refinement]] with a distinct pattern: instead of refining latent computation in place, the model revisits *raw inputs* to revise *compressed memory* - a computation-memory tradeoff beside the compute-quality tradeoffs of looped or energy-based refinement
- Builds on Just Read Twice (Arora et al., 2024), which closes the recall gap by rereading entire contexts; this work uses the second pass both to recover information and to *derive supervision* for which parts deserve revisiting
- Complements [[recirculation|Recirculation]]: both use extra passes that revise earlier computation, but Recirculation routes layer-to-layer feedback inside frozen transformers while dynamic compression re-reads raw tokens to rewrite a delta-rule RNN's working memory
- Relates to [[full-bandwidth-transformer|Full-Bandwidth Transformer]] as another memory-compute axis around fixed-size state, though FBT feeds processed hidden states forward rather than re-reading raw inputs
- Directly relevant to [[topological-trouble-with-transformers|state tracking]] motivation: a revisitable compressed state offers recurrence with on-demand fidelity rather than ever-deeper feedforward computation
- Concurrent work HOLA augments Gated DeltaNet with an exact KV cache and a retention criterion based on delta-rule magnitude $\beta\lVert e\rVert$; this method instead selectively reprocesses raw tokens through the same recurrence. Memory-growing alternatives (Memory Caching, Log-Linear Attention) relax the fixed-state constraint entirely rather than trading compute for it
- The Basis/Query structure echoes in-context function learning (Garg et al., 2022); [[learn-from-your-own-latents|latent prediction theory]] likewise studies what fixed-size representations must retain

## Limitations & Open Questions

Author-stated (Section 7 Discussion):

> [!open-question]
> Results are from one controlled synthetic setting. Extending to natural-data pretraining raises two open problems: how to parameterize the space of possible re-scans, and how to generate supervision for where to revisit when tasks are not explicitly delineated in the data.

> [!open-question]
> Post-training is proposed as a complementary setting for studying dynamic compression at scale, where task structure is more controlled and reinforcement learning can explore re-scan decisions directly.

> [!open-question]
> The authors pose a broader question beyond memory efficiency: if a model can learn to compress its history more effectively, can scaling this capability also improve generalization?

Wiki-noted caveats:

> [!open-question]
> The codebook (C=3, n=21 positions) is specific to the synthetic setting; generalizable re-scan parameterizations - learned bookmarks, tool-based search, learned relative movements (the authors cite RLNTMs) - remain open.

> [!open-question]
> Keeping the O(t) raw token record assumes storage availability; one dynamic run at K=6 also failed to optimize, showing training instability exists.

## Future Work

Author-stated directions (Section 7):

- Natural-data pretraining with dynamic compression, contingent on solving re-scan parameterization and unsupervised supervision generation
- Post-training / RL settings where re-scan decisions can be explored directly

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.17896)
- [arXiv](https://arxiv.org/abs/2608.17896)
- [GitHub](https://github.com/jyopari/dynamic-compression)
