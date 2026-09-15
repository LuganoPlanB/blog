---
name: "Plan ₿ Foundation Blog"
description: "A quiet civic digital commons for Plan ₿ Foundation long-form publishing."
colors:
  warm-white: "#fffefa"
  cool-civic: "#f3f9ff"
  paper-surface: "#fcfcfc"
  ink: "#030b20"
  slate: "#526075"
  civic-blue: "#4f97e9"
  institutional-navy: "#082952"
  signal-gold: "#ffb604"
  signal-pink: "#ff5db1"
  signal-violet: "#7468ff"
  signal-cyan: "#23f5ff"
  light-border: "rgba(79, 151, 233, 0.23)"
  light-border-strong: "rgba(79, 151, 233, 0.5)"
  code-navy: "#08203e"
  code-ink: "#f7fbff"
  dark-ground: "#171717"
  dark-ground-alt: "#1d1c1c"
  dark-surface: "#211d1d"
  dark-ink: "#fffefa"
  dark-muted: "#c9c3c3"
  dark-accent: "#e15364"
  dark-highlight: "#f7931a"
  dark-border: "rgba(255, 255, 255, 0.13)"
  dark-border-strong: "rgba(225, 83, 100, 0.56)"
  code-black: "#090909"
typography:
  display:
    fontFamily: 'Inter, "Plan B Symbols", "Segoe UI", Arial, sans-serif'
    fontSize: "clamp(3rem, 7vw, 5.6rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: 'Inter, "Plan B Symbols", "Segoe UI", Arial, sans-serif'
    fontSize: "clamp(2rem, 4vw, 3.35rem)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  title:
    fontFamily: 'Inter, "Plan B Symbols", "Segoe UI", Arial, sans-serif'
    fontSize: "clamp(1.4rem, 3vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.13
    letterSpacing: "-0.03em"
  body:
    fontFamily: 'Inter, "Plan B Symbols", "Segoe UI", Arial, sans-serif'
    fontSize: "clamp(1rem, 1.2vw, 1.08rem)"
    fontWeight: 400
    lineHeight: 1.78
    letterSpacing: "normal"
  label:
    fontFamily: 'Inter, "Plan B Symbols", "Segoe UI", Arial, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1.6
    letterSpacing: "normal"
  mono:
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
    fontSize: "0.88rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
rounded:
  inline: "0.3rem"
  card: "0.75rem"
  panel: "1rem"
  pill: "999px"
  circle: "50%"
components:
  foundation-link:
    backgroundColor: "{colors.institutional-navy}"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.pill}"
    padding: "0.62rem 0.95rem"
    height: "2.75rem"
  appearance-switch:
    backgroundColor: "transparent"
    textColor: "{colors.slate}"
    rounded: "{rounded.pill}"
    size: "2.75rem"
    height: "2.75rem"
    width: "2.75rem"
  topic-chip:
    backgroundColor: "{colors.cool-civic}"
    textColor: "{colors.institutional-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.3rem 0.65rem"
    height: "2rem"
  post-card:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "clamp(1.5rem, 3vw, 2rem)"
  featured-panel:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(2rem, 5vw, 4rem)"
  author-avatar:
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: "4.5rem"
    height: "4.5rem"
    width: "4.5rem"
---

# Design System: Plan ₿ Foundation Blog

## Overview

**Creative North Star: "Plan ₿ Civic Digital Commons"**

The publication carries a recognizable Plan ₿ institutional shell into a calmer reading environment. Warm-white paper and cool-civic surfaces provide clarity; deep navy establishes authority; civic blue supplies navigation and structure; a scarce electric signal line adds the Foundation's technological energy without competing with the writing.

The system is editorial, restrained, and technically capable. Large, tightly set Inter headlines make the thesis legible at a glance, while a quiet long-form column supports sustained reading. Repeated post, author, and topic patterns keep discovery coherent across the home page, archives, taxonomies, and articles.

