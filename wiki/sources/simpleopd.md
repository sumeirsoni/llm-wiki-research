---
title: "SimpleOPD: Simple Tokenizer-Agnostic On-Policy Distillation for Long-Context Reasoning"
type: source
created: 2026-08-20
updated: 2026-08-20
arxiv_id: "2608.14277"
authors:
  - "Haonan He"
  - "Haodi Lei"
  - "Yun Luo"
  - "Haoran Zhang"
  - "Shunkai Zhang"
  - "Yizhuo Li"
  - "Shengji Tang"
  - "Zhilin Wang"
  - "Runzhe Zhan"
  - "Lei Bai"
  - "Ganqu Cui"
  - "Fangchen Yu"
  - "Yafu Li"
  - "Peng Ye"
  - "Ning Ding"
  - "Yu Cheng"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.14277"
code_url: "https://github.com/hhnqqq/SimpleOPD"
project_url: "https://hhnqqq.github.io/SimpleOPD-project-page"
tags:
  - self-distillation
  - language
  - optimization
aliases:
  - "SimpleOPD"
---

# SimpleOPD: Simple Tokenizer-Agnostic On-Policy Distillation for Long-Context Reasoning

## Summary

SimpleOPD transfers long-context reasoning between teacher and student models with different tokenizers by using the student's generated surface text as the shared interface. Teacher and student independently tokenize that text, and supervision is retained only where tokens begin at the same character offset and contribute exactly the same span. Termination-token masking and reference-policy KL address the severe repetition, truncation, and response-length growth observed under direct OPD.

## Key Contributions

- Defines exact surface-span alignment for cross-tokenizer on-policy distillation.
- Uses a linear two-pointer map and falls back to the student's own log probability at unmatched positions.
- Applies a PPO-style clipped objective for repeated updates on student rollouts.
- Masks reasoning and response termination tokens to prevent a much longer teacher from continually penalizing student stopping.
- Adds reference-policy KL to limit drift and stabilize long-context transfer.
- Demonstrates same-tokenizer and cross-family transfer across Qwen, Intern, GLM, and Gemma students.

## Methodology

The student generates a trajectory, which is decoded to exact text and retokenized by the teacher. Tokens align only when both their preceding decoded prefix and incremental text span match. Aligned positions receive teacher log-probability targets; unmatched positions have zero teacher-induced advantage under the old-policy formulation. The resulting fixed advantages are optimized with PPO clipping.

Main training uses 4,528 proof problems, 100 rollout iterations, four responses per prompt, four policy updates per rollout, 32K response limits for Qwen/Intern, and 6K for GLM/Gemma. Evaluation allows responses up to 160K tokens.

## Key Results

- Intern-S2-OPD improves from 21.70 to 44.50 on ProofBench, 76.03 to 80.10 on AnswerBench, and 88.33 to 95.00 on AIME25 under the main judge.
- Qwen3.5-35B-A3B gains 15.61, 6.99, 2.06, and 4.00 points across ProofBench, AnswerBench, AIME25, and AMOBench.
- GLM-4.7-Flash improves on both reported tasks; Gemma gains on ProofBench but falls 1.3 points on AnswerBench, consistent with weaker transfer under larger tokenizer discrepancy.
- Training with 32K rather than 6K trajectories yields the largest gains on proof generation.
- Termination masking and reference KL each reduce degeneration; reference KL nearly eliminates truncation in the reported training curve.

## Connections

- Adds tokenizer mismatch, context-window asymmetry, and stopping control to [[on-policy-distillation]].
- Relates termination masking to [[token-selective-distillation]], but selects positions for sequence-control stability rather than informativeness alone.
- Complements [[beta-opsd|β-OPSD]], which also anchors to a reference policy but derives a broader teacher-reference interpolation.
- Contrasts with [[on-policy-representation-distillation|OPRD]], which bypasses vocabulary alignment by supervising hidden states, while SimpleOPD reconciles compatible parts of output space.
- Broadens [[self-distillation]] from same-tokenizer teacher-student setups to cross-family long-context transfer.

## Limitations & Open Questions

- Partial token overlaps are discarded, and the objective is a local surrogate rather than a true cross-tokenizer sequence KL.
- Larger tokenizer discrepancies can reduce or reverse gains.
- The exact 4,528-example training set is not released.
- ProofBench depends on model judges, and reported absolute scores vary with the judge.
- No seed-level uncertainty or statistical significance is reported.
- The auxiliary reference KL is not fully specified mathematically in the paper.
- Main evidence centers on mathematical proof transfer from one principal teacher.

## Future Work

The paper states no explicit future-work agenda. Inferred directions include byte- or lattice-level handling of partial overlaps, adaptive reference-KL strength, multilingual and more distant tokenizer pairs, complete factorial stabilizer ablations, compute accounting, and automatic degeneration detection.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.14277)
- [arXiv](https://arxiv.org/abs/2608.14277)
- [PDF](https://arxiv.org/pdf/2608.14277)
- [HTML](https://arxiv.org/html/2608.14277v1)
- [Project](https://hhnqqq.github.io/SimpleOPD-project-page)
- [Code](https://github.com/hhnqqq/SimpleOPD)
- [Models](https://huggingface.co/collections/bingyang-lei/simpleopd)
