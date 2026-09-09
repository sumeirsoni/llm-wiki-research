---
title: "Orthogonal JEPA: Factorized Predictive States for Latent World Models"
type: source
created: 2026-08-25
updated: 2026-08-25
arxiv_id: "2608.20065"
authors:
  - "Taoyong Cui"
  - "Pheng Ann Heng"
  - "Wanli Ouyang"
year: 2026
venue: "arXiv preprint (cs.LG)"
pdf_path: "https://arxiv.org/pdf/2608.20065"
tags:
  - jepa
  - world-model
  - self-supervised-learning
  - representation-learning
  - optimization
aliases:
  - "OJEPA"
  - "Orthogonal JEPA"
---

# Orthogonal JEPA: Factorized Predictive States for Latent World Models

## Summary

Standard [[jepa|JEPAs]] organize all predictable content through one target embedding and one prediction pathway - a monolithic state that, in complex systems, allocates redundant capacity to dominant signals while giving weak or conflicting gradients to less dominant predictive structure. Orthogonal JEPA (OJEPA) addresses this with **orthogonal predictive factorization**: K learned basis matrices analyze each target state into components, a dedicated prediction branch estimates each component from a shared context, and the predicted factors are synthesized back into a complete latent state for readouts, decoders, planners, or autoregressive rollout. Because every branch must minimize its own local prediction error, easy-to-predict dominant signals can no longer drown out harder structure. The same predictive-state mechanism applies whether the target is temporally future, spatially hidden, or another partial observation of the same system, validated across controlled vision, single-cell transcriptomics, longitudinal health records, continuous control, and force-free molecular dynamics.

## Key Contributions

- **Orthogonal predictive factorization**: basis matrices $B_k \in \mathbb{R}^{d \times r}$ (with $Kr = d$) project the stop-gradient target into factors $z_t^{(k)} = B_k^T\,\text{sg}(z_t)$; per-factor predictors $\hat{z}_t^{(k)} = q_k(z_c, s_t)$ estimate each component; synthesis is simple summation $\hat{z}_t = \sum_k B_k \hat{z}_t^{(k)}$ under orthogonality
- **Four-term objective**: per-factor regression ($\mathcal{L}_{pred}$), within-basis orthonormality plus mutual cross-basis orthogonality ($\mathcal{L}_{orth}$), factor-activity variance floors ($\mathcal{L}_{fac}$), and coordinate-wise encoder-variance floors against collapse ($\mathcal{L}_{enc}$), with optional auxiliary losses (e.g., masked modeling)
- **Domain-general mechanism**: identical predictive-state machinery across five systems spanning vision, biology, health, control, and molecular simulation
- **Empirical gains in every domain**, most dramatically in planning and long-horizon stability

## Methodology

**Factorization mechanism.** A target state $z_t$ from a stop-gradient target encoder $f_{\bar\theta}$ is analyzed by K learned basis matrices $B_k \in \mathbb{R}^{d \times r}$ (with $Kr = d$) into factors $z_t^{(k)} = B_k^T \text{sg}(z_t)$. Dedicated predictors estimate each component from the shared context representation plus target descriptors (timestamp, spatial index): $\hat{z}_t^{(k)} = q_k(z_c, s_t)$. Synthesis uses the Moore-Penrose pseudoinverse $\hat{z}_t = (B^T)^{\dagger}\hat{u}_t$, which reduces to simple summation $\hat{z}_t = \sum_k B_k \hat{z}_t^{(k)}$ when B is orthogonal (Proposition 1 gives exact norm-preserving decomposition in that limit).

**Anti-collapse stack.** Target parameters are updated by exponential moving average ($\bar\theta \leftarrow m\bar\theta + (1-m)\theta$) with no gradients - the standard JEPA arrangement. Only marginal coordinate-wise variance floors guard against collapse; there is no full distributional matching (no Gaussian normality tests as in [[lejepa|SIGReg]]) and no action-aligned auxiliary loss.

**Objective.** $\mathcal{L}_{OJEPA} = \mathcal{L}_{pred} + \lambda_{orth}\mathcal{L}_{orth} + \lambda_{fac}\mathcal{L}_{fac} + \lambda_{enc}\mathcal{L}_{enc}$ (+ optional auxiliary terms such as masked modeling):

- $\mathcal{L}_{pred}$: squared error between branch outputs and analyzed targets
- $\mathcal{L}_{orth}$: within-basis orthonormality ($B_k^T B_k \approx I_r$) plus mutual cross-basis orthogonality ($B_i^T B_j \approx 0$)
- $\mathcal{L}_{fac}$ / $\mathcal{L}_{enc}$: hinge floors on coordinate-wise standard deviations of factors and online-encoder outputs against activity collapse

