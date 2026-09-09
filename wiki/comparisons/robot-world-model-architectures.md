---
title: "Robot World Model Architectures"
type: comparison
created: 2026-07-03
updated: 2026-07-30
tags:
  - world-model
  - reinforcement-learning
  - vision
  - jepa
  - generative-modeling
sources:
  - "[[world-model-for-robot-learning-survey]]"
  - "[[world-action-models]]"
  - "[[reconstruction-or-semantics-robotic-world-models]]"
  - "[[leworldmodel]]"
  - "[[delta-jepa]]"
  - "[[sensorimotor-world-models]]"
  - "[[dino-wm]]"
  - "[[delta-world]]"
  - "[[v-jepa-2-1]]"
  - "[[fast-leworldmodel]]"
  - "[[prism-prior-guided-imagination-sampling]]"
  - "[[patch-policy]]"
  - "[[intact]]"
aliases:
  - "Robotics world model comparison"
  - "JEPA vs diffusion vs VLA world models"
---

# Robot World Model Architectures

## Question

How do **JEPA-style latent planners**, **generative video/diffusion world models**, and **VLA / World Action Model (WAM)** approaches compare for robotics — on latent type, training signal, planning interface, and evaluation?

## Summary

The wiki's robotics sources agree that **semantic latents outperform reconstruction latents** for policy-relevant rollouts ([[reconstruction-or-semantics-robotic-world-models|Reconstruction or Semantics]]), but they disagree on the best architecture for closed-loop control. JEPA end-to-end world models ([[leworldmodel|LeWM]] → [[delta-jepa|Delta-JEPA]]) optimize latent dynamics for MPC; [[fast-leworldmodel|Fast-LeWM]] and [[prism-prior-guided-imagination-sampling|PRISM]] improve rollout and proposal interfaces; [[intact|INTACT]] instead learns a direct intent-to-action interface while retaining the forward model for optional verification; frozen-VFM generative models ([[delta-world|DeltaWorld]]) prioritize sample-efficient video forecasting; VLAs and [[world-action-models|WAMs]] jointly model states and actions; and [[patch-policy|Patch Policy]] shows that frozen [[dense-visual-representations|dense visual features]] can support a lightweight direct policy without learned dynamics or imagined rollouts.

## Architecture Families

| Family | Representative sources | Latent / output | Training signal | Planning / control |
|--------|-------------------------|-----------------|-----------------|------------------|
| **JEPA latent dynamics** | [[leworldmodel|LeWM]], [[sub-jepa|Sub-JEPA]], [[sensorimotor-world-models|SMWM]], [[delta-jepa|Delta-JEPA]], [[intact|INTACT]] | Patch/object latents from pixels | Latent prediction + regularization or inverse/action supervision | MPC / CEM, or Direct control with optional local verification |
| **Frozen semantic encoder WM** | [[dino-wm|DINO-WM]], [[temporal-straightening|Temporal Straightening]], [[adajepa|AdaJEPA]] | Frozen DINOv2 patches | Latent consistency on offline trajectories | Zero-shot visual MPC to goal image |
| **Generative video WM** | [[delta-world|DeltaWorld]], Cosmos-class diffusion | VFM features or pixels | Reconstruction / delta-token prediction | Best-of-N rollouts; dense forecasting metrics |
| **Semantic-latent diffusion WM** | [[reconstruction-or-semantics-robotic-world-models|Reconstruction or Semantics]] | V-JEPA 2.1, Web-DINO, SigLIP 2 | Diffusion in semantic latent space | Action recovery + policy-in-the-loop |
| **VLA / WAM** | [[world-action-models|World Action Models]], RT-style policies | Multimodal tokens | Imitation + joint state-action modeling | Direct action output; less explicit rollouts |
| **Frozen dense-feature direct policy** | [[patch-policy|Patch Policy]] | Frozen pretrained ViT patch tokens | Behavior cloning with standard transformer policy heads | Direct action chunks; no learned transition model or imagined rollout |

## JEPA World Models on Shared Benchmarks

Four end-to-end JEPA world models share LeWM-style environments (Two-Room, Reacher, Push-T, OGB-Cube):

| Method | Collapse prevention | OGB-Cube SR | Notes |
|--------|--------------------|--------------|----|
| [[leworldmodel|LeWM]] | Full-space SIGReg | 64.1% | Baseline; fastest planning claim |
| [[sub-jepa|Sub-JEPA]] | Subspace SIGReg | 62.7% | Strong on Two-Room (90.6%) |
| [[sensorimotor-world-models|SMWM]] | Concat inverse dynamics | 84.0% | Best 3D among SIGReg-era methods |
| [[delta-jepa|Delta-JEPA]] | LDAD on $\Delta z_t$ | **79.3%** | Best mean across all four tasks |

