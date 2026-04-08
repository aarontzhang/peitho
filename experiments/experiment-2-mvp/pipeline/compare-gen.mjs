// Generates Spotify ad backgrounds via Gemini (Nano Banana),
// then composites brand assets (logo, icon) on top using Puppeteer,
// and marks text placement zones. Builds HTML comparison page.
//
// 5 "old" (generic prompt, generic layout) vs 5 "new" (design system rules)

import { GoogleGenerativeAI } from "@google/generative-ai";
import puppeteer from "puppeteer";
import fs from "fs/promises";
import path from "path";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = "gemini-2.5-flash-image";
const OUT = path.join(import.meta.dirname, "compare-output");
const ASSETS = path.join(OUT, "assets");

// ── Spotify Brand ───────────────────────────────────────────────────
const brand = {
  green: "#1DB954",
  black: "#191414",
  darkGray: "#121212",
};

// ── Platforms ────────────────────────────────────────────────────────
const platforms = [
  { key: "ig-feed",    name: "Instagram Feed",  w: 1080, h: 1080 },
  { key: "linkedin",   name: "LinkedIn",        w: 1200, h: 627  },
  { key: "ig-story",   name: "Instagram Story", w: 1080, h: 1920 },
  { key: "display",    name: "Google Display",  w: 1200, h: 628  },
  { key: "newsletter", name: "Newsletter",      w: 600,  h: 300  },
];

// ── OLD prompts (generic, no design system rules) ───────────────────
const oldPrompts = [
  `A vibrant music-themed background for a Spotify ad. Colorful and energetic with musical elements. Style: Bold, vibrant, music-forward. Aspect ratio: 1080x1080. Color palette: use these colors subtly — #1DB954, #191414. Background: #191414. IMPORTANT: Do NOT include any text, words, letters, or typography in the image.`,

  `A professional music streaming background for a Spotify ad. Style: Bold, vibrant, music-forward. Aspect ratio: 1200x627. Color palette: use these colors subtly — #1DB954, #191414. Background: #191414. IMPORTANT: Do NOT include any text, words, letters, or typography in the image.`,

  `An energetic vertical background for a Spotify ad showing musical energy and movement. Style: Bold, vibrant, music-forward. Aspect ratio: 1080x1920. Color palette: use these colors subtly — #1DB954, #191414. Background: #191414. IMPORTANT: Do NOT include any text, words, letters, or typography in the image.`,

  `A wide banner background for Spotify with music vibes. Style: Bold, vibrant. Aspect ratio: 1200x628. Color palette: use these colors subtly — #1DB954, #191414. Background: #191414. IMPORTANT: Do NOT include any text, words, letters, or typography in the image.`,

  `A small background image for a Spotify newsletter ad. Musical and colorful. Style: Bold, vibrant. Aspect ratio: 600x300. Color palette: use these colors subtly — #1DB954, #191414. Background: #191414. IMPORTANT: Do NOT include any text, words, letters, or typography in the image.`,
];

