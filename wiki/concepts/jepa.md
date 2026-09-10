---
title: "Joint-Embedding Predictive Architecture (JEPA)"
type: concept
created: 2026-04-10
updated: 2026-09-04
tags:
  - jepa
  - self-supervised-learning
  - representation-learning
sources:
  - "[[causal-jepa]]"
  - "[[lejepa]]"
  - "[[leworldmodel]]"
  - "[[rethinking-jepa]]"
  - "[[bootleg]]"
  - "[[v-jepa-2-1]]"
  - "[[sub-jepa]]"
  - "[[visreg]]"
  - "[[learn-from-your-own-latents]]"
  - "[[temporal-difference-vision]]"
  - "[[adajepa]]"
  - "[[temporal-straightening]]"
  - "[[dino-wm]]"
  - "[[sensorimotor-world-models]]"
  - "[[delta-jepa]]"
  - "[[levljepa]]"
  - "[[jepa-paradox-in-language]]"
  - "[[generalization-theory-for-jepa-world-models]]"
  - "[[obsessed-encoder]]"
  - "[[orthogonal-jepa]]"
  - "[[lpwm]]"
  - "[[levjepa]]"
  - "[[better-slots-better-worlds]]"
  - "[[semigroup-jepa]]"
aliases:
  - "JEPA"
  - "I-JEPA"
  - "V-JEPA"
---

# Joint-Embedding Predictive Architecture (JEPA)

## Overview

JEPA is a family of [[self-supervised-learning|self-supervised learning]] architectures that learn representations by **predicting masked regions in latent (embedding) space** rather than in pixel/input space. The core idea, proposed by [[yann-lecun|Yann LeCun]], is that predicting abstract representations is more useful than predicting raw inputs: it forces the model to capture semantic structure rather than low-level statistics.

## How It Works

1. **Encoder** maps input (e.g., an image or video) to a sequence of latent embeddings
2. **Masking**: A portion of the input is masked (hidden from the encoder)
3. **Predictor** takes the embeddings of visible regions and predicts the embeddings of masked regions
4. **Target**: The prediction targets come from a teacher network (typically updated via [[ema|EMA]])
5. **Loss**: Computed in latent space — the predicted embeddings should match the target embeddings

## Key Distinction from Other SSL

| Approach | Predicts | Space | Example |
|----------|----------|-------|---------|
| **Generative** (MAE) | Raw pixels | Input space | [[mae|MAE]] |
| **Contrastive** (SimCLR) | Same vs. different | Embedding space | [[contrastive-learning|SimCLR, CLIP]] |
| **JEPA** | Masked embeddings | Latent space | I-JEPA, V-JEPA |

JEPA's advantage: predicting in latent space discards irrelevant low-level details and focuses on semantic content.

## The Collapse Problem

A fundamental challenge in JEPA training is [[representation-collapse|representation collapse]] — the model can trivially minimize the loss by mapping everything to the same embedding. Several mechanisms have been proposed to prevent this:

| Method | Collapse Prevention | Used By |
|--------|-------------------|---------|
| [[ema|EMA teacher]] | Slowly-updating teacher provides stable targets | [[v-jepa-2-1|V-JEPA 2.1]], I-JEPA |
| [[lejepa|SIGReg]] | Regularize embeddings to isotropic Gaussian | [[lejepa|LeJEPA]], [[leworldmodel|LeWM]] |
| [[visreg|VISReg]] | Decouple scale/shape/center; sliced Wasserstein shape matching | [[visreg|VISReg]] |
| [[sub-jepa|Subspace SIGReg]] | Apply Gaussian regularization in low-dimensional frozen subspaces | [[sub-jepa|Sub-JEPA]] |
| [[lpwm|RDMReg]] | Match rectified projections to a Rectified Generalized Gaussian (sparse, non-maximum-entropy target) | [[lpwm|LpWM]] |
| Cross-modal predictors + SIGReg | Asymmetric prediction with stop-gradient per modality | [[levljepa|LeVLJEPA]] |
| Frozen teacher | Pre-trained, fixed teacher provides static targets | [[rethinking-jepa|SALT]] |
| Multi-layer distillation | Distill from multiple hidden layers | [[bootleg|Bootleg]] |

> [!open-question]
> Which collapse prevention mechanism is best? See [[ema-vs-non-ema-collapse-prevention]] - [[lejepa|LeJEPA]] and [[rethinking-jepa|SALT]] both argue EMA is unnecessary, but [[v-jepa-2-1|V-JEPA 2.1]] achieves SOTA with EMA.

> [!contradiction]
> [[obsessed-encoder|The Obsessed Encoder]] shows the debate above may be secondary: a low-entropy predictable feature collapses EMA-based DINOv3 and SIGReg-based LeJEPA/LeWM alike ([[feature-suppression|feature suppression]]) - all these mechanisms constrain embedding statistics, not how information content is allocated across dimensions.

## JEPA Variants in This Wiki

