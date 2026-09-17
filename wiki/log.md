---
title: "Wiki Log"
type: meta
created: 2026-04-10
updated: 2026-09-14
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

## [2026-07-25] ingest | Patch Policy

Ingested [[patch-policy]] (arXiv: 2607.18236). Created [[dense-visual-representations]] and researcher entity [[gaoyue-zhou]]. Updated related dense-feature, latent-planning, SSL, representation-geometry, robot-architecture, and researcher pages. Updated the overview because the paper adds direct simulated and real-robot control evidence to the existing dense-vs-global feature synthesis.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (101 files indexed; final log verification pass completed).
Caveats: The code repository exists but implementation and data release remain pending; the author-reported 40% and 18% aggregate gains lack a reproducible averaging formula; Patch Policy evaluates V-JEPA 2, not V-JEPA 2.1; heterogeneous metrics and 20-trial real-robot evaluations limit cross-task aggregation.

## [2026-07-28] ingest | Expanding Flow Maps

Ingested [[expanding-flow-maps]] (arXiv: 2607.21585) and created [[variable-dimensional-generative-flows]]. Updated [[flow-matching]] and [[normalizing-trajectory-models]] to distinguish adaptive state-space expansion from fixed-canvas few-step transport. Updated [[index]], [[overview]], and README bookkeeping. The overview was updated because expand-transport generation adds a new synthesis axis: output dimensionality or sequence length can be learned during inference rather than fixed at initialization.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (2 new, 4 updated, 29 chunks embedded before final log reindex).
Caveats: Experiments are bounded by 181 atoms and length-128 LM1B sequences; the continuous conformer task uses known atom counts and deterministic insertion; one-step language EFM exhibits mode collapse despite favorable perplexity.

## [2026-07-30] ingest | INTACT

Ingested [[intact]] (arXiv: 2607.26056). Updated [[world-models]], [[sampling-based-latent-planning]], [[leworldmodel]], [[delta-jepa]], [[sensorimotor-world-models]], [[prism-prior-guided-imagination-sampling]], and [[robot-world-model-architectures]] to distinguish direct intent-to-action control from rollout acceleration and learned proposal guidance. Updated [[index]] and [[overview]] because INTACT adds a new planning-interface synthesis: candidate search can become optional bounded verification rather than the mandatory world-model control API.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (1 new, 10 updated, 58 chunks embedded before final log reindex).
Caveats: Results cover four simulated tasks, fixed image goals, offline expert trajectories, and task-specific action heads; planner-side latency is not end-to-end robot latency; diagonal-Gaussian means can hide multimodal actions; concurrent-system results are not matched comparisons.

## [2026-08-01] ingest | Explorative Modeling

Ingested [[explorative-modeling]] (arXiv: 2607.27372) and created [[candidate-exploration]]. Updated [[delta-world]], [[flow-matching]], and [[world-models]] to connect winner-selected candidate training with few-step generation and efficient trajectory modeling. Updated [[index]], [[overview]], and README bookkeeping. The overview was updated because the paper generalizes an existing DeltaWorld mechanism into a cross-domain pretraining axis and adds a distinct training-compute versus inference-depth synthesis.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (2 new, 6 updated, 45 chunks embedded before final log reindex).
Caveats: Hard-min theory guarantees weaker support-oriented behavior than the smooth likelihood interpretation; standalone end-to-end evidence is limited to constrained control tasks; Reverse XM lacks detailed quantitative evaluation; foundation-scale trends are extrapolative; several code paths are marked forthcoming.

## [2026-08-11] ingest | Hierarchical Latent Prediction for Language Models

