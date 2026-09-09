---
title: "Explorative Modeling: Unlocking a Third Pretraining Axis and End-to-End Generation"
type: source
created: 2026-08-01
updated: 2026-08-01
arxiv_id: "2607.27372"
authors:
  - "Alexi Gladstone"
  - "Heng Ji"
  - "Yilun Du"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.27372"
code_url: "https://github.com/alexiglad/XM"
project_url: "https://explorative-modeling.github.io/"
tags:
  - generative-modeling
  - flow-matching
  - world-model
  - language
  - vision
  - video
  - reinforcement-learning
aliases:
  - "Explorative Modeling"
  - "Explorative Models"
  - "XM"
---

# Explorative Modeling: Unlocking a Third Pretraining Axis and End-to-End Generation

## Summary

Explorative Modeling (XM) treats candidate count during training as an additional scaling axis for generative models. Instead of reducing multimodality only by factorizing generation into autoregressive tokens or diffusion steps, Forward XM samples multiple outputs for one target and updates only the best match. Across image, video, masked-diffusion language, behavior cloning, and trajectory world modeling, the paper reports that more exploration improves the tested models and can trade extra training compute for fewer inference steps. The strongest standalone results are on constrained control tasks, not unrestricted end-to-end image, video, or language generation.

## Key Contributions

- **Forward XM** samples $K$ generations for one target and backpropagates through the minimum-cost candidate, generalizing best-of-many training into a modality-spanning framework.
- **Reverse XM** matches one generation against $K$ data targets. It is cheaper in model FLOPs and precision-oriented, but can contract the generated distribution without entropy or coverage constraints.
- **Exploration as a scaling axis**: over the tested ranges, increasing $K$ monotonically improves image and video metrics, while relative gains grow with model size, data, and training compute.
- **Hybrid generators**: exploration is added to flow/diffusion, few-jump continuous generation, representation-autoencoder generation, and masked-diffusion language modeling without redesigning their main architectures.
- **End-to-end reconstructive control**: one- or few-pass explorative policies and world models match or exceed reproduced diffusion baselines on Robomimic and Maze2D with far fewer network evaluations.
- **Theory with qualifications**: smooth Forward and Reverse objectives admit complementary KL interpretations, while the hard minimum used in experiments guarantees weaker support-oriented behavior and not calibrated probability mass.

## Methodology

For target $x$, Forward XM draws $K$ candidates from $G_\theta$ and minimizes only the best reconstruction cost:

$$
\mathcal{L}_{\mathrm{Forward}}(\theta)=\min_{i\in\{1,\ldots,K\}}J(\hat y_i,x).
$$

At $K=1$, this is ordinary reconstructive training. Different noise values or learned latent embeddings let candidates specialize to different modes instead of averaging incompatible targets. Reverse XM inverts the search: it generates one output, samples $K$ data points, and trains against the closest target. The authors connect smooth versions of these objectives to coverage-oriented $\mathrm{KL}(p^*\|p_\theta)$ and precision-oriented $\mathrm{KL}(p_\theta\|p^*)$, respectively.

Candidates are folded into the batch dimension. In the FLOP-efficient implementation, all candidate activations are retained but gradients pass only through the winner. Using the paper's transformer approximation, a Forward XM-$K$ step costs roughly $(K+2)/3$ ordinary training steps. The main hybrids are XDiffusion, XJumpy, XRAE, and XMDLM; the continuous variants use flow-matching objectives.

## Key Results

- **ImageNet 256x256**: XM-2 improves an unguided DINOv2-B RAE reproduction from 1.55 to **1.43 gFID**, with unchanged precision and recall. Under guidance, XM improves FDr6 but is slightly worse on gFID, Inception Score, and precision.
- **Efficiency**: the XRAE experiments report matched quality with **6.2x fewer processed samples** and **4.1x fewer estimated FLOPs**. A Large XM-5 model also outperforms a non-exploratory XLarge model with 47% more parameters.
- **Exploration scaling**: ImageNet FID improves across every tested $K$ from 1 to 25 for XDiffusion and XJumpy; Something-Something V2 FVD likewise improves across the tested $K$ values. This is evidence over finite experimental ranges, not a universal scaling law.
- **Scale interaction**: the reported relative gain of XM-5 grows from 13% to 23% with model size and from 7% to 36% with data or training duration. Foundation-model-scale behavior remains extrapolative.
- **Robomimic**: XM-10 uses **1 network evaluation** versus 100 for reproduced Diffusion Policy, matching three tasks and improving Square and Transport by 2 percentage points.
- **Maze2D**: XM-10 averages 130.0 score at 2.3 network evaluations versus 127.2 at 192 for reproduced Diffuser. It is better on U-Maze and Large but worse on Medium.
- **Language**: XMDLM improves the plotted generative-perplexity versus entropy frontier at 8 and 256 sampling steps, but the paper does not tabulate the plotted values.

