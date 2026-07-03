---
title: "The Topological Trouble With Transformers"
type: source
created: 2026-06-09
updated: 2026-06-09
arxiv_id: "2604.17121"
authors:
  - "Michael C. Mozer"
  - "Shoaib Ahmed Siddiqui"
  - "Rosanne Liu"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2604.17121"
tags:
  - transformer
  - theory
  - language
aliases:
  - "Topological Trouble With Transformers"
  - "Dynamic State Tracking in Transformers"
---

# The Topological Trouble With Transformers

## Summary

This position paper argues that purely feedforward Transformers have a fundamental topological limitation for dynamic state tracking: for state s_t = f(s_{t-1}, x_t), s_t must reside in a deeper layer than s_{t-1}, causing state information to shift upward and become inaccessible to shallow layers processing subsequent tokens. The authors provide LLM failure examples (twenty questions inconsistency, polysemous "bank" flip-flopping), introduce a taxonomy of recurrent transformer architectures, and outline research directions for integrating genuine state maintenance.

## Key Contributions

- **Topological depth constraint**: in feedforward networks, dynamic state representations must progressively occupy deeper layers, exhausting fixed depth and preventing indefinite state tracking — distinct from context-window limitations.
- **"Racing thoughts" phenomenon**: deep layers may correctly disambiguate context (e.g., "river bank") but shallow layers processing subsequent tokens retain earlier superficial associations ("ATM"), because refined state cannot propagate backward in depth.
- **Recurrent transformer taxonomy**: categorizes architectures by recurrence axis (depth, step, or both) and input-tokens-per-recurrence-step ratio (>1, =1, <1), organizing Universal Transformers, block-recurrent models, SSMs (Mamba), and latent-thought models.
- **Depth recurrence is insufficient**: looped/universal transformers still shift state upward across layers and cannot achieve indefinite state tracking without sequential training dependencies.
- **CoT as inefficient workaround**: explicit chain-of-thought externalizes deep representations as text tokens, wastefully consuming context for unconscious microcognition that recurrent dynamics should handle implicitly.

## Methodology

Conceptual analysis grounded in state-update formalism s_t = f(s_{t-1}, x_t), illustrated with schematic diagrams and empirical LLM failure cases (Gemini 3, Gemini 2.5 Flash on twenty questions and polysemy disambiguation). Comprehensive literature synthesis covering transformer expressivity limits, hybrid recurrent architectures, and state-space models. Taxonomy development (Table 1) maps existing and unexplored architectural configurations.

## Key Results

- **Twenty questions failures**: models produce logically contradictory responses, failing to maintain a consistent internal belief state (e.g., valid number range) across turns.
- **Polysemy flip-flopping**: "bank" interpretation shifts between river and financial meanings without acknowledging context, demonstrating breakdown of consistent contextualization.
- **Depth recurrence limitation**: even with layer looping, state still migrates upward; true indefinite tracking requires step-level recurrence with sequential training.
- **Promising directions identified**: enhanced SSMs with nonlinear updates (DeltaNet, RWKV-7, PaTH), coarse-grained recurrence (sentence-level chunking), representational alignment across layers, and multi-stage training (parallel pretrain → recurrent finetune).

## Connections

- Provides architectural motivation for [[iterative-refinement|iterative refinement]] approaches: [[hyperloop-transformers|Hyperloop Transformers]] (depth recurrence), [[pretraining-recurrent-networks-without-recurrence|SMT]] (explicit memory states), [[attractor-models|Attractor Models]] (fixed-point state), and [[latent-reasoning-with-normalizing-flows|NF-CoT]] (implicit latent thoughts).
- Critiques explicit CoT as a workaround that [[latent-reasoning-with-normalizing-flows|NF-CoT]] and [[generative-recursive-reasoning|GRAM]] attempt to replace with implicit latent computation.
- Connects to [[convergent-world-representations-and-divergent-tasks|Convergent World Representations]] on maintaining coherent world state across extended interactions.
- Taxonomy includes models adjacent to [[energy-based-transformers|Energy-Based Transformers]] and equilibrium-based inference as alternative state-update mechanisms.

## Limitations & Open Questions

> [!open-question]
> Can enhanced SSMs (Mamba, DeltaNet) fully close the state-tracking gap while retaining training parallelizability?

> [!open-question]
> Do depth-recurrent models ([[hyperloop-transformers|Hyperloop]], Universal Transformers) provide sufficient state tracking for practical reasoning despite the theoretical depth limitation?

> [!open-question]
> Can training objectives steer feedforward transformers to approximate state tracking without explicit recurrence, as the paper suggests as one research direction?

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2604.17121)
- [arXiv](https://arxiv.org/abs/2604.17121)
- [PDF](https://arxiv.org/pdf/2604.17121)
