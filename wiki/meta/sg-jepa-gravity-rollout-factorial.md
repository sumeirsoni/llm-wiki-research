---
title: "SG-JEPA gravity and rollout factorial"
type: meta
created: 2026-09-13
updated: 2026-09-17
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

Train each cell once with world-model seed `42`. Fit five independent probes
per trained checkpoint with probe seeds `42`, `43`, `44`, `45`, and `46`, and
run the matching five evaluations. The probe and evaluation seeds measure
downstream fitting variability; they are not additional training replicates.

The constant cells receive the constant value during both training and
evaluation. They do not receive true gravity at test time. This keeps the
hidden condition from becoming an input-distribution shift.

## Measures

Use the existing Square state probe and evaluate predicted physical state at
horizons 1, 3, 5, 9, 20, 32, and 44. The completed run reports ground-truth
probe baselines and free-rollout error. It does not yet report teacher-forced
model predictions.

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
It adds the constant-gravity condition, four YAML configs, a four-condition
world-model array with one training seed, five-seed probe and evaluation
arrays, and seed-aware checkpoint validation.

Use the [UMD Nexus CML compute reference](compute-cluster) for the SSH host,
storage paths, and Slurm links. Do not store the cluster password or Duo
details in the repository.

The completed run used B300 for all four cells. The `correct_onestep`
checkpoint with world-model seed `42` was restored and reused. The other three
cells trained with world-model seed `42`. Each cell has five probe seeds and
five evaluation seeds.

The authenticated Nexus terminal confirmed that the initial submissions were
rejected by `cml-default`, because that QoS allows only 4 CPUs per job. The
Slurm scripts now request `cml-high_long`, which is available in the
`cml-furongh` association. Copy the refreshed `upstream.patch` to the cluster,
apply it to the public SG-JEPA checkout, and submit each resource-specific
world-model job with its matching probe and evaluation arrays chained by Slurm
dependencies.

## Result

The results support a strong interaction between gravity conditioning and
rollout training. Gravity conditioning alone does not improve the one-step
cell. At horizon 20, adding rollout training reduces normalized target MSE by
69% and position error by 73% with correct gravity, but only by 6% and 4% with
constant gravity. The full writeup, result table, limits, and follow-up tests
are in [the experiment README](../../experiments/sg-jepa-gravity-rollout-factorial/README.md).