// ── NEW prompts (design system: specific preset, quiet zones, color discipline) ──
const newPrompts = [
  // ig-feed: bold-solid + bottom-stack
  `A rich, saturated Spotify green (#1DB954) background that fills the entire image. Add very subtle grain/noise texture for depth. In the top-right corner, a single large soft circular shape in a slightly lighter green (#1ed760) at 20% opacity, bleeding off the edge. The bottom 45% of the image should be completely clean solid green with no elements — that's where text goes.
Aspect ratio: 1080x1080.
Only 2 colors allowed: #1DB954 and #1ed760. No other colors. No text. No photos. No objects.`,

  // linkedin: editorial-clean + split-left
  `LEFT HALF: solid flat black (#191414), completely empty, nothing on it.
RIGHT HALF: dark charcoal (#121212) background with a subtle grid of thin lines at 5% white opacity. Scattered angular geometric blocks and thin diagonal lines in Spotify green (#1DB954) at 15-35% opacity. The shapes should feel structured, technical, clean — like a data visualization or circuit board abstracted.
Aspect ratio: 1200x627.
Only 3 colors: #191414, #121212, #1DB954. No text. No photos.`,

  // ig-story: 3d-abstract + center-stack
  `Dark background fading from black (#191414) at top to very dark green (#0a2e1a) at bottom. 3D-looking glossy spheres and torus ring shapes in Spotify green (#1DB954) clustered at the top-right corner and bottom-left corner. The spheres should have glass-like reflections and depth. THE CENTER 60% OF THE IMAGE MUST BE MOSTLY CLEAR AND DARK — only subtle atmospheric green haze there. All solid objects at the edges.
Aspect ratio: 1080x1920.
Colors: #191414, #0a2e1a, #1DB954. No text.`,

  // display: dark-atmospheric + center-stack
  `Nearly black (#0a0c0e) background with a very subtle radial glow of dark green (#0d2818) emanating from center. Ultra-fine grid lines at 4% white opacity. One thin horizontal accent line in #1DB954 at 25% opacity across the upper third. Cinematic, minimal, premium feel — like a dark UI. The center area should stay very clean for text.
Aspect ratio: 1200x628.
Colors: #0a0c0e, #0d2818, #1DB954. No text. No objects besides the grid and accent line.`,

  // newsletter: organic-gradient + split-left
  `LEFT HALF: solid black (#191414), completely empty.
RIGHT HALF: smooth flowing gradient from Spotify green (#1DB954) at top-right to deep teal (#0a5c36) at bottom-left. Soft, blurred circular bokeh shapes in white at 8-12% opacity scattered across the right half. Warm, inviting, musical feeling.
Aspect ratio: 600x300.
Left side MUST be completely solid black. All visual elements on right only. No text.`,
];

