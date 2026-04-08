// Peitho Pipeline — Messaging Discovery
// Uses agent simulation to discover what messaging resonates per persona.
// Three phases: pain point excavation, angle testing, cross-persona differentiation.

import Anthropic from "@anthropic-ai/sdk";
import { AgentPanel } from "../agent-panel/agents.mjs";
import { buildSystemPrompt, buildAgentConfig } from "../agent-panel/personas.mjs";

const client = new Anthropic();
const MODEL = "claude-sonnet-4-20250514";

// ── Phase A: Pain Point Excavation ──────────────────────────────────

async function excavatePainPoints(panel, persona, campaign) {
  const id = persona.id;
  const questions = [
    "What's the single biggest frustration in your daily workflow that technology should solve but doesn't?",
    `When you hear '${campaign.company.split(".")[0].split("—")[0].trim()} now has AI features,' what's your honest first reaction?`,
    "What would an AI feature need to do for you to actually change your behavior — not just try it once, but genuinely integrate it into how you work?",
  ];

  const responses = [];
  for (const q of questions) {
    const response = await panel.chat(id, q);
    responses.push({ question: q, response });
  }

  return responses;
}

// ── Phase B: Angle Testing ──────────────────────────────────────────

async function generateCandidateAngles(persona, campaign) {
  const prompt = `You are a B2B/B2C advertising strategist. Generate 6 distinct messaging angles for advertising ${campaign.product} to this specific persona:

Role: ${persona.role}
Segment: ${persona.segment}

Psychology:
- Info processing: ${persona.cognition.informationProcessing}
- Risk orientation: ${persona.cognition.riskOrientation}
- Proof hierarchy: ${persona.cognition.proofHierarchy.join(" > ")}

Real objections (what they actually think):
${persona.objections.real.map((o) => `- ${o}`).join("\n")}

Anti-patterns to AVOID:
${persona.antiPatterns.map((a) => `- ${a}`).join("\n")}

Generate 6 angles, each using a DIFFERENT emotional lever:
1. Fear/loss aversion
2. Aspiration/identity
3. Social proof/peer validation
4. Rational/evidence-based
5. Humor/irreverence
6. Wild card — something unconventional that most marketers wouldn't try

For each angle, write a short LinkedIn-style ad (headline + 1-2 sentence body). Make each angle genuinely DIFFERENT — not 6 variations of the same pitch.

Output valid JSON only:
[
  {
    "angleType": string,
    "headline": string (max 10 words),
    "body": string (max 150 chars),
    "psychologicalLever": string (1 sentence — what makes this work for THIS persona)
  }
]`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        const cleaned = match[0]
          .replace(/,\s*([\]}])/g, "$1")
          .replace(/[\x00-\x1f]/g, " ");
        return JSON.parse(cleaned);
      }
    }
    throw new Error(`Failed to parse angles: ${text.slice(0, 200)}`);
  }
}

async function testAnglesWithAgent(panel, personaId, angles) {
  const results = [];

  for (const angle of angles) {
    const adCopy = `${angle.headline}\n\n${angle.body}`;
    const response = await panel.react(personaId, adCopy);

    // Ask Claude to score the reaction (separate call to avoid bias)
    const scoreResponse = await client.messages.create({
      model: MODEL,
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `A simulated persona reacted to an ad. Rate their reaction on a scale of 1-10 where:
1-3 = negative/dismissive, 4-5 = indifferent, 6-7 = mildly interested, 8-10 = genuinely engaged/would click.

Ad shown: "${angle.headline} — ${angle.body}"
Reaction: "${response}"

Output JSON only: { "score": number, "sentiment": "negative"|"neutral"|"positive", "keyPhrase": string (the most telling phrase from their reaction) }`,
        },
      ],
    });

    const scoreText = scoreResponse.content[0].text;
    let score;
    try {
      score = JSON.parse(scoreText);
    } catch {
      const match = scoreText.match(/\{[\s\S]*\}/);
      if (match) {
        try { score = JSON.parse(match[0]); } catch {
          try { score = JSON.parse(match[0].replace(/,\s*([\]}])/g, "$1")); } catch {
            score = { score: 5, sentiment: "neutral", keyPhrase: "" };
          }
        }
      } else {
        score = { score: 5, sentiment: "neutral", keyPhrase: "" };
      }
    }

    results.push({
      angle: angle.angleType,
      headline: angle.headline,
      body: angle.body,
      lever: angle.psychologicalLever,
      reaction: response,
      score: score.score,
      sentiment: score.sentiment,
      keyPhrase: score.keyPhrase,
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results;
}

// ── Phase C: Cross-Persona Discriminability (Anti-Barnum) ────────────

async function testDiscriminability(panel, topAngle, sourcePersonaId, allPersonaIds) {
  const otherIds = allPersonaIds.filter((id) => id !== sourcePersonaId);
  const adCopy = `${topAngle.headline}\n\n${topAngle.body}`;
  const scores = {};

  // Get score for the correct persona (already have it)
  scores[sourcePersonaId] = topAngle.score;

  // Test against wrong personas
  for (const wrongId of otherIds) {
    const response = await panel.react(wrongId, adCopy);

    const scoreResponse = await client.messages.create({
      model: MODEL,
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `A simulated persona reacted to an ad. Rate their reaction 1-10 (1=dismissive, 10=genuinely engaged).

Ad: "${adCopy}"
Reaction: "${response}"

Output JSON only: { "score": number }`,
        },
      ],
    });

    const text = scoreResponse.content[0].text;
    try {
      scores[wrongId] = JSON.parse(text).score;
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      scores[wrongId] = match ? JSON.parse(match[0]).score : 5;
    }
  }

  // Compute discriminability
  const correctScore = scores[sourcePersonaId];
  const wrongScores = otherIds.map((id) => scores[id]);
  const avgWrongScore = wrongScores.reduce((a, b) => a + b, 0) / wrongScores.length;
  const ratio = avgWrongScore > 0 ? correctScore / avgWrongScore : correctScore;

  return {
    correctPersonaScore: correctScore,
    wrongPersonaScores: scores,
    avgWrongScore: Math.round(avgWrongScore * 10) / 10,
    discriminabilityRatio: Math.round(ratio * 100) / 100,
    isBarnum: ratio < 1.3, // flag if the ad works almost as well for wrong personas
  };
}

