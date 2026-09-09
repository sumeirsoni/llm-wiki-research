---
title: "Generative Modeling Techniques Carried into LLMs"
type: comparison
created: 2026-09-07
updated: 2026-09-07
tags:
  - generative-modeling
  - language
  - transformer
  - flow-matching
  - diffusion
  - theory
sources:
  - "[[explorative-modeling]]"
  - "[[latent-reasoning-with-normalizing-flows]]"
  - "[[flow-matching]]"
  - "[[energy-based-models]]"
  - "[[autoregressive-language-models-are-secretly-energy-based-models]]"
  - "[[energy-based-transformers]]"
aliases:
  - "Generative models for LLMs"
  - "Non-diffusion generative LLMs"
---

# Generative Modeling Techniques Carried into LLMs

## Bottom line

Yes. Diffusion is only one part of a broader transfer from generative modeling into LLMs. The most substantial non-diffusion lines are:

- **Flow matching and continuous flows** for direct text generation in embedding space.
- **Normalizing flows** for likelihood-based continuous latent thoughts and continuous-space language models.
- **VAEs and latent-variable models** for compressing or sampling intermediate reasoning states.
- **Generative Flow Networks (GFlowNets)** for diverse, reward-proportional reasoning or span generation.
- **Energy-based models** for sequence scoring, iterative refinement, and global compatibility modeling.
- **GAN-like adversarial objectives** for text generation and alignment, although they have not become the dominant LLM architecture.

The important distinction is that a technique can be carried into LLMs at several different layers:

1. **Generator replacement:** replace next-token autoregression with a new sequence generator.
2. **Latent reasoning:** keep an autoregressive language model for the final answer but generate intermediate thoughts in a continuous or stochastic latent space.
3. **Training objective:** retain an autoregressive generator while changing the distribution it is trained to sample, such as reward-proportional reasoning paths.
4. **Inference or scoring:** use an energy, verifier, flow, or other generative model to refine or rank outputs.

## XM, IMLE, and drifting specifically

- **XM:** Yes. The Explorative Modeling paper evaluates an XMDLM hybrid on discrete language modeling and reports that exploration improves the generative-perplexity versus entropy frontier at the tested sampling budgets. This is a masked diffusion language model experiment, not an autoregressive GPT-style language model, and the language results are described as preliminary rather than as the paper's strongest quantitative table. The same paper also reports broader gains across language, images, and video when exploration is added as a training axis.
- **Drifting:** Yes. TokenDrift transfers the drifting objective to discrete diffusion language models by lifting categorical predictions into soft-token features, applying drifting in a frozen semantic space, and training the DDLM logits toward the resulting target. In controlled continual-training experiments, it reduces 4-NFE generative perplexity by 89% on MDLM and 86% on DUO. This is a refinement objective on a diffusion LM, not a standalone one-step drifting language generator.
- **IMLE:** No clear direct standard language-modeling result found. Generator-style IMLE has been applied to one-step visuomotor policies, trajectory generation, and stochastic world models, but I did not find a comparable IMLE-trained text LM or an IMLE replacement for token-level language generation. The similarly named I-MLE is a gradient estimator for discrete optimization and should not be conflated with IMLE's best-candidate generative objective.

## Evidence table

