---
title: "Does On-Policy Distillation Really Distill? From Noisy Teacher to Self-Improvement"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2608.31046"
authors:
  - "Yi Ding"
  - "Ruqi Zhang"
year: 2026
venue: "arXiv preprint (cs.LG)"
pdf_path: "https://arxiv.org/pdf/2608.31046v1"
code_url: "https://github.com/DripNowhy/On-Policy-Self-Adaptation"
tags:
  - self-distillation
  - language
  - reinforcement-learning
  - optimization
aliases:
  - "OPSA"
  - "On-Policy Self-Adaptation"
---

# Does On-Policy Distillation Really Distill? From Noisy Teacher to Self-Improvement

## Summary

This paper reexamines why [[on-policy-distillation|on-policy distillation]] improves a student when the teacher scores student-generated, off-policy trajectories. The authors find substantial teacher-signal noise that increases with teacher scale, yet students improve similarly when noisy trajectories are retained or removed. Improvement concentrates on low-log-probability student tokens, and a fixed negative advantage reproduces much of standard OPD without teacher knowledge. These findings motivate On-Policy Self-Adaptation (OPSA), which trains only the lowest-log-probability 20% of sampled tokens and scales a negative advantage by token entropy, suppressing unlikely tails while redistributing probability among competing head tokens.

## Key Contributions

- Measures token-level OPD supervision noise against verifiable answer correctness and shows it worsens as teacher scale increases.
- Shows that student improvement is insensitive to whether trajectories contain the measured noisy teacher signals.
- Identifies low-log-probability tokens as the main contributors to OPD learning; high-log-probability tokens mostly provide near-zero gradients.
- Demonstrates that fixed negative advantages improve the student, whereas fixed positive advantages cause response collapse.
- Introduces OPSA, a dense token-level, teacher-free, reward-free, and hint-free self-adaptation objective based only on student log probability and entropy.

## Methodology

The noise analysis uses Qwen3-1.7B as the student and Qwen3-4B, 30B-A3B, and 235B-A22B Instruct models as teachers. One correct and one incorrect response are sampled for each of 500 DAPO-17k questions. A signal is labeled noisy when the sign of the teacher's token advantage on the verifiable final answer disagrees with correctness.

The training analysis shows that 29.2% of tokens have exactly zero OPD advantage and 51.7% have magnitude below $10^{-4}$. Teacher-free controls train the lowest-log-probability 20% of sampled tokens with fixed negative or positive advantages. OPSA keeps this token selection, sets a negative base advantage, and adjusts its magnitude upward with normalized entropy:

$$A_i^{dyn}=-\frac{1}{2}-\frac{H_i-H_{min}}{2(H_{max}-H_{min})}.$$

Experiments train Qwen3 and Qwen3.5 models on unlabeled DAPO-17k questions and evaluate AIME24, AIME25, HMMT25, MBPP+, and GPQA-Diamond. Training uses eight H100 or H200 GPUs, with no answers or external rewards exposed to the optimizer.

## Key Results

- Measured answer-token noise rises from 30.6% with the 4B teacher to 34.7% with the 30B-A3B teacher and 50.6% with the 235B-A22B teacher.
- Standard OPD reaches comparable performance whether training uses all trajectories, only trajectories with noisy signals, or only trajectories without them.
- On Qwen3-1.7B, a fixed negative advantage on the lowest-log-probability tokens steadily improves performance, while a fixed positive advantage collapses response length and destabilizes gradients.
- Entropy-adaptive negative advantages reach 50.0% Avg@4 on AIME24 in the reported controlled comparison versus 35.13% for standard OPD.
- In the main comparison, OPSA improves Qwen3-1.7B Avg@32 from 13.44% to 48.85% on AIME24, from 9.69% to 35.31% on AIME25, and from 5.73% to 23.33% on HMMT25.
- Across the three math benchmarks, OPSA beats the best compared on-policy baseline by 11.04 points in average Avg@32 and 8.89 points in average Pass@32, while also improving MBPP+ and GPQA-Diamond.
- Masking fork positions removes most of the response-length and accuracy improvement. The 20%, 30%, and 40% token-selection settings all work better than training only the bottom 10%, so the method is not tied to an exact percentile.

## Connections

- Challenges the teacher-imitation interpretation of [[on-policy-distillation]] and adds a self-adaptation mechanism to [[self-distillation]].
- Complements [[entropy-aware-opd|Entropy-Aware OPD]]: both treat entropy as a signal for allocating update strength, but OPSA removes the teacher and changes the direction to entropy-adaptive negative suppression.
- Relates to [[token-selective-distillation]] and [[tip-token-importance-opd|TIP]] through selective token updates, while selecting by student log probability rather than teacher disagreement or importance.
- Contrasts with [[beta-opsd|β-OPSD]] and [[latent-on-policy-self-distillation|LOPD]], which preserve a teacher or privileged context, and with [[simpleopd|SimpleOPD]], which solves tokenizer and long-context compatibility.
- Links to the negative-reinforcement and exploration questions in [[iterative-refinement|iterative reasoning]]: OPSA suppresses unlikely branches but redistributes mass at high-entropy forks to preserve diversity.

## Limitations & Open Questions

> [!open-question]
> Experiments cover models up to 9B parameters. Scaling to larger dense models and mixture-of-experts models is unresolved.

> [!open-question]
> OPSA mainly redistributes probability mass already present in the student policy. Its benefits may be limited for heavily post-trained policies with very sharp, low-entropy output distributions.

> [!open-question]
> The method may improve reflective reasoning without substantially expanding the exploration frontier. The paper reports more modest gains in thinking-mode Pass@k and proposes combining OPSA with other exploration-oriented RL methods.

> [!open-question]
> The analysis reframes OPD as self-adaptation, but a complete theory of why the K1 estimator produces these gains remains open. The benchmark evidence is concentrated on Qwen families and unlabeled math-question training.

## Future Work

The authors call for scaling studies on larger and MoE models, combinations with reinforcement-learning methods that expand exploration, and theoretical analysis of the true source of OPD's gains under the K1 estimator.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.31046)
- [arXiv](https://arxiv.org/abs/2608.31046)
- [HTML](https://arxiv.org/html/2608.31046v1)
- [PDF](https://arxiv.org/pdf/2608.31046v1)
- [Code](https://github.com/DripNowhy/On-Policy-Self-Adaptation)

