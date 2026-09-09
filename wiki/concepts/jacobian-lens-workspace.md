---
title: "Jacobian lenses and global workspace"
type: concept
created: 2026-09-04
updated: 2026-09-04
tags:
  - language
  - transformer
  - representation-learning
  - representation-geometry
  - theory
sources:
  - "[[looped-transformers-jacobian-lens]]"
aliases:
  - "Jacobian lens"
  - "Workspace transport"
  - "Global workspace in recurrent Transformers"
---

# Jacobian lenses and global workspace

## Overview

A Jacobian lens estimates how a hidden state at one layer influences a later hidden state, then maps the transported state back into an interpretable readout. In recurrent Transformers, the layer index must include every firing of a tied block. The resulting virtual depth makes it possible to ask whether a representation survives recurrence, whether a later layer can read it, and whether an intervention changes the model's behavior.

## Three tests for a workspace

The workspace analysis in [[looped-transformers-jacobian-lens]] separates three properties that are easy to conflate:

- **Readability**: a lens reconstructs content that a probe or language readout can decode.
- **Transport**: the representation retains influence across recurrent steps, measured through Jacobian norms, cosine similarity, and factorisation.
- **Causal access**: swapping or ablating the representation changes the expected report or computation.

A model can pass one test and fail another. Huginn reports almost perfect verbal recovery of self-computed content but fails the paper's causal introspection and external-injection verbalisation tests. The paper therefore treats a readable activation as evidence about content, not proof that the model uses that content as a persistent workspace.

## Recurrence changes the state interface

The recurrent models in the source page expose two different interfaces. Deeply supervised Ouro reconstructs its workspace at each loop checkpoint. The reconstruction is readable, but transport across a loop boundary is weak and interventions must cover the remaining loops. Huginn carries content farther, yet its mid-recurrence transport decays within a few recurrences and its effective reads and writes operate within a short sliding window.

This makes the choice of lens target part of the experiment. A final-state lens can miss a short-lived workspace, while a lens that spans too far can produce an invalid readout after transport has decayed. Comparisons therefore need matched source-target distances and checks that the lens remains accurate at the target.

## Relation to representation geometry

Jacobian lenses measure functional sensitivity rather than global covariance or pairwise similarity. They complement [[global-geometry-is-not-enough|Global Geometry Is Not Enough]], where local Jacobian Effective Rank predicts compositional binding better than global isotropy, and [[representation-geometry]], which collects local, manifold, trajectory, and parameter-update diagnostics.

The recurrent workspace results add a causal warning to those geometric measures. A representation can occupy a stable-looking region and remain decodable while its influence vanishes across the computation that should use it.

## Open Questions

- When does deep supervision cause useful checkpoint reconstruction, and when does it prevent information from persisting across loop boundaries?
- Can a transport-aware lens identify the state that a recurrent model actually uses, rather than the state that a linear readout can recover?
- How do persistent-state interfaces such as [[state-prediction-separation-concept|SPS]] change Jacobian transport and causal access?
- Can larger matched recurrent models preserve workspace content without relying on a short recurrence window?
