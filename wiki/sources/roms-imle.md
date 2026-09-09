---
title: "ROMS-IMLE: A Minimalist Approach to Competitive Single-Step Generative Modelling"
type: source
created: 2026-09-05
updated: 2026-09-05
arxiv_id: "2607.19332"
authors:
  - "Chirag Vashist"
  - "Ke Li"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2607.19332"
project_url: "https://serchirag.github.io/roms-imle/"
tags:
  - generative-modeling
  - single-step-generation
  - flow-matching
  - vision
  - optimization
  - cnn
aliases:
  - "ROMS-IMLE"
  - "Robust Multi-Stage Implicit Maximum Likelihood Estimation"
---

# ROMS-IMLE: A Minimalist Approach to Competitive Single-Step Generative Modelling

## Summary

ROMS-IMLE asks whether the iterative sampling procedure of diffusion and flow-matching models is essential for high-quality generation. It starts from Implicit Maximum Likelihood Estimation (IMLE), a single-step, mode-covering objective, and adds only two training changes: direct supervision at every upsampling stage and a robust Geman-McClure loss for noisy nearest-neighbour matches. For latent-space generation it also adds round-trip rejection at inference time to remove samples poorly represented by the frozen autoencoder. The resulting ConvNeXt-based generator produces one-step samples with competitive FID and especially strong precision and recall on CIFAR-10, CelebA-HQ, and ImageNet 256.

## Key Contributions

- **Testing-centric interpretation of iterative generators**: The paper unrolls a deterministic diffusion or flow-matching sampler into a single compositional network and argues that per-stage supervision may matter more than applying the network repeatedly at test time.
- **Multi-stage IMLE supervision**: Each progressively higher-resolution decoder stage receives a direct loss against a correspondingly downsampled target instead of learning only through the final output.
- **Robust matching loss**: Geman-McClure loss reduces the influence of outlier pairs caused by stochastic nearest-neighbour matching during IMLE training.
- **Round-trip rejection**: In latent-space generation, samples whose decode-encode-decode reconstruction changes substantially are rejected because they lie outside the frozen autoencoder's well-supported region.
- **Competitive one-step generation**: The final model reaches FID 2.56 on ImageNet 256 with one network evaluation, while using 310M parameters and no iterative denoising.

## Methodology

### IMLE with a compositional decoder

IMLE samples a set of latent codes, generates one candidate per code, and matches every training example to its closest candidate. The optimization phase then updates the generator toward the assigned targets. ROMS-IMLE builds the generator as a composition of upsampling blocks, with a mapping MLP followed by a ConvNeXt-style decoder. Inference remains a single forward pass.

### Multi-stage supervision

At each decoder resolution, a lightweight output head produces an intermediate prediction. The real target is downsampled to the same resolution, and the loss is averaged over all stages. This imports the direct intermediate supervision of stochastic-interpolant methods into a one-step generator without introducing a time-indexed sampler or numerical integration.

### Robust optimization of noisy pairings

The nearest candidate for a data point can change between IMLE matching rounds. A poorly matched pair can therefore create a large residual and dominate a squared-loss update even when most matches are good. ROMS-IMLE replaces the squared distance with a sub-quadratic robust loss at every stage and selects Geman-McClure after ablations against Cauchy and Pseudo-Huber losses.

### Latent-space filtering

For ImageNet 256, the generator operates in the latent space of a frozen EQ-VAE. At inference, each generated latent is decoded and then encoded-decoded again. The LPIPS distance between the generated image and this round trip estimates whether the sample is represented reliably by the autoencoder; samples above a fixed threshold are discarded. The reported ImageNet metrics remove roughly 5% of samples through this filter.

## Key Results

- **Oxford Flowers ablation**: FID improves from 62.61 for vanilla IMLE to 31.24 with multi-stage supervision and 13.90 with the full Geman-McClure variant. Precision rises from 0.45 to 0.93, while recall rises from 0.46 to 0.73. The full variant reaches vanilla IMLE's final FID in roughly one fifth of the training epochs.
- **CIFAR-10**: The pixel-space model obtains FID 3.93, precision 0.91, and recall 0.80 at one NFE. The reported precision and recall exceed the listed one-step and 100-step DDIM baselines.
- **CelebA-HQ**: The one-step pixel-space model obtains FID 6.70, precision 0.96, and recall 0.61, giving the strongest precision and recall among the listed baselines while trailing StyleSwin on FID.
- **ImageNet 256**: The latent model reaches FID 4.16 at one NFE, improving to 2.56 with round-trip rejection. It uses 310M parameters, compared with 675M for DiT-XL/2 and SiT-XL/2, and avoids their 250 network evaluations.
- **Novelty check**: A CLIP-space nearest-neighbour comparison on CelebA-HQ is presented as evidence that generated samples are not direct copies of training images.