### By Domain
- **Images**: I-JEPA (original), [[lejepa|LeJEPA]], [[bootleg|Bootleg]]
- **Video**: [[v-jepa-2-1|V-JEPA 2.1]], [[rethinking-jepa|SALT]]
- **Efficient video**: [[levjepa|LeVJEPA]] (SIGReg, sparse token processing, block-causal attention)
- **World models**: [[causal-jepa|Causal-JEPA]], [[leworldmodel|LeWorldModel]]
- **Physics-generalizing world models**: [[semigroup-jepa|Semigroup-JEPA]] (gravity conditioning and recursive latent rollouts)
- **Object-centric world models**: [[better-slots-better-worlds|Better Slots Better Worlds]]
- **Adaptive world models**: [[adajepa|AdaJEPA]] (test-time recalibration in MPC loop)
- **Planning-focused world models**: [[dino-wm|DINO-WM]] (frozen DINOv2 latents), [[temporal-straightening|Temporal Straightening]] (straightened JEPA latents for GD planning)
- **End-to-end pixel world models**: [[leworldmodel|LeWM]] (SIGReg), [[sub-jepa|Sub-JEPA]] (subspace SIGReg), [[sensorimotor-world-models|SMWM]] (concat inverse dynamics), [[delta-jepa|Delta-JEPA]] (latent-difference action decoding)
- **Vision-language**: [[levljepa|LeVLJEPA]] (non-contrastive cross-modal prediction + SIGReg; strong dense patch features for VLM backbones)
- **Subspace-regularized world models**: [[sub-jepa|Sub-JEPA]]

### By Innovation
- **Theoretical foundations**: [[lejepa|LeJEPA]] (isotropic Gaussian theory + SIGReg), [[learn-from-your-own-latents|latent sample-complexity theory]]
- **Factorized prediction**: [[orthogonal-jepa|Orthogonal JEPA]] (learned orthogonal bases split one monolithic prediction into per-component branches, preventing dominant signals from monopolizing capacity)
- **Sparse geometry**: [[lpwm|LpWM]] (RDMReg sparse non-negative codes; one-hot linearization theory; mode-factored support/magnitude structure - see [[sparse-representations]])
- **Alternative regularizers**: [[visreg|VISReg]] (variance-invariance-sketching with sliced Wasserstein shape loss)
- **Object-centric**: [[causal-jepa|Causal-JEPA]] (object-level masking)
- **Multi-layer**: [[bootleg|Bootleg]] (hidden layer distillation), [[v-jepa-2-1|V-JEPA 2.1]] (deep self-supervision)
- **Frozen teacher**: [[rethinking-jepa|SALT]]
- **End-to-end**: [[leworldmodel|LeWorldModel]] (from pixels, no EMA)
- **Intrinsic-dimensionality regularization**: [[sub-jepa|Sub-JEPA]] (Gaussian regularization in random low-dimensional subspaces)
- **Dense features**: [[v-jepa-2-1|V-JEPA 2.1]] (all-token prediction)
- **Minimal temporal bias**: [[temporal-difference-vision|TDV]] (causal next-frame prediction from video, no augmentations/masking)
- **Efficient video pretraining**: [[levjepa|LeVJEPA]] (single encoder, 95% token dropping, SIGReg)

## Recursive Rollouts and Physics Generalization

[[semigroup-jepa|Semigroup-JEPA]] extends [[leworldmodel|LeWorldModel]] with a known gravity parameter and a discounted multi-step latent rollout loss. On MuJoCo tasks, the model transfers across held-out gravity values and keeps its advantage over DINO-WM as the forecast horizon grows. A frozen-representation crossover shows that the gain follows the encoder representation learned with the GRU objective, while recursive feedback amplifies the local prediction difference.

## Conditional Target Geometry in Language

[[jepa-paradox-in-language|The JEPA Paradox in Language]] argues that collapse prevention is not enough when one context admits several valid linguistic targets. Under deterministic squared-error prediction, the optimum is their latent centroid, which may match no real completion; merging alternatives can therefore lower loss while destroying useful distinctions. Its T-JEPA experiments are narrow, but they add a necessary design test: whether the target conditional distribution is concentrated enough for a single latent point to be meaningful.

## Finite-Sample Theory for World Models

[[generalization-theory-for-jepa-world-models|A Generalization Theory for JEPA-Based World Models]] interprets an action-conditioned spectral JEPA objective as low-rank factorization of a normalized transition operator. It links spectral prediction risk to planning regret and exposes a latent-dimension trade-off between singular-value-tail approximation and finite-sample estimation. The guarantees rely on strong assumptions and do not directly cover the EMA or SIGReg objectives used by most empirical systems in this wiki.

## Beyond Masking: Temporal Causality

[[temporal-difference-vision|TDV]] extends the JEPA trajectory one step further: instead of masking or augmentations to create learning signal, it uses the causal assumption that z_t + Δz_t ≈ z_{t+1} from consecutive video frames. This removes hand-crafted invariances entirely while still predicting in latent space. TDV currently excels at dense spatial tasks (optical flow, depth, segmentation) but lags on semantic benchmarks — suggesting augmentations may still help for object-level semantics even if they become bottlenecks at scale.

## Key Open Questions

> [!open-question]
> Is JEPA fundamentally superior to generative or contrastive approaches, or does the gap close at sufficient scale?

> [!open-question]
> What is the optimal masking strategy? Grid-based patches vs. object-level ([[causal-jepa|Causal-JEPA]]) vs. heterogeneous noise ([[self-flow|Self-Flow]])?

> [!open-question]
> Is full-space isotropic Gaussian regularization too strong for high-dimensional JEPA representations, and should future JEPA variants prefer subspace or manifold-aware priors?
