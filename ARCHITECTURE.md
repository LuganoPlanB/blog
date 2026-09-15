# Architecture

## Decision summary

The blog is a self-contained Hugo site rather than a child theme or Hugo module. TailBliss informed the build loop—Vite compiles Tailwind and a small JavaScript entry before Hugo renders—but its templates, visual components, Alpine dependency, and content conventions were discarded.

`../vite-theme` remains the visual authority. Its normative palette, typography, spacing, responsive thresholds, header/footer character, and interaction treatment are translated into blog-specific tokens in `frontend/styles.css`. The blog does not import the sibling repository at build time, so a checkout is reproducible on GitHub Actions; visual changes are ported deliberately and reviewed here.

## Asset pipeline

```text
frontend/main.js + frontend/styles.css
                │
                ▼
        Vite + Tailwind CSS 4
                │
                ▼
      assets/generated/{blog.js,blog.css}
                │
                ▼
      Hugo minify + SHA-384 fingerprint
                │
                ▼
         public/blog-ready output
```

The generated Vite files are ignored by Git. Hugo owns their public URLs through `resources.Get`, so `RelPermalink` includes `/blog/` and the final names are content-hashed.

Opted-in post bundles also receive a generated `social-card.png`. A small Node script reads post and author front matter, composes the article title, author identity, and selected bundle image using the Plan ₿ visual tokens, and rasterizes the result to 1200×630 with Sharp. It runs once before every production build and as a watcher alongside Hugo and Vite during `npm run dev`; Hugo emits the final absolute OpenGraph and Twitter metadata.

## Content model

Posts are Hugo leaf bundles under `content/posts/<slug>/index.md`; article-specific images live beside the Markdown. `authors` and `tags` are taxonomies. An author term is backed by `content/authors/<slug>/_index.md`, which makes the taxonomy URL both a structured profile and the automatic list of that author's posts.

Categories are intentionally absent. They can be added later only if the editorial distinction from tags becomes concrete.

## JavaScript boundary

The only client module manages the appearance preference. Navigation, pagination, author relationships, images, metadata, and article rendering work without JavaScript.

## Deployment boundary

Hugo's production `baseURL` is fixed at `https://plan-b.foundation/blog/`. The GitHub Pages workflow builds `public/`, verifies generated contracts, uploads the artifact, and deploys from `main`. Repository administrators must select **Settings → Pages → Source → GitHub Actions** once if Pages has not previously been enabled.
