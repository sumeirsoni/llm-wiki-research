---
title: "Patch Policy: Efficient Embodied Control via Dense Visual Representations"
type: source
created: 2026-07-25
updated: 2026-07-25
arxiv_id: "2607.18236"
authors:
  - "Gaoyue Zhou"
  - "Zichen Jeff Cui"
  - "Ada Langford"
  - "Bowen Tan"
  - "Yann LeCun"
  - "Lerrel Pinto"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.18236"
code_url: "https://github.com/gaoyuezhou/patch_policy"
project_url: "https://patch-policy.github.io/"
tags:
  - imitation-learning
  - robotics
  - vision
  - representation-learning
  - self-supervised-learning
  - transformer
aliases:
  - "Patch Policy"
  - "PATCH POLICY"
---

# Patch Policy: Efficient Embodied Control via Dense Visual Representations

## Summary

Patch Policy is a lightweight transformer policy interface that directly consumes frozen, pretrained Vision Transformer patch tokens instead of compressing each observation into a CLS token or globally pooled vector. A block-causal attention mask allows bidirectional interaction among patches within each frame while preserving causal attention across time. Across four simulated benchmarks, three real-robot tasks, and additional zero-shot CAP evaluations, dense patch features are most beneficial for precise, spatial, and multi-object manipulation. A compact DINOv2/VQ-BeT variant uses 51.55M total parameters and 10.99 ms inference on an H200, compared with 7.61B parameters and 61.71 ms for OpenVLA-OFT.

## Key Contributions

- **Dense representations for lightweight control**: pretrained ViT patch tokens can be used directly by standard transformer policies without carrying a billion-parameter vision-language model.
- **Block-causal policy attention**: patches attend fully within a frame but only to current and prior frames across time, preserving both spatial integration and temporal causality.
- **Policy-head independence**: the same observation interface improves both VQ-BeT, trained with hybrid classification and regression, and Diffusion Policy, trained with denoising.
- **Frozen encoder transfer**: DINOv2 and WebSSL features transfer strongly to control without encoder fine-tuning, while the relative encoder ranking is broadly stable across policy heads.
- **Controlled compression evidence**: learned spatial downsampling from 256 patches to 64, 16, 4, or 1 sharply reduces Push-T coverage.
- **Efficiency relative to VLAs**: dense pretrained features deliver strong in-domain manipulation without the parameter count and latency of a full vision-language-action backbone.

## Methodology

### Observation trunk

For an image observation, a frozen ViT produces $P \times D$ patch features. A context window of $T$ frames therefore produces a tensor of shape $T \times P \times D$. The design also supports multiview observations and remains compatible with global or state-based inputs by setting $P=1$.

Goal-conditioned behavior cloning supports two forms of conditioning:

- A goal image is encoded with the same backbone and concatenated with observation features, yielding $T \times P \times 2D$ inputs.
- A goal vector $g \in \mathbb{R}^G$ is concatenated to every patch, yielding $T \times P \times (D+G)$ inputs.

### Block-causal policy

The spatiotemporal tensor is flattened into a sequence of length $T \times P$ and receives learned one-dimensional positional embeddings. The attention mask provides:

- full bidirectional attention among all patches from the same frame;
- causal attention between frames, so a token cannot access future observations.

An action head reads a predicted action chunk from the final patch token of each frame. During inference, new patch features enter a rolling context window and the predicted chunk is executed with receding-horizon control.

The paper instantiates the interface with VQ-BeT and Diffusion Policy. Patch Policy does not introduce a new imitation-learning loss, visual pretraining objective, transition model, or imagined rollout. Its main contribution is the interface between dense pretrained visual features and direct action policies.

### Encoders and evaluation

The controlled encoder study freezes five pretrained backbones: DINOv2, DINOv3, WebSSL, V-JEPA 2, and SigLIP 2. It evaluates Push-T, LIBERO Goal, BlockPush, and OGBench Cube, followed by three 7-DoF Franka tasks: Cable Insertion, Pen Collection, and Tool Hanging. Additional CAP experiments test EgoGym pickup/open/close and real Franka pickup of unseen objects.

