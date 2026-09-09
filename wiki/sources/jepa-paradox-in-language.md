---
title: "The JEPA Paradox in Language: The Geometry of Linguistic Alternatives"
type: source
created: 2026-08-20
updated: 2026-08-20
arxiv_id: "2607.23531"
authors:
  - "Anh Trac Duc Dinh"
  - "Khang Nhat Hoang Vo"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.23531v1"
tags:
  - jepa
  - language
  - self-supervised-learning
  - representation-learning
  - representation-collapse
  - theory
aliases:
  - "The JEPA Paradox in Language"
  - "JEPA Paradox"
  - "T-JEPA"
---

# The JEPA Paradox in Language: The Geometry of Linguistic Alternatives

## Summary

The paper argues that deterministic squared-error JEPA prediction is structurally mismatched to masked language when one context supports several valid completions whose latent representations remain separated. Under squared error, the optimal point prediction is their conditional mean, which may represent no actual completion. The encoder can reduce this irreducible error by merging alternatives, but that destroys linguistic distinctions and creates a loss-reducing route to low-rank or collapsed representations. In controlled diagnostics, text JEPA shows early mutual-information saturation, elevated conditional target variance, later optimization instability, validation effective-rank collapse to 1.57, and chance-level classification with zero reported retrieval performance.

## Key Contributions

- **Conditional-mean diagnosis:** formalizes deterministic MSE JEPA as predicting the latent centroid of valid alternatives.
- **Three-part criterion:** separates predictability, non-collapse, and low conditional variance as distinct requirements for useful latent prediction.
- **Language-versus-image argument:** shows why local visual context can concentrate targets while lexical and semantic alternatives can remain separated under the same visible text context.
- **Loss-reducing collapse construction:** demonstrates that low-rank text representations can minimize JEPA loss when they merge contexts and targets into coarse equivalence classes.
- **Temporal diagnostic chain:** tracks MI proxy, target variance, train/validation loss, effective rank, and cosine geometry to argue that ambiguity precedes collapse.
- **Downstream comparison:** evaluates T-JEPA against BERT MLM, Barlow Twins, VICReg, and BYOL on classification and retrieval.

## Methodology

### JEPA objective

For context positions $C$, targets $T$, context encoder $f_\theta$, EMA target encoder $f_{\bar\theta}$, predictor $g_\phi$, and positional query $p_j$:

$$
z_C=f_\theta(x_C),\qquad z_T^{(j)}=f_{\bar\theta}(x)^{(j)},
$$

$$
\bar\theta\leftarrow\tau\bar\theta+(1-\tau)\theta,
$$

$$
\mathcal L_{\mathrm{JEPA}}=\mathbb E_{x,C,T}\left[\frac1{|T|}\sum_{j\in T}\left\|g_\phi(f_\theta(x_C),p_j)-\operatorname{sg}(f_{\bar\theta}(x)^{(j)})\right\|_2^2\right].
$$

For fixed context and position, the MSE-optimal predictor is

$$
g_\phi^\star(z_C,p_j)=\mathbb E[z_T^{(j)}\mid z_C,p_j].
$$

This conditional-mean identity drives the paper's analysis.

### Predictability and conditional concentration

The paper frames predictability through conditional mutual information:

$$
I(z_C;z_T^{(j)}\mid p_j)=H(z_T^{(j)}\mid p_j)-H(z_T^{(j)}\mid z_C,p_j).
$$

A deterministic encoder cannot create context-target information absent from the data relationship. For locally smooth images and a locally Lipschitz encoder, nearby features satisfy a concentration bound:

$$
\mathbb E\left[\|f_{\bar\theta}(x)^{(j)}-f_{\bar\theta}(x)^{(i)}\|_2^2\right]\le L^2d(i,j)^2.
$$

For text, if multiple plausible completions have nonzero mass and their target representations remain separated by at least $\Delta$, the conditional latent distribution has nonzero variance. A deterministic predictor must accept residual error or rely on the encoder to merge alternatives.

### Collapse and low-rank solutions

The constant representation is a zero-loss solution when the predictor and target encoder produce the same constant. More generally, assigning contexts to $K$ coarse classes,

$$
f_\theta(x_C)=\mathbf e_{\pi(x_C)},
$$

implies

$$
\operatorname{rank}(\Sigma_z)\le K-1.
$$

If target features also depend only on coarse class and target position, a predictor can achieve zero JEPA loss despite the low-rank representation. Collapse is therefore presented as a possible loss-reducing response to ambiguity, not only an optimization accident.

### Centroid degeneracy

The loss decomposes into reducible predictor error and irreducible conditional variance:

$$
\mathbb E\|g_\phi-z^*\|_2^2=\mathbb E\|g_\phi-\bar z\|_2^2+\mathbb E\|z^*-\bar z\|_2^2.
$$

For completion-specific latent $h_j(v;x_C)$, the optimum is

