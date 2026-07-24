---
title: "ARC Is a Vision Problem!"
type: source
created: 2026-06-09
updated: 2026-07-11
arxiv_id: "2511.14761"
authors:
  - "Keya Hu"
  - "Ali Cy"
  - "Linlu Qiu"
  - "Xiaoman Delores Ding"
  - "Runqian Wang"
  - "Yeyin Eva Zhu"
  - "Jacob Andreas"
  - "Kaiming He"
year: 2025
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2511.14761"
tags:
  - vision
  - transformer
  - representation-learning
  - benchmark
aliases:
  - "VARC"
  - "Vision ARC"
---

# ARC Is a Vision Problem!

## Summary

Vision ARC (VARC) reframes the Abstraction and Reasoning Corpus (ARC) as an image-to-image translation problem solved with standard computer vision architectures. A single 18M-parameter ViT trained from scratch on ARC data — with visual priors including canvas representation, 2D positional embeddings, and scale/translation augmentation — achieves 54.5% on ARC-1 and 60.4% in ensemble, matching average human performance, substantially outperforming recurrent reasoning models trained on the same data.

## Key Contributions

- **Vision-centric ARC formulation**: treats each task as per-pixel classification on a fixed canvas, analogous to semantic segmentation, with task-conditional embeddings.
- **Visual priors for abstract reasoning**: canvas representation, 2D RoPE, patchification with multi-color patches, scale/translation augmentation, and border tokens for output shape — cumulatively adding 27.7 percentage points over a naive baseline.
- **Two-stage training**: offline joint training on all ARC-1 tasks plus RE-ARC augmentation, followed by per-task test-time training (TTT) with geometric augmentations as auxiliary tasks.
- **Multi-view inference**: majority voting over 510 augmented views boosts pass@1 from 35.9% to 49.8%.
- **Human-level ARC-1 performance**: ViT-18M + U-Net-55M ensemble reaches 60.4%, matching reported average human performance (60.2%).

## Methodology

Raw ARC grids (max 30×30, 10 colors) are placed on a 64×64 canvas with background and border tokens. A ViT (or U-Net) processes patchified canvas inputs conditioned on learnable task embeddings. Training has two stages:

1. **Offline**: joint training on all 400 ARC-1 training tasks with RE-ARC augmentation.
2. **Test-time training**: for each unseen test task, fine-tune with a new random task token using demonstration pairs with flip/rotation/color-permutation augmentations.

Inference aggregates predictions from multiple canvas views via average pooling and majority voting.

## Key Results

- **ARC-1**: 54.5% (single ViT-18M), 60.4% (ensemble); vs HRM 40.3%, TRM 44.6%, GPT-5 44.0%.
- **ARC-2**: 8.3% (single), 11.1% (ensemble).
- **Visual prior ablations**: scale augmentation (+6.2 pts), translation (+2.9), 2D RoPE over 1D (+3.5), patchification (+2.4).
- **TTT is essential**: offline pre-training adds ~28 points; independent per-task TTT beats joint multi-task TTT by ~10 points.
- **Task embedding clustering**: t-SNE shows semantically similar tasks cluster together, indicating learned abstractions.

## Connections

- Challenges the language-centric view of ARC reasoning; complements [[generative-recursive-reasoning|GRAM]], [[equilibrium-reasoners|Equilibrium Reasoners]], and [[probabilistic-tiny-recursive-model|PTRM]] as an alternative reasoning paradigm.
- Uses [[self-distillation|self-distillation]]-like test-time adaptation rather than internet-scale pre-training, aligning with the wiki's interest in data-efficient learning.
- Visual priors (2D locality, scale/translation invariance) connect to [[representation-geometry|representation geometry]] and the role of inductive biases in generalization.
- Kaiming He's involvement links to the broader vision SSL tradition covered in [[jepa|JEPA]] and related pages.

## Limitations & Open Questions

> [!open-question]
> Can VARC-style visual priors combine with stochastic multi-trajectory reasoning ([[generative-recursive-reasoning|GRAM]]) or attractor-landscape shaping ([[equilibrium-reasoners|Equilibrium Reasoners]]) for further gains?

> [!open-question]
> Does framing ARC as vision generalize to ARC-2 and beyond, or does the performance gap to best LLM solvers indicate fundamental limits of the vision-only approach?

> [!open-question]
> What pre-training on larger visual datasets would add beyond scratch training on ARC alone?

## Future Work

- Extend VARC with more expressive architectures and richer visual priors beyond the ViT/U-Net baselines tested.
- Improve fundamental pass@k accuracy rather than relying primarily on multi-view voting ensembles.
- Focus future research on generalization, including stronger 2D positional embeddings and expanding the output token set beyond the limited color palette used here.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2511.14761)
- [arXiv](https://arxiv.org/abs/2511.14761)
- [PDF](https://arxiv.org/pdf/2511.14761)