> [!open-question]
> Does [[delta-jepa|Delta-JEPA]]'s displacement decoding subsume [[sensorimotor-world-models|SMWM]]'s concat inverse dynamics under distractor-rich 3D settings?

## Planning Interface After Representation Learning

Recent LeWM extensions optimize distinct parts of [[sampling-based-latent-planning]]:

| Method | Interface changed | Main result |
| --- | --- | --- |
| [[fast-leworldmodel|Fast-LeWM]] | Dynamics query and rollout | 3.9 times faster dynamics evaluation; average success 90.5% vs 85.8% |
| [[prism-prior-guided-imagination-sampling|PRISM]] | Candidate proposal distribution | PushT 89% vs 57% and Cube 79% vs 44% at 128 samples |
| [[intact|INTACT]] | Direct inverse/action interface | 95.33% Direct macro with zero candidates; 96.86% with bounded local verification |

Fast-LeWM shows that one-step autoregression is not required for short-horizon latent MPC. PRISM shows that an accurate scorer can still waste budget on poor proposals. INTACT learns the goal-to-action conversion jointly with the representation, making sampled search optional on its demonstrated support. These interventions are complementary in principle, but no shared experiment combines parallel prefix prediction, calibrated proposals or direct actions, uncertainty-triggered verification, and deployment adaptation.

## Semantic vs Reconstruction Latents

[[reconstruction-or-semantics-robotic-world-models|Reconstruction or Semantics]] (robotic diffusion WM):

- **Reconstruction latents** (VAE-style): good pixel fidelity, weaker action recovery
- **Semantic latents** (V-JEPA 2.1, Web-DINO, SigLIP 2): better action faithfulness in policy-in-the-loop eval

This aligns with [[delta-world|DeltaWorld]] operating in frozen DINOv3 space rather than pixels — temporal delta tokens in semantic feature space beat Cosmos at 2,000× fewer FLOPs on dense forecasting.

## Evaluation Criteria (from surveys)

[[world-model-for-robot-learning-survey|World Model for Robot Learning]] and [[world-action-models|World Action Models]] highlight that robotics evaluation spans:

1. **Visual plausibility** — video quality, segmentation/depth consistency
2. **Physical consistency** — object permanence, contact dynamics
3. **Action faithfulness** — can predicted futures recover correct actions?
4. **Closed-loop policy success** — does the WM improve real robot performance?

No single paper in the wiki scores all four on identical benchmarks — cross-family comparison remains approximate.

## Tradeoff Summary

| Priority | Likely direction |
|----------|-----------------|
| Sample-efficient dense forecasting | [[delta-world|DeltaWorld]]-style delta tokens in VFM space |
| End-to-end pixel planning from scratch | [[delta-jepa|Delta-JEPA]] / [[sensorimotor-world-models|SMWM]] |
| Zero-shot goal-image planning on offline data | [[dino-wm|DINO-WM]] → [[temporal-straightening|Temporal Straightening]] |
| Deployment under distribution shift | [[adajepa|AdaJEPA]] closed-loop TTA |
| Fast CEM candidate evaluation | [[fast-leworldmodel|Fast-LeWM]] action-prefix prediction |
| Low-budget MPPI sample efficiency | [[prism-prior-guided-imagination-sampling|PRISM]] uncertainty-aware proposal fusion |
| Search-free in-domain JEPA control with optional verification | [[intact|INTACT]] shared intent-to-action operator |
| Reactive embodied foundation model | [[world-action-models|WAM]] / VLA joint modeling |
| High-frequency in-domain control over frozen dense features | [[patch-policy|Patch Policy]] without explicit world rollout |
| Object-centric causal reasoning | [[causal-jepa|C-JEPA]] |

## Gaps

> [!gap]
> No wiki source runs JEPA latent planners, semantic-latent diffusion WMs, and VLA policies on **identical robot benchmarks** with all four evaluation criteria above.

> [!gap]
> [[v-jepa-2-1|V-JEPA 2.1]] is evaluated heavily on action anticipation but not as an explicit MPC world model in the same environments as [[delta-jepa|Delta-JEPA]].

## Related Pages

- [[world-models]] — concept overview
- [[reconstruction-or-semantics-robotic-world-models]] — semantic vs reconstruction evidence
- [[world-action-models]] — WAM definition
- [[world-model-for-robot-learning-survey]] — robotics survey
