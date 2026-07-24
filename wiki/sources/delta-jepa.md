---
title: "Delta-JEPA: Learning Action-Sensitive World Models via Latent Difference Decoding"
type: source
created: 2026-07-03
updated: 2026-07-11
arxiv_id: "2606.31232"
authors:
  - "Zhenghao Zhang"
  - "Yuanxiang Wang"
  - "Zhenyu Guan"
  - "Yujia Yang"
  - "Bingkang Shi"
  - "Tianyu Zong"
  - "Hongzhu Yi"
  - "Guoqing Chao"
  - "Xingchen Chen"
  - "Tiankun Yang"
  - "Chenxi Bao"
  - "Tao Yu"
  - "Jingjing Zhou"
  - "Jungang Xu"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.31232"
tags:
  - jepa
  - world-model
  - vision
  - reinforcement-learning
  - representation-learning
  - representation-collapse
aliases:
  - "Delta-JEPA"
  - "LDAD"
---

# Delta-JEPA: Learning Action-Sensitive World Models via Latent Difference Decoding

## Summary

Delta-JEPA is an end-to-end, reconstruction-free [[jepa|JEPA]] world model trained with only **latent forward prediction** and **Latent Difference Action Decoding (LDAD)**. Unlike standard inverse dynamics that decode actions from concatenated endpoint embeddings $[z_t, z_{t+1}]$, LDAD reconstructs $a_t$ from the latent displacement $\Delta z_t = z_{t+1} - z_t$. This displacement-level supervision prevents collapse, avoids action-correlated shortcuts in $z_{t+1}$, and encourages **action-sensitive latent transitions** for rollout-based planning. On four visual continuous-control benchmarks (Two-Room, Reacher, Push-T, OGB-Cube), Delta-JEPA achieves the best mean planning success rates among [[leworldmodel|LeWM]], [[sub-jepa|Sub-JEPA]], and PLDM baselines — including **100% on Two-Room** and **79.3% on OGB-Cube** (+15.1 pp over LeWM).

## Key Contributions

- **LDAD**: inverse objective on $\Delta z_t$ rather than $[z_t, z_{t+1}]$ — forces action information into the transition geometry itself.
- **Two-objective training**: $\mathcal{L} = \mathcal{L}_{pred} + \lambda \mathcal{L}_{action}$ only — no pixel reconstruction, SIGReg, VICReg, EMA, or frozen encoders.
- **Multi-step extension**: Transformer decoder with $N$ action queries reconstructs $\{a_t, \ldots, a_{t+N-1}\}$ from $z_{t+N} - z_t$.
- **Displacement ablation**: LDAD beats endpoint-concat decoding on all four tasks (+12.6 pp on Push-T).
- **Action-sensitivity analysis**: action-conditioned predictor responses separate clearly under LDAD; [[leworldmodel|LeWM]] responses overlap near origin.

## Methodology

### Architecture

| Component | Role |
| --- | --- |
| **Encoder** $f_\theta$ | ViT-Tiny (same as LeWM) → $z_t = f_\theta(o_t)$ |
| **Dynamics predictor** $P_\phi$ | 6-layer causal Transformer with AdaLN action conditioning: $\hat{z}_{t+1} = P_\phi(z_t, a_t)$ |
| **LDAD** $D_\Theta$ | 3-layer non-causal Transformer: $\hat{a}_t = D_\Theta(\Delta z_t)$ with $N=5$ learnable action queries |

### Losses

$$\mathcal{L}_{pred} = \|\hat{z}_{t+1} - z_{t+1}\|_2^2, \quad \mathcal{L}_{action} = \|\hat{a}_t - a_t\|_2^2, \quad \mathcal{L} = \mathcal{L}_{pred} + \lambda \mathcal{L}_{action}$$

Default $\lambda = 10$; $\lambda = 0$ collapses (near-zero planning success).

### Why displacement, not concatenation?

When the forward predictor is action-conditioned, $z_{t+1}$ can absorb action-correlated cues that let a concat inverse decoder recover $a_t$ **without modeling the transition**. LDAD sees only $\Delta z_t$, so action recovery must be supported by the change between states — directly regularizing transition geometry for planning rollouts.

## Key Results

### Planning success (%)

| Method | Two-Room | Reacher | Push-T | OGB-Cube |
| --- | --- | --- | --- | --- |
| PLDM | 93.7 | 64.3 | 76.1 | 57.3 |
| [[leworldmodel|LeWM]] | 74.9 | 79.9 | 84.5 | 64.1 |
| [[sub-jepa|Sub-JEPA]] | 90.6 | 81.0 | 63.7 | 62.7 |
| **Delta-JEPA** | **100.0** | **81.3** | **89.1** | **79.3** |

### Ablations

| Variant | Finding |
| --- | --- |
| $\lambda = 0$ | Collapse; negligible planning success |
| Concat $[z_t, z_{t+1}]$ vs $\Delta z_t$ | Displacement wins on all tasks (+4.1 to +12.6 pp) |
| Decode $\Delta$finger / $\Delta$joint vs raw $a_t$ | Raw action best; joint delta comparable |

### Diagnostics

- PCA: latent diversity expands over training (anti-collapse).
- Two-Room trajectories: nearby initial states separate under action-conditioned rollouts (Delta-JEPA); LeWM geometry less organized.
- State-delta probing: $\Delta z_t \to \Delta x_t$ probes achieve $r \approx 0.99$ on Two-Room agent position (vs LeWM $r \approx 0.96$).
- Attention rollout: ViT encoder focuses on agent and manipulated objects without pixel reconstruction.

## Connections

- Same problem as [[sensorimotor-world-models|SMWM]] and [[leworldmodel|LeWM]]: end-to-end JEPA world models need collapse prevention **and** action-sensitive dynamics for planning.
- **vs [[sensorimotor-world-models|SMWM]]**: both use forward + inverse losses; SMWM decodes from $(z_t, z_{t+1})$; Delta-JEPA shows displacement decoding is more effective and avoids endpoint shortcuts (also critiques PLDM's concat formulation).
- **vs [[leworldmodel|LeWM]] / [[sub-jepa|Sub-JEPA]]**: replaces SIGReg/subspace Gaussian regularization with LDAD — simpler objective, stronger action-conditioned predictor responses.
- **vs [[dino-wm|DINO-WM]]**: trains encoder end-to-end from pixels rather than frozen pretrained features.
- Evaluated on same LeWM-style environments: Two-Room, DMC Reacher, Push-T, OGBench-Cube.

## Limitations & Open Questions

> [!open-question]
> Does LDAD's advantage over concat inverse dynamics ([[sensorimotor-world-models|SMWM]]-style) hold under multi-step horizons and distractor-rich environments like SMWM's Dot/Sprite Worlds?

> [!open-question]
> Can LDAD combine with [[sub-jepa|Sub-JEPA]] subspace regularization or [[temporal-straightening|Temporal Straightening]] curvature terms without redundant objectives?

> [!open-question]
> PLDM (VICReg + concat inverse dynamics) is a strong baseline on Two-Room but weak on 3D — does displacement decoding close the gap uniformly or trade off navigation vs manipulation?

## Future Work

- The paper does not spell out explicit next steps beyond its four continuous-control benchmarks; the conclusion frames latent-difference (action-from-Δz) supervision as a general principle for compact, collapse-resistant world models for planning.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2606.31232)
- [arXiv](https://arxiv.org/abs/2606.31232)
- [PDF](https://arxiv.org/pdf/2606.31232)
