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
  const isCodePersona = ["code-first", "peer-validated", "tutorial-first"].includes(
    persona.cognition.informationProcessing
  );

  return `You are a B2B advertising strategist specializing in developer-audience companies.
Generate a creative brief for a LinkedIn Sponsored Content single image ad (1080x1080).

## Brand: Stripe
${campaign.product}
Company: ${campaign.company}
Competitors: ${campaign.competitors.join(", ")}
Current challenge: ${campaign.currentPain}

## Brand Visual DNA
- Aesthetic: ${campaign.visualDNA.aesthetic}
- Voice: ${campaign.visualDNA.voice}
- Colors: Dark navy (#0a2540) background, purple-blue-teal gradient accents (#635bff → #80b3ff → #7dd3fc)
- NO stock photography. Typography, code, and gradients are the visual language.

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
Generate a creative brief for a LinkedIn single image ad. The ad image (1080x1080) will contain:
- A bold headline on Stripe's dark navy background with gradient accents
- ${isCodePersona ? "A code snippet showing a relevant Stripe API call — this IS the visual" : "A bold stat/metric callout — the number IS the visual hook"}
- Stripe wordmark and gradient accent line

The ad also has LinkedIn text elements OUTSIDE the image:
- introText: shown above the image in the LinkedIn feed (max 150 chars, front-load the hook)
- headline: shown below the image (max 70 chars)
- cta: button text

Output valid JSON only, no markdown fences. Schema:
{
  "personaId": "${persona.id}",
  "persuasionAngle": {
    "type": string,
    "rationale": string (why this angle works for THIS persona's specific psychology),
    "psychFramework": string
  },
  "creative": {
    "headline": string (the BOLD text inside the 1080x1080 image — max 8 words, this is the visual anchor),
    ${isCodePersona ? `"codeSnippet": string (3-5 lines of realistic Stripe API code relevant to this persona's use case — include comments, use JavaScript/Node.js, make it feel real not marketing-fake),` : `"statNumber": string (a compelling metric like "40%" or "3 weeks" or "$2.4M"),\n    "statLabel": string (what the number means — max 60 chars),`}
    "introText": string (LinkedIn text above image, max 150 chars — the scroll-stopping hook),
    "linkedinHeadline": string (LinkedIn text below image, max 70 chars),
    "cta": string (button text),
    "tone": string (describe the voice — informed by anti-patterns to avoid),
    "subtext": string (small text at bottom of image, like "stripe.com/payments" or "stripe.com/atlas")
  }
}`;
}

// ── Brief generation: cold (no persona context) ─────────────────────

function buildColdPrompt() {
  return `You are a B2B advertising strategist. Generate a creative brief for a LinkedIn Sponsored Content single image ad (1080x1080).

## Brand: Stripe
${campaign.product}
Company: ${campaign.company}
Competitors: ${campaign.competitors.join(", ")}
Current challenge: ${campaign.currentPain}

## Instructions
Generate a compelling LinkedIn ad targeting technical decision-makers. The ad image (1080x1080) uses Stripe's visual DNA: dark navy background, purple-blue-teal gradients, code snippets as visual elements.

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
    "codeSnippet": string (3-5 lines of Stripe API code),
    "introText": string (LinkedIn text above image, max 150 chars),
    "linkedinHeadline": string (LinkedIn text below image, max 70 chars),
    "cta": string (button text),
    "tone": string,
    "subtext": string (e.g. "stripe.com/payments")
  }
}`;
}

// ── Claude API call ─────────────────────────────────────────────────

async function generateBrief(prompt, label) {
  console.log(`  \u21b3 Generating brief: ${label}...`);

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
  let md = `# Stripe Campaign: Persona-Informed vs Cold Generation\n\n`;
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
    md += `- **Image Headline:** ${inf.creative.headline}\n`;
    md += `- **LinkedIn Intro:** ${inf.creative.introText}\n`;
    md += `- **LinkedIn Headline:** ${inf.creative.linkedinHeadline}\n`;
    md += `- **CTA:** ${inf.creative.cta}\n`;
    md += `- **Tone:** ${inf.creative.tone}\n`;
    if (inf.creative.codeSnippet) {
      md += `- **Code Snippet:**\n\`\`\`js\n${inf.creative.codeSnippet}\n\`\`\`\n`;
    }
    if (inf.creative.statNumber) {
      md += `- **Stat:** ${inf.creative.statNumber} — ${inf.creative.statLabel}\n`;
    }
    md += `\n`;

    md += `### Cold (Generic)\n`;
    md += `- **Angle:** ${col.persuasionAngle.type}\n`;
    md += `- **Framework:** ${col.persuasionAngle.psychFramework}\n`;
    md += `- **Image Headline:** ${col.creative.headline}\n`;
    md += `- **LinkedIn Intro:** ${col.creative.introText}\n`;
    md += `- **LinkedIn Headline:** ${col.creative.linkedinHeadline}\n`;
    md += `- **CTA:** ${col.creative.cta}\n`;
    md += `- **Tone:** ${col.creative.tone}\n`;
    if (col.creative.codeSnippet) {
      md += `- **Code Snippet:**\n\`\`\`js\n${col.creative.codeSnippet}\n\`\`\`\n`;
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
  console.log("\n\u2501\u2501\u2501 Peitho Brief Generation \u2014 Stripe Campaign \u2501\u2501\u2501\n");
  console.log(`Campaign: ${campaign.product}`);
  console.log(`Personas: ${personas.length}`);
  console.log(`Platform: ${campaign.platform}\n`);

  await fs.mkdir(BRIEF_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Step 1: Generate persona-informed briefs
  console.log("\u25b8 Step 1: Generating persona-informed briefs");
  const informedBriefs = [];
  for (const persona of personas) {
    const prompt = buildBriefPrompt(persona);
    const brief = await generateBrief(prompt, persona.id);
    informedBriefs.push(brief);
  }

  // Step 2: Generate cold briefs for comparison
  console.log("\n\u25b8 Step 2: Generating cold briefs (no persona context)");
  const coldBriefs = [];
  for (let i = 0; i < personas.length; i++) {
    const brief = await generateBrief(buildColdPrompt(), `cold-${i + 1}`);
    coldBriefs.push(brief);
  }

  // Step 3: Write briefs
  console.log("\n\u25b8 Step 3: Writing briefs");
  for (const brief of informedBriefs) {
    const outPath = path.join(BRIEF_DIR, `${brief.personaId}.json`);
    await fs.writeFile(outPath, JSON.stringify(brief, null, 2));
    console.log(`  \u21b3 ${brief.personaId}: "${brief.creative.headline}"`);
  }

  // Step 4: Write comparison report
  const report = buildComparisonReport(informedBriefs, coldBriefs);
  const reportPath = path.join(OUTPUT_DIR, "comparison-report.md");
  await fs.writeFile(reportPath, report);
  console.log(`\n  \u21b3 Comparison report: ${reportPath}`);

  // Summary
  console.log("\n\u2501\u2501\u2501 Results \u2501\u2501\u2501\n");
  console.log("PERSONA-INFORMED:");
  for (const brief of informedBriefs) {
    console.log(`  ${brief.personaId}`);
    console.log(`    Angle: ${brief.persuasionAngle.type}`);
    console.log(`    Image headline: "${brief.creative.headline}"`);
    console.log(`    LinkedIn intro: "${brief.creative.introText}"`);
    if (brief.creative.codeSnippet) {
      console.log(`    Code: (${brief.creative.codeSnippet.split("\n").length} lines)`);
    }
    if (brief.creative.statNumber) {
      console.log(`    Stat: ${brief.creative.statNumber}`);
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
