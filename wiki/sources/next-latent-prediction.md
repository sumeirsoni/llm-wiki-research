---
title: "Next-Latent Prediction Transformers Learn Compact World Models"
type: source
created: 2026-06-09
updated: 2026-07-11
arxiv_id: "2511.05963"
authors:
  - "Jayden Teoh"
  - "Manan Tomar"
  - "Kwangjun Ahn"
  - "Edward S. Hu"
  - "Tim Pearce"
  - "Pratyusha Sharma"
  - "Akshay Krishnamurthy"
  - "Riashat Islam"
  - "Alex Lamb"
  - "John Langford"
year: 2026
venue: "ICML 2026"
pdf_path: "https://arxiv.org/pdf/2511.05963"
code_url: "https://github.com/microsoft/NextLat"
tags:
  - transformer
  - world-model
  - language
  - self-supervised-learning
  - theory
aliases:
  - "NextLat"
  - "Next-Latent Prediction"
  - "Next Latent Prediction Transformers"
---

# Next-Latent Prediction Transformers Learn Compact World Models

## Summary

Next-Latent Prediction (NextLat) augments standard next-token training with self-supervised latent dynamics: a lightweight MLP predicts the transformer's next hidden state from (h_t, X_{t+1}), with Smooth L1 transition consistency and KL token-distribution alignment losses. Theoretically, optimizing both next-token and transition consistency provably shapes hidden states into belief states — sufficient statistics of history for predicting the future. NextLat improves world modeling, reasoning, and planning while enabling variable-length self-speculative decoding up to 3.3× faster inference.

## Key Contributions

- **Belief-state theory (Theorem 3.2)**: if next-token consistency and transition consistency both hold, transformer hidden states h_t must be belief states — a guarantee absent from standard next-token prediction.
- **Auxiliary latent dynamics model**: 3-layer MLP p_ψ with residual update ĥ_{t+1} = f_ψ(h_t, X_{t+1}) + h_t; used only during training to shape representations, not at inference.
- **Compact world models**: on Manhattan taxi trajectories, NextLat learns coherent internal street maps (vs GPT's incoherent reconstructions) with effective latent rank 52.7 (vs GPT 160.1).
- **Planning and reasoning gains**: near-100% on Path-Star graph planning; 54.8% on Countdown at d=1 (vs GPT 33.1%); strongest long-range linear probe performance on TinyStories.
- **Variable-length self-speculative decoding**: recursively composable latent dynamics enable drafting beyond training horizon d, achieving up to 3.3× inference speedup on language modeling.

## Methodology

NextLat combines three losses on a standard decoder-only transformer:

$$L_{NextLat} = L_{next-token}(\theta) + \lambda_{next-h} L_{next-h}(\theta, \psi; d) + \lambda_{KL} L_{KL}(\theta, \psi; d)$$

- **L_next-token**: standard cross-entropy next-token prediction.
- **L_next-h**: d-step Smooth L1 between teacher-forced hidden states sg[h_{t+i}] and MLP rollouts ĥ_{t+i}.
- **L_KL**: KL divergence between token distributions from predicted vs true hidden states (frozen output head).

Stop-gradients on targets prevent collapse. At inference, the transformer decodes autoregressively as usual; p_ψ enables self-speculative drafting by recursively predicting future hidden states in latent space.

## Key Results

- **Manhattan world modeling (d=8)**: 98.7% valid OOD trajectories (vs GPT 97.0%), 0.71 sequence compression (vs GPT 0.65), effective latent rank 52.7 (vs GPT 160.1, JTP 215.8).
- **Countdown reasoning (d=1)**: 54.8% accuracy vs GPT 33.1%; >35.7% improvement over MTP/JTP at same horizon.
- **Path-Star planning**: near-100% solve rate across G_{2,10}, G_{5,5}, G_{7,7} where BST/JTP/MTP degrade.
- **TinyStories probes**: strongest predictive information up to 20 tokens ahead; matches GPT next-token performance unlike BST/MTP/JTP.
- **FineWeb-Edu (1.3B, 100B tokens)**: avg zero-shot acc 59.21 vs GPT 58.82; better preserved perplexity than MTP/JTP; up to 3.3× speculative decoding speedup.
- **A5 word problem**: co-trained MLP RNN generalizes to 36-token sequences (>95% accuracy) despite transformer failing beyond 12-token training horizon.

## Connections

- Directly addresses [[topological-trouble-with-transformers|Topological Trouble With Transformers]]'s critique that feedforward transformers lack pressure to compress history into dynamic state — NextLat injects recurrent inductive bias via latent transition prediction without changing architecture.
- Complements [[learn-from-your-own-latents|Learn From Your Own Latents]]: both argue latent/next-state prediction provides richer learning signal than token-level objectives.
- Contrasts with [[latent-reasoning-with-normalizing-flows|NF-CoT]]: both use latent-space prediction, but NextLat shapes belief states during pretraining while NF-CoT replaces explicit CoT at inference.
- Manhattan benchmark from Vafa et al. connects to [[world-models|world models]] and [[convergent-world-representations-and-divergent-tasks|Convergent World Representations]] on coherent internal world geometry.
- Emergent RNN generalization parallels [[pretraining-recurrent-networks-without-recurrence|SMT]]'s teacher-student memory training but via parallel co-training rather than explicit memory labels.

## Limitations & Open Questions

> [!open-question]
> Do belief-state guarantees and planning gains transfer to frontier-scale LLMs, or are benefits limited to the controlled benchmarks tested?

> [!open-question]
> Can NextLat be applied as a post-hoc finetuning objective to existing pretrained transformers?

> [!open-question]
> How does NextLat interact with explicit recurrence ([[hyperloop-transformers|Hyperloop]], SSMs) — complementary or redundant?

## Future Work

- Explore more expressive latent dynamics architectures beyond the simple MLP used in all experiments, including how hidden width constrains belief-state capacity.
- Apply NextLat as a post-hoc finetuning objective on pretrained transformers to improve reasoning, planning, and world modeling without retraining from scratch.
- Develop adaptive-length speculative decoding strategies rather than fixed draft lengths.
- Systematically study whether multi-step supervision (d > 1) and KL token-level losses remain necessary at larger model and data scales.
- Investigate richer hierarchical belief states spanning multiple layers or tokens, and whether NextLat-trained representations benefit RL post-training.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2511.05963)
- [arXiv](https://arxiv.org/abs/2511.05963)
- [PDF](https://arxiv.org/pdf/2511.05963)
- [Code](https://github.com/microsoft/NextLat)
