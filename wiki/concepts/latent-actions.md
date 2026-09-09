---
title: "Latent Action Models"
type: concept
created: 2026-08-25
updated: 2026-09-09
tags:
  - self-supervised-learning
  - world-model
  - robotics
  - video
  - representation-learning
sources:
  - "[[what-matters-latent-actions]]"
  - "[[latent-action-as-intention]]"
aliases:
  - "LAM"
  - "Latent action learning"
  - "Latent actions"
---

# Latent Action Models

## Overview

Latent Action Models (LAMs) learn **compact surrogate actions from unlabeled video** by modeling how the environment changes between consecutive frames. An Inverse Dynamics Model (IDM) infers a latent action $z_t$ from a frame pair $(o_t, o_{t+1})$, and a Forward Dynamics Model (FDM) reconstructs $o_{t+1}$ from $(o_t, z_t)$, forcing the latent to carry transition information. The result is an auto-annotator that converts raw video into $(observation, latent\ action, instruction)$ data - bridging the gap between web-scale visual data and scarce labeled robot demonstrations.

[[what-matters-latent-actions|What Matters for Latent Actions]] provides the first systematic empirical study, unifying representative methods in one framework and ablating 41 design choices.

[[latent-action-as-intention|LAWA]] uses the same action-free transition idea inside a World Action Model. Its tokenizer uses DINOv2 patch features, frame differences, a discrete codebook, next-frame reconstruction, and hand or manipulator mask prediction. The policy freezes this tokenizer and jointly denoises a continuous latent-action sequence with executable actions. This keeps a future intention available at test time without reconstructing future observations.

## The Three-Stage Pipeline

The unified recipe from [[what-matters-latent-actions|the empirical study]]:

1. **Pre-training** - train IDM-FDM autoencoding on unlabeled video to learn latent actions
2. **Mid-training** - use the IDM to auto-annotate video-text datasets; fine-tune a VLM backbone on $(o_t, z_t, l)$ triplets so it internalizes transition dynamics
3. **Post-training** - fine-tune on limited real robot data $(o_t, a_t, l)$, mapping learned representations to physical control signals

## Design Space Findings

From the 41-choice ablation:

| Axis | Finding |
|------|---------|
| Paradigm | Implicit reconstruction (LAPO) remains remarkably strong; explicit $\Delta$DINO autoencoding is competitive; optical flow underperforms |
| Regularization | Strength matters more than type for continuous latents; VQ-VAE discretization uniquely helps zero-shot generalization |
| Dimensionality | $d_z = 32$ optimal (supports 14-DoF bimanual); skip normalizing regularized latents at mid-training |
| Integration | JAP (jointly predict latent + physical action) > LAP > DAP - the latent acts as a continuous auxiliary task |

## Relationship to Other Wiki Threads

- **vs. [[jepa|JEPA]]**: JEPA predicts future *representations* without extracting actions; LAMs factor the transition into an explicit pseudo-action. Both learn from unlabeled video, but LAM latents are optimized to be decodable into motor commands
- **[[world-action-models|World Action Models]]**: the WAM survey identifies action-free human video as a key untapped data source; LAM mid-training is the concrete mechanism for exploiting it, and the study's design recipe makes that practical
- **[[reconstruction-or-semantics-robotic-world-models|Semantic over reconstruction]]**: both studies converge on semantic feature spaces ($\Delta$DINO beats pixel-level motion signals here, mirroring semantic-latent advantages for world models)
- **[[delta-world|DeltaWorld]]**: parallel compression of frame-to-frame change (delta tokens vs. latent actions), generative vs. policy-oriented endpoints
- **[[latent-action-as-intention|LAWA]]**: discrete transition codes become continuous future intentions for a World Action Model; action-free egocentric pretraining improves the most when robot demonstrations are scarce
- **[[patch-policy|Patch Policy]]**: complementary controlled study - frozen generic ViT features vs. trained task-oriented latent actions for manipulation
- **[[jepa-paradox-in-language|JEPA Paradox in Language]]**: same centroid-collapse failure under deterministic point prediction of multimodal conditionals - see the open question below

## Open Questions

> [!open-question]
> How faithful are latent actions to true physical actions when real labels exist? The empirical study evaluates downstream success but not latent-action fidelity.

> [!open-question]
> Can cheap proxy metrics that fine-rank LAM designs replace full three-stage pipeline evaluations?

> [!open-question]
> Do discrete (VQ-VAE) latent primitives' zero-shot advantages persist at larger scale and across embodiments?

> [!open-question]
> **Unimodal latents vs multimodal transitions**: the study's pipeline is unimodal end-to-end - a Gaussian VAE regularizer at Stage I, then L2 regression of latents and actions from context-only inputs at Stages II/III. When one context admits several valid transitions, L2 point prediction covers to the conditional mean, which may be a physically invalid action - the action-domain twin of [[jepa-paradox-in-language|the JEPA paradox in language]]. Mild at Stage I (the IDM sees both frames), severe once prediction runs from observation alone. VQ-VAE's zero-shot edge on LIBERO-Plus may partly reflect mode-committing discreteness rather than only primitive reusability. Diffusion-style or discrete action heads are the standard escapes; neither is tested here.
