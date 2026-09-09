---
title: "Enigma"
type: entity
created: 2026-08-25
updated: 2026-08-25
tags:
  - org
  - world-model
  - representation-learning
sources:
  - "[[obsessed-encoder]]"
aliases:
  - "Enigma AI Labs"
  - "Enigma Inc"
---

# Enigma

## Overview

Enigma (Enigma AI Labs, Inc.) is a startup whose stated mission is **solving general-purpose AI for robots** - making robots maximally capable and intuitive to use and interact with. Their research direction is learning **compact representations of the world**: rich enough for almost any task, yet small enough for fast planning, without requiring billions of hours of labeled data.

## Key Work in This Wiki

### [[obsessed-encoder|The Obsessed Encoder]]

Research blog post (July 2026) reporting that [[jepa|JEPA]]-style training misallocates latent capacity toward its most predictable features ([[feature-suppression|feature suppression]]). They reproduce the collapse from scratch in [[dinov3|DINOv3]], [[lejepa|LeJEPA]], and [[leworldmodel|LeWM]], introduce the natural RandGoal PushT variant where the failure appears without synthetic injection, and release full reproduction code.

## Research Direction

- [[jepa|JEPA]]-style self-supervision for robot world models, following [[leworldmodel|LeWM]] and [[lejepa|LeJEPA]] variants
- Efficient encoders: they argue fixing capacity allocation directly could make encoders much more efficient and unlock easier training paradigms
- Open science: code, marked diffs against published recipes, and figure configs released for reproduction

## Connections

- Builds directly on the [[yann-lecun|LeCun]] / [[randall-balestriero|Balestriero]] SIGReg line of work ([[lejepa]], [[leworldmodel]])
- Robotics focus overlaps with this wiki's [[world-models|world model]] cluster ([[dino-wm]], [[sampling-based-latent-planning]])
