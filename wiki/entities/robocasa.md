---
title: "RoboCasa"
type: entity
created: 2026-09-09
updated: 2026-09-09
tags:
  - dataset
  - reinforcement-learning
  - world-model
sources:
  - "[[latent-action-as-intention]]"
aliases:
  - "RoboCasa benchmark"
---

# RoboCasa

## Identity

RoboCasa is a simulation benchmark for everyday robot manipulation. The LAWA paper evaluates 24 tabletop rearrangement and articulated-object tasks with 50 trials per task.

## Use in the paper

The full-data protocol uses 24,000 training trajectories, or 1,000 per task. The few-shot protocol uses 10% of those trajectories. LAWA reports 65.6% success in the few-shot setting and 80.8% with full data.
