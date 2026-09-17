---
title: "Predicting the Order of Upcoming Tokens Improves Language Modeling"
type: source
created: 2026-09-13
updated: 2026-09-13
arxiv_id: "2508.19228"
authors:
  - "Zayd M. K. Zuhri"
  - "Erland Hilman Fuadi"
  - "Alham Fikri Aji"
year: 2025
venue: "arXiv preprint"
pdf_path: "https://arxiv.org/pdf/2508.19228"
code_url: "https://github.com/zaydzuhri/token-order-prediction"
tags:
  - language
  - transformer
  - self-supervised-learning
  - representation-learning
  - optimization
aliases:
  - "Token Order Prediction"
  - "TOP"
  - "Predicting the Order of Upcoming Tokens"
---

# Predicting the Order of Upcoming Tokens Improves Language Modeling

## Summary

This early preprint proposes Token Order Prediction (TOP), an auxiliary objective for language-model pretraining. Instead of asking a model to identify each exact future token at several offsets, TOP asks it to rank vocabulary items by how soon they next appear within a window. The model adds one linear unembedding head beside the standard next-token head. In experiments with 340M, 1.8B, and 7B parameter models, TOP beats the next-token and four-token Multi-Token Prediction baselines on most of eight standard NLP benchmarks. The paper does not yet test coding, summarization, the DeepSeek-V3 MTP variant, or TOP-based speculative decoding.

## Key Contributions

- **Token Order Prediction**: defines a soft vocabulary target that assigns higher scores to tokens appearing closer in the future sequence.
- **Listwise ranking loss**: adapts the ListNet objective so the model learns a proximity distribution rather than a one-hot future-token label.
- **Small architectural change**: adds one vocabulary-sized linear unembedding layer instead of the extra transformer layers used by the compared MTP design.
- **Scale comparison**: trains NTP, MTP, and TOP models at approximately 340M, 1.8B, and 7B parameters on the same FineWeb-Edu subset.

## Methodology

### From exact future tokens to token order

For each position $t$, TOP looks at the next $W$ tokens. For every vocabulary token $v$, it finds the nearest future occurrence at distance $d$. If $1 \leq d \leq W$, the target score is $W-d$. Tokens with no occurrence in the window receive a default score of negative infinity. The target therefore preserves the first upcoming occurrence of each token and ranks nearer tokens higher.

The paper constructs these targets with a backward scan over the sequence. An optimized Triton kernel builds them on the fly during training. Dataset preprocessing is another option.

### Loss and architecture

The TOP head $u_{TOP}: \mathbb{R}^{D} \rightarrow \mathbb{R}^{V}$ maps the final hidden state to vocabulary scores. The loss applies softmax to the target scores and to the predicted scores, then computes the ListNet cross-entropy:

$$
L_{TOP} = -\sum_{t=0}^{T} \operatorname{softmax}(y_t) \cdot \log \operatorname{softmax}(u_{TOP}(h_t^L)).
$$

The standard next-token loss remains active. Training minimizes $L=L_{NTP}+L_{TOP}$. Both heads read the same final-layer hidden state. At inference, the TOP head is removed and the model uses the ordinary NTP head, so deployment keeps the standard autoregressive architecture. The paper notes that a TOP-only model supports greedy generation, while probability sampling still requires the NTP head.

### Experimental setup

The authors train on the sample-100BT subset of FineWeb-Edu. The 340M models use 52B training tokens. The 1.8B and 7B models use 104B tokens. All runs use a 4,096-token sequence length, a 32,000-token vocabulary, AdamW, cosine learning-rate decay, and a global batch size of 128. TOP uses $W=4096$. MTP predicts $N=4$ future tokens. To match non-embedding parameter counts, the MTP shared trunk loses three layers to make room for its four transformer-block heads.

The approximate base configurations are:

| Model size | Hidden size | Transformer layers | Attention heads |
| --- | ---: | ---: | ---: |
| 340M | 1,024 | 24 | 16 |
| 1.8B | 2,048 | 32 | 32 |
| 7B | 4,096 | 30 | 32 |

Evaluation covers ARC Challenge, LAMBADA, PIQA, SciQ, Social IQa, TriviaQA, NaturalQuestions Open, and HellaSwag.

