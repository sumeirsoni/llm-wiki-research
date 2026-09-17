---
title: "FineWeb-Edu"
type: entity
created: 2026-09-13
updated: 2026-09-13
tags:
  - dataset
  - language
  - self-supervised-learning
sources:
  - "[[predicting-order-upcoming-tokens]]"
  - "[[next-latent-prediction]]"
  - "[[state-prediction-separation]]"
  - "[[lost-in-backpropagation]]"
aliases:
  - "FineWeb Edu"
  - "sample-100BT"
---

# FineWeb-Edu

## Identity

FineWeb-Edu is a language-model pretraining corpus used by several studies in this wiki. The TOP paper trains on the sample-100BT subset, using 52B tokens for its 340M models and 104B tokens for its 1.8B and 7B models.

## Role in this wiki

- [[token-order-prediction|TOP]] uses the corpus to compare next-token, multi-token, and token-order objectives.
- [[next-latent-prediction|NextLat]] uses FineWeb-Edu to test belief-state representations and self-speculative decoding.
- [[state-prediction-separation|SPS]] uses FineWeb-Edu for matched comparisons of persistent state and immediate prediction streams.
- [[lost-in-backpropagation|Lost in Backpropagation]] uses FineWeb-Edu in controlled head-rank pretraining experiments.
