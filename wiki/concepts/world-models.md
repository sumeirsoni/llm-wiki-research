---
title: "World Models"
type: concept
created: 2026-04-10
updated: 2026-09-09
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
  - "[[hierarchical-latent-prediction]]"
  - "[[adajepa]]"
  - "[[temporal-straightening]]"
  - "[[dino-wm]]"
  - "[[sensorimotor-world-models]]"
  - "[[delta-jepa]]"
  - "[[fast-leworldmodel]]"
  - "[[prism-prior-guided-imagination-sampling]]"
  - "[[intact]]"
  - "[[explorative-modeling]]"
  - "[[generalization-theory-for-jepa-world-models]]"
  - "[[viscore]]"
  - "[[leflow]]"
  - "[[driftworld]]"
  - "[[better-slots-better-worlds]]"
  - "[[latent-energy-action-planning]]"
  - "[[latent-geometry-beyond-search]]"
  - "[[latent-action-as-intention]]"
  - "[[semigroup-jepa]]"
aliases:
  - "World model"
---

# World Models

## Overview

World models learn a **predictive model of environment dynamics** in a compact latent space or observation space. Rather than planning only from the current observation, agents can imagine future states by rolling out learned dynamics, enabling planning, policy evaluation, and data generation.

## JEPA-Based World Models

Several papers in this wiki apply [[jepa|JEPA]] to world modeling and latent planning:

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

### [[semigroup-jepa|Semigroup-JEPA (SG-JEPA)]]
- **Focus**: Long-horizon physical prediction and zero-shot transfer across gravity values
- **Key idea**: Supplies gravity as an action coordinate and trains the encoder and predictor with a discounted autoregressive latent rollout
- **Evaluation**: MuJoCo rigid-body, projectile, and robot-arm tasks with held-out gravity grids
- **Mechanism**: The GRU-trained encoder preserves dynamics-relevant features; recursive feedback amplifies its local prediction advantage

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

### [[fast-leworldmodel|Fast-LeWM]]
- **Focus**: Parallel multi-horizon dynamics queries for CEM planning
- **Key idea**: Causal action-prefix tokens predict every future latent directly from the observed anchor instead of recursively feeding predicted latents forward
- **Planning**: Average success 90.5% vs LeWM 85.8%; full CEM solve time 28.3s vs 54.4s
- **Mechanism**: Dense prefix-level supervision reduces repeated model calls and slows open-loop error growth

### [[prism-prior-guided-imagination-sampling|PRISM]]
- **Focus**: Sample-efficient proposal distributions for latent MPC
- **Key idea**: A small head on frozen LeWM features predicts a Gaussian action prior; precision-weighted fusion initializes MPPI with state-dependent mean and variance
- **Planning**: At 128 candidates, PushT 89% vs vanilla MPPI 57% and Cube 79% vs 44%, with negligible added latency
- **Mechanism**: Fixed fused covariance preserves prior confidence across MPPI iterations and falls back toward vanilla sampling when uncertain

### [[intact|INTACT]]
- **Focus**: Direct intent-to-action control inside an end-to-end JEPA world model
- **Key idea**: One conditional action operator interprets attached local displacement and detached future-goal displacement, jointly shaping representation and deployment mapping
- **Planning**: Direct zero-candidate control reaches 95.33% macro across four separately trained simulated tasks; bounded local verification reaches 96.86%
- **Mechanism**: Uses the learned conditional mean by default while retaining the forward predictor for rollout, replanning, and optional verification

These additions separate world-model quality from the broader [[sampling-based-latent-planning|planning interface]]: Fast-LeWM changes how a candidate is rolled out, PRISM changes which candidates are proposed, and INTACT amortizes the inverse control query so candidate search can become optional.

### [[latent-geometry-beyond-search|GC-IDM]]

