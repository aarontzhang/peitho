#!/usr/bin/env node

// Direct Apple campaign generator — single-pass, no fragile multi-step pipeline.
// One Claude call per persona → render ads → compile PDF.

import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const anthropic = new Anthropic();
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = "claude-sonnet-4-20250514";
const GEMINI_MODEL = "gemini-3.1-flash-image-preview";

// ── Load campaign ───────────────────────────────────────────────────

const { campaign, personas } = await import("../campaigns/apple.mjs");

const outputDir = path.join(__dirname, "output", `apple-direct-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}`);
await fs.mkdir(path.join(outputDir, "ads"), { recursive: true });

console.log(`\n  Output: ${outputDir}\n`);

// ── Platform specs ──────────────────────────────────────────────────

const PLATFORMS = {
  linkedin: { name: "LinkedIn Sponsored Post", w: 1200, h: 627, copyLimit: 150, headlineLimit: 70, cta: "button" },
  instagram_feed: { name: "Instagram Feed Ad", w: 1080, h: 1080, copyLimit: 125, headlineLimit: 40, cta: "button" },
  instagram_story: { name: "Instagram Story Ad", w: 1080, h: 1920, copyLimit: 100, headlineLimit: 0, cta: "swipe-up" },
  reddit: { name: "Reddit Promoted Post", w: 1200, h: 628, copyLimit: 300, headlineLimit: 120, cta: "link" },
  hackernews: { name: "Hacker News", w: 0, h: 0, copyLimit: 80, headlineLimit: 80, cta: "text-link" },
  newsletter: { name: "Newsletter Sponsored Placement", w: 600, h: 300, copyLimit: 200, headlineLimit: 60, cta: "link" },
  trade_publication: { name: "Trade Publication", w: 728, h: 90, copyLimit: 500, headlineLimit: 70, cta: "link" },
  youtube_shorts: { name: "YouTube Shorts Ad", w: 1080, h: 1920, copyLimit: 100, headlineLimit: 0, cta: "overlay" },
  podcast: { name: "Podcast Host-Read Ad (60s)", w: 0, h: 0, copyLimit: 0, headlineLimit: 0, cta: "script-60s" },
  tiktok: { name: "TikTok In-Feed Ad", w: 1080, h: 1920, copyLimit: 100, headlineLimit: 0, cta: "overlay" },
  slack_discord: { name: "Slack/Discord Community", w: 0, h: 0, copyLimit: 250, headlineLimit: 0, cta: "text-link" },
};

// ── Generate all content per persona (1 API call each) ──────────────

const allResults = [];

