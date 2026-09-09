---
title: "Latent On-Policy Self-Distillation"
type: source
created: 2026-08-16
updated: 2026-08-16
arxiv_id: "2608.13040"
authors:
  - "Guibin Zhang"
  - "Jiayang Lyu"
  - "Ran Sun"
  - "Xinlei Yu"
  - "Haoyu Zhao"
  - "Qibing Ren"
  - "Shuicheng Yan"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.13040"
code_url: "https://github.com/bingreeky/LOPD"
tags:
  - self-distillation
  - language
  - optimization
  - reinforcement-learning
aliases:
  - "LOPD"
---

# Latent On-Policy Self-Distillation

## Summary

Latent On-Policy Self-Distillation (LOPD) replaces the manually chosen privileged artifact in on-policy self-distillation - such as a reference answer, feedback, skill, or successful trajectory - with a learned continuous context composed from retrieved prior experiences. A frozen self-teacher conditions on these latent tokens and supplies dense reverse-KL supervision at prefixes visited by the student, while an outcome-weighted privileged-margin constraint prevents joint context learning from collapsing the teacher toward the student. The trained student retains the induced behavior after retrieval, the experience bank, and latent context are removed at inference.

## Key Contributions

- **Learned privilege from experience**: retrieves successful prior trajectories and compresses each into continuous latent tokens instead of requiring a hand-designed privileged prompt artifact.
- **Training-only latent teacher context**: the self-teacher receives learned context while the student acts from the ordinary task and interaction history, leaving the deployed student architecture unchanged.
- **Dense on-policy supervision**: applies token-level reverse KL on student-generated prefixes, retaining the state-distribution alignment of [[on-policy-distillation|on-policy distillation]].
- **Privileged-margin optimization**: uses an outcome-weighted log-likelihood advantage and dual constraint to preserve a useful teacher-student gap during joint composer and student training.
- **Cross-domain evidence**: reports consistent gains over GRPO, SDFT, OPSD, SDPO, and Skill-SD on tool-use and code-generation evaluations across Qwen3-4B, Qwen3-8B, and OLMo-3-7B backbones.

## Methodology

For student state $\mathbf{s}_t=(x,\mathbf{o}_{\le t},\mathbf{a}_{<t})$, the student samples its own trajectory from $\pi_\theta^S$. LOPD constructs privileged context as $\mathbf{c}_\phi=\Phi_\phi(x,\mathcal E)$ from a frozen bank of successful training-split rollouts. Qwen3-Embedding-8B retrieves the top three experiences with normalized embeddings and exact FAISS inner-product search. A frozen backbone encoder with rank-8 LoRA and an eight-layer shared-weight QFormer-style compressor maps each experience to 32 latent tokens, for 96 tokens by default.

The composer is cold-started by maximizing the frozen teacher backbone's likelihood of successful trajectories. During on-policy training, the frozen teacher receives both the student prefix and $\mathbf{c}_\phi$, while the student receives only the prefix. Gradients pass through teacher activations into the composer even though teacher parameters remain fixed. Distillation minimizes token-normalized reverse KL between student and teacher distributions, retaining the teacher's top 20 tokens and aggregating the remaining probability into a tail event.

Joint optimization without a constraint can make the learned context uninformative. LOPD therefore measures the teacher's log-likelihood advantage over the stop-gradient student on sampled tokens, weights it by the signed trajectory outcome $A(\tau)=2r(\tau)-1$, and enforces a target privilege margin $m$ with a learned nonnegative dual variable. The full objective combines distillation, the margin constraint, and an $L_2$ anchor to the cold-start context. Reported defaults are $m=0.05$, context-anchor weight $\lambda=0.2$, and dual learning rate $0.5$.

## Key Results

