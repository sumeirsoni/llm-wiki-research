---
title: "Wiki Log"
type: meta
created: 2026-04-10
updated: 2026-07-24
tags:
  - meta
---

# Wiki Log

Chronological record of all wiki operations. Each entry uses the format `## [YYYY-MM-DD] operation | Subject` for parseability.

## [2026-04-10] init | Wiki Created
Wiki scaffolding created. Directory structure, schema (AGENTS.md), and initial files established. Focus area: self-supervised representation learning. 7 seed papers queued for ingestion.

## [2026-04-10] ingest | Causal-JEPA
Ingested "Causal-JEPA: Learning World Models through Object-Level Latent Interventions" (arXiv: 2602.11389). Created source page. Updated/created concept pages: [[jepa]], [[world-models]], [[representation-collapse]], [[ema]]. Updated entity pages: [[yann-lecun]], [[randall-balestriero]], [[meta-fair]].

## [2026-04-10] ingest | LeJEPA
Ingested "LeJEPA: Provable and Scalable Self-Supervised Learning Without the Heuristics" (arXiv: 2511.08544). Created source page. Key contribution: SIGReg regularizer and isotropic Gaussian theory. Updated concept pages: [[jepa]], [[self-supervised-learning]], [[representation-collapse]], [[ema]].

## [2026-04-10] ingest | LeWorldModel
Ingested "LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels" (arXiv: 2603.19312). Created source page. First stable end-to-end JEPA world model. Updated concept pages: [[jepa]], [[world-models]], [[representation-collapse]].

## [2026-04-10] ingest | Rethinking JEPA (SALT)
Ingested "Rethinking JEPA: Compute-Efficient Video SSL with Frozen Teachers" (arXiv: 2509.24317). Created source page. Proposes frozen teacher alternative to EMA. Updated concept pages: [[jepa]], [[ema]], [[self-distillation]], [[mae]].

## [2026-04-10] ingest | Bootleg (Self-Distillation of Hidden Layers)
Ingested "Self-Distillation of Hidden Layers for Self-Supervised Representation Learning" (arXiv: 2603.15553). Created source page. Multi-layer distillation bridging generative and predictive SSL. Updated concept pages: [[self-distillation]], [[mae]], [[jepa]].

## [2026-04-10] ingest | Self-Flow
Ingested "Self-Supervised Flow Matching for Scalable Multi-Modal Synthesis" (arXiv: 2603.06507). Created source page. Novel paradigm: self-supervised generative with Dual-Timestep Scheduling. Created concept page: [[flow-matching]]. Updated: [[self-supervised-learning]].

## [2026-04-10] ingest | V-JEPA 2.1
Ingested "V-JEPA 2.1: Unlocking Dense Features in Video Self-Supervised Learning" (arXiv: 2603.14482). Created source page. SOTA dense video SSL from Meta FAIR. Updated concept pages: [[jepa]], [[ema]], [[self-distillation]]. Updated entity pages: [[yann-lecun]], [[meta-fair]]. Created entity page: [[imagenet]].

## [2026-04-12] update | Add Code & Project Links
Added GitHub and project page links to source pages: [[self-flow]], [[leworldmodel]], [[lejepa]]. Updated LeJEPA GitHub link to galilai-group/lejepa.

## [2026-04-12] ingest | REPA
Ingested "Representation Alignment for Generation: Training Diffusion Transformers Is Easier Than You Think" (arXiv: 2410.06940, ICLR 2025 Oral). Created source page. Key insight: REPA is the reverse of SALT — aligns diffusion model → frozen visual encoder, achieving 17.5x training speedup. Updated: [[rethinking-jepa]], [[self-flow]], [[flow-matching]], [[overview]].

## [2026-04-25] ingest | Foveal SSL
Ingested "Self-supervised Pretraining for an Iterative Image Size Agnostic Vision Transformer" (arXiv: 2604.20392). Created source page. Key innovation: sequential-to-global self-distillation extends DINO to recurrent architectures without BPTT. Enables constant-compute processing at any resolution. Updated: [[self-distillation]].

