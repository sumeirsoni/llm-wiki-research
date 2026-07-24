---
title: "Contrastive Representation Distillation"
type: source
created: 2026-07-08
updated: 2026-07-11
arxiv_id: "1910.10699"
authors:
  - "Yonglong Tian"
  - "Dilip Krishnan"
  - "Phillip Isola"
year: 2020
venue: "ICLR"
pdf_path: "https://arxiv.org/pdf/1910.10699"
code_url: "https://github.com/HobbitLong/RepDistiller"
tags:
  - contrastive-learning
  - self-distillation
  - representation-learning
  - model-compression
aliases:
  - "CRD"
  - "Contrastive Representation Distillation"
---

# Contrastive Representation Distillation

## Summary

Contrastive Representation Distillation (CRD) reframes teacher-student representation transfer as a contrastive learning problem. Instead of matching logits or applying a pointwise feature loss, the student learns to bring its representation of an input close to the teacher representation for the same input while separating it from teacher/student representations of other inputs. The paper argues that this captures structural information in the teacher representation that factored KL or MSE objectives ignore.

## Key Contributions

- **Contrastive KD objective**: treats teacher-student pairs from the same example as positives and mismatched examples as negatives.
- **Mutual-information view**: derives the objective as optimizing a lower bound on mutual information between teacher and student representations.
- **Memory buffer implementation**: avoids requiring huge batches by storing features for many negative examples.
- **Broad transfer settings**: improves model compression, ensemble distillation, and cross-modal transfer; can combine with standard KD.

## Methodology

CRD projects teacher and student features into a shared normalized space and uses a contrastive objective over one positive pair and many negatives. Negatives are drawn through a memory buffer keyed by dataset index, so the method decouples the number of negatives from the batch size. The paper evaluates mostly vision settings, but the objective is representation-level and architecture-agnostic.

## Relevance to OPRD

For [[on-policy-representation-distillation|OPRD]], CRD is the cleanest baseline for replacing pointwise hidden-state MSE with a relational objective. It suggests three design questions:

- What is the positive pair: same prompt-token-layer, same rollout segment, or final answer-equivalent trajectories?
- What are valid negatives on on-policy rollouts without pushing apart semantically equivalent reasoning paths?
- Does a memory bank remain meaningful when the student policy changes during training?

## Limitations & Open Questions

> [!open-question]
> CRD assumes examples have stable identities and negatives are meaningfully different. On-policy reasoning rollouts may create false negatives when different traces solve the same problem.

> [!open-question]
> The objective was validated mostly for fixed-dataset representation transfer, not for changing student-generated contexts.

## Future Work

- The paper does not spell out explicit future directions beyond demonstrating CRD across model compression, cross-modal transfer, and ensemble distillation, and arguing that contrastive objectives are a simple, consistently strong alternative to KD.

## Links

- [arXiv](https://arxiv.org/abs/1910.10699)
- [PDF](https://arxiv.org/pdf/1910.10699)
- [Code](https://github.com/HobbitLong/RepDistiller)
