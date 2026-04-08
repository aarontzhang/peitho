#!/usr/bin/env node

// Peitho Pipeline — Main Orchestrator
// End-to-end: campaign config → agent simulation → messaging discovery
// → platform selection → ad generation → visual rendering → evaluation
//
// Usage: node run.mjs <campaign-name>
// Example: node run.mjs apple

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { loadCampaignRaw, buildSystemPrompt, buildAgentConfig } from "../agent-panel/personas.mjs";
import { runDiscovery } from "./discover.mjs";
import { runPlatformSelection, PLATFORM_SPECS } from "./platforms.mjs";
import { runGeneration } from "./generate.mjs";
import { renderAds } from "./render.mjs";
import { runEvaluation } from "./evaluate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Colors ───────────────────────────────────────────────────────────

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;

// ── Main Pipeline ────────────────────────────────────────────────────

async function main() {
  const campaignName = process.argv[2];
  if (!campaignName) {
    console.error("Usage: node run.mjs <campaign-name>");
    console.error("Example: node run.mjs apple");
    process.exit(1);
  }

  const startTime = Date.now();

  console.log();
  console.log(bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(bold("  Peitho Pipeline — End-to-End Ad Generation"));
  console.log(bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log();

  // ── Step 1: Load Campaign ──────────────────────────────────────────

  console.log(cyan("Step 1/6:"), "Loading campaign config...");
  const { campaign, personas } = await loadCampaignRaw(campaignName);
  console.log(`  Campaign: ${campaign.product.split("—")[0].trim()}`);
  console.log(`  Personas: ${personas.length}`);
  personas.forEach((p) => console.log(`    - ${p.id}: ${p.role}`));

  // ── Step 2: Output Directory ───────────────────────────────────────

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const outputDir = path.join(__dirname, "output", `${campaignName}-${timestamp}`);
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(path.join(outputDir, "briefs"), { recursive: true });
  await fs.mkdir(path.join(outputDir, "ads"), { recursive: true });
  console.log(`  Output: ${outputDir}\n`);

  // ── Step 3: Messaging Discovery ────────────────────────────────────

  console.log(cyan("Step 2/6:"), "Running messaging discovery...");
  const { briefs: messagingBriefs } = await runDiscovery(campaign, personas);

  // Save briefs
  for (const brief of messagingBriefs) {
    const briefPath = path.join(outputDir, "briefs", `${brief.personaId}.json`);
    await fs.writeFile(briefPath, JSON.stringify(brief, null, 2));
  }

  // Print discovery summary
  console.log(`\n${bold("Discovery Summary:")}`);
  for (const brief of messagingBriefs) {
    const flag = brief.isBarnum ? yellow(" ⚠ BARNUM") : green(" ✓");
    console.log(`  ${brief.personaId}:${flag} discrim=${brief.discriminabilityScore}`);
    console.log(`    Top angle: "${brief.topAngles[0]?.headline}" (${brief.topAngles[0]?.score}/10)`);
    console.log(`    Pain points: ${brief.painPoints.slice(0, 2).join("; ")}`);
  }

  // ── Step 4: Platform Selection ─────────────────────────────────────

  console.log(`\n${cyan("Step 3/6:")} Selecting platforms...`);
  const platformSelections = await runPlatformSelection(campaign, personas, messagingBriefs);

  // Print platform summary
  console.log(`\n${bold("Platform Summary:")}`);
  for (const sel of platformSelections) {
    const platforms = sel.platforms.map((p) => {
      const tag = p.category === "unconventional" ? ` ${yellow("(unconventional)")}` : "";
      return `${p.platformKey}${tag}`;
    });
    console.log(`  ${sel.personaId}: ${platforms.join(", ")}`);
  }

  // ── Step 5: Ad Generation + Visuals ────────────────────────────────

  console.log(`\n${cyan("Step 4/6:")} Generating ads (copy + visuals)...`);

  // Attach format info to each variant for rendering
  const allVariants = await runGeneration(campaign, personas, messagingBriefs, platformSelections, outputDir);

  // Enrich variants with format specs for rendering
  for (const v of allVariants) {
    const platformSel = platformSelections
      .find((s) => s.personaId === v.personaId)
      ?.platforms.find((p) => p.platformKey === v.platformKey);
    v.format = platformSel?.format || PLATFORM_SPECS[v.platformKey]?.format || null;
    v.ctaStyle = v.format?.ctaStyle || "button";
  }

  console.log(`\n  Total variants: ${allVariants.length}`);

  // ── Step 6: Render Visuals ─────────────────────────────────────────

  console.log(`\n${cyan("Step 5/6:")} Rendering final ad images...`);
  const renderedVariants = await renderAds(allVariants, campaign, outputDir);

  // ── Step 7: Evaluation ─────────────────────────────────────────────

  console.log(`\n${cyan("Step 6/6:")} Running evaluation (anti-Barnum enhanced)...`);
  const evalResults = await runEvaluation(campaign, personas, renderedVariants, outputDir);

  // ── Save full pipeline data ────────────────────────────────────────

  const fullData = {
    campaign: campaignName,
    timestamp,
    messagingBriefs,
    platformSelections,
    variants: renderedVariants.map((v) => ({
      personaId: v.personaId,
      platformKey: v.platformKey,
      variantIndex: v.variantIndex,
      headline: v.headline,
      bodyText: v.bodyText,
      cta: v.cta,
      emotionalAngle: v.emotionalAngle,
      tone: v.tone,
      persuasionAngle: v.persuasionAngle,
      rationale: v.rationale,
      renderedPath: v.renderedPath || null,
    })),
    evaluation: evalResults,
  };

  const dataPath = path.join(outputDir, "pipeline-data.json");
  await fs.writeFile(dataPath, JSON.stringify(fullData, null, 2));

  // ── Final Summary ──────────────────────────────────────────────────

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);

  console.log();
  console.log(bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(bold("  Pipeline Complete"));
  console.log(bold("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log();
  console.log(`  Campaign:    ${campaign.product.split("—")[0].trim()}`);
  console.log(`  Personas:    ${personas.length}`);
  console.log(`  Platforms:   ${[...new Set(renderedVariants.map((v) => v.platformKey))].length} unique`);
  console.log(`  Variants:    ${renderedVariants.length} total`);
  console.log(`  Visual ads:  ${renderedVariants.filter((v) => v.renderedPath).length} PNGs`);
  console.log(`  Time:        ${elapsed}s`);
  console.log();
  console.log(`  Output:      ${outputDir}`);
  console.log(`  Report:      ${path.join(outputDir, "report.md")}`);
  console.log(`  Full data:   ${dataPath}`);
  console.log();

  // Quick eval summary
  const abWins = evalResults.blindAB.filter((r) => r.winner === "informed").length;
  const barnumFlags = evalResults.discriminability.filter((d) => d.isBarnum).length;
  const matchAcc = evalResults.personaMatching
    ? `${(evalResults.personaMatching.accuracy * 100).toFixed(0)}%`
    : "—";
  const avgSpec = evalResults.specificity.length > 0
    ? (evalResults.specificity.reduce((a, r) => a + r.composite, 0) / evalResults.specificity.length).toFixed(1)
    : "—";

  console.log(bold("  Evaluation:"));
  console.log(`    A/B wins:        ${abWins}/${evalResults.blindAB.length} informed`);
  console.log(`    Barnum flags:    ${barnumFlags}/${evalResults.discriminability.length}`);
  console.log(`    Persona match:   ${matchAcc}`);
  console.log(`    Avg specificity: ${avgSpec}/10`);
  console.log();
}

main().catch((err) => {
  console.error("\nPipeline failed:", err);
  process.exit(1);
});
