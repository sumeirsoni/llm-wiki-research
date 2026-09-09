---
title: "Latent Energy Action Planning with World Models"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2609.03294"
authors:
  - "Phu Pham"
  - "Aniket Bera"
year: 2026
venue: "arXiv preprint (cs.LG)"
pdf_path: "https://arxiv.org/pdf/2609.03294"
tags:
  - world-model
  - jepa
  - robotics
  - reinforcement-learning
  - optimization
aliases:
  - "LEAP"
  - "Latent Energy Action Planning"
---

# Latent Energy Action Planning with World Models

## Summary

Pham and Bera introduce Latent Energy Action Planning (LEAP), a test-time planner that refines complete action horizons through a frozen LeWorldModel (LeWM). It combines LeWM's terminal latent-goal cost with a second energy that checks whether a decoder-predicted terminal state descriptor agrees with the goal. A frozen goal-conditioned action proposal supplies search starts, L-BFGS refines the action sequence through the autoregressive latent rollout, and projection enforces the environment's action range. Across Push-T, OGBench-Cube, Reacher, and TwoRooms, the complete LEAP system reaches 94.8% mean success compared with 77.5% for native LeWM+CEM under a matched 100-trial protocol, while adding 0.08 seconds of planning time per trial.

## Key Contributions

- Treats the full action horizon as a differentiable variable and backpropagates a planning energy through a frozen latent world-model rollout.
- Adds terminal-state descriptor agreement to LeWM's latent goal matching, so a low latent cost must also agree with a decoded physical-state description.
- Uses a frozen goal-conditioned action proposal for initialization, L-BFGS for refinement, and post-optimization projection for admissible controls.
- Provides a matched comparison with native LeWM+CEM across four domains and separates objective, damping, and optimizer effects with paired ablations.
- Identifies a planner-specific exploitation failure: optimization can lower latent cost while moving away from the demonstrated action and the decoded goal state.

## Methodology

LeWM encodes the current observation and goal into frozen latent vectors. Its frozen autoregressive predictor rolls each candidate action sequence forward for a five-transition horizon. LEAP minimizes

$$
E_{\mathrm{total}}(\mathbf{a}) =
C_{\mathrm{latent}}(\mathbf{a}) +
\lambda_s E_{\mathrm{terminal}}(\mathbf{a}),
$$

where the latent term compares the predicted terminal latent with the goal latent, and the terminal term averages decoder-predicted state-descriptor error over the final two predicted states. The main setting uses $\lambda_s=10$. The decoder is a two-hidden-layer MLP with widths 256-256, fitted for 50 epochs on 9,000 offline examples with 1,000 held out. It predicts standardized numerical state descriptors from frozen LeWM embeddings without using success labels.

A separate three-hidden-layer goal-conditioned MLP predicts a normalized five-block action sequence from offline trajectories. The proposal is trained with mean-squared error and used only to initialize the search. Seeded perturbations provide additional local starts. LEAP refines each candidate with L-BFGS, recomputes its energy after projection into the admissible action range, and selects the lowest-energy projected plan. It executes five action blocks, or 25 primitive environment steps, before replanning.

The evaluation uses officially released LeWM checkpoints on Push-T, OGBench-Cube, Reacher, and TwoRooms. Current and goal observations are 25 environment steps apart within the same offline trajectory. The final comparison uses 100 trials per task, a five-transition horizon, and a 50-step interaction budget. Candidate counts are 32 for Push-T, one for OGBench-Cube, and four for Reacher and TwoRooms. Paired 50-trial sweeps choose shared planner settings before the final evaluation.

## Key Results

