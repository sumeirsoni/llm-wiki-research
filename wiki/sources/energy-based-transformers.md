---
title: "Energy-Based Transformers are Scalable Learners and Thinkers"
type: source
created: 2026-05-16
updated: 2026-05-16
arxiv_id: "2507.02092"
authors:
  - "Alexi Gladstone"
  - "Ganesh Nanduru"
  - "Md Mofijul Islam"
  - "Peixuan Han"
  - "Hyeonjeong Ha"
  - "Aman Chadha"
  - "Yilun Du"
  - "Heng Ji"
  - "Jundong Li"
  - "Tariq Iqbal"
year: 2025
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2507.02092"
tags:
  - generative-modeling
  - transformer
  - world-model
  - theory
  - representation-learning
aliases:
  - "EBT"
  - "Energy-Based Transformer"
---

# Energy-Based Transformers are Scalable Learners and Thinkers

## Summary

Energy-Based Transformers (EBTs) reframe prediction as iterative optimization over a learned energy function rather than a single feed-forward generation step. The paper argues that this gives transformers intrinsic System 2-style capabilities: dynamic inference-time compute, uncertainty modeling, and self-verification, all learned from unsupervised objectives.

## Key Contributions

- **Prediction as energy minimization**: candidate outputs are refined by gradient descent on an energy function learned by a transformer.
- **Scalable EBM training recipe**: replay buffers, Langevin dynamics, and randomized optimization paths regularize the energy landscape.
- **System 2 inference**: EBTs can think longer or sample multiple candidates and select the lowest-energy output without an external verifier.
- **Cross-modal evidence**: results span text, video, image denoising, and image representation learning.
- **Foundation EBM framing**: the work argues that EBMs can scale as foundation models when implemented with transformer backbones.

## Methodology

An EBT learns an energy function E(x, y-hat) that scores compatibility between an input and candidate output. Inference initializes a candidate prediction and refines it through gradient descent on the energy. Training backpropagates through this optimization path, using standard losses such as cross-entropy or MSE on the final refined prediction.

The paper implements decoder-only and bidirectional EBT variants. To make the learned landscape usable for iterative refinement, training randomizes step sizes and step counts, uses replay buffers, and adds Langevin noise. At inference time, the model can allocate more compute per prediction or run best-of-N self-verification by choosing the candidate with lowest energy.

## Key Results

- Language modeling: EBTs show higher scaling rates than a Transformer++ recipe across data, batch size, depth, parameters, FLOPs, and embedding dimension.
- Inference-time compute improves language modeling performance by up to 29%, while a standard transformer does not benefit from per-token extra compute.
- OOD generalization improves more as distribution shift grows, suggesting the energy-based refinement helps outside the training distribution.
- Video prediction: EBTs scale more than 33% faster than Transformer++ on Something-Something V2 next-frame prediction.
- Image denoising: EBTs outperform DiTs with about 99% fewer forward passes and learn much stronger linear-probe image representations.

## Connections

- Complements [[autoregressive-language-models-are-secretly-energy-based-models|Autoregressive Language Models are Secretly Energy-Based Models]], which gives a theory-level bridge between ARMs and EBMs.
- Relates to [[normalizing-trajectory-models|Normalizing Trajectory Models]] as another attempt to replace simple Gaussian denoising transitions with richer probabilistic structure.
- Relevant to [[world-models|world models]] because energy minimization can support planning by optimizing candidate future states or actions.
- Touches the wiki's representation theme: the image experiments suggest learned verifiers can produce stronger representations than diffusion-only training.

## Limitations & Open Questions

> [!open-question]
> The largest reported models are still below frontier LLM scale. Do the observed EBT learning and thinking scaling laws survive at hundreds of billions of parameters?

> [!open-question]
> How should multimodal or highly multimodal distributions be handled when a smooth convex local energy landscape is too restrictive?

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2507.02092)
- [arXiv](https://arxiv.org/abs/2507.02092)
