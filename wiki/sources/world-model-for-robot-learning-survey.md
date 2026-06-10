---
title: "World Model for Robot Learning: A Comprehensive Survey"
type: source
created: 2026-05-16
updated: 2026-05-16
arxiv_id: "2605.00080v1"
authors:
  - "Bohan Hou"
  - "Gen Li"
  - "Jindou Jia"
  - "Tuo An"
  - "Xinying Guo"
  - "Sicong Leng"
  - "Jianfei Yang"
  - "Haoran Geng"
  - "Pieter Abbeel"
  - "Yanjie Ze"
  - "Jiajun Wu"
  - "Tatsuya Harada"
  - "Philip Torr"
  - "Oier Mees"
  - "Marc Pollefeys"
  - "Zhuang Liu"
  - "Yilun Du"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2605.00080v1"
tags:
  - world-model
  - robotics
  - survey
  - reinforcement-learning
aliases:
  - "World Model for Robot Learning Survey"
---

# World Model for Robot Learning: A Comprehensive Survey

## Summary

World Model for Robot Learning is a robotics-centered survey of predictive models that capture how environments evolve under robot actions. It organizes world models by their role in policy learning, simulation/evaluation, robotic video generation, navigation, and autonomous driving, emphasizing that a world model is useful only insofar as its predictions help action.

## Key Contributions

- **Robotics-centered definition**: world models are predictive agent-environment dynamics models supporting planning, policy learning, simulation, evaluation, and data generation.
- **Policy-coupling taxonomy**: covers inverse-dynamics pipelines, unified world-model policies, MoE/MoT designs, VLA-integrated models, and latent-space world models.
- **Simulator role**: surveys use of world models for imagined RL rollouts, model-predictive control, ranking, and safety filtering.
- **Robotic video generation view**: traces video models from imagination engines to action-controllable and structure-aware world models.
- **Evaluation guidance**: argues for action faithfulness, physical consistency, controllability, and downstream task utility beyond visual realism.

## Methodology

The paper is a structured literature review. It classifies methods by architecture, functional role, and application domain, then reviews datasets and benchmarks according to embodiment coverage, action supervision, multimodal signals, and evaluation type. The survey includes robot manipulation, navigation, autonomous driving, learned simulators, and video-generation-based world models.

## Key Results

- The field is moving from decoupled predict-then-act pipelines toward tighter policy/world-model integration.
- World models are increasingly used as simulators and evaluators, not just auxiliary predictors.
- Robotic video world models are shifting from visual plausibility toward action-controllable and structure-aware future generation.
- Visual realism is insufficient as a metric; decision reliability and action-conditioned consistency are central.
- Long-horizon reliability, causal conditioning, efficiency, multimodal perception, symbolic structure, and evaluation remain major bottlenecks.

## Connections

- Broadens the existing [[world-models|world models]] page beyond JEPA examples into the full robotics literature.
- Provides survey background for [[reconstruction-or-semantics-robotic-world-models|Reconstruction or Semantics]] and [[world-action-models|World Action Models]].
- Connects to [[causal-jepa|Causal-JEPA]], [[leworldmodel|LeWorldModel]], and [[sub-jepa|Sub-JEPA]] as latent predictive world-model approaches.
- Relevant to [[mae|MAE]], [[jepa|JEPA]], and diffusion/flow papers because robot world models draw from all three representation families.

## Limitations & Open Questions

> [!open-question]
> How should robot-world-model benchmarks weigh open-loop prediction quality against closed-loop task success and safety?

> [!open-question]
> Which world-model representations best support long-horizon planning without compounding drift?

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2605.00080v1)
- [arXiv](https://arxiv.org/abs/2605.00080v1)
