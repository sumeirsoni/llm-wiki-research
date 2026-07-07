---
title: "Is One Layer Enough? Training A Single Transformer Layer Can Match Full-Parameter RL Training"
type: source
created: 2026-07-06
updated: 2026-07-06
arxiv_id: "2607.01232"
authors:
  - "Zijian Zhang"
  - "Rizhen Hu"
  - "Athanasios Glentis"
  - "Dawei Li"
  - "Chung-Yiu Yau"
  - "Hongzhou Lin"
  - "Mingyi Hong"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.01232"
tags:
  - reinforcement-learning
  - language
  - transformer
  - optimization
  - theory
aliases:
  - "Is One Layer Enough"
  - "Layer Contribution RL"
  - "Single-Layer RL Training"
---

# Is One Layer Enough? Training A Single Transformer Layer Can Match Full-Parameter RL Training

## Summary

This paper systematically studies how reinforcement learning (RL) with verifiable rewards (RLVR) distributes adaptation across transformer layers in large language models. By independently RL-training each decoder layer while freezing all others, the authors find that a single layer can recover most — and sometimes exceed — the gains of full-parameter GRPO training. They introduce **layer contribution** $C(k) = (S_k - S_{\text{base}})/(S_{\text{full}} - S_{\text{base}})$ to quantify this effect. Across seven models (Qwen3, Qwen2.5, DeepSeek-distilled), three RL algorithms (GRPO, GiGPO, Dr. GRPO), and tasks spanning math, code, and agentic decision-making, high-contribution layers consistently concentrate in the **middle 40–60% of network depth**, with rankings stable across datasets, tasks, and algorithms.

## Key Contributions

- **RL gains are highly concentrated**: Best single layers reach $C \geq 1.0$ (matching or surpassing full-parameter RL) while weakest layers recover $< 30\%$ of full gains; on Qwen3-1.7B, Layer 10 reaches $C = 1.14$ vs Layer 24 at $C = 0.28$.
- **Layer contribution metric**: Normalized fraction of full RL improvement recoverable by training layer $k$ in isolation, enabling direct cross-model comparison.
- **Stable middle-layer structure**: High-contribution layers cluster at ~40–60% relative depth across model families, scales (1.5B–8B), RL algorithms, and task domains (math, code, ALFWorld agentic tasks).
- **Cross-dataset/task consistency**: Layer rankings correlate strongly across math datasets (Spearman $\rho = 0.76$) and even across math vs code ($\rho = 0.59$), suggesting contribution is an intrinsic property of pretrained weights.
- **Layer-aware training strategies**: Boosting LR or selectively training only high-contribution layers consistently outperforms full-parameter RL (e.g., Qwen3-8B: 69.1% vs 66.4% math avg with Only-B10); a profiling-free middle-layer heuristic also beats full training.
- **Complementary layer specialists**: High-contribution layer-trained models solve largely non-overlapping problem subsets (34.1% avg Jaccard); majority voting across 7 layer models reaches 33.6% OlympiadBench vs 26.9% full RL.
- **Weight change ≠ contribution**: Full-parameter training produces uniform per-layer weight change magnitudes despite highly non-uniform contribution profiles; contribution reflects parameter-subspace effectiveness, not update size.

## Methodology

For an LLM with $L$ transformer layers, the authors train each layer $k$ independently via RL (GRPO or variants) while freezing embeddings, all other layers, and the LM head. Gradients backpropagate through the full network but only $\theta_k$ is updated. Layer contribution compares in-domain performance $S_k$ against base $S_{\text{base}}$ and full-parameter $S_{\text{full}}$.

**Primary setup**: Qwen3-1.7B/4B/8B-Base with GRPO on NuminaMath-CoT (50K decontaminated), evaluated on 12 benchmarks in four categories (Math, Code, Reasoning, Language). Full-parameter baselines use LR-tuned AdamW ($5 \times 10^{-6}$ best); single-layer runs use the same LR for fair comparison.

