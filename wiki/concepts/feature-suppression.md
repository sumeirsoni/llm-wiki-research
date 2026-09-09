---
title: "Feature Suppression"
type: concept
created: 2026-08-25
updated: 2026-08-25
tags:
  - self-supervised-learning
  - representation-learning
  - theory
  - optimization
sources:
  - "[[obsessed-encoder]]"
  - "[[orthogonal-jepa]]"
aliases:
  - "Shortcut features"
  - "Capacity misallocation"
  - "Predictable-feature domination"
  - "Slow-feature obsession"
---

# Feature Suppression

## Overview

Feature suppression occurs when an encoder latches onto a **low-entropy, easily predictable feature** and allocates it a disproportionate share of the latent budget, crowding out more informative features. Unlike total [[representation-collapse|representation collapse]] (all inputs mapped to one embedding), the encoder remains *functional* by ordinary training metrics - the loss looks healthy - but most of the representation's capacity is spent on a feature worth only a few bits.

[[obsessed-encoder|The Obsessed Encoder]] demonstrates this is not a legacy problem: DINOv3, [[lejepa|LeJEPA]], and [[leworldmodel|LeWM]] all reproduce it despite their anti-collapse defenses. In some experiments, a ~12-bit watermark dominated a 1024-dimensional latent space.

## History

The failure predates JEPA:

- **Chen, Luo & Li (2021)** ([arXiv:2011.02803](https://arxiv.org/abs/2011.02803)) planted a few bits in ImageNet images and watched SimCLR-era encoders obsess over them, coining *feature suppression*. A few injected bits fully suppressed ImageNet features; their appendix reproduces the effect on BYOL and with Gaussian distribution-matching losses, so it is not limited to contrastive objectives.
- **Sobal et al. (2022)** ([arXiv:2211.10831](https://arxiv.org/abs/2211.10831)) showed VICReg-style world models lock onto slow video features and neglect dynamics; they gave a simple mathematical argument that JEPA-style training is vulnerable to episode-constant shortcuts, since fixating on such a feature drives prediction loss to zero.
- **Theory** ([Xue et al. 2023](https://arxiv.org/abs/2305.16536)): suppression persists at any embedding width when augmentations fail to disrupt the easy feature (Theorem 5.4); wider embeddings and better augmentations are only partial mitigations.

## Allocation, Not Selection

An encoder's job is to pack selected features into a fixed latent budget, ideally in proportion to information content ([[obsessed-encoder|Enigma's]] framing). JEPA-style training instead incentivizes extreme disparities favoring *predictable* features:

- Latent capacity is zero-sum: every over-allocated feature implies another crowded out
- The inflated features fit comfortably in a tiny fraction of the space they consume
- **Modest gaps suffice**: small predictability differences between otherwise comparable features tip allocation from sharing into winner-take-all - and no two real features are exactly equally predictable

Video is especially vulnerable: consecutive frames share content, so natural slow features are everywhere.

## Why Anti-Collapse Defenses Miss It

Existing defenses constrain the *statistics* of embeddings, not their *information content*:

- **SIGReg** ([[lejepa|LeJEPA]]) tests Gaussianity via random 1-D projections (Epps-Pulley on the empirical characteristic function). A collapsed encoder that spreads a 3-degree-of-freedom state across 192 dimensions as a folded low-dimensional sheet passes every projection test - distributional regularity does not imply informative allocation
- **Self-distillation + Sinkhorn-Knopp centering + KoLeo** ([[dinov3|DINOv3]]) balance teacher outputs statistically but do not measure what the dimensions encode

The collapsed solution even achieves **lower training loss** than the honest one - the objective actively prefers it. Below the extreme case, the same bias operates as a quiet tax, overspending capacity on predictable features.

## Filtering Is Not Enough

Prior work filters easy features out: suppressing static video backgrounds ([Wang et al. 2021](https://arxiv.org/abs/2009.05769), [Huang et al. 2021](https://arxiv.org/abs/2104.00862)), erasing watermark shortcuts with learned lenses ([Minderer et al. 2020](https://arxiv.org/abs/2002.08822)), bisimulation objectives on pretrained features ([Toso et al. 2026](https://arxiv.org/abs/2602.18639)), or within-trajectory contrastive negatives ([Gulati & Nemenman 2026](https://arxiv.org/abs/2606.07770)).

[[obsessed-encoder|RandGoal]] breaks this strategy: the agent's start pose is fixed and the goal pose randomized across episodes. The goal is exactly the kind of episode-constant slow feature filters remove - but it *is the task signal*, read by the planner through the same encoder. Filtering it erases the goal from the goal frame too. A system-level fix must address allocation itself rather than remove suspect features.

## Evidence Summary

From [[obsessed-encoder|The Obsessed Encoder]], each row shows the same signature (loss crossover + probes fail + embeddings cluster by pattern):

| System | Defense stack | Planted/natural feature | Outcome |
|--------|--------------|------------------------|---------|
| [[dinov3]] | EMA self-distillation + Sinkhorn-Knopp + KoLeo | 12-bit seed luminance watermark | Classification probe decays to chance; depth probe regresses |
| [[lejepa]] | SIGReg | Same watermark at half opacity | Same signature |
| [[leworldmodel]] | SIGReg | 5x5 px per-episode color square (<0.05% of image) | Planner success at chance |
| [[leworldmodel]] | SIGReg | RandGoal (randomized goal pose) | Below-baseline loss, planner success at chance |

Pixel-matched controls (pattern re-sampled per view) track clean baselines throughout, isolating predictability as the cause.

## Open Questions

> [!open-question]
> What does an allocation-aware objective look like? The predictability bias is central to JEPA's inductive bias and should be preserved - the open problem is preventing winner-take-all without discarding it. [[orthogonal-jepa|Orthogonal JEPA]] offers the first structural candidate in this wiki: factorized prediction over learned orthogonal bases makes ignoring low-magnitude components impossible because each branch minimizes its own local error. Whether such architectural fixes resist deliberately planted features ([[obsessed-encoder|Obsessed Encoder]]-style) is untested.

> [!open-question]
> Does this misallocation quietly tax production encoders ([[dinov3|DINOv3]]) today? Plausible per [[obsessed-encoder|Enigma]] but not yet demonstrated at flagship scale.

> [!open-question]
> Do action-aligned defenses ([[sensorimotor-world-models|inverse dynamics]], [[delta-jepa|latent-difference decoding]]) resist feature suppression better than distributional ones? They penalize latents that cannot recover actions, which is closer to information content - untested against planted predictable features.

## Connections

- [[representation-collapse]] - total collapse is the degenerate extreme; feature suppression is the partial, harder-to-detect regime
- [[jepa]] - the predictability bias causing suppression is also JEPA's core inductive bias
- [[ema-vs-non-ema-collapse-prevention]] - both EMA-based and SIGReg-based defense stacks fail identically
- [[jepa-paradox-in-language]] - a different way healthy-looking collapse prevention fails to preserve useful information
- [[orthogonal-jepa|Orthogonal JEPA]] - structural mitigation direction: factorized prediction branches over orthogonal bases counteract dominant-signal monopolization (same diagnosis, independent work)
