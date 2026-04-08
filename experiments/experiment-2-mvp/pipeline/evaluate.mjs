// Peitho Pipeline — Enhanced Evaluation with Anti-Barnum
// Four evaluation mechanisms:
// 1. Standard blind A/B (informed vs baseline)
// 2. Discriminability test (persona swap)
// 3. Persona matching test (blind guess)
// 4. Specificity scoring (proof, objections, anti-patterns, vocabulary)

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";

const client = new Anthropic();
const MODEL = "claude-sonnet-4-20250514";

// ── Helpers ──────────────────────────────────────────────────────────

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
    throw new Error(`Failed to parse ${label}: ${text.slice(0, 300)}`);
  }
}

// ── 1. Blind A/B Evaluation ──────────────────────────────────────────

async function blindABEval(informedVariant, campaign, persona) {
  // Generate a baseline ad (ChatGPT-style minimal prompt)
  const baselinePrompt = `Write an ad for ${campaign.product.split("—")[0].trim()}.
Target audience: ${persona.role}
Format: headline + short body text + CTA.

Output valid JSON only:
{
  "headline": string (max 10 words),
  "bodyText": string (max 150 chars),
  "cta": string
}`;

  const baseline = await callClaude(baselinePrompt, "baseline");

  // Randomize order for blind eval
  const informedIsA = Math.random() < 0.5;
  const adA = informedIsA
    ? { headline: informedVariant.headline, bodyText: informedVariant.bodyText, cta: informedVariant.cta }
    : baseline;
  const adB = informedIsA
    ? baseline
    : { headline: informedVariant.headline, bodyText: informedVariant.bodyText, cta: informedVariant.cta };

  const evalPrompt = `You are an expert ad evaluator conducting a blind assessment.

These two ads target: ${persona.role} (${persona.segment})

## Ad A
Headline: "${adA.headline}"
Body: "${adA.bodyText}"
CTA: "${adA.cta}"

## Ad B
Headline: "${adB.headline}"
Body: "${adB.bodyText}"
CTA: "${adB.cta}"

Score EACH ad (1-10):
1. Attention — stops the scroll?
2. Relevance — feels "for me"?
3. Resonance — makes me feel something?
4. Clarity — immediately clear?
5. CTA Effectiveness — motivated to act?

Output valid JSON only:
{
  "adA": { "attention": N, "relevance": N, "resonance": N, "clarity": N, "cta": N, "composite": N },
  "adB": { "attention": N, "relevance": N, "resonance": N, "clarity": N, "cta": N, "composite": N },
  "winner": "A" | "B" | "tie",
  "reasoning": string
}

Composite = attention*0.25 + relevance*0.25 + resonance*0.20 + clarity*0.15 + cta*0.15`;

  const scores = await callClaude(evalPrompt, "blind-ab");

  const informedScores = informedIsA ? scores.adA : scores.adB;
  const baselineScores = informedIsA ? scores.adB : scores.adA;
  const informedLabel = informedIsA ? "A" : "B";
  const winner =
    scores.winner === informedLabel ? "informed" : scores.winner === "tie" ? "tie" : "baseline";

  return {
    informed: { ...informedVariant, scores: informedScores },
    baseline: { ...baseline, scores: baselineScores },
    winner,
    reasoning: scores.reasoning,
  };
}

// ── 2. Discriminability Test ─────────────────────────────────────────

