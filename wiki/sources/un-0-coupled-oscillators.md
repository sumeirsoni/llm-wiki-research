---
title: "Un-0: Generating Images with Coupled Oscillators"
type: source
created: 2026-06-30
updated: 2026-07-11
authors:
  - "Unconventional AI"
year: 2026
venue: "Blog / Model Release"
project_url: "https://unconv.ai/blog/introducing-un-0-generating-images-with-coupled-oscillators/"
code_url: "https://github.com/unconv-ai/Un-0"
tags:
  - generative-modeling
  - vision
  - image-classification
  - theory
aliases:
  - "Un-0"
  - "Un-0 Coupled Oscillators"
---

# Un-0: Generating Images with Coupled Oscillators

## Summary

Un-0 is an open-source class-conditional image generator from [[unconventional-ai|Unconventional AI]] that replaces a conventional neural backbone with a simulated system of coupled Kuramoto oscillators. Random initial phases evolve under learned coupling strengths and natural frequencies; final phases are decoded to pixels by a small conventional upsampling decoder (<13% of parameters). Trained with the drifting loss (Deng et al., 2026) and a DINOv2 feature extractor, Un-0 reaches FID 6.74 on ImageNet 64×64 — comparable to early conventional generators (NCSN, BigGAN, iDDPM) though below later SOTA (EDM, GDD). The release validates that modern generative workloads can be mapped to physical dynamical systems as a step toward ~1000× energy-efficiency gains on analog/CMOS substrates.

## Key Contributions

- **Physics-as-compute image generation**: largest-scale generative model to date built on simulated coupled-oscillator dynamics rather than diffusion, GAN, or flow-matching backbones.
- **Kuramoto backbone**: learnable coupling matrix K and natural frequencies ω replace stacked neural layers; inference is ODE integration from random phase seeds.
- **Class conditioning via oscillator pools**: a smaller conditioning oscillator array couples uni-directionally into the main population, biasing dynamics toward class-specific attractors.
- **Open release**: six pretrained checkpoints (CIFAR-10 and ImageNet 64×64), full training/evaluation/ablation code on GitHub.
- **Interpretability via ablations**: trained dynamics substantially outperform decoder-only and frozen-reservoir baselines; multi-step integration (10 steps) beats single-step linearization.
- **Role factorization hypothesis**: dynamics primarily improve distributional diversity (recall); decoder primarily determines per-sample image quality (precision).

## Methodology

### Inference (5 steps)

1. Sample random initial phases θ_i ∈ [0, 2π) for N main oscillators (the generative seed, analogous to diffusion noise).
2. Activate class-conditioning oscillators coupled into the main pool.
3. Integrate Kuramoto dynamics for fixed time T via explicit Euler.
4. Read out phases at T; convert to (x, y) via sin/cos relative to a reference phase.
5. Reshape to latent grid and decode through 2× upsampling + conv blocks to RGB pixels.

### Dynamics

Main oscillators follow:

$$\dot{\theta}_i = \omega_i + \sum_{j=1}^{N} K_{ij}\,\sin(\theta_j - \theta_i) + \sum_{k=1}^{N_c}\tilde{K}^{(c)}_{ki}\,\sin(\phi_k - \theta_i)$$

Conditioning oscillators evolve with their own Kuramoto couplings C. Trainable parameters: K, ω, class-specific couplings K̃^(c), C, and decoder weights.

Unlike [[flow-matching|flow matching]] or diffusion, the forward pass does not explicitly guide dynamics during training — only initial conditions, coupling, and readout time T are set; the ODE runs freely. This requires a sample-based loss (drifting loss) rather than a per-step denoising objective.

### Training

- **Loss**: drifting loss (Deng et al., 2026) with DINOv2 feature extractor and multiple feature views.
- **Optimizer**: AdamW; explicit Euler integration.
- **Compute**: CIFAR-10 on 1×B200; ImageNet 64×64 on 8×B200. Largest ImageNet model: 640 B200-hours; drifting-loss feature computation is the main bottleneck.

## Key Results

### Model scaling

| Dataset | Model | Oscillators | Params | FID@50k |
| --- | --- | --- | --- | --- |
| CIFAR-10 | Un-0.n4096 | 4096 | 19.43M | 8.76 |
| ImageNet 64×64 | Un-0.n16384 | 16384 | 322.44M | **6.74** |

