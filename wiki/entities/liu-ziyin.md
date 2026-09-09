---
title: "Liu Ziyin"
type: entity
created: 2026-08-21
updated: 2026-08-21
tags:
  - researcher
  - theory
  - optimization
sources:
  - "[[remove-symmetries]]"
aliases:
  - "Ziyin"
---

# Liu Ziyin

## Overview

Researcher at the Research Laboratory of Electronics, MIT, and the Physics & Informatics Laboratories of NTT Research. Leading proponent of **parameter-space symmetry** as a unifying lens on deep learning: loss-landscape symmetries (permutation, rescaling, rotation) create low-capacity states that training falls into, explaining phenomena from dead neurons to posterior collapse and plasticity loss.

## Role in This Wiki

Author of [[remove-symmetries|Remove Symmetries (syre)]] (ICLR 2025, with Yizhou Xu and Isaac Chuang), which proves reflection symmetries impair model capacity via feature masking and dimension reduction, and removes them with a shifted weight-decay center.

## Research Theme

- Foundational framework: "Symmetry Induces Structure and Constraint of Learning" (ICML 2024) - reflection symmetries couple symmetric solutions to the small-norm solutions preferred by weight decay.
- Follow-up direction: entropic-force accounts of SGD dynamics that break continuous symmetries and preserve discrete ones ("Neural Thermodynamics", arXiv:2505.12387), connected to the Platonic Representation Hypothesis.
- Practical stance: symmetry is a controllable design variable - "the right degree of symmetry" matters for both optimization and generalization.

## Connection to This Wiki's Focus

The syre line is orthogonal to the [[lejepa|LeJEPA]]/[[visreg|VISReg]] embedding-distribution regularizers: it targets *parameter-space* collapse traps rather than constant-embedding collapse in [[jepa|JEPA]]-style objectives. Whether the two combine usefully is an open question tracked on [[representation-collapse]].
