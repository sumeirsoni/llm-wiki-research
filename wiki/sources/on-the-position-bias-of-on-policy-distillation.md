---
title: "On the Position Bias of On-Policy Distillation"
type: source
created: 2026-07-06
updated: 2026-07-11
arxiv_id: "2606.22600"
authors:
  - "Yan Xie"
  - "Sijie Zhu"
  - "Tiansheng Wen"
  - "Bo Chen"
  - "Yifei Wang"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.22600"
tags:
  - language
  - self-distillation
  - reinforcement-learning
  - optimization
  - theory
aliases:
  - "Position Bias OPD"
  - "IW-OPD"
  - "Importance-Weighted On-Policy Distillation"
---

# On the Position Bias of On-Policy Distillation

## Summary

Standard on-policy distillation (OPD) uniformly averages token-level KL losses, but teacher supervision quality degrades along student-generated rollouts as prefixes drift from the teacher's preferred reasoning paths. This paper identifies **position bias**: early tokens provide most of the learning signal, while later tokens contribute little. With the same 30% token budget, prefix-only OPD matches full OPD, whereas suffix-only OPD barely learns. The authors explain this via a constrained local-projection view and propose **Importance-Weighted OPD (IW-OPD)**, which reweights tokens by cumulative teacher–student prefix discrepancy. IW-OPD converges faster and achieves better final performance across same-size and cross-scale distillation, with up to +6.9 points on AIME 2025 at step 10.

## Key Contributions

- **Position bias phenomenon**: Teacher accuracy conditioned on student prefixes drops rapidly as prefix length grows; OPD mean token KL plateaus at ~80% of initial divergence even after convergence.
- **Prefix vs suffix asymmetry**: Prefix-30% supervision matches or exceeds full OPD; suffix-30% provides minimal benefit — OPD is effectively a finite-budget prefix allocation problem.
- **Constrained-optimization theory**: Optimal local policy $q^*_\theta(y) \propto \pi_\theta(y) \cdot (\pi_T(y)/\pi_\theta(y))^\alpha$ under trust-region constraint $D_{\mathrm{KL}}(q\|\pi_\theta) \leq \rho$; prefix likelihood ratios naturally downweight drifted suffixes.
- **IW-OPD objective**: Token-level advantages weighted by normalized cumulative unsigned prefix discrepancy $\tilde{r}^{\mathrm{IW-OPD}}_t = 1 + \gamma(1 - \sum_{k<t}|A^{\mathrm{OPD}}_k| / \sum_{k<T}|A^{\mathrm{OPD}}_k|)$, blended with standard OPD (default $\gamma = 0.5$).
- **Stronger teachers, smaller students**: IW-OPD makes large teachers more sample-efficient (30B teacher beats 4B teacher at step 10 where standard OPD does not) and yields larger relative gains as students shrink (+9.5% for 0.6B vs +1.8% for 4B).
- **Orthogonal to reward design**: IW-ExOPD (combining with ExOPD reward extrapolation) further improves over ExOPD alone.

## Methodology

**Standard OPD** minimizes reverse KL on student rollouts with uniform token averaging:

$$J_{\mathrm{OPD}}(\theta) = -\mathbb{E}_{x, y \sim \pi_\theta}\left[\sum_{t=1}^T \log \frac{\pi_\theta(y_t|x, y_{<t})}{\pi_T(y_t|x, y_{<t})}\right]$$

**IW-OPD** derives from minimizing $D_{\mathrm{KL}}(q^*_\theta \| \pi_T)$ where $q^*_\theta$ is the constrained optimal policy. The practical surrogate uses:

- **Unsigned cumulative discrepancy**: $-\sum_{k<t} A^{\mathrm{OPD}}_k$ (sum of absolute token-level teacher–student gaps) to avoid signed cancellation along drifted prefixes.
- **Within-sample normalization** to $[0, 1]$ by position.
- **OPD blend** ($\gamma = 0.5$): keeps standard dense OPD as a floor while allocating extra budget to teacher-compatible prefixes.