## Connections

- [[single-step-generative-models]]: ROMS-IMLE is the wiki's clearest example of moving generation depth into training-time structure while retaining one-step inference.
- [[flow-matching|Flow Matching]]: The paper's testing-centric view treats flow-matching stages as a compositional decoder and transfers their direct intermediate supervision to IMLE, but it removes the iterative transport path at inference.
- [[candidate-exploration|Explorative Modeling]]: IMLE also uses a candidate set and hard nearest-neighbour assignment, but its candidates are used to couple generated samples to data during training rather than as an explicit best-of-many objective for every target.
- [[representation-frechet-loss|Representation Fréchet Loss]]: Both pursue competitive one-step generation without relying on long sampling trajectories. FD-loss acts at the distribution level during post-training, whereas ROMS-IMLE changes the generator's per-stage training objective.
- [[normalizing-trajectory-models|Normalizing Trajectory Models]]: NTM enriches each reverse transition to preserve quality in few-step generation; ROMS-IMLE instead removes reverse transitions and strengthens the single compositional map.
- [[drifting-generative-models|Drifting Generative Models]]: Both report fast one-step generation, but DriftWorld learns an attractive-repulsive distribution field for action-conditioned video while ROMS-IMLE uses IMLE matching and a ConvNeXt image decoder.

## Limitations & Open Questions

- The experiments cover image generation on CIFAR-10, CelebA-HQ, and class-conditional ImageNet 256. The paper does not establish that the recipe transfers to text-conditioned, video, audio, or higher-resolution generation.
- IMLE still requires a candidate pool and nearest-neighbour search during training. The appendix uses a sample budget of five generated samples per data point and reports diminishing returns, but the full training-time compute is not compared against every baseline under a common budget.
- The ImageNet headline FID depends on round-trip rejection through a frozen EQ-VAE and reports metrics after removing about 5% of samples. This is a useful quality-control mechanism, but it makes the number a property of the generator-plus-filter system.
- Pixel-space training uses pretrained LPIPS and DINO feature losses in addition to pixel loss, so the final recipe is less bare-bones than the high-level IMLE framing suggests.
- The claim that intermediate supervision is the main ingredient behind the success of iterative stochastic-interpolant models is supported by the testing-centric construction and ablations, but not by a full matched causal comparison between otherwise identical iterative and one-step networks.
- FID, precision, and recall are complementary but imperfect distributional summaries. The paper notes protocol differences across prior work, and several missing baseline precision or recall values are recomputed by the authors.

> [!open-question]
> Can the multi-stage supervision and robust matching recipe scale to text-conditioned or video generators without making the candidate-search and feature-loss costs dominate training?

> [!open-question]
> When does a one-step compositional generator need a richer latent distribution, explicit uncertainty, or controlled iterative refinement to match the coverage of long-horizon samplers?

## Future Work

The paper does not include a dedicated future-work section. Natural next steps implied by its experiments are:

- Test ROMS-IMLE across larger resolutions, stronger conditioning interfaces, and modalities beyond static images.
- Compare the method under matched end-to-end training compute, including the cost of candidate generation, FAISS search, LPIPS or DINO features, and round-trip filtering.
- Separate the contribution of architecture, per-stage supervision, robust loss, and latent filtering across more decoder families than the ConvNeXt-based generator.
- Study adaptive candidate budgets and robust matching strategies that retain IMLE's coverage while reducing nearest-neighbour search cost.
- Replace or jointly train the frozen autoencoder used by round-trip rejection, and calibrate the rejection threshold against perceptual quality and diversity.

## Links

- [arXiv](https://arxiv.org/abs/2607.19332)
- [PDF](https://arxiv.org/pdf/2607.19332)
- [Project Page](https://serchirag.github.io/roms-imle/)
