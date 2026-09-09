---
title: "Better Slots, Better Worlds: Representation Quality & Robustness in Object-Centric World Models"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2608.12078"
authors:
  - "Shukrullo Nazirjonov"
  - "Sai Prasanna"
  - "Anna Manasyan"
  - "Georg Martius"
year: 2026
venue: "arXiv preprint (cs.CV)"
pdf_path: "https://arxiv.org/pdf/2608.12078v1"
tags:
  - world-model
  - jepa
  - vision
  - representation-learning
  - robotics
  - reinforcement-learning
aliases:
  - "Better Slots, Better Worlds"
  - "SlotContrast-WM study"
---

# Better Slots, Better Worlds: Representation Quality & Robustness in Object-Centric World Models

## Summary

This controlled study asks what actually makes object-centric world models useful for visual model-predictive control. It varies the quality of the slot encoder, compares object-centric SlotContrast-WM against scene-centric DINO-WM and end-to-end [[leworldmodel|LeWM]], and evaluates both in-distribution planning and unseen visual or dynamics shifts on PushT and OGBench-Cube. Planning success rises with slot quality until the slots are good enough, after which gains saturate. Well-bound slots remove the need for auxiliary proprioception and slot masking, while robustness is shared most strongly by models built on frozen pretrained visual features.

## Key Contributions

- Isolates slot quality from world-model and planner effects by sweeping SlotContrast checkpoints with a fixed planning setup.
- Tests whether unsupervised FG-ARI and mBO slot metrics predict closed-loop planning success.
- Shows that a sufficiently strong object-centric representation can remove auxiliary proprioception and slot-masking objectives used by earlier C-JEPA-style systems.
- Compares object-centric, frozen patch-based, and end-to-end global representations under object, frame, and geometry shifts.
- Identifies pretrained visual features, not object-centricity alone, as a major contributor to robustness.

## Methodology

The study builds on the C-JEPA framework but replaces VideoSAUR with SlotContrast, which provides stronger temporal consistency and avoids Hungarian matching across frames. DINOv3 replaces DINOv2 as the frozen visual feature extractor. The default SlotContrast-WM is non-causal and uses neither the slot-masking objective nor an auxiliary proprioception token.

All models plan with CEM toward object-slot goals. The evaluation covers 2D PushT and 3D OGBench-Cube. Slot quality is measured with video versions of FG-ARI and mean Best Overlap (mBO), while downstream performance is measured by planning success under in-distribution and shifted visual or dynamics conditions. Baselines are DINO-WM, which plans over frozen patch features, and LeWM, which plans over an end-to-end learned global CLS representation.

## Key Results

- On PushT, planning success correlates with slot quality at $r=0.96$ for FG-ARI and $r=0.94$ for mBO; on OGBench-Cube, the mBO correlation is $r=0.87$.
- The quality benefit saturates once slots cleanly bind the task-relevant objects, showing that sharper masks are not an unlimited substitute for better dynamics or planning.
- SlotContrast-WM without proprioception or masking reaches 84.7% success on PushT, close to the 85.3% full C-JEPA recipe and 10 points above VideoSAUR in the reported comparison.
- Adding proprioception helps the weak encoder but barely changes the strong SlotContrast configuration; masking without proprioception degrades both encoders.
- Under object-level appearance shifts, SlotContrast-WM is most robust, DINO-WM degrades moderately, and LeWM degrades substantially. SlotContrast-WM and DINO-WM remain close to in-distribution performance on OGBench-Cube shifts, while all models fail on geometric changes that alter contact dynamics.

## Connections

- Directly extends [[causal-jepa|Causal-JEPA]] and adds an empirical representation-quality test to [[object-centric-world-models]].
- Uses the same frozen-feature robustness axis highlighted by [[dino-wm|DINO-WM]] and [[dense-visual-representations]], while contrasting it with end-to-end LeWM.
- Adds an object-factorized alternative to the global and patch-level latent geometries compared in [[world-models]].
- Shares the CEM planning interface documented in [[sampling-based-latent-planning]] and the representation-versus-control separation emphasized by [[viscore|VIScore]].
- Updates the robustness question in [[robot-world-model-architectures]]: object-centric inductive bias helps, but frozen pretrained features may explain much of the observed advantage.

## Limitations & Open Questions

> [!open-question]
> Unsupervised slot metrics become less informative when task-relevant objects are small relative to the scene, as in OGBench-Cube. Task-aware quality metrics remain needed.

> [!open-question]
> All models fail under geometric shifts that change object shape and contact dynamics. Better object binding does not by itself provide physical invariance.

> [!open-question]
> The experiments cover two controlled environments and a fixed planner. More objects, scales, dynamics, embodiments, and end-to-end encoder-world-model training are not tested.

## Future Work

The authors propose task-aware representation metrics, end-to-end encoder-world-model training, and evaluation in more diverse environments with varied object counts, scales, richer dynamics, and stronger tests of compositional generalization.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.12078)
- [arXiv](https://arxiv.org/abs/2608.12078)
- [HTML](https://arxiv.org/html/2608.12078v1)
- [PDF](https://arxiv.org/pdf/2608.12078v1)

