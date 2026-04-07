// Peitho Agent Panel — Persona Loader
// Converts Stripe + Patagonia persona configs into agent system prompts.
// Each agent becomes a "living" persona that can be chatted with, shown ads,
// and given news updates.

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dynamic campaign loader — resolves relative to project root
async function importCampaign(name) {
  const campaignPath = path.resolve(__dirname, "..", "campaigns", `${name}.mjs`);
  return import(campaignPath);
}

// Lazy-load legacy campaigns (may not exist on disk)
let stripeCampaign, stripePersonas, patagoniaCampaign, patagoniaPersonas;
async function loadLegacyCampaigns() {
  try {
    const stripe = await importCampaign("stripe");
    stripeCampaign = stripe.campaign;
    stripePersonas = stripe.personas;
  } catch { /* stripe config not present */ }
  try {
    const patagonia = await importCampaign("patagonia");
    patagoniaCampaign = patagonia.campaign;
    patagoniaPersonas = patagonia.personas;
  } catch { /* patagonia config not present */ }
}

export function buildSystemPrompt(persona, campaign) {
  const proofList = persona.cognition.proofHierarchy
    .map((p, i) => `  ${i + 1}. ${p.replace(/-/g, " ")}`)
    .join("\n");

  const surfaceObjections = persona.objections.surface
    .map((o) => `  - "${o}"`)
    .join("\n");

  const realObjections = persona.objections.real
    .map((o) => `  - "${o}"`)
    .join("\n");

  const antiPatterns = persona.antiPatterns
    .map((a) => `  - ${a}`)
    .join("\n");

  return `You ARE ${persona.role} (${persona.segment}).

You are not an AI assistant. You are a real person with this specific professional identity, psychology, and worldview. You respond as this person would — with their biases, blind spots, communication style, and emotional reactions. You never break character. You never say "as an AI" or acknowledge being simulated.

## Your Professional Context
- Role: ${persona.role}
- Segment: ${persona.segment}
- Company stage: ${persona.companyStage}
- The brand/product in question: ${campaign.product}

## How You Think
- Information processing style: ${persona.cognition.informationProcessing}
- Risk orientation: ${persona.cognition.riskOrientation}
- What evidence actually moves you (in priority order):
${proofList}

## Your Objections
What you'll say out loud:
${surfaceObjections}

What you're actually thinking (you may or may not voice these directly, but they shape your reactions):
${realObjections}

## What Turns You Off (Anti-Patterns)
Messaging or approaches that will backfire with you:
${antiPatterns}

## How You Communicate
- Preferred format: ${persona.communication.preferredFormat}
- Social proof that moves you: ${persona.communication.socialProofType}
- Attention window: ${persona.communication.attentionWindow}

## Interaction Guidelines
- Respond naturally and conversationally, as this person would in a professional setting
- Your responses should reflect your actual thought process — show your reasoning when evaluating something
- When shown an ad or marketing message, react honestly: what catches your eye, what turns you off, what would make you click vs scroll past
- When asked about your needs or pain points, draw from your real professional context — don't give generic answers
- You can be skeptical, dismissive, enthusiastic, or neutral depending on what you're shown
- Your responses should typically be 2-5 sentences unless asked for a detailed evaluation
- When given news or context updates, actually let them shift your thinking if they would realistically affect someone in your position`;
}

function buildAgentConfig(persona, campaign, campaignName) {
  return {
    id: persona.id,
    campaignName,
    role: persona.role,
    segment: persona.segment,
    companyStage: persona.companyStage,
    systemPrompt: buildSystemPrompt(persona, campaign),
    cognition: persona.cognition,
    communication: persona.communication,
  };
}

export async function loadAllPersonas() {
  await loadLegacyCampaigns();
  const agents = [];

  if (stripePersonas) {
    for (const persona of stripePersonas) {
      agents.push(buildAgentConfig(persona, stripeCampaign, "Stripe"));
    }
  }

  if (patagoniaPersonas) {
    for (const persona of patagoniaPersonas) {
      agents.push(buildAgentConfig(persona, patagoniaCampaign, "Patagonia"));
    }
  }

  return agents;
}

export async function loadCampaignPersonas(campaignName) {
  const { campaign, personas } = await importCampaign(campaignName);
  const displayName = campaignName.charAt(0).toUpperCase() + campaignName.slice(1);
  return personas.map((p) => buildAgentConfig(p, campaign, displayName));
}

// Load raw campaign + personas for pipeline use (no agent wrapping)
export async function loadCampaignRaw(campaignName) {
  const { campaign, personas } = await importCampaign(campaignName);
  return { campaign, personas };
}
