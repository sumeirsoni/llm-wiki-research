---
title: "SG-JEPA gravity and rollout factorial"
type: meta
created: 2026-09-13
updated: 2026-09-13
tags:
  - benchmark
  - world-model
  - jepa
  - meta
sources:
  - "[[semigroup-jepa]]"
aliases:
  - "SG-JEPA factorial"
  - "gravity rollout experiment"
---

# SG-JEPA gravity and rollout factorial

## Question

Does SG-JEPA improve because it receives the physical parameter, because it
trains on its own multi-step predictions, or because those changes interact?

## Four cells

Train the same ViT-Tiny encoder and GRU predictor in every cell. Keep the
optimizer, SIGReg coefficient, data split, 20-epoch schedule, and evaluation
cohort fixed.

| Cell | Gravity input | World-model loss |
| --- | --- | --- |
| `correct_onestep` | Correct normalized episode gravity | One-step teacher-forced |
| `correct_rollout` | Correct normalized episode gravity | Five-step autoregressive rollout |
| `constant_onestep` | Constant normalized mean, `0` | One-step teacher-forced |
| `constant_rollout` | Constant normalized mean, `0` | Five-step autoregressive rollout |

Run each cell with seeds `42`, `43`, `44`, `45`, and `46`.

The constant cells receive the constant value during both training and
evaluation. They do not receive true gravity at test time. This keeps the
hidden condition from becoming an input-distribution shift.

## Measures

Use the existing Square state probe and evaluate predicted physical state at
horizons 1, 3, 5, 9, 20, 32, and 44. Report teacher-forced error, free-rollout
error, and the difference between them for each held-out gravity value.

Estimate the rollout effect with:

```text
correct_rollout - correct_onestep
constant_rollout - constant_onestep
```

Estimate the grounding effect with:

```text
correct_onestep - constant_onestep
correct_rollout - constant_rollout
```

Estimate the interaction with:

```text
(correct_rollout - correct_onestep)
- (constant_rollout - constant_onestep)
```

## Cluster bundle

The patch for the upstream SG-JEPA checkout is [upstream.patch](../../experiments/sg-jepa-gravity-rollout-factorial/upstream.patch).
It adds the constant-gravity condition, four YAML configs, a five-seed Slurm
array, probe and evaluation arrays, and seed-aware checkpoint validation.

Use the [UMD Nexus CML compute reference](compute-cluster) for the SSH host,
storage paths, and Slurm links. Do not store the cluster password or Duo
details in the repository.

The bundle is prepared locally. Submission remains pending because the Codex
shell cannot reach the cluster host and the available terminal app cannot be
controlled through the desktop safety boundary. Authenticate from a local
terminal on the UMD network, copy `upstream.patch` to the cluster, apply it to
the public SG-JEPA checkout, and submit the four jobs in the bundle's README.