## Connections

- The [[candidate-exploration|Explorative Modeling]] concept situates candidate search alongside generation depth, richer transitions, distribution-level objectives, and inference-time width.
- [[delta-world|DeltaWorld]] uses the same core Forward-XM pattern in a specialized video world model: multiple noise-conditioned predictions, winner selection, and backpropagation only through the closest target. XM's main addition is the general framework, scaling analysis, and cross-domain evaluation.
- [[flow-matching|Flow Matching]] is the training basis for the continuous XM hybrids. Exploration changes the candidate-to-target coupling while flow matching still defines each candidate's transport objective.
- [[normalizing-trajectory-models|Normalizing Trajectory Models]] addresses few-step multimodality by enriching each reverse transition; XM instead spends more training compute searching candidate matches so fewer generation stages can remain expressive.
- [[representation-frechet-loss|Representation Frechet Loss]] optimizes aggregate distribution statistics, whereas hard-min XM uses pointwise winner selection. This contrast matters because XM support coverage does not by itself guarantee calibrated density.
- In [[world-models|world models]], XM extends best-of-many prediction from efficient feature forecasting to low-step trajectory generation and planning. Its proposed JEPA-style feature-space extension remains future work.
- [[expanding-flow-maps|Expanding Flow Maps]] changes output dimensionality during generation; XM keeps the output structure fixed but expands the number of candidate couplings explored during training.

## Limitations & Open Questions

- Forward XM training cost grows with $K$, making exhaustive candidate search impractical for distributions with extremely many modes.
- The clean likelihood interpretation applies to a smooth objective, while experiments use hard winner selection. Hard-min support coverage does not determine correct probability mass.
- Reverse XM can collapse or contract the distribution without an entropy bonus, Forward term, or other coverage constraint, and it lacks the paper's detailed quantitative evaluation of Forward XM.
- Autoregressive language integration produced only modest preliminary gains; XMDLM requires learned discrete search latents rather than using a search variable already present in the baseline.
- The strongest standalone end-to-end results are limited to constrained behavior-cloning and Maze2D tasks, largely against locally reproduced diffusion baselines.
- Losses are not comparable across $K$, guidance transfers inconsistently, and the paper reports limited XM-specific hyperparameter tuning.
- The experiments do not establish compute-optimal allocation among parameters, data, and exploration, or show that observed gains continue to foundation-model scale.

> [!open-question]
> Does winner-selected exploration improve calibrated density and mode frequencies, or mainly improve finite-$K$ support coverage and best-case samples?

## Future Work

The authors explicitly propose:

- derive compute-optimal scaling laws that allocate budget among parameters, data, and exploration $K$;
- integrate XM with autoregressive language models, multi-token prediction, few-step MeanFlow-style models, Free Transformer variants, and Energy-Based Transformers;
- combine exploration with JEPA-style feature prediction, end-to-end feature-space world models, multimodal next-state prediction, and trajectory-level planning;
- improve candidate search using structured discrete factors, gradient-based latent optimization, proxy scoring, learned encoders, later-training search, and soft-min updates to more candidates;
- develop Forward/Reverse mixtures, entropy or coverage constraints, sticky couplings, continuous-condition support, and vector-database search for Reverse XM;
- study exploration in post-training and reinforcement learning, including connections to pass@$k$ and best-of-$N$-aware fine-tuning;
- release the Reverse-XM language implementation, which was not public with this version.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2607.27372)
- [arXiv](https://arxiv.org/abs/2607.27372)
- [PDF](https://arxiv.org/pdf/2607.27372)
- [Project page](https://explorative-modeling.github.io/)
- [Code](https://github.com/alexiglad/XM)
- [Author post](https://alexiglad.github.io/blog/2026/explorative_modeling/)
