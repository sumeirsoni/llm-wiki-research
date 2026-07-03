---
title: "World Models"
type: concept
created: 2026-04-10
updated: 2026-07-03
tags:
  - world-model
  - representation-learning
  - reinforcement-learning
sources:
  - "[[causal-jepa]]"
  - "[[leworldmodel]]"
  - "[[sub-jepa]]"
  - "[[reconstruction-or-semantics-robotic-world-models]]"
  - "[[world-model-for-robot-learning-survey]]"
  - "[[world-action-models]]"
  - "[[convergent-world-representations-and-divergent-tasks]]"
  - "[[delta-world]]"
  - "[[next-latent-prediction]]"
  - "[[adajepa]]"
  - "[[temporal-straightening]]"
  - "[[dino-wm]]"
  - "[[sensorimotor-world-models]]"
  - "[[delta-jepa]]"
aliases:
  - "World model"
---

# World Models

## Overview

World models learn a **predictive model of environment dynamics** in a compact latent space or observation space. Rather than planning only from the current observation, agents can imagine future states by rolling out learned dynamics, enabling planning, policy evaluation, and data generation.

## JEPA-Based World Models

Two papers in this wiki apply [[jepa|JEPA]] to world modeling:

### [[causal-jepa|Causal-JEPA (C-JEPA)]]
- **Focus**: Object-level interactions and causal reasoning
- **Key idea**: Object-level masking forces the model to predict object states from other objects, inducing causal structure
- **Planning**: Uses 1% of the latent features of patch-based world models
- **Evaluation**: Visual QA (counterfactual reasoning), agent control

### [[leworldmodel|LeWorldModel (LeWM)]]
- **Focus**: Stable end-to-end training from pixels
- **Key idea**: Uses [[lejepa|LeJEPA]]'s SIGReg regularizer for collapse-free training with minimal loss terms
- **Planning**: 48x faster than foundation-model-based world models
- **Evaluation**: 2D/3D control tasks, physical quantity probing, surprise detection

### [[sub-jepa|Sub-JEPA]]
- **Focus**: Better regularization geometry for end-to-end JEPA world models
- **Key idea**: Applies Gaussian regularization in multiple frozen low-dimensional subspaces instead of the full ambient embedding space
- **Planning**: Improves over LeWM across Two-Room, Reacher, PushT, and OGB-Cube
- **Mechanism**: Lets latent geometry contract toward task-intrinsic dimensionality while avoiding collapse

### [[sensorimotor-world-models|SMWM]]
- **Focus**: Action-aligned end-to-end JEPA world models via inverse dynamics
- **Key idea**: $\mathcal{L}_{inv}$ predicts actions from consecutive latents — anti-collapse + "perception for action" in one term
- **Planning**: Matches SIGReg on 2D; **84% vs 59%** on OGBench-Cube 3D manipulation
- **Mechanism**: Latent dimension reflects controllable DoF; distractors filtered; geometry mirrors physics (linear/circular PCA structure)

### [[delta-jepa|Delta-JEPA]]
- **Focus**: Action-sensitive latent dynamics via Latent Difference Action Decoding (LDAD)
- **Key idea**: decode $a_t$ from $\Delta z_t = z_{t+1} - z_t$, not $[z_t, z_{t+1}]$ — avoids action shortcuts in endpoint embeddings
- **Planning**: Best mean success on all four LeWM-style tasks; **100% Two-Room**, **79.3% OGB-Cube** (+15.1 pp over LeWM)
- **Mechanism**: Two objectives only ($\mathcal{L}_{pred} + \lambda \mathcal{L}_{action}$); displacement ablation +12.6 pp on Push-T vs concat inverse

## Key Differences

| Aspect | [[causal-jepa\|C-JEPA]] | [[leworldmodel\|LeWM]] | [[sub-jepa\|Sub-JEPA]] | [[sensorimotor-world-models\|SMWM]] | [[delta-jepa\|Delta-JEPA]] |
|--------|---------|------|------|------|------|
| **Input** | Object representations | Raw pixels | Raw pixels | Raw pixels | Raw pixels |
| **Masking / prediction** | Object-level | Temporal next-step latent prediction | Temporal next-step latent prediction | Temporal next-step latent prediction | Temporal next-step latent prediction |
| **Collapse prevention** | Object masking structure | Full-space SIGReg | Subspace Gaussian regularization | Inverse dynamics (concat endpoints) | LDAD on $\Delta z_t$ |
| **Geometry bias** | Object-centric structure | Isotropic ambient Gaussian | Low-dimensional projected Gaussianity | Action-recoverable, controllable DoF | Action-distinguishable latent displacements |
| **Causal/control focus** | Explicit causal analysis | Efficient latent planning | Planning with intrinsic-dimensional latent geometry | Perception for action; distractor filtering | Action-sensitive rollouts for MPC |

## Robot World Models

Recent robot-focused sources broaden the page beyond JEPA:

- [[world-model-for-robot-learning-survey|World Model for Robot Learning]] surveys world models as policy components, learned simulators, evaluators, and robotic video generators.
- [[world-action-models|World Action Models]] defines WAMs as joint models of future states and actions, bridging reactive VLA policies and predictive world models.
- [[reconstruction-or-semantics-robotic-world-models|Reconstruction or Semantics]] shows that semantic latents such as V-JEPA 2.1, Web-DINO, and SigLIP 2 can outperform VAE-style reconstruction latents for action recovery and policy-in-the-loop evaluation.
- [[convergent-world-representations-and-divergent-tasks|Convergent World Representations and Divergent Tasks]] studies how multi-task pretraining builds shared world geometry in LLMs and how fine-tuning can fracture it when tasks are divergent.

