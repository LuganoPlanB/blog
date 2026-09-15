import { watch } from "node:fs";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";
import { parse } from "yaml";

// impeccable-disable overused-font -- Inter is the established Plan B type system.

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const postsRoot = join(root, "content", "posts");
const authorsRoot = join(root, "content", "authors");
const brandLogoPath = join(root, "static", "images", "planb-logo-wide-black.svg");
const fontPath = join(
  root,
  "node_modules",
  "@fontsource-variable",
  "inter",
  "files",
  "inter-latin-wght-normal.woff2",
);
const outputWidth = 1200;
const outputHeight = 630;
const provenance = `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
      <dc:format>image/png</dc:format>
      <dc:source>scripts/generate-social-cards.mjs</dc:source>
      <dc:description>Generated from the post and author front matter, author avatar, Plan B identity asset, and configured article bundle image.</dc:description>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

function frontMatter(source, path) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${relative(root, path)} has no YAML front matter`);
  return parse(match[1]);
}

function escapeXml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function mimeType(path) {
  switch (extname(path).toLowerCase()) {
    case ".svg": return "image/svg+xml";
    case ".png": return "image/png";
    case ".webp": return "image/webp";
    case ".gif": return "image/gif";
    case ".avif": return "image/avif";
    default: return "image/jpeg";
  }
}

async function dataUri(path) {
  const contents = await readFile(path);
  return `data:${mimeType(path)};base64,${contents.toString("base64")}`;
}

async function existing(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function wrapTitle(title) {
  const words = String(title).trim().split(/\s+/);
  const maxCharacters = title.length > 54 ? 19 : 23;
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && candidate.length > maxCharacters && lines.length < 2) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);

  if (lines.length > 3) {
    lines[2] = `${lines.slice(2).join(" ").replace(/[.\s]+$/, "")}…`;
    lines.length = 3;
  }
  return lines;
}

async function postFiles() {
  const entries = await readdir(postsRoot, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const path = join(postsRoot, entry.name, "index.md");
    if (await existing(path)) files.push(path);
  }
  return files;
}

