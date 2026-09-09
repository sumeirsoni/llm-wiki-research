---
title: "β-OPSD: Deriving with Policy Optimization, Training with Self-Distillation"
type: source
created: 2026-08-13
updated: 2026-08-16
arxiv_id: "2607.28582"
authors:
  - "Jiawei Xu"
  - "Minghui Liu"
  - "Juzheng Zhang"
  - "Tom Goldstein"
  - "Furong Huang"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.28582"
tags:
  - self-distillation
  - language
  - optimization
  - reinforcement-learning
aliases:
  - "β-OPSD"
  - "beta-OPSD"
---

# β-OPSD: Deriving with Policy Optimization, Training with Self-Distillation

## Summary

β-OPSD generalizes on-policy self-distillation by deriving its target from a KL-regularized policy objective, then training against a tractable token-level approximation of the closed-form optimum. A parameter $\beta \geq 1$ controls how strongly the target remains anchored to a reference policy rather than directly matching a privileged teacher; vanilla OPSD is the $\beta=1$ endpoint. Scheduled logit interpolation and return-to-go credit assignment improve reported competition-math accuracy and training stability across Qwen3 models from 1.7B to 8B, with the largest average gain over vanilla OPSD at the smallest scale.

## Key Contributions

- **Policy-optimization derivation of self-distillation**: expresses vanilla OPSD as the $\beta=1$ case of a KL-regularized objective.
- **Geometrically interpolated target**: derives an optimal trajectory distribution between the reference and privileged teacher policies.
- **Practical scheduled logit interpolation**: approximates the intractable sequence-level target by mixing reference and teacher logits at each prefix.
- **Look-ahead return credit**: replaces purely local token weighting with discounted return-to-go over the student trajectory.
- **Scale-sensitive empirical gains**: improves average math results over vanilla OPSD at 1.7B, 4B, and 8B parameters, with diminishing gains as model size increases.

## Methodology

For student $\pi_\theta$, privileged teacher $p_T$, and reference $\pi_{\mathrm{ref}}$, the paper defines

$$\mathcal J_\beta(\theta)=\mathbb E_{y\sim\pi_\theta}\left[\log\frac{p_T(y\mid x,c)}{\pi_{\mathrm{ref}}(y\mid x)}\right]-\beta D_{\mathrm{KL}}(\pi_\theta\|\pi_{\mathrm{ref}}).$$

Equivalently,

$$\mathcal J_\beta=-D_{\mathrm{KL}}(\pi_\theta\|p_T)-(\beta-1)D_{\mathrm{KL}}(\pi_\theta\|\pi_{\mathrm{ref}}).$$

The closed-form optimum is a geometric interpolation,

$$\pi_\beta^\star(y\mid x,c)\propto \pi_{\mathrm{ref}}(y\mid x)^{1-1/\beta}p_T(y\mid x,c)^{1/\beta}.$$

Because the trajectory normalizer is intractable, training uses a locally normalized target formed by interpolating reference and teacher logits with weight $w=1/\beta$. The default schedule increases teacher weight from 0.5 to 0.8 over 200 updates. For a student-sampled trajectory, per-token log-ratios are accumulated into discounted return-to-go $G_{t,\gamma}$. The estimator is exactly unbiased for the sequence-level reverse-KL gradient at $\gamma=1$; experiments use $\gamma=0.99$.

Experiments use LoRA on Qwen3-1.7B, 4B, and 8B, a mathematical-reasoning subset of OpenThoughts, and AIME 2024, AIME 2025, and HMMT 2025 evaluation with avg@12.

## Key Results

- **Qwen3-1.7B**: average rises from 31.02 for vanilla OPSD to 36.76 for β-OPSD, a 5.74-point gain.
- **Qwen3-4B**: average rises from 56.11 to 57.87, a 1.76-point gain.
- **Qwen3-8B**: average rises from 58.52 to 60.18, a 1.66-point gain.
- **Largest individual gain**: Qwen3-1.7B on AIME 2024 improves from 44.17 to 53.33.
- **Interpolated-target ablation**: at 1.7B, replacing the direct teacher target with the interpolant improves AIME 2024/2025/HMMT from 47.30/35.53/14.44 to 53.33/40.83/16.11 when both use return-to-go.
- **Credit-assignment ablation**: with fixed interpolation weight 0.5, return-to-go improves over local token credit on all three benchmarks, most strongly on AIME 2025 and HMMT.
- **Reference choice**: a stop-gradient current student plus fixed privileged teacher performs best among tested interpolant-reference variants.
- **No universal schedule**: 0.5-to-0.8 gives the strongest overall trade-off, but another schedule wins AIME 2024 and fixed 0.5 wins HMMT.

## Connections

- Adds a regularized objective family to [[on-policy-distillation|On-Policy Distillation]], clarifying that direct privileged-teacher matching is only one endpoint rather than the unique OPSD target.
- Strengthens the baseline set in [[oprd-literature-review|OPRD Literature Review]]: representation-level distillation should be compared with reference-anchored, scheduled output-space distillation rather than only vanilla OPSD.
- Relates to [[learning-beyond-teacher|G-OPD and ExOPD]] through a KL-regularized RL interpretation, but β-OPSD interpolates toward the reference for stability instead of extrapolating beyond the teacher.
- Uses sequence-aware token credit, complementing position- and token-selective approaches such as [[on-the-position-bias-of-on-policy-distillation|IW-OPD]] and [[token-selective-distillation]].
- Complements [[latent-on-policy-self-distillation|LOPD]] at a different layer of the design: β-OPSD regularizes the student's target between a reference and fixed privileged teacher, while LOPD learns the teacher's privileged context from retrieved experience and constrains its advantage over the student.

## Limitations & Open Questions

- The exact sequence-level optimum has an intractable normalizer, so the implemented autoregressive target is a local approximation.
- Exact unbiasedness of return-to-go applies at $\gamma=1$, while the reported method uses discounted $\gamma=0.99$.
- Mixed student-teacher sampling adds off-policy importance weighting, variance, decoding cost, and checkpoint sensitivity; it is not the default method.
- Evidence is limited to Qwen3 models, one math corpus, three competition-math benchmarks, LoRA training, and avg@12 evaluation.
- Improvements shrink with model size in the tested range, and no interpolation schedule dominates every benchmark.

## Future Work

The authors propose:

- Adaptive or theoretically optimized interpolation schedules.
- Nonlinear, piecewise, or performance-dependent curricula.
- Lower-variance return-to-go estimators.
- Evaluation outside mathematical reasoning.
- Studying how schedules should depend on model scale, task distribution, and training budget.

## Links

- [arXiv](https://arxiv.org/abs/2607.28582)
- [PDF](https://arxiv.org/pdf/2607.28582)
- [HTML](https://arxiv.org/html/2607.28582v1)
