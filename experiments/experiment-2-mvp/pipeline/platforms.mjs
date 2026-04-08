// Peitho Pipeline — Platform Selection
// For each persona, determines the best advertising platforms — including
// unconventional ones — based on persona psychology and discovery data.

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const MODEL = "claude-sonnet-4-20250514";

// ── Platform Universe ────────────────────────────────────────────────

export const PLATFORM_SPECS = {
  linkedin: {
    name: "LinkedIn Sponsored Post",
    format: { width: 1200, height: 627, copyLimit: 150, headlineLimit: 70, ctaStyle: "button" },
    category: "mainstream",
    description: "B2B professional feed. High-intent decision-makers. Expensive CPM but targeted.",
  },
  instagram_feed: {
    name: "Instagram Feed Ad",
    format: { width: 1080, height: 1080, copyLimit: 125, headlineLimit: 40, ctaStyle: "button" },
    category: "mainstream",
    description: "Visual-first consumer feed. Strong for brand awareness and lifestyle positioning.",
  },
  instagram_story: {
    name: "Instagram Story Ad",
    format: { width: 1080, height: 1920, copyLimit: 100, headlineLimit: 0, ctaStyle: "swipe-up" },
    category: "mainstream",
    description: "Full-screen immersive. 1-3 seconds to hook. Best for short, punchy messaging.",
  },
  meta_feed: {
    name: "Meta/Facebook Feed Ad",
    format: { width: 1080, height: 1080, copyLimit: 125, headlineLimit: 40, ctaStyle: "button" },
    category: "mainstream",
    description: "Broadest reach. Good for retargeting and lookalike audiences.",
  },
  youtube_preroll: {
    name: "YouTube Pre-Roll (15s concept)",
    format: { width: 1920, height: 1080, copyLimit: 0, headlineLimit: 0, ctaStyle: "script" },
    category: "mainstream",
    description: "Video pre-roll. 5 seconds before skip. Must hook instantly.",
  },
  youtube_shorts: {
    name: "YouTube Shorts Ad",
    format: { width: 1080, height: 1920, copyLimit: 100, headlineLimit: 0, ctaStyle: "overlay" },
    category: "mainstream",
    description: "Short-form vertical video. Competes with TikTok/Reels for attention.",
  },
  tiktok: {
    name: "TikTok In-Feed Ad",
    format: { width: 1080, height: 1920, copyLimit: 100, headlineLimit: 0, ctaStyle: "overlay" },
    category: "mainstream",
    description: "Native short-form video. Must feel organic, not branded. Gen Z primary.",
  },
  reddit: {
    name: "Reddit Promoted Post",
    format: { width: 1200, height: 628, copyLimit: 300, headlineLimit: 120, ctaStyle: "link" },
    category: "unconventional",
    description: "Subreddit-targeted. Community-validated audiences. Authenticity required — blatant ads get destroyed in comments.",
  },
  hackernews: {
    name: "Hacker News Sponsor / Show HN",
    format: { width: 0, height: 0, copyLimit: 80, headlineLimit: 80, ctaStyle: "text-link" },
    category: "unconventional",
    description: "Text-only. Technical audience. Zero tolerance for marketing speak. Must provide genuine value.",
  },
  podcast: {
    name: "Podcast Host-Read Ad (60s)",
    format: { width: 0, height: 0, copyLimit: 0, headlineLimit: 0, ctaStyle: "script-60s" },
    category: "unconventional",
    description: "Trust-based medium. Host endorsement. Long attention window. Best for considered purchases.",
  },
  newsletter: {
    name: "Newsletter/Substack Sponsored Placement",
    format: { width: 600, height: 300, copyLimit: 200, headlineLimit: 60, ctaStyle: "link" },
    category: "unconventional",
    description: "Native ad in curated newsletter. High-trust environment. Niche targeting by publication.",
  },
  trade_publication: {
    name: "Trade Publication (Banner + Advertorial)",
    format: { width: 728, height: 90, copyLimit: 500, headlineLimit: 70, ctaStyle: "link" },
    category: "unconventional",
    description: "Industry-specific placement (Creative Bloq, TechCrunch, Ars Technica, etc.). Credibility by association.",
  },
  conference: {
    name: "Conference/Event Sponsorship",
    format: { width: 0, height: 0, copyLimit: 0, headlineLimit: 0, ctaStyle: "concept" },
    category: "unconventional",
    description: "WWDC, SXSW, industry events. Physical + digital presence. High-value but narrow reach.",
  },
  slack_discord: {
    name: "Slack/Discord Community Sponsored Message",
    format: { width: 0, height: 0, copyLimit: 250, headlineLimit: 0, ctaStyle: "text-link" },
    category: "unconventional",
    description: "Professional community channels. Must feel native. Best for developer and niche professional audiences.",
  },
  ctv: {
    name: "Connected TV / Streaming (15s spot)",
    format: { width: 1920, height: 1080, copyLimit: 0, headlineLimit: 0, ctaStyle: "script" },
    category: "mainstream",
    description: "Household-level targeting on streaming platforms. Premium environment. Non-skippable.",
  },
  google_display: {
    name: "Google Display Network",
    format: { width: 1200, height: 628, copyLimit: 90, headlineLimit: 30, ctaStyle: "button" },
    category: "mainstream",
    description: "Programmatic display across millions of sites. Retargeting and ambient reach.",
  },
};

