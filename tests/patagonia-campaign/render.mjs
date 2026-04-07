import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRIEF_DIR = path.join(__dirname, "briefs");
const OUTPUT_DIR = path.join(__dirname, "output");
const BG_DIR = path.join(__dirname, "backgrounds");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY not set");
  process.exit(1);
}

// ── Gemini image generation prompts per persona ─────────────────────
const BG_PROMPTS = {
  "corp-sustainability-director":
    "A dramatic aerial photograph of a vast old-growth forest canopy at dawn, mist weaving between ancient trees, shot from above. Deep greens and blues, moody, cinematic. No text, no people, no logos.",
  "outdoor-tech-professional":
    "A long-exposure photograph of a rugged granite mountain face at twilight, sharp alpine ridgeline against a deep indigo sky with faint stars beginning to appear. No text, no people, no logos.",
  "values-driven-founder":
    "A single small campfire on a dark rocky beach at dusk, ocean waves in the background, warm orange light against deep blue darkness. Intimate, quiet, real. No text, no people, no logos.",
  "retail-category-manager":
    "An abstract overhead photograph of stacked folded outdoor jackets in earth tones — deep blue, forest green, burnt orange — filling the frame edge to edge. Clean, textural, editorial. No text, no people, no logos.",
  "hr-people-director":
    "A wide landscape photograph of a mountain meadow at golden hour, wildflowers in foreground, snow-capped peaks in soft focus behind. Warm and inviting but not saccharine. No text, no people, no logos.",
};

// ── Subline: pulled from brief content, not hand-written taglines ───
function getSubline(brief) {
  // Use the provocativeHook if available (it's the most substantive)
  if (brief.creative.provocativeHook) return brief.creative.provocativeHook;
  // For data personas, use the stat + label
  if (brief.creative.statNumber && brief.creative.statLabel) {
    return `${brief.creative.statNumber} ${brief.creative.statLabel}`;
  }
  // Fallback: first sentence of post text
  const first = brief.creative.postText?.split(/[.\n]/)[0];
  return first || "";
}

// ── Generate background image via Gemini ────────────────────────────
async function generateBackground(personaId) {
  const cachedPath = path.join(BG_DIR, `${personaId}.png`);

  // Use cached if exists
  try {
    await fs.access(cachedPath);
    console.log(`    ↳ Using cached background`);
    return cachedPath;
  } catch {}

  const prompt = BG_PROMPTS[personaId];
  if (!prompt) return null;

  console.log(`    ↳ Generating background via Gemini...`);

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate a 1080x1080 background image for a LinkedIn post. ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ["IMAGE"],
        },
      }),
    }
  );

  if (!resp.ok) {
    const err = await resp.text();
    console.error(`    ✗ Gemini error: ${err.slice(0, 200)}`);
    return null;
  }

  const data = await resp.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find((p) => p.inlineData);

  if (!imgPart) {
    console.error(`    ✗ No image in Gemini response`);
    return null;
  }

  const buf = Buffer.from(imgPart.inlineData.data, "base64");
  await fs.writeFile(cachedPath, buf);
  console.log(`    ✓ Background saved: ${cachedPath}`);
  return cachedPath;
}

// ── Build overlay HTML (text + logo on transparent bg) ──────────────
function buildOverlayHTML(brief, subline, bgBase64) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px;
    height: 1080px;
    overflow: hidden;
    font-family: 'Inter', -apple-system, sans-serif;
  }
  .ad {
    position: relative;
    width: 1080px;
    height: 1080px;
    overflow: hidden;
  }
  .bg {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(10, 15, 30, 0.75) 0%,
      rgba(10, 15, 30, 0.45) 40%,
      rgba(10, 15, 30, 0.35) 60%,
      rgba(10, 15, 30, 0.7) 100%
    );
  }
  .content {
    position: relative;
    z-index: 2;
    padding: 80px 80px 72px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .brand {
    font-size: 36px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 12px;
    text-transform: uppercase;
  }
  .middle {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .headline {
    font-size: 82px;
    font-weight: 800;
    color: #fff;
    line-height: 1.05;
    letter-spacing: -3px;
    max-width: 850px;
    text-shadow: 0 2px 40px rgba(0,0,0,0.5);
  }
  .subline {
    font-size: 26px;
    font-weight: 500;
    color: rgba(255,255,255,0.75);
    max-width: 650px;
    line-height: 1.45;
    margin-top: 32px;
    text-shadow: 0 1px 20px rgba(0,0,0,0.4);
  }
  .bottom {
    display: flex;
    justify-content: flex-end;
  }
  .subtext {
    font-size: 18px;
    font-weight: 600;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.5px;
  }
</style></head>
<body>
<div class="ad">
  <img class="bg" src="data:image/png;base64,${bgBase64}" />
  <div class="overlay"></div>
  <div class="content">
    <div class="brand">Patagonia</div>
    <div class="middle">
      <div class="headline">${brief.creative.headline}</div>
      <div class="subline">${subline}</div>
    </div>
    <div class="bottom">
      <div class="subtext">${brief.creative.subtext || "patagonia.com"}</div>
    </div>
  </div>
</div>
</body></html>`;
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log("\n━━━ Peitho Render — Patagonia Campaign ━━━\n");

  await fs.mkdir(BG_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const briefFiles = (await fs.readdir(BRIEF_DIR)).filter((f) => f.endsWith(".json"));
  if (briefFiles.length === 0) {
    console.error("No briefs found. Run generate.mjs first.");
    process.exit(1);
  }

  console.log(`Found ${briefFiles.length} briefs to render.\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const file of briefFiles) {
    const brief = JSON.parse(await fs.readFile(path.join(BRIEF_DIR, file), "utf-8"));
    const personaId = brief.personaId;

    console.log(`  ▸ ${personaId}`);
    console.log(`    Headline: "${brief.creative.headline}"`);

    // Step 1: Generate background via Gemini
    const bgPath = await generateBackground(personaId);
    if (!bgPath) {
      console.log(`    ✗ Skipping — no background generated\n`);
      continue;
    }

    // Step 2: Composite text overlay via Puppeteer
    const bgBuffer = await fs.readFile(bgPath);
    const bgBase64 = bgBuffer.toString("base64");
    const subline = getSubline(brief);
    const html = buildOverlayHTML(brief, subline, bgBase64);

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");

    const outPath = path.join(OUTPUT_DIR, `${personaId}-post.png`);
    await page.screenshot({
      path: outPath,
      type: "png",
      clip: { x: 0, y: 0, width: 1080, height: 1080 },
    });

    await page.close();
    console.log(`    ✓ Saved: ${outPath}\n`);
  }

  await browser.close();
  console.log(`━━━ Done — ${briefFiles.length} posts rendered ━━━\n`);
}

main().catch((err) => {
  console.error("Render failed:", err);
  process.exit(1);
});
