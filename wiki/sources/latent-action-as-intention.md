---
title: "Latent Action as Intention Enables Efficient Future Imagination for World Action Models"
type: source
created: 2026-09-09
updated: 2026-09-09
arxiv_id: "2608.24882"
authors:
  - "Xiang Li"
  - "Yupeng Zheng"
  - "Songen Gu"
  - "Huailiang Ma"
  - "Feng Yu"
  - "Yuhang Zheng"
  - "Xian Nie"
  - "Shanshuai Yuan"
  - "Yujie Zang"
  - "Weize Li"
  - "Shuai Tian"
  - "Moyang Liu"
  - "Ya-Qin Zhang"
  - "Wenchao Ding"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.24882"
project_url: "https://getterupper.github.io/LAWA"
tags:
  - world-model
  - reinforcement-learning
  - video
  - representation-learning
  - self-supervised-learning
aliases:
  - "Latent-action future imagination"
---

# Latent Action as Intention Enables Efficient Future Imagination for World Action Models

## Summary

Li et al. introduce LAWA, a World Action Model that keeps test-time future imagination in a compact latent-action space. A tokenizer learns discrete transition codes from action-free robot and egocentric video. LAWA then jointly denoises a continuous relaxation of those codes with executable action chunks, while a structured attention mask blocks future-video information from the action expert. At inference, the model drops the future-video branch and retains the latent intention and action branches.

## Key Contributions

- Uses temporally ordered latent actions as future intentions without generating future observations at inference.
- Trains a discrete latent-action tokenizer with next-frame reconstruction and manipulation-mask supervision.
- Expands the tokenizer's data with action-free egocentric video using motion-speed alignment and weighted sampling.
- Couples video, latent-action, and action experts with a structured joint-attention mask.
- Matches the paper's Joint-WAM performance reference at lower latency and outperforms matched Fast-WAM in simulation and real-robot tests.

## Methodology

The tokenizer uses DINOv2 patch features, factorized spatial and temporal attention, frame-to-frame feature differences, spatial compression, and a learnable codebook. A causal forward decoder reconstructs the next observation from the previous observation and the quantized latent action. A second decoder predicts hand or manipulator masks generated automatically with SAM 2. The tokenizer loss combines next-frame L1 loss, perceptual loss, and mask losses. Low-use codebook entries are refreshed during training.

The tokenizer is pretrained on robot and egocentric videos. Per-source frame sampling aligns motion speeds across sources, and weighted rebalancing keeps robot videos at about 20% of expected samples. The policy stage freezes the tokenizer and uses its codebook embeddings as latent-action targets.

LAWA trains three denoising experts for future video latents, latent actions, and executable action chunks. Each branch receives independently corrupted targets and a flow-matching velocity objective. The latent-action branch uses a continuous relaxation of the discrete codebook targets. Latent-action tokens can attend to current observation and latent-action tokens. Action tokens can also attend to the action sequence. The mask blocks future observations from the current observation and action paths.

At inference, LAWA encodes the current observation once, omits the future-video branch, and jointly denoises the latent intentions and action chunks. It does not project the continuous latent states back to the codebook during or after denoising.

## Key results

RoboCasa contains 24 tabletop rearrangement and articulated-object tasks. The full-data setting uses 24,000 trajectories, and the few-shot setting uses 10% of that data. The reported rate averages 50 trials per task.

| Method | Few-shot success | Full-data success |
| --- | ---: | ---: |
| Fast-WAM, matched | 56.0% | 76.3% |
| Joint-WAM, matched | 64.1% | 78.8% |
| LAWA | 65.6% | 80.8% |

On LIBERO-Plus, LAWA reaches 74.4% zero-shot success, compared with 60.0% for matched Fast-WAM and 70.4% for matched Joint-WAM. On one NVIDIA A800, LAWA takes 338.5 milliseconds per action chunk. Joint-WAM takes 593.1 milliseconds, so LAWA is 42.9% faster. Fast-WAM takes 196.5 milliseconds but has lower success.

The latent-action path is functionally used. Adding Gaussian noise to the latent sequence lowers full-data RoboCasa success from 80.8% to 52.2%. Temporal shuffling lowers it to 56.4%. In the component ablation, latent actions raise few-shot and full-data success to 59.7% and 76.3%. Adding egocentric pretraining raises them to 64.8% and 79.3%. Adding the mask loss raises them to 65.6% and 80.8%, while the optical-flow alternative lowers them to 63.5% and 78.6%.

The real-robot study uses a UFACTORY xArm7 with a gripper and three cameras. It evaluates Gear, Battery, Block, and Laboratory tasks over 20 trials per task. At 25%, 50%, and 100% of the 200 demonstrations per task, LAWA reaches average success rates of 40.0%, 56.3%, and 67.5%. Fast-WAM reaches 8.8%, 20.0%, and 33.8% under the same data fractions.

## Connections

- [[lawa|LAWA]] records the model as an entity.
- [[latent-actions|Latent Action Models]] places LAWA beside action-free latent-action pretraining and downstream robot control.
- [[world-action-models|World Action Models]] gives the broader model family and its future-state and action interface.
- [[world-models|World Models]] connects LAWA to efficient future imagination and robot control.
- [[flow-matching|Flow Matching]] covers the continuous denoising objective used for latent actions and executable actions.

## Limitations & Open Questions

The paper does not include a separate limitations section. The matched comparisons use different native branches, objectives, parameter counts, and inference costs, so the results compare complete paradigms rather than one isolated module. The simulation study covers RoboCasa and LIBERO-Plus. The real-world study uses one robot, four tasks, and 20 trials per task.

Without egocentric pretraining, LAWA trails matched Joint-WAM on RoboCasa. This shows that the latent-action interface alone does not guarantee the reported result. The paper also states that code and models will be released, so the current release does not provide the implementation needed for independent reproduction.

> [!open-question]
> Does the latent-intention advantage hold across longer horizons, other embodiments, and tasks with more irreversible contact dynamics?

## Future Work

The paper does not provide a separate future-work list. It motivates testing whether latent-action future imagination scales across robot embodiments, longer manipulation horizons, and larger mixtures of action-free video. These are follow-up questions inferred from the reported scope.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.24882)
- [arXiv](https://arxiv.org/abs/2608.24882)
- [Project page](https://getterupper.github.io/LAWA)