GC-IDM freezes LeWM and learns a horizon-conditioned inverse action map from offline demonstrations. It re-encodes the current observation at every step, so it does not accumulate an imagined latent rollout. On the four LeWM tasks, it matches or exceeds CEM in seven of eight protocol cells and reduces per-plan-call cost by 100 to 130 times. This is a direct-control interface built on latent geometry rather than a new world-model objective.

### [[latent-action-as-intention|LAWA]]

LAWA is a World Action Model that keeps future imagination at inference but moves it from pixel or video latents to compact latent actions. A tokenizer learns transition codes from action-free robot and egocentric video. The policy jointly denoises latent intentions and executable action chunks while omitting future-video generation at inference. On RoboCasa, it reaches 65.6% few-shot and 80.8% full-data success, matching the matched Joint-WAM reference at 42.9% lower latency.

### Amortized and Generative Planning

[[leflow|LeFlow]] learns a reusable rectified-flow prior over latent trajectories between current and goal embeddings. An inverse-dynamics decoder turns latent transitions into action chunks, while the frozen LeWM predictor reranks candidates for feasibility. This changes the proposal interface from repeated black-box CEM search to one batched proposal-and-verification pass, improving success and reducing planning time by roughly an order of magnitude on the LeWM benchmark suite.

[[driftworld|DriftWorld]] takes a different route to fast imagination: it generates action-conditioned future video in one forward pass using a drifting generative model. Its fast rollouts support both GPC-RANK policy improvement and offline policy ranking, extending the world-model role from latent MPC to high-throughput visual simulation.

### Object-Centric World Models

[[better-slots-better-worlds|Better Slots Better Worlds]] controls for slot quality and compares SlotContrast-WM with DINO-WM and LeWM. Planning success rises with slot quality and then saturates; well-bound slots make proprioception and slot masking unnecessary in the tested tasks. Robustness under appearance shifts is strongest for the object-centric model, but DINO-WM remains similarly robust, suggesting frozen pretrained visual features are an important factor separate from object binding. See [[object-centric-world-models]] for the focused synthesis.

## Theory and Planning-Relevant Diagnostics

[[generalization-theory-for-jepa-world-models|JEPA World Model Generalization Theory]] links an action-conditioned spectral objective to low-rank transition factorization, finite-sample risk, and planning regret. Its main contribution is a bias-complexity view of latent dimension, but the experiment is synthetic and the practical objective differs from the analyzed one.

[[semigroup-jepa|Semigroup-JEPA]] supplies an empirical counterpart focused on changing physical laws. Its linear feature model separates local law-conditioned error from recursive amplification, while its MuJoCo experiments show that a GRU-trained representation transfers across held-out gravity values.

[[viscore|VIScore]] separates three failure sources in a deployed planning stack: whether predictions remain on-manifold, whether actions influence latent futures, and whether search exploits unsupported trajectories. It predicts checkpoint rankings across several tasks and planners better than isolated static metrics, while discrete contact events and amortized or inverse-dynamics planners remain outside its validated scope.

[[latent-energy-action-planning|LEAP]] addresses a related planner failure inside a frozen LeWM stack. It adds decoder-predicted terminal-state agreement to the latent goal cost and differentiates the combined energy through the complete action horizon. LEAP improves mean success from 77.5% for native LeWM+CEM to 94.8% under a matched four-domain protocol, but terminal-state matching does not certify that the selected action or rollout remains within offline-data support.

## Key Differences

| Aspect | [[causal-jepa|C-JEPA]] | [[leworldmodel|LeWM]] | [[sub-jepa|Sub-JEPA]] | [[sensorimotor-world-models|SMWM]] | [[delta-jepa|Delta-JEPA]] |
|--------|---------|------|------|------|------|
| **Input** | Object representations | Raw pixels | Raw pixels | Raw pixels | Raw pixels |
| **Masking / prediction** | Object-level | Temporal next-step latent prediction | Temporal next-step latent prediction | Temporal next-step latent prediction | Temporal next-step latent prediction |
| **Collapse prevention** | Object masking structure | Full-space SIGReg | Subspace Gaussian regularization | Inverse dynamics (concat endpoints) | LDAD on $\Delta z_t$ |
| **Geometry bias** | Object-centric structure | Isotropic ambient Gaussian | Low-dimensional projected Gaussianity | Action-recoverable, controllable DoF | Action-distinguishable latent displacements |
| **Causal/control focus** | Explicit causal analysis | Efficient latent planning | Planning with intrinsic-dimensional latent geometry | Perception for action; distractor filtering | Action-sensitive rollouts for MPC |

