---
title: "Filter, Then Reweight: Rethinking Optimization Granularity in On-Policy Distillation"
type: source
created: 2026-07-08
updated: 2026-07-11
arxiv_id: "2606.02684"
authors:
  - "Yuying Li"
  - "Leqi Zheng"
  - "Yongzi Yu"
  - "Wenrui Zhou"
  - "Xuchang Zhong"
  - "Xing Hu"
  - "Jing Jin"
  - "Hangjie Yuan"
  - "Tao Feng"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.02684"
code_url: "https://github.com/YuYingLi0/FiRe-OPD"
tags:
  - language
  - self-distillation
  - optimization
aliases:
  - "FiRe-OPD"
  - "Filter Then Reweight"
---

# Filter, Then Reweight: Rethinking Optimization Granularity in On-Policy Distillation

## Summary

FiRe-OPD argues that OPD should select learning signal at both trajectory and token granularities. It first filters trajectories where the teacher assigns low normalized likelihood, then softly reweights tokens within retained trajectories by combining teacher confidence and student confusion. This addresses a limitation of hard token selection: permanently discarding tokens can lose useful partial supervision and create brittle optimization.

## Key Contributions

- **Two-level granularity**: combines trajectory-level filtering with token-level weighting.
- **Teacher competence filter**: removes rollouts with low teacher likelihood, where teacher supervision is likely unreliable.
- **Soft token weights**: multiplicatively combine teacher confidence and student confusion, then normalize within each trajectory.
- **Empirical gains**: improves over OPD and recent token-level OPD methods in strong-to-weak, single-teacher, and multi-teacher settings.
- **Granularity finding**: hard filtering is better at trajectory level; soft weighting is better at token level.

## Methodology

FiRe-OPD ranks rollouts in a batch by the teacher's average log-probability and drops the lowest-scoring fraction. For retained trajectories, each token receives a weight:

$$w_t = (1 + \alpha c_t^T)(1 + \beta c_t^S),$$

where teacher confidence is derived from teacher entropy and student confusion from student entropy. The weights rescale OPD token advantages after within-trajectory normalization.

## Relevance to OPRD

FiRe-OPD is a strong template for **position-aware OPRD** because hidden-state targets may also vary by trajectory and token:

- trajectory filtering can remove rollouts where teacher hidden states are supervising far outside the teacher's preferred path;
- token weighting can combine teacher confidence, student uncertainty, and OPRD hidden discrepancy;
- soft weighting is likely safer than hard deletion when aligning all-layer representations.

## Limitations & Open Questions

> [!open-question]
> FiRe-OPD treats token informativeness mostly independently after trajectory filtering; it does not model cumulative prefix drift as directly as [[on-the-position-bias-of-on-policy-distillation|IW-OPD]].

> [!open-question]
> The method is output-space OPD; it does not test whether the same weights are optimal for hidden-state alignment.

## Future Work

- Prefix-aware token weighting that models how erroneous prefixes degrade subsequent teacher signals, rather than treating each token independently.
- Intermediate granularities between trajectory and token level—step-level or segment-level weighting aligned with chain-of-thought structure.
- Broader exploration of the adaptive distillation granularity design space beyond the current dual-level hard-filter / soft-weight scheme.

## Links

- [arXiv](https://arxiv.org/abs/2606.02684)
- [PDF](https://arxiv.org/pdf/2606.02684)
- [Code](https://github.com/YuYingLi0/FiRe-OPD)
