---
title: "LpWM: A Case for Sparse Representations in World Models"
type: source
created: 2026-08-25
updated: 2026-08-25
arxiv_id: "2608.22764"
authors:
  - "Yilun Kuang"
  - "Yash Dagade"
  - "Quentin Le Lidec"
  - "Lucas Maes"
  - "Randall Balestriero"
  - "Yann LeCun"
year: 2026
venue: "arXiv preprint (cs.LG)"
pdf_path: "https://arxiv.org/pdf/2608.22764v1"
code_url: "https://github.com/YilunKuang/lpworldmodel"
tags:
  - jepa
  - world-model
  - self-supervised-learning
  - representation-learning
  - optimization
aliases:
  - "LpWM"
  - "LpWorldModel"
---

# LpWM: A Case for Sparse Representations in World Models

## Summary

LpWorldModel (LpWM) challenges the assumption that dense maximum-entropy embeddings are the right latent geometry for action-conditioned dynamics. Building on [[lejepa|LeJEPA]]-style distribution matching, it swaps the isotropic Gaussian target for a **Rectified Generalized Gaussian** (default: Rectified Laplace, p=1), enforced by **RDMReg**, so encoder features become non-negative codes with exact zeros (~30-65% active coordinates). The paper pairs this with a theory result - sufficiently high-dimensional one-hot codes render Lipschitz controlled dynamics *exactly linear* in latent space - and shows empirically that sparsity lowers the predictor complexity needed for planning against its own dense baseline [[leworldmodel|LeWM]]. The learned codes are **mode-factored**: the binary support identifies the discrete dynamical regime while nonzero magnitudes carry continuous within-regime state.

## Key Contributions

