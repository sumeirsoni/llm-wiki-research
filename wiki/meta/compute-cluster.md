---
title: "UMD Nexus CML compute reference"
type: meta
created: 2026-09-13
updated: 2026-09-13
tags:
  - benchmark
  - meta
sources: []
aliases:
  - "Nexus CML"
  - "UMD cluster"
---

# UMD Nexus CML compute reference

## Connection

Use the Nexus CML submission host:

```text
ssh ssoni11@nexuscml.umiacs.umd.edu
```

The login may require the UMD password and Duo approval. Do not store either
credential in this vault, a script, or a job file.

## Slurm defaults

The CML documentation lists `cml-furongh` as the faculty-specific partition
for Furong Huang's nodes and `cml-furongh` as the matching account name. Check
the live account association with `show_assoc` before submitting a long job.

The shared CML scratch path is `/cmlscratch/<username>`. It is available on
submission and compute nodes, but it is not backed up. The CML documentation
also lists `/nfshomes/<username>` for backed-up home storage and
`/fs/cml-projects` for approved project allocations.

Useful commands are `sbatch`, `squeue`, `sacct`, `scontrol`, and `scancel`.

## Links

- [Nexus/CML](https://wiki.umiacs.umd.edu/umiacs/index.php/Nexus/CML)
- [UMIACS Slurm](https://wiki.umiacs.umd.edu/umiacs/index.php/SLURM)
- [Slurm quick start](https://slurm.schedmd.com/quickstart.html)