$$
g_\phi^\star(z_C,p_j)=\sum_{v\in\mathcal V}p(v\mid x_C)h_j(v;x_C).
$$

If $m\ge2$ plausible completions each have probability at least $\alpha$ and are pairwise separated by at least $\Delta$, the paper derives

$$
\operatorname{Var}(z^*\mid z_C,p_j)\ge\frac{\alpha^2m(m-1)}2\Delta^2.
$$

Thus preserving linguistic alternatives imposes irreducible variance, while reducing that variance by merging them removes distinctions.

### Diagnostic setup

**I-JEPA:** 100,000 ImageNet-1K images, ViT-H/16, 32 layers, hidden size 1,280, block masking, and EMA momentum 0.996.

**T-JEPA:** 100,000 English C4 sentences, BERT-Large context/target encoders, 24 layers, hidden size 1,024, a six-layer width-384 predictor, 1-5 masked spans of 1-5 tokens, and EMA momentum 0.996. The main run uses seed 42; five additional runs independently resample C4 with seeds 0-4.

Both diagnostic runs train for 15 epochs with AdamW, a deliberately extended 10-epoch warmup, gradient clipping 0.3, and increasing weight decay. Shorter warmup or fixed learning rates cause T-JEPA to collapse earlier.

Diagnostics include an InfoNCE MI proxy with queue size 2,048 and temperature 0.1, covariance effective rank, pairwise cosine statistics, and conditional target variance estimated from 16 variants over 200 contexts. Text alternatives come from a frozen masked-LM oracle with candidate probability above 0.001.

## Key Results

### Temporal failure chain

Table 1 and Figures 2-4 support the sequence: MI saturation, persistent conditional variance, train/validation instability, geometric collapse, and failed downstream transfer.

- T-JEPA validation MI remains **below 0.35 nats throughout training**.
- Validation effective rank is still about **4.66 at step 2,000**, after MI has saturated.
- The marked instability point is **step 9,340**.
- T-JEPA validation effective rank ultimately collapses to **1.57**.
- Training effective rank instead rises to approximately **494.39-545.44**, producing a large train-validation split.
- After step 9,340, mean pairwise cosine approaches **1.0** and its dispersion vanishes.
- I-JEPA train and validation effective rank remain aligned around **4.7-4.85**.

Conditional target variance in Figure 4:

- I-JEPA reaches **0.0008** on train and validation near step 1,500; at step 9,340 it is 0.0062 train and 0.0059 validation, then stabilizes near 0.0017.
- T-JEPA is 0.0149 train and 0.0116 validation at step 9,340; it later contracts to about 0.0010-0.0012 while rank and cosine collapse.

The late T-JEPA variance reduction is therefore not interpreted as successful disambiguation.

Five independently resampled C4 runs reproduce the qualitative pattern: near-zero MI, delayed rank excursion, validation-loss spike around epochs 9-11, late rank collapse near 1, and cosine concentration near 1. The appendix does not provide an exact per-seed scalar table.

### Downstream transfer

Table 2 evaluates frozen `bert-base-uncased` encoders after pretraining on three million C4 sentences. Values are means ± standard deviations over five runs; retrieval metrics are percentages.

| Model | IMDB Acc. | SNLI Acc. | FEVER nDCG@10 | FEVER R@100 | MSMARCO nDCG@10 | MSMARCO R@100 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| BERT MLM | **81.91±1.35** | **59.72±1.25** | **14.43±1.17** | **38.82±1.24** | **9.494±0.93** | **33.672±1.37** |
| Barlow Twins, Mask | 64.34±2.26 | 45.55±1.31 | 0 | 0 | 0.1082±0.009 | 0.419±0.096 |
| VICReg, Mask | 63.12±2.13 | 43.93±2.27 | 0 | 0 | 0.009±0.021 | 0.115±0.035 |
| BYOL, Mask | 50.23±0.72 | 34.28±1.12 | 0 | 0 | 0 | 0 |
| Barlow Twins, Replace | 62.02±1.33 | 43.87±1.18 | 0 | 0 | 0.009±0.032 | 0.201±0.042 |
| VICReg, Replace | 59.10±1.22 | 41.59±1.41 | 0 | 0 | 0.004±0.001 | 0.006±0.002 |
| BYOL, Replace | 61.77±1.17 | 43.99±2.28 | 0 | 0 | 0.021±0.004 | 0.358±0.012 |
| T-JEPA | **50.02±0.13** | **33.34±0.12** | **0** | **0** | **0** | **0** |

BERT is best on every reported metric. T-JEPA accuracy is approximately chance on binary IMDB and three-class SNLI and is zero on all four retrieval metrics. Some reported F1 scores remain high despite chance-level accuracy, particularly on IMDB, so accuracy is the stronger basis for the chance-level conclusion.

### Corruption ablation