- **Qwen3-4B tool use**: LOPD reaches 63.7 on EnvScaler, 27.38 average on BFCL-v3, and 60.6 average on ACEBench, versus the strongest reported non-LOPD results of 61.8, 25.25, and 56.0.
- **Qwen3-8B tool use**: LOPD reaches 66.4 on EnvScaler, 29.88 on BFCL-v3, and 62.7 on ACEBench, versus strongest non-LOPD results of 60.2, 29.00, and 58.0.
- **Qwen3-4B coding**: LOPD reports 48.78 on the LiveCodeBench aggregate and 81.36 on the EvalPlus aggregate, compared with strongest non-LOPD results of 48.29 and 80.07.
- **OLMo-3-7B coding**: LOPD reports 50.98 on LiveCodeBench and 78.41 on EvalPlus, compared with 48.29 and 77.86.
- **Rollout efficiency**: on Qwen3-4B EnvScaler, LOPD exceeds the final reported GRPO and Skill-SD rewards after 320 of the 1,600 plotted generations. It reaches 0.637 at generation 576. The abstract's broader claim of using less than 30% of baseline rollout budgets is not accompanied by a complete budget table.
- **Margin ablation**: freezing the cold-start composer gives 0.573 EnvScaler reward; unconstrained joint optimization with $m=0$ falls to 0.551; $m=0.05$ reaches 0.637, while $m=0.10$ reaches 0.626.
- **Latent capacity and retrieval**: 32 tokens per retrieved experience performs best among the reported settings; increasing to 64 or 128 gives no consistent gain. Three retrieved experiences improve over one (0.637 vs 0.605), but further retrieval does not improve monotonically.
- **Behavioral internalization**: compared with the vanilla model, the final student increases reward from 0.486 to 0.637 while reducing tool calls per step from 3.50 to 1.11 and first-step length from 9,937 to 6,210 tokens, despite receiving no latent context at evaluation.

## Connections

- Extends [[on-policy-distillation|On-Policy Distillation]] along a new design axis: not only the objective, token weights, or representation target, but how privileged teacher information is constructed and learned.
- Complements [[beta-opsd|β-OPSD]]. β-OPSD regularizes how strongly the student follows a fixed privileged teacher, while LOPD learns the privileged context itself and constrains its teacher advantage with an outcome-weighted margin.
- Differs from [[on-policy-representation-distillation|OPRD]]: LOPD still transfers output distributions through reverse KL, but learns continuous latent conditioning for the teacher; OPRD directly aligns teacher and student hidden states.
- Broadens [[self-distillation|self-distillation]] from teachers derived through parameter averaging or fixed privileged prompts to a frozen self-teacher whose training-only context is learned from an experience bank.

## Limitations & Open Questions

- Evaluation covers three backbones at 4B-8B scale and two domains, tool use and Python-oriented code generation; broader scales, modalities, and tasks remain untested.
- The experience bank contains successful trajectories only, so behavior under sparse successes, noisy verification, or mixed positive and negative experience is unknown.
- Training adds retrieval, a frozen teacher forward pass, differentiable latent injection, and composer optimization, but end-to-end compute and memory overhead relative to GRPO and other OPSD methods are not quantified.
- Unconstrained composer learning performs worse than freezing it, and results are sensitive to margin and latent capacity choices.
- Latent-token projections are fragmented rather than a reliable semantic interpretation of what the composer stores.
- The main text describes 77K verified coding problems, while an appendix table lists approximately 7,000 training tasks; the paper does not reconcile the discrepancy.
- The abstract's less-than-30% rollout-budget claim is only partially supported by the plotted 320/1,600 crossing point and lacks a complete matched budget table.

## Future Work

The authors suggest richer skill repositories, reusable codebooks, learned retrievers, broader experience sources beyond minimally processed successful trajectories, and richer latent-memory or experience representations. Natural but inferred follow-ups include online experience-bank updates, mixed success/failure retrieval, explicit training-cost measurement, more interpretable latent contexts, and evaluation beyond the reported model scales and domains.

## Links

- [arXiv](https://arxiv.org/abs/2608.13040)
- [PDF](https://arxiv.org/pdf/2608.13040)
- [HTML](https://arxiv.org/html/2608.13040v1)
- [Code](https://github.com/bingreeky/LOPD)
- [Qwen3-8B-LOPD](https://huggingface.co/liunanfu1992/Qwen3-8B-LOPD)
- [OLMo-3-7B-Think-LOPD](https://huggingface.co/liunanfu1992/OLMo-3-7B-Think-LOPD)
