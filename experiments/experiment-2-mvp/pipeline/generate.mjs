// Peitho Pipeline — Ad Generation (Copy + Visuals)
// Generates ad copy via Claude and background images via Gemini,
// then composites them into final ad PNGs.

import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs/promises";
import path from "path";
import { PLATFORM_SPECS } from "./platforms.mjs";

const anthropic = new Anthropic();
const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = "claude-sonnet-4-20250514";
const GEMINI_MODEL = "gemini-3.1-flash-image-preview";
const VARIANTS_PER_PLATFORM = 3;

// ── Copy Generation (Claude) ─────────────────────────────────────────

async function generateCopy(persona, campaign, brief, platform) {
  const spec = platform.format || {};
  const emotionalAngles = ["rational/evidence", "aspiration/identity", "social proof"];

  const prompt = `You are an expert ad copywriter creating a ${platform.name} ad for ${campaign.product.split("—")[0].trim()}.

## Campaign
Product: ${campaign.product}
Voice: ${campaign.visualDNA.voice}

## Target Persona
Role: ${persona.role} (${persona.segment})
Info processing: ${persona.cognition.informationProcessing}
Risk orientation: ${persona.cognition.riskOrientation}
Proof they trust: ${persona.cognition.proofHierarchy.slice(0, 3).join(" > ")}

## Messaging Discovery (from persona interviews)
Top pain points: ${brief.painPoints.join("; ")}
Their vocabulary: ${brief.vocabulary.join(", ")}
What to AVOID: ${brief.avoidList.join("; ")}
Best angle from testing: "${brief.topAngles[0]?.headline}" (score: ${brief.topAngles[0]?.score}/10)

## Anti-Patterns (messaging that BACKFIRES with this persona)
${persona.antiPatterns.map((a) => `- ${a}`).join("\n")}

## Real Objections (what they're actually thinking)
${persona.objections.real.map((o) => `- ${o}`).join("\n")}

## Platform: ${platform.name}
${spec.copyLimit ? `Copy limit: ${spec.copyLimit} characters` : ""}
${spec.headlineLimit ? `Headline limit: ${spec.headlineLimit} characters` : ""}
CTA style: ${spec.ctaStyle || "button"}
${platform.specificPlacement ? `Specific placement: ${platform.specificPlacement}` : ""}

Generate ${VARIANTS_PER_PLATFORM} ad variants. Each MUST use a DIFFERENT emotional angle from: ${emotionalAngles.join(", ")}.

Use the persona's natural VOCABULARY. Address a REAL objection (not surface). Match the platform's content grammar — a Reddit post sounds nothing like a LinkedIn ad.

Output valid JSON only:
[
  {
    "variantIndex": number (1-${VARIANTS_PER_PLATFORM}),
    "headline": string,
    "bodyText": string,
    "cta": string,
    "emotionalAngle": string,
    "tone": string,
    "persuasionAngle": string (the psychological lever),
    "visualConcept": string (2-3 sentences describing the ideal background image — no text in the image, just mood/scene/elements),
    "rationale": string (why this works for THIS persona on THIS platform — be specific)
  }
]`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Failed to parse ad copy: ${text.slice(0, 200)}`);
  }
}

// ── Visual Generation (Gemini) ───────────────────────────────────────

async function generateVisual(variant, campaign, platform, outputDir) {
  const spec = platform.format || {};
  const width = spec.width || 1080;
  const height = spec.height || 1080;

  // Some platforms are text-only (HN, podcast, Slack)
  if (width === 0 || !spec.width) {
    return null; // No visual needed
  }

  const imagePrompt = `${variant.visualConcept}

Style: ${campaign.visualDNA.aesthetic}
Aspect ratio: ${width}x${height}
Color palette: use these colors subtly — ${campaign.visualDNA.accentGradient?.join(", ") || campaign.visualDNA.accentBlue || "#0071E3"}
Background: ${campaign.visualDNA.backgroundDark || "#000000"}

IMPORTANT: Do NOT include any text, words, letters, or typography in the image. This is a background image only — text will be overlaid separately.`;

  try {
    const model = genai.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Generate an image: ${imagePrompt}` }] }],
      generationConfig: {
        responseModalities: ["image", "text"],
      },
    });

    const response = result.response;
    // Look for inline image data in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imgBuffer = Buffer.from(part.inlineData.data, "base64");
        const filename = `${variant.personaId}-${variant.platformKey}-v${variant.variantIndex}-bg.png`;
        const filepath = path.join(outputDir, filename);
        await fs.writeFile(filepath, imgBuffer);
        return filepath;
      }
    }

    console.log(`    ⚠ Gemini returned no image data, falling back to gradient`);
    return null;
  } catch (err) {
    console.log(`    ⚠ Gemini image gen failed (${err.message}), falling back to gradient`);
    return null;
  }
}

// ── Main Generation Function ─────────────────────────────────────────

export async function runGeneration(campaign, personas, messagingBriefs, platformSelections, outputDir) {
  console.log(`\n━━━ Ad Generation ━━━\n`);

  const adsDir = path.join(outputDir, "ads");
  await fs.mkdir(adsDir, { recursive: true });

  const allVariants = [];

  for (const persona of personas) {
    const brief = messagingBriefs.find((b) => b.personaId === persona.id);
    const selection = platformSelections.find((s) => s.personaId === persona.id);

    if (!brief || !selection) {
      console.log(`  ⚠ Missing data for ${persona.id}, skipping`);
      continue;
    }

    console.log(`\n▸ ${persona.role} (${persona.id})`);

    for (const platform of selection.platforms) {
      process.stdout.write(`  ${platform.platformKey}: generating copy...`);
      const variants = await generateCopy(persona, campaign, brief, platform);
      console.log(` ${variants.length} variants`);

      for (const variant of variants) {
        // Attach metadata
        variant.personaId = persona.id;
        variant.platformKey = platform.platformKey;
        variant.platformName = platform.name;

        // Generate visual
        const hasVisual = (platform.format?.width || 0) > 0;
        if (hasVisual) {
          process.stdout.write(`    v${variant.variantIndex}: generating visual...`);
          variant.backgroundPath = await generateVisual(variant, campaign, platform, adsDir);
          console.log(variant.backgroundPath ? " done" : " gradient fallback");
        } else {
          variant.backgroundPath = null;
          console.log(`    v${variant.variantIndex}: text-only platform, no visual`);
        }

        allVariants.push(variant);
      }
    }
  }

  // Save all variants as JSON
  const variantsPath = path.join(outputDir, "variants.json");
  await fs.writeFile(variantsPath, JSON.stringify(allVariants, null, 2));

  return allVariants;
}
