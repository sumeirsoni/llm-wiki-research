---
title: "AdaJEPA: An Adaptive Latent World Model"
type: source
created: 2026-07-03
updated: 2026-07-11
arxiv_id: "2606.32026"
authors:
  - "Ying Wang"
  - "Oumayma Bounou"
  - "Yann LeCun"
  - "Mengye Ren"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2606.32026"
tags:
  - jepa
  - world-model
  - vision
  - reinforcement-learning
  - representation-learning
aliases:
  - "AdaJEPA"
  - "Adaptive JEPA"
---

# AdaJEPA: An Adaptive Latent World Model

## Summary

AdaJEPA integrates **test-time adaptation** directly into the Model Predictive Control (MPC) loop of a [[jepa|JEPA]] latent world model. Instead of keeping the world model frozen after offline training, AdaJEPA follows a plan-execute-adapt-replan cycle: after executing the first action chunk, observed transitions serve as self-supervised signals to recalibrate the encoder and predictor before replanning. With as few as one gradient step on final encoder/predictor layers per MPC step (0.01–0.03s overhead), AdaJEPA substantially improves goal-reaching under visual, dynamics, and layout distribution shifts — nearly doubling success on unseen object shapes in PushObj and outperforming frozen models trained with 16× more data in low-data regimes.

## Key Contributions

- **Closed-loop test-time adaptation for JEPA world models**: first integration of self-supervised TTA directly into MPC replanning, not as a separate offline or pre-planning step.
- **Self-supervised adaptation signal**: uses the same latent prediction loss as training — $\mathcal{L}_{ada} = \frac{1}{|\mathcal{B}|}\sum \|f_\theta(\mathcal{E}_s(o_i), \mathcal{E}_a(a_i)) - \text{sg}(\mathcal{E}_s(o_{i+1}))\|_2^2$ — on recent transitions in an online buffer.
- **Lightweight updates**: default adapts only final encoder + predictor layers with one gradient step at the pretraining learning rate; negligible latency per replan.
- **Robust across shifts**: gains on in-distribution tasks (>20% in some cases), shape shifts (nearly 2× on unseen PushObj shapes), visual corruptions (blur, noise, lighting), dynamics shifts (mass, damping), and layout shifts (unseen mazes).
- **Data-efficiency complement**: in low-data regimes (K=1 shape, N=1k trajectories), AdaJEPA reaches 60.8% vs frozen 28.1%, beating a frozen model with 16× more data per shape (43.5%).

## Methodology

### Background: JEPA world model + MPC

Standard setup: sensory encoder $\mathcal{E}_s$, action encoder $\mathcal{E}_a$, predictor $f_\theta$. Given goal observation $o_g$ with latent $z_g = \mathcal{E}_s(o_g)$, MPC optimizes action sequence $a_{t:t+H-1}^*$ minimizing $\|\hat{z}_{t+H} - z_g\|_2^2$ over horizon H via gradient-based or CEM planners.

### AdaJEPA loop

1. **Plan** — optimize actions with current (possibly adapted) model.
2. **Execute** — apply first action $a_t$.
3. **Observe & adapt** — store $(o_t, a_t, o_{t+1})$ in online buffer $\mathcal{B}$ (default: recent-5 sliding window); perform U gradient updates (default U=1) on parameter subset $\Omega$:
   $$\Omega \leftarrow \Omega - \eta \nabla_\Omega \mathcal{L}_{ada}(\mathcal{B})$$
4. **Replan** — use updated model for next MPC step.

Default $\Omega$: final layers of sensory encoder + predictor (`predlast+enclast`). Earlier predictor layers help layout shifts.

### Experimental setup

- **Tasks**: PushT/PushObj (contact-rich manipulation), PointMaze (2D navigation).
- **Shifts**: unseen block shapes, visual corruptions, low/high mass, high damping, unseen maze layouts.
- **Baseline**: pretrained JEPA world model (ResNet encoder, transformer predictor), following temporal straightening methodology; evaluated against DINO-WM-style setups on PushT/PushObj.

## Key Results

- **In-distribution**: >20% success gains on PushObj training shapes and default PushT; PointMaze performance preserved.
- **Shape shifts (PushObj)**: frozen model degrades sharply on unseen shapes; AdaJEPA nearly doubles success; success rate increases over replanning steps while frozen model saturates early.
- **Visual shifts (PushT)**: robust to blur, salt-and-pepper noise, dark lighting; modest gains on some color-shift conditions where color is critical for object distinction.
- **Dynamics shifts (PointMaze)**: consistent gains over strong frozen baseline on low mass and high damping.
- **Layout shifts (PointMaze)**: adapting earlier predictor layers improves over frozen; trajectories closer to shortest path post-adaptation.
- **Latency**: 0.01–0.03s per MPC replan; often fewer total replans needed.
- **Ablations**: robust to which layers are adapted (LoRA also helps); single-step + training LR is stable default; recent-N buffer most stable; works across diverse JEPA implementations (+0.7% to +7.3%).
- **Data scaling**: shape diversity K matters more than trajectories per shape N; AdaJEPA most valuable when training data is limited.

## Connections

- Extends [[jepa|JEPA]] from static representation learning to **adaptive deployment** for [[world-models|world models]] — complements offline training advances ([[leworldmodel|LeWM]], [[sub-jepa|Sub-JEPA]], [[causal-jepa|C-JEPA]]).
- Addresses the frozen-model brittleness that limits [[dino-wm|DINO-WM]]-style latent planners under distribution shift.
- Builds on [[temporal-straightening|Temporal Straightening]] training methodology (same NYU team).
- Conceptually related to test-time training (Sun et al., 2020) but specialized for closed-loop MPC with JEPA latent dynamics.
- Co-authored by [[yann-lecun|Yann LeCun]].
- Contrasts with [[next-latent-prediction|NextLat]]'s training-time belief-state shaping — AdaJEPA adapts **at deployment** rather than changing the pretraining objective.

## Limitations & Open Questions

> [!open-question]
> Can AdaJEPA combine with continual/active learning to expand representational coverage over long deployments, not just recalibrate within pretrained feature space?

> [!open-question]
> Does closed-loop adaptation during MPC remain stable when prediction errors are large enough to cause catastrophic planner failures before the first adaptation step?

> [!gap]
> Effectiveness is bounded by pretrained representation coverage — entirely novel features absent from training may not be fully recoverable via lightweight TTA.

## Future Work

- Combine lightweight MPC-time adaptation with continual and active learning to expand world-model coverage over long deployments, not only recalibrate within pretrained feature space.
- Continue training latent world models during deployment rather than keeping them frozen after offline pretraining.
- Build adaptive world models that continuously calibrate predictions and update representations while acting, enabling more resilient perception and planning under visual, dynamics, and layout shifts.

## Links

- [AlphaXiv](https://www.alphaxiv.org/overview/2606.32026)
- [arXiv](https://arxiv.org/abs/2606.32026)
- [PDF](https://arxiv.org/pdf/2606.32026)
