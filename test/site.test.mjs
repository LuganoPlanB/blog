import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const publicDir = new URL("../public/", import.meta.url);
const read = (path) => readFileSync(new URL(path, publicDir), "utf8");

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith(".html") ? [path] : [];
  });
}

function targetForPath(pathname) {
  const relative = pathname.replace(/^\/blog\/?/, "");
  if (!relative) return new URL("index.html", publicDir);
  if (/\.[a-z0-9]+$/i.test(relative)) return new URL(relative, publicDir);
  return new URL(`${relative.replace(/\/$/, "")}/index.html`, publicDir);
}

test("production output includes publishing essentials", () => {
  for (const path of [
    "index.html",
    "404.html",
    "index.xml",
    "sitemap.xml",
    "robots.txt",
    "posts/index.html",
    "authors/jaromil/index.html",
    "tags/bitcoin/index.html",
  ]) {
    assert.equal(existsSync(new URL(path, publicDir)), true, `${path} should exist`);
  }
});

test("canonical and compiled asset URLs retain the /blog base path", () => {
  const home = read("index.html");
  assert.match(home, /rel=canonical href=https:\/\/plan-b\.foundation\/blog\//);
  assert.match(home, /href=\/blog\/generated\/blog\.min\.[a-f0-9]+\.css/);
  assert.match(home, /src=\/blog\/generated\/blog\.min\.[a-f0-9]+\.js/);

  for (const file of htmlFiles(publicDir.pathname)) {
    const html = readFileSync(file, "utf8");
    assert.doesNotMatch(html, /(?:href|src)=['"]\/(?!blog\/)/, `${file} has a root-relative URL outside /blog`);
  }
});

test("every generated internal link resolves inside the artifact", () => {
  const missing = [];
  for (const file of htmlFiles(publicDir.pathname)) {
    const html = readFileSync(file, "utf8");
    for (const match of html.matchAll(/href=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g)) {
      const href = match[1] ?? match[2] ?? match[3];
      if (!href.startsWith("/blog/")) continue;
      const pathname = new URL(href, "https://plan-b.foundation").pathname;
      const target = targetForPath(pathname);
      if (!existsSync(target)) missing.push(`${file}: ${href}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("posts expose authors, tags, social metadata, and responsive media", () => {
  const home = read("index.html");
  const article = read("2026/09/introducing-bitcoin-roots/index.html");
  assert.match(home, /featured-post__media[^>]*><img src=\/blog\/2026\/09\/introducing-bitcoin-roots\/featured-cover_hu_[^ >]+\.webp/);
  assert.doesNotMatch(home, /cover-placeholder\.svg|Example cover|Replace before publication/);
  assert.match(article, /Jaromil/);
  assert.match(article, /\/blog\/authors\/jaromil\//);
  assert.match(article, /\/blog\/tags\/bitcoin\//);
  assert.match(article, /property="?og:type"? content="?article"?/);
  assert.match(article, /property="?article:published_time"?/);
  assert.match(article, /property="?og:image"? content="?https:\/\/plan-b\.foundation\/blog\/2026\/09\/introducing-bitcoin-roots\/social-card\.png"?/);
  assert.match(article, /property="?og:image:type"? content="?image\/png"?/);
  assert.match(article, /property="?og:image:width"? content="?1200"?/);
  assert.match(article, /property="?og:image:height"? content="?630"?/);
  assert.match(article, /name="?twitter:image"? content="?https:\/\/plan-b\.foundation\/blog\/2026\/09\/introducing-bitcoin-roots\/social-card\.png"?/);
  assert.match(article, /<img[^>]+srcset=/);
  assert.equal(existsSync(new URL("2026/09/introducing-bitcoin-roots/social-card.png", publicDir)), true);
  assert.equal(existsSync(new URL("2026/09/introducing-bitcoin-roots/featured-cover.png", publicDir)), true);

  const author = read("authors/jaromil/index.html");
  assert.match(author, /Articles by Jaromil/);
  assert.match(author, /Introducing Bitcoin Roots/);
});

test("Bitcoin Roots announcement preserves editorial structure and figures", () => {
  const article = read("2026/09/introducing-bitcoin-roots/index.html");
  const stylesheetPath = article.match(/href=(\/blog\/generated\/blog\.min\.[a-f0-9]+\.css)/)?.[1];

  assert.match(article, /<h1[^>]*>Introducing Bitcoin Roots<\/h1>/);
  assert.match(article, /By<\/span><a href=\/blog\/authors\/jaromil\/>Jaromil<\/a>/);
  assert.match(article, /<h2 id=filtering-is-a-local-decision>Filtering is a local decision<\/h2>/);
  assert.equal((article.match(/<blockquote class=pullquote>/g) ?? []).length, 2);
  assert.match(article, /<blockquote class=pullquote><p>Knots has served me well/);
  assert.match(article, /<blockquote class=pullquote><p>This is where I stop following Knots\./);
  assert.equal((article.match(/<figure class=wide>/g) ?? []).length, 4);
  assert.equal((article.match(/<figcaption>/g) ?? []).length, 4);
  assert.match(article, /alt="Transaction TX is refused by the local relay and mempool policy\./);
  assert.match(article, /srcset="\/blog\/2026\/09\/introducing-bitcoin-roots\/figure-filtering-local-policy_hu_/);
  assert.match(article, /class=bitcoin-roots-logo><img src=bitcoinroots-logo\.svg alt="Bitcoin Roots logo">/);
  assert.equal(existsSync(new URL("2026/09/introducing-bitcoin-roots/bitcoinroots-logo.svg", publicDir)), true);
  assert.match(read("authors/jaromil/index.html"), /<img src=\/blog\/authors\/jaromil\/avatar\.jpg/);
  assert.equal(existsSync(new URL("authors/jaromil/avatar.jpg", publicDir)), true);
  assert.ok(stylesheetPath, "the article should link its compiled stylesheet");
  const stylesheet = read(stylesheetPath.replace(/^\/blog\//, ""));
  assert.match(stylesheet, /\.prose blockquote\.pullquote\{[^}]*font-style:italic;[^}]*font-weight:500/);
  assert.match(stylesheet, /\.prose a\{[^}]*text-decoration-line:underline/);
});

test("feeds and sitemap contain canonical publication URLs", () => {
  const feed = read("index.xml");
  const sitemap = read("sitemap.xml");
  assert.equal((feed.match(/<item>/g) ?? []).length, 1);
  assert.match(feed, /https:\/\/plan-b\.foundation\/blog\/2026\/09\/introducing-bitcoin-roots\//);
  assert.match(sitemap, /https:\/\/plan-b\.foundation\/blog\/authors\/jaromil\//);
  assert.match(sitemap, /https:\/\/plan-b\.foundation\/blog\/tags\/bitcoin\//);
});

test("published output contains no TailBliss identity", () => {
  for (const file of htmlFiles(publicDir.pathname)) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /tailbliss|nusserstudios/i, file);
  }
});
