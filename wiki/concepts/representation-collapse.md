---
title: "Representation Collapse"
type: concept
created: 2026-04-10
updated: 2026-09-04
tags:
  - representation-learning
  - self-supervised-learning
  - optimization
sources:
  - "[[obsessed-encoder]]"
  - "[[remove-symmetries]]"
  - "[[lejepa]]"
  - "[[leworldmodel]]"
  - "[[rethinking-jepa]]"
  - "[[v-jepa-2-1]]"
  - "[[self-flow]]"
  - "[[sub-jepa]]"
  - "[[elucidating-representation-degradation]]"
  - "[[global-geometry-is-not-enough]]"
  - "[[visreg]]"
  - "[[sensorimotor-world-models]]"
  - "[[delta-jepa]]"
  - "[[levljepa]]"
  - "[[orthogonal-jepa]]"
  - "[[lpwm]]"
  - "[[levjepa]]"
aliases:
  - "Collapse"
  - "Mode collapse"
  - "Representation collapse"
---

# Representation Collapse

## Overview

Representation collapse occurs when a [[self-supervised-learning|self-supervised learning]] model learns to map all inputs to the same (or very similar) embedding, trivially minimizing the predictive loss. This is a fundamental problem in [[jepa|JEPA]] and contrastive learning — the model finds a degenerate shortcut rather than learning useful representations.

## Why It Happens

In JEPA, the model predicts masked embeddings from visible embeddings. The trivial solution: if both the encoder and predictor output constant vectors, the prediction loss is zero. The model has no incentive to learn meaningful representations.

## Prevention Mechanisms

The papers in this wiki offer several different approaches to preventing collapse or collapse-like degradation:

### 1. EMA Teacher ([[v-jepa-2-1|V-JEPA 2.1]])
- Teacher network is an exponentially moving average of the student
- Teacher updates slowly, providing relatively stable targets
- Student can't collapse because teacher output evolves independently
- **Criticism**: [[lejepa|LeJEPA]] and [[rethinking-jepa|SALT]] argue this is a heuristic without theoretical justification

### 2. SIGReg Regularization ([[lejepa|LeJEPA]], [[leworldmodel|LeWM]])
- Explicitly regularize embeddings to follow an isotropic Gaussian distribution
- Theoretically motivated: isotropic Gaussian is provably optimal for downstream risk
- Linear time and memory complexity
- **Advantage**: No heuristics, single hyperparameter

### 3. Frozen Teacher ([[rethinking-jepa|SALT]])
- Pre-train teacher with pixel reconstruction, then freeze it
- Static targets guarantee no collapse — teacher can't degenerate
- **Advantage**: Decouples teacher and student optimization
- **Surprising finding**: Teacher quality barely matters

### 4. Multi-Layer Distillation ([[bootleg|Bootleg]])
- Distill from multiple hidden layers, not just the final layer
- Multi-scale targets are harder to collapse than single-scale
- **Advantage**: Richer supervision signal

### 5. Reconstruction ([[self-flow|Self-Flow]], [[mae|MAE]])
- Model must produce actual outputs (pixels/tokens) that match targets
- Collapse would make reconstruction impossible — structurally prevents degenerate solutions
- **Note**: [[self-flow|Self-Flow]] uses EMA *in addition to* reconstruction; whether reconstruction alone suffices is an open question
- **Advantage**: No explicit regularization needed; inherent to the objective

### 6. VISReg ([[visreg|VISReg]])
- Decouples scale, shape, and centering with sliced Wasserstein distance on normalized projections
- Maintains strong gradients under near-collapse, unlike SIGReg's diminishing corrective signal
- **Advantage**: Full distributional shape control with O(N D K) scaling and strong OOD generalization

### 7. Subspace Gaussian Regularization ([[sub-jepa|Sub-JEPA]])
- Keeps the Gaussian anti-collapse idea from [[lejepa|LeJEPA]] / [[leworldmodel|LeWorldModel]]
- Applies it in multiple frozen low-dimensional orthogonal subspaces instead of the full ambient embedding space
- **Advantage**: Reduces the excessive bias of a full isotropic prior when task dynamics lie on low-dimensional manifolds

