---
title: "Intelligence from Learnable Novelty"
type: source
created: 2026-07-24
updated: 2026-07-24
arxiv_id: "2607.18433"
authors:
  - "Yanbo Zhang"
  - "Michael Levin"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.18433"
code_url: "https://github.com/Zhangyanbo/learnable-novelty"
tags:
  - self-supervised-learning
  - representation-learning
  - reinforcement-learning
  - optimization
  - theory
aliases:
  - "Intelligence from Learnable Novelty"
  - "Learnable Novelty paper"
---

# Intelligence from Learnable Novelty

## Summary

This paper interprets epiplexity, the amount of structure extractable by a computationally bounded observer, as **[[learnable-novelty|learnable novelty]]**. It introduces a cheap, deterministic, differentiable estimator based on a frozen random reservoir and a closed-form ridge readout, then uses the same quantity as a complexity measure, an unsupervised representation objective, and an intrinsic reinforcement-learning reward. Across cellular automata, [[mnist|MNIST]], and ten control tasks, the experiments argue that maximizing learnable rather than total surprise avoids both the noisy-television failure of novelty seeking and the dark-room failure of surprise minimization.

## Key Contributions

- Reframes cumulative surprise as a sum of learnable structure and an unlearnable residual, identifying the learnable component with observer-relative epiplexity.
- Derives a closed-form reservoir estimator whose spectral description length is differentiable with respect to the system producing the observations.
- Shows that the estimator ranks Turing-complete elementary cellular automaton rule 110 highest among all 88 locally unique rules.
- Uses gradient ascent on the estimator to induce traveling, colliding soliton-like structures in neural cellular automata and class-separated image representations without labels.
- Uses online epiplexity increments as an intrinsic PPO reward, improving task return over the task-only baseline in nine of ten environments without the severe collapses seen with a state-magnitude control.

## Methodology

For paired data $(X,Y)$, a fixed random reservoir $\phi$ maps $X$ to standardized features $H$. A ridge regression fits the linear readout

$$
W_\lambda = (\tilde H^\top \tilde H + \lambda I)^{-1}\tilde H^\top \tilde Y.
$$

The score is the spectral description length of the readout,

$$
S_\phi(Y\mid X)=\frac{1}{2}\log_2\det(I+\eta W_\lambda W_\lambda^\top)
=\frac{1}{2}\sum_i\log_2(1+\eta s_i(W_\lambda)^2).
$$

The log-determinant prices independent, high-magnitude readout directions while discounting redundant ones. Because the ridge optimum is closed form, the estimator avoids training a bounded observer inside every scoring step and remains differentiable through $X$ and $Y$. Reservoir architecture is matched to the data geometry, with pre-activation normalization used to keep random features near the edge of chaos.

The paper evaluates the score in four roles:

1. **Complexity measurement:** score 88 symmetry-reduced elementary cellular automata and six continuous-time systems.
2. **Dynamics objective:** train direct and residual neural cellular automata by gradient ascent on future-state epiplexity.
3. **Representation objective:** train a 64-dimensional MLP encoder on [[mnist|MNIST]] solely to maximize $S_\phi(E_\theta(X)\mid X)$.
4. **Exploration reward:** add the online increment $S_{\phi,t}-S_{\phi,t-1}$ to PPO task reward across ten environments.

## Key Results

- **Elementary cellular automata:** rule 110 ranks first over all 88 locally unique rules. Constant-attractor rules score zero, simple periodic rules 1 and 2 score near the bottom, and complex rule 54 outranks chaotic rule 30 under the reference observer. Rule 110's lead is robust across most one-at-a-time estimator variations, but insufficient reservoir receptive field can change the ranking.
- **Continuous dynamics:** chaotic Lorenz, Rossler, and Thomas systems score 46, 25, and 17 bits, above pure rotation, damped spiral, and stable-node controls at 8.4, 8.2, and 6.9 bits.
- **Neural cellular automata:** both direct and residual update variants develop coherent traveling structures in all nine tested seeds. The learned local rule generalizes beyond the training lattice width.
- **Unsupervised MNIST representations:** linear-probe accuracy rises from 0.53 to 0.89 and 5-nearest-neighbor accuracy from 0.66 to 0.89 after 500 steps, although labels are used only for evaluation and visualization. Moderate changes to learning rate, batch size, code dimension, and reservoir depth retain 0.80 to 0.90 linear accuracy.
- **Reinforcement learning:** at 600,000 PPO steps and ten seeds, task plus epiplexity improves mean return on nine of ten tasks. Examples include Acrobot from $-167\pm166$ to $-83\pm2$, MountainCarContinuous from $28\pm43$ to $93\pm1$, Hopper from $1879\pm325$ to $2192\pm270$, PointMaze from $229\pm77$ to $256\pm22$, and LunarLander from $169\pm74$ to $208\pm25$. Walker2d is the sole decrease, from $296\pm45$ to $285\pm41$.
- **Control comparison:** a matched state-magnitude bonus collapses Hopper to $516\pm128$ and LunarLander to $-171\pm35$, while the epiplexity bonus falls at most 4% below task-only return on any environment.

## Connections

- Introduces the central concept summarized in [[learnable-novelty]], connecting minimum description length, epiplexity, novelty search, free-energy minimization, empowerment, and compression progress.
- Extends [[self-supervised-learning]] with a label-free objective based on what a bounded random-feature observer can recover, rather than reconstruction, contrastive pairs, masking, or a teacher network.
- Adds an observer-relative criterion to [[representation-geometry]]: on [[mnist|MNIST]], the representation becomes class-separable when the readout bound is sufficiently selective, but the result is sensitive to estimator regularization and resolution.
- Relates to [[iterative-refinement]] through cellular automata and repeated local dynamics, although the paper optimizes the transition rule rather than using recurrence mainly for inference-time reasoning.
- The intrinsic reward resembles prediction-error curiosity and empowerment, but rewards compressible future structure instead of raw prediction error or merely diverse reachable states.

## Limitations & Open Questions

- The authors state that the frozen reservoir fixes the boundary of what is learnable. Structure outside the reservoir's random-feature and linear-readout capacity is invisible, and the score saturates once that capacity is exhausted.
- The estimator captures shallow structure that is linearly readable from random features. Its rankings and learned representations depend on observer width, receptive field, ridge strength, and resolution.
- The [[mnist|MNIST]] experiment is small-scale, and class separation fails under weak ridge regularization or low spectral resolution. The paper does not establish comparable behavior on richer natural-image datasets.
- Learnable novelty alone is not a task solver. In episodic RL it can reward survival or avoiding terminal goals, as seen on Acrobot, so the reported practical use is primarily as a bonus to an external task reward.
- Most RL environments are finite games. The authors note that the framework's implications for continuing, open-ended environments remain untested.

## Future Work

- The authors propose co-evolving observer and observed system so the boundary of learnable structure moves instead of saturating against a frozen reservoir.
- They identify large language models as a possible substrate because an LLM can act both as a compute-bounded in-context learner and as a sequence generator being observed.
- They suggest making task reward modulate where novelty is found, rather than treating novelty as a small auxiliary bonus to an externally imposed objective.
- They call for evaluation in infinite or continuing games, where avoiding a terminal state is not the dominant route to sustaining learnable novelty.
- More broadly, they frame open-ended growth under jointly improving observers and generators as a central research direction.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2607.18433)
- [arXiv](https://arxiv.org/abs/2607.18433)
- [PDF](https://arxiv.org/pdf/2607.18433)
- [Code and reproduction materials](https://github.com/Zhangyanbo/learnable-novelty)