> [!important]
> The encoder benchmark evaluates **V-JEPA 2**, not [[v-jepa-2-1|V-JEPA 2.1]]. The reported V-JEPA 2 control results should not be attributed to the V-JEPA 2.1 model summarized elsewhere in this wiki.

## Key Results

### Simulation

All four simulation metrics are task-specific: Push-T reports final target coverage, LIBERO Goal reports success rate, and BlockPush/Cube report the mean number of correctly placed objects out of two.

| Representation and policy | Push-T | LIBERO Goal | BlockPush | Cube |
| --- | ---: | ---: | ---: | ---: |
| WebSSL CLS + VQ-BeT | $0.59\pm0.01$ | $0.95\pm0.01$ | $0.77\pm0.08$ | $0.23\pm0.01$ |
| WebSSL Patch + VQ-BeT | $0.68\pm0.03$ | $0.94\pm0.01$ | $1.68\pm0.15$ | $1.68\pm0.03$ |
| WebSSL CLS + Diffusion Policy | $0.68\pm0.02$ | $0.99\pm0.01$ | $0.99\pm0.12$ | $0.21\pm0.03$ |
| WebSSL Patch + Diffusion Policy | $0.80\pm0.01$ | $0.98\pm0.00$ | $1.65\pm0.08$ | $1.73\pm0.02$ |
| OpenVLA-OFT | $0.59\pm0.02$ | $0.95$ | $1.43\pm0.17$ | $1.50\pm0.09$ |

The dense/global gap is largest on BlockPush and Cube, where preserving object locations and relations is essential. WebSSL and DINOv2 rank strongest overall among the tested encoders, while SigLIP 2 is weaker on these spatial control tasks. The paper interprets this as evidence that language-image alignment alone does not guarantee manipulation-relevant local geometry.

### Real-robot manipulation

Each real-robot task uses 20 evaluation trials. Final-stage cumulative success rates are:

| Method | Cable fully inserted | Third pen placed | Tool placed |
| --- | ---: | ---: | ---: |
| DINOv2 Patch + VQ-BeT | **0.70** | **0.85** | **0.90** |
| DINOv2 CLS + VQ-BeT | 0.60 | 0.65 | 0.70 |
| ResNet-18 Patch + ACT | 0.35 | 0.65 | 0.85 |
| DINOv2 + SigLIP Patch + OpenVLA-OFT | 0.30 | 0.60 | 0.65 |

The comparison supports a narrow in-domain claim: on the same task data, a compact policy over frozen dense features can outperform a fine-tuned VLA on precise manipulation. It does not establish superiority for open-world or language-driven control.

### Zero-shot CAP evaluations

- Real Franka pickup of ten unseen objects over 100 trials: Patch Policy reaches **87%**, compared with **79%** for the released global-feature CAP checkpoint.
- EgoGym over 5,000 episodes per evaluation: patch/global scores are **79.50%/75.78%** for pickup, **71.40%/67.88%** for opening, and **92.44%/86.50%** for closing.

### Spatial compression

A learned convolutional compressor reduces DINOv2 spatial tokens before policy learning on Push-T:

| Tokens per frame | Coverage |
| ---: | ---: |
| 256 | **0.69** |
| 64 | 0.52 |
| 16 | 0.53 |
| 4 | 0.51 |
| 1 | 0.48 |

This ablation isolates spatial downsampling, not channel compression. It therefore complements [[temporal-straightening|Temporal Straightening]], which reduces per-token channel width while preserving the spatial grid.

### Attention and efficiency

Block-causal attention matches or outperforms full and token-causal alternatives on most tested policy/task pairs. Token-causal attention is especially poor for Diffusion Policy on Cube because early decoder positions see only a partial frame, while full attention leaks future frames during training.

| Method | Total parameters | Trainable parameters | Inference latency |
| --- | ---: | ---: | ---: |
| Patch Policy VQ-BeT, DINOv2 | 51.55M | 29.49M | 10.99 ms |
| Patch Policy VQ-BeT, WebSSL | 334.00M | 30.34M | 21.43 ms |
| OpenVLA-OFT | 7.61B | 177.90M | 61.71 ms |
| ACT | 83.85M | 83.85M | 8.63 ms |