Ingested [[hierarchical-latent-prediction]] (arXiv: 2608.05806). Updated [[next-latent-prediction]], [[iterative-refinement]], [[world-models]], and [[learn-from-your-own-latents]] to connect explicit temporal hierarchy with longer-horizon belief-state prediction. Updated [[index]], [[overview]], and README bookkeeping. The overview was updated because HiLP materially extends the existing NextLat synthesis from flat latent dynamics to disposable multi-timescale supervision, with new coding, reasoning, and speculative-decoding evidence.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (1 new, 6 updated, 37 chunks embedded before final log reindex).
Caveats: The paper evaluates approximately 1B-parameter models trained on 100B tokens; exact Figure 2 and Figure 3 values are not exposed in the HTML text; the fixed abstract horizon and training overhead remain limitations; the efficiency-table hardware caption conflicts with the main-text hardware description.

## [2026-08-13] ingest | BDH-CQ, β-OPSD, and Full-Bandwidth Transformer

Ingested [[bdh-cq]] (arXiv: 2608.09888), [[beta-opsd]] (arXiv: 2607.28582), and [[full-bandwidth-transformer]] (arXiv: 2608.08888). Refined [[hierarchical-latent-prediction]] with primary-source loss weights and removed an unsupported hardware-caption caveat. Updated [[iterative-refinement]], [[on-policy-distillation]], [[oprd-literature-review]], [[topological-trouble-with-transformers]], [[next-latent-prediction]], [[pretraining-recurrent-networks-without-recurrence]], and [[generative-recursive-reasoning]] with focused reciprocal synthesis. Updated [[index]], [[overview]], and README counts. The overview required synthesis changes because the papers add three distinct high-level positions: reference-anchored OPSD, cross-token latent feedback, and demonstration-conditioned recurrent reasoning.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (3 new, 11 updated, 66 chunks embedded).
Caveats: BDH-CQ withholds architecture and training details; β-OPSD evidence is limited to Qwen3 competition-math experiments and uses a local target approximation; Full-Bandwidth Transformer is tested only at 1B scale and unique-token comparisons are not compute-matched; no separate self/token-distillation page was changed because [[on-policy-distillation]] and [[token-selective-distillation]] already cover the nonduplicative design axes.

## [2026-08-14] ingest | Lost in Backpropagation: The LM Head is a Gradient Bottleneck

Ingested [[lost-in-backpropagation]] (arXiv: 2603.10145) and created [[lm-head-gradient-bottleneck]]. Updated [[representation-geometry]] and [[on-policy-representation-distillation]] to distinguish vocabulary-space gradients blocked during backpropagation from hidden-state directions invisible to output-space supervision. Updated [[index]], [[overview]], and README counts. The overview required synthesis changes because the paper generalizes the LM-head issue beyond distillation and separates softmax expressivity, hidden-state observability, and backward gradient bandwidth.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (2 new, 5 updated, 43 chunks embedded before final log reindex).
Caveats: The reported 95-99% is removed logit-gradient Frobenius norm, not an equivalent fraction of useful learning signal; the 16x convergence comparison comes from controlled approximately 2B-parameter pretraining and is not a universal scaling law; head-rank variants differ slightly in total parameter count; SpamLang covers a bounded learning-rate range; no successful replacement head or released artifact is currently demonstrated.

## [2026-08-16] ingest | Latent On-Policy Self-Distillation

Ingested [[latent-on-policy-self-distillation]] (arXiv: 2608.13040). Updated [[on-policy-distillation]] and [[self-distillation]] to add learned privilege construction from retrieved experience, and added reciprocal distinctions to [[beta-opsd]] and [[on-policy-representation-distillation]]. Updated [[index]], [[overview]], and README counts. The overview required synthesis changes because LOPD adds privilege construction as a high-level OPD design axis distinct from objective regularization, token selection, and representation-level supervision.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (1 new, 6 updated, 36 chunks embedded before final log reindex).
Caveats: Evidence covers three 4B-8B backbones and two domains; the successful-only experience bank, training-time overhead, and latent interpretability remain untested or underreported; the paper contains an unresolved 77K versus approximately 7,000 coding-task discrepancy; the less-than-30% rollout claim lacks a complete matched budget table.