## [2026-04-25] ingest | RVM (Recurrent Video MAE)
Ingested "Recurrent Video Masked Autoencoders" (arXiv: 2512.13684). Created source page. Key insight: GRU-Transformer recurrent core + simple pixel reconstruction achieves generalist encoder for both spatial and spatio-temporal tasks. 34M model matches 30× larger VideoMAEv2-g. Updated: [[mae]].

## [2026-04-25] ingest | Hyperloop Transformers
Ingested "Hyperloop Transformers" (arXiv: 2604.21254). Created source page. Key innovation: combines looped (recurrent-depth) Transformers with loop-level hyper-connections and diagonal H_res parameterization. Achieves lower perplexity than depth-matched Transformers with 50% fewer parameters. Note: LLM architecture paper, tangential to core SSL focus but connects to [[rvm]] via recurrent architecture theme.

## [2026-04-25] correction | Self-Flow uses EMA
Corrected [[self-flow]] page to accurately reflect that the method uses an EMA teacher-student architecture. The EMA teacher observes cleaner inputs (τ_min) and provides reference embeddings for the student. Added #ema and #self-distillation tags. Added open question about whether EMA is necessary or if reconstruction alone could prevent collapse.

## [2026-05-16] ingest | AlphaXiv Batch: Representation Geometry, EBMs, Diffusion, and World Models
Ingested 12 unique AlphaXiv papers from the requested batch: [[steerable-visual-representations]], [[energy-based-transformers]], [[representation-frechet-loss]], [[autoregressive-language-models-are-secretly-energy-based-models]], [[global-geometry-is-not-enough]], [[manifold-steering]], [[reconstruction-or-semantics-robotic-world-models]], [[sub-jepa]], [[elucidating-representation-degradation]], [[world-action-models]], [[normalizing-trajectory-models]], and [[world-model-for-robot-learning-survey]]. Deduplicated the repeated [[manifold-steering]] URL. Created concept pages [[energy-based-models]] and [[representation-geometry]]. Updated [[jepa]], [[world-models]], [[representation-collapse]], [[flow-matching]], [[self-supervised-learning]], [[overview]], and [[index]].

## [2026-05-17] ingest | Solve the Loop: Attractor Models
Ingested "Solve the Loop: Attractor Models for Language and Reasoning" (arXiv: 2605.12466). Created source page [[attractor-models]] and concept page [[iterative-refinement]]. Updated [[hyperloop-transformers]], [[energy-based-models]], and [[index]] to connect fixed-point refinement with looped transformers and energy-based inference.

## [2026-05-17] ingest | Generative Recursive Reasoning (GRAM)
Ingested "Generative Recursive Reasoning" (arXiv: 2605.19376). Created source page [[generative-recursive-reasoning]]. Updated [[iterative-refinement]], [[attractor-models]], [[hyperloop-transformers]], [[index]], and [[overview]] to connect stochastic multi-trajectory recursive reasoning with fixed-point and looped architectures.

## [2026-05-20] ingest | JEPA Regularization, World Geometry, and Recursive Reasoning Batch
Ingested five papers: [[visreg]] (arXiv: 2606.02572), [[convergent-world-representations-and-divergent-tasks]] (arXiv: 2602.00533), [[probabilistic-tiny-recursive-model]] (arXiv: 2605.19943), [[equilibrium-reasoners]] (arXiv: 2605.21488), and [[learn-from-your-own-latents]] (arXiv: 2605.27734). Updated [[jepa]], [[representation-collapse]], [[self-supervised-learning]], [[representation-geometry]], [[world-models]], [[iterative-refinement]], [[lejepa]], [[attractor-models]], [[index]], and [[overview]].

## [2026-05-20] query | Iterative Latent Refinement for World Models
Filed synthesis note [[iterative-latent-refinement-for-world-models]] on whether looped, fixed-point, stochastic, or energy-based latent refinement is desirable for JEPA-style semantic world models. Updated [[index]].