- **One-hot linearization theory** (Proposition 1): any uniformly Lipschitz controlled system on a compact state space admits a finite one-hot encoding with *exactly linear* action-conditioned latent transitions $\mathbf{z}_{t+1} = \mathbf{P}_\varepsilon(\mathbf{a}_t)\mathbf{z}_t$; Corollary 1 gives rollout error $O(N^{-1/d})$ vanishing as grid size $N$ grows (with an explicit curse-of-dimensionality caveat)
- **RDMReg world model**: matches random-projection marginals of features to a Rectified Generalized Gaussian via 2-Wasserstein distance ([[lejepa|LeWM]]'s dense isotropic Gaussian is the special case μ=0, σ=1, p=2 without ReLU)
- **Predictor-complexity result**: on PushT, sparse codes succeed where dense codes fail at equal intermediate predictor capacity (+24-57% planning success over [[leworldmodel|LeWM]] depending on predictor family); advantage disappears once DiT-class predictors saturate the task
- **Mode-factored structure**: support decodes discrete dynamical regimes (94-99% zone accuracy on a piecewise force-field environment, persisting with no visual cues); magnitudes decode continuous state; on OGBench-Cube a temporal-Jaccard prior redirects support instability from generic motion detection (r≈0.87 with effector motion) to contact events (cube-motion correlation 0.21→0.80)

## Methodology

**Objective.** Standard action-conditioned JEPA loss $\|\hat{\mathbf{z}}_{t+1} - \mathbf{z}_{t+1}\|_2 + \lambda_{\text{RDMReg}}\,\mathcal{R}(\mathbf{z}_{t+1})$, where $\mathcal{R}$ compares distributions of random projections $\mathbf{c}^\top\mathbf{z}$ ($\mathbf{c}$ uniform on the unit sphere) against a Rectified Generalized Gaussian target using the 2-Wasserstein distance.

**Architecture.** Follows [[leworldmodel|LeWM]]: ViT encoder, CLS token through a three-layer MLP projector; Transformer predictor with AdaLN-zero action conditioning. Both projector outputs pass through **RepReLU** ($\text{sg}(\text{ReLU}(x)) + \text{GeLU}(x) - \text{sg}(\text{GeLU}(x))$): exact zeros forward, GeLU gradients backward to avoid dead neurons. RepReLU is an optimization safeguard only - plain ReLU with RDMReg trains without collapse per the predecessor work, and no stop-gradient is used for collapse prevention.

**Planning.** CEM MPC in latent space minimizing $\|\hat{\mathbf{z}}_T - \mathbf{z}_g\|_2$ between predicted rollout and encoded goal image; maximum-update parameterization (μP) stabilizes width scaling across $D \in \{384...4096\}$.

**Predictor ladder.** Six predictors spanning 0.30M-822M parameters: Deep-AdaLN(k) (LeWM's DiT), Shallow-AdaLN(k), MLP∘LTV(k), MLP∘LTI(k), LTI(k), and single-frame LTI(1) - testing whether simpler transition functions suffice under each geometry.

## Key Results

- **Wall**: trivially easy - even the linear LTI(1) predictor reaches ~100% closed-loop success for both geometries; no room for sparsity to help
- **PushT**: at intermediate capacity, sparse LpWM beats dense LeWM by **24-57%** (MLP∘LTI(k)), **36-45%** (MLP∘LTV(k)), **11-23%** (LTI(k)); both fail at the lowest capacity and tie at the highest (Deep/Shallow-AdaLN)
- **Beyond Gaussian matching**: LpWM also outperforms a VICReg-regularized dense LeWM variant across predictor families *including* Deep-AdaLN; authors hypothesize second-order moment constraints leave the target distribution underspecified
- **Piecewise force-field navigation**: LpWM 84.7% vs LeWM 65.3% (random goals); support-Jaccard heatmaps recover zone boundaries even without visual cues; linear probes show support ≈ zone identity, magnitudes ≈ agent position
- **OGBench-Cube contact regimes**: unregularized support acts as a motion detector; adding the temporal-Jaccard loss shifts support instability to track cube motion (r: 0.21→0.80) and gripper contact (0.05→0.61) with no change in planning success

## Connections

- Direct successor application of the rectified-distribution line ([[lejepa|LeJEPA]] SIGReg → RDMReg): same random-projection machinery as [[visreg|VISReg]], but the target itself changes from maximum-entropy dense Gaussians to sparse non-negative codes
- Uses [[leworldmodel|LeWM]] as the dense baseline with identical architecture and shared authors (Lucas Maes, Quentin Le Lidec, [[randall-balestriero|Balestriero]], [[yann-lecun|LeCun]]) - a controlled test of the geometry question rather than a system comparison
- Second structural alternative to dense monolithic latents alongside [[orthogonal-jepa|OJEPA]]'s factorized branches: both aim to reduce the effective complexity of the learned transition map, one by splitting prediction pathways, one by sparsifying the state space
- The mode-factored support (discrete regime / continuous magnitude split) is a continuous-sparse relative of the discrete-codebook escape route catalogued in [[multimodal-futures-in-latent-world-models]]; relatedly, DreamerV2's categorical states are described in related work as structured sparse binary representations
- Evaluated on Wall/PushT/Piecewise via the stable-worldmodel platform and OGBench-Cube; CEM planning interface documented in [[sampling-based-latent-planning]]
- See [[sparse-representations]] for the wiki-level synthesis of sparse/discrete latent geometry

## Limitations & Open Questions

> [!open-question]
> The sparsity advantage is capacity-dependent: it appears only at intermediate predictor complexity on PushT and vanishes when high-capacity DiT predictors saturate the task. Whether the advantage window shifts toward more expressive predictors as dynamics grow harder is the authors' stated hypothesis, left untested.

> [!open-question]
> Exact one-hot linearization suffers the curse of dimensionality ($O(N^{-1/d})$ error); distributed sparse codes are a relaxation whose relationship to the idealized guarantee is empirical, not theoretical.

> [!open-question]
> No sparsity-level ablation exists. Sparsity is controlled by the target distribution parameter $\mu$, but the PushT sweeps (Appendix H.1) fix the default Rectified Laplace ($\mu{=}0$) and grid only over $\lambda_{\text{RDMReg}}$ and learning rate. Whether planning performance degrades when sparsity is pushed beyond the operating point of ~30-65% active coordinates is unknown; only the extreme limit (exact one-hot) is ruled out theoretically. Sweep results also come from a single training seed per cell (3 seeds for CEM evaluation only), with grids pruned sequentially after early failures.

> [!open-question]
> Vanilla sparse supports are motion detectors, not regime detectors: RDMReg constrains per-frame marginals only, so support transitions align with whichever signal varies fastest. Semantically meaningful regime tracking required the added temporal-Jaccard prior.

> [!gap]
> Experiments cover low-dimensional control environments (Wall, PushT, Piecewise, OGBench-Cube); video-scale or high-DoF settings are untested.

## Future Work

Author-stated directions:

- Systematically test whether sparsity's advantage extends to increasingly expressive predictors as underlying dynamics become more complex ("sparse representations as a preferable default")
- Design temporal regularization (beyond TJ) so sparse supports track physically meaningful regime changes in more complex dynamics

## Links

- [arXiv](https://arxiv.org/abs/2608.22764)
- [PDF](https://arxiv.org/pdf/2608.22764v1)
- [Code](https://github.com/YilunKuang/lpworldmodel)
