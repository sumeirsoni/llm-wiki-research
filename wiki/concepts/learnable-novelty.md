---
title: "Learnable Novelty"
type: concept
created: 2026-07-24
updated: 2026-07-24
tags:
  - self-supervised-learning
  - representation-learning
  - reinforcement-learning
  - optimization
  - theory
sources:
  - "[[intelligence-from-learnable-novelty]]"
aliases:
  - "Epiplexity objective"
  - "Learnable surprise"
---

# Learnable Novelty

## Overview

Learnable novelty is the part of an observation stream's cumulative surprise that a computationally bounded observer can convert into reusable structure. [[intelligence-from-learnable-novelty|Intelligence from Learnable Novelty]] identifies this quantity with observer-relative epiplexity and proposes maximizing it as a common objective for complexity generation, unsupervised abstraction, and exploration.

The key distinction is:

$$
\text{total surprise} \approx \text{learnable structure} + \text{unlearnable residual}.
$$

Maximizing total surprise can favor irreducible noise, producing the noisy-television failure. Minimizing total surprise can favor trivial predictability, producing the dark-room failure. Learnable novelty targets the structured middle: observations surprising enough to teach the observer something, but regular enough to be compressed under its compute bound.

## Closed-Form Estimator

The paper instantiates the bounded observer as a frozen random reservoir plus a ridge-regression readout. After fitting the readout in closed form, it scores the singular values of the readout with a log-determinant description length. Independent recoverable directions add to the score, while redundant directions contribute little.

This makes the score:

- **Observer-relative:** changing reservoir capacity, locality, or regularization changes what counts as learnable.
- **Deterministic for a fixed reservoir and sample:** there is no inner neural-network training loop.
- **Differentiable:** gradients can reshape an encoder or dynamical system that produces the scored data.
- **Online-capable:** recursive least squares supports per-step increments as an intrinsic reward.

## Relationship to Existing Objectives

### Novelty Search and Curiosity

Novelty search rewards behavioral difference, while prediction-error curiosity rewards states a predictor has not learned. Both can be attracted to stochastic observations. Learnable novelty instead rewards structure a bounded observer can compress, so pure noise contributes to residual surprise but not to the objective.

### Minimum Description Length and Epiplexity

Minimum description length splits the cost of transmitting data into a model description and unexplained residual. Epiplexity is the model-description component available to a bounded observer. The learnable-novelty framing treats that same component dynamically, as something a generator, representation, or policy can maximize.

### Free-Energy Minimization

Surprise minimization can remove both noise and useful structure, making a trivial stream optimal. Learnable novelty does not reward a dark room because a constant stream requires almost no learned program.

### Empowerment

Empowerment rewards an agent for maintaining diverse controllable futures. Learnable novelty adds an observer constraint: reachable futures should not only be diverse, but contain structure the bounded learner can extract.

## Evidence

In [[intelligence-from-learnable-novelty]] the same estimator:

- ranks Turing-complete cellular automaton rule 110 highest among 88 locally unique elementary rules;
- drives neural cellular automata toward traveling, colliding structures;
- organizes a label-free [[mnist|MNIST]] code so linear and 5-nearest-neighbor probes both reach 0.89 accuracy;
- improves PPO task return in nine of ten control environments when used as an intrinsic bonus.

These results are evidence for usefulness across several substrates, not proof that learnable novelty is a complete definition of intelligence.

## Design Implications

- The observer is part of the objective, not a neutral measuring instrument.
- A reservoir that is too weak misses meaningful structure, while one that is too expressive can make noise or arbitrary codes look learnable.
- Tight readout regularization can encourage compressed, low-redundancy representations, as in the [[mnist|MNIST]] experiment.
- As an RL objective, learnable novelty is best paired with a task signal unless the desired behavior is genuinely open-ended exploration.
- A fixed observer eventually saturates, motivating co-evolution of observer and observed system.

## Open Questions

> [!open-question]
> Can co-training the observer preserve a meaningful complexity bound without allowing the observer and generator to collude on arbitrary codes?

> [!open-question]
> Does the unsupervised class separation observed on [[mnist|MNIST]] scale to natural images, video, language, and multimodal data?

> [!open-question]
> How should observer capacity be calibrated across tasks so the score rewards structured novelty rather than trivial dynamics or environmental noise?

> [!open-question]
> Can learnable novelty serve as a primary objective in continuing environments without encouraging reward hacking through observer-specific artifacts?