| Technique | LLM use | Direct replacement for token AR? | Maturity of transfer |
| --- | --- | --- | --- |
| **Flow matching** | ELF denoises continuous token embeddings and discretizes only at the final step; TarFlowLM uses autoregressive normalizing flows for continuous-space language modeling | **Sometimes.** ELF is a non-AR diffusion-style generator; TarFlowLM is still causal in its latent factorization | Direct language-generation research with competitive few-step results, but not yet the default LLM paradigm |
| **Explorative Modeling** | XMDLM applies candidate-to-target exploration to masked diffusion language modeling | **No.** It modifies training of a discrete DLM rather than replacing it with an autoregressive or continuous generator | Direct but preliminary language evidence; stronger reported results are in image, video, and control settings |
| **Drifting / TokenDrift** | TokenDrift applies a soft-token drifting target in a frozen semantic space to masked and uniform-state diffusion LMs | **No.** It refines a DDLM objective and keeps iterative sampling | Direct fixed-NFE DDLM result, not a standalone one-step language generator |
| **IMLE** | No clear standard text-LM application found; nearby results target action policies, trajectories, and world-model transitions | **No demonstrated text-LM replacement** | Open transfer question for language modeling |
| **Normalizing flows** | NF-CoT samples continuous thoughts with an exact likelihood inside an LLM causal stream; TarFlowLM models continuous language representations | **Usually no.** NF-CoT replaces the thought representation, not final answer-token decoding | Strong latent-reasoning and continuous-LM evidence, still research-scale |
| **VAE / latent variables** | VAEs compress reasoning blocks or other continuous states; LaDiR combines a VAE latent space with latent diffusion | **Rarely.** The final answer generally still uses an autoregressive decoder | Established as a supporting latent interface; posterior collapse and decoder dependence remain issues |
| **GFlowNets** | FlowRL and GFlowRL train LLMs to cover diverse high-reward reasoning paths; Flow of Spans uses variable-length spans and a DAG state space | **Partly.** Span generation changes the action space; most reasoning work still samples token trajectories autoregressively | Increasingly active for reasoning and alignment, but primarily an RL or search objective |
| **Energy-based models** | EDLM adds a full-sequence energy model to diffusion language modeling; Energy-Based Transformers refine predictions by energy minimization; ARM-EBM work gives a theoretical equivalence | **Potentially.** EBTs can generate through iterative refinement, but most practical systems remain hybrid or experimental | Promising for test-time compute and global scoring, not yet a mainstream LLM generator |
| **GANs / adversarial training** | SeqGAN-style methods generate discrete text with policy gradients; newer adversarial preference and self-play methods use generator-discriminator games for alignment | **Historically attempted, rarely used as the core frontier LLM generator** | Important conceptual influence, weak as a direct modern pretraining replacement |
| **Consistency models** | Consistency ideas have been adapted to discrete diffusion language models, especially for few-step sampling | **No, usually.** They accelerate a diffusion or denoising model rather than replace the underlying paradigm | A direct efficiency transfer inside diffusion LLMs |

## 1. Flow matching and continuous flows

This is the clearest non-diffusion transfer for direct language generation. **ELF: Embedded Language Flows** applies continuous-time Flow Matching to token embeddings. The model remains in continuous embedding space during almost all sampling and maps back to discrete tokens only at the final step. This makes image-generation techniques such as classifier-free guidance easier to reuse and gives better generation quality with fewer sampling steps than the paper's discrete and continuous DLM baselines.

**TarFlowLM** takes a different route. It uses transformer-based autoregressive normalizing flows to model continuous representations of language, supporting alternating-direction transformations, block-wise generation, and hierarchical multi-pass generation. It is closer to a continuous likelihood model than to a masked diffusion model, while retaining causal-transformer machinery.

The transfer is therefore not simply "use a flow instead of a Transformer." It creates a new interface in which the LLM predicts or transforms a continuous object, while a final decoder or unembedding operation returns to tokens.

## 2. Normalizing flows for latent reasoning

**NF-CoT** is a particularly clean example of a generative technique being inserted into an LLM rather than used to replace the whole LLM. Explicit chain-of-thought traces are distilled into compact continuous thoughts. An autoregressive normalizing-flow head samples those thoughts left to right, supplies exact change-of-variables likelihoods, and shares the LLM's causal stream and KV cache. The normal language-model head then generates the final answer.

This gives normalizing flows a useful role in LLMs:

- stochastic reasoning without spelling out every intermediate step as text;
- exact likelihoods for continuous thoughts;
- policy-gradient training over latent reasoning trajectories; and
- a native causal interface rather than a separate iterative diffusion sampler.

The older **Latent Normalizing Flows for Discrete Sequences** line showed that flows could model character sequences and support faster parallel generation, with a quality tradeoff. NF-CoT and TarFlowLM revisit that idea with Transformer-scale latent representations and more targeted interfaces.

## 3. VAEs and latent-variable language models

VAEs were carried into language modeling early, but their role has changed. Classical VAE language models attempted to put sentence-level information in a continuous latent variable while retaining an autoregressive decoder. A powerful decoder can ignore that variable, creating the familiar posterior-collapse problem.

