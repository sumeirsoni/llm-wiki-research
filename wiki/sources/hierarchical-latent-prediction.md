---
title: "Hierarchical Latent Prediction for Language Models"
type: source
created: 2026-08-11
updated: 2026-08-13
arxiv_id: "2608.05806"
authors:
  - "Chang Shi"
  - "Tim Pearce"
  - "Manan Tomar"
  - "Siddhartha Sen"
  - "John Langford"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.05806"
tags:
  - transformer
  - language
  - self-supervised-learning
  - world-model
  - representation-learning
aliases:
  - "HiLP"
  - "Hierarchical Latent Prediction"
---

# Hierarchical Latent Prediction for Language Models

## Summary

Hierarchical Latent Prediction (HiLP) extends [[next-latent-prediction|NextLat]] with a temporally coarser latent state. A causal sliding-window attention module aggregates recent transformer states, and an auxiliary upper-level dynamics model predicts the next abstract state four positions ahead. Joint lower- and higher-level latent supervision reduces long-horizon rollout error while preserving ordinary next-token inference: all auxiliary modules can be discarded after pretraining. At roughly 1B-parameter scale and 100B training tokens, HiLP improves HumanEval, symbolic and multi-step reasoning, and speculative draft acceptance over next-token, multi-token, and NextLat baselines, at the cost of lower training throughput.

## Key Contributions

- **Hierarchical belief-state supervision**: adds a higher-level state $u_t$ that summarizes a window of lower-level transformer states and is trained to predict $u_{t+k}$ without token input.
- **Two-scale latent dynamics**: retains NextLat-style teacher-forced lower-state rollouts while directly supervising a coarser transition over a longer temporal interval.
- **Disposable training hierarchy**: the sliding-window attention, both latent predictors, and combined token head are auxiliary; standard deployment retains only the backbone and ordinary next-token head.
- **Long-horizon improvement**: reports similar short-horizon latent quality to NextLat but lower future and excess cross-entropy at longer rollout horizons on web and code data.
- **Downstream and decoding gains**: improves HumanEval pass@1 from NextLat's 10.58 to 11.33 and increases average accepted speculative tokens on code from 3.26 to 3.41.

## Methodology

For backbone state $h_t = G_\theta(X_{1:t})$, causal sliding-window attention over the latest $k$ states creates an abstract state:

$$u_t = \operatorname{SWA}(h_{t-k+1:t}).$$

HiLP jointly trains five objectives:

$$\mathcal L = \lambda_{\mathrm{ntp}}\mathcal L_{\mathrm{ntp}} + \lambda_h\mathcal L_h + \lambda_{\mathrm{KL}}\mathcal L_{\mathrm{KL}} + \lambda_u\mathcal L_u + \lambda_{\mathrm{cntp}}\mathcal L_{\mathrm{cntp}}.$$

- **Next-token loss** trains the ordinary backbone head.
- **Lower-level consistency** uses Smooth L1 to match $d$ recursively predicted lower states to stop-gradient backbone states.
- **Token-distribution consistency** applies KL divergence between frozen-head distributions decoded from true and predicted lower states.
- **Higher-level consistency** uses Smooth L1 between the predicted abstract state $\hat u_{t+k}$ and stop-gradient target $u_{t+k}$.
- **Combined next-token loss** trains an auxiliary head on both $h_t$ and a stop-gradient-derived abstract state, giving the upper latent a token-predictive learning signal without duplicating gradients into the backbone.

The main configuration uses window size and abstract lookahead $k=4$, lower rollout evaluation through eight positions, GLU-cross latent fusion, 24 transformer layers, 16 attention heads, sequence length 8,192, and vocabulary size 100,352. Loss weights are 1.0 for ordinary NTP, 10.0 for lower-state prediction, 0.1 for token-distribution KL, 1.0 for upper-state prediction, and 0.5 for the combined head. The four approximately 1B-scale variants are trained on 100B tokens using eight NVIDIA B200 GPUs.

## Key Results

- **HumanEval pass@1**: HiLP 11.33, NextLat 10.58, MTP 9.21, and NTP 8.77, using 1,000 samples per task.
- **DataComp-LM evaluations**: the paper reports gains on symbolic and multi-step reasoning, but the HTML text does not expose exact values from Figure 2.
- **Long-horizon latent quality**: HiLP and NextLat are similar near the rollout origin; HiLP has lower future and excess cross-entropy at longer horizons on web and code splits. Exact curve values are not available in the HTML text.
- **Code speculative decoding**: average accepted tokens are 3.41 for HiLP, 3.26 for NextLat, and 2.57 for MTP; average draft/verifier match is 0.592, 0.580, and 0.545, respectively.
- **Nemotron-ClimbMix speculative decoding**: average accepted tokens are 2.59 for HiLP, 2.57 for NextLat, and 2.11 for MTP; average match is 0.491, 0.483, and 0.162.
- **Training efficiency**: HiLP trains at 81,653 tokens/s/GPU versus 104,505 for NextLat and 126,278 for NTP. HiLP has 1.27B total training parameters, but the retained verifier path is 1.06B for every model.
- **Fusion ablation**: GLU-cross improves NTP loss from 4.113 to 3.942 and reduces step time from 919.5 ms to 818.9 ms relative to concatenation.

## Connections

- Directly extends [[next-latent-prediction|NextLat]] by addressing compounding error in recursively rolled lower-level states with a direct, temporally abstract transition.
- Strengthens the [[world-models|belief-state world model]] view of language transformers: predictive state is supervised at both token-scale and coarser temporal scale.
- Adds an empirical counterpoint to [[learn-from-your-own-latents|Learn from your own latents]], which questions whether explicit hierarchy is necessary for learning multi-scale structure. HiLP shows benefits from explicit temporal hierarchy at 1B scale, but does not compare against a capacity-matched implicit-hierarchy method.
- Fits [[iterative-refinement|iterative latent dynamics]] as a training-time representation-shaping method rather than an inference-time recurrent architecture: the hierarchy improves the backbone even when removed at deployment.
- Partially addresses the state-compression problem in [[topological-trouble-with-transformers|Topological Trouble With Transformers]], but does not prove that a fixed-depth backbone can track unbounded dynamic state.

## Limitations & Open Questions

- The abstract lookahead horizon is manually fixed, limiting adaptability across dependencies with different temporal scales.
- HiLP adds substantial training-only computation: throughput is about 65% of NTP and 78% of NextLat in the reported setup.
- The main evidence is at roughly 1B scale and 100B tokens; transfer to frontier-scale language models remains untested.
- Reported symbolic, multi-step, and latent-cross-entropy figures are not numerically recoverable from the paper's HTML text, limiting exact comparison outside the plotted figures.
- The experiments do not isolate whether gains come primarily from hierarchical state prediction, the auxiliary combined token head, added parameter capacity, or their interaction.

## Future Work

- Dynamically select the abstract lookahead horizon instead of fixing it as a hyperparameter.
- Evaluate the combined next-token head during inference when an accuracy gain may justify additional latency.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.05806)
- [arXiv](https://arxiv.org/abs/2608.05806)
- [PDF](https://arxiv.org/pdf/2608.05806)
- [HTML](https://arxiv.org/html/2608.05806v1)