- Under the matched 100-trial protocol, LEAP reaches 90.0% on Push-T, 100.0% on OGBench-Cube, 89.0% on Reacher, and 100.0% on TwoRooms, for a 94.8% mean. LeWM+CEM reaches 88.0%, 62.0%, 75.0%, and 85.0%, for a 77.5% mean.
- The 50-trial evaluation gives LEAP 96.5% mean success and LeWM+CEM 77.0%. The rankings stay unchanged, and no task-level rate changes by more than four points between protocols.
- LEAP uses 1.28 seconds of planning time per trial versus 1.20 seconds for LeWM+CEM, but averages 21.06 budgeted environment steps versus 26.41. The success improvement is therefore not obtained by adding a longer interaction budget.
- The full two-term energy reaches 96.5% in the paired 50-trial ablation. Latent-goal-only planning reaches 91.0%, while terminal-state-only planning reaches 52.0%. The decoder term helps as a correction signal but cannot replace LeWM's visual latent goal.
- LEAP selects a lower decoder-predicted terminal error than latent-goal-only planning on 89% of paired starts, with a 6.7% task-average reduction in that error.
- Terminal-window damping alone improves latent-goal-only planning from 91.0% to 94.5% at its best tested weight, but combining damping with terminal-state matching reduces the full system mean from 96.5% to 94.0%. The auxiliary terms are not additive under the chosen optimizer.
- A representative Push-T trace shows the latent-only optimizer lowering latent cost below the expert reference while increasing action distance to 11.19 and maximum action magnitude to 2.32 times the expert reference. LEAP's second energy raises the misleading basin and redirects refinement toward cross-representation agreement.

## Connections

- [[leworldmodel]] is the frozen representation and dynamics base. LEAP changes the planner and adds a terminal descriptor readout without retraining LeWM.
- [[sampling-based-latent-planning]] places LEAP on the objective and refinement axis, beside methods that change latent geometry, rollout queries, proposal distributions, or search itself.
- [[leflow]] uses a frozen LeWM predictor to verify rectified-flow latent-path proposals, while LEAP directly differentiates through the frozen rollout.
- [[prism-prior-guided-imagination-sampling|PRISM]] improves the candidate proposal distribution for MPPI; LEAP uses a goal-conditioned proposal as a local-start initializer for gradient refinement.
- [[intact|INTACT]] amortizes inverse control and can bypass candidate search. LEAP retains optimization, but makes its objective more reliable under latent-model exploitation.
- [[viscore]] diagnoses whether a planner stays on-manifold, responds to actions, and avoids unsupported search. LEAP addresses the goal-scoring part of this stack, but its terminal descriptor does not certify offline-data support.
- [[temporal-straightening]] improves latent geometry for gradient planning. LEAP is complementary: it adds a second goal representation to catch cases where latent distance is low for the wrong physical state.

## Limitations & Open Questions

- LEAP inherits LeWM's errors on long-horizon and out-of-distribution rollouts. A second terminal energy does not make the frozen predictor reliable outside its support.
- The method assumes a numerical goal descriptor. The descriptor may be unavailable in uninstrumented environments, and the fitted decoder adds another learned component to the planning stack.
- Post-optimization projection enforces action bounds but does not constrain a plan to the action or latent support represented in offline data.
- The main result compares complete planning systems. The paired ablations isolate the two energy terms and optimizer settings, but they do not isolate every interaction among the proposal, projection, candidate count, and L-BFGS trajectory.
- The decoder is trained from frozen embeddings and offline descriptors without success labels. Its accuracy and calibration under visual shifts are not evaluated as independent planning diagnostics.

> [!open-question]
> Can goal descriptors be replaced with geometry-aware signals inferred directly from goal images, such as object-centric keypoints or dense visual correspondences, without giving up the cross-representation check?

## Future Work

- Replace numerical goal descriptors with geometry-aware representations inferred from goal images.
- Evaluate cross-representation planning under occlusion, visual domain shift, longer horizons, and broader physical tasks.
- Add explicit support or uncertainty checks so low energy cannot be mistaken for an in-distribution rollout certificate.
- Test LEAP with other latent geometries, rollout interfaces, and action proposals to separate planner gains from LeWM-specific behavior.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2609.03294)
- [arXiv](https://arxiv.org/abs/2609.03294)
- [HTML](https://arxiv.org/html/2609.03294)
- [PDF](https://arxiv.org/pdf/2609.03294)
