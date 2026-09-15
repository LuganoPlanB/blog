# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Hugo 0.166.0 Extended with Markdown content, Hugo templates, Vite 8, and Tailwind CSS 4. The site is a static GitHub Pages project published below `/blog/`.

## Users

Readers of Plan ₿ Foundation publications, including technically fluent and tech-curious people seeking clear material about Bitcoin, privacy, digital sovereignty, civic technology, and related Foundation work. Authors and maintainers publish Markdown through Git review.

## Product Purpose

The publication gives Plan ₿ Foundation a durable, readable, first-party place for long-form work. Success means articles are easy to publish, discover, read, cite, and share without introducing a CMS or application framework.

## Positioning

This is an institutional publication within the Plan ₿ website, not a themed microsite: it carries the Foundation's established visual shell into a quieter, technically capable reading environment.

## Operating Context

Authors create page-bundle Markdown and local media, submit changes through Git and pull-request review, and publish by merging to `main`. The generated site is hosted as the `LuganoPlanB/blog` GitHub Pages project at `https://plan-b.foundation/blog/`.

## Capabilities and Constraints

- Static generation remains the default; JavaScript is limited to a preference-aware appearance switch and navigation enhancement.
- Posts use leaf page bundles so article media travels with the article.
- `authors` and `tags` are the only initial taxonomies.
- Authors are structured content entities and templates never assume one fixed author.
- URLs, canonical metadata, feeds, and assets must work below `/blog/`.
- Example material must be visibly labelled and must not resemble Foundation announcements.
- A Git-backed CMS may be added later, but content is not coupled to one now.

## Brand Commitments

`../vite-theme` is the visual source of truth. Preserve its white-first civic clarity, deep navy and civic blue structure, scarce gold signal, Plan ₿ logo assets, Inter-led typography, compact rounded geometry, accessible focus behavior, light/dark preference, and restrained civic-technology tone. The article experience is intentionally quieter than institutional landing pages.

## Evidence on Hand

- `../vite-theme/DESIGN.md` is the normative visual specification.
- `../vite-theme/src/theme/theme.css` contains the reusable token and component contract.
- `../vite-theme/src/theme/index.js` and `domain.js` define current header/footer behavior and content normalization.
- `../vite-theme/src/theme/assets/` contains current Plan ₿ identity assets and civic photography.
- TailBliss was inspected at commit `fe8da027abfc7dcb058e1ad72517e93d7ff329fd` as an Apache-2.0 architectural reference.
- No explicit software licence file was present in `../vite-theme`; this repository derives visual decisions and reuses organisation-provided identity assets, but does not vendor its source code.

## Product Principles

- Reading clarity outranks decorative interface.
- Remain recognizably Plan ₿ at every viewport.
- Make authorship and taxonomy navigable without editorial duplication.
- Prefer durable Hugo conventions and modest dependencies.
- Treat accessibility, metadata, and base-path correctness as publishing fundamentals.

## Accessibility & Inclusion

Use semantic landmarks, skip navigation, keyboard-visible focus, 44px controls, reduced-motion support, descriptive media alternatives, responsive reflow, and WCAG AA text contrast as the baseline.