## [2026-06-09] ingest | Six-Paper Batch (PC-ALM, VARC, OPRD, SMT, NF-CoT, OPD Geometry)
Ingested six papers: [[augmented-lagrangian-predictive-coding]] (arXiv: 2605.31022), [[arc-is-a-vision-problem]] (arXiv: 2511.14761), [[on-policy-representation-distillation]] (arXiv: 2606.06021), [[pretraining-recurrent-networks-without-recurrence]] (arXiv: 2606.06479), [[latent-reasoning-with-normalizing-flows]] (arXiv: 2606.06447), and [[on-the-geometry-of-on-policy-distillation]] (arXiv: 2606.07082). Updated concept pages [[self-distillation]], [[representation-geometry]], [[iterative-refinement]], [[energy-based-models]], [[index]], and [[overview]].

## [2026-06-09] ingest | DeltaWorld and Topological Trouble With Transformers
Ingested [[delta-world]] (arXiv: 2604.04913) and [[topological-trouble-with-transformers]] (arXiv: 2604.17121). Updated [[world-models]], [[iterative-refinement]], [[index]], and [[overview]].

## [2026-06-09] ingest | TDV and NextLat
Ingested [[temporal-difference-vision]] (arXiv: 2606.15956) and [[next-latent-prediction]] (arXiv: 2511.05963). Updated [[self-supervised-learning]], [[jepa]], [[world-models]], [[iterative-refinement]], [[index]], and [[overview]].

## [2026-06-30] ingest | Un-0: Coupled Oscillators (Blog)
Ingested Unconventional AI blog post "Introducing Un-0: Generating Images with Coupled Oscillators" (June 2026). Created source page [[un-0-coupled-oscillators]], concept page [[coupled-oscillators]], and entity page [[unconventional-ai]]. Updated [[iterative-refinement]], [[imagenet]], [[index]], and [[overview]].

## [2026-07-03] ingest | AdaJEPA and Fixed-Point Reasoners
Ingested [[adajepa]] (arXiv: 2606.32026) and [[fixed-point-reasoners]] (arXiv: 2606.18206). Updated [[jepa]], [[world-models]], [[iterative-refinement]], [[yann-lecun]], [[index]], and [[overview]].

## [2026-07-03] ingest | Temporal Straightening and DINO-WM
Ingested [[temporal-straightening]] (arXiv: 2603.12231, ICML 2026) and [[dino-wm]] (arXiv: 2411.04983, ICML 2025). Updated [[adajepa]], [[jepa]], [[world-models]], [[representation-geometry]], [[yann-lecun]], [[randall-balestriero]], [[index]], and [[overview]].

## [2026-07-03] ingest | Sensorimotor World Models (SMWM)
Ingested [[sensorimotor-world-models]] (arXiv: 2606.20104). Created source page. Updated [[world-models]], [[jepa]], [[representation-collapse]], [[leworldmodel]], [[randall-balestriero]], [[index]], and [[overview]].

## [2026-07-03] ingest | Delta-JEPA
Ingested [[delta-jepa]] (arXiv: 2606.31232). Created source page. Updated [[world-models]], [[jepa]], [[representation-collapse]], [[sensorimotor-world-models]], [[leworldmodel]], [[index]], and [[overview]].

## [2026-07-03] ingest | LeVLJEPA
Ingested [[levljepa]] (arXiv: 2607.00784). Created source page. Updated [[jepa]], [[self-supervised-learning]], [[representation-collapse]], [[lejepa]], [[randall-balestriero]], [[index]], and [[overview]].

## [2026-07-03] lint | Health Check
Fixed 28 escaped-pipe wikilinks in [[jepa]], [[ema]], [[world-models]], [[imagenet]], and [[delta-jepa]]. Repaired [[jepa]] frontmatter. Added [[elt]] to [[index]]. Created [[contrastive-learning]], [[ema-vs-non-ema-collapse-prevention]], and [[robot-world-model-architectures]]. Updated [[self-supervised-learning]], [[representation-collapse]], [[overview]], and [[elt]] cross-links.

