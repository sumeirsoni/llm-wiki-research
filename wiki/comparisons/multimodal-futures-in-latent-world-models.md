---
title: "Multimodal Futures in Latent World Models"
type: comparison
created: 2026-08-25
updated: 2026-08-25
tags:
  - world-model
  - representation-learning
  - optimization
  - robotics
sources:
  - "[[intact]]"
  - "[[prism-prior-guided-imagination-sampling]]"
  - "[[leworldmodel]]"
  - "[[fast-leworldmodel]]"
  - "[[sub-jepa]]"
  - "[[sensorimotor-world-models]]"
  - "[[delta-jepa]]"
  - "[[what-matters-latent-actions]]"
  - "[[orthogonal-jepa]]"
  - "[[lpwm]]"
  - "[[jepa-paradox-in-language]]"
aliases:
  - "Multimodal action prediction"
  - "Unimodal predictor limitation"
---

# Multimodal Futures in Latent World Models

## Question

Which wiki papers predict actions or future states with unimodal (Gaussian or deterministic-L2) machinery despite worlds whose continuations are multimodal, and what working methods exist for representing multimodal predictive distributions?

## Summary

The LeWM-cluster world models and their control extensions predict latents and actions with deterministic MSE regression or diagonal Gaussians. Two of them ([[intact|INTACT]], [[prism-prior-guided-imagination-sampling|PRISM]]) acknowledge the mismatch themselves; [[jepa-paradox-in-language|The JEPA Paradox in Language]] supplies the formal argument (deterministic MSE prediction converges to the conditional centroid of separated valid targets, which may match none of them); [[orthogonal-jepa|OJEPA]] lists it as an author-stated limitation. Working escapes exist - mixture heads, diffusion/flow heads, discrete codes, CVAEs, energy-based heads, stochastic multi-trajectory inference, best-of-many training - and most are already represented in this wiki, but in other clusters, unconnected to the world-model stack.

> [!contradiction]
> Sampling-based planners ([[sampling-based-latent-planning|CEM/MPPI]]) partially mask unimodal predictors because they evaluate many candidates, yet CEM refits a single Gaussian to the elites each iteration - reintroducing mode collapse inside the planner loop. Population coverage and head expressivity are separate failure surfaces.

## Audit Table

| Paper | Predictive head | Multimodal exposure |
|-------|----------------|---------------------|
| [[intact]] | Diagonal Gaussian action distribution | Author-stated: mean can lie between valid modes; proposes mixture actors |
| [[prism-prior-guided-imagination-sampling]] | Diagonal Gaussian action prior fused into MPPI | Author-stated: single Gaussian underfits multimodal demos; proposes mixture heads |
| [[leworldmodel]] | Deterministic latent MSE + CEM | Unaddressed; masked partly by planner population |
| [[fast-leworldmodel]] | Parallel deterministic prefix prediction + CEM | Same profile as LeWM |
| [[sub-jepa]] | Deterministic latent MSE + CEM | Same profile |
| [[sensorimotor-world-models]] | Deterministic latent MSE + inverse dynamics + CEM | Same profile |
| [[delta-jepa]] | Deterministic latent-difference decoding + CEM | Same profile |
| [[what-matters-latent-actions]] | Gaussian VAE regularizer; L2 latent/action heads | Mild at Stage I (IDM sees both frames); severe from context-only prediction onward |
| [[orthogonal-jepa]] | Deterministic factorized branches | Author-stated: no explicit multimodal futures |
| [[lpwm]] | Deterministic latent MSE + CEM | Same profile as LeWM; but its mode-factored support (discrete regime / continuous magnitude) is a partial step toward representing discrete structure inside a JEPA latent |

Formal grounding: [[jepa-paradox-in-language|The JEPA Paradox in Language]] proves the centroid-collapse mechanism for deterministic squared-error latent prediction whenever valid conditional targets remain separated - derived for language, structurally identical for action latents under context-only conditioning.

## Why the Planner Does Not Save You

CEM/MPPI evaluate hundreds of candidates, so a mediocre head still gets exploited *if* the sampled cloud covers a good mode. But:

- CEM refits one Gaussian to the elite set per iteration - once elites concentrate near one mode, competing modes are abandoned even if nearly equivalent in cost
- PRISM makes this sharper: its learned prior actively sharpens the sampling distribution around demonstration-average behavior before search begins

Head expressivity and planner coverage compose badly rather than cancel out.

## Available Methods for Multimodal Prediction

| Method family | Wiki anchor | Notes |
|---------------|-------------|-------|
| Mixture density heads | (not yet ingested; named by [[intact]] and [[prism-prior-guided-imagination-sampling]] as their own future work) | Direct drop-in for both Gaussian heads |
| Diffusion / flow-matching heads | [[flow-matching]], [[self-flow]] | Modern VLA default (Diffusion Policy lineage); represents arbitrary multimodality at sampling cost |
| Discrete codebooks | [[what-matters-latent-actions]] | Mode-committing: sample a primitive, don't average; won zero-shot LIBERO-Plus in the LAM study. [[lpwm|LpWM]]'s sparse support offers a continuous hybrid: the binary support encodes discrete dynamical regimes while magnitudes keep continuous within-regime state |
| CVAE style variables | (not yet ingested; ACT lineage) | Latent mode variable sampled at decode time |
| Energy-based heads | [[energy-based-models]], [[energy-based-transformers]] | Multimodality lives in the energy landscape; inference-time optimization selects modes |
| Stochastic multi-trajectory inference | [[generative-recursive-reasoning]] | Width scaling explicitly motivated by mode collapse on multi-solution tasks |
| Best-of-many / candidate selection | [[explorative-modeling]], [[candidate-exploration]], [[delta-world]] | Train against selected winners among diverse generated hypotheses |

## Open Questions

> [!open-question]
> Would mixture or diffusion heads close INTACT's residual gap to full-search baselines, or does Direct amortized control fundamentally require unimodal targets for stable training?

> [!open-question]
> Do discrete latent actions transfer the VQ zero-shot advantage from the LAM setting into CEM-planned JEPA world models like [[leworldmodel|LeWM]]? [[lpwm|LpWM]]'s mode-factored support is early evidence that JEPA latents can host discrete regime structure, but it was never tested as a multimodal-futures mechanism.

> [!open-question]
> Can the [[jepa-paradox-in-language|centroid-collapse]] formalism be ported wholesale to action latents, giving the LeWM cluster a principled diagnostic (conditional target variance) for when unimodal prediction is safe?

> [!open-question]
> Is planner-level diversity (non-Gaussian CEM refits, mixed elite sets) sufficient without touching the head, given [[prism-prior-guided-imagination-sampling|PRISM]] shows the prior shapes the search distribution anyway?

## Related Pages

- [[latent-actions]] - where the multimodality thread was first filed for the LAM study
- [[iterative-latent-refinement-for-world-models]] - poses stochastic trajectories vs energy vs discrete branches as an open design choice
- [[ema-vs-non-ema-collapse-prevention]] - orthogonal collapse-prevention axis
