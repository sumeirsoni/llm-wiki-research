---
title: "The Obsessed Encoder"
type: source
created: 2026-08-25
updated: 2026-08-25
authors:
  - "Enigma Team"
year: 2026
venue: "Enigma research blog"
project_url: "https://www.enigma.inc/posts/obsessed-encoder"
code_url: "https://github.com/Enigma-Incorporated/The-Obsessed-Encoder"
tags:
  - self-supervised-learning
  - jepa
  - world-model
  - representation-learning
  - vision
  - video
aliases:
  - "Obsessed Encoder"
  - "Enigma Obsessed Encoder"
---

# The Obsessed Encoder

## Summary

[[enigma|Enigma]] reports that [[jepa|JEPA]]-style training **badly misallocates latent capacity toward its most predictable features**, with little regard for their information content. A faint, low-entropy feature - in some experiments a watermark carrying about 12 bits - can come to dominate a 1024-dimensional latent space while training metrics look perfectly healthy. The failure, known as [[feature-suppression|feature suppression]], is reproduced from scratch in three modern systems ([[dinov3|DINOv3]], [[lejepa|LeJEPA]], and [[leworldmodel|LeWM]]) despite each system's built-in anti-collapse defenses. The authors argue the problem is one of *allocation* rather than *selection*: latent capacity is zero-sum, and predictability bias tips allocation from sharing into winner-take-all. They release code and configs for full reproduction (each collapse trains in a few hours on a single H100).

## Key Contributions

- **Reproduces feature suppression in modern systems**: DINOv3, LeJEPA, and LeWM all collapse onto planted predictable features despite SIGReg, self-distillation + Sinkhorn-Knopp centering, and KoLeo respectively
- **Controlled experimental template**: adapts the Sobal et al. (2022) video protocol to images - a test group whose planted pattern is constant across augmented views vs. a pixel-matched control group that re-samples the pattern every view; equal corruption isolates *predictability* as the cause
- **Loss crossover evidence**: the collapsed group's training loss drops below both clean baseline and control, showing the objective actively prefers the degenerate solution
- **RandGoal**: a mild, natural variant of PushT (fixed start pose, randomized goal pose) where LeWM collapses without any synthetic injection - prediction loss sinks below baseline while planner success stays at chance
- **Geometric explanation**: a collapsed encoder fills at most a 3-dimensional surface in 192-dim embedding space yet passes SIGReg's random-projection Gaussianity test - "a low-dimensional sheet folded until it looks Gaussian"
- **Filtering is not enough**: prior work suppresses or filters easy features, but RandGoal shows this fails when the slow feature *is* the task-relevant signal (the goal itself)

## Methodology

Three groups per experiment: clean baseline, test (predictable pattern constant across views of an image / frames of an episode), control (pixel-matched pattern freshly sampled per view). Three measurements:

1. **Training loss crossover** - does the corrupted-test run beat the honest runs?
2. **Downstream probes** - ImageNet linear probe on CLS tokens and NYU-Depth probe on patch tokens (DINOv3); planner success rate (LeWM)
3. **Similarity analysis** - do pairs sharing an image stay more similar than pairs sharing only the injected pattern?

Experiments:

- **DINOv3** (arXiv:2508.10104): trained from scratch on ImageNet-1k with the published ViT-L/16 recipe (`vitl_im1k_lin834`) sized to a single GPU; planted 12-bit image-dependent seed luminance pattern applied before augmentation
- **LeJEPA** (arXiv:2511.08544): faithful port of the minimal recipe on ImageNet-1k, same patterns at half the opacity
- **LeWM** (arXiv:2603.19312) on PushT: (a) a 5x5 px colored square (<0.05% of the image), constant per episode in test vs. recolored every frame in control; (b) RandGoal, where the goal pose is randomized across episodes and enters only through rendered goal pixels with scripted expert demos

## Key Results

- **DINOv3**: watermarked loss drops below clean and control; classification probe peaks midway then decays toward chance; depth probe regresses; similarity curves swap (same-image pairs end near 0.14, shared-pattern pairs near 0.61, vs. 0.99/0.00 in healthy runs)
- **LeJEPA**: identical signature at half the watermark opacity, confirming SIGReg does not prevent predictable-feature domination
- **LeWM**: both the corner square and RandGoal produce below-baseline prediction loss with planner success never rising above chance; in the similarity analysis the collapse is so fast the curves are already swapped at first measurement
- **Control tracks baseline everywhere**: corruption alone is harmless; only *predictability* collapses
- **Modest gaps suffice**: small differences between otherwise comparable features tip allocation into winner-take-all - such gaps are unavoidable in real data

