---
title: "Wiki Index"
type: meta
created: 2026-04-10
updated: 2026-07-03

A catalog of all pages in the ML Research Wiki, organized by category.

## Sources

- [[causal-jepa]] — Object-centric JEPA world model with latent interventions via object-level masking (2025)
- [[lejepa]] — Theoretically grounded JEPA with SIGReg regularizer; eliminates EMA and heuristics (2025)
- [[leworldmodel]] — First stable end-to-end JEPA world model from pixels, using SIGReg (2025)
- [[rethinking-jepa]] — SALT: frozen-teacher alternative to EMA that outperforms V-JEPA 2 (2025)
- [[bootleg]] — Multi-layer self-distillation bridging generative and predictive SSL (+10% over I-JEPA) (2025)
- [[self-flow]] — Self-supervised flow matching with Dual-Timestep Scheduling for multi-modal generation (2025)
- [[v-jepa-2-1]] — Dense video SSL with all-token prediction, deep self-supervision, and 2B-parameter scaling (2025)
- [[repa]] — Representation alignment for diffusion transformers; 17.5x faster training via frozen encoder guidance (2024)
- [[foveal-ssl]] — Sequential-to-global self-distillation for image-size agnostic ViT; constant compute at any resolution (2026)
- [[rvm]] — Recurrent Video MAE with GRU-Transformer core; generalist encoder for spatial + temporal tasks (2025)
- [[hyperloop-transformers]] — Looped Transformer + hyper-connections; 50% fewer params, lower perplexity than vanilla Transformers (2026)
- [[elt]] — Elastic Looped Transformers with Intra-Loop Self Distillation; 4× parameter reduction for visual generation (2026)
- [[steerable-visual-representations]] — Text-steerable visual encoder adapters with early fusion and prompt-controlled feature geometry (2026)
- [[energy-based-transformers]] — Transformer EBMs that learn to think via energy minimization, dynamic compute, and self-verification (2025)
- [[representation-frechet-loss]] — Direct Fréchet Distance optimization as a scalable visual-generation post-training loss (2026)
- [[autoregressive-language-models-are-secretly-energy-based-models]] — Theory linking next-token ARMs, EBMs, and MaxEnt RL lookahead (2025)
- [[global-geometry-is-not-enough]] — Shows global embedding geometry fails to predict compositional binding; proposes Jacobian Effective Rank (2026)
- [[manifold-steering]] — Geometry-aware activation steering reveals shared manifolds of representation and behavior (2026)
- [[reconstruction-or-semantics-robotic-world-models]] — Semantic latents outperform reconstruction latents for robotic diffusion world models (2026)
- [[sub-jepa]] — Subspace Gaussian regularization improves stable end-to-end JEPA world models (2026)
- [[elucidating-representation-degradation]] — NTK/recoverability analysis of representation degradation in diffusion training; proposes ERD (2026)
- [[world-action-models]] — Survey defining World Action Models as joint future-state/action embodied foundation models (2026)
- [[normalizing-trajectory-models]] — Exact-likelihood conditional-flow reverse steps for high-quality few-step generation (2026)
- [[world-model-for-robot-learning-survey]] — Comprehensive robotics-centered survey of world models for policy, simulation, and video generation (2026)
- [[attractor-models]] — Fixed-point output-embedding refinement for language modeling and small-model reasoning (2026)
- [[generative-recursive-reasoning]] — Probabilistic recursive reasoning (GRAM) with width-based multi-trajectory inference scaling (2026)
- [[visreg]] — Decoupled scale/shape/center JEPA regularization via sliced Wasserstein; strong OOD generalization (2026)
- [[convergent-world-representations-and-divergent-tasks]] — Multi-task world-representation convergence and divergent-task fine-tuning fractures (2026)
- [[probabilistic-tiny-recursive-model]] — Retraining-free stochastic TRM inference with Q-head width scaling (2026)
- [[equilibrium-reasoners]] — Attractor-landscape shaping for scalable depth/breadth reasoning in HRM/TRM models (2026)
- [[learn-from-your-own-latents]] — Sample-complexity theory: latent prediction is vm³ vs token SSL vm^{L+1} on RHM (2026)
- [[augmented-lagrangian-predictive-coding]] — Augmented Lagrangian PC closes BP gap with ballistic credit propagation and exact gradients at equilibrium (2026)
- [[arc-is-a-vision-problem]] — Vision ARC: image-to-image ARC solver with visual priors matching human performance at 18M params (2025)
- [[on-policy-representation-distillation]] — Hidden-state on-policy distillation bypasses LM-head bottleneck with zero-variance gradients (2026)
- [[pretraining-recurrent-networks-without-recurrence]] — Supervised Memory Training enables time-parallel RNN pretraining without BPTT (2026)
- [[latent-reasoning-with-normalizing-flows]] — NF-CoT: autoregressive normalizing-flow latents for tractable continuous Chain-of-Thought (2026)
- [[on-the-geometry-of-on-policy-distillation]] — Parameter-space geometry of OPD: relaxed off-principal regime with subspace locking (2026)
- [[delta-world]] — DeltaTok compresses frame changes to one token; generative world model beats Cosmos at 2,000× fewer FLOPs (2026)
- [[topological-trouble-with-transformers]] — Feedforward Transformers cannot track dynamic state indefinitely due to depth topology (2026)
- [[temporal-difference-vision]] — TDV: causal next-frame SSL from video without augmentations or masking (2026)
- [[next-latent-prediction]] — NextLat: belief-state latent dynamics for compact transformer world models (2026)
- [[un-0-coupled-oscillators]] — Un-0: Kuramoto oscillator image generator as physical-computing proof-of-concept; FID 6.74 on ImageNet 64×64 (2026)
- [[adajepa]] — AdaJEPA: test-time adaptation in MPC loop for JEPA latent world models under distribution shift (2026)
- [[fixed-point-reasoners]] — FPRM: pre-norm + residual scaling looped Transformer with fixed-point halting; 94.2% Sudoku at 7M params (2026)
- [[temporal-straightening]] — Curvature regularization straightens JEPA latent trajectories for GD planning; +20–60% open-loop SR (ICML 2026)
- [[dino-wm]] — Zero-shot latent planning on frozen DINOv2 patch features; task-agnostic offline world model (ICML 2025)
- [[sensorimotor-world-models]] — Inverse dynamics regularization for action-aligned end-to-end JEPA world models; 84% vs 59% on OGBench-Cube (2026)
- [[delta-jepa]] — Latent Difference Action Decoding for action-sensitive JEPA world models; 100% Two-Room, 79.3% OGB-Cube (2026)
- [[levljepa]] — Non-contrastive vision-language JEPA with SIGReg; strongest dense patch features for frozen VLM backbones (2026)