async function generateCard(postPath) {
  const postDir = resolve(postPath, "..");
  const post = frontMatter(await readFile(postPath, "utf8"), postPath);
  if (!post.social_card) return null;

  const card = typeof post.social_card === "object" ? post.social_card : {};
  const outputName = post.social_image || "social-card.png";
  if (outputName !== outputName.split(/[\\/]/).at(-1)) {
    throw new Error(`social_image in ${relative(root, postPath)} must be a bundle filename`);
  }

  const authorSlug = post.authors?.[0];
  if (!authorSlug) throw new Error(`${relative(root, postPath)} needs at least one author`);
  const authorPath = join(authorsRoot, authorSlug, "_index.md");
  const author = frontMatter(await readFile(authorPath, "utf8"), authorPath);
  const displayName = author.display_name || author.title || author.name || authorSlug;
  const authorDetail = card.author_detail || author.role || author.organisation || "";

  const featurePath = join(postDir, card.image || post.cover || "");
  if (!card.image && !post.cover) {
    throw new Error(`${relative(root, postPath)} social_card needs an image`);
  }
  if (!(await existing(featurePath))) {
    throw new Error(`Social-card image not found: ${relative(root, featurePath)}`);
  }

  const avatarPath = author.avatar ? join(authorsRoot, authorSlug, author.avatar) : null;
  const [brandLogo, featureImage, avatar, font] = await Promise.all([
    dataUri(brandLogoPath),
    dataUri(featurePath),
    avatarPath && await existing(avatarPath) ? dataUri(avatarPath) : null,
    readFile(fontPath),
  ]);
  const titleLines = wrapTitle(post.title);
  const titleSize = titleLines.length === 1 ? 78 : titleLines.length === 2 ? 72 : 60;
  const titleLeading = Math.round(titleSize * 1.04);
  const titleY = titleLines.length === 1 ? 284 : titleLines.length === 2 ? 236 : 207;
  const titleMarkup = titleLines.map((line, index) => (
    `<tspan x="68" dy="${index === 0 ? 0 : titleLeading}">${escapeXml(line)}</tspan>`
  )).join("");
  const avatarMarkup = avatar
    ? `<image href="${avatar}" x="68" y="482" width="64" height="64" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatar-clip)"/>`
    : `<circle cx="100" cy="514" r="32" fill="#082952"/><text x="100" y="525" text-anchor="middle" class="avatar-letter">${escapeXml(displayName.slice(0, 1))}</text>`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${outputWidth}" height="${outputHeight}" viewBox="0 0 ${outputWidth} ${outputHeight}">
      <defs>
        <style>
          @font-face { font-family: Inter; src: url(data:font/woff2;base64,${font.toString("base64")}) format("woff2"); font-weight: 100 900; }
          text { font-family: Inter, Arial, sans-serif; } /* impeccable-disable-line overused-font -- Inter is the established Plan B type system */
          .title { fill: #030b20; font-size: ${titleSize}px; font-weight: 800; letter-spacing: -2.2px; }
          .author { fill: #082952; font-size: 25px; font-weight: 750; }
          .author-detail { fill: #526075; font-size: 18px; font-weight: 500; }
          .blog { fill: #082952; font-size: 18px; font-weight: 800; letter-spacing: 1.5px; }
          .url { fill: #526075; font-size: 17px; font-weight: 650; }
          .avatar-letter { fill: #fffefa; font-size: 28px; font-weight: 800; }
        </style>
        <linearGradient id="signal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#ffb604"/>
          <stop offset="0.34" stop-color="#ff5db1"/>
          <stop offset="0.68" stop-color="#7468ff"/>
          <stop offset="1" stop-color="#23f5ff"/>
        </linearGradient>
        <clipPath id="avatar-clip"><circle cx="100" cy="514" r="32"/></clipPath>
      </defs>
      <rect width="1200" height="630" fill="#fffefa"/>
      <rect x="824" width="376" height="630" fill="#f3f9ff"/>
      <rect x="824" width="6" height="630" fill="#4f97e9" fill-opacity="0.2"/>
      <image href="${brandLogo}" x="68" y="50" width="236" height="61"/>
      <text x="329" y="87" class="blog">BLOG</text>
      <rect x="68" y="153" width="112" height="6" rx="3" fill="url(#signal)"/>
      <text x="68" y="${titleY}" class="title">${titleMarkup}</text>
      ${avatarMarkup}
      <text x="151" y="508" class="author">${escapeXml(displayName)}</text>
      <text x="151" y="536" class="author-detail">${escapeXml(authorDetail)}</text>
      <text x="68" y="592" class="url">plan-b.foundation/blog</text>
      <circle cx="1012" cy="295" r="153" fill="#fffefa"/>
      <image href="${featureImage}" x="882" y="165" width="260" height="260" preserveAspectRatio="xMidYMid meet"/>
      <rect x="899" y="488" width="226" height="2" rx="1" fill="#4f97e9" fill-opacity="0.32"/>
      <text x="1012" y="526" text-anchor="middle" class="url">${escapeXml(card.label || "Plan B Foundation")}</text>
    </svg>`;

  const outputPath = join(postDir, outputName);
  const png = await sharp(Buffer.from(svg))
    .withMetadata({
      xmp: provenance,
      exif: {
        IFD0: {
          ImageDescription: "Generated from article and author data with Plan B identity assets.",
          Software: "scripts/generate-social-cards.mjs",
        },
      },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const previous = await existing(outputPath) ? await readFile(outputPath) : null;
  const changed = !previous || !previous.equals(png);
  if (changed) {
    await mkdir(postDir, { recursive: true });
    await writeFile(outputPath, png);
  }
  return { outputPath, changed };
}

async function generateAll() {
  const files = await postFiles();
  const results = (await Promise.all(files.map(generateCard))).filter(Boolean);
  for (const result of results) {
    const status = result.changed ? "generated" : "unchanged";
    console.log(`[social-card] ${status} ${relative(root, result.outputPath)}`);
  }
  if (results.length === 0) console.log("[social-card] no opted-in posts");
}

await generateAll();

if (process.argv.includes("--watch")) {
  let timeout;
  let running = false;
  let queued = false;
  const refresh = async () => {
    if (running) {
      queued = true;
      return;
    }
    running = true;
    try {
      await generateAll();
    } catch (error) {
      console.error(`[social-card] ${error.stack || error.message}`);
    } finally {
      running = false;
      if (queued) {
        queued = false;
        await refresh();
      }
    }
  };
  const schedule = (_event, filename = "") => {
    if (String(filename).endsWith("social-card.png")) return;
    clearTimeout(timeout);
    timeout = setTimeout(refresh, 120);
  };
  const watchers = [postsRoot, authorsRoot, join(root, "static", "images")]
    .map((path) => watch(path, { recursive: true }, schedule));
  const stop = () => {
    clearTimeout(timeout);
    for (const watcher of watchers) watcher.close();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  console.log("[social-card] watching post, author, and shared identity assets");
  await new Promise(() => {});
}
