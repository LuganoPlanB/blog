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
    "authors/denis-roio/index.html",
    "tags/privacy/index.html",
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
  const article = read("2026/09/example-documenting-an-open-protocol/index.html");
  assert.match(article, /Denis Roio/);
  assert.match(article, /\/blog\/authors\/denis-roio\//);
  assert.match(article, /\/blog\/tags\/bitcoin\//);
  assert.match(article, /property="?og:type"? content="?article"?/);
  assert.match(article, /property="?article:published_time"?/);
  assert.match(article, /<img[^>]+srcset=/);

  const author = read("authors/denis-roio/index.html");
  assert.match(author, /Articles by Denis Roio/);
  assert.match(author, /Example: documenting an open protocol/);
});

test("feeds and sitemap contain canonical publication URLs", () => {
  const feed = read("index.xml");
  const sitemap = read("sitemap.xml");
  assert.equal((feed.match(/<item>/g) ?? []).length, 3);
  assert.match(feed, /https:\/\/plan-b\.foundation\/blog\/2026\/09\/example-documenting-an-open-protocol\//);
  assert.match(sitemap, /https:\/\/plan-b\.foundation\/blog\/authors\/denis-roio\//);
  assert.match(sitemap, /https:\/\/plan-b\.foundation\/blog\/tags\/privacy\//);
});

test("published output contains no TailBliss identity", () => {
  for (const file of htmlFiles(publicDir.pathname)) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /tailbliss|nusserstudios/i, file);
  }
});
