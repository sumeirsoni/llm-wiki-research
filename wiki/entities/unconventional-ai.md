---
title: "Unconventional AI"
type: entity
created: 2026-06-30
updated: 2026-06-30
tags:
  - org
sources:
  - "[[un-0-coupled-oscillators]]"
aliases:
  - "unconv.ai"
  - "Unconv AI"
---

# Unconventional AI

## Overview

Unconventional AI (unconv.ai) is a startup building AI systems on **physical and unconventional computing substrates** — aiming for ~1000× lower energy consumption than conventional digital accelerators at iso-quality inference. Founded by Naveen Rao (former Databricks AI chief), the company researches dynamical systems, analog circuits, and oscillator-based architectures as alternatives to GPU matrix multiplication.

## Key Work in This Wiki

### [[un-0-coupled-oscillators|Un-0]]

First public model release (June 2026): a class-conditional image generator powered by simulated coupled Kuramoto oscillators. Open-sourced weights, training scripts, and ablation code on [GitHub](https://github.com/unconv-ai/Un-0).

- FID 6.74 on ImageNet 64×64 (322M parameters, 16k oscillators)
- Validates that generative AI workloads can be mapped to physical dynamical systems at scale
- Positions oscillator dynamics as mappable to CMOS analog hardware

## Research Direction

Unconventional AI situates itself within a growing community exploring physics-based AI:

- Neuromorphic and analog computing
- Thermodynamic and optical generative models
- Reservoir computing and Hamiltonian/Liquid networks
- Kuramoto-based neural architectures

The near-term strategy: prove capability in software simulation of target hardware; long-term goal: deploy on custom oscillator-fabric chips.

## Connections

- Un-0 training uses **drifting loss** with DINOv2 — connecting to the representation-alignment theme seen in [[repa|REPA]], though applied to a non-diffusion backbone.
- Evaluated on [[imagenet|ImageNet]] 64×64 and CIFAR-10 generation benchmarks.