**Generalization experiments**: Qwen2.5-Math-1.5B (Dr. GRPO), Qwen2.5-Instruct models (GiGPO on ALFWorld), DeepSeek-Distilled-Qwen-7B (GRPO on Skywork).

**Guided strategies** (§4): (1) boost LR on top-$k$ contribution layers, (2) freeze all but top-$k$ layers, (3) train middle-$k$ layers by position without profiling.

## Key Results

| Model | Best layer $C$ | Worst layer $C$ | Layers $\geq 1.0$ | Guided best vs Full RL |
|-------|----------------|-----------------|-------------------|------------------------|
| Qwen3-1.7B | 1.14 (L10) | 0.28 (L24) | 5/28 | 53.7% vs 50.8% (+43% of RL gain) |
| Qwen3-4B | 1.06 (L16) | 0.66 (L2) | 4/36 | 65.9% vs 63.0% (+27%) |
| Qwen3-8B | 1.07 (L16) | −0.51 (L0) | 4/36 | 69.1% vs 66.4% (+32%) |
| Qwen2.5-Math-1.5B | 1.01 (L14) | 0.42 (L23) | 2/28 | — |
| Qwen2.5-1.5B-Instruct (ALFWorld) | 1.02 (L14) | 0.25 (L24) | 1/8† | — |
| Qwen2.5-3B-Instruct (ALFWorld) | 1.01 (L18) | 0.17 (L4) | 1/11† | — |
| DeepSeek-Distilled-Qwen-7B | 1.05 (L16) | 0.33 (L24) | 2/8† | — |

† Partial layer scans due to compute constraints.

- **Out-of-distribution generalization**: Overall contribution $C_{\text{all}}$ (averaged across Math/Code/Reasoning/Language) tracks in-domain math contribution (Pearson $r > 0.6$), indicating broad capability improvement rather than objective overfitting.
- **LR ablation**: 3× higher LR does not change layer contribution rankings; low-contribution layers remain low.
- **Majority voting**: 7 diverse layer-trained models on OlympiadBench (33.6%) beat best single layer (28.3%), full RL (26.9%), and self-consistency over 7 full-RL samples (31.3%).

## Connections

- Extends [[representation-geometry|representation geometry]] from embedding and parameter-update spaces to **layer-wise functional specialization** during RLVR — complementary to [[on-the-geometry-of-on-policy-distillation|OPD geometry]], which studies where updates go, while this paper studies **which layers can absorb RL improvement**.
- Connects to prior SFT layer-heterogeneity work (LISA, MISA, AdaGradSelect) cited in the paper; this is the first systematic layer-wise study in the **RL post-training** setting. See [[layer-contribution-rl]].
- The finding that full-parameter training produces uniform weight changes but non-uniform contributions parallels [[on-the-geometry-of-on-policy-distillation|OPD geometry]]'s observation that update geometry and functional outcome can dissociate.
- Complementary layer behaviors and majority-voting gains relate to [[generative-recursive-reasoning|GRAM]]'s multi-trajectory diversity theme, but along the interpretable axis of transformer depth rather than stochastic width.
- Uses GRPO ([[latent-reasoning-with-normalizing-flows|NF-CoT]] also uses GRPO-style RL) on Qwen3 models also studied in [[on-the-geometry-of-on-policy-distillation|OPD geometry]] (Qwen3-8B).

## Limitations & Open Questions

> [!open-question]
> Layer-aware guided strategies are validated only on mathematical reasoning with Qwen3; extension to coding and agentic tasks remains future work.

> [!open-question]
> Why do middle layers disproportionately absorb RL improvement? The paper establishes the empirical pattern but lacks a theoretical account.

> [!open-question]
> Layer contribution is defined relative to a specific training configuration (dataset, algorithm, hyperparameters). How sensitive is the middle-layer heuristic when these change substantially?

> [!open-question]
> Can layer contribution profiles guide parameter-efficient methods (LoRA target selection, layer-wise LR schedules) in production RL pipelines without expensive per-layer profiling?

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2607.01232)
- [arXiv](https://arxiv.org/abs/2607.01232)
- [PDF](https://arxiv.org/pdf/2607.01232)
