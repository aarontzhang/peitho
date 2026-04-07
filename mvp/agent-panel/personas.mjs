// Peitho Agent Panel — Persona Loader
// Converts Stripe + Patagonia persona configs into agent system prompts.
// Each agent becomes a "living" persona that can be chatted with, shown ads,
// and given news updates.

import { campaign as stripeCampaign, personas as stripePersonas } from "../../tests/stripe-campaign/config.mjs";
import { campaign as patagoniaCampaign, personas as patagoniaPersonas } from "../../tests/patagonia-campaign/config.mjs";

function buildSystemPrompt(persona, campaign) {
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

export function loadAllPersonas() {
  const agents = [];

  for (const persona of stripePersonas) {
    agents.push(buildAgentConfig(persona, stripeCampaign, "Stripe"));
  }

  for (const persona of patagoniaPersonas) {
    agents.push(buildAgentConfig(persona, patagoniaCampaign, "Patagonia"));
  }

  return agents;
}

export function loadCampaignPersonas(campaignName) {
  if (campaignName === "stripe") {
    return stripePersonas.map((p) => buildAgentConfig(p, stripeCampaign, "Stripe"));
  }
  if (campaignName === "patagonia") {
    return patagoniaPersonas.map((p) => buildAgentConfig(p, patagoniaCampaign, "Patagonia"));
  }
  throw new Error(`Unknown campaign: ${campaignName}. Available: stripe, patagonia`);
}