async function discriminabilityTest(variant, correctPersona, wrongPersonas) {
  const scores = {};

  for (const wrong of wrongPersonas) {
    const prompt = `This ad was supposedly written for a ${wrong.role} (${wrong.segment}).

Ad: "${variant.headline}" — ${variant.bodyText}

How well does this ad work for this specific persona?
Score 1-10 where 1="completely wrong for them" and 10="perfect fit".

Output JSON only: { "score": number, "reasoning": string }`;

    const result = await callClaude(prompt, `discrim-${wrong.id}`);
    scores[wrong.id] = result.score;
  }

  const wrongScoreValues = Object.values(scores);
  const avgWrong = wrongScoreValues.reduce((a, b) => a + b, 0) / wrongScoreValues.length;

  // We need the correct persona score too
  const correctPrompt = `This ad was written for a ${correctPersona.role} (${correctPersona.segment}).

Ad: "${variant.headline}" — ${variant.bodyText}

How well does this ad work for this specific persona?
Score 1-10 where 1="completely wrong for them" and 10="perfect fit".

Output JSON only: { "score": number }`;

  const correctResult = await callClaude(correctPrompt, `discrim-correct-${correctPersona.id}`);
  const correctScore = correctResult.score;

  const ratio = avgWrong > 0 ? correctScore / avgWrong : correctScore;

  return {
    correctScore,
    wrongScores: scores,
    avgWrongScore: Math.round(avgWrong * 10) / 10,
    ratio: Math.round(ratio * 100) / 100,
    isBarnum: ratio < 1.3,
  };
}

// ── 3. Persona Matching Test ─────────────────────────────────────────

async function personaMatchingTest(variants, personas) {
  // Pick one variant per persona (best variant = first for each)
  const personaAds = [];
  const seen = new Set();
  for (const v of variants) {
    if (!seen.has(v.personaId)) {
      seen.add(v.personaId);
      personaAds.push(v);
    }
  }

  if (personaAds.length < 2) return { accuracy: 1.0, matches: {} };

  const letters = "ABCDEFGHIJ";
  const adDescriptions = personaAds
    .map((v, i) => `${letters[i]}. "${v.headline}" — ${v.bodyText}`)
    .join("\n\n");

  const personaDescriptions = personas
    .map((p, i) => `${i + 1}. ${p.role} (${p.segment})`)
    .join("\n");

  const prompt = `You are evaluating ad specificity. Match each ad to the persona it was most likely written for.

## Ads (unlabeled)
${adDescriptions}

## Personas
${personaDescriptions}

Match each ad letter to a persona number. Each persona is used exactly once.

Output JSON only:
{
  "matches": { "A": number, "B": number, ... },
  "confidence": number (0-1, how confident you are in the matching),
  "reasoning": string
}`;

  const result = await callClaude(prompt, "persona-matching");

  // Score accuracy
  let correct = 0;
  for (let i = 0; i < personaAds.length; i++) {
    const guessedIndex = result.matches[letters[i]];
    if (guessedIndex !== undefined && personas[guessedIndex - 1]?.id === personaAds[i].personaId) {
      correct++;
    }
  }

  return {
    accuracy: correct / personaAds.length,
    correct,
    total: personaAds.length,
    matches: result.matches,
    confidence: result.confidence,
    reasoning: result.reasoning,
  };
}

// ── 4. Specificity Scoring ───────────────────────────────────────────

async function specificityScore(variant, persona) {
  const prompt = `Rate this ad's SPECIFICITY (not quality) for its target persona. A specific ad only makes sense for THIS persona — a generic ad could work for many personas.

## Ad
Headline: "${variant.headline}"
Body: "${variant.bodyText}"
CTA: "${variant.cta}"

## Target Persona
Role: ${persona.role}
Segment: ${persona.segment}

## Persona-Specific Details
Proof hierarchy: ${persona.cognition.proofHierarchy.slice(0, 3).join(" > ")}
Real objections: ${persona.objections.real.slice(0, 2).join("; ")}
Anti-patterns: ${persona.antiPatterns.slice(0, 3).join("; ")}
Preferred format: ${persona.communication.preferredFormat}

Score each dimension 1-10:

1. **Proof Alignment** — Does the ad use evidence types from THIS persona's proof hierarchy? (e.g., if they trust "peer community endorsement," does the ad use peer proof, not generic testimonials?)
2. **Objection Addressing** — Does it address a REAL objection (not surface)? Does it acknowledge what they're ACTUALLY worried about?
3. **Anti-Pattern Avoidance** — Does it avoid the specific things that turn THIS persona off? Or does it commit one of their anti-patterns?
4. **Vocabulary Match** — Does the ad use language natural to THIS persona's world? (e.g., a developer hears "API" and "docs," a VP hears "ROI" and "compliance")

Output JSON only:
{
  "proofAlignment": number,
  "objectionAddressing": number,
  "antiPatternAvoidance": number,
  "vocabularyMatch": number,
  "composite": number (average of all 4),
  "specificityVerdict": "high" | "moderate" | "low" | "barnum",
  "reasoning": string
}`;

  return callClaude(prompt, `specificity-${persona.id}`);
}

