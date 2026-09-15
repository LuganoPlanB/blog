---
title: "Example: privacy as a design constraint"
date: 2026-09-13T09:00:00+02:00
authors:
  - denis-roio
tags:
  - privacy
  - design
  - digital-sovereignty
summary: "Sample editorial material exercising figures, captions, lists, and wide media in the article layout."
draft: false
---

> This demonstration article is placeholder material. It describes an editorial structure, not a Foundation position.

Privacy work is easier to evaluate when it starts with a concrete data flow. Which information enters the system, who can observe it, how long does it remain, and what can be inferred when several records are combined?

## Draw the environment first

An architecture diagram should include the boundaries outside the software itself. People, devices, operators, backups, exports, and support processes can all change the privacy properties of an otherwise careful implementation.

{{< figure src="figure.jpg" alt="Aerial view of Lugano, its lake, and surrounding mountains" caption="Example wide figure from the Plan ₿ visual asset set. Replace it with article-specific media." wide="true" >}}

The same discipline applies to editorial claims. A real article should identify whether a statement comes from a specification, a measurement, a threat model, or the author's analysis.

## Ask bounded questions

1. Is each collected field necessary for the stated task?
2. Can the task work with a coarser or short-lived value?
3. Who can link the value to another context?
4. What deletion promise can the system actually keep?

These questions are practical enough to use during review and precise enough to revisit when the system changes.

## Make the quiet path the default

Good privacy controls should not require a user to fight the interface. Defaults carry more weight than policy copy, so the least revealing reasonable path should also be the simplest path.
