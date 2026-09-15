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
      <dc:source>scripts/generate-publication-images.mjs</dc:source>
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

async function writeGeneratedImage(outputPath, buffer) {
  const previous = await existing(outputPath) ? await readFile(outputPath) : null;
  const changed = !previous || !previous.equals(buffer);
  if (changed) {
    await mkdir(resolve(outputPath, ".."), { recursive: true });
    await writeFile(outputPath, buffer);
  }
  return { outputPath, changed };
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
  const card = typeof post.social_card === "object" ? post.social_card : {};
  const featuredCard = typeof post.featured_card === "object" ? post.featured_card : {};
  const bundleEntries = await readdir(postDir, { withFileTypes: true });
  const sourceImages = bundleEntries.filter((entry) => (
    entry.isFile()
    && /\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(entry.name)
    && !/^(?:social-card|featured-cover)\.png$/i.test(entry.name)
  ));
  const configuredSource = card.image || featuredCard.image || post.cover;
  const automaticSource = sourceImages.length === 1 ? sourceImages[0].name : null;
  if (!configuredSource && !automaticSource) return null;

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

  const featurePath = join(postDir, configuredSource || automaticSource);
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
          Software: "scripts/generate-publication-images.mjs",
        },
      },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const results = [await writeGeneratedImage(outputPath, png)];
  if (!post.cover) {
    const featuredOutputName = post.featured_image || "featured-cover.png";
    if (featuredOutputName !== featuredOutputName.split(/[\\/]/).at(-1)) {
      throw new Error(`featured_image in ${relative(root, postPath)} must be a bundle filename`);
    }
    const featuredSourcePath = join(postDir, featuredCard.image || card.image || automaticSource || "");
    if (!(await existing(featuredSourcePath))) {
      throw new Error(`Featured-card image not found: ${relative(root, featuredSourcePath)}`);
    }
    const featuredImage = featuredSourcePath === featurePath
      ? featureImage
      : await dataUri(featuredSourcePath);
    const featuredMode = featuredCard.mode || (extname(featuredSourcePath).toLowerCase() === ".svg" ? "logo" : "image");
    const featuredSvg = featuredMode === "image" ? `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
        <defs>
          <linearGradient id="signal-route" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#ffb604"/>
            <stop offset="0.34" stop-color="#ff5db1"/>
            <stop offset="0.68" stop-color="#7468ff"/>
            <stop offset="1" stop-color="#23f5ff"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="675" fill="#082952"/>
        <image href="${featuredImage}" width="1200" height="675" preserveAspectRatio="xMidYMid slice"/>
        <rect width="1200" height="675" fill="#082952" fill-opacity="0.12"/>
        <path d="M0 611H318C388 611 400 576 470 576H1200" fill="none" stroke="#082952" stroke-width="18" stroke-opacity="0.48"/>
        <path d="M0 611H318C388 611 400 576 470 576H1200" fill="none" stroke="url(#signal-route)" stroke-width="8" stroke-linecap="round"/>
        <rect x="22" y="22" width="1156" height="631" rx="16" fill="none" stroke="#fffefa" stroke-width="2" stroke-opacity="0.55"/>
      </svg>` : `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
        <defs>
          <linearGradient id="signal-route" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#ffb604"/>
            <stop offset="0.34" stop-color="#ff5db1"/>
            <stop offset="0.68" stop-color="#7468ff"/>
            <stop offset="1" stop-color="#23f5ff"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="675" fill="#082952"/>
        <circle cx="612" cy="337.5" r="252" fill="#f3f9ff"/>
        <circle cx="612" cy="337.5" r="288" fill="none" stroke="#4f97e9" stroke-width="2" stroke-opacity="0.28"/>
        <circle cx="612" cy="337.5" r="327" fill="none" stroke="#4f97e9" stroke-width="1" stroke-opacity="0.18"/>

        <g fill="none" stroke="#4f97e9" stroke-width="3" stroke-linecap="round" stroke-opacity="0.5">
          <path d="M0 158H178C234 158 244 215 300 215H360"/>
          <path d="M0 526H172C232 526 246 458 306 458H364"/>
          <path d="M840 208H915C970 208 982 145 1037 145H1200"/>
          <path d="M841 468H920C972 468 991 530 1043 530H1200"/>
          <path d="M222 0V62C222 106 268 112 268 156"/>
          <path d="M1005 675V615C1005 574 963 565 963 524"/>
        </g>
        <g fill="#082952" stroke="#23f5ff" stroke-width="3">
          <circle cx="178" cy="158" r="9"/><circle cx="300" cy="215" r="9"/>
          <circle cx="172" cy="526" r="9"/><circle cx="306" cy="458" r="9"/>
          <circle cx="915" cy="208" r="9"/><circle cx="1037" cy="145" r="9"/>
          <circle cx="920" cy="468" r="9"/><circle cx="1043" cy="530" r="9"/>
        </g>
        <path d="M0 337.5H330C390 337.5 404 302 464 302H756C816 302 830 337.5 890 337.5H1200" fill="none" stroke="url(#signal-route)" stroke-width="8" stroke-linecap="round"/>
        <circle cx="612" cy="337.5" r="191" fill="#fffefa"/>
        <image href="${featuredImage}" x="447" y="172.5" width="330" height="330" preserveAspectRatio="xMidYMid meet"/>
      </svg>`;
    const featuredPng = await sharp(Buffer.from(featuredSvg))
      .withMetadata({
        exif: {
          IFD0: {
            ImageDescription: "Generated featured artwork from the configured article bundle image.",
            Software: "scripts/generate-publication-images.mjs",
          },
        },
      })
      .png({ compressionLevel: 9 })
      .toBuffer();
    results.push(await writeGeneratedImage(join(postDir, featuredOutputName), featuredPng));
  }
  return results;
}

async function generateAll() {
  const files = await postFiles();
  const results = (await Promise.all(files.map(generateCard))).filter(Boolean).flat();
  for (const result of results) {
    const status = result.changed ? "generated" : "unchanged";
    console.log(`[publication-image] ${status} ${relative(root, result.outputPath)}`);
  }
  if (results.length === 0) console.log("[publication-image] no opted-in posts");
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
      console.error(`[publication-image] ${error.stack || error.message}`);
    } finally {
      running = false;
      if (queued) {
        queued = false;
        await refresh();
      }
    }
  };
  const schedule = (_event, filename = "") => {
    if (/\/(?:social-card|featured-cover)\.png$/.test(`/${String(filename)}`)) return;
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
  console.log("[publication-image] watching post, author, and shared identity assets");
  await new Promise(() => {});
}
