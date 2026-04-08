// Peitho Pipeline — Render
// Composites text on generated backgrounds using Puppeteer.
// Falls back to gradient backgrounds when Gemini images aren't available.

import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_PATH = path.join(__dirname, "templates", "ad.html");

// ── Build HTML from template + variant data ──────────────────────────

async function buildHTML(variant, campaign) {
  let html = await fs.readFile(TEMPLATE_PATH, "utf-8");

  const format = variant.format || { width: 1080, height: 1080 };
  const width = format.width || 1080;
  const height = format.height || 1080;
  const isStory = height > width * 1.5;

  // Background
  let bgClass = "";
  let bgContent = "";
  if (variant.backgroundPath) {
    const imgData = await fs.readFile(variant.backgroundPath);
    const b64 = imgData.toString("base64");
    bgContent = `<img src="data:image/png;base64,${b64}" />`;
  } else {
    bgClass = "ad__bg--gradient";
  }

  // Colors from campaign visual DNA
  const dns = campaign.visualDNA;
  const bgDark = dns.backgroundDark || dns.primaryDark || "#000000";
  const bgAccent = dns.accentPurple || dns.accentBlue || "#BF5AF2";
  const bgMid = dns.accentBlue || "#0071E3";
  const ctaColor = dns.accentBlue || "#0071E3";

  // Headline size scales with canvas
  const headlineSize = isStory ? 48 : width >= 1200 ? 56 : 52;

  // CTA style
  const isTextLink = ["text-link", "link", "script", "script-60s", "concept"].includes(
    variant.ctaStyle || "button"
  );

  // Brand name
  const brand = campaign.company.split(".")[0].split("—")[0].split("(")[0].trim();

  // Replace placeholders
  html = html
    .replace(/__WIDTH__/g, String(width))
    .replace(/__HEIGHT__/g, String(height))
    .replace(/__BG_DARK__/g, bgDark)
    .replace(/__BG_MID__/g, bgMid)
    .replace(/__BG_ACCENT__/g, bgAccent)
    .replace(/__CTA_COLOR__/g, ctaColor)
    .replace(/__HEADLINE_SIZE__/g, String(headlineSize))
    .replace(/__AD_CLASS__/g, isStory ? "ad--story" : "")
    .replace(/__BG_CLASS__/g, bgClass)
    .replace(/__BG_CONTENT__/g, bgContent)
    .replace(/__BRAND__/g, escapeHTML(brand))
    .replace(/__HEADLINE__/g, escapeHTML(variant.headline || ""))
    .replace(/__BODY__/g, escapeHTML(variant.bodyText || ""))
    .replace(/__CTA__/g, escapeHTML(variant.cta || ""))
    .replace(/__CTA_CLASS__/g, isTextLink ? "ad__cta--text-link" : "");

  return { html, width, height };
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Render to PNG ────────────────────────────────────────────────────

export async function renderAds(variants, campaign, outputDir) {
  console.log(`\n━━━ Rendering Ads ━━━\n`);

  const adsDir = path.join(outputDir, "ads");
  await fs.mkdir(adsDir, { recursive: true });

  // Filter to only variants that have visual platforms
  const visualVariants = variants.filter((v) => {
    const format = v.format || {};
    return (format.width || 0) > 0;
  });

  if (visualVariants.length === 0) {
    console.log("  No visual variants to render (all text-only platforms)");
    return variants;
  }

  console.log(`  Rendering ${visualVariants.length} visual ads...`);

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });

    for (const variant of visualVariants) {
      const { html, width, height } = await buildHTML(variant, campaign);
      const filename = `${variant.personaId}-${variant.platformKey}-v${variant.variantIndex}.png`;
      const filepath = path.join(adsDir, filename);

      const page = await browser.newPage();
      await page.setViewport({ width, height, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: "networkidle0" });
      await page.screenshot({ path: filepath, type: "png" });
      await page.close();

      variant.renderedPath = filepath;
      process.stdout.write(".");
    }

    console.log(` done (${visualVariants.length} PNGs)`);
  } finally {
    if (browser) await browser.close();
  }

  return variants;
}