Smaller checkpoints: CIFAR-10 down to FID 11.01 (n1024); ImageNet 64×64 down to FID 8.41 (n6656).

### Benchmark positioning

- **Competitive with early conventional methods**: NCSN, DCGAN-TTUR, WGAN-GP, BigGAN, iDDPM, CD, TRACT at comparable parameter counts.
- **Below later SOTA**: EDM, GDD on ImageNet 64×64.
- **Pareto frontier for small models** among measured comparison points; scaling slower than conventional frontier at large sizes.

### Ablations (CIFAR-10 and ImageNet 64×64)

- **Decoder only** (noise → decoder, no dynamics): worst FID — decoder cannot map prior noise to data alone.
- **Reservoir** (frozen random K): intermediate improvement; random dynamics provide class-separable features.
- **1-step learned dynamics**: little gain over reservoir on CIFAR-10; linearized dynamics insufficient.
- **10-step learned dynamics**: clear FID improvement; ~3% FID increase when evaluated with more steps or adaptive solvers (robust to integrator choice).

### Dynamics analysis

- **Class separability**: at T=1, PCA of decoder-space coordinates shows clear class clustering; 32 dimensions suffice for 90%+ top-1 on 1000 ImageNet classes.
- **Attractor manifolds**: trajectories show rapid class separation (phase 1) then slower image refinement (phase 2), consistent with class-conditional attractors in rotating decoder space.
- **Precision vs recall over time**: FID drops as dynamics evolve; trained models maintain higher recall (diversity) than decoder-only or reservoir baselines while precision (quality) rises — supporting a dynamics-for-diversity / decoder-for-quality factorization.

## Connections

- Implements [[coupled-oscillators|coupled oscillator]] dynamics as a generative compute substrate — distinct from [[flow-matching|flow matching]] and diffusion, which explicitly supervise intermediate trajectory steps.
- Attractor behavior connects to [[iterative-refinement|iterative refinement]] and [[attractor-models|attractor models]], but Un-0 uses continuous ODE flow rather than discrete fixed-point iteration in embedding space.
- Trained with **drifting loss** (Deng et al., 2026) — a distribution-matching objective in representation space using DINOv2, paralleling [[repa|REPA]]'s use of frozen visual encoders for generative training but without a diffusion backbone.
- Evaluated on [[imagenet|ImageNet]] 64×64 class-conditional generation; also benchmarks on CIFAR-10.
- Part of a broader **physical/unconventional computing** line including neuromorphic systems (Mead, 1990), reservoir computing, Hamiltonian/Liquid networks, Neural Wave Machines, thermodynamic computing, and Kuramoto-based diffusion (Miyato et al., 2025; Song et al., 2025).
- Motivated by neural synchronization hypotheses (Gray et al., 1989; Fries, 2015) for feature binding — oscillators as neuro-inspired computational primitives mappable to CMOS analog circuits.

## Limitations & Open Questions

> [!open-question]
> Can Un-0 close the quality/parameter-efficiency gap with EDM-class conventional generators through better learning algorithms, architectures, or physical primitives?

> [!open-question]
> Does the dynamics/decoder role factorization (diversity vs quality) hold on higher-resolution benchmarks and non-class-conditional generation?

> [!open-question]
> When will oscillator-based hardware prototypes demonstrate the claimed ~1000× energy-efficiency advantage at iso-quality inference?

> [!gap]
> The drifting loss paper (Deng et al., 2026, arXiv:2602.04770) is not yet ingested in the wiki. Un-0's training objective depends on it.

## Future Work

- Scale coupled-oscillator generation beyond ImageNet 64×64 and CIFAR-10 toward higher-resolution class-conditional benchmarks.
- Close the FID gap with state-of-the-art diffusion and flow-matching generators through improved learning algorithms, oscillator architectures, and coupling inductive biases.
- Realize physics-as-compute inference on analog/CMOS hardware substrates to validate the claimed ~1000× energy-efficiency advantage at comparable quality.

## Links

- [Blog post](https://unconv.ai/blog/introducing-un-0-generating-images-with-coupled-oscillators/)
- [GitHub](https://github.com/unconv-ai/Un-0)
- [Unconventional AI](https://unconv.ai)