for (const persona of personas) {
  console.log(`▸ ${persona.id}...`);

  const prompt = `You are Peitho, an expert AI ad strategist. Generate a complete advertising plan for one persona.

## Product
${campaign.product}
Company: ${campaign.company}
Voice: ${campaign.visualDNA.voice}

## Competitors
${campaign.competitors.join("\n")}

## Current Pain
${campaign.currentPain}

## Target Persona
ID: ${persona.id}
Role: ${persona.role}
Segment: ${persona.segment}
Info processing: ${persona.cognition.informationProcessing}
Risk orientation: ${persona.cognition.riskOrientation}
Proof hierarchy: ${persona.cognition.proofHierarchy.join(" > ")}

## Real Objections (what they actually think, not what they say)
${persona.objections.real.map((o) => `- ${o}`).join("\n")}

## Anti-Patterns (messaging that BACKFIRES)
${persona.antiPatterns.map((a) => `- ${a}`).join("\n")}

## Communication Preferences
Format: ${persona.communication.preferredFormat}
Social proof: ${persona.communication.socialProofType}
Attention window: ${persona.communication.attentionWindow}

---

Generate:

1. **3 platforms** — pick the best platforms for THIS persona. At least 1 must be unconventional (newsletter, podcast, reddit, hackernews, trade_publication, slack_discord).

2. **1 ad per platform** (3 total) — each ad must use a DIFFERENT emotional angle. Use the persona's natural vocabulary. Address a REAL objection (not surface). Match the platform's content grammar.

Available platform keys: ${Object.keys(PLATFORMS).join(", ")}

Output valid JSON only (no markdown, no backticks):
{
  "personaId": "${persona.id}",
  "platforms": [
    {
      "platformKey": string,
      "platformName": string,
      "ad": {
        "copy": string (the ad copy — 2-3 sentences max, punchy and natural),
        "visualConcept": string (2-3 sentences describing the ideal background image)
      }
    }
  ]
}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 3000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text;
  let result;
  try {
    result = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        result = JSON.parse(match[0]);
      } catch {
        result = JSON.parse(match[0].replace(/,\s*([\]}])/g, "$1"));
      }
    }
  }

  allResults.push({ persona, ...result });
  console.log(`  ✓ ${result.platforms.map((p) => p.platformKey).join(", ")}`);
  console.log(`    copy samples: ${result.platforms.map((p) => p.ad.copy?.slice(0, 40) + "...").join(" | ")}`);
}

// ── Generate background images via Gemini ───────────────────────────

console.log(`\nGenerating visuals...`);

for (const result of allResults) {
  for (const plat of result.platforms) {
    const spec = PLATFORMS[plat.platformKey];
    if (!spec || spec.w === 0) {
      plat.adImagePath = null;
      continue;
    }

    try {
      const model = genai.getGenerativeModel({ model: GEMINI_MODEL });
      const imagePrompt = `${plat.ad.visualConcept}

Style: ${campaign.visualDNA.aesthetic}
Dimensions: ${spec.w}x${spec.h}
Colors: whites, blacks, accent blue #0071E3, accent purple #BF5AF2
Background: dark, clean, minimal

IMPORTANT: Do NOT include any text, words, or typography. Background image only.`;

      const genResult = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `Generate an image: ${imagePrompt}` }] }],
        generationConfig: { responseModalities: ["image", "text"] },
      });

      const parts = genResult.response.candidates?.[0]?.content?.parts || [];
      let saved = false;
      for (const part of parts) {
        if (part.inlineData) {
          const buf = Buffer.from(part.inlineData.data, "base64");
          const filename = `${result.persona.id}-${plat.platformKey}-bg.png`;
          plat.bgImagePath = path.join(outputDir, "ads", filename);
          await fs.writeFile(plat.bgImagePath, buf);
          saved = true;
          break;
        }
      }
      if (!saved) plat.bgImagePath = null;
      console.log(`  ${result.persona.id}/${plat.platformKey}: ${saved ? "✓" : "gradient fallback"}`);
    } catch (err) {
      console.log(`  ${result.persona.id}/${plat.platformKey}: gradient fallback (${err.message.slice(0, 60)})`);
      plat.bgImagePath = null;
    }
  }
}

// ── No Puppeteer text overlay — Gemini images are used directly ─────

const browser = await puppeteer.launch({ headless: true });

// ── Generate PDF Report ─────────────────────────────────────────────

console.log(`\nCompiling PDF...`);

let pdfHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, sans-serif;
    color: #1D1D1F;
    background: #FFFFFF;
    -webkit-font-smoothing: antialiased;
    padding: 0;
  }

  .cover {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #000 0%, #1D1D1F 50%, #0071E3 100%);
    color: white;
    text-align: center;
    page-break-after: always;
  }

  .cover h1 {
    font-size: 64px;
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 16px;
  }

  .cover h2 {
    font-size: 24px;
    font-weight: 400;
    opacity: 0.7;
  }

  .cover .date {
    margin-top: 40px;
    font-size: 14px;
    opacity: 0.5;
  }

  .cover .by {
    margin-top: 8px;
    font-size: 14px;
    opacity: 0.4;
  }

  .persona-section {
    page-break-before: always;
    padding: 60px 80px;
  }

  .persona-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #0071E3;
    margin-bottom: 8px;
  }

  .persona-role {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 2px solid #E5E5E7;
  }

  .ad-block {
    page-break-inside: avoid;
    margin-bottom: 48px;
  }

  .ad-block__platform {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #6E6E73;
    margin-bottom: 12px;
  }

  .ad-block__image {
    width: 100%;
    max-height: 500px;
    object-fit: contain;
    background: #000;
    border-radius: 12px;
    display: block;
    margin-bottom: 16px;
  }

  .ad-block__copy {
    font-size: 16px;
    line-height: 1.6;
    color: #1D1D1F;
    max-width: 640px;
  }
</style>
</head>
<body>

<div class="cover">
  <h1>Apple Intelligence</h1>
  <h2>Campaign Simulation Report</h2>
  <div class="date">${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  <div class="by">Generated by Peitho</div>
</div>
`;

for (const result of allResults) {
  const p = result.persona;

  pdfHTML += `
<div class="persona-section">
  <div class="persona-label">ICP: ${p.id.replace(/-/g, " ")}</div>
  <div class="persona-role">${p.role}</div>
`;

  for (const plat of result.platforms) {
    let imgTag = "";
    if (plat.bgImagePath) {
      const imgData = await fs.readFile(plat.bgImagePath);
      imgTag = `<img class="ad-block__image" src="data:image/png;base64,${imgData.toString("base64")}" />`;
    }

    pdfHTML += `
  <div class="ad-block">
    <div class="ad-block__platform">${plat.platformName || PLATFORMS[plat.platformKey]?.name || plat.platformKey}</div>
    ${imgTag}
    <div class="ad-block__copy">${plat.ad.copy || ""}</div>
  </div>
`;
  }

  pdfHTML += `</div>\n`;
}

pdfHTML += `</body></html>`;

// Save HTML and render PDF
const htmlPath = path.join(outputDir, "report.html");
await fs.writeFile(htmlPath, pdfHTML);

const pdfPath = path.join(outputDir, "Apple_Intelligence_Campaign.pdf");
const page = await browser.newPage();
await page.setContent(pdfHTML, { waitUntil: "networkidle0", timeout: 30000 });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "0", bottom: "0", left: "0", right: "0" },
});
await page.close();
await browser.close();

// Save raw JSON too
await fs.writeFile(path.join(outputDir, "data.json"), JSON.stringify(allResults, null, 2));

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`  Done.`);
console.log(`  PDF:  ${pdfPath}`);
console.log(`  HTML: ${htmlPath}`);
console.log(`  Data: ${path.join(outputDir, "data.json")}`);
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
