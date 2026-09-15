---
title: "Example: documenting an open protocol"
date: 2026-09-14T09:00:00+02:00
authors:
  - denis-roio
tags:
  - bitcoin
  - open-source
  - digital-sovereignty
summary: "A demonstration article showing how a cover image, metadata, and long-form structure work together."
cover: cover.jpg
cover_alt: "Aerial view of Lugano with an orange Bitcoin sign in the foreground"
cover_caption: "Placeholder cover from the Plan ₿ visual asset set; replace it when publishing a real article."
draft: false
---

> This is sample content for layout testing. It is not a Foundation announcement or a statement of policy.

A useful protocol article begins with the reader's task. It names the problem, states the assumptions, and makes the path from idea to implementation inspectable.

## Start with the contract

Before describing internals, write down what another implementer needs to know:

- the messages that cross a boundary;
- the state each participant keeps;
- the failure modes a caller can observe; and
- the compatibility promises that future versions must preserve.

That contract gives both prose and code a stable centre. Readers can decide which details matter before entering the implementation.

## Keep examples executable

Technical prose becomes easier to trust when examples are small enough to run. A shell fragment can show the expected workflow without turning the article into a manual:

```sh
curl --fail --silent --show-error \
  https://example.invalid/protocol.json \
  --output protocol.json
sha256sum protocol.json
```

The address above is deliberately non-functional. Real articles should use verified endpoints and explain what a successful result means.

## Separate facts from interpretation

| Layer | Reader question | Useful evidence |
| --- | --- | --- |
| Contract | What is guaranteed? | Specification and test vectors |
| Implementation | How is it built? | Source code and reproducible build |
| Operations | How does it behave? | Metrics, logs, and incident history |

Clear labels let an author express judgment without making it look like protocol fact. That distinction is especially important when a design is still evolving.[^example]

[^example]: This footnote exists to verify the publication's footnote treatment.

## End with a next step

A strong conclusion points to a concrete next action: read the specification, reproduce a test, review an open question, or compare two known trade-offs. The interface should make those references easy to find without adding ornamental controls.
