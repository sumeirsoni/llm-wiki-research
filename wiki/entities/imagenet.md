---
title: "ImageNet"
type: entity
created: 2026-04-10
updated: 2026-06-30
tags:
  - dataset
  - benchmark
  - image-classification
sources:
  - "[[lejepa]]"
  - "[[bootleg]]"
  - "[[v-jepa-2-1]]"
  - "[[un-0-coupled-oscillators]]"
aliases:
  - "ImageNet-1K"
  - "ILSVRC"
---

# ImageNet

## Overview

ImageNet-1K is the standard benchmark for evaluating image [[self-supervised-learning|self-supervised learning]] representations. It contains ~1.28M training images across 1,000 classes. The standard evaluation protocol is **linear probing** or **linear evaluation** — training a linear classifier on frozen backbone features.

## Results in This Wiki

| Method                     | Architecture | Linear Eval Accuracy                 |
| -------------------------- | ------------ | ------------------------------------ |
| [[lejepa|LeJEPA]]         | ViT-H/14     | 79%                                  |
| [[bootleg|Bootleg]]       | —            | +10% over I-JEPA                     |
| [[v-jepa-2-1|V-JEPA 2.1]] | ViT-G        | (primarily evaluated on video tasks) |

## Role as Benchmark

ImageNet-1K linear evaluation is the most widely used metric for comparing SSL methods, though it has limitations:

- Favors methods that learn globally discriminative features
- Doesn't measure dense prediction quality (segmentation, depth)
- Doesn't measure temporal/video understanding

Papers like [[v-jepa-2-1|V-JEPA 2.1]] and [[bootleg|Bootleg]] also evaluate on ADE20K, Cityscapes, and other dense prediction benchmarks to show more complete picture.

## Generation Benchmark

ImageNet 64×64 is also used for **class-conditional image generation** evaluation (FID@50k):

| Method | Params | FID@50k |
| --- | --- | --- |
| [[un-0-coupled-oscillators|Un-0.n16384]] | 322M | 6.74 |

Un-0 uses coupled Kuramoto oscillator dynamics rather than diffusion or GAN backbones; quality is comparable to early conventional generators (BigGAN, iDDPM) but below later SOTA (EDM).
