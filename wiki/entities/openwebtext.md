---
title: "OpenWebText"
type: entity
created: 2026-09-09
updated: 2026-09-09
tags:
  - dataset
  - language
  - generative-modeling
sources:
  - "[[convergeflow]]"
aliases:
  - "OWT"
---

# OpenWebText

## Identity

OpenWebText is the language-modeling dataset used for the ConvergeFlow experiments. The paper describes a corpus of about 9 billion tokens and packs it into sequences of length 1,024.

## Use in the paper

ConvergeFlow generates 1,024 samples from this dataset and evaluates generative perplexity with GPT-2 Large. Its reported operating point has generative perplexity 33.17 and unigram entropy 5.44.
