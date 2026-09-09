---
title: "Looped Transformers under the Jacobian Lens: Does the Global Workspace Survive Recurrence?"
type: source
created: 2026-09-04
updated: 2026-09-04
arxiv_id: "2609.01924"
authors:
  - "Wenlong Wang"
  - "Fergal Reid"
year: 2026
venue: "arXiv preprint (cs.AI)"
pdf_path: "https://arxiv.org/pdf/2609.01924"
tags:
  - language
  - transformer
  - representation-learning
  - representation-geometry
  - theory
aliases:
  - "Looped Transformers under the Jacobian Lens"
  - "Global Workspace and Recurrence"
---

# Looped Transformers under the Jacobian Lens: Does the Global Workspace Survive Recurrence?

## Summary

Wang and Reid extend the Jacobian lens to looped Transformers by treating each firing of a tied block as a virtual layer. They use this virtual-unrolling adapter to test whether recurrent language models form an interpretable global workspace and whether that workspace survives across loop boundaries. The answer depends on the model. Ouro-2.6B reconstructs workspace content at every loop checkpoint, so linear transport does not carry the same content across loops. Huginn-0125 carries content through its 16 recurrences, but reads, writes, and ablations affect only a short window of roughly two recurrences. The results separate workspace readability from causal access and show why recurrence-specific lens validation is necessary.

## Key Contributions

- Extends Jacobian-lens analysis to tied blocks with a virtual-unrolling adapter that captures activations and Jacobians at every firing.
- Defines a family of lenses with recurrence-aware target selection instead of treating the final recurrent state as the only valid readout point.
- Compares two recurrent language models, Ouro-2.6B and Huginn-0125, with the untied Qwen3.6-27B baseline.
- Measures transport norms, layer-tying symmetry, factorization, workspace occupancy, decodability, and causal access across eleven experiment families.
- Identifies recurrent failure modes in which a lens can appear readable while transport, verbalisation, or intervention tests show that the content is not persistent or causally usable.

## Methodology

The virtual-unrolling adapter represents each firing of a tied block as a separate virtual layer in the computational graph. It then applies the Jacobian lens to the unrolled graph, fitting a source-specific mean Jacobian from hidden state $h_v$ to a target hidden state $h_t$ and reading out the transported state through the model's unembedding. The adapter dispatches hooks per firing so it does not silently retain only the last iteration.

Lens fits use 1,000 WikiText-103 prompts of 128 tokens, skip the first 16 positions, freeze model parameters, and average Jacobians by source. The experiments run in bfloat16 on one to three NVIDIA B200 GPUs. The recurrent models differ in how they expose depth:

- Ouro-2.6B has 48 unique layers looped four times, for virtual depth 192, with deep supervision at every loop end.
- Huginn-0125 has a 2-layer prelude, a 4-layer core repeated 16 times, and a 2-layer coda, for virtual depth 68. It uses truncated backpropagation through time with a mean length of eight and no explicit deep supervision.
- Qwen3.6-27B has 64 untied layers and serves as the non-recurrent comparison.

The causal suite includes verbal-report swaps, introspection, topic modulation, summoning, two-hop probe swaps, flexible generalisation, selectivity, ignition, capacity, dual-task interference, and direction ablations. The authors validate each lens family against transport distance and compare matched source-target separations before interpreting differences between architectures.

## Key Results