## Key Results

TOP improves on the NTP baseline in 20 of the 24 task-level comparisons across three model sizes and eight benchmarks. It improves on MTP in 20 comparisons and ties it once. The gains are uneven, so the aggregate pattern matters more than any single task.

- **340M**: TOP improves over NTP on LAMBADA accuracy by 0.72 points, HellaSwag by 1.04, ARC Challenge by 0.51, PIQA by 0.92, SciQ by 4.90, and NaturalQuestions Open by 0.28. It falls behind NTP on Social IQa by 0.82 and TriviaQA by 0.55.
- **1.8B**: TOP improves over NTP on all eight tasks. The largest gains are 3.67 points on ARC Challenge and 7.07 on TriviaQA.
- **7B**: TOP improves over NTP on six of eight tasks. The largest gains are 3.00 points on SciQ and 6.63 on TriviaQA. PIQA falls by 0.60 and Social IQa falls by 0.46.

The NTP-head training loss is slightly higher for TOP than for NTP at every scale: 2.40 versus 2.39 at 340M, 2.07 versus 2.06 at 1.8B, and 1.88 versus 1.87 at 7B. Despite that gap, TOP has lower LAMBADA perplexity and stronger downstream scores. The authors suggest that TOP may regularize training on the limited FineWeb-Edu subset, but they do not establish that mechanism.

The MTP reproduction is competitive at 340M and 1.8B but underperforms NTP at 7B on these non-coding tasks. TOP's gains increase with model size in this experiment. This supports the paper's claim that proximity ranking is an easier and more scalable auxiliary signal than exact multi-token prediction, but it does not establish a general scaling law.

## Connections

- [[token-order-prediction|Token Order Prediction]] files the objective as a reusable design pattern for future-token auxiliary training.
- [[next-latent-prediction|NextLat]] and [[hierarchical-latent-prediction|HiLP]] also add training-only pressure to represent future sequence structure. NextLat predicts future hidden states, HiLP predicts a coarser latent state, and TOP ranks future vocabulary items.
- [[state-prediction-separation|SPS]] separates immediate prediction from persistent state preparation in the architecture. TOP keeps one hidden stream and changes the training target instead.
- [[iterative-refinement|Iterative Refinement]] places TOP alongside other training-time methods that add future-oriented pressure without requiring recurrent inference.
- [[lm-head-gradient-bottleneck]] studies how vocabulary-space error is compressed through an output head. TOP adds a second unembedding head, but this paper does not measure whether the extra head changes gradient transmission.

## Limitations & Open Questions

- This is an early preprint with one training corpus, one TOP window, and one MTP horizon. The paper does not report a systematic sweep over $W$, $N$, loss weights, or random seeds.
- The TOP target is vocabulary-wide, and the additional unembedding matrix has size $D \times V$. The fused Triton implementation is described as having minimal overhead, but the preprint does not provide a separate hardware timing study.
- The evaluation uses standard NLP benchmarks. The paper does not test the coding and summarization settings where prior MTP work reported its clearest gains.
- The MTP comparison uses the parallel four-token setup from the reproduced baseline. It does not compare against DeepSeek-V3's sequential two-token variant.
- TOP is removed at inference, and the paper does not yet show self-speculative decoding or another direct inference-time use of the ranking scores.
- The higher NTP training loss under TOP and the proposed regularization explanation remain observational. The benchmark gains could also depend on the particular data mixture or optimization settings.

> [!open-question]
> Does TOP remain useful when the window is shorter than the context, when the data mixture changes, or when the model is trained at frontier scale?

## Future Work

The authors list four additions for later versions:

- Compare TOP with the DeepSeek-V3 version of MTP.
- Fine-tune and evaluate on generative tasks such as summarization and coding.
- Test TOP on the star-graph task proposed by Bachmann and Nagarajan.
- Evaluate whether TOP supports self-speculative decoding.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2508.19228)
- [arXiv](https://arxiv.org/abs/2508.19228)
- [PDF](https://arxiv.org/pdf/2508.19228)
- [Code](https://github.com/zaydzuhri/token-order-prediction)
