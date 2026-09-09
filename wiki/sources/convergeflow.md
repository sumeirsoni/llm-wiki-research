---
title: "ConvergeFlow: Language Flow with Provable Convergence to Token Embeddings"
type: source
created: 2026-09-09
updated: 2026-09-09
arxiv_id: "2608.23551"
authors:
  - "Na Li"
  - "Yuchen Jiao"
  - "Changxiao Cai"
  - "Gen Li"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.23551"
code_url: "https://github.com/Na-Li66/ConvergeFlow"
tags:
  - flow-matching
  - generative-modeling
  - language
  - representation-learning
  - theory
aliases:
  - "ConvergeFlow"
  - "Embedding-space flow language model"
---

# ConvergeFlow: Language Flow with Provable Convergence to Token Embeddings

## Summary

ConvergeFlow is an embedding-space flow language model that trains a continuous data predictor with mean squared error and does not use a cross-entropy token decoder. The predictor is a weighted average of vocabulary embeddings. The weights include a learned base function and an exact Gaussian corruption kernel. Under positivity, Lipschitz, and time-grid conditions, the paper proves that each flow trajectory converges to a valid token embedding.

## Key Contributions

- Constrains the data predictor to the convex hull of the vocabulary embeddings.
- Proves convergence to a token embedding despite errors in the learned predictor.
- Uses the same structured predictor for flow updates and final token decoding.
- Introduces self-conditioning guidance, iterative self-conditioning refinement, and unconditional guidance to control the quality and diversity trade-off.
- Reports a generative perplexity of 33.17 at unigram entropy 5.44 on OpenWebText.

## Methodology

The model represents a length-$L$ token sequence as a matrix of token embeddings. A flow-matching corruption process creates $x_t = \alpha_t x^\star + \sigma_t z$. The data predictor is trained with the flow-matching mean squared error objective while the embedding matrix stays fixed to the pretrained LangFlow embedding matrix. The paper fixes the embeddings because joint MSE training admits degenerate embedding-collapse solutions.

For each token position, the predictor computes a convex combination of vocabulary embeddings. Each coefficient is the product of a learned positive base weight and an exact Gaussian likelihood term for the observed noisy embedding, normalized over the vocabulary. The learned base weights are not treated as token posteriors. They parameterize a continuous predictor whose output remains in the vocabulary convex hull.

The convergence theorem assumes positive base weights, Lipschitz log-weights along the sampling path, and a time grid whose final point approaches the data endpoint under a bounded step condition. Under these assumptions, each token state converges in probability to one vocabulary embedding. Nearest-neighbor decoding and the largest learned weight are parameter-free alternatives at the endpoint.

Sampling solves the data-prediction ODE with Euler updates from Gaussian noise. Self-conditioning guidance combines unconditional and self-conditioned predictions. Iterative self-conditioning refinement unrolls the self-conditioning recursion for a chosen number of steps. Unconditional guidance adds a second control over the same trajectory. The paper also studies time-adaptive schedules that vary guidance or refinement strength across the flow.

## Key results

The experiments use about 9 billion tokens from OpenWebText packed into sequences of length 1,024. The model follows a 12-layer, 768-wide, 12-head DiT-style Transformer with about 130 million parameters. Training uses AdamW and continues from a LangFlow checkpoint with the embedding matrix fixed. Evaluation generates 1,024 samples and measures generative perplexity with GPT-2 Large and diversity with unigram entropy.

| Model | Generative perplexity | Entropy | Parameters |
| --- | ---: | ---: | ---: |
| Autoregressive Transformer | 35.90 | 5.58 | 170M |
| LangFlow | 60.09 | 5.43 | 130M |
| ELF | 65.30 | 5.40 | 105M |
| ConvergeFlow | 33.17 | 5.44 | 130M |

The embedding-weighted predictor separates its closest token embedding from the second-closest embedding as signal-to-noise ratio rises. The unconstrained predictor does not show the same separation. Weight-based and distance-based token decoding agree at 99.16% to 99.82% of token positions as the number of sampling steps grows from 32 to 512.

On the same checkpoint, continued MSE training lowers generative perplexity while continued cross-entropy training does not show a consistent improvement. Time-adaptive sampling generally improves the generative-perplexity and entropy frontier. Combining self-conditioning guidance with iterative refinement shifts the frontier toward lower perplexity. Adding unconditional guidance mainly moves the operating point along that frontier.

## Connections

- [[continuous-language-modeling]] summarizes continuous language generation and its endpoint problem.
- [[flow-matching|Flow Matching]] connects ConvergeFlow to continuous transport, diffusion, and few-step generation.
- [[latent-reasoning-with-normalizing-flows|NF-CoT]] is a separate continuous language approach that keeps latent reasoning in an autoregressive flow rather than embedding-space token transport.
- [[jepa-paradox-in-language|The JEPA Paradox in Language]] gives a related warning about deterministic latent targets when one context has several valid outcomes.
- [[representation-geometry|Representation Geometry]] records the role of finite vocabulary support and endpoint geometry in decoding.

## Limitations & Open Questions

The theorem is asymptotic and depends on positive base weights, a Lipschitz condition, distinct embeddings, and a restricted time grid. The experiments do not provide a non-asymptotic error bound for the finite Euler solver used in practice.

The embedding matrix remains fixed, and the experiments use one pretrained LangFlow embedding space, one dataset, and a 130M-parameter model. The paper does not test larger models, conditional generation, instruction following, or reasoning tasks. The quality and diversity results also depend on guidance schedules and on GPT-2 Large as the reference model for generative perplexity.

## Future Work

- Learn the token embeddings and data predictor jointly with a non-degenerate continuous objective.
- Extend the convergence analysis to weaker assumptions and finite sampling grids.
- Scale the model and test conditional generation, instruction following, and reasoning.
- Test distillation and higher-order ODE solvers for faster or more accurate language generation.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.23551)
- [arXiv](https://arxiv.org/abs/2608.23551)
- [Code](https://github.com/Na-Li66/ConvergeFlow)
