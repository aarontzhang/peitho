import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { campaign, personas } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BRIEF_DIR = path.join(__dirname, "briefs");
const OUTPUT_DIR = path.join(__dirname, "output");

const client = new Anthropic();

// ── Brief generation: persona-informed ──────────────────────────────

function buildBriefPrompt(persona) {
  const isDataPersona = ["data-driven", "evidence-first"].includes(
    persona.cognition.informationProcessing
  );

  return `You are a B2B advertising strategist specializing in purpose-driven outdoor brands.
Generate a creative brief for a LinkedIn organic post with a single image (1080x1080).

## Brand: Patagonia
${campaign.product}
Company: ${campaign.company}
Competitors: ${campaign.competitors.join(", ")}
Current challenge: ${campaign.currentPain}

## Brand Visual DNA
- Aesthetic: ${campaign.visualDNA.aesthetic}
- Voice: ${campaign.visualDNA.voice}
- Colors: Deep ocean blue (#1B2A4A) background, sunset orange (#F4845F), glacier blue (#73C2FB), and forest green (#2D6A4F) as accent tones
- NO corporate stock photography. NO greenwashing cliches. Mountain silhouettes, clean typography, and earth textures are the visual language.

## Target Persona
Role: ${persona.role} (${persona.segment})
Company stage: ${persona.companyStage}

### How this person processes information
- Style: ${persona.cognition.informationProcessing}
- Proof hierarchy (what evidence moves them, in priority order): ${persona.cognition.proofHierarchy.join(" > ")}
- Risk orientation: ${persona.cognition.riskOrientation}

### Objections
What they'll SAY: ${persona.objections.surface.join("; ")}
What they actually MEAN: ${persona.objections.real.join("; ")}

### Anti-patterns — messaging that will BACKFIRE for this persona
${persona.antiPatterns.map((a) => `- ${a}`).join("\n")}

### Communication preferences
- Format: ${persona.communication.preferredFormat}
- Social proof that moves them: ${persona.communication.socialProofType}
- Attention window: ${persona.communication.attentionWindow}

## Instructions
Generate a creative brief for a LinkedIn organic post. The post image (1080x1080) will contain:
- A bold headline on Patagonia's deep blue background with nature-inspired accent colors
- ${isDataPersona ? "A bold stat/metric callout — the number IS the visual hook" : "A provocative statement or question — the words ARE the visual hook"}
- Mountain silhouette motif and Patagonia wordmark
- Clean, anti-corporate aesthetic that feels earned, not designed

The post also has LinkedIn text elements OUTSIDE the image:
- postText: the LinkedIn post body (max 280 chars for the above-fold hook — this is what people see before clicking "see more". Write in Patagonia's voice: direct, activist, no fluff, no exclamation marks. Max 2 hashtags.)

Output valid JSON only, no markdown fences. Schema:
{
  "personaId": "${persona.id}",
  "persuasionAngle": {
    "type": string,
    "rationale": string (why this angle works for THIS persona's specific psychology — reference their objections and risk orientation),
    "psychFramework": string
  },
  "creative": {
    "headline": string (the BOLD text inside the 1080x1080 image — max 8 words, this is the visual anchor),
    ${isDataPersona ? `"statNumber": string (a compelling, specific, real metric — like "87%" or "$2.8M" or "823,000"),\n    "statLabel": string (what the number means — max 60 chars),` : `"provocativeHook": string (a punchy sub-statement that adds tension or specificity to the headline — max 15 words),`}
    "postText": string (LinkedIn post body — Patagonia's voice, 280 chars above-fold hook, can continue after fold),
    "cta": string (what action should the reader take — keep it organic, not salesy, no "Learn More" or "Shop Now"),
    "tone": string (describe the voice — specifically informed by the anti-patterns to AVOID),
    "subtext": string (small text at bottom of image — a real Patagonia URL like "patagonia.com/worn-wear" or "patagonia.com/our-footprint" or "patagonia.com/ironclad-guarantee")
  }
}`;
}

// ── Brief generation: cold (no persona context) ─────────────────────

function buildColdPrompt() {
  return `You are a B2B advertising strategist. Generate a creative brief for a LinkedIn organic post with a single image (1080x1080).

## Brand: Patagonia
${campaign.product}
Company: ${campaign.company}
Competitors: ${campaign.competitors.join(", ")}
Current challenge: ${campaign.currentPain}

## Instructions
Generate a compelling LinkedIn post targeting professional audiences. The image (1080x1080) uses Patagonia's visual DNA: deep blue background, mountain silhouettes, earth tones, clean typography. Voice is quiet, direct, and activist.

Output valid JSON only, no markdown fences. Schema:
{
  "personaId": "cold-generic",
  "persuasionAngle": {
    "type": string,
    "rationale": string,
    "psychFramework": string
  },
  "creative": {
    "headline": string (bold text inside the image — max 8 words),
    "provocativeHook": string (sub-statement, max 15 words),
    "postText": string (LinkedIn post body, max 280 chars above-fold),
    "cta": string,
    "tone": string,
    "subtext": string (e.g. "patagonia.com")
  }
}`;
}

// ── Claude API call ─────────────────────────────────────────────────