## Robot World Models

See [[robot-world-model-architectures]] for a filed comparison of JEPA, diffusion/video, and VLA-style approaches on shared robotics criteria. Recent robot-focused sources broaden the page beyond JEPA:

- [[world-model-for-robot-learning-survey|World Model for Robot Learning]] surveys world models as policy components, learned simulators, evaluators, and robotic video generators.
- [[world-action-models|World Action Models]] defines WAMs as joint models of future states and actions, bridging reactive VLA policies and predictive world models.
- [[reconstruction-or-semantics-robotic-world-models|Reconstruction or Semantics]] shows that semantic latents such as V-JEPA 2.1, Web-DINO, and SigLIP 2 can outperform VAE-style reconstruction latents for action recovery and policy-in-the-loop evaluation.
- [[convergent-world-representations-and-divergent-tasks|Convergent World Representations and Divergent Tasks]] studies how multi-task pretraining builds shared world geometry in LLMs and how fine-tuning can fracture it when tasks are divergent.

## Efficient Generative World Models

[[delta-world|DeltaWorld]] shows that generative world modeling in frozen VFM (DINOv3) feature space can be orders of magnitude more efficient than pixel-level diffusion models. DeltaTok compresses each frame's temporal change into a single delta token (1,024× reduction per frame), and Best-of-Many training generates diverse future hypotheses in one forward pass. Best-of-20 predictions outperform Cosmos-4B/12B on dense forecasting (segmentation, depth) with 35× fewer parameters and 2,000× fewer FLOPs, supporting the [[reconstruction-or-semantics-robotic-world-models|semantic-over-reconstruction]] thesis for world model latents.

[[explorative-modeling|Explorative Modeling]] generalizes this [[candidate-exploration|candidate-search]] pattern and tests it as a standalone low-step trajectory world model. On Maze2D, XM-10 averages 130.0 score with 2.3 network evaluations versus 127.2 with 192 for a reproduced Diffuser, although it underperforms on the Medium task. This suggests training-time exploration can reduce rollout depth in constrained trajectory domains. The proposed extension to JEPA-style feature-space world models is author-stated future work, not a demonstrated result.

## Belief-State World Models in Transformers

[[next-latent-prediction|NextLat]] addresses a gap identified by Vafa et al.: transformers can achieve perfect next-token accuracy on Manhattan taxi trajectories while learning incoherent internal maps. NextLat's auxiliary latent dynamics objective provably shapes hidden states into belief states, sufficient statistics of history for predicting the future. On the Manhattan benchmark, NextLat reconstructs coherent street maps (98.7% valid OOD trajectories, effective latent rank 52.7 vs GPT 160.1). [[hierarchical-latent-prediction|HiLP]] adds a coarser state over a four-token window and predicts its future directly, reducing long-horizon rollout error relative to flat NextLat dynamics while discarding the hierarchy at ordinary inference. This connects to [[topological-trouble-with-transformers|Topological Trouble With Transformers]]'s argument that feedforward transformers need explicit pressure to compress history rather than relying on context-window retrieval.

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

> [!open-question]
> How should a finite planning budget be divided among better latent geometry, faster [[fast-leworldmodel|prefix prediction]], stronger [[prism-prior-guided-imagination-sampling|action priors]], and more sampled candidates?

> [!open-question]
> Can [[semigroup-jepa|Semigroup-JEPA]]-style rollout training transfer to unknown or vector-valued physical parameters and to real contact-rich environments?