// ── Image generation ────────────────────────────────────────────────
async function generateImage(prompt, filename) {
  const filepath = path.join(OUT, filename);
  try { await fs.access(filepath); console.log(`  ✓ cached: ${filename}`); return filename; } catch {}

  try {
    const model = genai.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Generate an image: ${prompt}` }] }],
      generationConfig: { responseModalities: ["image", "text"] },
    });
    for (const part of result.response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        await fs.writeFile(filepath, Buffer.from(part.inlineData.data, "base64"));
        console.log(`  ✓ generated: ${filename}`);
        return filename;
      }
    }
    console.log(`  ✗ no image data: ${filename}`);
    return null;
  } catch (err) {
    console.log(`  ✗ failed (${err.message}): ${filename}`);
    return null;
  }
}

// ── Composite: background + brand assets + text zones via Puppeteer ─
async function compositeAd(bgFile, platform, variant, layoutType, browser) {
  const p = platform;
  const bgPath = path.join(OUT, bgFile);
  const bgData = (await fs.readFile(bgPath)).toString("base64");
  const logoData = (await fs.readFile(path.join(ASSETS, "spotify-logo-white.png"))).toString("base64");
  const iconData = (await fs.readFile(path.join(ASSETS, "spotify-icon-green.png"))).toString("base64");
  const iconWhiteData = (await fs.readFile(path.join(ASSETS, "spotify-icon-white.png"))).toString("base64");

  // Layout configs
  const layouts = {
    // OLD: always same generic layout
    "old-generic": {
      overlay: `background:linear-gradient(to bottom,rgba(0,0,0,.08) 0%,rgba(0,0,0,.3) 40%,rgba(0,0,0,.72) 100%);`,
      logoStyle: `position:absolute;top:5%;left:5%;height:6%;opacity:.7;`,
      logoSrc: logoData,
      zoneStyle: `position:absolute;bottom:0;left:0;right:0;height:40%;padding:5%;display:flex;flex-direction:column;justify-content:flex-end;gap:2%;`,
      zoneAlign: "",
    },
    // NEW layouts per platform
    "bottom-stack": {
      overlay: ``,
      logoStyle: `position:absolute;top:6%;left:6%;height:5%;`,
      logoSrc: logoData,
      zoneStyle: `position:absolute;bottom:0;left:0;right:0;height:38%;padding:6%;display:flex;flex-direction:column;justify-content:flex-end;gap:2.5%;`,
      zoneAlign: "",
    },
    "split-left": {
      overlay: ``,
      logoStyle: `position:absolute;top:10%;left:4%;height:7%;z-index:5;`,
      logoSrc: logoData,
      zoneStyle: `position:absolute;top:0;left:0;width:45%;height:100%;padding:6% 5%;display:flex;flex-direction:column;justify-content:center;gap:3%;padding-top:22%;`,
      zoneAlign: "",
      // Also place icon on the visual side
      extraIcon: true,
      iconStyle: `position:absolute;top:50%;right:12%;transform:translateY(-50%);height:18%;opacity:.12;`,
      iconSrc: iconWhiteData,
    },
    "center-stack": {
      overlay: `background:linear-gradient(to bottom,rgba(0,0,0,.03) 0%,rgba(0,0,0,.35) 100%);`,
      logoStyle: `position:absolute;top:6%;left:50%;transform:translateX(-50%);height:4%;`,
      logoSrc: logoData,
      zoneStyle: `position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:70%;display:flex;flex-direction:column;align-items:center;gap:3%;`,
      zoneAlign: "center",
    },
    "center-stack-display": {
      overlay: `background:linear-gradient(to bottom,rgba(0,0,0,.05) 0%,rgba(0,0,0,.45) 100%);`,
      logoStyle: `position:absolute;top:8%;left:50%;transform:translateX(-50%);height:7%;`,
      logoSrc: logoData,
      zoneStyle: `position:absolute;top:52%;left:50%;transform:translate(-50%,-50%);width:75%;display:flex;flex-direction:column;align-items:center;gap:3%;`,
      zoneAlign: "center",
    },
    "split-left-newsletter": {
      overlay: ``,
      logoStyle: `position:absolute;top:12%;left:5%;height:10%;z-index:5;`,
      logoSrc: logoData,
      zoneStyle: `position:absolute;top:0;left:0;width:50%;height:100%;padding:8% 6%;display:flex;flex-direction:column;justify-content:center;gap:4%;padding-top:30%;`,
      zoneAlign: "",
      extraIcon: true,
      iconStyle: `position:absolute;top:50%;right:10%;transform:translateY(-50%);height:30%;opacity:.1;`,
      iconSrc: iconWhiteData,
    },
  };

  const L = layouts[layoutType];
  const ta = L.zoneAlign === "center" ? "text-align:center;" : "";

  const html = `<!DOCTYPE html><html><head><style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:${p.w}px;height:${p.h}px;overflow:hidden;position:relative}
.bg{position:absolute;inset:0;z-index:0}
.bg img{width:100%;height:100%;object-fit:cover}
.overlay{position:absolute;inset:0;z-index:1;${L.overlay}}
.logo{z-index:3;${L.logoStyle}}
.extra-icon{z-index:2;${L.iconStyle || ""}}
.zone{z-index:4;${L.zoneStyle}${ta}}
.zone-line{border-radius:6px;background:rgba(255,255,255,.22)}
.zone-pill{border-radius:100px;background:rgba(29,185,84,.4);border:1.5px solid rgba(29,185,84,.3)}
</style></head><body>
<div class="bg"><img src="data:image/png;base64,${bgData}"></div>
<div class="overlay"></div>
<img class="logo" src="data:image/png;base64,${L.logoSrc}">
${L.extraIcon ? `<img class="extra-icon" src="data:image/png;base64,${L.iconSrc}">` : ""}
<div class="zone">
  <div class="zone-line" style="width:${L.zoneAlign === "center" ? "35%" : "30%"};height:10px;${L.zoneAlign === "center" ? "margin:0 auto;" : ""}"></div>
  <div class="zone-line" style="width:${L.zoneAlign === "center" ? "80%" : "85%"};height:14px;${L.zoneAlign === "center" ? "margin:0 auto;" : ""}"></div>
  <div class="zone-line" style="width:${L.zoneAlign === "center" ? "65%" : "70%"};height:10px;${L.zoneAlign === "center" ? "margin:0 auto;" : ""}"></div>
  <div class="zone-pill" style="width:120px;height:36px;${L.zoneAlign === "center" ? "margin:0 auto;" : ""}"></div>
</div>
</body></html>`;

  const outName = `comp-${variant}-${p.key}.png`;
  const outPath = path.join(OUT, outName);

  const page = await browser.newPage();
  await page.setViewport({ width: p.w, height: p.h, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.screenshot({ path: outPath, type: "png" });
  await page.close();

  console.log(`  ✓ composited: ${outName}`);
  return outName;
}

// ── Build comparison HTML ───────────────────────────────────────────
function buildHTML(results) {
  const presets = ["bold-solid", "editorial-clean", "3d-abstract", "dark-atmospheric", "organic-gradient"];
  const layoutNames = ["bottom-stack", "split-left", "center-stack", "center-stack", "split-left"];
  const overlayNotes = ["no overlay", "no overlay (solid panel)", "light 3%→35%", "standard 5%→45%", "no overlay (solid panel)"];

  let pairs = "";
  for (let i = 0; i < 5; i++) {
    const p = platforms[i];
    const num = String(i + 1).padStart(2, "0");
    pairs += `
  <section class="pair">
    <div class="pair-header">
      <span class="pair-number">${num}</span>
      <h2 class="pair-title">${p.name}</h2>
      <span class="pair-meta">${p.w} &times; ${p.h}</span>
    </div>
    <div class="comparison">
      <div class="column">
        <div class="column-label old"><span class="tag">Current</span> Generic Pipeline</div>
        <div class="ad-frame">
          <img src="${results.old[i]}" style="width:100%;display:block;border-radius:8px;">
        </div>
      </div>
      <div class="column">
        <div class="column-label new"><span class="tag">New</span> Design System</div>
        <div class="ad-frame">
          <img src="${results.new[i]}" style="width:100%;display:block;border-radius:8px;">
        </div>
        <div class="annotations">
          <span class="annotation"><span class="dot preset"></span>${presets[i]}</span>
          <span class="annotation"><span class="dot layout"></span>${layoutNames[i]}</span>
          <span class="annotation"><span class="dot overlay"></span>${overlayNotes[i]}</span>
        </div>
      </div>
    </div>
  </section>`;
  }

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Spotify — Design System Comparison</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#07080A;--border:#1A1D24;--dim:#6B7180;--muted:#3D4250;--green:#1DB954}
body{background:var(--bg);color:#E8E9EB;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased}
.page{max-width:1400px;margin:0 auto;padding:60px 40px 120px}
.header{margin-bottom:72px}
.header::after{content:'';display:block;margin-top:36px;height:1px;background:linear-gradient(90deg,var(--green),transparent 70%);opacity:.3}
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:var(--green);margin-bottom:14px;display:flex;align-items:center;gap:10px}
.eyebrow::before{content:'';width:24px;height:1px;background:var(--green)}
.page-title{font-size:clamp(32px,5vw,52px);font-weight:800;letter-spacing:-.035em;line-height:1.05;color:#fff}
.page-subtitle{margin-top:16px;font-size:17px;color:var(--dim);max-width:660px;line-height:1.6}
.brand-badge{display:inline-flex;align-items:center;gap:8px;margin-top:22px;padding:6px 14px;border-radius:100px;background:rgba(29,185,84,.08);border:1px solid rgba(29,185,84,.2);font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--green)}
.brand-badge .bdot{width:6px;height:6px;border-radius:50%;background:var(--green)}
.pair{margin-bottom:88px}
.pair-header{display:flex;align-items:baseline;gap:16px;margin-bottom:28px;flex-wrap:wrap}
.pair-number{font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:500;color:var(--green);padding:3px 10px;border-radius:100px;border:1px solid rgba(29,185,84,.2);background:rgba(29,185,84,.05)}
.pair-title{font-size:20px;font-weight:700;letter-spacing:-.02em;color:#fff}
.pair-meta{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted)}
.comparison{display:grid;grid-template-columns:1fr 1fr;gap:28px}
.column-label{display:flex;align-items:center;gap:8px;margin-bottom:12px;font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase}
.column-label.old{color:var(--muted)}
.column-label.new{color:#22C55E}
.tag{padding:2px 8px;border-radius:4px;font-size:10px}
.column-label.old .tag{background:rgba(255,255,255,.05);color:var(--dim)}
.column-label.new .tag{background:rgba(34,197,94,.1);color:#22C55E}
.ad-frame{border-radius:8px;overflow:hidden;border:1px solid var(--border);transition:transform .2s,box-shadow .2s}
.ad-frame:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,0,0,.5)}
.annotations{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}
.annotation{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);padding:3px 10px;border-radius:4px;background:rgba(255,255,255,.03);border:1px solid var(--border);display:flex;align-items:center;gap:6px}
.dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.dot.preset{background:var(--green)}
.dot.layout{background:#22D3EE}
.dot.overlay{background:#22C55E}
.footer{margin-top:40px;padding-top:40px;border-top:1px solid var(--border);font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);display:flex;justify-content:space-between}
@media(max-width:900px){.comparison{grid-template-columns:1fr}.page{padding:28px 20px 80px}}
</style></head><body>
<div class="page">
  <header class="header">
    <div class="eyebrow">Peitho Design System</div>
    <h1 class="page-title">Background + Asset Comparison</h1>
    <p class="page-subtitle">Same brand (Spotify). Gemini-generated backgrounds with logo and brand assets composited on top. Wireframe bars show where text would be placed. Left: generic pipeline. Right: design system rules.</p>
    <div class="brand-badge"><span class="bdot"></span>Spotify</div>
  </header>
  ${pairs}
  <footer class="footer">
    <span>Peitho Pipeline &mdash; Nano Banana (gemini-2.5-flash-image)</span>
    <span>Backgrounds + asset compositing via Puppeteer</span>
  </footer>
</div>
</body></html>`;
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  await fs.mkdir(OUT, { recursive: true });

  // Step 1: Generate backgrounds
  console.log("\n━━━ Generating OLD backgrounds ━━━\n");
  const oldBgs = [];
  for (let i = 0; i < 5; i++) {
    oldBgs.push(await generateImage(oldPrompts[i], `old-${platforms[i].key}.png`));
  }

  console.log("\n━━━ Generating NEW backgrounds ━━━\n");
  const newBgs = [];
  for (let i = 0; i < 5; i++) {
    newBgs.push(await generateImage(newPrompts[i], `new-${platforms[i].key}.png`));
  }

  // Step 2: Composite brand assets on top
  console.log("\n━━━ Compositing brand assets ━━━\n");
  const browser = await puppeteer.launch({ headless: true });

  const oldLayouts = ["old-generic", "old-generic", "old-generic", "old-generic", "old-generic"];
  const newLayouts = ["bottom-stack", "split-left", "center-stack", "center-stack-display", "split-left-newsletter"];

  const results = { old: [], new: [] };

  for (let i = 0; i < 5; i++) {
    if (oldBgs[i]) {
      results.old.push(await compositeAd(oldBgs[i], platforms[i], "old", oldLayouts[i], browser));
    } else {
      results.old.push(null);
    }
    if (newBgs[i]) {
      results.new.push(await compositeAd(newBgs[i], platforms[i], "new", newLayouts[i], browser));
    } else {
      results.new.push(null);
    }
  }

  await browser.close();

  // Step 3: Build HTML
  console.log("\n━━━ Building comparison page ━━━\n");
  await fs.writeFile(path.join(OUT, "index.html"), buildHTML(results));
  console.log(`  ✓ index.html`);
  console.log(`\nDone! Open compare-output/index.html\n`);
}

main().catch(console.error);
