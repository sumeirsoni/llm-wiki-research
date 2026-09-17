---
title: "Compositional generalization in recurrent Transformers"
type: concept
created: 2026-09-04
updated: 2026-09-17
tags:
  - language
  - transformer
  - iterative-refinement
  - reasoning
  - theory
sources:
  - "[[loop-think-generalize]]"
  - "[[learning-to-theorize-world-observation]]"
aliases:
  - "Systematic generalization"
  - "Depth extrapolation"
  - "Implicit multi-hop reasoning"
---

# Compositional generalization in recurrent Transformers

## Overview

Compositional generalization asks whether a model can combine learned parts in configurations that were absent from training. In the recurrent-depth setting, two tests matter. Systematic generalization combines atomic facts that were never composed during training. Depth extrapolation applies a learned composition rule to longer chains than the training curriculum contained.

[[learning-to-theorize-world-observation|Learning to Theorize the World from Observation]] studies the same capability outside language-model recurrence. Its NEO model infers a latent program from one observation pair, then applies that program to a new input. OTIB separates support reconstruction from query transfer, so it can detect a model that memorizes a target without learning a reusable composition.

## The controlled task

[[loop-think-generalize]] studies both tests with synthetic directed knowledge graphs. A query supplies a head entity and a sequence of relations. The model must infer the final entity by repeatedly applying the corresponding relation rules. The systematic split holds out compositions built from atomic facts that never appeared together. The extrapolation split contains more hops than the model has seen.

The authors also impose a permutation constraint so each relation acts as a bijection over entities. Without that constraint, a model can infer the answer from a short suffix of the relation sequence. Activation patching exposed this shortcut in an earlier dataset, so apparent deep generalization should not be trusted without a causal anti-shortcut check.

## Why shared depth helps

An untied Transformer stores useful intermediate computations at particular layers. A later layer may not be able to reuse an intermediate entity if the computation that produced it happened too early. A recurrent-depth Transformer applies the same rule repeatedly, so later iterations can reuse the same parametric operation. In the controlled experiments, recurrence gives the model a path from a decoded bridge entity to the final composition.

This is an architectural claim, not a guarantee that every loop learns a clean algorithm. The model can first memorize answers, and it can still overthink after it reaches the correct answer. Weight sharing creates the opportunity for reuse; training dynamics determine whether the model takes it.

## Training dynamics

Systematic generalization emerges through three stages:

- **Memorization**: the model fits training examples without reliably decoding the intermediate bridge.
- **In-distribution generalization**: the bridge becomes decodable and the model solves unseen compositions of familiar facts.
- **Systematic generalization**: the model applies the recovered composition rule to held-out combinations of atomic facts.

For deeper chains, an easy-to-hard curriculum introduces a new hop only after the model reaches 95% accuracy at the previous level. More training-time recurrence increases the learnable recursion depth. Dynamic recurrence, which samples different iteration counts during training, improves the use of inference-time scaling when the training data is sufficiently deep.

## Inference-time scaling and overthinking

Inference-time recurrence can extend the depth of composition without adding new parameters. The benefit appears only after training exposes the model to enough recurrent iterations. More iterations eventually reduce the logit margin, so compute scaling has a peak rather than a monotonic payoff.

The paper's halting rule combines a small change in the output distribution with low output entropy. KL divergence alone can stop on a stable but uncertain distribution. The entropy check avoids treating uncertainty as convergence.

## Relation to the wiki

- [[looped-transformers]] covers the broader design space of weight-shared depth, including compute-matched MoE looping, latent CoT, fixed-point models, and recurrent workspace transport.
- [[iterative-refinement]] places compositional recurrence beside belief-state prediction, recurrent feedback, and fixed-point inference.
- [[topological-trouble-with-transformers]] explains why fixed feedforward depth can limit repeated state updates. This paper provides a controlled composition experiment where recurrence helps.
- [[jacobian-lens-workspace]] and the source paper separate decodability from causal use. Logit-lens recovery of an intermediate entity is stronger evidence when activation patching shows that restoring it recovers the final answer.
- [[fixed-point-reasoners|FPRM]] provides a different solution to adaptive latent compute. It halts on state convergence, while this paper halts on output stability plus confidence.
- [[learning-to-theorize-world-observation|Learning to Theorize the World from Observation]] tests compositional transfer with latent executable programs. It reports strong transfer on held-out compositions and longer programs, but only in controlled discrete domains.

## Open Questions

- Does the systematicity advantage transfer from synthetic permutation graphs to natural-language facts and pretrained models?
- Which training signal makes the bridge entity causally available at the right recurrent iteration rather than merely decodable?
- Can adaptive halting detect the first correct answer without allowing later iterations to overwrite it?
- How should recurrence, curriculum depth, and model size be matched when comparing looped and untied Transformers?
