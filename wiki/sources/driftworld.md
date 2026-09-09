---
title: "DriftWorld: Fast World Modeling through Drifting"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2607.15065"
authors:
  - "Susie Lu"
  - "Haonan Chen"
  - "Weirui Ye"
  - "Yilun Du"
year: 2026
venue: "arXiv preprint (cs.RO)"
pdf_path: "https://arxiv.org/pdf/2607.15065v2"
code_url: "https://github.com/Susie-Lu/driftworld"
project_url: "https://susie-lu.github.io"
tags:
  - world-model
  - generative-modeling
  - video
  - robotics
  - representation-learning
aliases:
  - "DriftWorld"
---

# DriftWorld: Fast World Modeling through Drifting

## Summary

DriftWorld adapts drifting generative models to action-conditioned video world modeling. Instead of performing multi-step diffusion denoising for every imagined rollout, it learns a conditional drifting field during training and generates a future frame or video chunk in one forward pass. An action-conditioned U-Net, feature-space loss using pretrained DINOv2 or DINOv3 features, motion weighting, and self-forcing address action following, visual sharpness, and autoregressive drift. Across simulated and real-robot datasets, the model supports fast candidate ranking and offline policy evaluation while matching or exceeding slower diffusion baselines on reported visual metrics.

## Key Contributions

- Introduces a single-step action-conditioned world model based on drifting rather than diffusion sampling.
- Conditions a U-Net frame-wise on past observations and future actions, with an accentuated action-following signal to discourage static predictions.
- Uses dense DINOv2 or DINOv3 feature-space drifting for complex real-world scenes and motion-weighted losses to emphasize moving regions.
- Adds self-forcing on the model's own predictions to improve autoregressive rollout quality.
- Demonstrates both inference-time policy improvement through GPC-RANK and high-fidelity offline ranking of robot policies.

## Methodology

Given an observation history and candidate future actions, DriftWorld maps noise and conditioning information to a future video chunk in one forward pass. Its training field combines attraction toward the ground-truth future with repulsion from generated negative samples. The model uses frame-wise FiLM and cross-attention so each action conditions the corresponding future frame.

For simple simulated domains, the drifting loss can operate in pixel space. For Bridge-V2, RT-1, and Language Table, the loss is computed in the spatial feature maps of frozen DINOv2 or DINOv3 encoders. Motion weighting increases the loss on regions that change relative to the current frame, while self-forcing exposes the model to its own generated history during a second training stage. At inference, a base policy proposes 50 action chunks, DriftWorld rolls them out, and a learned reward model selects the best proposal.

## Key Results

- The paper reports an average 17x inference speedup over diffusion-based world-model baselines, with generation above 30 FPS on the evaluated robotics settings.
- On PushT, DriftWorld's 64-frame rollout has SSIM 0.9941, PSNR 34.7751, LPIPS 0.0035, and 0.0037 seconds per generated frame on one H100; the same model also outperforms an MSE-trained single-step baseline.
- With GPC-RANK and 50 proposals, PushT policy IoU rises from 0.635 to 0.772 for one policy and from 0.612 to 0.755 for another, using 0.912 seconds for all proposals.
- Predicted PushT policy scores correlate with ground truth at Pearson $r=0.9515$; Robomimic correlations reach 0.9916 and 0.9250 across reported tasks.
- DINO feature-space losses substantially improve real-world visual quality, while motion weighting plus self-forcing lowers the reported RT-1 FVD from 174.67 to 62.84.

## Connections

- Extends [[world-models|world models]] toward a generative-video branch optimized for fast imagination rather than compact latent prediction.
- Complements [[delta-world|DeltaWorld]] and [[reconstruction-or-semantics-robotic-world-models|semantic robotic world models]]: all use learned visual representations to make predictive rollouts practical, but DriftWorld generates pixels or VAE-space video instead of future feature deltas.
- Relies on the dense pretrained visual features discussed in [[dense-visual-representations]], and adds another use of [[dinov3|DINOv3]] as a training-time semantic loss space.
- Improves the rollout side of [[sampling-based-latent-planning|candidate-based planning]], while [[leflow|LeFlow]] amortizes the proposal side in latent trajectory space.
- Its drifting objective is related to but distinct from [[flow-matching|flow matching]]: both move distributions through vector fields, but DriftWorld trains a one-step generator with attractive and repulsive sample fields rather than integrating a learned continuous transport path at inference.

## Limitations & Open Questions

> [!open-question]
> DriftWorld relies on a robust pretrained DINOv2 or DINOv3 feature extractor for sharp real-world predictions, so the method's dependence on foundation features is not eliminated.

> [!open-question]
> Training requires multiple generated negative samples, reported as 64 in the paper, which raises memory use and limits context and generation-window lengths by GPU VRAM.

> [!open-question]
> The 17x speedup and policy-ranking correlations are benchmark results. Long-horizon consistency, broader embodiments, and real-world closed-loop deployment remain less established than offline simulation and proposal ranking.

## Future Work

The authors propose increasing context and generation-window lengths to improve long-range temporal consistency, potentially using sparse history or a temporally compressed video VAE.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2607.15065)
- [arXiv](https://arxiv.org/abs/2607.15065)
- [HTML](https://arxiv.org/html/2607.15065v2)
- [PDF](https://arxiv.org/pdf/2607.15065v2)
- [Code and project](https://susie-lu.github.io)
- [GitHub](https://github.com/Susie-Lu/driftworld)