// ── Platform Selection via Claude ────────────────────────────────────

export async function selectPlatforms(persona, campaign, messagingBrief) {
  const platformList = Object.entries(PLATFORM_SPECS)
    .map(([key, spec]) => `- **${key}** (${spec.category}): ${spec.name} — ${spec.description}`)
    .join("\n");

  const prompt = `You are a media strategist selecting advertising platforms for a specific audience persona.

## Campaign
Product: ${campaign.product}
Company: ${campaign.company.split(".")[0]}

## Target Persona
Role: ${persona.role}
Segment: ${persona.segment}
Info processing: ${persona.cognition.informationProcessing}
Risk orientation: ${persona.cognition.riskOrientation}
Preferred format: ${persona.communication.preferredFormat}
Social proof type: ${persona.communication.socialProofType}
Attention window: ${persona.communication.attentionWindow}

## Discovery Insights
Pain points: ${messagingBrief.painPoints.join("; ")}
Vocabulary: ${messagingBrief.vocabulary.join(", ")}
Platform hints from interview: ${messagingBrief.platformHints.join(", ") || "none"}
Top messaging angle: "${messagingBrief.topAngles[0]?.headline || "N/A"}"

## Available Platforms
${platformList}

Select the TOP 3 platforms for this persona. You MUST include at least 1 unconventional platform (category: "unconventional").

For each platform, explain:
1. Why this persona is likely HERE (not just "because it's popular")
2. How the platform's content grammar matches their attention window and info processing style
3. What specific subreddit, publication, podcast, newsletter, or community (if applicable)

Think beyond the obvious. A privacy-focused developer might respond better to a podcast ad on ATP than a LinkedIn post. A creative director might be reached through Creative Review's newsletter, not Meta ads.

Output valid JSON only:
[
  {
    "platformKey": string (must match a key from the list above),
    "score": number (1-10, how confident this is the right platform),
    "rationale": string (2-3 sentences — why THIS persona on THIS platform),
    "specificPlacement": string | null (specific subreddit, publication, podcast name, etc.),
    "whyUnconventional": string | null (for unconventional picks — why this is better than mainstream alternatives)
  }
]`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text;
  let platforms;
  try {
    platforms = JSON.parse(text);
  } catch {
    const match = text.match(/\[[\s\S]*\]/);
    if (match) platforms = JSON.parse(match[0]);
    else throw new Error(`Failed to parse platform selection: ${text.slice(0, 200)}`);
  }

  // Attach format specs
  return platforms.map((p) => ({
    ...p,
    name: PLATFORM_SPECS[p.platformKey]?.name || p.platformKey,
    format: PLATFORM_SPECS[p.platformKey]?.format || null,
    category: PLATFORM_SPECS[p.platformKey]?.category || "unknown",
  }));
}

// ── Run platform selection for all personas ──────────────────────────

export async function runPlatformSelection(campaign, personas, messagingBriefs) {
  console.log(`\n━━━ Platform Selection ━━━\n`);

  const selections = [];

  for (const persona of personas) {
    const brief = messagingBriefs.find((b) => b.personaId === persona.id);
    if (!brief) {
      console.log(`  ⚠ No messaging brief for ${persona.id}, skipping`);
      continue;
    }

    process.stdout.write(`  ${persona.id}...`);
    const platforms = await selectPlatforms(persona, campaign, brief);
    console.log(` → ${platforms.map((p) => p.platformKey).join(", ")}`);

    selections.push({
      personaId: persona.id,
      role: persona.role,
      platforms,
    });
  }

  return selections;
}
