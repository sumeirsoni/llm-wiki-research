---
title: "Causal-JEPA: Learning World Models through Object-Level Latent Interventions"
type: source
created: 2026-04-10
updated: 2026-04-10
arxiv_id: "2602.11389"
authors:
  - "Heejeong Nam"
  - "Quentin Le Lidec"
  - "Lucas Maes"
  - "Yann LeCun"
  - "Randall Balestriero"
year: 2025
tags:
  - jepa
  - world-model
  - self-supervised-learning
  - representation-learning
  - vision
pdf_path: "seed-papers/Causal-JEPA_ Learning World Models through Object-Level Latent Interventions.pdf"
aliases:
  - "C-JEPA"
  - "Causal-JEPA"
---

# Causal-JEPA: Learning World Models through Object-Level Latent Interventions

## Summary

C-JEPA is an object-centric [[world-models|world model]] that extends [[jepa|JEPA]]'s masked joint embedding prediction from image patches to object-centric representations. By applying object-level masking — where an object's state must be inferred from other objects — the model induces latent interventions with counterfactual-like effects, making interaction reasoning essential and preventing shortcut solutions.

## Key Contributions

- Extends JEPA's masked prediction from patches to **object-level representations**, requiring the model to infer object states from other objects' states
- Introduces **latent interventions** via object-level masking that have counterfactual-like effects, forcing the model to learn causal/relational structure
- Achieves ~20% absolute improvement in counterfactual reasoning on visual question answering compared to the same architecture without object-level masking
- Uses only **1% of the latent input features** required by patch-based world models for agent control tasks, while achieving comparable performance
- Provides formal analysis showing object-level masking induces a **causal inductive bias** via latent interventions

## Methodology

The core idea is to move from patch-level masking (as in standard [[jepa|JEPA]]) to object-level masking. Rather than predicting random masked patches, the model masks entire objects and must predict their latent representations from the remaining visible objects. This creates an information bottleneck that forces the model to learn how objects interact — their relational dynamics — rather than relying on local texture cues.

The approach builds on the JEPA framework but replaces the typical grid-based masking with object-centric masking using pre-extracted object representations. The prediction target is the latent embedding of the masked object, predicted from the embeddings of the visible objects.

## Key Results

- **Visual QA**: ~20% absolute improvement in counterfactual reasoning
- **Agent control**: Comparable planning performance using 1% of the latent features required by patch-based world models (48x faster planning)
- **Causal structure**: Formal proof that object-level masking induces causal inductive bias

## Connections

- Extends [[jepa|JEPA]] to object-centric settings
- Related to [[world-models|World Models]] — learns dynamics in latent space
- Authors overlap with [[lejepa|LeJEPA]] and [[leworldmodel|LeWorldModel]] ([[yann-lecun|Yann LeCun]], [[randall-balestriero|Randall Balestriero]])
- Complementary to [[v-jepa-2-1|V-JEPA 2.1]] which focuses on dense patch-level features

## Limitations & Open Questions

> [!open-question]
> How does object-level masking interact with learned (vs. pre-extracted) object representations? The current approach relies on pre-extracted object representations.

> [!open-question]
> How does the approach scale to more complex scenes with many interacting objects?

## Links

- [arXiv](https://arxiv.org/abs/2602.11389)
- [GitHub](https://github.com/galilai-group/cjepa)
