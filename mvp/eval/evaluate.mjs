#!/usr/bin/env node

// Peitho Eval — Automated Blind A/B Evaluation
// Generates persona-informed vs baseline ads, then scores them blind.
// Answers: does persona-informed creative actually beat ChatGPT-level output?

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { buildInformedPrompt, buildBaselinePrompt, buildEvalPrompt } from "./prompts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODEL = "claude-sonnet-4-20250514";
const RUNS_PER_PERSONA = 3;

const client = new Anthropic();

// ── Load campaign configs ─────────────────────────────────────────────

async function loadCampaign(name) {
  if (name === "stripe") {
    const { campaign, personas } = await import("../../tests/stripe-campaign/config.mjs");
    return { campaign, personas };
  }
  if (name === "patagonia") {
    const { campaign, personas } = await import("../../tests/patagonia-campaign/config.mjs");
    return { campaign, personas };
  }
  throw new Error(`Unknown campaign: ${name}. Available: stripe, patagonia`);
}

// ── Claude API call ───────────────────────────────────────────────────

async function callClaude(prompt, label) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Failed to parse response for ${label}: ${text.slice(0, 200)}`);
  }
}

// ── Main pipeline ─────────────────────────────────────────────────────

async function runEvaluation(campaignName) {
  console.log(`\n━━━ Peitho Blind Evaluation ━━━\n`);
  console.log(`Campaign: ${campaignName}`);
  console.log(`Runs per persona: ${RUNS_PER_PERSONA}\n`);

  const { campaign, personas } = await loadCampaign(campaignName);
  console.log(`Personas: ${personas.length}`);
  console.log(`Total evaluations: ${personas.length * RUNS_PER_PERSONA}\n`);

  const results = [];

  for (const persona of personas) {
    console.log(`▸ ${persona.role} (${persona.id})`);
    const personaResults = [];

    for (let run = 0; run < RUNS_PER_PERSONA; run++) {
      process.stdout.write(`  Run ${run + 1}/${RUNS_PER_PERSONA}: `);

      // Step 1: Generate persona-informed ad
      process.stdout.write("informed...");
      const informedPrompt = buildInformedPrompt(persona, campaign);
      const informedAd = await callClaude(informedPrompt, `informed-${persona.id}-${run}`);

      // Step 2: Generate baseline ad
      process.stdout.write("baseline...");
      const baselinePrompt = buildBaselinePrompt(campaign, persona.role);
      const baselineAd = await callClaude(baselinePrompt, `baseline-${persona.id}-${run}`);

      // Step 3: Blind evaluation (randomize order)
      process.stdout.write("scoring...");
      const informedIsA = Math.random() < 0.5;
      const adA = informedIsA ? informedAd : baselineAd;
      const adB = informedIsA ? baselineAd : informedAd;

      const evalPrompt = buildEvalPrompt(adA, adB, persona.role, persona.segment);
      const scores = await callClaude(evalPrompt, `eval-${persona.id}-${run}`);

      // Map back to informed/baseline
      const informedScores = informedIsA ? scores.adA : scores.adB;
      const baselineScores = informedIsA ? scores.adB : scores.adA;
      const informedLabel = informedIsA ? "A" : "B";
      const winner =
        scores.winner === informedLabel
          ? "informed"
          : scores.winner === "tie"
            ? "tie"
            : "baseline";

      personaResults.push({
        run: run + 1,
        informed: { ...informedAd, scores: informedScores },
        baseline: { ...baselineAd, scores: baselineScores },
        winner,
        reasoning: scores.reasoning,
      });

      console.log(` → ${winner === "informed" ? "✓ INFORMED" : winner === "baseline" ? "✗ BASELINE" : "~ TIE"}`);
    }

    results.push({
      personaId: persona.id,
      role: persona.role,
      segment: persona.segment,
      runs: personaResults,
    });
  }

  return { campaignName, campaign, results };
}

// ── Report generation ─────────────────────────────────────────────────

function generateReport(data) {
  let md = `# Peitho Blind Evaluation Report\n\n`;
  md += `**Campaign:** ${data.campaign.product}\n`;
  md += `**Date:** ${new Date().toISOString().split("T")[0]}\n`;
  md += `**Runs per persona:** ${RUNS_PER_PERSONA}\n\n`;

  // Summary table
  let informedWins = 0;
  let baselineWins = 0;
  let ties = 0;
  let totalInformedComposite = 0;
  let totalBaselineComposite = 0;
  let totalRuns = 0;

  md += `## Summary\n\n`;
  md += `| Persona | Informed Wins | Baseline Wins | Ties | Avg Informed | Avg Baseline | Delta |\n`;
  md += `|---------|:---:|:---:|:---:|:---:|:---:|:---:|\n`;

  for (const persona of data.results) {
    let pInformed = 0, pBaseline = 0, pTies = 0;
    let pInfComp = 0, pBaseComp = 0;

    for (const run of persona.runs) {
      if (run.winner === "informed") { pInformed++; informedWins++; }
      else if (run.winner === "baseline") { pBaseline++; baselineWins++; }
      else { pTies++; ties++; }

      pInfComp += run.informed.scores.composite;
      pBaseComp += run.baseline.scores.composite;
      totalRuns++;
    }

    const avgInf = (pInfComp / persona.runs.length).toFixed(1);
    const avgBase = (pBaseComp / persona.runs.length).toFixed(1);
    const delta = (pInfComp / persona.runs.length - pBaseComp / persona.runs.length).toFixed(1);
    totalInformedComposite += pInfComp;
    totalBaselineComposite += pBaseComp;

    md += `| ${persona.role} | ${pInformed} | ${pBaseline} | ${pTies} | ${avgInf} | ${avgBase} | ${delta > 0 ? "+" : ""}${delta} |\n`;
  }

  const avgInfTotal = (totalInformedComposite / totalRuns).toFixed(1);
  const avgBaseTotal = (totalBaselineComposite / totalRuns).toFixed(1);
  const deltaTotal = (totalInformedComposite / totalRuns - totalBaselineComposite / totalRuns).toFixed(1);

  md += `| **TOTAL** | **${informedWins}** | **${baselineWins}** | **${ties}** | **${avgInfTotal}** | **${avgBaseTotal}** | **${deltaTotal > 0 ? "+" : ""}${deltaTotal}** |\n\n`;

  // Verdict
  md += `## Verdict\n\n`;
  if (informedWins > baselineWins * 1.5) {
    md += `**Persona-informed creative wins decisively.** Informed ads won ${informedWins}/${totalRuns} evaluations with an average composite score delta of ${deltaTotal > 0 ? "+" : ""}${deltaTotal}. The persona-informed pipeline produces measurably better output than generic prompting.\n\n`;
  } else if (informedWins > baselineWins) {
    md += `**Persona-informed creative has an edge, but it's not decisive.** Informed ads won ${informedWins}/${totalRuns} evaluations. The advantage exists but needs to be stronger to justify the pipeline complexity.\n\n`;
  } else if (informedWins === baselineWins) {
    md += `**No clear winner.** Both approaches produced comparable results. This challenges the hypothesis that persona-informed generation is meaningfully better.\n\n`;
  } else {
    md += `**Baseline won more evaluations.** This is a negative signal for the persona-informed pipeline. Investigate whether the persona schemas are adding noise rather than signal.\n\n`;
  }

  // Detailed results per persona
  md += `---\n\n## Detailed Results\n\n`;

  for (const persona of data.results) {
    md += `### ${persona.role} — ${persona.segment}\n\n`;

    for (const run of persona.runs) {
      md += `**Run ${run.run}** — Winner: ${run.winner}\n\n`;
      md += `| Dimension | Informed | Baseline |\n`;
      md += `|-----------|:---:|:---:|\n`;
      md += `| Attention | ${run.informed.scores.attention} | ${run.baseline.scores.attention} |\n`;
      md += `| Relevance | ${run.informed.scores.relevance} | ${run.baseline.scores.relevance} |\n`;
      md += `| Resonance | ${run.informed.scores.resonance} | ${run.baseline.scores.resonance} |\n`;
      md += `| Clarity | ${run.informed.scores.clarity} | ${run.baseline.scores.clarity} |\n`;
      md += `| CTA | ${run.informed.scores.ctaEffectiveness} | ${run.baseline.scores.ctaEffectiveness} |\n`;
      md += `| **Composite** | **${run.informed.scores.composite}** | **${run.baseline.scores.composite}** |\n\n`;

      md += `**Informed:** "${run.informed.headline}" — ${run.informed.persuasionAngle}\n`;
      md += `**Baseline:** "${run.baseline.headline}" — ${run.baseline.persuasionAngle}\n\n`;
      md += `*${run.reasoning}*\n\n`;
    }

    md += `---\n\n`;
  }

  return md;
}

// ── Entry point ───────────────────────────────────────────────────────

async function main() {
  const campaignName = process.argv[2] || "stripe";
  const data = await runEvaluation(campaignName);

  const report = generateReport(data);
  const outDir = path.join(__dirname, "results");
  await fs.mkdir(outDir, { recursive: true });

  const reportPath = path.join(outDir, `${campaignName}-eval-${Date.now()}.md`);
  await fs.writeFile(reportPath, report);

  const dataPath = path.join(outDir, `${campaignName}-eval-${Date.now()}.json`);
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));

  console.log(`\n━━━ Results ━━━\n`);
  console.log(`Report: ${reportPath}`);
  console.log(`Raw data: ${dataPath}`);

  // Print quick summary
  let iWins = 0, bWins = 0, t = 0;
  for (const p of data.results) {
    for (const r of p.runs) {
      if (r.winner === "informed") iWins++;
      else if (r.winner === "baseline") bWins++;
      else t++;
    }
  }
  console.log(`\nInformed: ${iWins} wins | Baseline: ${bWins} wins | Ties: ${t}`);
  console.log();
}

main().catch((err) => {
  console.error("Evaluation failed:", err);
  process.exit(1);
});
