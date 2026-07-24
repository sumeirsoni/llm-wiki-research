---
title: "Contrastive Distillation on Intermediate Representations for Language Model Compression"
type: source
created: 2026-07-08
updated: 2026-07-11
arxiv_id: "2009.14167"
authors:
  - "Siqi Sun"
  - "Zhe Gan"
  - "Yu Cheng"
  - "Yuwei Fang"
  - "Shuohang Wang"
  - "Jingjing Liu"
year: 2020
venue: "EMNLP"
pdf_path: "https://arxiv.org/pdf/2009.14167"
tags:
  - language
  - contrastive-learning
  - self-distillation
  - model-compression
aliases:
  - "CoDIR"
  - "Contrastive Distillation on Intermediate Representations"
---

# Contrastive Distillation on Intermediate Representations for Language Model Compression

## Summary

CoDIR adapts [[contrastive-representation-distillation|CRD]] to Transformer language-model compression. It argues that L2 hidden-state matching assumes independent hidden dimensions and misses higher-order structure in teacher intermediate representations. CoDIR mean-pools intermediate representations, projects teacher and student features into a shared space, and applies an InfoNCE-style contrastive loss with memory-bank negatives during pretraining or finetuning.

## Key Contributions

- **Contrastive intermediate-layer distillation for NLP**: replaces simple L2 hidden matching with a contrastive objective over teacher-student representations.
- **Mean-pooled hidden targets**: finds mean pooling over token representations more effective than using only the `[CLS]` token.
- **Memory-bank negatives**: makes large negative sets practical without requiring many extra teacher/student forward passes.
- **Compression results**: trains a half-size Transformer that is competitive with BERT-base on GLUE while retaining roughly 2x inference speedup.

## Methodology

The final objective combines task loss, output KD, and contrastive representation distillation:

$$L = L_{CE} + \alpha_1 L_{KD} + \alpha_2 L_{CRD}.$$

For each example, CoDIR obtains layer-wise mean-pooled teacher and student hidden summaries, maps them into a common low-dimensional space, and applies a contrastive loss where the matching teacher-student pair is positive and sampled non-matching examples are negatives. In finetuning, negatives can be label-aware; in pretraining, negatives are sampled from nearby minibatch examples as hard unsupervised negatives.

## Relevance to OPRD

CoDIR is the most direct precedent for **contrastive OPRD** in language models. It suggests that a contrastive OPRD variant should not blindly contrast every token-level hidden state; it may need pooling or segment-level summaries to avoid an enormous token-layer objective. Its memory-bank design is useful but risky for on-policy training because stored representations become stale as the student changes.

## Limitations & Open Questions

> [!open-question]
> CoDIR is off-policy and classification-oriented; it does not address autoregressive rollouts, prefix drift, or teacher reliability along generated traces.

> [!open-question]
> Label-aware negative sampling is unavailable for most reasoning rollouts unless correctness, answer class, or trajectory cluster labels are added.

## Future Work

- Investigate stronger teachers beyond BERT-base/RoBERTa-base, such as Megatron-LM-scale language models.
- Explore different strategies for choosing hard negatives to further boost compression performance.

## Links

- [arXiv](https://arxiv.org/abs/2009.14167)
- [PDF](https://arxiv.org/pdf/2009.14167)
- [ACL Anthology](https://aclanthology.org/2020.emnlp-main.36/)