**Key Characteristics:**

- Recognizable Plan ₿ logo, navigation, and appearance control in the first viewport.
- Warm-white and cool-civic tonal layering with deep navy structure.
- Scarce gold-to-electric gradient signals, used as short rules rather than broad decoration.
- An institutional shell capped at 73.75rem (1180px) and a long-form measure capped at 44rem (704px).
- Compact rounded cards, softly lifted feature panels, and fully rounded controls.
- Light and dark appearances driven by the same semantic roles.

## Colors

The light appearance is white-first and civic-cool; the dark appearance shifts to warm charcoal and red-orange accents while retaining the same hierarchy.

### Primary

- **Civic Blue:** The primary light-mode accent for link emphasis, metadata separators, subtle atmosphere, borders, and scrollbar color.
- **Institutional Navy:** The strong light-mode accent for headlines, navigation, calls to action, and editorial links.

### Secondary

- **Signal Gold:** The leading note in the signature signal gradient and the light selection highlight.
- **Dark Civic Red:** The dark-mode accent for interactive emphasis and strong borders.

### Tertiary

- **Signal Pink, Signal Violet, and Signal Cyan:** Electric transition colors confined to the signature line, card edge, avatar fallback, and focus treatments. Dark mode uses Signal Cyan for keyboard focus and Bitcoin Orange for highlighting.

### Neutral

- **Warm White:** The light page ground and inverse text on institutional controls.
- **Cool Civic:** The light alternate ground for hover, chips, quotes, and quiet structural bands.
- **Paper Surface:** The light card and table surface.
- **Ink:** The primary light text and stable dark text over multicolor avatar fallbacks.
- **Slate:** Secondary light text for summaries, metadata, captions, and supporting copy.
- **Warm Charcoal Ground, Alternate Ground, and Surface:** The three-step dark appearance, from page canvas to raised content.
- **Dark Ink and Muted:** The dark appearance's primary and secondary text roles.
- **Code Navy / Code Black and Code Ink:** High-contrast code surfaces for light and dark appearances.
- **Light and Dark Borders:** Low-opacity separators organize content without turning the page into a grid of boxes; stronger variants mark intentional boundaries and hover states.

### Named Rules

**The Scarce Signal Rule.** Keep the four-color signal gradient to short horizontal rules, card-top accents, and image-free avatar fallbacks; it is an orientation cue, not a page fill.

**The Semantic Theme Rule.** Components consume background, surface, text, accent, border, focus, code, and shadow roles; theme changes replace those roles at the root rather than restyling individual components.

## Typography

**Display Font:** Inter with Plan B Symbols, Segoe UI, Arial, and sans-serif fallbacks

**Body Font:** Inter with Plan B Symbols, Segoe UI, Arial, and sans-serif fallbacks
**Label/Mono Font:** Inter for labels; SFMono-Regular with Consolas and Liberation Mono fallbacks for code

**Character:** One variable sans-serif family creates an institutional, contemporary voice without interrupting reading. Hierarchy comes from scale, dense 800-weight headings, tight headline tracking, and generous body leading rather than a decorative type pairing.

### Hierarchy

- **Display** (800, fluid 3rem–5.6rem, 0.98): Home-page thesis; constrained to roughly 13 characters per line. Article titles use a closely related fluid 2.7rem–5.5rem treatment at 1.01 leading.
- **Headline** (800, fluid 2rem–3.35rem, 1.06): Major section headings and archive divisions.
- **Title** (800, fluid 1.4rem–2rem, 1.13): Post-card and featured-story titles.
- **Body** (400, fluid 1rem–1.08rem, 1.78): Article prose within the 44rem reading measure. General interface copy remains 1rem at 1.6 leading.
- **Label** (700–800, 0.75rem–0.9rem): Metadata, topics, navigation, author links, and section branding. The Blog section marker is uppercase with 0.08em tracking; table headers use uppercase with 0.04em tracking.
- **Mono** (400, 0.88rem, 1.65): Code blocks and inline technical notation.

