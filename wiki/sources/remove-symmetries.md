---
title: "Remove Symmetries to Control Model Expressivity and Improve Optimization"
type: source
created: 2026-08-21
updated: 2026-08-21
arxiv_id: "2408.15495"
authors:
  - "Liu Ziyin"
  - "Yizhou Xu"
  - "Isaac L. Chuang"
year: 2025
venue: "ICLR 2025 Poster"
pdf_path: "https://arxiv.org/pdf/2408.15495"
code_url: "https://github.com/xu-yz19/syre/"
tags:
  - theory
  - optimization
  - self-supervised-learning
  - representation-learning
aliases:
  - "syre"
  - "Symmetry Removal"
---

# Remove Symmetries to Control Model Expressivity and Improve Optimization

## Summary

The paper proves that reflection symmetries of the loss function (permutation, rescaling, scale, and rotation symmetries all imply them) create low-capacity saddle points that trap neural network training, and proposes `syre`, a one-line fix: train on $\ell_r(\theta, x) = \ell(\theta + \theta_0) + \gamma\|\theta\|^2$ where $\theta_0$ is a fixed random bias drawn once from a Gaussian. Because symmetric solutions are shifted off the small-norm solutions favored by weight decay, all countable reflection symmetries vanish with probability 1; an anisotropic variant $\ell_{ar}(\theta) = \ell(\theta + \theta_0) + \gamma\|\theta\|^2_D$ with distinct diagonal $D$ handles uncountably many (rotation-type) symmetries. The authors present this as a unified account of otherwise separate failure modes: dead neurons, feature/rank collapse in supervised and [[self-supervised-learning|self-supervised]] training, posterior collapse in VAEs, and loss of plasticity in continual learning.

## Key Contributions

- Two mechanisms by which symmetry reduces capacity (Propositions 2-3):
  - **Feature masking**: near a symmetric point $\theta_0$ (with $P\theta_0=0$), the kernel-regime feature map is projected onto $(I-P)$ - features in the symmetric subspace are ignored during learning.
  - **Dimension reduction**: initialized at a symmetric point, GD/SGD stays confined there forever; the model is functionally identical to one with $d - \mathrm{rank}(P)$ parameters throughout training.
- **Theorem 1**: the static-bias loss removes all countable reflection symmetries with probability 1, and creates none.
- **Strength guarantee** (Corollary 1): at every symmetric point, syre exerts a strictly positive escape force $P\nabla_\theta \ell_{ar} = \Omega(\gamma\sigma_0)$; breaking strength degrades only inversely-linearly in the number of symmetries $N$, and only as $1/\log|U|$ for abelian finite groups.
- **Recommended default**: $\sigma_0 = 0.01/\sqrt{d}$ (an order of magnitude below initialization scale), $\sigma_D = 0$; negligible overhead (roughly +2-20% batch time, <10% memory on MLP/ResNet/ViT benchmarks).

## Methodology