- Both recurrent models form workspace-like representations, but recurrence changes how a user can access them. Ouro needs interventions across all remaining loops, while Huginn's last lens window is nearly as effective as intervening across every recurrent window.
- Ouro's mean transport factorisation at supervised loop ends is 0.94 to 1.00. Its transport norm falls to 0.13 to 0.30 after one additional loop, consistent with reconstruction at each checkpoint rather than persistent content transport.
- Huginn's same-offset recurrent transport is highly tied, with a cosine similarity of 0.9991 between independently fitted lenses at recurrences 8 and 12. Its mid-recurrence sources lose long-range influence within four to five recurrences, but the prelude supplies the only distance-independent long-range route.
- Workspace occupancy is not uniform. Ouro has higher per-layer occupancy in its in-band layers, while Huginn's recurrent windows contain 31 to 44 occupied slots and its coda contains 92. The paper warns that uneven target tiling can look like accumulation if the analysis uses raw totals instead of per-layer rates.
- In the currency riddle, Ouro shifts from an "euro" alternative toward Italy and "lira" as recurrence proceeds. Huginn mostly retains the salient "euro" association and has only five slots from the country and currency family across its 67 virtual layers.
- Verbal report is strongest for Huginn at 124 of 126 examples, compared with 106 of 133 for Ouro and 69% aggregate accuracy for Qwen. Causal introspection is different: Huginn has 0 of 97 top-1 successes, while Ouro reaches a median reciprocal rank of 0.50 and 31% top-1 success.
- Flexible generalisation is weak for all three models, with 80 of 192 successes for Qwen, 73 of 192 for Ouro, and 25 of 192 for Huginn. Two-hop probe swaps show the same ordering: 52% for Qwen, 29% for Ouro, and 6% for Huginn.
- Injected content does not verbalise reliably in the recurrent models. The paper reports that Huginn reroutes self-computed content into words at 98% but never verbalises externally injected content in 97 tests, while Ouro's deep supervision supports injected verbalisation more often.

## Connections

- [[jacobian-lens-workspace]] files the paper's method as a general concept: representation readability, transport, and causal access are separate tests.
- [[looped-transformers]] provides the architecture context. This paper adds evidence that loop count and supervision change the state interface, even when the tied-block design looks similar.
- [[iterative-refinement]] gains a causal distinction between refinement that reconstructs a state at each checkpoint and recurrence that carries content across steps.
- [[representation-geometry]] gains a functional Jacobian view that complements global statistics, local neighborhood metrics, and manifold steering.
- [[topological-trouble-with-transformers]] supplies the motivation for explicit state interfaces, while this paper tests whether the resulting state remains accessible rather than merely present in hidden activations.
- [[state-prediction-separation-concept]] asks a related question about persistent and ephemeral state, but it separates roles within each token step rather than measuring transport across repeated depth.

## Limitations & Open Questions

> [!open-question]
> A Jacobian lens is an instrument with a finite transport horizon. Beyond that horizon, a readable reconstruction can be a poor proxy for the model's causal state, so the paper's matched-distance and intervention checks are part of the measurement rather than optional extras.

- Ouro, Huginn, and Qwen differ in parameter count, architecture, supervision, input-injection path, and training recipe. The comparison cannot isolate one causal reason for workspace persistence.
- The recurrent models are small relative to the Qwen baseline, and the paper does not establish whether the same transport patterns hold at larger matched scales.
- Workspace occupancy and linear decodability do not imply causal utility. Several causal tests are null or weak even when verbal reports are accurate.
- The paper operationalizes a global workspace as a set of readable and causally testable representations. It makes no claim about consciousness or subjective experience.
- The causal suite depends on lens fitting, intervention placement, and estimator choice. Alternative readouts or interventions may change some null results.

## Future Work

- Compare larger recurrent and untied models with matched parameter counts, depth, compute, supervision, and input-injection paths.
- Vary deep supervision and recurrence-specific state interfaces to separate reconstruction from persistent transport.
- Extend causal tests beyond linear Jacobian transport and calibrate them against sequence-level interventions.
- Test whether recurrent workspace persistence interacts with explicit state-prediction separation, latent prediction, or other training-only state objectives.
- Measure whether short transport horizons are a stable design property or a consequence of the particular training recipes used for Ouro and Huginn.

## Links

- [AlphaXiv](https://www.alphaxiv.org/abs/2609.01924)
- [arXiv](https://arxiv.org/abs/2609.01924)
- [HTML](https://arxiv.org/html/2609.01924)
- [PDF](https://arxiv.org/pdf/2609.01924)