## [2026-08-20] ingest | JEPA, Recurrence, World-Model Diagnostics, Freedom, and OPD Batch

Ingested [[j-cot]], [[jepa-paradox-in-language]], [[recirculation]], [[generalization-theory-for-jepa-world-models]], [[viscore]], [[why-the-third-axis-is-freedom]], [[simpleopd]], and [[self-supervised-visual-on-policy-distillation]]. Updated [[iterative-refinement]], [[jepa]], [[world-models]], [[sampling-based-latent-planning]], [[representation-geometry]], [[candidate-exploration]], [[on-policy-distillation]], [[self-distillation]], [[self-supervised-learning]], and [[randall-balestriero]] with reciprocal synthesis. Updated [[index]], [[overview]], and README counts. The overview required synthesis changes because the batch adds central positions on conditional JEPA targets, finite-sample world-model theory, planning-stack diagnostics, recurrent interfaces, behavioral freedom, cross-tokenizer OPD, and self-supervised visual privilege.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (8 new, 12 updated, 107 chunks embedded before final log reindex).
Caveats: J-CoT v1 omits referenced appendices; language-JEPA experiments are limited to English C4 and BERT-family models; the JEPA planning theory uses strong assumptions and a synthetic environment; Recirculation transfers weakly beyond Gemma and serializes prefill; VIScore misses discrete contact modes; freedom evidence is synthetic and the primary selector comparison is not compute matched; SimpleOPD uses only exact span matches; S²VOPD requires answer-preserving augmentations and has limited model-family evidence.

## [2026-08-21] ingest | Remove Symmetries to Control Model Expressivity and Improve Optimization

Ingested [[remove-symmetries]] (arXiv: 2408.15495, ICLR 2025) and created entity page [[liu-ziyin]]. The paper proves reflection symmetries create low-capacity parameter traps and removes them with `syre` (weight-decay center shifted to a fixed random bias). Updated [[representation-collapse]] with a new prevention-mechanism section distinguishing parameter-space symmetry collapse from constant-embedding collapse, added an orthogonal-axis section and open question to [[ema-vs-non-ema-collapse-prevention]], and added a reciprocal connection to [[lejepa]]. Updated [[index]], [[overview]], and README counts. The overview required synthesis changes because syre adds a parameter-space regularization axis orthogonal to the SIGReg/VISReg embedding-distribution family.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (2 new, 5 updated, 34 chunks embedded before final log reindex).
Caveats: The paper never tests non-contrastive joint-embedding objectives where constant embeddings are a global optimum, so its guarantees do not cover JEPA-style embedding collapse; combining syre with EMA/SIGReg is untested in published work; the paper's own SimCLR result attributes only about half of the last-layer gap to symmetry.

## [2026-08-25] ingest | The Obsessed Encoder

Ingested [[obsessed-encoder]] (Enigma research blog, July 2026; no arXiv). Created source page, concept page [[feature-suppression]], and entity pages [[enigma]] and [[dinov3]]. Updated [[representation-collapse]] (feature suppression added as a distinct partial-collapse regime), [[jepa]] (contradiction callout: EMA and SIGReg defenses fail identically), [[lejepa]] and [[leworldmodel]] (reciprocal connections: SIGReg bypassed by folded low-dimensional sheets; RandGoal PushT collapse), and [[ema-vs-non-ema-collapse-prevention]] (new shared-failure-mode section + open question). Updated [[index]], [[overview]], and README counts. The overview required synthesis changes because the source adds Theme 15 (feature suppression / capacity allocation), which cuts across the existing EMA-debate theme by showing both defense families share the failure mode.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS.
Caveats: Blog post, not peer-reviewed; production-scale misallocation claim is the authors' stated belief supported by single-GPU reproductions; RandGoal has no matched control arm; classic feature-suppression primary sources (Chen Luo Li 2021, Sobal 2022, Xue 2023) cited but not yet ingested - recorded as a knowledge gap in [[overview]].