Mask and replacement corruptions are compared for Barlow Twins, VICReg, and BYOL. BYOL shows the clearest replacement advantage:

- IMDB accuracy: 50.23 with independent masking to 61.77 with replacement.
- SNLI accuracy: 34.28 to 43.99.
- MSMARCO retrieval changes from zero to small nonzero values.

The authors argue that replacement better preserves global sentence identity, whereas independently masked views introduce multiple unresolved lexical hypotheses.

### SIGReg analysis

Using the law of total variance,

$$
\Sigma_z=\mathbb E_{x_C}[\operatorname{Cov}(z_T^{(j)}\mid x_C)]+\operatorname{Cov}_{x_C}(\mathbb E[z_T^{(j)}\mid x_C]),
$$

the appendix argues that SIGReg can constrain total marginal covariance without controlling its split between irreducible within-context variance and useful between-context signal. The authors construct a case with isotropic marginal covariance and vanishing context mutual information. Their conclusion is that non-collapse is necessary but not sufficient for language JEPA.

## Connections

- Directly qualifies [[jepa|Joint-Embedding Predictive Architecture]]: semantic latent prediction is useful only when the context-conditional target geometry supports a meaningful deterministic point.
- Adds an objective-driven collapse route to [[representation-collapse]]: merging valid alternatives can reduce JEPA loss even when it destroys linguistic distinctions.
- Extends [[representation-geometry]] from global rank and neighborhoods to **conditional geometry given context and target position**.
- Adds an important qualification to the latent-versus-token discussion in [[self-supervised-learning]].
- Creates a theoretical tension with [[learn-from-your-own-latents]]: latent targets may improve sample complexity when they encode stable hierarchical classes, yet deterministic point prediction can fail when valid conditional alternatives remain separated.
- Complements [[levljepa]], where direct cross-modal MSE can collapse or align poorly despite marginal regularization; the mechanisms are related but not identical.
- Connects to [[generative-recursive-reasoning|GRAM]], [[candidate-exploration]], and [[explorative-modeling]] through the shared need to preserve multiple valid hypotheses rather than average them into one point.
- Suggests probabilistic alternatives related to [[latent-reasoning-with-normalizing-flows|NF-CoT]] and the multimodal uncertainty questions in [[iterative-latent-refinement-for-world-models]].
- Broadens [[ema-vs-non-ema-collapse-prevention]] from the mechanism used to prevent collapse to whether the predictive target is conditionally well-posed.

## Limitations & Open Questions

The authors explicitly bound the claim to deterministic squared-error latent point prediction, not predictive language learning in general. They do not claim that image targets are unique, that data processing alone proves collapse, or that image JEPA is universally stable. InfoNCE is used only as a comparative proxy. The experiments focus on English C4, BERT-family encoders, and token or short-span masking; they do not establish the same result for sentence-, event-, discourse-, or document-level targets. SIGReg is analyzed theoretically but not tested experimentally.

Further evidence-grounded caveats are that text variance estimates depend on a frozen masked-LM oracle, image alternatives are synthetic perturbations rather than true conditional samples, I-JEPA and T-JEPA differ in architecture and masking geometry, and the downstream study covers only two classification and two retrieval datasets. Most non-generative baselines also perform poorly on retrieval, limiting how specifically retrieval failure can be attributed to T-JEPA.

> [!open-question]
> **Inferred:** Can a distributional, mixture, energy-based, or diffusion latent predictor preserve multiple completions and outperform masked-token modeling?

> [!open-question]
> **Inferred:** At what linguistic scale do targets become conditionally concentrated enough for deterministic JEPA: phrases, syntax, events, sentences, discourse, or grounded actions?

> [!open-question]
> **Inferred:** Can an objective jointly enforce healthy marginal covariance and context-conditional multimodality rather than treating non-collapse and predictability separately?

> [!open-question]
> **Inferred:** How much of the observed failure is specific to Euclidean MSE, the masking policy, the oracle used to estimate alternatives, English tokenization, or training from the reported initialization?

> [!open-question]
> **Inferred:** What mechanism produces the striking training effective-rank rise above 494 while validation rank collapses to 1.57?

## Future Work

The paper's explicitly labeled future-work proposal is to add SIGReg to T-JEPA and test whether it preserves effective rank and cosine geometry while early MI saturation, elevated irreducible variance, and transfer below BERT remain under the full diagnostic protocol.

The authors also explicitly recommend investigating:

- distributional or mixture-valued latent prediction;
- contrastive mechanisms, redundancy reduction, or explicit variance preservation;
- semantic-level rather than token-level targets;
- a retained generative language-modeling objective as an anchor.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2607.23531)
- [arXiv](https://arxiv.org/abs/2607.23531)
- [HTML](https://arxiv.org/html/2607.23531v1)
- [PDF](https://arxiv.org/pdf/2607.23531v1)
- [Source](https://arxiv.org/src/2607.23531)
