---
title: "Latent Reasoning with Normalizing Flows"
type: source
created: 2026-06-09
updated: 2026-07-16
arxiv_id: "2606.06447"
authors:
  - "Guancheng Tu"
  - "Xiangjun Fu"
  - "Suhao Yu"
  - "Yao Tang"
  - "Jiatao Gu"
  - "Haoqiang Kang"
  - "Lianhui Qin"
  - "Yizhe Zhang"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.06447"
tags:
  - language
  - generative-modeling
  - transformer
  - theory
aliases:
  - "NF-CoT"
  - "Normalizing Flow Chain-of-Thought"
---

# Latent Reasoning with Normalizing Flows

## Summary

NF-CoT integrates continuous Chain-of-Thought reasoning into LLMs via autoregressive normalizing flows, giving latent thoughts the same operational status as discrete tokens: left-to-right sampling, tractable likelihoods, KV-cache compatibility, and direct policy-gradient optimization. On code generation benchmarks, NF-CoT improves pass@1 by 13.0% over Qwen3-8B-Base while being 2.7× faster at latent generation than diffusion-based LaDiR.

## Key Contributions

- **Likelihood-based continuous CoT**: shallow autoregressive flow blocks map VAE-encoded CoT targets e into LLM-facing u-space with exact likelihood via change-of-variables.
- **Unified causal stream**: continuous thoughts and answer tokens share one LLM backbone with separate NF and LM heads; KV-cache built during latent sampling is reused for answer decoding.
- **Tractable RL in latent space**: GRPO-style policy optimization directly on continuous thought trajectories preserves pass@k diversity unlike token-space RL.
- **Two-stage training curriculum**: frozen-backbone warm-up aligns flow components before joint end-to-end finetuning.
- **Structural diversity**: latent sampling produces distinct algorithmic strategies (not just surface variations), with lower AST similarity among passing programs.

## Methodology

Explicit CoT traces are VAE-encoded into continuous targets e_{1:K}. Invertible flow blocks F_θ map e → u, where p_θ(u|q) is a causal Gaussian density factorized left-to-right. Training optimizes:

$$L_{sup} = \lambda_{flow} L_{flow} + \lambda_{text} L_{text}$$

where L_flow = −log p_θ(e|q) (via u-space + log-determinant) and L_text is standard autoregressive answer likelihood conditioned on sampled thoughts.

At inference, thoughts ũ are sampled autoregressively from p_θ(u|q), then answer tokens are generated in the same causal stream. RL refines the policy in u-space with execution rewards via GRPO.

## Key Results

- **Code generation (avg pass@1)**: NF-CoT Unified 68.8% (+13.0% over base 55.8%), vs LaDiR +7.1%, Diffu-Coder +9.1%, Ouro +1.9%.
- **Pass@k scaling**: NF-CoT pass@1 on MBPP+ (72.1%) matches base pass@128 (72.0%); reaches 87.5% at k=128.
- **RL refinement**: 68.8% → 70.1% avg pass@1; preserves diversity unlike token-space GRPO which saturates at high k.
- **Efficiency vs LaDiR**: 2.70× faster latent generation, 1.92× faster overall, 5.71× token throughput during training.
- **Latent robustness**: Gaussian perturbations dropping cosine similarity to 0.116 reduce pass@1 only 86.0% → 83.6% on HumanEval; perturbations affect surface form more than functional correctness.

## Connections

- Complements [[lotus|LOTUS]]: both replace decoded CoT with continuous thoughts for efficiency; NF-CoT emphasizes tractable likelihoods and RL in flow space, while LOTUS uses looped parallel blocks with direct gold-token CE readout and approaches explicit CoT at 3B.

- Extends [[iterative-refinement|iterative refinement]] from discrete recursive reasoning ([[generative-recursive-reasoning|GRAM]], [[attractor-models|Attractor Models]]) to continuous latent thought with tractable likelihoods.
- Contrasts with diffusion-based latent reasoning (LaDiR) by preserving autoregressive LLM interfaces — related to [[flow-matching|flow matching]] as another continuous generative framework but applied to reasoning latents.
- The unified causal stream design parallels [[on-policy-representation-distillation|OPRD]]'s insight that internal representations carry information beyond output distributions.
- Connects to [[energy-based-models|energy-based models]] through the probabilistic scoring of reasoning trajectories, though NF-CoT uses explicit flow likelihoods rather than energy minimization.

## Limitations & Open Questions

> [!open-question]
> Does NF-CoT generalize beyond code generation to math, science, and multimodal reasoning tasks?

> [!open-question]
> Can dynamic latent budgets adapt the number of thought steps per problem, rather than fixed K?

> [!open-question]
> Continuous latents are not human-readable — how should decoded CoT traces be interpreted as faithful explanations vs. qualitative probes?

## Future Work

- Extend NF-CoT beyond code generation to other reasoning tasks (math, science, multimodal) where unit-test verifiers are unavailable.
- Develop adaptive latent budgets that vary the number of continuous thought steps per problem, rather than relying on fixed-length VAE-encoded trajectories.
- Generalize policy-gradient refinement in continuous latent space to domains without executable verifiers, where latent likelihood alone cannot serve as a correctness oracle.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2606.06447)
- [arXiv](https://arxiv.org/abs/2606.06447)
- [PDF](https://arxiv.org/pdf/2606.06447)