Recent LLM work uses VAEs more selectively. **LaDiR** encodes reasoning steps into blocks of latent thought tokens, applies latent diffusion to refine those blocks, and uses an LLM to decode the answer. **NF-CoT** also uses VAE-encoded reasoning targets, but replaces iterative latent diffusion with an autoregressive flow head. **Coconut** goes further toward latent computation by feeding continuous hidden states back into the LLM as subsequent thought inputs, although it is better classified as continuous latent reasoning than as a standalone probabilistic generator.

The recurring pattern is that the VAE is an interface or compression mechanism, while the final language generation remains autoregressive. VAEs have therefore transferred more successfully as latent-state infrastructure than as a full replacement for next-token modeling.

## 4. GFlowNets and reward-distribution matching

GFlowNets are a different kind of transfer. They are generative policies trained to sample compositional objects in proportion to reward, rather than collapse onto one maximally rewarded mode. In LLMs, the objects are usually reasoning trajectories, text spans, or adversarial prompts.

**FlowRL** applies GFlowNet-style flow balancing to LLM reasoning. **GFlowRL** simplifies the method for larger post-training systems by replacing a learned prompt-conditioned partition function with an in-batch estimate, while preserving the reward-distribution-matching goal. These methods do not make the Transformer a continuous flow model. They change the distribution over autoregressive rollouts and aim to preserve diverse high-reward solutions.

**Flow of Spans** is a more direct generative-model transfer. It treats variable-length text spans as actions in a DAG, so the same final text can be reached through multiple segmentations. A GFlowNet then explores that DAG instead of a simple token tree. The result is a different generation unit and state-space geometry, not merely a different loss on ordinary next-token prediction.

This distinction matters: GFlowNets are generative modeling over trajectories and compositional objects, but most current LLM uses remain autoregressive at the token or span level.

## 5. Energy-based models

Energy-based modeling has entered LLM research in three forms.

First, **Energy-Based Diffusion Language Models** add a full-sequence energy model to improve the approximation used by discrete diffusion and propose parallel importance sampling. This is a hybrid diffusion-EBM system, not a pure EBM language model.

Second, **Energy-Based Transformers** treat prediction as iterative optimization over an energy landscape. More inference steps can improve the answer, allowing dynamic test-time compute, candidate refinement, and self-verification. This is closer to an actual replacement for one-shot token prediction, but it is still experimental and has higher inference complexity.

Third, theory work shows that ordinary autoregressive LMs can be mapped to globally normalized EBMs in function space. That result is important conceptually, but it does not mean that a standard LLM is trained or decoded as a practical EBM. It says that next-token conditionals can implicitly encode global sequence energies and soft value functions.

The practical promise of EBMs is therefore not necessarily fewer denoising steps. It is the ability to spend extra computation on global compatibility, refinement, or verification when the task warrants it.

## 6. GANs and adversarial objectives

GANs were applied to text early through policy-gradient and sequence-level adversarial training, including SeqGAN. The discrete, non-differentiable token interface made optimization substantially harder than in images, and GANs did not become the dominant architecture for large-scale language pretraining.

GAN-like ideas did survive in LLM alignment. Self-play fine-tuning and adversarial preference optimization use a generator-versus-discriminator or policy-versus-reference game to improve responses. In these methods the LLM is still an autoregressive generator, and the adversarial component supplies a training signal rather than a new sampling process.

So the answer for GANs is: yes, the objective transferred, but the image-style generator-discriminator architecture did not transfer cleanly as the main LLM architecture.

## 7. Consistency and other acceleration methods

Consistency models were designed to map noisy states to clean samples in one or a few steps. Their direct language analogue is mostly an acceleration layer for diffusion language models. **Consistent Diffusion Language Models** adapts consistency ideas to discrete stochastic bridges and reports its largest advantages in the few-step regime.

This is a useful boundary case. It is a genuine transfer of a generative modeling technique, but it accelerates the diffusion family rather than opening a wholly separate LLM paradigm.

