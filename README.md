# The Surface Evolver Documentation (Chinese Translation)

[English](README.md) | [简体中文](README_zh.md)

---

> A Chinese-translated documentation collection for [The Surface Evolver](https://kenbrakke.com/evolver/evolver.html) — an interactive program for studying surfaces shaped by surface tension and other energies, developed by Kenneth A. Brakke. Translated using MiMo-V2.5-Pro.

## Notes

This branch has undergone significant structural changes to the original text and incorporates modern CSS and JavaScript features to enhance page rendering. The original `main` branch is a pure translation of the documentation — only the text content was translated into Chinese while the styling and structure remained identical to the English original. It is now retained solely as a backup.

[Online Demo](https://hyfaust.github.io/Surface-Evolver-Documents_zh/evolver.htm)

## Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Documentation Overview](#documentation-overview)
- [Example Data Files](#example-data-files)
- [Related Resources](#related-resources)

## Introduction

The Surface Evolver is an interactive program for studying surfaces shaped by [surface tension](https://kenbrakke.com/evolver/energies.htm) and other energies, subject to various [constraints](https://kenbrakke.com/evolver/constrnt.htm). Surfaces are implemented as simplicial complexes (collections of triangles). Users define an initial surface in a data file, and Evolver evolves the surface toward a minimum energy state via gradient descent.

Key capabilities:

- Surface tension, gravitational potential energy, mean curvature squared, user-defined surface integrals, and knot energies
- Arbitrary topology (e.g., real soap bubble clusters), volume constraints, boundary constraints, contact angles, prescribed mean curvature, crystalline integrands, and gravity
- Surfaces in ambient spaces of arbitrary dimension, including Riemannian metrics and quotient spaces under group actions
- Graphics output via on-screen display and multiple file formats including PostScript

This repository contains the **Chinese-translated documentation** for Surface Evolver Version 2.70, including both the HTML-based reference documentation and a complete manual translation in Markdown format.

## Project Structure

```
The Surface Evolver/
├── Surface Evolver manual/      # Complete manual translated to Chinese (Markdown)
│   ├── ch01-04_*.md             # Ch 1–4: Introduction, Installation, Tutorial, Elements
│   ├── ch05-06_*.md             # Ch 5–6: Surface Model, Data File
│   ├── ch07-10_*.md             # Ch 7–10: Syntax, Variables, Single-Letter Commands, Toggles
│   ├── ch11-16_*.md             # Ch 11–16: Commands, Scripts, Operations, Graphics, Quants, Technical
│   ├── ch17-21_*.md             # Ch 17–21: Misc, Hints, Bugs, History, Bibliography
│   └── README.md                # Manual table of contents and source info
├── default.htm / evolver.htm    # Main entry points for HTML documentation
├── intro.htm                    # Overview of Surface Evolver
├── install.htm                  # Installation instructions
├── tutorial.htm                 # Tutorials and examples
├── elements.htm                 # Geometric elements and attributes
├── model.htm                    # Surface models
├── energies.htm                 # Energy types
├── constrnt.htm                 # Constraints and boundaries
├── quants.htm                   # Named quantities and methods
├── syntax.htm                   # Language syntax
├── datafile.htm                 # Data file format
├── commands.htm                 # Command language
├── graphics.htm                 # Graphics and display
├── general.htm                  # General options, error handling, interrupts
├── eigentut.htm                 # Hessian, eigenvalues, and eigenvectors tutorial
├── hints.htm                    # Practical hints
├── debugging.htm                # Debugging guide
├── profiling.htm                # Performance profiling
├── mpi_evolver.htm              # MPI parallel Evolver
├── biblio.htm                   # Bibliography and references
├── index.htm / index.html       # Documentation index
├── news_01.htm – news_22.htm    # Version history and news (22 files)
├── *.fe                         # Example Evolver data files
├── *.gif                        # Tutorial images and diagrams
└── evhelp.txt                   # Quick help text
```

## Documentation Overview

The documentation is organized into two formats:

### HTML Documentation (`*.htm`)

The main body of documentation, originally from the official Surface Evolver distribution, translated into Chinese. These files cover:

| Topic | File(s) | Description |
|-------|---------|-------------|
| Overview | `intro.htm` | Program description and applications |
| Installation | `install.htm` | Installation for Unix/Linux, Windows, macOS |
| Tutorial | `tutorial.htm`, `catenoid.htm`, `mound.htm`, `column.htm`, `cube.htm`, `twointor.htm`, `nnn.htm`, `ringblob.htm` | Step-by-step tutorials with examples |
| Reference | `elements.htm`, `model.htm`, `energies.htm`, `constrnt.htm`, `quants.htm`, `syntax.htm`, `datafile.htm`, `commands.htm` | Complete language and data file reference |
| Advanced | `eigentut.htm`, `graphics.htm`, `general.htm`, `debugging.htm`, `profiling.htm`, `mpi_evolver.htm` | Hessian analysis, graphics, debugging, profiling, MPI |
| History | `news_01.htm` – `news_22.htm` | Version history and changelog |
| Bibliography | `biblio.htm` | Academic references |

### Markdown Manual (`Surface Evolver manual/`)

A complete manual translation in Markdown format, organized by chapter:

| File | Chapters | Content |
|------|----------|---------|
| `ch01-04_*.md` | 1–4 | Introduction, Installation, Tutorial, Geometric Elements |
| `ch05-06_*.md` | 5–6 | Surface Model, Data File |
| `ch07-10_*.md` | 7–10 | Syntax, Variables, Single-Letter Commands, Toggles |
| `ch11-16_*.md` | 11–16 | Commands, Scripts, Operations, Graphics, Quantities, Technical Reference |
| `ch17-21_*.md` | 17–21 | Miscellaneous, Hints, Bugs, History, Bibliography |

## Example Data Files

The repository includes example Surface Evolver data files (`.fe` extension, standing for "facet-edge"):

| File | Description |
|------|-------------|
| `column.fe` | Calculating forces exerted by a column of liquid solder in the shape of a skewed catenoid |
| `addload_example.fe` | Demonstrates the `addload` command for loading multiple copies of the same surface with different parameters |

## Related Resources

- **Official Surface Evolver Homepage**: [Surface Evolver](https://kenbrakke.com/evolver/evolver.html)
- **Original PDF Manual**: [manual270](https://kenbrakke.com/evolver/downloads/manual270.pdf)
- **Author**: [Kenneth A. Brakke](https://kenbrakke.com/default.htm), Department of Mathematics, Susquehanna University



## Next Steps

- [x] CSS optimization for global content display
- [x] Add left sidebar and full-text search bar
- [x] Introduce KaTeX for math formula rendering
- [x] ~~Rewrite all math formulas in LaTeX format~~
- [x] Fix caption display layout from side-by-side to stacked
- [ ] Fix and add hyperlinks across all pages
- [ ] Manual review of translation accuracy for each chapter
- [ ] Verify manual content accuracy
- [ ] Choose a suitable approach to combine the manual into a single file
- [ ] …
