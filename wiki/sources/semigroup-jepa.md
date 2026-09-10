---
title: "Semigroup-JEPA: Latent Dynamics Consistency for Zero-Shot Physics Generalization"
type: source
created: 2026-09-10
updated: 2026-09-10
arxiv_id: "2609.10464"
authors:
  - "Andy Zeyi Liu"
  - "Haoran Sun"
  - "Lucas Baker"
  - "Randall Balestriero"
  - "John Sous"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2609.10464v1"
project_url: "https://sg-jepa.github.io/"
tags:
  - jepa
  - world-model
  - representation-learning
  - theory
  - reinforcement-learning
aliases:
  - "Semigroup-JEPA"
  - "SG-JEPA"
---

# Semigroup-JEPA: Latent Dynamics Consistency for Zero-Shot Physics Generalization

## Summary

Semigroup-JEPA (SG-JEPA) extends [[leworldmodel|LeWorldModel]] with gravity conditioning and recursive latent-rollout training. The model trains an encoder and a temporal predictor together. It feeds predicted latents back into the next prediction step, then tests the frozen model on gravity values outside the narrow training range. Across MuJoCo prediction and robot-control tasks, SG-JEPA improves long-horizon physical prediction and control under out-of-distribution gravity. Crossover experiments attribute most of the gain to the representation learned by the encoder during GRU training, not to the original predictor alone.

## Key Contributions

- Extends LeWM with a gravity value supplied as an extra action coordinate.
- Replaces LeWM's one-step teacher-forced loss with a discounted five-step autoregressive latent-rollout loss.
- Tests zero-shot physics generalization across weak, normal, and strong gravitational fields while keeping the scene and control interface fixed.
- Introduces a linear feature model that separates local law-conditioned error from error amplified by recursive rollout.
- Shows that the GRU-trained encoder representation remains better when fresh GRU or Transformer predictors are fitted to frozen representations.

## Methodology

SG-JEPA uses a ViT-Tiny encoder with 12 Transformer layers, 3 attention heads, and hidden width 192. The encoder maps the final `[CLS]` token to a 256-dimensional latent. The action encoder receives the external action together with the episode's constant gravity value. The predictor reads the latest `H = 20` latents and action embeddings. The paper evaluates Transformer, GRU, and state-space predictors; the main SG-JEPA results use the GRU and SSM variants.

The training objective is

$$
\mathcal{L} = \mathcal{L}_{\mathrm{roll}} + \lambda_{\mathrm{sig}}\mathcal{L}_{\mathrm{SIGReg}}.
$$

`L_roll` predicts `K = 5` future latents autoregressively. Each prediction enters the next history window. The rollout weights use `gamma = 0.95`. Target latents come from the same trainable encoder without stop-gradient. SIGReg acts on the encoded latents to prevent collapse. Models train for 20 epochs with batch size 64 and a hybrid Muon/AdamW optimizer.

The study creates eight MuJoCo datasets. Five test physical-state prediction: right triangle, square, pentagon, house, and Approach Ball. Three test control: Arm Catcher Ball, Arm Paddle Ball, and Franka Paddle-to-Basket. Training samples gravity from a narrow distribution centered at 4 for the planar tasks and at 9.8 for most 3D tasks. Held-out test sets use wider gravity grids, including values associated with Pluto, the Moon, Mars, and Venus. The prediction evaluation fits an MLP probe for physical state and measures excess error through 44 autoregressive frames. The control evaluation freezes each visual encoder and trains a gravity-conditioned Diffusion Policy on its features.

The representation analysis freezes encoders from jointly trained GRU and Transformer models, then fits fresh GRU and Transformer predictors. It also compares teacher-forced prediction with free rollout and supplies incorrect gravity values as a counterfactual.

## Key Results

