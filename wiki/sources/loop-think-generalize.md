---
title: "Loop, Think, & Generalize: Implicit Reasoning in Recurrent-Depth Transformers"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2604.07822"
authors:
  - "Harsh Kohli"
  - "Srinivasan Parthasarathy"
  - "Huan Sun"
  - "Yuekun Yao"
year: 2026
venue: "COLM 2026"
pdf_path: "https://arxiv.org/pdf/2604.07822v2"
code_url: "https://github.com/OSU-NLP-Group/Loop-Think-Generalize"
tags:
  - language
  - transformer
  - iterative-refinement
  - reasoning
  - theory
aliases:
  - "Loop, Think, & Generalize"
  - "Implicit Reasoning in Recurrent-Depth Transformers"
---

# Loop, Think, & Generalize: Implicit Reasoning in Recurrent-Depth Transformers

## Summary

Kohli et al. study whether recurrent-depth Transformers can combine parametric facts and rules without emitting an explicit chain of thought. They train small models from scratch on synthetic multi-hop knowledge graphs, then test two forms of compositional generalization: systematic generalization to combinations of atomic facts never composed during training, and depth extrapolation beyond the hop counts seen during training. Vanilla Transformers fail on the systematic split, while shared recurrent depth learns a reusable composition rule. The learned rule appears through a three-stage grokking process and can be applied at greater inference-time recurrence. The benefit has limits: excessive recurrence causes overthinking, initialization is important, and apparent very-deep composition can come from suffix shortcuts unless the dataset prevents them.

## Key Contributions

- Defines controlled implicit-reasoning tasks that separate in-distribution generalization, systematic generalization, and depth extrapolation.
- Shows that a recurrent-depth Transformer can combine unseen pairs of atomic facts, while a matched vanilla Transformer fails the systematic split.
- Identifies a three-stage training process that moves from memorization to in-distribution generalization and then to systematic generalization.
- Shows that increasing training-time and inference-time recurrence extends the depth of compositional reasoning without adding distinct parameters for every virtual layer.
- Introduces a dynamic recurrence strategy and an adaptive halting rule that uses both output-distribution change and predictive entropy.
- Uses logit-lens analysis and activation patching to distinguish memorized answers, decodable intermediate entities, causal composition, and shortcut-based predictions.

## Methodology

The task represents a directed knowledge graph as atomic facts $(h,r,t)$ and asks a decoder-only model to predict the final entity from a head entity and a sequence of relations. Systematic generalization holds out compositions built from atomic facts that never appear together in training. Depth extrapolation trains on an easy-to-hard curriculum and evaluates on longer relation chains.

For the systematicity study, the graph contains 2,000 entities, 200 relations, 40,000 atomic facts, and 273,600 inferred facts. The 4-layer recurrent-depth model uses fixed recurrence $R\in\{1,2,4,8\}$, where $R=1$ is a vanilla 4-layer Transformer. For extrapolation, the graph contains 200 entities and 10 relations, each relation acts as a permutation over entities, and the curriculum reaches up to 40 hops. The model uses a 4-layer recurrent block with fixed or dynamically sampled recurrence. The depth-extrapolation experiments remove positional embeddings because pilot results favored NoPE for this task.

The recurrent block reuses one set of Transformer layers at each iteration. The authors zero-initialize the output projections of attention and feed-forward sublayers so that each block starts as an identity map. Dynamic recurrence samples the iteration count from a clipped Poisson distribution with minimum 2 and maximum 8 in the main setup. The adaptive halting rule stops when both the KL divergence between successive output distributions is below a threshold and the current output entropy is low.

Logit-lens probes decode the intermediate bridge entity and final target after every effective layer. Activation patching corrupts the first-hop prefix, restores a clean hidden state at a candidate causal site, and measures recovery of the final answer. An appendix repeats the analysis with the default Gaussian initialization and with a pre-permutation dataset to expose shortcut solutions.

## Key Results

