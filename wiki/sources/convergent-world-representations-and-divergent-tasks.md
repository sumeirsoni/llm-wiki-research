---
title: "Convergent World Representations and Divergent Tasks"
type: source
created: 2026-05-20
updated: 2026-07-11
arxiv_id: "2602.00533"
authors:
  - "Core Francisco Park"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2602.00533"
tags:
  - representation-learning
  - world-model
  - language
  - theory
aliases:
  - "Convergent World Representations"
  - "Divergent Tasks"
---

# Convergent World Representations and Divergent Tasks

## Summary

This paper studies how multi-task pretraining shapes internal world representations and how fine-tuning adapts them when new entities are added. Using a controlled World-Data-Model framework with real city coordinates and seven geometric tasks, Park shows that multi-task training drives representational convergence (supporting the Multitask Scaling Hypothesis), but certain "divergent tasks" such as distance prediction can fracture shared world geometry during fine-tuning.

## Key Contributions

- **World-Data-Model framework**: decouples the underlying world (5,075 city coordinates) from seven geometric task views and a small Qwen2 transformer.
- **Early stabilization**: linearly decodable world representations form within the first ~15% of training and remain stable while task loss continues improving.
- **Multi-task convergence**: CKA alignment increases with task count; all seven tasks can be learned jointly and reveal geographic structure in PCA.
- **Scaffolding effect**: the `crossing` task fails in isolation but learns when paired with any other task.
- **Divergent tasks**: fine-tuning on distance-like tasks can encode new "Atlantis" cities in hidden subspaces rather than integrating them into the shared world manifold.

## Methodology

The world consists of real cities projected to 2D coordinates. Seven tasks (`distance`, `triarea`, `angle`, `perimeter`, `compass`, `inside`, `crossing`) generate character-tokenized query-answer pairs. Models are 6-layer Qwen2 transformers with character-level tokenization.

Pretraining uses 42M rows across tasks. Fine-tuning adds 100 synthetic Atlantic cities ("Atlantis") and tests whether new entities integrate into the pretrained world representation. Representations are extracted from layer 5 residual stream at city-ID tokens. Analysis uses PCA, linear probing for coordinate recovery, and CKA similarity.

## Key Results

- Single-task training yields qualitatively different geometries: distance creates thread-like structures, angle forms 2D manifolds, compass fragments into clusters.
- Multi-task CKA rises monotonically with task count and reduces seed variability.
- Fine-tuning on non-divergent tasks integrates Atlantis cities seamlessly into the world map; divergent tasks leave them in separate hidden spaces with high probe error.
- Single-task CKA from pretraining partially predicts cross-task fine-tuning generalization, violating a naive "best-teacher" expectation.

## Connections

- Extends the [[world-models|world models]] theme from robotics/JEPA to controlled LLM world-representation geometry.
- Relates to [[representation-geometry|representation geometry]] and [[manifold-steering|Manifold Steering]] through its focus on intrinsic representational manifolds and their causal role in behavior.
- Provides mechanistic evidence relevant to the Platonic Representation Hypothesis and cautionary support for fractured-representation views during adaptation.
- [[aristotelian-representation-hypothesis|Aristotelian Representation Hypothesis]] cautions that raw CKA scaling trends used here may partly reflect width/depth confounders; local neighborhood metrics may be more reliable for cross-model convergence claims.
- Relevant to [[learn-from-your-own-latents|Learn from your own latents]]: token-level task learning can produce task-specific geometries that do not adapt coherently.

## Limitations & Open Questions

> [!open-question]
> Do divergent tasks exist in natural-language pretraining, and can they be predicted from gradient geometry before fine-tuning?

> [!open-question]
> How do these findings transfer to larger LLMs, vision-language models, or [[jepa|JEPA]]-style latent world models?

## Future Work

- Identify the mechanistic basis of task divergence and whether harmful tasks can be predicted from task structure and gradient geometry before training.
- Extend the World–Data–Model framework to study continual world adaptation when underlying entities change, beyond single-shot Atlantis fine-tuning.
- Characterize how representations evolve during inference-time and fine-tuning adaptation, not only during initial multi-task pretraining.
- Test whether forward-pass modularity and backward-pass modularity decouple in larger-scale natural settings, additional architectures, and modalities.

## Links

- [AlphaXiv](https://www.alphaxiv.org/overview/2602.00533)
- [arXiv](https://arxiv.org/abs/2602.00533)