// ── Extract Messaging Brief ──────────────────────────────────────────

async function extractBrief(painPointResponses, angleResults, discriminability) {
  const prompt = `Analyze these persona interview responses and ad reactions to extract a structured messaging brief.

## Pain Point Interview
${painPointResponses.map((r) => `Q: ${r.question}\nA: ${r.response}`).join("\n\n")}

## Ad Angle Reactions (sorted by score, best first)
${angleResults.map((r) => `[Score: ${r.score}/10] ${r.angle}: "${r.headline}" — Reaction: "${r.reaction.slice(0, 200)}"`).join("\n")}

Extract:
1. Top 3 pain points (specific, not generic)
2. Vocabulary the persona naturally used (industry terms, phrases, specific language)
3. Messaging to avoid (what got negative reactions)
4. Platform/media hints (any channels or media the persona mentioned or implied)

Output valid JSON only:
{
  "painPoints": [string, string, string],
  "vocabulary": [string] (5-10 terms/phrases),
  "avoidList": [string] (3-5 specific things to avoid),
  "platformHints": [string] (any media/channels mentioned or implied)
}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text;
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        // Fix common JSON issues: trailing commas, unescaped quotes
        const cleaned = match[0]
          .replace(/,\s*([\]}])/g, "$1")
          .replace(/[\x00-\x1f]/g, " ");
        try {
          return JSON.parse(cleaned);
        } catch {
          console.log(`    ⚠ Brief JSON parse failed, using fallback`);
          return { painPoints: [], vocabulary: [], avoidList: [], platformHints: [] };
        }
      }
    }
    return { painPoints: [], vocabulary: [], avoidList: [], platformHints: [] };
  }
}

// ── Main Discovery Function ──────────────────────────────────────────

export async function runDiscovery(campaign, personas) {
  console.log(`\n━━━ Messaging Discovery ━━━\n`);

  // Initialize agent panel
  const panel = new AgentPanel();
  for (const persona of personas) {
    const config = buildAgentConfig(persona, campaign, campaign.company.split(".")[0].trim());
    panel.addAgent(config);
  }

  const allIds = personas.map((p) => p.id);
  const briefs = [];

  for (const persona of personas) {
    console.log(`\n▸ ${persona.role} (${persona.id})`);

    // Phase A: Pain points
    process.stdout.write("  Pain points...");
    const painPoints = await excavatePainPoints(panel, persona, campaign);
    console.log(" done");

    // Phase B: Angle testing
    process.stdout.write("  Generating angles...");
    const angles = await generateCandidateAngles(persona, campaign);
    console.log(` ${angles.length} angles`);

    process.stdout.write("  Testing angles...");
    const angleResults = await testAnglesWithAgent(panel, persona.id, angles);
    console.log(" scored");

    // Phase C: Discriminability
    const topAngle = angleResults[0];
    process.stdout.write("  Discriminability test...");
    const discrim = await testDiscriminability(panel, topAngle, persona.id, allIds);
    const flag = discrim.isBarnum ? " ⚠ BARNUM RISK" : " ✓ specific";
    console.log(` ratio=${discrim.discriminabilityRatio}${flag}`);

    // Extract brief
    process.stdout.write("  Extracting brief...");
    const extracted = await extractBrief(painPoints, angleResults, discrim);
    console.log(" done");

    briefs.push({
      personaId: persona.id,
      role: persona.role,
      topAngles: angleResults.slice(0, 3).map((r) => ({
        angle: r.angle,
        headline: r.headline,
        body: r.body,
        lever: r.lever,
        score: r.score,
        sentiment: r.sentiment,
      })),
      painPoints: extracted.painPoints,
      vocabulary: extracted.vocabulary,
      avoidList: extracted.avoidList,
      platformHints: extracted.platformHints,
      discriminabilityScore: discrim.discriminabilityRatio,
      isBarnum: discrim.isBarnum,
      rawAngleResults: angleResults,
      rawPainPoints: painPoints,
      rawDiscriminability: discrim,
    });
  }

  return { briefs, panel };
}