// ── Generate Evaluation Report ───────────────────────────────────────

function generateReport(results, campaign) {
  let md = `# Peitho Evaluation Report — Anti-Barnum Enhanced\n\n`;
  md += `**Campaign:** ${campaign.product.split("—")[0].trim()}\n`;
  md += `**Date:** ${new Date().toISOString().split("T")[0]}\n\n`;

  // --- Blind A/B Summary ---
  md += `## 1. Blind A/B Results (Informed vs Baseline)\n\n`;
  md += `| Persona | Winner | Informed Score | Baseline Score | Delta |\n`;
  md += `|---------|--------|:-:|:-:|:-:|\n`;

  let iWins = 0, bWins = 0, ties = 0;
  for (const r of results.blindAB) {
    const iScore = r.informed.scores?.composite || "—";
    const bScore = r.baseline.scores?.composite || "—";
    const delta = typeof iScore === "number" && typeof bScore === "number"
      ? `${(iScore - bScore) > 0 ? "+" : ""}${(iScore - bScore).toFixed(1)}`
      : "—";
    md += `| ${r.personaId} | ${r.winner} | ${iScore} | ${bScore} | ${delta} |\n`;
    if (r.winner === "informed") iWins++;
    else if (r.winner === "baseline") bWins++;
    else ties++;
  }
  md += `\n**Informed: ${iWins} wins | Baseline: ${bWins} wins | Ties: ${ties}**\n\n`;

  // --- Discriminability ---
  md += `## 2. Discriminability Scores (Anti-Barnum)\n\n`;
  md += `A ratio > 1.5 means the ad works significantly better for the correct persona than wrong ones.\n\n`;
  md += `| Persona | Correct Score | Avg Wrong Score | Ratio | Status |\n`;
  md += `|---------|:-:|:-:|:-:|--------|\n`;

  for (const r of results.discriminability) {
    const status = r.isBarnum ? "⚠ BARNUM RISK" : "✓ Specific";
    md += `| ${r.personaId} | ${r.correctScore} | ${r.avgWrongScore} | ${r.ratio} | ${status} |\n`;
  }
  md += `\n`;

  // --- Persona Matching ---
  md += `## 3. Persona Matching Test\n\n`;
  const pm = results.personaMatching;
  md += `**Accuracy:** ${pm.correct}/${pm.total} (${(pm.accuracy * 100).toFixed(0)}%)\n`;
  md += `**Confidence:** ${pm.confidence}\n`;
  md += `**Reasoning:** ${pm.reasoning}\n\n`;
  const matchPass = pm.accuracy >= 0.6;
  md += matchPass
    ? `✓ PASS — Ads are sufficiently persona-specific for a blind evaluator to match them.\n\n`
    : `⚠ FAIL — Ads are too generic; a blind evaluator couldn't reliably match them to personas.\n\n`;

  // --- Specificity ---
  md += `## 4. Specificity Scores\n\n`;
  md += `| Persona | Proof | Objections | Anti-Pattern | Vocabulary | Composite | Verdict |\n`;
  md += `|---------|:-:|:-:|:-:|:-:|:-:|--------|\n`;

  for (const r of results.specificity) {
    md += `| ${r.personaId} | ${r.proofAlignment} | ${r.objectionAddressing} | ${r.antiPatternAvoidance} | ${r.vocabularyMatch} | ${r.composite} | ${r.specificityVerdict} |\n`;
  }
  md += `\n`;

  // --- Overall Verdict ---
  md += `## Overall Verdict\n\n`;
  const barnumCount = results.discriminability.filter((d) => d.isBarnum).length;
  const avgSpecificity = results.specificity.reduce((a, r) => a + r.composite, 0) / results.specificity.length;

  if (iWins > bWins && barnumCount === 0 && matchPass && avgSpecificity >= 7) {
    md += `**Strong pass.** Informed creative wins A/B, passes all anti-Barnum checks, and scores high on specificity. The pipeline is producing genuinely persona-differentiated output.\n`;
  } else if (iWins > bWins && barnumCount <= 1) {
    md += `**Pass with caveats.** Informed creative wins A/B, but ${barnumCount > 0 ? `${barnumCount} persona(s) flagged for Barnum risk` : "specificity could be higher"}. Review flagged personas and regenerate with tighter constraints.\n`;
  } else if (iWins <= bWins) {
    md += `**Fail — baseline competitive.** The persona-informed pipeline isn't producing meaningfully better output than generic prompting. Investigate whether the persona schemas are adding noise.\n`;
  } else {
    md += `**Mixed results.** Review the detailed scores to identify which personas benefit from informed generation and which don't.\n`;
  }

  return md;
}

