---
title: "Representation Geometry"
type: concept
created: 2026-05-16
updated: 2026-09-09
tags:
  - representation-learning
  - theory
sources:
  - "[[global-geometry-is-not-enough]]"
  - "[[manifold-steering]]"
  - "[[steerable-visual-representations]]"
  - "[[sub-jepa]]"
  - "[[convergent-world-representations-and-divergent-tasks]]"
  - "[[on-the-geometry-of-on-policy-distillation]]"
  - "[[on-policy-representation-distillation]]"
  - "[[temporal-straightening]]"
  - "[[dino-wm]]"
  - "[[is-one-layer-enough-rl-training]]"
  - "[[phf]]"
  - "[[aristotelian-representation-hypothesis]]"
  - "[[intelligence-from-learnable-novelty]]"
  - "[[patch-policy]]"
  - "[[lost-in-backpropagation]]"
  - "[[jepa-paradox-in-language]]"
  - "[[viscore]]"
  - "[[looped-transformers-jacobian-lens]]"
  - "[[latent-geometry-beyond-search]]"
  - "[[convergeflow]]"
aliases:
  - "Embedding geometry"
  - "Representation manifolds"
---

# Representation Geometry

## Overview

Representation geometry studies the structure of learned embedding spaces: their global distribution, local sensitivity, manifolds, and how those structures affect downstream behavior. The newer papers in this wiki complicate a simple "good geometry equals good representation" story.

## Global vs. Functional Geometry

[[global-geometry-is-not-enough|Global Geometry Is Not Enough]] shows that global isotropy and participation ratio do not predict compositional binding across vision encoders. Jacobian Effective Rank, which measures local input-output sensitivity, is much more predictive.

This matters for [[lejepa|LeJEPA]] and [[sub-jepa|Sub-JEPA]] because Gaussian regularization improves stability, but global geometric regularity alone may not guarantee compositional or action-relevant structure.

[[looped-transformers-jacobian-lens|Looped Transformers under the Jacobian Lens]] applies a related functional test to recurrent language models. Virtual-unrolling treats each firing of a tied block as a layer, then measures whether a hidden state remains readable, transports across recurrence, and changes behavior under intervention. The paper finds that these properties can separate: Huginn carries self-computed content into a verbal report at 98% but has no top-1 causal introspection successes in 97 tests. A stable or decodable representation is therefore not enough to establish that recurrence preserves a causally usable workspace.

## Observer-Relative Decodability

[[intelligence-from-learnable-novelty|Intelligence from Learnable Novelty]] adds an observer-relative view of representation quality. A code is rewarded when a capacity-limited reservoir can recover many independent, nonredundant directions from it. On [[mnist|MNIST]], maximizing this score raises both linear-probe and 5-nearest-neighbor accuracy to 0.89 without labels, while weak readout regularization or low spectral resolution can destroy the class structure.

This result links geometry to a specific functional test: what a bounded observer can decode. It also cautions that the resulting geometry is not intrinsic to the encoder alone. Reservoir width, locality, and regularization define which factors appear simple enough to count as [[learnable-novelty|learnable]].

## Cross-Model Similarity and the Aristotelian Hypothesis

[[aristotelian-representation-hypothesis|Revisiting the Platonic Representation Hypothesis]] adds a methodological layer: raw CKA, RV, Procrustes, and max-over-layer summaries are **confounded by width and depth**, so uncorrected scaling trends can mimic convergence.

After permutation null-calibration:
- **Global spectral/geometric metrics** (CKA, RV, SVCCA, Procrustes) lose cross-modal scaling trends between vision and language.
- **Local neighborhood metrics** (mKNN, cycle-kNN, CKNNA) retain calibrated alignment that grows with model capacity.
- Models agree on **neighbor identity** (topological relations) more than on **exact local distances** (small-bandwidth CKA-RBF shows no calibrated alignment).

The proposed **Aristotelian Representation Hypothesis** refines the Platonic one: convergence is primarily in shared local neighborhood structure, not global second-order geometry. This cautions against interpreting raw CKA increases — as in [[convergent-world-representations-and-divergent-tasks|multi-task CKA convergence]] — without width/depth calibration or complementary local metrics.

## Conditional and System-Relative Geometry

[[jepa-paradox-in-language|The JEPA Paradox in Language]] adds conditional target geometry: a globally non-collapsed representation can still be unsuitable for deterministic prediction if one context maps to several separated valid targets. This distinguishes marginal covariance health from whether a single conditional centroid is meaningful.

[[viscore|VIScore]] adds system-relative geometry for world models. Veracity, action influence, and planner sobriety ask whether the representation works with a specific predictor and search process, rather than whether its static geometry looks regular in isolation.

[[latent-geometry-beyond-search|GC-IDM]] tests a different functional claim about geometry. A smooth and action-sensitive LeWM latent can make goal-conditioned inverse recovery local enough to learn offline. The controller's closed-loop success and large speedup over CEM support the claim on four tasks, while its Push-T degradation with goal distance marks a boundary for local recovery.

[[convergeflow|ConvergeFlow]] adds finite-support geometry in language. Its continuous state is constrained to the convex hull of vocabulary embeddings, and its flow is designed to approach one embedding at the data endpoint. The result shows that a useful continuous representation may need both smooth interior structure and a discrete endpoint set.

## Manifold Geometry and Control

