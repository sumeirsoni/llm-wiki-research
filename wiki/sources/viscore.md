---
title: "VIScore: Diagnosing Planning-Relevant Quality in Latent World Models"
type: source
created: 2026-08-20
updated: 2026-08-20
arxiv_id: "2608.11174"
authors:
  - "Haiyu Wu"
  - "Randall Balestriero"
  - "Morgan Levine"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.11174"
code_url: "https://github.com/HaiyuWu/viscore"
project_url: "https://haiyuwu.github.io/viscore/"
tags:
  - world-model
  - jepa
  - reinforcement-learning
  - representation-learning
aliases:
  - "VIScore"
---

# VIScore: Diagnosing Planning-Relevant Quality in Latent World Models

## Summary

VIScore evaluates latent world models through three planning-stack factors rather than static representation metrics alone: veracity, whether predicted latents remain on the data manifold; influence, whether actions produce distinguishable latent effects; and sobriety, whether planner-preferred imagined trajectories remain plausible rather than exploiting model errors. A calibrated product of these factors is designed to rank checkpoints by downstream planning success.

## Key Contributions

- Separates encoder-predictor compatibility, action-channel quality, and planner-induced hallucination into veracity, influence, and sobriety.
- Evaluates diagnostic transfer across checkpoints, regularization methods, tasks, and planner families.
- Shows that no single factor dominates across every distribution shift.
- Releases code, checkpoints, and result bundles for reproducing the diagnostic study.
- Identifies discrete contact or mode events as an important missing axis for continuous latent diagnostics.

## Methodology

The study builds large checkpoint pools of compact JEPA-style world models and evaluates them with CEM and several alternative planners on PushT, Reacher, Two-Room, Cube, and MAZE-style tasks. VIS factors are measured without fitting directly to every held-out success label, then mapped to predicted planning success through calibration. Comparisons include static probes, reconstruction or prediction metrics, effective rank, straightness, and factor ablations.

## Key Results

- On held-out checkpoints, full VIS reaches pooled rank correlation +0.91 with 7.0 calibration error; on held-out methods it reaches +0.75 with 8.3 error.
- Sobriety alone is strongest on development and held-out MAZE, but full VIS transfers best across checkpoints and methods.
- Across 18 planner-task cells, all rank correlations are positive, ranging from +0.29 to +0.91 with median +0.67.
- Planner-family transfer is much stronger for ranking than for universal score-to-success calibration.
- Cube exposes a failure case: influence saturates while a discrete gripper-closure event remains unmodeled, and development VIS correlation becomes negative.

## Connections

- Adds a diagnostic layer to [[world-models]] and [[sampling-based-latent-planning]] that evaluates representation, dynamics, and search jointly.
- Extends [[representation-geometry]] by treating geometry as system-relative: useful structure depends on the predictor and planner consuming the latent.
- Complements [[temporal-straightening|Temporal Straightening]]: straightness can help optimization but does not alone detect action insensitivity or planner exploitation.
- Connects directly to [[visreg|VISReg]], whose flexible representation regularization is tested within the planning stack.
- Provides a cross-model evaluation lens for [[robot-world-model-architectures]] while remaining validated mainly on compact JEPA-style models.
- Links to [[randall-balestriero|Randall Balestriero]].

## Limitations & Open Questions

- VIScore is diagnostic, not a guarantee of success or failure.
- It is designed for predictor-based search and is not validated for inverse-dynamics or amortized-policy planners.
- Continuous factors miss discrete events such as contact or gripper closure.
- Influence extrapolates one-step residual directions to longer horizons.
- Capacity clipping discards distinctions above the chosen threshold, especially on PushT.
- Calibration can fail across tasks or planners in different capacity regimes, and some planning evaluations use a single seed.

## Future Work

The authors call for multi-seed and mandatory OOD/long-horizon evaluation, diagnostics for inverse-dynamics and amortized planning, multi-task planning studies, harder training sets as short-horizon tasks saturate, and world-model training without action labels. Inferred follow-ups include hybrid-event factors, uncertainty-aware factor aggregation, and diagnostics for stochastic or multimodal predictors.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.11174)
- [arXiv](https://arxiv.org/abs/2608.11174)
- [PDF](https://arxiv.org/pdf/2608.11174)
- [HTML](https://arxiv.org/html/2608.11174v2)
- [Project](https://haiyuwu.github.io/viscore/)
- [Code](https://github.com/HaiyuWu/viscore)
- [Checkpoints](https://huggingface.co/BooBooWu/viscore)
- [Dataset and results](https://huggingface.co/datasets/BooBooWu/viscore)
