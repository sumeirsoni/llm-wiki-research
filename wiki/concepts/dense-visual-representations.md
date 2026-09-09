---
title: "Dense Visual Representations"
type: concept
created: 2026-07-25
updated: 2026-09-04
tags:
  - vision
  - representation-learning
  - self-supervised-learning
  - robotics
sources:
  - "[[patch-policy]]"
  - "[[dino-wm]]"
  - "[[prism-prior-guided-imagination-sampling]]"
  - "[[temporal-straightening]]"
  - "[[v-jepa-2-1]]"
  - "[[levljepa]]"
  - "[[levjepa]]"
  - "[[better-slots-better-worlds]]"
aliases:
  - "Dense visual features"
  - "Patch-level visual representations"
  - "Dense patch features"
---

# Dense Visual Representations

## Overview

Dense visual representations retain a spatial lattice of local feature tokens rather than collapsing an image or video frame into one CLS token, global average, or compressed state vector. Each patch embedding carries both semantic information and a location within the visual field, allowing downstream systems to reason about object parts, relative positions, contact regions, and fine geometric changes.

Density is an interface property, not a guarantee of quality. A representation can preserve many spatial tokens while still encoding weak semantics, unstable dynamics, or geometry poorly aligned with a downstream planner.

## Dense vs. Global Readouts

A global feature is efficient because a downstream model processes one vector per frame. The cost is an information bottleneck: pooling may preserve scene category or dominant objects while discarding the arrangement of local features.

Dense readouts instead expose the patch grid to the downstream model. This supports:

- localization and segmentation;
- multi-object relations;
- contact-sensitive manipulation;
- latent state prediction at spatial resolution;
- selective or prompt-conditioned access to local features.

The main tradeoff is sequence length. If a policy observes $T$ frames with $P$ patches each, attention operates over $T \times P$ tokens rather than $T$ global states.

## Evidence Across the Wiki

### Dense representation learning

[[v-jepa-2-1|V-JEPA 2.1]] applies predictive loss to visible and masked tokens and deep self-supervision across layers, explicitly training spatially grounded features. [[levljepa|LeVLJEPA]] shows that pooled zero-shot image-text accuracy can diverge from patch-token utility: its non-contrastive encoder trails contrastive models on zero-shot classification but leads on frozen segmentation and VLM-backbone evaluations.

[[levjepa|LeVJEPA]] adds a different efficiency result: only sparse random patch tokens are processed during pretraining, but unsupervised patch tokens still develop semantically organized spatial structure. Its block-causal encoder preserves temporal ordering and makes the dense feature interface plausible for streaming or world-model use, although dense downstream tasks are not yet evaluated.

### Latent planning

[[dino-wm|DINO-WM]] uses frozen DINOv2 patch features as the observation space for a learned latent transition model. Its patch-versus-global ablation shows that manipulation planning depends on spatial detail. [[prism-prior-guided-imagination-sampling|PRISM]] reaches a related conclusion from the planner side: an improved action proposal raises performance with either representation, but Push-T remains poor when the world model observes only a global DINOv2 CLS token. Better search cannot reconstruct state information removed before planning begins.

### Direct robot control

[[patch-policy|Patch Policy]] extends the evidence beyond explicit world models. It feeds frozen patch tokens directly into lightweight VQ-BeT and Diffusion Policy heads through block-causal attention. Dense features provide the largest gains on precise, multi-object, and contact-rich tasks, including real-robot cable insertion, pen collection, and tool hanging.

Patch Policy evaluates V-JEPA 2 as one frozen encoder, not the later [[v-jepa-2-1|V-JEPA 2.1]] model. Its reported V-JEPA 2 control results therefore should not be treated as a V-JEPA 2.1 benchmark.

[[better-slots-better-worlds|Better Slots Better Worlds]] provides a complementary object-centric result: slots derived from frozen pretrained features can be more robust under appearance shifts than an end-to-end global representation. The study suggests that spatial detail alone is insufficient; object binding and the quality of the pretrained foundation both matter.

## Density, Dimensionality, and Geometry

Spatial density and channel dimensionality are different compression axes:

- Patch Policy spatially downsamples 256 patch positions to 64, 16, 4, or 1 on Push-T and loses substantial control performance.
- [[temporal-straightening|Temporal Straightening]] compresses the channel width of each DINOv2 spatial token from 384 to 8 without degrading planning in its tested setting.

These results are compatible. Removing patch positions destroys spatial support, while reducing per-token width can preserve the arrangement of local features.

Dense features also do not solve [[representation-geometry|representation geometry]] automatically. Temporal Straightening finds that semantically rich DINOv2 patches can trace curved latent trajectories where Euclidean distance is poorly aligned with shortest-action distance. A control system may therefore require both spatially resolved observations and task-appropriate latent geometry.

## Downstream Interface Matters

The value of dense features depends on how they are consumed:

- Dense prediction heads can read each patch independently or through multiscale fusion.
- VLMs can connect patch tokens to language models through a learned bridge.
- World models can predict future patch grids and optimize actions against latent goals.
- Direct policies can use block-causal attention to integrate patches within frames and preserve causality across frames.

This separates representation density from policy scale. Patch Policy shows that direct access to pretrained patches does not inherently require a billion-parameter VLA, while DINO-WM shows that the same class of features can support explicit imagined rollouts.

## Tradeoffs

- **Compute and memory**: attention cost grows with the number of patches and context frames.
- **Latency**: dense tokens add policy latency even when frozen visual embeddings can be precomputed for training.
- **Task dependence**: fine spatial detail matters most for localization, object relations, and contact; coarse semantic tasks may gain less.
- **Backbone dependence**: pretraining objectives produce different patch quality. Patch Policy finds DINOv2 and WebSSL stronger than SigLIP 2 on its control suite, but this is a downstream-specific ranking rather than a universal ordering.
- **Compression risk**: learned pooling can remove small but action-critical details even when aggregate reconstruction or semantic metrics remain strong.

## Open Questions

> [!open-question]
> Can learned token selection or adaptive resolution reduce sequence length while guaranteeing retention of task-critical contact and object features?

> [!open-question]
> Which diagnostics predict patch-token utility across segmentation, VLM consumption, latent planning, and direct control better than global benchmark scores?

> [!open-question]
> Does task-specific encoder fine-tuning improve dense control features, or does it overfit away useful spatial structure and transfer?

> [!open-question]
> How stable are visual-backbone rankings across policy objectives, embodiments, language conditioning, and out-of-distribution environments?