[[manifold-steering|Manifold Steering]] argues that intrinsic activation manifolds are causally tied to model behavior. Steering along a fitted manifold produces smoother behavioral trajectories than straight-line activation interpolation, suggesting that useful representation geometry can be curved and task-specific.

## Task-Dependent and Divergent Geometry

[[convergent-world-representations-and-divergent-tasks|Convergent World Representations and Divergent Tasks]] shows that single-task training yields distinct world geometries for the same underlying entities, while multi-task training drives CKA convergence. However, fine-tuning on divergent tasks can fracture shared manifolds when integrating new entities, revealing a gap between forward coherence and backward adaptability.

## Prompt-Steered Geometry

[[steerable-visual-representations|Steerable Visual Representations]] adds another axis: text prompts can reorganize visual embedding spaces toward queried objects, parts, or attributes. This is not just a better static embedding; it is a controllable representation whose geometry depends on the task prompt.

## Trajectory Geometry for Planning

[[temporal-straightening|Temporal Straightening]] adds a control-relevant geometric criterion: **latent trajectory curvature**. Pretrained DINOv2 features ([[dino-wm|DINO-WM]]) encode rich semantics but produce highly curved latent paths where Euclidean distance misaligns with geodesic (shortest-action) distance. Penalizing curvature during JEPA world model training straightens trajectories, improves planning Hessian conditioning, and makes gradient-based MPC viable. This complements global isotropy metrics ([[lejepa|LeJEPA]]) with geometry tailored to dynamical reachability.

## Spatial Granularity as Functional Geometry

[[patch-policy|Patch Policy]] adds another control-relevant axis: whether the downstream model receives the spatial arrangement of local visual tokens at all. Its learned compression ablation reduces 256 patch positions to 64, 16, 4, or 1 and sharply lowers Push-T performance. This supports [[dense-visual-representations]] as a distinct functional property: pooling changes which local relations remain accessible, while trajectory-curvature and Jacobian analyses characterize the geometry of the retained features.

## Parameter-Space Update Geometry

[[on-the-geometry-of-on-policy-distillation|On the Geometry of On-Policy Distillation]] extends geometric analysis from embedding spaces to **parameter-space update trajectories** during LLM post-training. On-policy distillation occupies a relaxed off-principal regime between SFT (dense, principal-aligned) and RLVR (sparse, off-principal), with subspace locking — cumulative updates rapidly enter a narrow low-dimensional channel that is functionally sufficient.

[[on-policy-representation-distillation|OPRD]] shows that hidden-state geometry can differ substantially from output distributions: the LM head's null space hides representational differences that output-space distillation cannot see. Representation-level alignment provides strictly richer supervision than token-level KL alone.

[[lost-in-backpropagation|Lost in Backpropagation]] identifies the complementary backward geometry formalized by the [[lm-head-gradient-bottleneck]]: a high-rank vocabulary-space error is projected through a width-limited output map before reaching the backbone. The paper reports 95-99% of logit-gradient Frobenius norm in directions annihilated by the head transpose, but removed norm is not automatically equivalent to useful learning signal. Effective rank, spectral decay, and alignment of the surviving direction therefore complement parameter-trajectory diagnostics.

[[phf|PHF]] adds a trajectory-geometry variant inside on-policy self-distillation: instead of pointwise hidden-state matching, it aligns token-to-token hidden transitions and within-trajectory Gram structure. This suggests that OPRD geometry should be measured not only by hidden-state cosine/MSE, but also by hidden **motion** along generated rollouts.

For OPRD follow-up experiments, the key parameter-space diagnostics from [[on-the-geometry-of-on-policy-distillation|OPD Geometry]] are stable rank, Frobenius norm, Hill tail shape, subspace similarity to the final update channel, and rank-constrained training. The open question is whether hidden-state supervision preserves OPD's early low-rank lock, expands it by adding representation-level directions, or shifts it into a distinct subspace.

## Layer-Wise Functional Geometry in RL

[[is-one-layer-enough-rl-training|Is One Layer Enough?]] adds a **depth-axis** to post-training geometry: RL improvement is not uniformly distributed across transformer layers. **Layer contribution** $C(k)$ measures what fraction of full-parameter RL gain a single layer can absorb in isolation. High-contribution layers concentrate at ~40–60% network depth across model families, RL algorithms, and task domains, with rankings stable across datasets and even math vs code tasks.

Notably, full-parameter RL produces **uniform per-layer weight change magnitudes** despite this highly non-uniform contribution profile — the effectiveness of a layer's parameter subspace for RL adaptation dissociates from how much its weights move during joint training. This parallels the dissociation between update geometry and functional outcome in [[on-the-geometry-of-on-policy-distillation|OPD geometry]], but along the interpretable axis of transformer depth. See [[layer-contribution-rl]] for the full concept treatment.

## Open Questions

> [!open-question]
> What combination of global regularity, local Jacobian sensitivity, and manifold structure best predicts transfer in real downstream tasks?

> [!open-question]
> Can representation geometry diagnostics guide the design of robot [[world-models|world models]], where latent spaces must preserve both semantics and controllable physical dynamics?

> [!open-question]
> Does [[on-policy-representation-distillation|OPRD]] alter OPD's parameter-space subspace lock, and do contrastive or hidden-flow objectives change that trajectory differently from pointwise MSE?