### 8. Inverse Dynamics — Endpoint Concatenation ([[sensorimotor-world-models|SMWM]])
- Add inverse dynamics head predicting $a_t$ from $(z_t, z_{t+1})$
- Collapsed encoder cannot recover actions → high $\mathcal{L}_{inv}$ prevents degenerate solutions
- **Advantage**: Single task-aligned term; also biases latents toward controllable DoF and filters distractors ("perception for action")
- **Tradeoff**: When the forward predictor is action-conditioned, $z_{t+1}$ may absorb action-correlated cues that support inverse decoding without modeling the transition itself ([[delta-jepa|Delta-JEPA]] ablation)

### 9. Latent Difference Action Decoding ([[delta-jepa|Delta-JEPA]])
- Decode $a_t$ from displacement $\Delta z_t = z_{t+1} - z_t$ only, not concatenated endpoints
- Anti-collapse: collapsed adjacent states yield uninformative $\Delta z_t$
- **Advantage**: Forces action information into transition geometry; +4 to +12.6 pp planning gain over concat inverse on LeWM-style benchmarks
- **Tradeoff**: Still assumes actions are recoverable from single-step latent displacements

### 10. Cross-Modal Predictors + SIGReg ([[levljepa|LeVLJEPA]])
- Vision-language extension: asymmetric cross-modal MSE with stop-gradient targets + per-modality SIGReg
- Direct symmetric image–text MSE collapses even with SIGReg; predictors absorb cross-modal asymmetry (SimSiam-style)
- **Advantage**: Non-contrastive VLP without negatives/temperature/momentum; batch-size invariant; strong dense patch features
- **Tradeoff**: Weaker zero-shot than CLIP/SigLIP (objectives optimize different readouts)

### 11. Parameter-Space Symmetry Removal ([[remove-symmetries|syre]])
- A distinct failure mode from the constant-embedding collapse above: reflection symmetries of the loss (implied by permutation/rescaling/rotation invariance) create low-capacity parameter configurations that weight decay actively seeks, producing dead neurons and rank shrinkage
- Fix: train on $\ell(\theta + \theta_0) + \gamma\|\theta\|^2$ with a fixed random bias $\theta_0$; provably removes all countable reflection symmetries (anisotropic $D$ for rotation-type), with an $\Omega(\gamma\sigma_0)$ escape force at symmetric saddles
- Evidence: SimCLR last-layer low-rankness 70% → 0% and last-layer linear accuracy 22.2% → 32.5% on CIFAR-100; VAE posterior-collapse mitigation; maintained rank/returns in continual learning and PPO
- **Key distinction**: this targets *parameter-space* traps. JEPA's constant-embedding solution is a global optimum that does not require parameters to sit anywhere symmetric, so syre's guarantees do not reach it. Closest tested SSL case is SimCLR, whose negatives already block trivial collapse
- **Advantage**: One-line, model-agnostic, symmetry-agnostic, negligible overhead; stacks in principle with any mechanism above
- **Status**: Never combined with EMA, SIGReg, or [[world-models|world-model]] training - untested for this wiki's core use case

### 12. Orthogonal Predictive Factorization ([[orthogonal-jepa|OJEPA]])
- Splits one monolithic JEPA prediction into K branches over learned orthogonal basis subspaces; per-factor regression plus within-basis orthonormality, cross-basis orthogonality, factor-activity variance floors, and coordinate-wise encoder-variance floors
- **Motivation**: monolithic states allocate redundant capacity to dominant signals while giving weak gradients to less dominant structure - the allocation problem behind [[feature-suppression|feature suppression]]
- **Advantage**: each branch must minimize its own local error, so easy-to-predict components cannot drown out harder ones; consistent gains across vision, transcriptomics, health records, control (Walker2d-v5 45.1 vs 4.9 return), and molecular dynamics
- **Caveat**: geometric orthogonality is not semantic disentanglement