## [2026-08-25] ingest | What Matters for Latent Actions + Dynamic Compression

Ingested [[what-matters-latent-actions]] (arXiv: 2608.19613) and [[dynamic-compression]] (arXiv: 2608.17896). Created concept page [[latent-actions]] (first LAM coverage in the wiki) and entity page [[pulkit-agrawal]]. Updated [[iterative-refinement]] with a new Selective History Re-Scanning pattern and a third axis in its Key Tension (computation-memory beside compute-quality and width), added reciprocal links to [[recirculation]], [[world-action-models]], [[reconstruction-or-semantics-robotic-world-models]]. Updated [[index]], [[overview]], and README counts. The overview required synthesis changes: latent-action mid-training gives the WAM/action-free-video thesis an empirical recipe (Theme 3), and dynamic compression adds a memory-compute tradeoff to the recurrence theme (Theme 11).

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS.
Caveats: Paper details drawn from AlphaXiv abstracts and AI overviews; full PDFs not ingested locally. Benchmark names for the LAM study are not named in available material and were not invented. Learned-codebook results come from the Gated DeltaNet testbed only; language transfer is stated as future direction, not result.

## [2026-08-25] ingest | Orthogonal JEPA

Ingested [[orthogonal-jepa]] (arXiv: 2608.20065). Created source page. Updated [[sub-jepa]] with the learned-bases vs frozen-subspaces distinction, [[jepa]] with a factorized-prediction variant entry, [[representation-collapse]] with prevention mechanism #12 (orthogonal predictive factorization), and [[feature-suppression]] with OJEPA as the first structural allocation-aware candidate in the wiki. Updated [[index]], [[overview]], and README counts. The overview required synthesis changes because OJEPA independently shares Theme 15's capacity-monopolization diagnosis and proposes a structural fix, extending Theme 6's regularization landscape beyond distributional objectives.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS.
Caveats: Paper details drawn from the AlphaXiv abstract and AI overview; full PDF not ingested locally. No public code repository is listed on the paper page. Factorization hyperparameter ablations (K, r, loss weights) are not exposed in available material.

## [2026-08-25] update | Orthogonal JEPA refined from full text

Read the arXiv HTML full text of [[orthogonal-jepa]] and refined its page: confirmed EMA target encoder + stop-gradient targets as part of the anti-collapse stack (no full distributional matching, no action-aligned losses), added pseudoinverse synthesis and Proposition 1, replaced speculative limitations with author-stated ones (no K/r/loss-weight ablation reported, variance floors do not guarantee full-rank covariance, B conditioning matters for rollout synthesis), and corrected Future Work to author-stated items. Updated [[overview]] counts unchanged; no other pages affected.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS.
Caveats: none.

## [2026-08-25] update | Grounded LAM and Dynamic Compression pages in full texts

Fetched arXiv HTML full texts and refined both source pages to primary-source grounding. [[what-matters-latent-actions]]: named benchmarks (LIBERO, LIBERO-Plus, RoboTwin2.0), confirmed Qwen3-VL-4B backbone and OpenVLA-OFT baseline, corrected integration strategies to five variants (DAP/LAP/JAP/JAP-DAP/JAP-LAP), added full paradigm ranking (LAPO 0.733 > ΔDINO 0.728 > ... > RAFT 0.643), VAE recommended over SIGReg as default continuous regularizer (SIGReg slower at no accuracy edge), precise dimensionality/normalization/scaling/real-robot numbers, and replaced inferred limitations with author-stated Section VI items. [[dynamic-compression]]: fixed state-size error (~111k elements, not ~1.1k), added median-vs-mean nuance to the codebook MSE comparison (median 17.4 vs 4.91), four-family table incl. repeat model 1.38, power-law scaling exponents ~6.1 vs ~2.3, K=6 training-failure caveat, HOLA concurrent-work distinction, and author-stated Discussion limitations replacing inferred ones. Corrected the same state-size error in [[iterative-refinement]] and [[overview]] Theme 11.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS.
Caveats: none.

