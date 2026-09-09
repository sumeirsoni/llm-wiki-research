---
title: "Why the Third Axis Is Freedom"
type: source
created: 2026-08-20
updated: 2026-08-20
arxiv_id: "2608.05423"
authors:
  - "Michael Timothy Bennett"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.05423"
code_url: "https://github.com/ViscousLemming/Technical-Appendices/tree/main/Papers/WTTAIF"
tags:
  - generative-modeling
  - optimization
  - theory
aliases:
  - "The Third Axis Is Freedom"
---

# Why the Third Axis Is Freedom

## Summary

This paper reinterprets the candidate count $K$ in [[explorative-modeling|Explorative Modeling]] as a mechanism rather than the underlying objective: "exploration is the means, freedom is the end." It defines freedom as the number or measure of compatible future completions retained by a policy, derives how best-of-$K$ transforms acceptable-set probability, and gives conditions under which broader, balanced support is favored.

## Key Contributions

- Separates candidate exploration $K$, generative expressivity, probability allocation, and policy-level freedom.
- Defines freedom as extension volume in an observer-relative embodied language.
- Derives the hard best-of-$K$ risk as an integral of the all-candidates-miss probability $(1-q)^K$.
- Proves that under uniform targets and balanced support, finite-$K$ hit probability increases with permitted support for $K\ge2$.
- Gives counterexamples showing that broader support can perform worse when probability mass is severely concentrated.
- Tests whether exploration increases operational freedom and whether a freedom-based selector improves under a synthetic distribution shift.

## Methodology

The formal analysis covers finite permission languages, IID best-of-$K$ candidates, nonuniform targets, future-compatibility distributions, and deterministic versus stochastic candidate sets. The experiments use synthetic output partitions with twelve prototypes. One sweep trains models at $K\in\{1,2,4,8,16,32\}$ and estimates active outputs from deployment samples. A second experiment selects among 48 candidate models using either child-distribution validation or a calibrated freedom instrument with unlabeled parent contexts.

## Key Results

- Under uniform targets, mean log freedom rises from 0 at $K=1$ to 8.3166 at $K=8$ and saturates near 8.3175 by $K=32$.
- Under context-dependent targets, freedom continues increasing through $K=32$ even though best-of-8 hit peaks at $K=8$, demonstrating that support and finite-budget access can diverge.
- Across 30 synthetic shifted worlds, the freedom selector raises balanced-parent best-of-8 hit from 0.3169 to 0.3892 and wins 29 of 30 comparisons.
- The primary selector comparison is not compute matched and gives the freedom selector access to 256 unlabeled parent contexts.
- A post hoc matched-setting restriction remains positive but shrinks the gain to 0.00646.

## Connections

- Reframes [[candidate-exploration]] by distinguishing the training budget $K$ from the behavioral repertoire selected by training.
- Extends [[explorative-modeling|Explorative Modeling]] with formal conditions under which best-of-$K$ favors broad valid support.
- Offers a cautious interpretation of Best-of-Many world models such as [[delta-world|DeltaWorld]], but their diversity results do not by themselves prove calibrated freedom.
- Complements [[learnable-novelty]]: freedom rewards retained compatible possibilities, while learnable novelty rewards observer-extractable, compressible structure.
- Relates to [[world-models]] where broad futures must still be valid and planner-sober rather than merely diverse.

## Limitations & Open Questions

- The $(1-q)^K$ law assumes conditionally IID candidates and deployment consistency.
- Hard-winner results do not automatically extend to smooth exploration kernels.
- Freedom depends on the chosen vocabulary, admissibility rule, radius, and sampling protocol.
- All completed experiments use finite synthetic partitions rather than real image, language, or video models.
- The selector has transductive access to unlabeled shifted contexts, reuses deployment samples across features and audit, and is not compute matched in the primary comparison.
- Increased $K$ may reduce gradient conflict rather than broaden support, and the experiments do not isolate those mechanisms.

## Future Work

The author calls for separate measurement of $K$, support, probability allocation, and freedom; fixed-$K$ and fixed-checkpoint replication; distinct selector and audit samples; real-system tests; mediation analysis; and evaluation of whether freedom predicts gains from larger $K$. The paper also identifies an in-progress ImageNet experiment. Inferred questions include stable freedom measures for full-support language models and comparisons against entropy or effective-support baselines.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.05423)
- [arXiv](https://arxiv.org/abs/2608.05423)
- [PDF](https://arxiv.org/pdf/2608.05423)
- [HTML](https://arxiv.org/html/2608.05423)
- [Technical appendices and experiments](https://github.com/ViscousLemming/Technical-Appendices/tree/main/Papers/WTTAIF)