## The Anatomy of a Collapse

The authors show why anti-collapse regularizers miss this failure: the collapsed RandGoal encoder's embeddings are overwhelmingly determined by the 3-degree-of-freedom goal state, filling at most a 3D surface inside the 192-dim space. Yet its SIGReg penalty ends no higher than the healthy baseline's - random projections of the folded surface look Gaussian, just as they would for a true normal distribution (SIGReg uses the Epps-Pulley test on random 1-D projections). Distributional regularity of projections does not imply informative allocation of capacity.

## Connections

- Tests [[lejepa|LeJEPA]]'s SIGReg directly: distributional regularization toward isotropic Gaussians passes while information content collapses
- Reproduces collapse in [[leworldmodel|LeWM]]; notes LeWM's own authors had reported unexplained failures under mild PushT variations (Maes et al., 2026, arXiv:2605.21800) - RandGoal offers a candidate explanation
- Extends the classic feature-suppression literature ([Chen, Luo & Li 2021](https://arxiv.org/abs/2011.02803); [Sobal et al. 2022](https://arxiv.org/abs/2211.10831)) to modern JEPA-style systems; theory from [Xue et al. 2023](https://arxiv.org/abs/2305.16536) (Theorem 5.4) predicts suppression persists at any width when augmentations fail to disrupt the easy feature
- Shows both sides of the [[ema-vs-non-ema-collapse-prevention|EMA debate]] fail identically: EMA-based DINOv3 and SIGReg-based LeJEPA/LeWM are equally vulnerable
- Prior filtering approaches ([Wang et al. 2021](https://arxiv.org/abs/2009.05769), [Huang et al. 2021](https://arxiv.org/abs/2104.00862), [Minderer et al. 2020](https://arxiv.org/abs/2002.08822), [Toso et al. 2026](https://arxiv.org/abs/2602.18639), [Gulati & Nemenman 2026](https://arxiv.org/abs/2606.07770)) remove easy features but cannot when the feature is task-relevant
- Directly relevant to this wiki's frozen-feature cluster: [[delta-world|DeltaWorld]], [[patch-policy|Patch Policy]], and [[dino-wm|DINO-WM]] all consume frozen DINO-family features whose latent budget may already be misallocated
- See [[feature-suppression]] for the concept page and [[representation-collapse]] for the broader collapse landscape

## Limitations & Open Questions

> [!open-question]
> Does this misallocation actually tax production-scale encoders like DINOv3 as claimed? The production-system claim is stated as belief supported by scaled-down reproductions (single-GPU, 50K of 500K iterations), not demonstrated at flagship scale.

> [!open-question]
> What would an allocation-aware objective look like? The authors argue fixes must address allocation inequality directly rather than filter features, but present no solution - making efficient encoders via fair allocation remains open.

> [!contradiction]
> The post's framing challenges the sufficiency of distributional anti-collapse defenses ([[lejepa|SIGReg]]) and statistical balancing (Sinkhorn-Knopp, KoLeo) alike - neither distinguishes an informative embedding distribution from an uninformative one that merely looks Gaussian under random projections.

> [!gap]
> All image experiments plant synthetic patterns; RandGoal is the only non-synthetic demonstration, and it has no matched control of its own (the colored-square arms play that role).

## Future Work

Author-stated or clearly implied directions:

- Release is explicitly meant for others to **reproduce, challenge, and extend** - customize the injected feature (code, marked diffs against each published recipe, and figure configs are public)
- Fixing allocation inequality directly could make encoders **much more efficient**, unlocking new, easier training paradigms for compact representations
- The team remains "even more bullish" on SSL/JEPA paradigms - the collapse is framed as an obstacle on the way to their promise, not a reason to abandon them

## Links

- [Blog post](https://www.enigma.inc/posts/obsessed-encoder)
- [GitHub: The-Obsessed-Encoder](https://github.com/Enigma-Incorporated/The-Obsessed-Encoder)
