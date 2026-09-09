---
title: "Full-Bandwidth Transformer"
type: source
created: 2026-08-13
updated: 2026-08-13
arxiv_id: "2608.08888"
authors:
  - "Xi Wang"
  - "Ziyang Cai"
  - "Zheng Zhan"
  - "Harry Dong"
  - "Ying Fan"
  - "Gustavo de Rosa"
  - "Tim Pearce"
  - "John Langford"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.08888"
tags:
  - transformer
  - language
  - generative-modeling
  - optimization
aliases:
  - "Full-bandwidth transformer"
  - "FB Transformer"
  - "Latent feedback"
---

# Full-Bandwidth Transformer

## Summary

The Full-Bandwidth Transformer adds latent feedback to an otherwise conventional decoder-only transformer: the previous position's top-layer hidden state is gated by the current token embedding and returned to the bottom of the stack. This gives generated positions access to a fully processed recurrent signal while retaining standard transformer blocks, the language-modeling objective, and KV-cache organization. Multi-pass parallel training approximates the sequential recurrence. At 1B scale through 400B unique training tokens, the paper reports improved validation loss, language understanding, math, code, and instruction-tuned performance, often approaching standard models trained on more unique tokens. These token-count comparisons are not compute-matched because feedback training uses extra passes.

## Key Contributions

- **Latent feedback**: recurrently injects the previous top-layer state at the next token rather than discarding it after decoding.
- **Architecture-compatible recurrence**: leaves attention blocks and KV-cache format unchanged and adds only two learned hidden-width matrix multiplications per generated token.
- **Temporal-parallel training**: uses repeated whole-sequence passes, with shifted hidden states from one pass feeding the next, to train recurrent behavior without serial token unrolling.
- **Multiple inference modes**: distinguishes standard decoding, soft feedback on generated positions, and fused decoding with an extra recurrent prompt pass.
- **Depth-stability interventions**: progressive pass mixtures and prefix mixin support recurrence beyond the depths used on most training batches.

## Methodology

At generated position $t$, token embedding $e_t$ gates the previous top-layer hidden state $h_{t-1}^L$:

$$e_t \otimes h_{t-1} = W^U h_{t-1}\odot\sigma(W^G e_t).$$

The hidden state supplies the value path, the token embedding supplies a multiplicative gate, and the fused input remains at model width. The method deliberately omits a direct additive embedding shortcut, making the returned latent mandatory. Only the latest top-layer state is carried outside the ordinary KV cache.

Training applies one to three full-sequence passes. The first pass is standard teacher-forced next-token prediction; each later pass shifts the preceding pass's top-layer states right, fuses them with original token embeddings, and predicts all positions in parallel. Gradients flow through earlier passes. The training recipe progressively mixes pass depths, uses a random unfused prefix followed by a fused suffix ("prefix mixin"), and applies fused-input normalization, depth scaling, hidden-state jitter, and equal ordinary/feedback loss weighting.

The reported model has about 1B parameters, 24 layers, width 1,536, context length 8,192, sliding-window attention in most layers, and full attention every sixth layer. Reported feedback training budgets range from 10B to 400B unique tokens, with token-equivalent compute up to 512B at the 400B setting.

## Key Results

- **Prompt refinement**: a 100B-token feedback model with two additional prompt passes reaches the reported 200B-token standard baseline; the analogous 200B feedback model reaches the 400B standard baseline.
- **Zero-shot evaluation**: for the 200B feedback checkpoint, one prompt-feedback pass raises the selected-task average from 52.66 to 53.58.
- **Base-model generation**: at 200B tokens, soft feedback raises MATH-500 from 0.27 to 0.37, HumanEval from 0.31 to 0.34 under the strongest reported setting, and MBPP from 0.38 to 0.40.
- **Instruction-tuned 400B model**: fused feedback obtains 71.80 on GSM8K pass@1, 48.40 on MATH-500 pass@1, 47.60 on HumanEval pass@3, and 41.70 on MBPP pass@3. Results approach but do not uniformly exceed the standard 1T-token baseline.
- **Serving overhead**: the authors report two extra width-by-width matrix multiplications and less than 1% added per-token decoding overhead; fused prompt mode approximately doubles prefill work.
- **Recurrence stability**: replacing 3% of batches with three-pass training stabilizes repeated prompt feedback through 30 passes, with an appendix test extending to 1,000 passes.
- **Representation probes**: recurrent prefilling makes delayed-memory and completion-tracking state nearly perfectly linearly decodable at layer 0, unlike ordinary embeddings in the probe setup.
- **Reasoning length**: base-model feedback can produce shorter solutions at equal or higher accuracy, but the effect disappears after instruction tuning.

## Connections

- Offers a direct architectural response to [[topological-trouble-with-transformers|Topological Trouble With Transformers]]: processed deep state is returned to shallow layers at the next position rather than racing upward through a fixed stack.
- Adds an inference-time recurrent counterpart to [[next-latent-prediction|NextLat]] and [[hierarchical-latent-prediction|HiLP]], which shape recurrently useful representations through auxiliary pretraining objectives but retain ordinary autoregressive inference.
- Complements [[pretraining-recurrent-networks-without-recurrence|Supervised Memory Training]]: both parallelize training for recurrent deployment, but full-bandwidth training backpropagates through a small number of recurrent passes while SMT supplies teacher-generated memory targets and one-step transition supervision.
- Extends [[iterative-refinement|iterative refinement]] across token positions rather than repeatedly refining one fixed query state; optional recurrent prompt passes also expose a depth-scaling mode.

## Limitations & Open Questions

- Evaluation is limited to 1B-parameter models, so larger-scale stability and quality are unestablished.
- Pass-depth scheduling is heuristic, and the paper calls for more principled convergence criteria.
- Multi-pass training consumes more compute and memory because later-pass gradients flow through earlier passes; comparisons by unique training tokens are not compute-matched.
- Extra prompt passes increase prefill cost, and latent feedback adds no information not already determined by the context.
- The mechanism does not provide an overwrite-style mutable register or change asymptotic autoregressive depth.
- Linear decodability of recurrent state does not prove that the output computation causally uses that state.
- The reported 10B-token three-pass configuration is assigned 40B token-equivalent compute, an accounting detail not explained in the source.

## Future Work

The authors propose:

- Testing latent feedback at larger model scales.
- Systematically ablating when and how long recurrence is trained.
- Selecting feedback-pass counts using convergence diagnostics.
- Using on-policy post-training under feedback decoding to preserve concise reasoning.
- Combining latent feedback with multi-token, joint-token, or [[next-latent-prediction|next-latent]] objectives.
- Studying alternative hidden-state injection locations and more principled pass schedules.

## Links

- [arXiv](https://arxiv.org/abs/2608.08888)
- [PDF](https://arxiv.org/pdf/2608.08888)
- [HTML](https://arxiv.org/html/2608.08888v1)
