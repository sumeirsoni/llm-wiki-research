---
title: "Learn from your own latents and not from tokens: A sample-complexity theory"
type: source
created: 2026-05-20
updated: 2026-05-20
arxiv_id: "2605.27734"
authors:
  - "Daniel J. Korchinski"
  - "Alessandro Favero"
  - "Matthieu Wyart"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.27734"
tags:
  - self-supervised-learning
  - jepa
  - representation-learning
  - theory
aliases:
  - "Learn from your own latents"
  - "ILC"
  - "SLC"
---

# Learn from your own latents and not from tokens: A sample-complexity theory

## Summary

This paper provides a sample-complexity theory showing that predicting one's own latents can be exponentially more data-efficient than token-level self-supervision on hierarchical data. Using the Random Hierarchy Model (RHM), the authors prove that iterative latent clustering requires P ∝ vm³ samples regardless of hierarchy depth L, while supervised and token-level SSL scale as vm^L or vm^{L+1}.

## Key Contributions

- **Sample-complexity separation**: latent prediction removes the per-level signal attenuation that makes token objectives depth-exponential.
- **Iterative Latent Clustering (ILC)**: level-by-level cousin-context clustering algorithm with provable vm³ scaling.
- **Stacked Latent-Clustering (SLC)**: end-to-end neural architecture mirroring ILC; maintains vm³ scaling even with local stop-gradients.
- **data2vec analysis**: shows data2vec on RHM also scales as vm³ via implicit hierarchical latent prediction through EMA teacher phases.
- **Challenge to explicit stacking**: single-module latent prediction may already discover multi-scale structure, weakening the need for explicit H-JEPA-style hierarchies.

## Methodology

The Random Hierarchy Model generates visible tokens from a depth-L tree with branching factor s, vocabulary v, and m synonymous production rules per parent. Learning corresponds to recovering synonym classes at each level.

- **Token-level SSL**: predicting masked surface tokens attenuates signal by m per latent level → P ∝ vm^{L+1}.
- **Latent prediction (ILC)**: cousin-context vectors cluster synonyms at each level with constant signal → P ∝ vm³.
- **SLC network**: stacked predictor (CNN over s-tuples) + clusterer (soft codebook) modules trained with EMA teacher-student and UPGrad multi-objective optimization.
- **data2vec**: teacher targets encode learned latents; EMA updates create phased hierarchical learning analogous to ILC.

## Key Results

- ILC simulations: all non-root levels collapse onto one curve when samples are rescaled by vm³.
- SLC network: root classification sample complexity also scales as vm³, including with layer-wise stop-gradients.
- data2vec pretraining on RHM: root probe complexity vm³, incompatible with vm^{L+1} token scaling.
- Synonym clustering scores in data2vec encoder layers also collapse under vm³ rescaling.
- Suggests biological learners may benefit from local latent-prediction rules similar to predictive coding.

## Connections

- Provides theoretical backing for the [[jepa|JEPA]] paradigm and [[lejepa|LeJEPA]]'s focus on latent-space prediction over token reconstruction.
- Explains why [[learn-from-your-own-latents|latent objectives]] may outperform token-level training in data-limited regimes; relevant to [[visreg|VISReg]] and other collapse-prevention regularizers that shape latent geometry.
- Questions explicit multi-scale stacking used in [[bootleg|Bootleg]] and [[v-jepa-2-1|V-JEPA 2.1]] if single-module EMA teachers already induce phased hierarchical learning (as in data2vec).
- Contrasts with [[convergent-world-representations-and-divergent-tasks|Convergent World Representations]]: token-level multi-task learning can fracture geometry even when latent prediction is theoretically more efficient.

## Limitations & Open Questions

> [!open-question]
> Does vm³ scaling persist on natural language and vision data, or is it specific to the RHM's simplified grammar?

> [!open-question]
> How do explicit JEPA hierarchies (I-JEPA, V-JEPA, H-JEPA) compare to implicit phased learning in data2vec under matched compute?

## Links

- [AlphaXiv](https://www.alphaxiv.org/overview/2605.27734)
- [arXiv](https://arxiv.org/abs/2605.27734)