## Efficient Generative World Models

[[delta-world|DeltaWorld]] shows that generative world modeling in frozen VFM (DINOv3) feature space can be orders of magnitude more efficient than pixel-level diffusion models. DeltaTok compresses each frame's temporal change into a single delta token (1,024× reduction per frame), and Best-of-Many training generates diverse future hypotheses in one forward pass. Best-of-20 predictions outperform Cosmos-4B/12B on dense forecasting (segmentation, depth) with 35× fewer parameters and 2,000× fewer FLOPs, supporting the [[reconstruction-or-semantics-robotic-world-models|semantic-over-reconstruction]] thesis for world model latents.

## Belief-State World Models in Transformers

[[next-latent-prediction|NextLat]] addresses a gap identified by Vafa et al.: transformers can achieve perfect next-token accuracy on Manhattan taxi trajectories while learning incoherent internal maps. NextLat's auxiliary latent dynamics objective provably shapes hidden states into belief states — sufficient statistics of history for predicting the future. On the Manhattan benchmark, NextLat reconstructs coherent street maps (98.7% valid OOD trajectories, effective latent rank 52.7 vs GPT 160.1). This connects to [[topological-trouble-with-transformers|Topological Trouble With Transformers]]'s argument that feedforward transformers need explicit pressure to compress history rather than relying on context-window retrieval.

## JEPA-Based Latent Planning ([[dino-wm|DINO-WM]] → [[temporal-straightening|Temporal Straightening]] → [[adajepa|AdaJEPA]])

A complementary line trains **task-agnostic latent planners** on offline trajectories:

### [[dino-wm|DINO-WM]] (ICML 2025)
- **Frozen DINOv2 patch features** as observation space; causal ViT predicts future latents
- Zero-shot visual MPC to arbitrary goal images — no rewards, demos, or inverse models
- Strong on manipulation (PushT 0.90 SR vs IRIS 0.32); patch spatial detail beats global encoders
- Limitation: DINOv2 geometry is curved for planning; Euclidean distance misaligns with geodesics

### [[temporal-straightening|Temporal Straightening]] (ICML 2026)
- Adds curvature regularization $\mathcal{L}_{curv}$ to JEPA world model training
- Straightens latent trajectories so Euclidean distance ≈ geodesic distance; better-conditioned GD planning
- Open-loop +20–60%, MPC +20–30% over DINO-WM baselines; GD becomes competitive with CEM latency-wise
- Theoretical link: ε-straight dynamics bound planning Hessian condition number

### [[adajepa|AdaJEPA]] (2026)
- Extends straightened JEPA planners with **closed-loop test-time adaptation** in MPC
- Recalibrates encoder/predictor from executed transitions; addresses deployment distribution shift

## Adaptive Deployment ([[adajepa|AdaJEPA]])

Frozen latent world models degrade under test-time distribution shift — visual corruptions, unseen object shapes, changed dynamics, or new layouts compound prediction errors over planning horizons. [[adajepa|AdaJEPA]] integrates lightweight test-time adaptation into the MPC loop: after each executed action, recent transitions update final encoder/predictor layers via the same self-supervised latent prediction loss used in training. With one gradient step per replan (0.01–0.03s overhead), AdaJEPA nearly doubles success on unseen PushObj shapes and can outperform frozen models trained with 16× more data in low-data regimes. This shifts the paradigm from train-then-freeze to **plan-execute-adapt-replan**, complementing offline advances in collapse prevention and latent geometry.

## Relation to V-JEPA

[[v-jepa-2-1|V-JEPA 2.1]] is not explicitly a world model but learns representations that are highly effective for action anticipation and robotic control — tasks that implicitly require world modeling. The boundary between "representation learning" and "world modeling" is blurry in the JEPA framework.

> [!open-question]
> Is there an optimal level of abstraction for world model latent spaces? Object-level ([[causal-jepa|C-JEPA]]) vs. patch-level ([[leworldmodel|LeWM]]) vs. dense token-level ([[v-jepa-2-1|V-JEPA 2.1]])?

> [!open-question]
> Should robot world models explicitly generate pixels/videos, predict only semantic latents, or jointly model future states and actions as [[world-action-models|WAMs]]?

> [!open-question]
> Can [[adajepa|AdaJEPA]]-style closed-loop adaptation be combined with SIGReg/subspace regularization from [[leworldmodel|LeWM]]/[[sub-jepa|Sub-JEPA]] without destabilizing the latent geometry during deployment?

> [!open-question]
> Is inverse dynamics ([[sensorimotor-world-models|SMWM]]) or subspace Gaussian regularization ([[sub-jepa|Sub-JEPA]]) better for learning task-intrinsic latent geometry in multi-task world models?

> [!open-question]
> Does [[delta-jepa|Delta-JEPA]]'s latent-displacement inverse objective subsume concat inverse dynamics ([[sensorimotor-world-models|SMWM]]) and SIGReg ([[leworldmodel|LeWM]]) as redundant, or do distractor filtering and distributional regularization add complementary benefits?
