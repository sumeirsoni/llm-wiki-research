---
title: "Bridging the Gap Between Latent and Explicit Reasoning with Looped Transformers"
type: source
created: 2026-07-16
updated: 2026-07-16
arxiv_id: "2606.31779"
authors:
  - "Ying Fan"
  - "Anej Svete"
  - "Kangwook Lee"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.31779"
tags:
  - transformer
  - language
  - optimization
aliases:
  - "LOTUS"
  - "Looped Transformers with parallel supervision on latents"
---

# Bridging the Gap Between Latent and Explicit Reasoning with Looped Transformers

## Summary

LOTUS (Looped Transformers with parallel supervision on latents) combines a **padded looped Transformer** with **direct, parallel gold CoT supervision** on latent blocks. Unlike sequential latent-CoT methods (Coconut, CODI, SIM-CoT) that retain token-by-token bottlenecks, or methods that ground latents only via distillation, LOTUS refines a fixed-width latent prefix over R weight-tied iterations and reads each block through the base LM head against step-aligned CoT tokens. On Llama-3.2-3B-Instruct it reaches 70.0% GSM8K (within 1.5 points of explicit CoT at 71.5%), outperforming prior latent methods while cutting thought-phase latency ~2.5× (up to ~6.9× on longer natural-language CoT).

## Key Contributions

- **Parallel latent CoT via looping**: fixed K×c latent tokens refined over R iterations with shared KV cache for the question prefix — multi-step reasoning without decoding intermediate tokens.
- **Direct step-aligned supervision (L_step)**: post-loop hidden states are scored by the same LM head as the answer against gold CoT tokens in parallel (Parallel Chain Likelihood), addressing the lack of position-aligned grounding in prior latent methods.
- **Complementary answer loss (L_ans)**: answer next-token prediction conditioned on post-loop latents enforces global coherence; both losses are necessary.
- **LOTUS-aux**: optional auxiliary decoder for per-iteration CoT supervision; competitive at 3B but less robust at smaller scales.
- **Scale-stable latent CoT**: first latent method to approach explicit CoT at 3B; gap does not widen with model size as in prior latent baselines.
- **Interpretable latents**: LM-head readout recovers gold CoT (70.9% top-1) and places mass on unseen-but-valid intermediate numbers.

## Methodology

Input layout: `[Q, BoT, latent blocks (K×c shared latent tokens), EoT, A]`. Default: K=6, c=25 (Llama), R=6.

1. Cache KV for `[Q, BoT]`.
2. Iterate R times: `h^(0) = f_θ(E | C_pre)`, `h^(t) = f_θ(E + h^(t−1) | C_pre)` (input-injected finite unroll; gradients through all iterations).
3. Train with `L = L_ans + λ_step L_step`, where L_step is parallel CE of `f_head(h^(R))` to gold CoT tokens (padding ignored).
4. At inference: run the loop, then autoregressively decode the answer conditioned on `h^(R)` without emitting CoT tokens.

Trained on GSM8k-Aug; evaluated on GSM8K, GSM-Hard, MultiArith, SVAMP. Backbones: GPT-2 (124M), Llama-3.2-1B/3B-Instruct. Baselines: Explicit CoT, No-CoT, CODI, SIM-CoT, PCCoT, KaVa.

## Key Results

- **Llama-3.2-3B GSM8K**: LOTUS 70.0% (±0.9) vs Explicit CoT 71.5%; LOTUS+CODI 70.6%. Prior latent: CODI+SIM-CoT 62.3%, KaVa 65.7%.
- **OOD math average** (GSM-Hard / MultiArith / SVAMP): LOTUS 63.9% vs Explicit CoT 62.1% at 3B.
- **Latency** (3B, GSM8K): thought phase 133.0 vs 338.8 ms (2.5×); total 181.2 vs 384.2 ms (~2.1×). Natural-language CoT: 6.9× thought-phase speedup at matched accuracy (~68%).
- **Ablations**: loop without L_step already beats CODI+SIM-CoT (63.3%); accuracy rises steeply with R (14.6% at R=2 → 70.0% at R=6) and with block width c up to ~25; both L_step and L_ans required.
- **Latent analysis**: gold-CoT NLL 3.07 via LM-head readout; 15.3% / 64.0% of unseen-valid intermediates in top-1 / top-5.

## Connections

- Extends [[iterative-refinement|iterative refinement]] and [[hyperloop-transformers|Hyperloop]] / [[fixed-point-reasoners|FPRM]] looped Transformers from LM perplexity / algorithmic fixed-points to **latent CoT reasoning** with parallel step supervision.
- Complements [[latent-reasoning-with-normalizing-flows|NF-CoT]]: both replace explicit token CoT with continuous thoughts; LOTUS uses weight-tied loops + gold CE readout, NF-CoT uses autoregressive normalizing flows with exact likelihoods.
- Addresses the sequential bottleneck that [[topological-trouble-with-transformers|Topological Trouble]] and CoT workarounds leave open: multi-step computation in a fixed latent budget via recurrence rather than longer decoded traces.
- Related to [[attractor-models|Attractor Models]] and [[equilibrium-reasoners|EqR]] as another form of iterative latent compute, but LOTUS uses finite unroll with direct CoT targets rather than fixed-point / energy dynamics.
- Distinct from [[on-policy-representation-distillation|OPRD]] / hidden-state KD: supervision targets gold CoT tokens through the LM head on padded latents, not teacher hidden states on student rollouts.

## Limitations & Open Questions

> [!open-question]
> Can fixed K, c, and R be made adaptive to problem difficulty without losing parallel efficiency?

> [!open-question]
> Does LOTUS transfer beyond math CoT (code, multi-hop QA, agentic tasks) where step structure is less cleanly block-aligned?

> [!open-question]
> How does LOTUS compare to fixed-point halting ([[fixed-point-reasoners|FPRM]]) when loop depth should vary per example rather than a trained R?

## Future Work

- Adaptive latent budgets: make block count K, per-block width c, and loop depth R depend on input difficulty or convergence rather than fixed hyperparameters.
- Extend beyond math word problems to other reasoning domains where gold CoT structure may be noisier or longer-tailed.
- Further combine looped parallel latents with distillation methods (e.g., CODI) and study when auxiliary-decoder routing helps vs direct LM-head readout.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2606.31779)
- [arXiv](https://arxiv.org/abs/2606.31779)
- [PDF](https://arxiv.org/pdf/2606.31779)
