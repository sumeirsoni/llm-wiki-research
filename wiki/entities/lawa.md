---
title: "LAWA"
type: entity
created: 2026-09-09
updated: 2026-09-09
tags:
  - world-model
  - reinforcement-learning
  - video
  - representation-learning
sources:
  - "[[latent-action-as-intention]]"
aliases:
  - "Latent Action as Intention"
  - "Latent-action future imagination"
---

# LAWA

## Identity

LAWA is a World Action Model that uses a temporally ordered latent-action sequence as a future intention. It jointly denoises continuous latent actions and executable action chunks while omitting future-video generation at inference.

## Reported results

LAWA reaches 65.6% few-shot and 80.8% full-data success on RoboCasa. It reaches 74.4% zero-shot success on LIBERO-Plus and uses 42.9% less inference latency than the matched Joint-WAM reference in the reported hardware test.