## Concepts

- [[jepa]] — Joint-Embedding Predictive Architecture: learn by predicting masked embeddings in latent space
- [[self-supervised-learning]] — Paradigm overview: generative, contrastive, JEPA, and self-supervised generative approaches
- [[world-models]] — Predictive models of environment dynamics in latent space
- [[representation-collapse]] — The fundamental challenge of degenerate embeddings in SSL
- [[ema]] — Exponential Moving Average teacher: widely-used but debated collapse prevention mechanism
- [[self-distillation]] — Teacher-student learning from a model's own representations
- [[flow-matching]] — Continuous generative framework used by Self-Flow
- [[mae]] — Masked Autoencoders: the contrasting generative SSL approach
- [[energy-based-models]] — EBMs as learned verifiers connecting transformers, ARMs, and System 2-style inference
- [[representation-geometry]] — Global geometry, functional sensitivity, manifolds, and prompt-steerable embedding spaces
- [[iterative-refinement]] — Looped, fixed-point, and energy-based latent refinement for language and reasoning models
- [[coupled-oscillators]] — Kuramoto phase dynamics as generative compute substrate and neuro-inspired primitive
- [[contrastive-learning]] — Contrastive SSL paradigm (SimCLR, MoCo, DINO, CLIP) as reference baseline for JEPA

## Entities

- [[yann-lecun]] — Chief AI Scientist at Meta FAIR; architect of JEPA (researcher)
- [[randall-balestriero]] — Researcher at Meta FAIR; theoretical foundations of JEPA (researcher)
- [[meta-fair]] — Meta's Fundamental AI Research lab; home of JEPA (org)
- [[imagenet]] — Standard benchmark for SSL evaluation (dataset)
- [[unconventional-ai]] — Startup building physics-based AI on oscillator substrates; released Un-0 (org)

## Comparisons

- [[ema-vs-non-ema-collapse-prevention]] — Filed comparison of EMA, SIGReg, frozen teacher, and action-aligned collapse prevention
- [[robot-world-model-architectures]] — JEPA latent planners vs generative video vs VLA/WAM approaches for robotics

## Meta

- [[iterative-latent-refinement-for-world-models]] — Design note on where iterative refinement helps JEPA-style semantic world models
