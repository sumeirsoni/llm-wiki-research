---
title: "Learning beyond Teacher: Generalized On-Policy Distillation with Reward Extrapolation"
type: source
created: 2026-07-08
updated: 2026-07-11
arxiv_id: "2602.12125"
authors:
  - "Wenkai Yang"
  - "Weijie Liu"
  - "Ruobing Xie"
  - "Kai Yang"
  - "Saiyong Yang"
  - "Yankai Lin"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2602.12125"
code_url: "https://github.com/RUCBM/G-OPD"
tags:
  - language
  - self-distillation
  - reinforcement-learning
  - optimization
aliases:
  - "G-OPD"
  - "ExOPD"
  - "Reward Extrapolation OPD"
---

# Learning beyond Teacher: Generalized On-Policy Distillation with Reward Extrapolation

## Summary

This paper generalizes on-policy distillation by showing that standard OPD is a special case of dense KL-constrained RL where the teacher-derived reward and KL regularization are tied together. Generalized OPD (G-OPD) introduces a flexible reference model and a reward scaling factor. When the reward scale is greater than one, ExOPD extrapolates beyond the teacher distribution and can improve over standard OPD in strong-to-weak and multi-teacher reasoning/code settings.

## Key Contributions

- **OPD as KL-constrained RL**: recasts reverse-KL OPD as dense reward optimization with an implicit reference policy.
- **Reward scaling**: introduces a scalar that changes the balance between teacher reward and KL regularization.
- **ExOPD**: uses scaling greater than one to push beyond the teacher rather than only imitate it.
- **Reward correction**: in strong-to-weak settings, using the teacher's pre-RL base model as reference can sharpen the reward signal.
- **Multi-teacher merging**: ExOPD can merge domain-specific RL teachers into one student that surpasses individual teachers.

## Methodology

Standard OPD aligns the student to teacher logits on student-generated rollouts. G-OPD decomposes this into a reward term based on teacher/reference log-probability ratios and a KL term to a reference model. ExOPD increases the reward scale, effectively extrapolating the teacher's preference direction.

## Relevance to OPRD

ExOPD is a useful **output-space control objective** for OPRD experiments:

- It tests whether representation-level gains persist when the OPD baseline is stronger than standard reverse KL.
- Its reward-scaling view raises the question of whether OPRD MSE or contrastive losses should also have an "extrapolative" variant rather than pure matching.
- Its objective-composition knob is relevant to [[on-the-geometry-of-on-policy-distillation|OPD Geometry]], where objective composition controls subspace trajectory more than token sparsification.

## Limitations & Open Questions

> [!open-question]
> Reward extrapolation is defined in output-probability space. It is unclear what the analogous operation would be in hidden-state space without pushing representations into teacher-incompatible regions.

> [!open-question]
> ExOPD improves OPD but does not address the LM-head bottleneck that motivates [[on-policy-representation-distillation|OPRD]].

## Future Work

- Validate ExOPD generalizability on larger-scale student/teacher models.
- Assess robustness of ExOPD in multi-teacher distillation with a broader, more diverse set of domain teachers.
- Evaluate ExOPD effectiveness for on-policy distillation across different model families.


## Links

- [arXiv](https://arxiv.org/abs/2602.12125)
- [PDF](https://arxiv.org/pdf/2602.12125)
- [Code](https://github.com/RUCBM/G-OPD)