**Interfaces.** The predictive-state mechanism is fixed; only the tokenization interface changes per domain: controlled vision (predicting hidden-patch changes under operations), single-cell transcriptomics (masked gene profiles), longitudinal health records (future clinical events), continuous control (action-conditioned future states), force-free molecular dynamics (future atom positions).

## Key Results

- **Continuous control (CEM planning)**: Walker2d-v5 mean return **45.1 vs 4.9** for the standard monolithic JEPA
- **Single-cell transcriptomics**: beats scGPT and Cell-JEPA on zero-shot clustering and perturbation-response prediction
- **Health forecasting**: Mean PRAUC 0.718, outperforming general-purpose LMs (Qwen) and specialized disease-trajectory models
- **Molecular dynamics**: force-free prediction of atom positions (water, paracetamol) maintains lower RMSD over 100 autoregressive steps
- **Controlled vision**: learns to bind visual features to spatial grids by predicting how hidden patches change under operations

> [!note]
> The authors explicitly caution that geometric orthogonality is **not semantic disentanglement**: factors are not automatically interpretable as color/shape/velocity. The benefit claimed is a favorable optimization landscape - separate slots prevent easy features from dominating gradients - not interpretability.

## Connections

- Closest prior method is [[sub-jepa|Sub-JEPA]], which applies Gaussian normality tests in *frozen random* orthogonal subspaces for regularization; OJEPA instead *learns* orthogonal bases and uses them to factorize the *prediction pathway* itself
- Directly addresses the capacity-allocation diagnosis of [[obsessed-encoder|The Obsessed Encoder]] and [[feature-suppression|feature suppression]]: dominant predictable signals monopolizing latent capacity. OJEPA's answer is structural - dedicated branches make ignoring low-magnitude components impossible - rather than filtering or distributional regularization alone (wiki synthesis; the paper does not cite that work)
- Extends the [[representation-collapse|collapse-prevention]] toolbox: variance floors echo VICReg-style redundancy reduction ([[visreg]]) and the coordinate-wise variance term guards the encoder directly, complementing SIGReg ([[lejepa|LeJEPA]], [[leworldmodel|LeWM]])
- Joins the structured world-model family alongside [[causal-jepa|Causal-JEPA]]'s object-level masking: both replace one undifferentiated prediction target with organized substructure
- Parallel structural alternative to dense monolithic latents in [[lpwm|LpWM]], which sparsifies the state space itself (non-negative codes with exact zeros) rather than factorizing the prediction pathway; both reduce the effective complexity of the transition map a predictor must represent - LpWM shows lower-capacity predictors then suffice for planning
- Uses CEM planning over predicted latents like the LeWM cluster ([[sampling-based-latent-planning]]); its Walker2d result suggests factorized states stabilize long-horizon rollout where monolithic states drift
- Multi-domain scope (vision, transcriptomics, health, control, molecules) parallels the breadth argument of [[learn-from-your-own-latents|latent prediction theory]] that predictive objectives transfer wherever structure exists

## Limitations & Open Questions

> [!open-question]
> Factors are geometrically orthogonal, not semantically disentangled. The authors state factor interpretation "requires additional probes or ground-truth factor benchmarks."

> [!open-question]
> No ablation over K, r, or the loss weights is reported. Since $Kr = d$ pins total factor width to embedding dimension, more factors mean more predictor branches each of width $d/K$ - the paper does not quantify this overhead or sensitivity to K.

> [!open-question]
> Variance floors constrain marginal coordinate variation only and do not guarantee full-rank covariance; the authors list combining the objective with covariance or spectral regularization as future work.

> [!open-question]
> State synthesis depends on the conditioning of B; the authors note singular values must be monitored when synthesized states feed autoregressive rollout. The predictor is deterministic and does not represent multimodal futures.

> [!gap]
> Pixel-based closed-loop control, stochastic futures, continuous physical fields, and tasks with known causal factors are named by the authors as untested world-model regimes.

## Future Work

Author-stated directions (from Discussion/Conclusion):

- Combining the objective with covariance or spectral regularization, since variance floors alone do not guarantee full-rank covariance
- Making factors more interpretable via probes or ground-truth factor benchmarks
- Adapting the framework to highly stochastic, multimodal futures
- Extending to untested regimes: pixel-based closed-loop control, stochastic futures, continuous physical fields, and tasks with known causal factors

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.20065)
- [arXiv](https://arxiv.org/abs/2608.20065)
