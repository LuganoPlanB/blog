# Plan ₿ Foundation Blog

A static, multi-author Hugo publication designed as a first-party section of [plan-b.foundation](https://plan-b.foundation/). Production URLs are generated for `https://plan-b.foundation/blog/`.

## Architecture

- **Hugo** owns content, page bundles, templates, authors, tags, feeds, sitemap, metadata, and image processing.
- **Vite + Tailwind CSS 4** compile `frontend/` into two intermediate files under `assets/generated/`.
- **The social-card generator** renders opted-in article metadata and bundle media to a crawler-friendly 1200×630 PNG.
- **Hugo Pipes** minifies and fingerprints those intermediate assets, producing `/blog/`-safe public URLs.
- **JavaScript is optional enhancement**: the single module stores the light/dark appearance preference.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the decisions and boundaries.

## Requirements

- Node.js 24 (see `.nvmrc`)
- Hugo Extended 0.166.0 or newer within the 0.x compatibility line
- npm 11+

Hugo Extended is required. Verify it with `hugo version`; the output must include `extended`.

## Local development

```sh
npm install
npm run dev
```

The development site is served at `http://localhost:1313/blog/`. Vite watches the frontend bundle, Hugo watches content and templates, and the social-card generator watches posts, author profiles, and identity assets.

Create a production build:

```sh
npm run build
```

Build and run the generated-site contract tests:

```sh
npm test
```

The generated site is written to `public/` and is not committed.

## Repository structure

```text
assets/generated/       Vite output consumed by Hugo (generated, ignored)
content/
  authors/              Structured author profiles and taxonomy terms
  pages/                Standalone pages
  posts/                Leaf page bundles for articles
frontend/               Tailwind entry CSS and minimal JavaScript
layouts/                Hugo templates, partials, and shortcodes
scripts/                Build-time social-card generation
static/images/          Shared identity and social assets
test/                   Generated-site contract tests
.github/workflows/      GitHub Pages deployment
```

## Create a post

Create a leaf bundle:

```sh
hugo new content posts/my-article/index.md
```

Use this front matter:

```yaml
---
title: "Article title"
date: 2026-09-14T09:00:00+02:00
authors:
  - denis-roio
tags:
  - bitcoin
  - privacy
summary: "A concise description for cards and metadata."
cover: cover.jpg
cover_alt: "A useful description of the cover image"
cover_caption: "Optional visible caption or credit."
social_image: social-card.png
social_image_alt: "Article title, by Display Name"
social_card:
  image: article-logo.svg
lastmod: 2026-09-15T10:00:00+02:00
draft: false
---
```

`summary`, `cover`, `cover_alt`, `cover_caption`, `social_image`, `social_image_alt`, `social_card`, and `lastmod` are optional. When a cover is present, supply meaningful alt text unless the image is purely decorative. Drafts appear locally only when Hugo is run with `--buildDrafts`.

To generate a social preview, opt the post in with `social_card.image`, pointing to an image in the same page bundle. `npm run dev` regenerates `social-card.png` as its title, first author, profile, or source image changes. `npm run build` performs the same generation before Hugo runs, so GitHub Actions always publishes a current card. The generated PNG is intentionally committed with the article assets, making it easy to inspect in review; regenerate it directly with `npm run generate:social`.

Place article images beside `index.md`. Markdown image syntax works, and the resource-aware figure shortcode adds responsive image processing and a caption:

```md
{{</* figure src="diagram.png" alt="Protocol message flow" caption="Message flow for the example protocol." wide="true" */>}}
```

Use `wide="true"` only when an image, diagram, table, or code sample benefits from exceeding the prose measure.

## Create an author

Create `content/authors/<slug>/_index.md`:

```yaml
---
title: "Display Name"
name: "stable-slug"
display_name: "Display Name"
role: "Optional role"
organisation: "Optional organisation"
bio: "Optional short biography."
avatar: avatar.jpg
website: https://example.org/
github: https://github.com/example
linkedin: https://www.linkedin.com/in/example/
mastodon: https://example.social/@example
nostr: "npub…"
email: person@example.org
---
```

Put `avatar.jpg` beside the author `_index.md`. Only populated fields are rendered. Refer to the author by slug in a post's `authors` list; do not type a display name directly into post front matter. Hugo then builds the profile at `/blog/authors/<slug>/` and lists all matching posts automatically.

## Tags

Tags are free-form slugs in post front matter. Existing tags appear at `/blog/tags/`; reuse an existing spelling before introducing a near-duplicate. Categories are intentionally not configured.

## Deployment

The `pages.yml` workflow runs on every push to `main` and can also be started manually. It installs the pinned Hugo Extended release, runs `npm ci`, builds and verifies the site, uploads `public/`, and deploys with GitHub's Pages actions.

One repository setting cannot be safely changed by the workflow's default token: if Pages has never been enabled, an administrator must select **Settings → Pages → Build and deployment → Source → GitHub Actions** once. The `github-pages` environment is then created/used by the deployment job.

The organisation's Pages site must already own the `plan-b.foundation` custom domain. GitHub applies an organisation site's custom domain to project sites, making the `blog` repository available below `/blog/`. No `CNAME` file is needed for an Actions deployment. The Hugo `baseURL`, canonical URLs, sitemap, feed links, and fingerprinted asset URLs are all fixed for that path.

## Visual system

`../vite-theme` is the authoritative visual and frontend reference. Its `DESIGN.md`, CSS tokens, page chrome, responsive behavior, logos, and civic image assets informed this implementation. The blog owns a quieter long-form layer in `frontend/styles.css`; it does not import the sibling checkout at build time. When the main visual system changes, port the relevant tokens or partial structure deliberately and review desktop and mobile output.

TailBliss was used as a starting architectural reference for Hugo, Vite, Tailwind CSS 4, and the concurrent development loop. The blog is not installed as a theme and contains no TailBliss branding, content, Alpine dependency, or generic TailBliss component layer. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and `LICENSES/` for TailBliss and bundled-font attribution.

No project-wide software licence has been declared by this repository. The Apache-2.0 text under `LICENSES/` applies to the TailBliss material identified in the third-party notice, not automatically to Plan ₿ identity assets or new project code.