## [2026-07-06] ingest | Is One Layer Enough? RL Training
Ingested [[is-one-layer-enough-rl-training]] (arXiv: 2607.01232). Created source page and concept page [[layer-contribution-rl]]. Updated [[representation-geometry]], [[self-distillation]], [[index]], and [[overview]].

## [2026-07-06] ingest | On the Position Bias of On-Policy Distillation
Ingested [[on-the-position-bias-of-on-policy-distillation]] (arXiv: 2606.22600). Created source page. Updated [[self-distillation]], [[on-the-geometry-of-on-policy-distillation]], [[index]], and [[overview]].

## [2026-07-08] query | OPRD Literature Review
Filed a targeted literature review for planned OPRD experiments. Added source pages for [[contrastive-representation-distillation]], [[codir]], [[distiller]], [[learning-beyond-teacher]], [[entropy-aware-opd]], [[tip-token-importance-opd]], [[fire-opd]], [[selectkd]], and [[phf]]. Created concept pages [[on-policy-distillation]], [[token-selective-distillation]], and [[contrastive-hidden-state-distillation]]. Filed synthesis page [[oprd-literature-review]] and updated [[self-distillation]], [[contrastive-learning]], [[representation-geometry]], [[index]], and [[overview]].

## [2026-07-10] ingest | Revisiting the Platonic Representation Hypothesis: An Aristotelian View
Ingested [[aristotelian-representation-hypothesis]] (arXiv: 2602.14486, ICML 2026). Created source page and entity page [[maria-brbic]]. Updated [[representation-geometry]], [[convergent-world-representations-and-divergent-tasks]], [[index]], and [[overview]].

## [2026-07-11] update | Future Work sections on all sources
Added a required `## Future Work` section to the source-page schema in [[AGENTS.md]] (canonical order: Limitations → Future Work → Links). Rechecked all 61 source pages against paper text (AlphaXiv full text / PDF queries) and added author-stated or clearly implied research directions. A minority of older/conclusion-only papers note that no explicit future-work agenda is stated.

## [2026-07-16] ingest | Bridging the Gap Between Latent and Explicit Reasoning with Looped Transformers
Ingested [[lotus]] (arXiv: 2606.31779). Created source page. Updated [[iterative-refinement]], [[latent-reasoning-with-normalizing-flows]], [[fixed-point-reasoners]], [[index]], and [[overview]].

## [2026-07-24] ingest | Intelligence from Learnable Novelty

Ingested [[intelligence-from-learnable-novelty]] (arXiv: 2607.18433). Created concept page [[learnable-novelty]] and dataset entity [[mnist]]. Updated [[self-supervised-learning]], [[representation-geometry]], [[index]], and [[overview]] to connect bounded-observer epiplexity with unsupervised abstraction, dynamical complexity, and intrinsic exploration.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (3 new, 5 updated, 37 chunks embedded).
Caveats: Evidence for unsupervised representation learning is limited to MNIST, and the estimator remains sensitive to observer capacity and regularization.

## [2026-07-24] ingest | Fast LeWorldModel and PRISM

Ingested [[fast-leworldmodel]] (arXiv: 2606.26217) and [[prism-prior-guided-imagination-sampling]] (arXiv: 2606.07974). Created concept page [[sampling-based-latent-planning]]. Updated [[world-models]], [[leworldmodel]], [[dino-wm]], [[robot-world-model-architectures]], [[index]], and [[overview]] to separate latent representation, dynamics-query, and candidate-proposal bottlenecks.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (3 new, 9 updated, 56 chunks embedded).
Caveats: Fast-LeWM is evaluated only on four short-horizon LeWM tasks; PRISM's controlled results cover two simulated tasks, while real-robot runs are preliminary and lack matched planner baselines.
