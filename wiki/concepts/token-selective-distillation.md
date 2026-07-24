---
title: "Token-Selective Distillation"
type: concept
created: 2026-07-08
updated: 2026-07-08
tags:
  - self-distillation
  - language
  - optimization
sources:
  - "[[on-the-position-bias-of-on-policy-distillation]]"
  - "[[tip-token-importance-opd]]"
  - "[[fire-opd]]"
  - "[[entropy-aware-opd]]"
  - "[[selectkd]]"
aliases:
  - "Token weighting"
  - "Token-selective KD"
  - "Position-aware distillation"
---

# Token-Selective Distillation

## Overview

Token-selective distillation replaces uniform token averaging with position-, confidence-, or discrepancy-aware weighting. The basic premise is that not every token on a generated trajectory deserves the same gradient budget: teacher supervision can be unreliable, student uncertainty varies by position, and some tokens carry more corrective information than others.

## Weighting Signals

### Prefix Compatibility

[[on-the-position-bias-of-on-policy-distillation|Position Bias OPD]] shows that OPD supervision decays along student rollouts because prefixes drift from teacher-preferred reasoning paths. IW-OPD weights tokens by cumulative teacher-student prefix discrepancy, naturally favoring teacher-compatible prefixes.

### Teacher Entropy

[[entropy-aware-opd|EOPD]] uses teacher entropy to decide when reverse KL is insufficient. High-entropy teacher positions receive mode-covering forward-KL supervision to preserve multiple plausible continuations.

### Student Entropy and Disagreement

[[tip-token-importance-opd|TIP]] crosses student entropy with teacher-student divergence. High-entropy tokens are useful, but low-entropy/high-divergence tokens are overconfident errors that entropy-only selection misses.

### Teacher Confidence and Student Confusion

[[fire-opd|FiRe-OPD]] combines trajectory-level teacher-likelihood filtering with soft token weights from teacher confidence and student confusion. This suggests soft weights are often preferable to hard token deletion.

### Verifier Acceptance

[[selectkd|SelecTKD]] applies a propose-and-verify token gate around arbitrary KD divergences. Accepted tokens receive full loss; rejected tokens are masked or downweighted.

## OPRD-Specific Extension

For [[on-policy-representation-distillation|OPRD]], token selectivity can use output-space signals or hidden-space signals:

- output signals: teacher entropy, student entropy, KL divergence, verifier acceptance;
- prefix signals: cumulative teacher-student drift as in IW-OPD;
- hidden signals: per-token hidden-state MSE, cosine gap, CKA/Gram mismatch, transition-direction error;
- hybrid signals: Soft-OR or multiplicative weights combining hidden discrepancy with teacher confidence.

The key empirical question is whether OPRD's fixed last-2000-token strategy is optimal, or whether hidden-state supervision also has prefix/suffix asymmetry.

> [!open-question]
> If output KL and hidden-state discrepancy disagree, which signal better predicts downstream OPRD gain?

> [!open-question]
> Should OPRD delete low-value tokens to save memory, or keep all tokens with soft weights to preserve representation-level regularization?

## Related Pages

- [[on-policy-distillation]]
- [[on-policy-representation-distillation]]
- [[self-distillation]]