- On the square dataset at 44 rollout steps, SG-JEPA (GRU) reduces position, velocity, and cumulative-rotation error by 31-48% relative to DINO-WM. SG-JEPA (SSM) is close behind.
- On Approach Ball, Appendix Table 10 reports mean position error of 0.0491 for SG-JEPA (GRU), 0.0495 for SG-JEPA (SSM), 0.0705 for DINO-WM, and 0.0986 for Original LeWM. At the final horizon, the corresponding errors are 0.0764, 0.0785, 0.1152, and 0.1229 meters. The main text summarizes the SG-JEPA gain over DINO-WM as approximately 34%, while the table values imply about 30% under that averaging protocol.
- SG-JEPA is the best method at 22 of 25 held-out gravity values for Approach Ball. Original LeWM performs best at some very low gravity values.
- On Arm Catcher Ball, SG-JEPA (GRU) raises capture success from 9.5% with DINO-WM to 23.3%. On Arm Paddle Ball, it raises success from 17.7% to 23.8%. On Franka Paddle-to-Basket, it raises strict basket-entry success from 27.4% to 30.5% in the main comparison.
- The frozen-representation crossover gives lower mean rollout error for the GRU-trained representation with either fresh predictor: 1.376 versus 1.555 with a fresh GRU, and 1.269 versus 1.453 with a fresh Transformer. On far-OOD gravity values, SG-JEPA lowers teacher-forced local error by about 32% relative to DINO-WM.
- The free-rollout gap grows from a small local difference to about 0.38 near horizon 20, while the teacher-forced gap stays below 0.06. This supports the claim that recursive feedback amplifies a representation-level advantage.
- Supplying incorrect gravity values increases rollout error. Sparse post-training at gravity values `{0, 2, 6, 8}` reduces error at unseen interpolation values by 14.1% on average, compared with 6.9% for post-training on each target gravity alone.

## Connections

- [[leworldmodel|LeWorldModel]] is the direct base model. SG-JEPA keeps LeWM's pixel encoder, predictor, and SIGReg foundation while adding known-physics conditioning and recursive rollout supervision.
- [[dino-wm|DINO-WM]] is the frozen-feature baseline. SG-JEPA compares a jointly trained representation against DINOv2 features under the same physical prediction and diffusion-policy evaluations.
- [[jepa|JEPA]] gains a controlled test of whether a latent world model preserves dynamics under composition and parameter shift.
- [[world-models|World Models]] gains an empirical counterpart to its theory and planning diagnostics: local representation quality can determine long-horizon rollout quality under changing dynamics.
- [[generalization-theory-for-jepa-world-models|A Generalization Theory for JEPA-Based World Models]] studies planning guarantees and spectral approximation. SG-JEPA instead measures physics transfer and recursive error in simulated visual dynamics.
- [[representation-geometry|Representation Geometry]] gains a task-grounded example in which the useful representation preserves dynamics-relevant state rather than only low latent distance.
- [[randall-balestriero|Randall Balestriero]] co-authored the paper and contributed to the SIGReg and LeWM line of work it extends.

## Limitations & Open Questions

The experiments vary one known scalar, gravity. They do not test vector-valued physical parameters or infer those parameters from observations. Shape transfer is uneven: training on triangle and square transfers much of the house's translational dynamics, but rotation remains difficult and the pentagon remains challenging.

The theoretical analysis uses a linear feature model, while the learned predictor is nonlinear, history dependent, and affected by contact events that can change the transition branch. The main evaluation also uses simulated MuJoCo scenes and supplies gravity directly to the model, so it does not test unknown physical parameters or real-world sensing.

The paper has an internal reporting inconsistency. The introduction says that retraining the encoder leaves performance unchanged and retraining the predictor degrades it, then attributes the gain to the predictor. The controlled crossover in Section 4 and Appendix D.5 reports the opposite interpretation: the advantage follows the GRU-trained encoder representation and survives replacement of the predictor. This page follows the controlled experiment and conclusion.

> [!open-question]
> Can recursive rollout training generalize from one known scalar to vector-valued, partially observed, and contact-rich physical parameters without making the encoder overfit to the training regime?

## Future Work

- Test vector-valued physical variables and settings in which the model infers dynamics parameters from observations.
- Train generalist models on more diverse shapes and environments to improve transfer beyond the tested planar bodies.
- Develop nonlinear, history-dependent theory that includes contact-driven regime changes and action effects.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2609.10464)
- [arXiv](https://arxiv.org/abs/2609.10464)
- [PDF](https://arxiv.org/pdf/2609.10464v1)
- [Project Page](https://sg-jepa.github.io/)