## [2026-08-25] query | Multimodality of latent action distributions

User asked whether the VAE-regularized IDM can represent multimodal action distributions. Confirmed: yes it cannot, and the limitation compounds downstream - Stage I is mild (IDM conditions on both frames), but Stages II/III predict latents/actions from context-only inputs via L2 regression, which is mean-seeking under multimodal conditionals. Filed the synthesis into [[latent-actions]] open questions, cross-linked [[jepa-paradox-in-language]] (same centroid-collapse structure), noted the alternative reading of VQ-VAE's LIBERO-Plus zero-shot win (mode-committing discreteness), and its echo in [[orthogonal-jepa]]'s deterministic-predictor limitation.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS.
Caveats: The mode-committing reading of the VQ-VAE result is wiki synthesis, not a claim made by the paper.

## [2026-08-25] query | Multimodal predictors across the world-model cluster

User hypothesized INTACT and PRISM share a Gaussian-predictor multimodality problem. Verified: both confirmed (diagonal Gaussian heads, author-stated limitations naming mixture actors/heads as future work). Audited the wider cluster: LeWM, Fast-LeWM, Sub-JEPA, SMWM, Delta-JEPA all use deterministic latent MSE + CEM planning whose Gaussian elite refit reintroduces mode collapse; OJEPA and the LAM study are also exposed. Filed [[multimodal-futures-in-latent-world-models]] comparison page with audit table and method inventory (mixture heads, diffusion/flow, discrete codes, CVAE, energy-based heads, GRAM width scaling, best-of-many) - noting most escapes already exist in other wiki clusters. Added reciprocal links from [[intact]] and [[prism-prior-guided-imagination-sampling]]. Updated [[index]], [[overview]], and README counts. The overview required synthesis changes because the new comparison is the wiki's fourth filed analysis and connects the world-model cluster to the generation/reasoning clusters on the multimodality axis.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS.
Caveats: The centroid-collapse port to action latents and the mode-committing reading of VQ-VAE are wiki synthesis, not claims made by the cited papers.

## [2026-08-25] ingest | LpWM: A Case for Sparse Representations in World Models

