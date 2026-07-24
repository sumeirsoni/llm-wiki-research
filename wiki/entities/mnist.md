---
title: "MNIST"
type: entity
created: 2026-07-24
updated: 2026-07-24
tags:
  - dataset
  - benchmark
  - image-classification
  - representation-learning
sources:
  - "[[intelligence-from-learnable-novelty]]"
aliases:
  - "Modified National Institute of Standards and Technology database"
  - "MNIST handwritten digits"
---

# MNIST

## Overview

MNIST is a benchmark of 28 by 28 grayscale handwritten-digit images across ten classes. Its low dimensionality and clear category structure make it a common testbed for representation learning, clustering, visualization, and image classification.

## Role in This Wiki

[[intelligence-from-learnable-novelty|Intelligence from Learnable Novelty]] uses MNIST to test whether a label-free objective can organize an encoder around latent data categories. A trainable MLP maps each image to a unit-normalized 64-dimensional code and maximizes the code's [[learnable-novelty|learnable novelty]] under a fixed random reservoir. Labels are used only for held-out evaluation and t-SNE coloring.

After 500 training steps:

- linear-probe accuracy rises from 0.53 to 0.89;
- 5-nearest-neighbor accuracy rises from 0.66 to 0.89;
- the representation progressively separates into compact digit-associated regions.

## Benchmark Caveats

- MNIST is substantially simpler than natural-image, video, or multimodal datasets.
- Digit identity is a dominant low-dimensional factor, so spontaneous category separation may be easier than in data with many competing factors of variation.
- The reported result depends on a sufficiently selective bounded observer: weak ridge regularization or low spectral resolution reduces linear-probe accuracy below 0.5.
- Strong performance on MNIST is evidence of an objective's basic behavior, not broad representation-learning competitiveness.