**Setup**: Qwen3 students (0.6B, 1.7B, 4B) distilled from Qwen3-4B-Instruct or Qwen3-30B-A3B-Instruct teachers on DeepMath (57K, difficulty ≥ 6) and Eurus-RL-Code (25K). Evaluated on AIME 2024/2025, HMMT 2025, HumanEval+, MBPP+. Implemented in verl PPO pipeline with clipped surrogate and no reward model.

## Key Results

| Setting | Metric | Standard OPD | IW-OPD | Gain |
|---------|--------|--------------|--------|------|
| 30B → 4B, step 10 | AIME25 | 42.4% | 49.3% | +6.9 |
| 30B → 4B, converged | Avg | 55.3% | 57.1% | +1.8 |
| 30B → 1.7B, step 10 | AIME25 | 20.2% | 23.2% | +3.0 |
| 4B → 0.6B, converged | Avg | 20.0% | 21.9% | +1.9 (+9.5%) |
| 235B → 30B-A3B | Math avg | 63.6% | 65.5% | +1.9 |

- **Sample efficiency**: IW-OPD at step 10 with 30B teacher (55.5 avg) already matches converged standard OPD (55.3).
- **Ablations** (Qwen3-0.6B, AIME25): fixed prefix amplification +0.4, linear decay +0.7, manual curriculum +1.5, cumulative-share (IW-OPD) +5.6 over OPD baseline (43.3%).
- **Compression scaling**: IW-OPD advantage grows from +4.0% at 1.0× to +14.9% at 6.7× teacher/student parameter ratio.

## Connections

- Directly complements [[on-the-geometry-of-on-policy-distillation|OPD Geometry]]: geometry paper studies *where parameter updates go* (subspace locking); this paper studies *where along the rollout teacher supervision is reliable* (position bias). Both identify inefficiency in uniform OPD treatment.
- Pairs with [[on-policy-representation-distillation|OPRD]]: OPRD adds hidden-state alignment on the last 2000 response tokens across all layers; IW-OPD reallocates which *positions* within a rollout receive gradient budget. Composable in principle.
- Extends [[self-distillation|self-distillation]] token-selective distillation line (LISA/MISA for SFT layers; SelecTKD for token weights) to **on-policy prefix compatibility** as the weighting signal.
- The finite-budget local projection connects to trust-region RL and relates to [[layer-contribution-rl|layer contribution in RLVR]] — both reallocate limited update budget toward high-signal regions (prefix tokens vs middle layers).
- Teacher–student prefix drift is the sequence-level analogue of the distribution mismatch that [[on-the-geometry-of-on-policy-distillation|OPD geometry]] observes causes subspace locking in parameter space.

## Limitations & Open Questions

> [!open-question]
> IW-OPD weights converge toward $1 - t/T$, leaving mild residual non-uniformity at convergence. Can this be further corrected?

> [!open-question]
> Experiments focus on Qwen3-family math/code distillation up to 4B students; validation at larger student scales remains future work.

> [!open-question]
> Can IW-OPD be combined with [[on-policy-representation-distillation|OPRD]] hidden-state alignment for joint position- and representation-aware distillation?

> [!open-question]
> Does position bias also appear in on-policy RLVR (not just OPD), where samples come from the current policy but updates target a new policy?

## Future Work

- Investigate whether position bias generalizes to other two-autoregressive-model settings, such as on-policy RL where rollouts come from the current policy but updates target a new policy.
- The paper does not propose a dedicated future-work roadmap beyond the broader principle that effective on-policy supervision should weight tokens by trajectory context (prefix compatibility), not token-level disagreement alone.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2606.22600)
- [arXiv](https://arxiv.org/abs/2606.22600)
- [PDF](https://arxiv.org/pdf/2606.22600)
