---
title: "The State-Prediction Separation Hypothesis"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2607.01218"
authors:
  - "Giovanni Monea"
  - "Nathan Godey"
  - "Kianté Brantley"
  - "Yoav Artzi"
year: 2026
venue: "arXiv preprint (cs.CL)"
pdf_path: "https://arxiv.org/pdf/2607.01218"
code_url: "https://github.com/lil-lab/sps"
tags:
  - language
  - transformer
  - representation-learning
  - optimization
  - theory
aliases:
  - "State-Prediction Separation"
  - "SPS Transformer"
---

# The State-Prediction Separation Hypothesis

## Summary

The paper argues that a standard autoregressive Transformer asks each hidden state to perform two competing jobs: predict the next token immediately and persist useful information for later predictions through the key-value cache. The State-Prediction Separation (SPS) Transformer inserts a learned <predict> step after each input token, keeps input-stream activations persistent, and retains prediction-stream activations only in a small sliding window. Across models from 53M to 1.678B parameters, SPS improves validation and held-out performance over standard Transformers and matched extra-compute baselines while keeping inference memory nearly unchanged. The central evidence is mechanistic: future-loss gradients are routed toward the persistent input stream, while immediate prediction gradients concentrate on the ephemeral prediction stream.

## Key Contributions

- **State-prediction separation hypothesis**: identifies present-token prediction and future-state preparation as distinct roles that can interfere when forced through one activation stream.
- **Two-stream Transformer**: interleaves ordinary input tokens $x_i$ with learned <predict> tokens $\rho_i$; only the input-stream KV entries persist indefinitely.
- **Controlled baselines**: compares SPS with a 2x Memory variant that keeps both streams and a Delayed State variant that adds a computation step without separating roles.
- **Gradient-routing analysis**: measures the relative future-loss gradient carried by input and prediction positions and finds the intended specialization.
- **Persistent-state analysis**: shows that restricting the persistent cache harms SPS more than Delayed State, indicating that SPS builds a more useful long-range state rather than merely adding computation.

## Methodology

In SPS, each original token is followed by a learned <predict> token. The input slot reads the current token and contributes persistent keys and values. The prediction slot produces the next-token logits and contributes KV entries only within a bounded window $w$, set to 64 in the main experiments. The model forwards the pair jointly at inference, so one generated token still uses one decode step.

The study uses a pre-normalized, weight-tied Transformer with a 4,096-token context, trained on FineWeb-Edu with the GPT-2 tokenizer. Five scales range from 53M to 1.678B parameters. Standard, SPS, 2x Memory, Delayed State, and Reverse SPS share the same backbone and hyperparameters. Main runs use one matched seed; a three-seed sweep at the S scale tests statistical significance.

The gradient diagnostic compares the norm of gradients from a loss $k$ steps ahead with the gradient from the current loss:

$$
r(p,k)=\frac{\lVert\nabla_{\theta_p}\ell_{i+k}\rVert_2}{\lVert\nabla_{\theta_p}\ell_i\rVert_2}.
$$

The paper also restricts the trained model's persistent state to a 64-entry window and measures the resulting per-position NLL degradation.

## Key Results

- SPS has the lowest FineWeb-Edu validation NLL at every scale. At XL, SPS reaches 2.390 versus 2.458 for Standard; at M, it reaches 2.591 versus 2.648.
- Held-out corpus NLL improves by 0.09 to 0.11 and five-benchmark zero-shot accuracy improves by 2.3 to 3.1 percentage points across scales. At XL, average task accuracy is 66.3% for SPS versus 63.2% for Standard.
- At 1.6B scale, SPS matches a standard Transformer trained on 47B tokens after about 18B pre-decay tokens, a 2.6x token-efficiency result.
- SPS retains roughly the same inference footprint as Standard: peak decode memory is 1.01x and throughput is 0.90x to 0.94x across the reported scales. The 2x Memory baseline uses about 1.75x to 1.81x peak memory and still underperforms SPS.
- Delayed State confirms that an extra computation step helps, but SPS remains better because the state and prediction roles are separated. SPS improves validation NLL over Delayed State by 0.019 to 0.021 at the reported scales.
- SPS's input stream carries more future-loss gradient than Standard at every measured offset, while its prediction stream carries less. Restricting SPS's persistent state hurts NLL 1.4x to 2.2x more than the analogous Delayed State restriction.

## Connections

- [[state-prediction-separation-concept]] files the paper's central architectural distinction and compares it with other ways to preserve state.
- [[iterative-refinement]] treats SPS as a step-recurrent state interface that adds an internal preparation step without making the prediction stream persistent.
- [[topological-trouble-with-transformers]] provides the complementary depth-topology motivation: SPS separates the state carrier instead of relying on a fixed feedforward stack to retain all future-useful information.
- [[full-bandwidth-transformer]] and [[next-latent-prediction]] also add processed-state access across token positions, but remain active at inference in different ways.
- [[lost-in-backpropagation]] is a complementary output-interface diagnosis. SPS separates present and future loss roles inside the Transformer, while the LM-head work studies how vocabulary-space error is compressed before reaching the backbone.

## Limitations & Open Questions

- The main pretraining evidence uses FineWeb-Edu; held-out corpora and zero-shot benchmarks broaden evaluation but do not replace multi-mixture pretraining.
- The largest model is 1.678B parameters. The widening scale trend is suggestive, not evidence at frontier model scale.
- The two streams share all Transformer parameters, so the paper does not test whether stream-specific parameters would add further value.
- Training roughly doubles the sequence length and therefore increases per-token training cost, even though inference latency and persistent KV memory remain close to Standard.
- The paper supports the gradient-routing mechanism through controlled experiments, but does not provide a formal characterization of when role conflation is harmful as a function of depth, width, or data.
- Main results use a single seed, with a three-seed significance check only at the S scale.

> [!open-question]
> Can a narrower or shallower prediction stream, sparse persistent state, or stream-specific parameters retain SPS's separation benefit at substantially lower training cost?

## Future Work

- Verify the trend beyond 1.6B parameters and across alternative pretraining mixtures.
- Reduce the roughly doubled training computation through a smaller prediction stream or more selective state.
- Test distinct attention or feed-forward parameters for the state and prediction streams.
- Develop a formal theory of the capacity and data regimes where present prediction and future-state preparation conflict.

## Links

- [arXiv](https://arxiv.org/abs/2607.01218)
- [HTML](https://arxiv.org/html/2607.01218)
- [PDF](https://arxiv.org/pdf/2607.01218)
- [Code](https://github.com/lil-lab/sps)
