---
title: "Token Order Prediction"
type: concept
created: 2026-09-13
updated: 2026-09-13
tags:
  - language
  - transformer
  - self-supervised-learning
  - representation-learning
  - optimization
sources:
  - "[[predicting-order-upcoming-tokens]]"
  - "[[next-latent-prediction]]"
  - "[[hierarchical-latent-prediction]]"
  - "[[state-prediction-separation]]"
  - "[[lost-in-backpropagation]]"
aliases:
  - "TOP"
  - "Token-order prediction"
  - "Future-token auxiliary objectives"
---

# Token Order Prediction

## Overview

Token Order Prediction (TOP) is a training-only auxiliary objective for autoregressive language models. It teaches a model to rank vocabulary items by the distance to their next occurrence in the upcoming sequence. The objective supplies a softer future-token signal than exact Multi-Token Prediction (MTP) while leaving standard next-token prediction (NTP) available for sampling at inference.

## Objective

For hidden state $h_t$ and a future window of $W$ tokens, TOP assigns each vocabulary item $v$ a score based on its nearest future occurrence:

$$
y_{t,v}=W-d \quad \text{when } v \text{ first appears } d \text{ steps after } t, \; 1 \leq d \leq W.
$$

The model maps $h_t$ to vocabulary scores with one additional linear head. A ListNet-style loss compares the softmax of the target scores with the softmax of the predicted scores. The total training loss is the sum of NTP and TOP losses.

TOP predicts proximity, not a complete future continuation. It keeps the order of the first upcoming occurrence for each vocabulary item and ignores items outside the window.

## TOP versus related objectives

| Objective | Target | Extra training structure | Inference role |
| --- | --- | --- | --- |
| NTP | The next token | One standard unembedding head | Supplies autoregressive probabilities |
| MTP | Exact tokens at several future offsets | Multiple transformer-block heads | Can support future-token drafts |
| TOP | A proximity ranking over future vocabulary items | One additional unembedding head | Removed after training |
| NextLat | Future hidden states and token distributions | A training-only latent dynamics model | Optional latent drafting |

MTP increases prediction difficulty as the offset grows and adds a transformer block for each configured future token. TOP keeps one head for all distances in the chosen window. This makes its parameter cost independent of $W$, although the vocabulary-sized head still adds parameters.

## Evidence and design tradeoffs

The initial TOP study trains models at 340M, 1.8B, and 7B parameters on FineWeb-Edu. TOP beats NTP in 20 of 24 task-level comparisons and beats the reproduced MTP baseline in 20 comparisons, with one tie. The result is strongest at 1.8B, where TOP improves on NTP across all eight tasks. At 7B, TOP improves on six tasks and loses on PIQA and Social IQa.

The model uses TOP only while training. The paper reports a slightly higher NTP training loss for TOP models, paired with lower LAMBADA perplexity and stronger downstream scores. That pattern is consistent with regularization, but the study does not isolate regularization from other causes.

TOP and [[next-latent-prediction|NextLat]] share a goal: make hidden states useful for future sequence structure while keeping the deployed model close to a standard autoregressive transformer. Their targets differ. NextLat predicts hidden-state transitions. TOP predicts a vocabulary-space order distribution. [[state-prediction-separation|SPS]] changes the stream architecture instead of adding a second future-oriented loss.

## Open Questions

> [!open-question]
> What window size gives the best tradeoff between useful look-ahead and noisy or diffuse ranking targets?

> [!open-question]
> Does the extra TOP head preserve or change the vocabulary-gradient bottleneck measured by [[lm-head-gradient-bottleneck|LM-head gradient work]]?

> [!open-question]
> Can TOP scores guide self-speculative decoding without turning the ranking head into a second expensive generation path?
