import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { campaign, personas } from "./config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "output");

const client = new Anthropic();

// ── Brief generation: persona-informed ──────────────────────────────

function buildBriefPrompt(persona) {
  return `You are a B2B advertising strategist. Generate a creative brief for a LinkedIn Sponsored Content ad.

## Product
${campaign.product}
Company: ${campaign.company}
Deal size: ${campaign.dealSize}
Competitors: ${campaign.competitors.join(", ")}
Current challenge: ${campaign.currentPain}

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
Generate a creative brief with:
1. **persuasionAngle**: The psychological mechanism to activate for this specific persona. Include the type, a rationale explaining why it works for THIS person's psychology, and the framework it's grounded in.
2. **creative**: LinkedIn ad copy with:
   - headline (under 70 chars, must hook within the attention window)
   - body (under 300 chars, LinkedIn Sponsored Content limit)
   - cta (call to action text)
   - tone (describe the voice — informed by the anti-patterns to avoid)

Output valid JSON only, no markdown fences. Schema:
{
  "personaId": "${persona.id}",
  "persuasionAngle": { "type": string, "rationale": string, "psychFramework": string },
  "creative": { "headline": string, "body": string, "cta": string, "tone": string }
}`;
}

// ── Brief generation: cold (no persona context) ─────────────────────

function buildColdPrompt() {
  return `You are a B2B advertising strategist. Generate a creative brief for a LinkedIn Sponsored Content ad.

## Product
${campaign.product}
Company: ${campaign.company}
Deal size: ${campaign.dealSize}
Competitors: ${campaign.competitors.join(", ")}
Current challenge: ${campaign.currentPain}

## Instructions
Generate a compelling LinkedIn ad targeting technical decision-makers at mid-to-large companies. The ad should differentiate from Datadog and drive evaluation.

Generate a creative brief with:
1. **persuasionAngle**: The psychological mechanism to activate. Include the type, rationale, and framework.
2. **creative**: LinkedIn ad copy with:
   - headline (under 70 chars)
   - body (under 300 chars, LinkedIn Sponsored Content limit)
   - cta (call to action text)
   - tone (describe the voice)

Output valid JSON only, no markdown fences. Schema:
{
  "personaId": "cold-generic",
  "persuasionAngle": { "type": string, "rationale": string, "psychFramework": string },
  "creative": { "headline": string, "body": string, "cta": string, "tone": string }
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
    // Try extracting JSON from response if it has extra text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Failed to parse Claude response for ${label}: ${text.slice(0, 200)}`);
  }
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("\n━━━ Peitho Brief Generation Pipeline ━━━\n");
  console.log(`Campaign: ${campaign.product}`);
  console.log(`Personas: ${personas.length}`);
  console.log(`Platform: ${campaign.platform}\n`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Step 1: Generate persona-informed briefs
  console.log("▸ Step 1: Generating persona-informed briefs");
  const informedBriefs = [];
  for (const persona of personas) {
    const prompt = buildBriefPrompt(persona);
    const brief = await generateBrief(prompt, persona.id);
    informedBriefs.push(brief);
  }

  // Step 2: Generate cold briefs (no persona context) for comparison
  console.log("\n▸ Step 2: Generating cold briefs (no persona context)");
  const coldBriefs = [];
  for (let i = 0; i < personas.length; i++) {
    const brief = await generateBrief(buildColdPrompt(), `cold-${i + 1}`);
    coldBriefs.push(brief);
  }

  // Step 3: Write output
  console.log("\n▸ Step 3: Writing results");

  // Save individual briefs
  for (const brief of informedBriefs) {
    const outPath = path.join(OUTPUT_DIR, `${brief.personaId}-brief.json`);
    await fs.writeFile(outPath, JSON.stringify(brief, null, 2));
    console.log(`  ↳ ${brief.personaId}: "${brief.creative.headline}"`);
  }

  // Save comparison report
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
    console.log(`    Headline: "${brief.creative.headline}"`);
    console.log(`    Body: "${brief.creative.body}"`);
    console.log();
  }
  console.log("COLD (no persona):");
  for (const brief of coldBriefs) {
    console.log(`  generic-${coldBriefs.indexOf(brief) + 1}`);
    console.log(`    Angle: ${brief.persuasionAngle.type}`);
    console.log(`    Headline: "${brief.creative.headline}"`);
    console.log(`    Body: "${brief.creative.body}"`);
    console.log();
  }

  console.log(`Open ${OUTPUT_DIR} to review all outputs.\n`);
}

// ── Comparison report ───────────────────────────────────────────────

function buildComparisonReport(informed, cold) {
  let md = `# Persona-Informed vs Cold Generation Comparison\n\n`;
  md += `**Campaign:** ${campaign.product}\n`;
  md += `**Date:** ${new Date().toISOString().split("T")[0]}\n\n`;
  md += `---\n\n`;

  for (let i = 0; i < informed.length; i++) {
    const inf = informed[i];
    const col = cold[i];
    const persona = personas[i];

    md += `## ${persona.role} — ${persona.segment}\n\n`;
    md += `### Persona-Informed\n`;
    md += `- **Angle:** ${inf.persuasionAngle.type}\n`;
    md += `- **Framework:** ${inf.persuasionAngle.psychFramework}\n`;
    md += `- **Headline:** ${inf.creative.headline}\n`;
    md += `- **Body:** ${inf.creative.body}\n`;
    md += `- **CTA:** ${inf.creative.cta}\n`;
    md += `- **Tone:** ${inf.creative.tone}\n\n`;

    md += `### Cold (Generic)\n`;
    md += `- **Angle:** ${col.persuasionAngle.type}\n`;
    md += `- **Framework:** ${col.persuasionAngle.psychFramework}\n`;
    md += `- **Headline:** ${col.creative.headline}\n`;
    md += `- **Body:** ${col.creative.body}\n`;
    md += `- **CTA:** ${col.creative.cta}\n`;
    md += `- **Tone:** ${col.creative.tone}\n\n`;

    md += `### Key Differences\n`;
    md += `| Dimension | Persona-Informed | Cold |\n`;
    md += `|-----------|-----------------|------|\n`;
    md += `| Persuasion angle | ${inf.persuasionAngle.type} | ${col.persuasionAngle.type} |\n`;
    md += `| Evidence type used | ${persona.cognition.proofHierarchy[0]} | (generic) |\n`;
    md += `| Anti-patterns avoided | ${persona.antiPatterns.length} constraints applied | None |\n`;
    md += `| Format match | ${persona.communication.preferredFormat} | Default |\n\n`;
    md += `---\n\n`;
  }

  return md;
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