Ingested [[lpwm]] (arXiv: 2608.22764). Created source page, concept page [[sparse-representations]], and researcher entity [[yilun-kuang]]. Updated [[leworldmodel]] (LpWM as sparse successor beating dense LeWM by 24-57% at intermediate predictor capacity on PushT), [[lejepa]] (RDMReg extends distribution matching past maximum-entropy density; dense Gaussian is the p=2 no-ReLU special case; new open question), [[jepa]] (RDMReg row in collapse-prevention table, sparse-geometry variant entry, sources list), [[representation-collapse]] (prevention mechanism #13: sparse distribution matching - maximum-entropy density shown unnecessary for non-degenerate embeddings), [[visreg]] (shared random-projection + Wasserstein machinery, opposite target philosophy), [[orthogonal-jepa]] (parallel structural alternative reducing transition complexity), and [[multimodal-futures-in-latent-world-models]] (audit row, discrete-codebook hybrid note in method table, LpWM evidence added to the VQ-transfer open question). Updated [[yann-lecun]] and [[randall-balestriero]]. Updated [[index]], [[overview]], and README counts. The overview required synthesis changes because LpWM adds a new position to Theme 6: the latent geometry question (sparse vs dense) sits upstream of the regularizer debate, since even a non-maximum-entropy target trains stably while improving planning efficiency; new open question #30 and a knowledge gap for the un-ingested rectified-line predecessors.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS (3 new, 12 updated, 78 chunks embedded).
Caveats: Paper details grounded in the arXiv HTML full text. LpWM's sparse-support/feature-suppression connection in [[sparse-representations]] is flagged there as untested wiki synthesis; the capacity-window hypothesis and temporal-regularization design are author-stated future work.

## [2026-08-25] query | LpWM sparsity level and sparsity ablation

User asked about the operating sparsity and whether performance degrades as sparsity increases. Confirmed from Appendix H.1 / Table 3: codes run ~30-65% active coordinates at a fixed default target (mu=0, Rectified Laplace); sparsity is controlled by the target parameter mu but no sparsity-vs-performance ablation exists - sweeps grid only lambda_RDMReg and learning rate, with one training seed per cell. Extreme sparsity (exact one-hot) is ruled out only theoretically via the O(N^{-1/d}) curse of dimensionality. Filed as an open-question callout in [[lpwm]].

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PASS.
Caveats: none.

## [2026-09-04] ingest | LeFlow, DriftWorld, LeVJEPA, Better Slots Better Worlds, OPSA, and SMELT

Ingested [[leflow]], [[driftworld]], [[levjepa]], [[better-slots-better-worlds]], [[opsa]], and [[smelt]]. Created [[drifting-generative-models]], [[object-centric-world-models]], and [[looped-transformers]]. Updated [[jepa]], [[world-models]], [[sampling-based-latent-planning]], [[flow-matching]], [[dense-visual-representations]], [[representation-collapse]], [[self-supervised-learning]], [[on-policy-distillation]], [[self-distillation]], [[iterative-refinement]], [[dinov3]], [[yann-lecun]], and [[randall-balestriero]]. Updated [[index]], [[overview]], and README bookkeeping. The overview required synthesis changes because the batch adds a new amortized planning interface, single-step drifting video simulation, efficient video JEPA pretraining, object-centric robustness evidence, teacher-free OPD self-adaptation, and a compute-matched result for looped MoE Transformers.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PARTIAL (lexical index PASS; embedding failed because the host's Metal backend could not initialize and no CPU-only runtime is installed).
Caveats: Results are from the cited arXiv v1/v2 papers and their released HTML; no local PDFs or raw source files were added. QMD has 25 pending embeddings until a working CPU or Metal runtime is available.

## [2026-09-04] ingest | State-Prediction Separation Hypothesis and Best Practice Critic Optimization

Ingested [[state-prediction-separation]] and [[best-practice-critic-optimization]]. Created [[state-prediction-separation-concept]] and [[critic-based-llm-rl]] concept pages, and updated [[iterative-refinement]], [[index]], [[overview]], and README bookkeeping. The overview adds the state-versus-prediction gradient-routing theme and a critic-based LLM reinforcement-learning theme that distinguishes BPCO from OPD, OPSA, and group-relative training.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PARTIAL (lexical index PASS: 4 new, 4 updated, 141 unchanged; embedding failed because the host's Metal backend could not initialize and no CPU-only runtime is installed).
Caveats: Results are grounded in the cited arXiv v1/v2 HTML papers; no local PDFs or raw source files were added. QMD has 29 pending embeddings until a working CPU or Metal runtime is available.

## [2026-09-04] ingest | Looped Transformers under the Jacobian Lens

Ingested [[looped-transformers-jacobian-lens]] (arXiv: 2609.01924). Created [[jacobian-lens-workspace]] and updated [[looped-transformers]], [[iterative-refinement]], [[representation-geometry]], [[index]], [[overview]], and README bookkeeping. The synthesis distinguishes readable workspace content from content that survives recurrent transport and from content that changes behavior under intervention. It records Ouro's checkpoint reconstruction, Huginn's short transport window, and the paper's warnings about lens validity and cross-model confounds.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PARTIAL (lexical index PASS: 2 new, 5 updated, 144 unchanged; embedding failed because the host's Metal backend could not initialize and no CPU-only runtime is installed).
Caveats: Results are grounded in the arXiv v1 full HTML paper; no local PDF, raw source, or code repository was added. QMD has 32 pending embeddings until a working CPU or Metal runtime is available.

## [2026-09-04] ingest | Loop, Think, & Generalize

Ingested [[loop-think-generalize]] (arXiv: 2604.07822, COLM 2026). Created [[compositional-generalization]] and updated [[looped-transformers]], [[iterative-refinement]], [[index]], [[overview]], and README bookkeeping. The synthesis adds controlled evidence that recurrent depth supports systematic composition and depth extrapolation, while documenting the roles of grokking, training recurrence, initialization, shortcut-resistant data, overthinking, and entropy-aware halting.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PARTIAL (lexical index PASS: 2 new, 5 updated, 146 unchanged; embedding failed because the host's Metal backend could not initialize and no CPU-only runtime is installed).
Caveats: Results are grounded in the arXiv v2 full HTML paper; no local PDF or raw source was added. The code repository is linked from the paper metadata. QMD has 34 pending embeddings until a working CPU or Metal runtime is available.

## [2026-09-04] ingest | Latent Energy Action Planning with World Models

Ingested [[latent-energy-action-planning]] (arXiv: 2609.03294). Updated [[sampling-based-latent-planning]], [[world-models]], [[leworldmodel]], [[index]], [[overview]], and README bookkeeping. The synthesis files LEAP as a cross-representation planning objective: latent goal matching supplies the main direction, decoder-predicted terminal-state matching catches some optimizer-favored mismatches, and action projection enforces admissible bounds without certifying offline-data support.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PARTIAL (lexical index PASS: 1 new, 5 updated, 148 unchanged; embedding failed because the host's Metal backend could not initialize and no CPU-only runtime is installed).
Caveats: Results are grounded in the arXiv v1 full HTML paper; no local PDF or raw source was added. No code repository is listed on the paper page. QMD has 36 pending embeddings until a working CPU or Metal runtime is available.

## [2026-09-05] ingest | ROMS-IMLE: A Minimalist Approach to Competitive Single-Step Generative Modelling

Ingested [[roms-imle]] (arXiv: 2607.19332) and created [[single-step-generative-models]]. Updated [[flow-matching]], [[candidate-exploration]], [[index]], [[overview]], and README bookkeeping. The synthesis frames ROMS-IMLE as a one-step alternative that transfers multi-stage supervision from iterative stochastic-interpolant models into an IMLE decoder, then controls nearest-neighbour outliers with robust loss and latent-support errors with round-trip rejection.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd reindex PARTIAL (lexical index PASS: 2 new, 5 updated, 149 unchanged; embedding failed because the host's Metal backend could not initialize and no CPU-only runtime is installed).
Caveats: Results are grounded in the arXiv v2 full HTML paper; no local PDF or raw source was added. The ImageNet FID 2.56 uses round-trip rejection and the reported comparisons mix protocols across papers. Training-time candidate search and the use of frozen LPIPS, DINO, and EQ-VAE components remain important costs. QMD has 39 pending embeddings until a working CPU or Metal runtime is available.

## [2026-09-07] query | Few-step generative modeling for world, world-action, and JEPA planning

Researched whether XM, IMLE, drifting, and related low-step generative methods have been applied to world models, World Action Models, and JEPA planning. Filed [[few-step-generative-modeling-for-world-action-and-jepa-planning]] with an evidence table and scope distinctions. Direct evidence includes XM on Maze2D, DriftWorld for one-step action-conditioned video, Flash-WAM for one-step-per-modality WAM distillation, LeFlow and Qantara for JEPA-compatible flow/bridge planning, and FF-JEPA for latent diffusion subgoal planning. ROMS-IMLE remains image-only, while IMLE Policy is an adjacent one-step visuomotor policy result; XM-to-JEPA is proposed future work rather than a demonstrated result.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd lexical reindex PASS (1 new, 3 updated, 153 unchanged, 0 removed); embedding step FAIL (Metal backend could not initialize).
Caveats: The comparison relies on arXiv HTML/abstracts, alphaXiv PDF queries, and released project pages; several papers are recent preprints and use different compute and evaluation protocols. QMD reports 40 unique hashes still needing embeddings.

## [2026-09-07] query | Generative modeling techniques carried into LLMs

Researched whether generative modeling techniques beyond diffusion have transferred to LLMs. Filed [[generative-modeling-techniques-in-llms]] with evidence for flow matching, normalizing flows, VAEs, GFlowNets, energy-based models, GAN-style objectives, consistency methods, and continuous autoregressive language models. The synthesis distinguishes generator replacement from latent reasoning, RL objectives, and inference-time scoring.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd lexical reindex PASS (1 new, 3 updated, 154 unchanged, 0 removed); embedding step FAIL (Metal backend could not initialize).
Caveats: Evidence combines original arXiv abstracts/full text, targeted alphaXiv PDF queries, and the existing wiki. Several direct-generation and latent-reasoning results are recent preprints rather than established production LLM paradigms. QMD reports 41 unique hashes still needing embeddings.

## [2026-09-07] query | XM, IMLE, and drifting for language modeling

Followed up on whether XM, IMLE, and drifting have been applied to language modeling. Updated [[generative-modeling-techniques-in-llms]]: XM has a preliminary XMDLM result on discrete language modeling, drifting has a direct TokenDrift result on discrete diffusion language models, and generator-style IMLE still has no clear standard text-language-model application. IMLE evidence remains concentrated in policies, trajectory planners, and stochastic world models.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); qmd lexical reindex PASS (0 new, 2 updated, 156 unchanged, 0 removed); embedding step FAIL (Metal backend could not initialize).
Caveats: XM and TokenDrift language results are recent preprints and primarily target discrete diffusion language models, not conventional autoregressive frontier LLMs. The IMLE conclusion is a literature-search finding, not proof that no unpublished or non-indexed result exists. QMD reports 41 unique hashes still needing embeddings.

## [2026-09-09] ingest | Fresh four-paper AlphaXiv experiment

Ingested four papers from fresh AlphaXiv reads: [[fractal-basins-trap-latent-reasoning]], [[latent-geometry-beyond-search]], [[convergeflow]], and [[latent-action-as-intention]]. Created concepts [[reasoning-dynamics]] and [[continuous-language-modeling]]. Created entities [[gc-idm]], [[lawa]], [[robocasa]], [[libero-plus]], and [[openwebtext]]. Updated [[world-models]], [[sampling-based-latent-planning]], [[latent-actions]], [[flow-matching]], [[representation-geometry]], [[iterative-refinement]], [[index]], and [[overview]]. Paper 2608.29029 was not ingested.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); npm test PASS (15 tests); qmd reindex PASS with lexical index and embeddings refreshed.
Caveats: The four papers are recent preprints. Their benchmark protocols differ, and the LAWA paper states that code and models will be released.

## [2026-09-10] ingest | Semigroup-JEPA: Latent Dynamics Consistency for Zero-Shot Physics Generalization

Ingested [[semigroup-jepa]] (arXiv: 2609.10464). Created model entity [[sg-jepa-model]]. Updated [[jepa]], [[world-models]], [[randall-balestriero]], [[index]], [[overview]], and README bookkeeping. The source page records the controlled encoder-predictor crossover, the long-horizon physics results, the gravity-conditioned control results, and the paper's internal inconsistency in its introduction versus its experiment and conclusion.

Verification: wiki:validate PASS (0 errors, 5 pre-existing venue warnings); npm test PASS (15 tests); qmd lexical reindex PASS; embedding step FAIL because the host's Metal backend could not initialize.
Caveats: Results are grounded in the AlphaXiv AI report and targeted extracted pages from arXiv v1; no local PDF or raw source was added. The main text's reported 34% Approach Ball improvement differs from the percentage implied by Appendix Table 10 values. Existing pending qmd embeddings remain unresolved.
