---
title: "Self-Supervised Visual On-Policy Distillation"
type: source
created: 2026-08-20
updated: 2026-08-20
arxiv_id: "2608.14144"
authors:
  - "Yijiang Li"
  - "Yijun Liang"
  - "Yunjie Tian"
  - "Bingyang Wang"
  - "Ke Zhang"
  - "Zhenfei Yin"
  - "Di Fu"
  - "Philip Torr"
  - "Nuno Vasconcelos"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.14144"
project_url: "https://williamium3000.github.io/s2vopd/"
tags:
  - self-distillation
  - self-supervised-learning
  - vision
aliases:
  - "S²VOPD"
  - "S2VOPD"
---

# Self-Supervised Visual On-Policy Distillation

## Summary

Self-Supervised Visual On-Policy Distillation (S²VOPD) creates teacher-student privilege without a stronger teacher, reference answers, or external rewards. The EMA teacher sees a clean image, while the student generates trajectories from an information-reduced view. The teacher scores those student prefixes using the clean observation, turning recoverable visual evidence removed by augmentation into dense on-policy supervision.

## Key Contributions

- Extends on-policy distillation to visual reasoning with clean-view teacher and degraded-view student asymmetry.
- Studies information reduction, geometric alteration, photometric alteration, and occlusion as sources of self-supervised privilege.
- Uses generalized Jensen-Shannon divergence over teacher top-$k$ vocabulary predictions.
- Identifies a non-monotonic optimum: enough corruption to create a useful predictive gap, but not enough to change the task or remove answer-critical evidence.
- Shows that asymmetric observation access, rather than teacher evolution alone, drives most of the reported gain.

## Methodology

The student samples answers from transformed image $T(x)$, while an EMA teacher evaluates the same prefixes from the clean image $x$. The default transformation downscales by a factor sampled from 0.3 to 0.6 without resizing back, then optionally applies Gaussian diffusion noise. Training uses Qwen3.5-4B and 9B, FineVision-12K or Vision-OPD-6K, eight rollouts per prompt, and 65 or 130 optimization steps.

The paper evaluates six fine-grained perception benchmarks and three mathematical visual-reasoning benchmarks. Controlled baselines include symmetric self-distillation, OPSD, privileged Vision-OPD, and self-rewarding RL methods.

## Key Results

- On six perception benchmarks, S²VOPD-4B raises the average from 70.68 to 77.44, a 6.76-point gain.
- Under a controlled nine-benchmark setup, 4B improves from 70.30 to 75.33 and exceeds the strongest listed self-rewarding RL baseline by 2.03 points.
- At 9B, S²VOPD reaches 76.35 versus 72.91 for the base and 76.56 for privileged Vision-OPD.
- Symmetric self-distillation averages 65.21 versus 70.58 for the base, while information-reduction asymmetry reaches 75.65.
- Removing augmentation loses 5.83 points; freezing the teacher loses only 0.40, indicating that observation asymmetry supplies most of the benefit.
- Symmetric JSD scores 76.05 versus 74.74 for forward KL and 75.49 for reverse KL in the divergence ablation.

## Connections

- Extends [[on-policy-distillation]] beyond language reasoning into visual perception.
- Adds observation-derived privilege to [[self-distillation]], distinct from stronger teachers, answers, or retrieved latent context.
- Connects to [[self-supervised-learning]] through augmentation-generated supervision, though its objective distills behavior rather than only representations.
- Closely parallels [[foveal-ssl|Foveal SSL]], where teacher and student have unequal visual access, and [[self-flow|Self-Flow]], where the teacher receives cleaner inputs.
- Partially closes the visual-modality gap identified by [[on-policy-representation-distillation|OPRD]], but remains output-space rather than hidden-state distillation.

## Limitations & Open Questions

- Augmentations must preserve the question and correct answer; cropping, geometry changes, OCR corruption, or identity loss can invalidate supervision.
- Training evidence covers only Qwen3.5-4B and 9B, two small corpora, and nine benchmarks.
- Evaluation budgets differ between augmentation search and main tables, and some scoring uses a model judge.
- The paper does not provide compute-normalized comparisons against every baseline.
- The project repository does not clearly establish a released full training implementation.
- A discrepancy remains between prose-reported perception gains and averages computed from displayed table values.

## Future Work

The paper states no explicit future-work program beyond the design principle that useful asymmetry must remove information without changing the task. Inferred directions include question-conditioned or learned augmentation policies, answer-preservation estimators, larger and cross-family students, additional modalities, equal-compute comparisons, and formal characterization of task-consistent information removal.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.14144)
- [arXiv](https://arxiv.org/abs/2608.14144)
- [PDF](https://arxiv.org/pdf/2608.14144)
- [HTML](https://arxiv.org/html/2608.14144v1)
- [Project](https://williamium3000.github.io/s2vopd/)
- [Project repository](https://github.com/williamium3000/s2vopd)