The core mechanism is *decoupling*: weight decay prefers small-norm solutions, and symmetric solutions (with $\theta'=0$) always have smaller norm than their reflections, so standard training actively seeks symmetric low-capacity states. A fixed random bias shifts the symmetry planes away from the origin while leaving the objective essentially unchanged (in ridge regression the solution differs only by a $\gamma\theta_0$ term). Crucially, simple translation alone cannot remove symmetries (Proposition 1) - the bias must interact with weight decay. The method is model-agnostic and requires no knowledge of the symmetries being removed, unlike the contemporaneous W-fix heuristic of Lim et al. 2024 (freeze a fraction of weights), which is proved only for explicit permutation symmetry and fails to prevent collapse in the paper's reparametrized regression test.

## Key Results

- **Dead neurons** (reparametrized linear regression): vanilla SGD and W-fix both collapse to low-capacity states; syre stays away throughout.
- **Compatibility**: ResNet18/CIFAR-10 shows no significant difference from vanilla training when $\sigma_0 < 0.2$.
- **Supervised feature collapse**: on rescaled MNIST with an FCN, vanilla training yields low-rank solutions whose accuracy degrades for large weight decay; syre keeps representations full-rank. Appendix ViT/CIFAR-10 experiments show full-rank features, higher accuracy, and wins over Lim et al.'s asymmetric baselines.
- **Posterior collapse** ($\beta$-VAE, Fashion-MNIST): collapse at $\beta = 10$; weight decay + syre applied to the encoder raises encoder-output rank and lowers reconstruction loss.
- **Self-supervised learning** (SimCLR, ResNet-18, CIFAR-100): attributed to the rotation symmetry of the projection head's last weight matrix. Low-rankness of last-layer features drops from 70% to 0%, and last-layer linear-probe accuracy rises from 22.2% to 32.5% ($\sigma_0=0.01$), while penultimate-layer accuracy is unchanged (~46.8%). The authors estimate symmetry-induced capacity reduction explains about half of the last-vs-penultimate-layer gap, and explicitly caution that symmetry is not the only defect of the last-layer representation.
- **Loss of plasticity**: in permuted-MNIST continual learning the vanilla model collapses after roughly the sixth task while syre stays near full rank; in PPO on Slippery-Ant (friction changing every 5M steps), vanilla PPO loses effective rank and return over time while PPO + syre maintains both.

## Connections

- **Complements the [[lejepa|LeJEPA]] / [[visreg|VISReg]] regularizer family on an orthogonal axis**: SIGReg and VISReg constrain the *embedding distribution* to prevent constant-embedding collapse; syre removes *parameter-space* symmetry traps that cause dead dimensions and rank shrinkage. The two target different degenerate solutions, and no published work combines them.
- **Closest SSL evidence is SimCLR**, which has explicit negatives blocking trivial collapse - so its pathology is genuinely symmetry-adjacent rank loss. Non-contrastive methods (BYOL/SimSiam/I-JEPA style), where constant embeddings are a true global optimum of the objective, were not tested; see [[representation-collapse]].
- Relevant to [[ema-vs-non-ema-collapse-prevention|JEPA world-model collapse prevention]] as a potential cheap auxiliary: the continual-learning and PPO results speak directly to long-horizon training with nonstationary targets, where progressive plasticity loss compounds - a known concern for extended [[world-models|world-model]] pretraining.
- Builds on the authors' prior framework (Ziyin 2024, "Symmetry Induces Structure and Constraint of Learning"); related mechanism: gradient-noise induced collapse toward simple subnetworks (Chen et al. 2023).
- Author [[liu-ziyin|Liu Ziyin]] (MIT / NTT Research), with Yizhou Xu (EPFL) and Isaac Chuang (MIT).

## Limitations & Open Questions

> [!open-question]
> Would syre help non-contrastive joint-embedding methods ([[jepa]], BYOL-style)? The paper never tests a setting where constant embeddings minimize the loss, so its guarantees do not reach JEPA-style embedding collapse - only parameter-space rank degradation. Stacking syre with EMA or SIGReg is untested.

> [!open-question]
> The strength result scales inversely with the number of symmetries $N$; whether $\Omega(\gamma\sigma_0)$ escape forces remain meaningful in very large transformers with astronomically many permutation symmetries is unresolved (the authors propose LLM deployment as future work).

> [!note]
> The authors stress symmetry is "neither good nor bad": controlled symmetry can be useful for capacity control and generalization, and a completely symmetry-free model may have undesirably high capacity. Removing all symmetries is not automatically desirable.

- $\sigma_0$ is a real hyperparameter controlling an optimization-vs-symmetry-removal tradeoff; the default $0.01/\sqrt{d}$ is a heuristic starting point.
- Assumption 1 excludes pathological losses (e.g., linear objectives); the removal guarantee needs nonzero bias variance.
- In the SimCLR experiment, closing half the layer gap still leaves the other half unexplained - expressivity alone does not fix defective projections.

## Future Work

Author-stated:

- Deploy syre in large language models, which naturally contain many symmetries.
- Deliberately engineer ("fine-grain") the degree of symmetry in loss functions - introducing desired symmetries and removing undesirable ones - now that removal is practical.

## Links

- [arXiv](https://arxiv.org/abs/2408.15495)
- [Code](https://github.com/xu-yz19/syre/)
