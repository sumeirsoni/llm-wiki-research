---
title: "Neural Theorizer"
type: entity
created: 2026-09-17
updated: 2026-09-17
tags:
  - world-model
  - representation-learning
  - reasoning
  - theory
sources:
  - "[[learning-to-theorize-world-observation]]"
aliases:
  - "NEO"
  - "Neural Theorizer"
---

# Neural Theorizer

## Identity

NEO is a probabilistic neural model from [[learning-to-theorize-world-observation|Learning to Theorize the World from Observation]]. It infers a discrete executable program from a source and target observation pair. The program is a sequence of learned primitive operations that run through a shared latent-state executor.

## Design

NEO has four linked components:

- An encoder maps the source observation to an initial latent state.
- A goal-conditioned theory programmer selects the next primitive from the current state and the encoded target.
- A shared executor applies the selected primitive to produce the next latent state.
- A decoder reconstructs the target from the execution trace.

The practical model uses deterministic execution and a VQ-VAE codebook. The codebook symbols do not have predefined meanings. The executor learns their operational semantics from observation pairs.

NEO uses two structural controls. Minimum Description Length selects the shortest accurate explanation, and state grounding keeps intermediate states near the encoder-decoder state manifold. NEO-S samples several candidate programs at test time and selects one by majority vote.

## Reported behavior

NEO transfers programs from a support pair to a query input on GridWorld, Arithmetic Factorization Reasoning, and CIFAR-10 Image Editing tasks. It maintains transferability on held-out compositions and longer programs, while monolithic baselines often reconstruct the support target but fail on the query.

In the main GridWorld setting with $\alpha=0.33$, NEO reaches 0.933 compositional-OOD transferability and 0.845 length-OOD transferability. NEO-S reaches 0.976 and 0.907 with a budget of 64 candidates. Removing state grounding reduces primitiveness to 0.002 and makes the reported transfer scores zero.

## Limits

The paper tests NEO only on controlled synthetic tasks with small discrete primitive sets and short program lengths. Primitive symbols are learned from reconstruction and need not correspond to human-interpretable or causal factors. The reported implementation uses deterministic execution and a reconstruction threshold for stopping.
