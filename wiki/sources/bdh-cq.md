---
title: "BDH-CQ: In-Context Learning with Recurrent Latent Reasoning"
type: source
created: 2026-08-13
updated: 2026-08-13
arxiv_id: "2608.09888"
authors:
  - "Björn Engdahl"
  - "Adrian Kosowski"
  - "Jan Chorowski"
  - "Zuzanna Stamirowska"
  - "Przemysław Uznański"
  - "Junlin Jiang"
  - "Rohan Phadke"
  - "Remigiusz Kinas"
  - "Richard Zhong"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.09888"
tags:
  - transformer
  - language
  - representation-learning
  - theory
  - benchmark
aliases:
  - "BDH-CQ"
---

# BDH-CQ: In-Context Learning with Recurrent Latent Reasoning

## Summary

BDH-CQ is a 150M-parameter recurrent model for ARC-style in-context learning. It processes demonstrations sequentially into persistent recurrent memory, initializes a query-specific structured latent workspace, and repeatedly updates that workspace before decoding an answer, without verbalizing intermediate reasoning or changing model parameters at inference. On the 400 public ARC-AGI-1 evaluation tasks, the paper reports 29.5% pass@2 at 0.85 H200 GPU-seconds and a computed cost of $0.00070 per task. The result establishes a strong reported cost-accuracy point, but reproducibility is constrained because exact architecture dimensions, update rules, training details, weights, and code are not public.

## Key Contributions

- **Demonstration-conditioned recurrent memory**: processes in-context examples sequentially rather than compressing them into a single fixed task embedding.
- **Recurrent latent reasoning**: separates persistent context memory from a query workspace that receives repeated continuous-state computation before answer decoding.
- **Non-verbal inference-time computation**: varies "latent thinking effort" without producing a chain of thought or performing per-task optimization.
- **Cost-focused ARC evaluation**: reports 29.5% pass@2 on public ARC-AGI-1 for a 150M-parameter model at $0.00070 computed hardware cost per task.
- **Controlled capability probes**: evaluates extrapolation, compositionality, demonstration coverage, semantic versus opaque identifiers, and reduced reasoning effort.

## Methodology

The paper summarizes the computation as a recurrent context update followed by query-conditioned latent refinement:

$$S_t = U_\theta(S_{t-1}, D_t), \qquad H_0 = E_\theta(x^\star, S_K),$$

$$H_{r+1} = F_\theta(H_r, S_K), \qquad \hat y = G_\theta(H_R).$$

Here, $S_K$ is persistent memory formed from the demonstrations and $H_r$ is the query-solving workspace. Parameters remain fixed during inference. The architecture derives from BDH/Dragon Hatchling and is described through high-dimensional nonnegative activations, low-rank communication, persistent associative state, and linear-attention-style updates. Training uses preceding demonstration pairs to predict exact output grids, drawing on ARC-AGI-1 training data, RE-ARC, ConceptARC, ARC-Heavy, ARC-GEN100K, privately curated ARC-style examples, and additional augmentations. The complete recipe and important implementation dimensions remain proprietary.

## Key Results

- **ARC-AGI-1 public evaluation**: 97/400 tasks at pass@1 (24.25%) and 118/400 at pass@2 (29.50%); the pass@2 Wilson interval is 25.24%-34.15%.
- **Pair-level ARC accuracy**: 108/419 test pairs at pass@1 (25.78%) and 130/419 at pass@2 (31.03%).
- **Runtime and computed cost**: approximately 0.85 H200 GPU-seconds and $0.00070 per task, assuming $3 per H200-hour. Comparisons with API-priced systems are not strictly like-for-like.
- **ConceptARC**: pass@2 is 59.38% with semantic identifiers and 60.00% with opaque identifiers; pair-level pass@2 is 77.92% in both conditions.
- **Controlled generalization**: perfect reported results on tested boundary-propagation, motif-copying, and fresh color-binding ladders, but sharp degradation at longer ordering chains and deeper or more difficult compositions.
- **Demonstration support**: adding a demonstration at the target complexity raises ordering-length-8 pass@2 from 0/24 to 13/24 and nesting-depth-5 from 19/24 to 24/24.
- **Reasoning effort**: high, medium, and low effort obtain 29.5%, 27%, and 21% pass@2, respectively, with reported cost reductions of 0%, 11%, and 22%.
- **Composition is operation-dependent**: relocation plus rotation remains 72/72, while relocation plus reflection falls to 47/72 and relocation plus color swap to 0/72.

## Connections

- Extends [[iterative-refinement|iterative refinement]] into a compact in-context learner where demonstrations alter recurrent memory and a separate workspace receives variable latent computation.
- Provides an efficiency-oriented deterministic counterpart to [[generative-recursive-reasoning|GRAM]], which scales recursive reasoning through stochastic parallel trajectories rather than one demonstration-conditioned latent path.
- Supports the architectural motivation in [[topological-trouble-with-transformers|Topological Trouble With Transformers]] by carrying processed state recurrently instead of forcing every update through fixed feedforward depth.
- Complements [[pretraining-recurrent-networks-without-recurrence|Supervised Memory Training]]: both separate predictive memory from recurrent dynamics, but BDH-CQ trains and evaluates a recurrent system directly while withholding enough implementation detail to prevent an exact comparison.

## Limitations & Open Questions

- Exact architecture dimensions, state-update functions, the full training recipe, code, and weights are not released, limiting independent reproduction.
- ConceptARC is not a fresh benchmark, and opaque identifiers do not rule out training or checkpoint-selection exposure.
- Generated capability ladders can contain construction errors or mislabeled mechanics; the paper reports 82.9% agreement between requested and independently assigned labels on a subset.
- Controlled conditions are small, often 40 tasks from one puzzle family, and output grids do not distinguish a wrong inferred rule from incomplete execution.
- The headline cost is computed from hardware time, while comparison systems may report estimated hardware cost or API price.
- The paper evaluates public ARC-AGI-1 rather than ARC-AGI-2, and pass@2 does not always correspond to two independent samples.
- Separate reasoning-effort tables report costs that differ from the headline value without fully reconciling the configurations.

## Future Work

The authors propose:

- Scaling model size and training duration and testing whether capability boundaries move predictably.
- Evaluating on ARC-AGI-2, Sudoku, and other constraint-satisfaction tasks.
- Applying recurrent contextual memory to language and mathematical reasoning.
- Combining latent computation with verbalized intermediate steps when communication, verification, or tool use requires them.

The paper mentions early experiments from 1B to 600B parameters, but provides no quantitative evidence for those systems.

## Links

- [arXiv](https://arxiv.org/abs/2608.09888)
- [PDF](https://arxiv.org/pdf/2608.09888)
- [HTML](https://arxiv.org/html/2608.09888v1)
- [Pathway Research](https://pathway.com/research)
- [Bielik AI](https://bielik.ai/)