### 13. Sparse Distribution Matching ([[lpwm|LpWM]])
- RDMReg matches random-projection marginals of rectified features to a **Rectified Generalized Gaussian** (default Rectified Laplace, p=1) via 2-Wasserstein distance - a deliberately *non-maximum-entropy*, sparsity-inducing target family
- Dense isotropic Gaussians ([[lejepa|SIGReg]], [[leworldmodel|LeWM]]) are the p=2 no-ReLU special case; exact zeros come from a RepReLU reparameterization (forward ReLU, backward GeLU gradients) used as an optimization safeguard, not as collapse defense - no stop-gradient needed
- **Advantage**: trains stably while producing ~30-65% active coordinates; on PushT the resulting codes need less predictor capacity for successful planning than dense ones ([[lpwm|LpWM]])
- **Significance for this page**: demonstrates maximum-entropy density is not required for non-degenerate embeddings - the target distribution can be shaped for the downstream task (dynamics simplicity), not just for anti-collapse

### 14. Video SIGReg Without Architectural Heuristics ([[levjepa|LeVJEPA]])
- Uses a single shared video encoder with an invariance MSE plus SIGReg, allowing gradients through both global and local views without an EMA target, predictor, stop-gradient, or masked reconstruction decoder.
- Extreme random token dropping reduces the processed sequence and acts as a stochastic augmentation; the default 95% drop rate improves the reported ImageNet probe over processing all tokens.
- **Scope**: this addresses constant-vector collapse, not the feature-allocation failure in [[feature-suppression|feature suppression]]. Patch tokens are emergent and unsupervised, so their usefulness for dense control or segmentation remains open.

## Related Degradation Modes

Not all failures are total constant-vector collapse:

- [[feature-suppression|Feature suppression]] is the harder-to-detect partial regime: a low-entropy predictable feature captures most of the latent budget while training metrics stay healthy. [[obsessed-encoder|The Obsessed Encoder]] reproduces it in DINOv3, [[lejepa|LeJEPA]], and [[leworldmodel|LeWM]] - showing that every mechanism catalogued above constrains embedding *statistics* but not *information content*, and the collapsed solution even achieves lower training loss than the honest one.
- [[elucidating-representation-degradation|Elucidating Representation Degradation]] identifies a diffusion-specific failure where high-noise regimes distort and collapse predicted geometry through recoverability mismatch and Bayes-noise gradient contamination.
- [[global-geometry-is-not-enough|Global Geometry Is Not Enough]] shows a softer failure mode: representations may have healthy global geometry while their Jacobian sensitivity collapses along directions needed for compositional binding.
- [[remove-symmetries|syre]] reframes several classically separate failures - dead neurons, posterior collapse, loss of plasticity - as one mechanism: entrapment in symmetry-induced low-capacity parameter states, distinct from constant-embedding collapse.

## Open Debate

See [[ema-vs-non-ema-collapse-prevention]] for a filed comparison.

> [!contradiction]
> There is no consensus on the best approach. [[v-jepa-2-1|V-JEPA 2.1]] achieves SOTA with EMA, but [[rethinking-jepa|SALT]] outperforms V-JEPA 2 without EMA, and [[lejepa|LeJEPA]] provides theoretical arguments against EMA. The field is actively debating whether EMA is a feature or a crutch.

> [!open-question]
> Do these collapse prevention mechanisms interact? Could SIGReg + frozen teacher + multi-layer distillation be combined?

> [!open-question]
> Is reconstruction alone sufficient to prevent collapse in teacher-student frameworks? [[self-flow|Self-Flow]] uses EMA + reconstruction together, but whether removing EMA (and possibly adding SIGReg) would work remains untested.

> [!open-question]
> How should collapse prevention balance global distributional regularity against local functional sensitivity and task-intrinsic latent geometry?