// ── Main Evaluation Function ─────────────────────────────────────────

export async function runEvaluation(campaign, personas, variants, outputDir) {
  console.log(`\n━━━ Evaluation (Anti-Barnum Enhanced) ━━━\n`);

  const results = {
    blindAB: [],
    discriminability: [],
    personaMatching: null,
    specificity: [],
  };

  // Pick one best variant per persona for evaluation
  const bestPerPersona = [];
  const seen = new Set();
  for (const v of variants) {
    if (!seen.has(v.personaId)) {
      seen.add(v.personaId);
      bestPerPersona.push(v);
    }
  }

  // 1. Blind A/B
  console.log("  1/4 Blind A/B evaluation...");
  for (const variant of bestPerPersona) {
    const persona = personas.find((p) => p.id === variant.personaId);
    if (!persona) continue;
    process.stdout.write(`    ${variant.personaId}...`);
    const ab = await blindABEval(variant, campaign, persona);
    ab.personaId = variant.personaId;
    results.blindAB.push(ab);
    console.log(` ${ab.winner}`);
  }

  // 2. Discriminability
  console.log("  2/4 Discriminability test...");
  for (const variant of bestPerPersona) {
    const persona = personas.find((p) => p.id === variant.personaId);
    const otherPersonas = personas.filter((p) => p.id !== variant.personaId);
    if (!persona) continue;
    process.stdout.write(`    ${variant.personaId}...`);
    const discrim = await discriminabilityTest(variant, persona, otherPersonas);
    discrim.personaId = variant.personaId;
    results.discriminability.push(discrim);
    const flag = discrim.isBarnum ? " ⚠ BARNUM" : " ✓";
    console.log(` ratio=${discrim.ratio}${flag}`);
  }

  // 3. Persona matching
  console.log("  3/4 Persona matching test...");
  results.personaMatching = await personaMatchingTest(bestPerPersona, personas);
  console.log(`    Accuracy: ${results.personaMatching.correct}/${results.personaMatching.total}`);

  // 4. Specificity scoring
  console.log("  4/4 Specificity scoring...");
  for (const variant of bestPerPersona) {
    const persona = personas.find((p) => p.id === variant.personaId);
    if (!persona) continue;
    process.stdout.write(`    ${variant.personaId}...`);
    const spec = await specificityScore(variant, persona);
    spec.personaId = variant.personaId;
    results.specificity.push(spec);
    console.log(` ${spec.composite} (${spec.specificityVerdict})`);
  }

  // Generate report
  const report = generateReport(results, campaign);
  const reportPath = path.join(outputDir, "report.md");
  await fs.writeFile(reportPath, report);

  const dataPath = path.join(outputDir, "eval-data.json");
  await fs.writeFile(dataPath, JSON.stringify(results, null, 2));

  console.log(`\n  Report: ${reportPath}`);

  return results;
}
