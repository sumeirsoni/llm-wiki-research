---
title: "Recirculation"
type: source
created: 2026-08-20
updated: 2026-08-25
arxiv_id: "2608.17981"
authors:
  - "Michael C. Mozer"
  - "Shoaib Ahmed Siddiqui"
  - "Danny Sawyer"
  - "Sunny Sanyal"
  - "Rosanne Liu"
year: 2026
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2608.17981v1"
tags:
  - transformer
  - language
  - recurrent-model
  - inference-time-compute
  - representation-learning
aliases:
  - "Adaptive Recirculation"
  - "Inference-Time Recirculation"
---

# Recirculation

## Summary

Recirculation retrofits a deep-to-shallow recurrent edge into an already-trained Transformer at inference time. A residual-stream state from a deep source layer at one token position is normalized and mixed into a shallower destination layer for the following position, allowing a belief formed late in the stack to influence subsequent processing. Fixed recirculation requires no training; adaptive recirculation freezes the base model and learns token-conditioned, feature-wise mixing coefficients. On Gemma 3, the strongest adaptive variant reduces mean perplexity by 23.0% across nine evaluation datasets, compared with 8.5% for fixed recirculation and 21.6% for full-model fine-tuning, but gains are architecture- and task-sensitive.

## Key Contributions

- **Post-hoc latent recurrence**: adds deep-to-shallow feedback to an off-the-shelf feedforward Transformer without retraining its original weights.
- **Low-latency autoregressive schedule**: after warm-up, the first pass for the current token and recirculated pass for the preceding token can execute concurrently on parallel hardware.
- **Adaptive feature-wise mixing**: a small MLP predicts token-dependent coefficient vectors while the base model remains frozen.
- **Broad Gemma evaluation**: tests perplexity, instruction following, contextualization, single-token benchmarks, and GSM8K across Gemma 3 1B, 4B, and 12B.
- **Mechanistic controls**: studies layer paths, coefficient strength, normalization, token lag, part of speech, temperature, depth looping, and transfer across model families.

## Methodology

Let $\mathbf z_{i,j,l}$ be the residual-stream activation at unrolled update $i$, token position $j$, and layer $l$. For source layer $s$, shallower destination layer $d$, and token $t$, fixed recirculation applies

$$
\mathbf z_{t+1,t,d}=\alpha f(\mathbf z_{t,t,s}\mid d,t)+\beta\mathbf z_{t,t,d}.
$$

The basic convex form sets $\beta=1-\alpha$; the effective Gemma 3 4B and 12B settings instead use $\beta=1$. The main normalization matches source and destination L2 norms:

$$
f(\mathbf z\mid d,t)=\frac{\|\mathbf z_{t,t,d}\|_2}{\|\mathbf z\|_2}\mathbf z.
$$

For Gemma 3 1B, where early positions are harmed, the coefficient is ramped as $\alpha_t=\min(t/10,1)\alpha$. Selected source/destination pairs are $(11,4)$ for 1B, $(18,9)$ for 4B, and $(35,16)$ for 12B.

Adaptive recirculation uses token-conditioned vectors:

$$
\mathbf z_{t+1,t,d}=\boldsymbol\alpha\circ f(\mathbf z_{t,t,s})+\boldsymbol\beta\circ\mathbf z_{t,t,d}.
$$

A two-hidden-layer GELU MLP receives concatenated source and destination states and predicts $\boldsymbol\alpha,\boldsymbol\beta\in[0,1]$. It is initialized at $\alpha=0.1,\beta=0.9$ and trained for 100 AdamW steps on 250 documents each from PG-19, C4, and arXiv, using 1,024-token windows and batch size 32.

The main models are Gemma 3 PT and IT at 1B, 4B, and 12B. Perplexity datasets are arXiv, BigPatent, BillSum, BookSum/books, C4/WebTextLike, GovReport, LAMBADA, Newsroom, PG-19, and PubMed. Downstream evaluations include MMLU, ARC Easy and Challenge, PiQA, BoolQ, WinoGrande, HellaSwag, LAMBADA, GSM8K, a custom instruction-following task, and Racing Thoughts contextualization. Comparators include the unmodified model, softmax-temperature tuning, training-free depth looping, adaptive scalar/vector variants, and full-model fine-tuning.

## Key Results

