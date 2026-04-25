---
title: "ELT: Elastic Looped Transformers for Visual Generation"
type: source
created: 2026-04-12
updated: 2026-04-12
arxiv_id: "2604.09168"
authors:
  - "Sahil Goyal"
  - "Swayam Agrawal"
  - "Gautham Govind Anil"
  - "Prateek Jain"
  - "Sujoy Paul"
  - "Aditya Kusupati"
year: 2026
venue: "Google"
pdf_path: "raw/ELT_ Elastic Looped Transformers for Visual Generation.pdf"
tags:
  - transformer
  - generative-modeling
  - self-distillation
  - vision
  - video
  - optimization
aliases:
  - "ELT"
  - "Elastic Looped Transformers"
---

# ELT: Elastic Looped Transformers for Visual Generation

## Summary

ELT introduces a **parameter-efficient** class of visual generative models using recurrent transformer architecture. Instead of deep stacks of unique layers, ELT iteratively applies weight-shared transformer blocks, achieving **4× parameter reduction** while maintaining generation quality. The key innovation is **Intra-Loop Self Distillation (ILSD)**, which enables "Any-Time inference" — dynamically trading off compute vs. quality at test time.

## Key Contributions

- **Looped architecture for generation**: Weight-shared transformer blocks applied iteratively — decouples parameter count from computational depth
- **Intra-Loop Self Distillation (ILSD)**: Student (intermediate loops) distilled from teacher (max loops) in a single training step, ensuring useful outputs at any loop count
- **Any-Time inference**: Single trained model supports dynamic quality-compute tradeoffs without retraining
- **4× parameter reduction**: Competitive FID 2.0 on ImageNet 256×256 with 4× fewer parameters
- **Video generation**: 76M model achieves FVD 72.8 on UCF-101, outperforming 306M MAGVIT-L baseline
- **3.5× throughput gains**: Compact shared parameters fit on-chip, reducing memory transfer bottlenecks

## Methodology

### Looping Mechanism

Let `N` = unique transformer layers per block, `L` = number of loops per sampling step.

- **Standard transformer**: Would need `N × L` unique parameter sets for depth `D = N × L`
- **ELT**: Reuses same block `N` times for `L` loops → same effective depth, 1/L parameters

The transformation: `F_(N,L)(x) = g_Θ(g_Θ(...g_Θ(x)))` with `g_Θ` applied `L` times.

### Intra-Loop Self Distillation (ILSD)

The challenge: standard looped transformers produce poor outputs at intermediate loop counts — only final iteration is optimized.

ILSD solves this via dual-path training:
1. **Teacher path**: Full `L_max` loops → high-fidelity target
2. **Student path**: Randomly sampled `L_int < L_max` → early exit

Combined loss:
```
L_ILSD = L_GT(teacher_output, y) 
       + λ * L_GT(student_output, y) 
       + (1-λ) * L_dist(student_output, stop_grad(teacher_output))
```

Where `λ` decays from 1→0 during training (curriculum: anchor to GT first, then mimic teacher).

Key insight: Student computation is a prerequisite for teacher computation (same forward pass), so training overhead is minimal.

### Integration

Applied to both:
- **Masked Generative Transformers** (MaskGIT): Cross-entropy for distillation
- **Diffusion Transformers** (DiT): MSE for latent distillation

## Key Results

| Model | Params | FID (ImageNet 256) | Notes |
|-------|--------|-------------------|-------|
| MaskGIT-XL | Full | 2.0 | Baseline |
| ELT-XL | **4× fewer** | **2.0** | Matches baseline |
| DiT-32 | 2.1B | 3.43 | Baseline |
| ELT (8N×4L) | 539M | **3.16** | 4× fewer params |
| ELT (16N×2L) | 1.1B | **2.83** | 2× fewer params |

Video (UCF-101):
- ELT 76M: FVD 72.8 (beats MAGVIT-L 306M at FVD 76)
- ELT scaled: FVD 60.8

## Connections

- Related to [[self-distillation]] — ILSD is a form of self-distillation within the same model's loop iterations
- Applicable to diffusion transformers like those improved by [[repa|REPA]] — orthogonal efficiency gains possible
- The "Any-Time inference" concept parallels [[rethinking-jepa|SALT]]'s decoupling of teacher-student, but applied within a single recurrent model
- Addresses the parameter efficiency frontier that [[self-flow|Self-Flow]] and [[repa|REPA]] also target from different angles

> [!insight]
> ELT provides a compute-scaling dimension orthogonal to model depth/width. Combined with representation alignment methods (REPA) or intrinsic representation learning (Self-Flow), this could enable highly efficient yet high-quality generative models.

## Limitations & Open Questions

> [!open-question]
> What is the minimum block size `N` needed for sufficient representational capacity? (1N×32L with 69M params degraded to FID 10.30)

> [!open-question]
> Can ILSD be combined with REPA's representation alignment? Would aligning intermediate loops to external encoders accelerate convergence further?

> [!open-question]
> How does ELT's parameter efficiency compare to Self-Flow's intrinsic representation learning on shared benchmarks?

## Links

- [arXiv](https://arxiv.org/abs/2604.09168)
