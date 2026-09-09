---
title: "Best Practice Critic Optimization"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2608.23566"
authors:
  - "Penghui Qi"
  - "Xiangxin Zhou"
  - "Wee Sun Lee"
year: 2026
venue: "arXiv preprint (cs.LG)"
pdf_path: "https://arxiv.org/pdf/2608.23566v2"
code_url: "https://github.com/QPHutu/golden_critic"
tags:
  - language
  - reinforcement-learning
  - optimization
  - theory
aliases:
  - "BPCO"
  - "Best Practice Critic"
---

# Best Practice Critic Optimization

## Summary

Best Practice Critic Optimization (BPCO) revisits the claim that group-based reinforcement learning is the reliable default for reasoning language models because critic-based methods are unstable. It assembles a single-rollout actor-critic recipe from six choices: Divergence Proximal Policy Optimization (DPPO), reward-range-bounded values, unbiased Monte Carlo critic targets, unnormalized policy advantages, training-only privileged information when available, and length-adaptive generalized advantage estimation. On mathematical reasoning and rubric-based rewards, BPCO consistently improves a strong critic baseline and matches or exceeds a 16-response group baseline while sampling one response per prompt. The work frames critic quality as a recipe-design problem rather than an inherent weakness of value-based LLM reinforcement learning.

## Key Contributions

- **Controlled critic recipe**: isolates the effects of the policy objective, value parameterization, critic target, advantage scaling, privileged inputs, and response-length handling.
- **Bounded value prediction**: constrains the critic to the known reward range instead of allowing an unconstrained linear head to extrapolate.
- **Unbiased critic supervision**: uses the observed terminal outcome as the critic target while retaining a lower-variance policy estimator when useful.
- **Raw advantages**: removes batch-wise advantage normalization so small residual signals can decay naturally near convergence.
- **Length-adaptive GAE**: sets $\lambda_{\pi}(L)=1-\frac{1}{\alpha L}$ so the terminal reward receives a roughly length-invariant weight.
- **Privileged critic inputs**: optionally exposes reference answers, official solutions, or rubrics to the training-only critic while leaving policy inputs unchanged.

## Methodology

The work starts with a controlled sanity test on 1,460 solvable mathematical problems using DeepSeek-R1-Distill-Qwen-1.5B. Each iteration uses 1,024 trajectories and four minibatches. The recipe is built incrementally from PPO, standard GAE, and a bootstrapped critic target.

The first correction replaces PPO with DPPO, which clips sampled-token probability changes in absolute probability rather than applying one common ratio threshold. The critic then uses a scaled arctangent to map values into the known reward interval. For outcome-only rewards, the critic target uses $\lambda_V=1$, making it the observed Monte Carlo reward even when the policy uses $\lambda_{\pi}<1$. The policy keeps raw advantages rather than normalizing them across a batch. Finally, length-adaptive GAE uses

$$
\lambda_{\pi}(L)=1-\frac{1}{\alpha L},
$$

with $\alpha=0.4$ providing the best reported tradeoff in the sanity study.

Broader evaluation covers the approximately 40.3K-problem DeepScaleR dataset, Qwen3-30B-A3B-Base and Qwen3-30B-A3B on DAPO-Math-17K, and Qwen3-4B-Base on OpenRubrics with a Qwen3-4B-Instruct-2507 judge. Group baselines use 16 responses per prompt; critic methods use one response per prompt with trajectory-matched total sampling.

## Key Results

- PPO collapses in the small sanity test, while DPPO is stable at $\lambda=1$; DPPO becomes unstable again at $\lambda=0.99$ until the critic target and value parameterization are repaired.
- Bounding values to the reward range and using Monte Carlo critic targets improve training stability and held-out AIME 2025 avg@32. Explained variance against a bootstrapped target can look high even when the critic is inaccurate because the target contains the old critic.
- Removing batch advantage normalization prevents small late-stage advantages from being rescaled into a large noisy update and reduces overfitting in the controlled test.
- Privileged reference answers or official solutions accelerate critic learning and improve explained variance, but can cause earlier validation decline in small-data settings. Privileged rubrics do not improve the final reward on the relatively simple OpenRubrics task despite improving critic fit.
- On DeepScaleR, BPCO variants consistently outperform the critic and group baselines in the reported training and validation curves.
- On Qwen3-30B-A3B, the critic baseline stops improving AIME 2025 accuracy after roughly 100 steps, while BPCO continues improving and performs better than the group baseline. On the Base variant, BPCO is comparable to the group method.
- Under rubric-based rewards, BPCO learns faster than both baselines; the group baseline eventually reaches comparable performance.

## Connections

- [[critic-based-llm-rl]] organizes BPCO's design space around critic targets, bounded values, advantage estimators, and training-only information.
- [[on-policy-distillation]] provides a nearby but distinct student-rollout family: OPD uses teacher-derived token supervision, whereas BPCO estimates token advantages with a learned critic and outcome rewards.
- [[opsa]] offers a teacher-free alternative that suppresses low-probability student tokens without a critic or reward model. BPCO instead adds a critic to recover dense credit from one rollout.
- [[layer-contribution-rl]] and [[is-one-layer-enough-rl-training]] study where RL updates are absorbed by the Transformer, while BPCO studies how a critic supplies the update signal.
- [[learning-beyond-teacher]] and [[beta-opsd]] show that reference anchoring and reward scaling change output-space post-training objectives; BPCO changes the advantage-estimation interface.

## Limitations & Open Questions

- Evidence is limited to mathematical and rubric rewards.
- BPCO assumes a known reward range. Unknown or unbounded rewards require an additional range-estimation or normalization design.
- Privileged variants need evaluator information such as a reference answer, official solution, or rubric, and may overfit when the training set is small.
- Critic training adds computation and memory that are not fully represented by trajectory-matched comparisons.
- The reported results do not establish whether BPCO remains preferable for general agentic rewards, sparse delayed rewards, or non-language control.

> [!open-question]
> Can a critic remain stable when the reward range is learned, the evaluator is noisy, or the reward depends on long-horizon tool interactions rather than a terminal mathematical answer?

## Future Work

- Extend the recipe to broader agentic, tool-use, and non-verifiable reward settings.
- Report wall-clock and total-memory comparisons that include critic training and inference.
- Study adaptive reward-range estimation and critic architectures for heterogeneous or unbounded rewards.
- Compare privileged critic inputs against learned evaluator representations and other forms of training-only information.

## Links

- [arXiv](https://arxiv.org/abs/2608.23566v2)
- [HTML](https://arxiv.org/html/2608.23566v2)
- [PDF](https://arxiv.org/pdf/2608.23566v2)
- [Code](https://github.com/QPHutu/golden_critic)