Continuous autoregressive language models provide another efficiency-oriented branch. **CALM** compresses chunks of tokens into continuous vectors and predicts those vectors autoregressively, reducing the number of generative steps by the chunk size. This is closer to latent tokenization and bandwidth expansion than to a new probability-flow sampler, but it addresses the same sequential bottleneck.

## Practical synthesis

The current landscape can be summarized as follows:

- **Best direct non-diffusion generator:** flow matching and continuous normalizing flows.
- **Best latent-reasoning transfer:** normalizing flows, VAEs, and continuous thought recurrence.
- **Best diversity and reward-shaping transfer:** GFlowNets.
- **Best global-scoring and extra-compute transfer:** energy-based models.
- **Most historically important but least successful architecture transfer:** GANs.
- **Best few-step acceleration within diffusion:** consistency training and distillation.

The main research opportunity is to combine these roles without conflating them. For example, a future LLM could use a normalizing flow or VAE to generate compact latent thoughts, a GFlowNet objective to maintain diverse high-reward reasoning paths, and an energy model to verify or refine the resulting answer. That would be a compositional generative LLM system, not a single replacement for autoregressive modeling.

## Limitations & Open Questions

- Many recent results are preprints and use small or medium research models rather than frontier-scale LLMs.
- "Fewer steps" is ambiguous for LLMs: it can mean fewer token steps, fewer latent thought steps, fewer flow evaluations, or fewer refinement iterations.
- Continuous latent methods often improve bandwidth but add a decoder, autoencoder, alignment curriculum, or latent-space calibration problem.
- GFlowNet results depend strongly on reward design, trajectory length, and variance-control methods.
- Energy-based methods may trade serial token generation for iterative optimization, so they do not automatically reduce wall-clock latency.
- GAN-style adversarial training can improve alignment signals without changing the model's generative factorization, so it should not be counted as a full architectural transfer.

> [!open-question]
> Can one LLM combine continuous latent generation, reward-proportional trajectory sampling, and energy-based verification while preserving exact likelihoods and efficient KV-cache decoding?

## Links

- [ELF: Embedded Language Flows](https://arxiv.org/abs/2605.10938)
- [Explorative Modeling](https://arxiv.org/abs/2607.27372)
- [Drifting Objectives for Refining Discrete Diffusion Language Models](https://arxiv.org/abs/2605.19470)
- [IMLE Policy](https://arxiv.org/abs/2502.12371)
- [WIMLE: Uncertainty-Aware World Models with IMLE](https://arxiv.org/abs/2602.14351)
- [IMLE for Real-time Generative Model Predictive Control](https://arxiv.org/abs/2603.13733)
- [Flexible Language Modeling in Continuous Space with Transformer-based Autoregressive Flows](https://arxiv.org/abs/2507.00425)
- [Latent Reasoning with Normalizing Flows](https://arxiv.org/abs/2606.06447)
- [Latent Normalizing Flows for Discrete Sequences](https://arxiv.org/abs/1901.10548)
- [Training Large Language Models to Reason in a Continuous Latent Space](https://arxiv.org/abs/2412.06769)
- [LaDiR: Latent Diffusion Enhances LLMs for Text Reasoning](https://arxiv.org/abs/2510.04573)
- [FlowRL: Matching Reward Distributions for LLM Reasoning](https://arxiv.org/abs/2509.15207)
- [GFlowRL: Scaling Distribution-Matching RL to Large Language Models](https://arxiv.org/abs/2607.13394)
- [Flow of Spans: Generalizing Language Models to Dynamic Span-Vocabulary via GFlowNets](https://arxiv.org/abs/2602.10583)
- [Energy-Based Diffusion Language Models for Text Generation](https://arxiv.org/abs/2410.21357)
- [Energy-Based Transformers are Scalable Learners and Thinkers](https://arxiv.org/abs/2507.02092)
- [Autoregressive Language Models are Secretly Energy-Based Models](https://arxiv.org/abs/2512.15605)
- [SeqGAN](https://arxiv.org/abs/1609.05473)
- [Consistent Diffusion Language Models](https://arxiv.org/abs/2605.00161)
- [Continuous Autoregressive Language Models](https://arxiv.org/abs/2510.27688)