- On the systematicity task, the 4-layer vanilla model fails to achieve non-zero systematic generalization, while recurrent models generalize to unseen compositions. An $R=4$ recurrent model converges in about 2,000 epochs, compared with about 7,000 for $R=2$.
- Systematic generalization follows three stages. The model first memorizes training examples, then develops in-distribution generalization, and only later generalizes to compositions of held-out atomic facts. In the reported run, the final transition occurs around $10^4$ epochs rather than the roughly $10^2$ epochs needed to fit the training set.
- The logit lens shows why the stages differ. The model can predict a target before it reliably decodes the intermediate bridge, which indicates memorization. The bridge becomes decodable during in-distribution generalization, and only the final stage uses that bridge to solve the OOD composition.
- In the depth curriculum, a dynamically recurrent model reaches more than 90% accuracy on 20-, 21-, and 22-hop tasks after learning lower-hop rules. Once the rule is internalized, adding a new hop can require fewer than 8,000 extra training steps, and a checkpoint trained through 20 hops reaches more than 90% on a new 21-hop split after as few as 50 additional steps.
- Increasing inference-time recurrence enables depth extrapolation when the model was trained with enough recurrence. Under matched training data, a fixed $R=6$ model extrapolates to about 14 hops and $R=8$ to about 19 hops; dynamic recurrence reaches about 19 hops and is more robust to overthinking.
- Extra recurrence is not always helpful. Output confidence rises to a peak and then declines, with the dynamic model showing slower margin decay. In the main dynamic model, increasing inference iterations beyond about 15 stops improving OOD accuracy.
- KL-only halting can stop while the model remains uncertain because the output distribution changes little. Adding an entropy threshold produces a more reliable compute allocation that tracks hop complexity.
- Larger vanilla Transformers improve in-distribution generalization but still do not show systematic OOD generalization or the same flexible inference-time scaling at matched effective depth.
- Default Gaussian initialization produces mixed outcomes across runs. Some seeds show inference-time scaling, some show only stability, and others degrade through overthinking. The zero-initialized setup is therefore part of the reported recipe, not a cosmetic implementation detail.
- A pre-permutation dataset created an illusion of very deep composition. Activation patching showed that models relied on a short suffix of relations instead of retrieving the full chain. The permutation-based graph removes this shortcut by making each relation a bijection over entities.

## Connections

- [[compositional-generalization]] files the paper's distinction between unseen compositions and deeper compositions as a reusable concept.
- [[looped-transformers]] gains a controlled evidence point: weight sharing can improve systematic generalization, but the effect depends on recurrence during training and can fail through overthinking at inference.
- [[iterative-refinement]] adds implicit multi-hop reasoning, curriculum-based depth growth, dynamic recurrence, and entropy-aware halting to its recurrence patterns.
- [[topological-trouble-with-transformers]] supplies the depth-topology motivation. This paper tests the claim in a controlled setting where recurrent reuse can repeatedly apply the same rule.
- [[fixed-point-reasoners|FPRM]] addresses a related compute-allocation problem with fixed-point halting and residual scaling, while this paper uses output-distribution change plus entropy on finite recurrent iterations.
- [[jacobian-lens-workspace]] and this paper both warn that intermediate decodability is not enough. This paper adds activation patching to test whether a decoded bridge entity is causally used for the final composition.

## Limitations & Open Questions

- The main evidence comes from small models trained from scratch on synthetic permutation-based knowledge graphs. It does not establish the same behavior for pretrained or frontier-scale language models.
- Systematic generalization and depth extrapolation use different datasets and positional-encoding choices. Results across the two settings are not a single controlled scaling curve.
- Curriculum training exposes progressively harder examples only after the model passes a 95% threshold at the previous hop. This makes the learned recursion depth depend on both the architecture and the data schedule.
- Zero-initialization is important for stable unrolling, but default initialization gives variable results across seeds. The paper does not fully explain which initialization statistics control this variability.
- The authors find no clear trend that larger models or larger maximum training recurrence consistently improve the extrapolation ratio in the tested range.
- Adaptive halting uses thresholds selected for this synthetic task. The paper does not show that output entropy is a reliable difficulty signal for natural-language reasoning.

> [!open-question]
> Does recurrent depth preserve the same systematic-composition advantage when the atomic facts come from natural-language pretraining rather than a clean synthetic graph?

## Future Work

- Test recurrent-depth composition on natural-language facts, code, and broader reasoning tasks.
- Scale the controlled experiments to larger models while matching effective depth, compute, and data exposure against vanilla Transformers.
- Develop initialization and training schedules that retain inference-time scaling across random seeds without latent overthinking.
- Improve adaptive halting so it uses a task-robust confidence signal rather than thresholds tied to one synthetic output space.
- Combine recurrent composition with richer state interfaces, including input injection, latent supervision, or fixed-point refinement.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2604.07822)
- [arXiv](https://arxiv.org/abs/2604.07822)
- [HTML](https://arxiv.org/html/2604.07822)
- [PDF](https://arxiv.org/pdf/2604.07822v2)
- [Code](https://github.com/OSU-NLP-Group/Loop-Think-Generalize)