- **Fixed recirculation, Table 1**: nine of ten language-modeling datasets improve at all three Gemma scales. The largest reductions are 15.95% for 1B, 15.95% for 4B, and 35.40% for 12B. LAMBADA worsens from 35.62 to 35.88 for 1B and from 25.47 to 26.19 for 12B.
- **Representative Table 1 results**: PG-19 improves from 22.27 to 19.06 for 1B, 19.49 to 16.43 for 4B, and 52.86 to 34.15 for 12B. GovReport improves from 27.59 to 19.11 for 12B. BookSum/books improves from 77.02 to 51.67 for 12B.
- **Adaptive recirculation, Figure 13**: on Gemma 3 1B, mean perplexity reduction across nine datasets is 23.0% for learned token-conditional vectors, versus 8.5% for fixed recirculation and 21.6% for full-model fine-tuning. Adaptive recirculation beats fixed recirculation on all nine datasets.
- **GSM8K, Figure 12**: adaptive recirculation reduces error by 8.8% at pass@1 and 20.9% at pass@128. The body reports error reduction; the abstract's wording of a 21% accuracy increase should not be treated as the identical metric. Absolute plotted accuracies are not stated in the text.
- **Single-token tasks, Table 2**: fixed recirculation improves six of eight tasks, but usually by less than one point. Examples include MMLU 57.90 to 58.28, ARC Challenge 54.44 to 54.86, and PiQA 79.98 to 80.52. Adaptive transfer can degrade sharply when its adaptation distribution is mismatched.
- **Instruction following, Figure 10**: using perplexity-selected paths, Gemma 3 4B IT error falls by approximately 25% and 12B IT error by approximately 75%; exact bar values are not supplied in prose.
- **Contextualization, Figure 11**: 1B and 4B improve on two of three categories, while 12B worsens on two and remains near ceiling on the third, showing that benefit is not monotonic with scale.
- **Architecture transfer, Figure 7**: Gemma 3 gains approximately 5% in the displayed comparison, while Ministral 3, Pythia, Qwen 3, and Phi-2 each gain less than 0.5%. These families did not receive equally extensive normalization and hyperparameter tuning.
- **Temperature control, Figure C.2**: on PG-19 with Gemma 3 1B, temperature 1.2 alone reduces perplexity by 8.48%, recirculation alone by 14.21%, and their combination by 19.55%, arguing against recirculation merely acting as a global temperature change.
- **Token persistence, Figure 9**: benefits remain measurable at a lag of 256 positions. Adverbs, adjectives, and verbs benefit most; numerals, determiners, and pronouns benefit least. Count-matched random controls reduce the likelihood that the result is solely a token-count artifact.

## Connections

- Directly responds to [[topological-trouble-with-transformers|Topological Trouble With Transformers]], by overlapping authors, which identifies the difficulty of carrying a deep-layer belief into later computation.
- Is the post-hoc counterpart to [[full-bandwidth-transformer|Full-Bandwidth Transformer]]: both return deep latent state to shallow computation, but Full-Bandwidth trains recurrence into the model while recirculation modifies an existing model at inference time.
- Extends [[iterative-refinement|iterative refinement]] across token positions through a single added deep-to-shallow pass.
- Complements [[pretraining-recurrent-networks-without-recurrence|Supervised Memory Training]], which prepares a model for recurrent deployment during training rather than inserting recurrence only after pretraining.
- Relates to [[fixed-point-reasoners|Fixed-Point Reasoners]] and [[equilibrium-reasoners|Equilibrium Reasoners]], but does not test convergence or adaptive stopping because it evaluates only one additional pass.
- Contrasts with [[hyperloop-transformers|Hyperloop Transformers]], which repeat depth computation rather than routing the previous position's deep state back to a shallower layer.
- Shares the second-pass revision theme with [[dynamic-compression|Dynamic Compression]]: both use an extra pass to repair what a single causal pass compromised, but recirculation re-runs deep layers on existing tokens while dynamic compression selectively re-reads raw inputs to rebuild a delta-rule RNN's working memory.

## Limitations & Open Questions

- Optimal source layer, destination layer, coefficients, and normalization vary by task, domain, architecture, and scale.
- Benefits are substantially larger for Gemma than for the other evaluated model families; the proposed Peri-LN or training-based explanations remain hypotheses.
- Autoregressive generation can overlap the two stacks, but prompt prefill becomes serial across positions. The paper gives no wall-clock latency or memory measurements.
- Only one additional recirculation iteration and one source-to-destination path are evaluated.
- Fixed recirculation worsens LAMBADA for Gemma 3 1B and 12B, and transferred settings degrade two contextualization categories for 12B.
- Adaptive coefficients can transfer poorly across task distributions; the MMLU-test adaptation result also overlaps the evaluation distribution.
- The evidence does not establish whether higher pass@128 performance reflects improved calibration and candidate ranking or genuinely expanded reasoning capability.

> [!open-question]
> Does repeated recirculation converge to a stable representation, oscillate, or become unstable, and could representation change supply an adaptive stopping rule?

> [!open-question]
> Why is Gemma unusually receptive, and can source/destination paths be predicted from representation geometry rather than tuned by grid search?

## Future Work

The authors propose:

- Finding task-universal hyperparameters or learning mappings from task context to hyperparameters.
- Evaluating more architectures and training procedures, with architecture-specific normalization.
- Using blockwise recurrence to recover parallelism during long-context prefill.
- Evaluating multiple recirculation iterations per token.
- Adding multiple simultaneous source-to-destination paths and testing whether they carry complementary abstraction levels.
- Learning token-conditioned path selection and normalization.
- Exploring lightweight adaptation more broadly before changing the base model's weights.
- Combining recirculation with looping, variable computation time, latent thought, or chain-of-thought.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2608.17981)
- [arXiv](https://arxiv.org/abs/2608.17981)
- [PDF](https://arxiv.org/pdf/2608.17981v1)
- [HTML](https://arxiv.org/html/2608.17981v1)