### Named Rules

**The One-Family Rule.** Preserve Inter across display, editorial, and interface roles; express hierarchy through weight, scale, line height, and tracking.

**The Reading Measure Rule.** Long-form prose remains within 44rem, while covers, tables, highlighted code, and explicitly wide figures may expand to 61rem.

## Layout

The primary shell is centered and capped at 73.75rem (1180px), with 2.5rem total viewport inset behavior expressed as `100% - 2.5rem`. Below 44.99rem, the inset tightens to 1.5rem. The page requires at least a 20rem viewport.

Home begins with a two-column editorial thesis, followed by a two-column featured article and a two-column post grid. The first viewport preserves the Plan ₿ header, thesis, and start of the latest-story path. Archive and taxonomy content reuses the same shell; author and topic directories begin as three columns.

At 59.99rem, the header wraps navigation onto a second row, thesis and featured layouts collapse to one column, footer columns stack, and directory grids reduce to two columns. At 44.99rem, post, author, and topic grids become single-column; header branding and navigation tighten; the Foundation-site pill is hidden; feature media falls to a 14rem minimum; author layouts stack; and wide prose elements use the full compact viewport inset. Navigation remains horizontally scrollable instead of wrapping each label.

Vertical rhythm is generous at section scale and quiet within content. Major sections use fluid block padding from 3.5rem to 6rem, article and list headers use larger fluid openings, post grids use 1rem–1.25rem gaps, and prose blocks recur at 1.4rem intervals.

**The Shell-and-Measure Rule.** Institutional navigation and discovery surfaces use the 73.75rem shell; article text uses the 44rem reading measure; only media and data-heavy prose may use the 61rem wide measure.

## Elevation & Depth

Depth is a restrained hybrid of tonal layering, hairline borders, and soft ambient shadows. In light mode, feature panels and covers use a larger navy-tinted shadow while ordinary cards use a smaller one. Dark mode increases the feature-panel shadow against charcoal but removes ordinary card shadow, relying on surface and border contrast instead. A subtle fixed radial accent wash and long vertical background gradient create page atmosphere behind otherwise flat content.

### Shadow Vocabulary

- **Panel lift** (`0 18px 44px rgba(8, 41, 82, 0.08), inset 0 1px rgba(255, 255, 255, 0.84)`): Featured stories and article covers in light mode.
- **Card lift** (`0 10px 24px rgba(8, 41, 82, 0.06)`): Post cards and code containers in light mode.
- **Dark panel lift** (`0 22px 56px rgba(0, 0, 0, 0.28)`): Featured stories and covers in dark mode; ordinary dark cards remain shadowless.

### Named Rules

**The Quiet Lift Rule.** Borders and tonal surfaces carry ordinary structure. Reserve the larger ambient shadow for featured content and article covers.

## Shapes

The form language is compact and friendly without becoming playful. Content cards, quotes, tables, code blocks, and inline media use gently curved 0.75rem corners. Featured panels and article covers use a slightly broader 1rem radius and clip contained media. Navigation links, topic chips, the appearance switch, the Foundation link, signal rules, and the skip link use fully rounded pill geometry. Author portraits are circular; inline code alone uses the tighter 0.3rem radius.

Hairline borders separate sections and define containers. The multicolor signal is always a thin, fully rounded stroke. Image containers use `object-fit: cover`, and avatar fallbacks use a circular gradient field with a high-contrast initial.

**The Two-Surface Radius Rule.** Use 0.75rem for ordinary content containers and 1rem for featured or large-media panels; use pills only for compact controls and taxonomy.

## Components

Shared Hugo partials and centralized CSS tokens are the implementation contract. Post, author, tag, header, footer, metadata, and pagination patterns are reusable across templates rather than restyled per page.

### Buttons

