---
title: "State-Prediction Separation"
type: concept
created: 2026-09-04
updated: 2026-09-04
tags:
  - transformer
  - language
  - optimization
  - representation-learning
sources:
  - "[[state-prediction-separation]]"
aliases:
  - "Prediction-state separation"
  - "SPS"
---

# State-Prediction Separation

## Overview

State-prediction separation is the architectural idea that an autoregressive model should not force one activation stream to both emit the immediate next-token prediction and persist information for future tokens. The [[state-prediction-separation-concept|SPS Transformer]] implements this distinction with interleaved input and <predict> slots: input activations persist in the KV cache, while prediction activations are ephemeral except for a small recent window.

## The Two Roles

At position $i$, a standard Transformer produces one hidden state that receives gradients from the current loss and every later loss that attends to it. SPS separates these pressures:

- **State stream**: input-token activations carry information intended for later positions and remain persistent.
- **Prediction stream**: <predict> activations receive the next-token loss and are discarded from long-term memory after a bounded window.

The distinction is about gradient routing and cache semantics, not only about adding a second computation step. The Delayed State control adds a step but commits the persistent state at the prediction slot, and it underperforms SPS.

## Evidence and Tradeoffs

[[state-prediction-separation]] reports improvements in validation NLL, held-out corpus NLL, and zero-shot accuracy from 53M to 1.678B parameters. It also matches Standard's inference memory and stays within 6% to 10% of Standard's throughput. The cost is roughly doubled training sequence length and a more complex attention mask.

The paper's gradient probes find more future-loss signal on the SPS input stream and less on its prediction stream. Truncating persistent state is also more damaging to SPS than to Delayed State, suggesting that the separated state stream stores information that the model actually uses.

## Relation to Other State Interfaces

- [[full-bandwidth-transformer]] feeds processed top-layer state into the next token's input and remains active during inference; SPS separates roles through persistent versus ephemeral KV entries.
- [[next-latent-prediction]] and [[hierarchical-latent-prediction]] add auxiliary latent dynamics objectives that shape belief-state representations without inserting a prediction stream.
- [[recirculation]] retrofits deep-to-shallow recurrent feedback into frozen Transformers, while SPS changes the training architecture and cache visibility.
- [[dynamic-compression]] revises a fixed-size recurrent state by selective re-scanning; SPS keeps a full persistent input stream but limits prediction-stream persistence.
- [[topological-trouble-with-transformers]] motivates explicit state interfaces by arguing that fixed feedforward depth cannot indefinitely carry dynamic state.

## Open Questions

- Can the prediction stream be narrower or shallower without losing the separation benefit?
- Would separate stream parameters improve quality enough to justify additional model capacity?
- Does SPS scale beyond 1.7B parameters and beyond FineWeb-Edu?
- Can state-prediction separation combine cleanly with next-latent objectives, multi-token prediction, or recurrent feedback?
- What diagnostic predicts when present-loss and future-loss gradients will conflict strongly enough to require architectural separation?