Latency is measured for one forward pass on a single NVIDIA H200 and excludes temporal speedups from action chunking. Diffusion Policy remains much slower because iterative denoising, rather than patch encoding, dominates its roughly 446 ms latency.

Training costs reported by the authors are 6.5 GPU-hours for Patch Policy with DINOv2, 16 GPU-hours for OpenVLA-OFT, and 24 GPU-hours for ACT.

The abstract reports a 40% relative improvement over global-pooled policies and an 18% improvement over OpenVLA-OFT. These are author-reported aggregate claims; the paper does not provide an explicit averaging formula across the heterogeneous task metrics, so the task-level results above are more independently interpretable.

## Connections

- Extends [[dense-visual-representations]] from dense prediction and latent planning into direct, reactive robot control, providing downstream evidence for [[self-supervised-learning|self-supervised visual features]] used without encoder fine-tuning.
- Adds spatial token granularity to [[representation-geometry]] as a functional control property distinct from latent trajectory curvature.
- Shares a research line with [[dino-wm|DINO-WM]]: both use frozen pretrained patch features and find that global visual summaries lose manipulation-relevant spatial information. DINO-WM learns latent dynamics for planning, whereas Patch Policy directly predicts actions.
- Reinforces [[prism-prior-guided-imagination-sampling|PRISM]]'s CLS-token ablation: a better planner or policy head cannot reconstruct task state that global pooling removed from the observation.
- Complements [[temporal-straightening|Temporal Straightening]] by separating two bottlenecks: retaining local spatial tokens and shaping latent trajectory geometry for planning.
- Converges with [[v-jepa-2-1|V-JEPA 2.1]] and [[levljepa|LeVLJEPA]] on the downstream value of patch-token quality, while using different pretrained encoders and control tasks.
- Provides a lightweight direct-policy boundary case for [[robot-world-model-architectures]]: dense visual control does not require either an explicit world model or a billion-parameter VLA.
- Equal-contribution first and corresponding author [[gaoyue-zhou|Gaoyue Zhou]] also led DINO-WM and co-authored Temporal Straightening; [[yann-lecun|Yann LeCun]] is also a co-author.

## Limitations & Open Questions

### Author-stated limitations

- All evaluated visual backbones are frozen, so the study does not test whether specialized domains benefit from end-to-end encoder adaptation.
- Dense patches lengthen the policy sequence and increase training and inference cost relative to global representations.
- The method is evaluated through behavior cloning from static expert demonstrations; the authors describe reinforcement learning as a route beyond this performance ceiling.

### Evaluation caveats

- The simulation suite uses heterogeneous metrics, so cross-task averages require a stated normalization and weighting scheme that the paper does not provide.
- Simulation reports select the best-performing checkpoint for each run.
- The LIBERO Goal OpenVLA-OFT value is taken from that baseline's original manuscript rather than rerun in the same implementation.
- ACT is modified to remove proprioception and add matched goal conditioning, improving comparability but differing from its standard setup.
- The three main real-robot comparisons use only 20 trials per task.
- The latency numbers are specific to one NVIDIA H200 and do not directly predict deployment latency on edge hardware.
- The spatial-compression study covers only Push-T; it does not establish a universal minimum token resolution.
- The public GitHub repository currently contains a README and media assets but states that code will be released soon. The paper also promises open-sourced data, but no data release is currently linked.

> [!open-question]
> Can adaptive token selection retain contact-relevant local detail while reducing the sequence-length cost of dense control?

## Future Work

- Explore end-to-end visual-backbone fine-tuning for specialized visual domains.
- Apply efficient attention implementations such as FlashAttention to reduce dense-token training and inference cost.
- Extend the patch-based architecture from behavior cloning to reinforcement learning to move beyond the ceiling of static demonstrations.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2607.18236)
- [arXiv](https://arxiv.org/abs/2607.18236)
- [PDF](https://arxiv.org/pdf/2607.18236)
- [Project page](https://patch-policy.github.io/)
- [GitHub repository](https://github.com/gaoyuezhou/patch_policy) - code release pending