async function generateBrief(prompt, label) {
  console.log(`  ↳ Generating brief: ${label}...`);

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].text;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Failed to parse Claude response for ${label}: ${text.slice(0, 200)}`);
  }
}

// ── Comparison report ───────────────────────────────────────────────

function buildComparisonReport(informed, cold) {
  let md = `# Patagonia Campaign: Persona-Informed vs Cold Generation\n\n`;
  md += `**Campaign:** ${campaign.product}\n`;
  md += `**Platform:** ${campaign.platform}\n`;
  md += `**Date:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**Personas:** ${personas.length}\n\n`;
  md += `---\n\n`;

  for (let i = 0; i < informed.length; i++) {
    const inf = informed[i];
    const col = cold[i];
    const persona = personas[i];

    md += `## ${persona.role} — ${persona.segment}\n\n`;

    md += `### Persona-Informed\n`;
    md += `- **Angle:** ${inf.persuasionAngle.type}\n`;
    md += `- **Framework:** ${inf.persuasionAngle.psychFramework}\n`;
    md += `- **Rationale:** ${inf.persuasionAngle.rationale}\n`;
    md += `- **Image Headline:** ${inf.creative.headline}\n`;
    md += `- **Post Text:** ${inf.creative.postText}\n`;
    md += `- **CTA:** ${inf.creative.cta}\n`;
    md += `- **Tone:** ${inf.creative.tone}\n`;
    if (inf.creative.statNumber) {
      md += `- **Stat:** ${inf.creative.statNumber} — ${inf.creative.statLabel}\n`;
    }
    if (inf.creative.provocativeHook) {
      md += `- **Hook:** ${inf.creative.provocativeHook}\n`;
    }
    md += `\n`;

    md += `### Cold (Generic)\n`;
    md += `- **Angle:** ${col.persuasionAngle.type}\n`;
    md += `- **Framework:** ${col.persuasionAngle.psychFramework}\n`;
    md += `- **Image Headline:** ${col.creative.headline}\n`;
    md += `- **Post Text:** ${col.creative.postText}\n`;
    md += `- **CTA:** ${col.creative.cta}\n`;
    md += `- **Tone:** ${col.creative.tone}\n`;
    if (col.creative.provocativeHook) {
      md += `- **Hook:** ${col.creative.provocativeHook}\n`;
    }
    md += `\n`;

    md += `### Key Differences\n`;
    md += `| Dimension | Persona-Informed | Cold |\n`;
    md += `|-----------|-----------------|------|\n`;
    md += `| Persuasion angle | ${inf.persuasionAngle.type} | ${col.persuasionAngle.type} |\n`;
    md += `| Evidence type | ${persona.cognition.proofHierarchy[0]} | (generic) |\n`;
    md += `| Anti-patterns avoided | ${persona.antiPatterns.length} constraints applied | None |\n`;
    md += `| Info processing match | ${persona.cognition.informationProcessing} | Default |\n`;
    md += `| Risk orientation | ${persona.cognition.riskOrientation} | Not addressed |\n\n`;
    md += `---\n\n`;
  }

  return md;
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("\n━━━ Peitho Brief Generation — Patagonia Campaign ━━━\n");
  console.log(`Campaign: ${campaign.product}`);
  console.log(`Personas: ${personas.length}`);
  console.log(`Platform: ${campaign.platform}\n`);

  await fs.mkdir(BRIEF_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Step 1: Generate persona-informed briefs
  console.log("▸ Step 1: Generating persona-informed briefs");
  const informedBriefs = [];
  for (const persona of personas) {
    const prompt = buildBriefPrompt(persona);
    const brief = await generateBrief(prompt, persona.id);
    informedBriefs.push(brief);
  }

  // Step 2: Generate cold briefs for comparison
  console.log("\n▸ Step 2: Generating cold briefs (no persona context)");
  const coldBriefs = [];
  for (let i = 0; i < personas.length; i++) {
    const brief = await generateBrief(buildColdPrompt(), `cold-${i + 1}`);
    coldBriefs.push(brief);
  }

  // Step 3: Write briefs
  console.log("\n▸ Step 3: Writing briefs");
  for (const brief of informedBriefs) {
    const outPath = path.join(BRIEF_DIR, `${brief.personaId}.json`);
    await fs.writeFile(outPath, JSON.stringify(brief, null, 2));
    console.log(`  ↳ ${brief.personaId}: "${brief.creative.headline}"`);
  }

  // Step 4: Write comparison report
  const report = buildComparisonReport(informedBriefs, coldBriefs);
  const reportPath = path.join(OUTPUT_DIR, "comparison-report.md");
  await fs.writeFile(reportPath, report);
  console.log(`\n  ↳ Comparison report: ${reportPath}`);

  // Summary
  console.log("\n━━━ Results ━━━\n");
  console.log("PERSONA-INFORMED:");
  for (const brief of informedBriefs) {
    console.log(`  ${brief.personaId}`);
    console.log(`    Angle: ${brief.persuasionAngle.type}`);
    console.log(`    Image headline: "${brief.creative.headline}"`);
    console.log(`    Post text: "${brief.creative.postText.slice(0, 100)}..."`);
    if (brief.creative.statNumber) {
      console.log(`    Stat: ${brief.creative.statNumber}`);
    }
    if (brief.creative.provocativeHook) {
      console.log(`    Hook: "${brief.creative.provocativeHook}"`);
    }
    console.log();
  }

  console.log("COLD (no persona):");
  for (const brief of coldBriefs) {
    console.log(`  cold-${coldBriefs.indexOf(brief) + 1}`);
    console.log(`    Angle: ${brief.persuasionAngle.type}`);
    console.log(`    Image headline: "${brief.creative.headline}"`);
    console.log();
  }

  console.log(`\nBriefs: ${BRIEF_DIR}`);
  console.log(`Report: ${reportPath}\n`);
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