- **Foundation link:** A high-confidence institutional pill with a 2.75rem minimum height, deep-navy fill, warm-white text, 800 weight, and compact 0.62rem by 0.95rem padding. Hover mixes navy toward civic blue and lifts by 1px. It is hidden below 44.99rem to protect the compact header.
- **Appearance switch:** A transparent circular 2.75rem control with a 1.2rem stroked sun or moon icon. Hover adds the alternate ground and strengthens the icon color. It exposes switch semantics, updates its accessible label and checked state, stores explicit light/dark preference, and otherwise follows the system preference, including later system changes.
- **Focus:** Links, buttons, and summaries share a 2px focus-visible outline with a 3px offset. Light mode uses Signal Violet; dark mode uses Signal Cyan.

### Chips

- **Style:** Topic chips are compact 2rem-minimum-height pills with a quiet alternate-ground fill, light semantic border, navy text, 800 weight, and 0.3rem by 0.65rem padding.
- **State:** Hover strengthens the border and mixes 12% civic blue into the alternate ground. Chips remain independently clickable above a card-wide title link.

### Cards / Containers

- **Post cards:** Paper surfaces with a hairline border, 0.75rem corners, fluid 1.5rem–2rem padding, and a short four-color line inset 1rem along the top edge. Metadata leads, the headline supplies the card-wide link target, summary copy flexes to keep authorship and topics aligned below.
- **Featured story:** A clipped 1rem panel with a larger ambient shadow. Its desktop split favors the cover image at 1.15fr to 0.85fr; content padding scales from 2rem to 4rem. It becomes a single column below 59.99rem.
- **Author card:** A circular 4.5rem portrait or gradient-initial fallback paired with name, role, biography, and links. Directory cards add the shared surface, border, 0.75rem corners, and 1.5rem padding; article footers use the quieter unboxed form.
- **Topic item:** A surface card with 0.75rem corners, 1.5rem padding, at least 5.5rem height, strong topic name, and muted tabular article count.
- **Article containers:** Quotes use alternate-ground fill and strong navy text; tables use a surfaced body and alternate-ground uppercase header; code uses the dedicated dark code surface in both themes.

### Navigation

- **Header:** The Plan ₿ wide logo and uppercase Blog marker lead an 80px desktop header. Navigation links are 44px-high pills; hover and current-page state use the alternate ground. Below 59.99rem, navigation occupies a second row and remains horizontally scrollable.
- **Footer:** The wide logo and restrained publication summary balance a two-column link grid, with a full-width metadata row separated by a hairline border. The link grid becomes one column below 44.99rem.
- **Pagination:** Previous and next links share a top separator, strong navy type, and mirrored 7rem minimum widths so the row remains visually balanced.

### Editorial Signature

The short gold–pink–violet–cyan signal line introduces home and article titles, tops post cards, and replaces prose horizontal rules. It is the system's distinctive visual marker and always remains thin, rounded, and spatially contained.

## Do's and Don'ts

### Do:

- **Do** keep the Plan ₿ identity, Blog marker, primary navigation, and appearance switch recognizable at every viewport.
- **Do** compose new surfaces from the shared semantic tokens and Hugo partial patterns.
- **Do** keep prose at the 44rem measure with 1.78 leading, expanding only covers, code, tables, and designated wide figures.
- **Do** preserve 44px interactive targets, visible keyboard focus, semantic current/switch states, the skip link, and reduced-motion behavior.
- **Do** make dark mode a role-level token substitution and preserve the stored-preference/system-fallback behavior.

### Don't:

- **Don't** spread the signal gradient across large surfaces or use it as routine decoration.
- **Don't** introduce a second display family or decorative editorial font; the shipped hierarchy is Inter-led.
- **Don't** apply panel shadows to every dark-mode card; ordinary dark surfaces are intentionally flat.
- **Don't** widen ordinary prose to the institutional shell or collapse covers and data-heavy elements into the text measure.
- **Don't** create page-specific card, author, tag, or navigation styling when the existing reusable pattern fits.
