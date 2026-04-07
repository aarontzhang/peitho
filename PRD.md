# Peitho - Product Requirements Document

**Version:** 2.0
**Date:** April 7, 2026
**Status:** Draft — updated post cofounder alignment

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision & Core Thesis](#3-vision--core-thesis)
4. [Target Customer](#4-target-customer)
5. [User Personas](#5-user-personas)
6. [MVP Feature Specification](#6-mvp-feature-specification)
7. [User Flow](#7-user-flow)
8. [Technical Architecture](#8-technical-architecture)
9. [Data Model](#9-data-model)
10. [API Endpoints](#10-api-endpoints)
11. [Long-Term Roadmap](#11-long-term-roadmap)
12. [Success Metrics](#12-success-metrics)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Competitive Landscape](#14-competitive-landscape)

---

## 1. Executive Summary

Peitho (named after the Greek goddess of persuasion — placeholder name) is an AI-powered ad agency. We automate the inefficiencies of running an ad agency at scale — creative production, cross-platform distribution, performance testing, and ROI consolidation — using AI as the operational backbone.

The core insight: traditional ad agencies don't scale. They're labor-intensive, slow to iterate, and rarely test across enough platforms. Most default to Meta and Google because that's what they know. Meanwhile, high-yield niche platforms (local press, trade publications, programmatic placements like Washington Post) are systematically underutilized because agencies lack the bandwidth to test them. Clients have zero visibility into cross-platform performance.

Our key differentiator is **multi-platform ad distribution and testing**. We don't just run your Meta ads better — we simulate and test across platforms, consolidate performance data, and surface where your best ROI actually lives.

We sell results, not software. For enterprise clients: commission on leads generated (% of additional revenue). For SMBs: performance-based or flat fee. This removes switching risk entirely — clients pay nothing unless we deliver.

Two entry points: (1) SMB / underserved businesses that are too small for big agencies and too unsophisticated for self-serve tools, and (2) enterprise lead generation with hyper-targeted outreach to small decision-maker pools.

AI simulation is an internal tool for modeling cross-platform ad performance — it's not the product. The customer sees results, not the simulation.

---

## 2. Problem Statement

The ad agency model is broken at scale. The core question Peitho answers: **how do you automate the inefficiencies of running an ad agency?**

**The agency scaling problem:**

- **Agencies don't test enough platforms.** Most agencies default to Meta and Google because that's what they know. High-yield niche platforms — Washington Post, local press, trade publications, programmatic placements — are systematically underutilized because agencies lack the bandwidth to test them. Real example: an epoxy flooring client's previous agency ran ads on Washington Post based on ICP data. The client had zero visibility into why or how it performed.
- **Cross-platform creative is prohibitively expensive.** Reaching someone across all touchpoints (LinkedIn, display, local press, CTV) requires creative tailored to each platform's content grammar. Producing all of this manually costs $20K+/month in agency fees. The result: most businesses pick one channel and hope for the best.
- **Performance data is fragmented.** There's no unified view of what's working where. Agencies report platform by platform. Clients can't see the cross-platform picture or reallocate spend intelligently.
- **The feedback loop is broken.** There's no systematic way to learn *why* a particular message worked on a particular platform for a particular audience. Learnings don't compound across campaigns.

**For SMBs specifically:**

- Too small for big agencies, too unsophisticated for self-serve tools like Meta Ads Manager
- Nobody is fighting to serve the local epoxy flooring company with AI-powered ad distribution
- They don't know what platforms exist beyond Google and Facebook

**For enterprise lead gen specifically:**

- Hyper-targeted outreach to small decision-maker pools (e.g., 200 VPs at Fortune 500s) requires precision across multiple platforms
- Enterprise purchases involve 6-10 decision-makers with different roles and concerns — one ad doesn't work for all of them
- The buying committee problem: a CFO cares about TCO, a CTO cares about architecture, end users care about workflow impact. Creative needs to match.

**What we don't compete with:** Meta's Andromeda algorithm for broad consumer targeting. We can't out-target Meta at their own game. We win on platform diversity and niche placement intelligence — surfacing ROI where nobody else is looking.

---

## 3. Vision & Core Thesis

### The Core Thesis

**AI can automate the inefficiencies of running an ad agency at scale.** Creative production, platform selection, cross-platform testing, performance analysis — all of these are bottlenecked by human bandwidth in traditional agencies. Peitho replaces that bandwidth with AI.

The key insight is not "better ads on Meta." It's **multi-platform distribution intelligence**. Most agencies and tools optimize within a single platform. The opportunity is in finding high-ROI placements across platforms that nobody is testing systematically — including niche placements (trade press, local publications, programmatic) that traditional agencies ignore.

### Service First, Software Later

We sell as a service / results-based engagement, not as software. This is a deliberate strategic choice:

- **Selling software forces a "10x better" bar** to displace incumbents. Selling results doesn't.
- **Commission on leads / % of revenue generated** means zero switching risk for clients. They pay nothing unless we deliver.
- **Opacity is a moat.** Customers cannot see or replicate our pipeline. We iterate the AI, swap platforms, change strategies — all invisible to the client.
- **Every engagement produces data.** Cross-platform performance comparisons compound into our competitive advantage.
- **Productize later.** Once refined across 15-20 customers, the SaaS version becomes a codification of a process we've already proven.

### Where Simulation Fits

AI simulation was the original idea. It has been reframed:

- **Not the product.** We don't position as a simulation company.
- **An internal tool** for modeling cross-platform ad performance before spending budget — predicting how campaigns will perform on Platform A vs. B vs. C.
- **Most relevant** for brands spending $200K+/day where even marginal improvement in platform allocation has massive ROI.

The customer sees results, not the simulation.

### The Synthetic Data Thesis

Most companies don't have enough real customer data to make fully informed ad decisions — especially across platforms they've never tested. Historically, humans bridged this gap manually: a strategist would look at incomplete data about an audience and make educated guesses about what messaging would land. That was expensive, slow, and limited by individual experience.

AI changes this fundamentally. LLMs are probabilistic machines — given a demographic profile and a platform context, they can generate the *most likely* response patterns, preferences, and behaviors. This is exactly the gap-filling that human strategists did, but at scale and grounded in vastly more training data than any individual person's experience.

The argument that "synthetic data isn't valid" misses something important: all data used to shape AI outputs is in some sense synthetic. When you prompt a model with "this is good writing" as a few-shot example, that's subjective, anecdotal input — there's no objective ground truth. Yet it dramatically changes output quality. The line between "real" and "synthetic" data is blurrier than it appears. What matters is whether the data improves decision-making — and probabilistic gap-filling on demographic and behavioral patterns is exactly what AI is built to do.

**This is a theory we need to validate**, but the intuition is strong: AI-generated synthetic audience data, properly grounded in demographic and behavioral priors, can be just as actionable as sparse real data for ad targeting and creative decisions. If true, this means we can generate high-quality persona intelligence and platform recommendations even for clients with minimal existing data — which is most SMBs and many enterprise teams entering new markets.

### Honest Caveats

**1. AI scoring is a ranking heuristic, not a prediction.**
Simulation helps us model where to allocate spend and which creative to run. It is not a reliable predictor of real-world outcomes. Real deployment is the validation layer.

**2. Privacy-first by design.**
All persona modeling uses publicly available information. GDPR and CCPA compliant by design.

**3. Ethical guardrails are load-bearing, not decorative.**
No deceptive advertising, no manipulation of vulnerable populations, no dark patterns. See Section 13 for detailed treatment.

**4. Start with static creatives.**
The MVP generates text copy and image specifications. Video generation comes later.

---

## 4. Target Customer

We're pursuing two entry points in parallel.

### Path A: SMB / Underserved Businesses

- Small businesses currently underserved by agencies — too small for big shops, too unsophisticated for self-serve tools
- **Low competition** — nobody is fighting to serve the local epoxy flooring company with AI-powered ad distribution
- **Easy to close** — the sales cycle is short and the decision-maker is the owner
- Value prop: "We run your ads across platforms you didn't know existed, and you only pay when it works"
- **Pricing:** flat fee or performance-based, depending on the client

### Path B: Enterprise Lead Generation

- Hyper-targeted outreach to small decision-maker pools (e.g., 200 VPs of Infrastructure at Fortune 500s)
- **Revenue model: commission on leads generated, not upfront fees**
  - Removes all switching risk for the client — they pay nothing unless we deliver
  - Aligns incentives perfectly — we only win when the client wins
- High deal sizes ($50K-$50M+) justify the effort per engagement
- **GTM channel:** warm intros through existing enterprise sales networks
- Ideal clients: B2B SaaS, technology, professional services selling to enterprises. Marketing teams of 3-20, spending $10K-$500K/month on ads, with generic creative across buyer roles

### Why NOT broad consumer / Meta-first

- Meta's Andromeda algorithm handles broad consumer targeting better than we ever could — can't win there
- Consumer personas are unstable and context-dependent
- We win on platform diversity and niche precision, not on beating Meta at its own game

### Expansion Verticals (Post-MVP)

| Vertical | Why | Timing |
|----------|-----|--------|
| **Political campaigns** | Massive budgets ($15.9B in 2024 cycle), proven need for micro-segmented persuasion creative, clear seasonal demand | Phase 2 (aligned with 2028 cycle) |
| **Pharmaceutical HCP marketing** | $6-8B digital HCP ad market. NPI-level targeting exists but creative is generic. High regulatory complexity = high barrier to entry = moat. | Phase 2-3 |
| **Luxury brands** | Don't want mass-market reach. Need affluent-only targeting with premium creative. High willingness to pay. | Phase 2 |

---

## 5. User Personas

### Persona 1: The B2B Growth Marketing Leader

**Name:** Marcus Rivera
**Role:** VP of Marketing at a B2B SaaS company ($30M ARR)
**Context:** Marcus runs a $150K/month ad budget, primarily on LinkedIn and programmatic display through Demandbase. He has a 3-person marketing team and works with a creative agency for quarterly campaigns. His company sells infrastructure software to mid-market and enterprise companies.

**Pain points:**
- His ABM platform can identify and target decision-makers at 500 target accounts, but every account gets the same generic creative
- He knows a CFO and a CTO need different messages, but producing role-specific creative for 500 accounts is impossible with his team
- His agency charges $15K/month and produces ~20 ad variants. He needs 200+
- LinkedIn CTR has plateaued because his creative is stale — same value props, same angles, same tone

**What he wants from Peitho:**
- Generate persona-specific creative for each role in the buying committee (CTO, VP Eng, CFO, procurement)
- Creative that speaks to each role's specific motivations, objections, and decision criteria
- Platform-native variants: LinkedIn thought leadership posts, display ads, Meta awareness ads
- A scoring system that helps him prioritize which variants to test first
- Volume that lets him A/B test at the persona level, not just at the creative level

**Success looks like:** 5x creative volume across buyer personas, measurable increase in target account engagement, and shorter sales cycles because prospects arrive better-educated.

### Persona 2: The ABM Agency Strategist

**Name:** Priya Patel
**Role:** Strategy Director at a B2B performance marketing agency
**Context:** Priya's agency manages ABM campaigns for 12 B2B clients. Each client has target account lists of 200-2,000 companies. The agency runs LinkedIn, Demandbase, and programmatic campaigns. Creative production is always the bottleneck.

**Pain points:**
- Clients want persona-specific creative for each buyer role, but the math doesn't work — 5 personas x 3 platforms x 10 variants = 150 pieces of creative per client per quarter
- Her 4-person creative team is stretched across 12 clients
- Client churn happens when engagement metrics plateau and the agency can't find fresh angles fast enough
- She suspects there are psychological angles and messaging strategies they're missing because they don't have the research bandwidth

**What she wants from Peitho:**
- Generate first-draft creative at scale so her team focuses on refinement, not blank-page creation
- Persona intelligence that surfaces psychological levers her team hasn't considered
- Cross-platform creative generation (LinkedIn, display, Meta) from a single persona brief
- A tool that makes her agency more valuable to clients, not one that replaces her

**Success looks like:** Serve the same number of clients with 3x the creative output, reduce churn by consistently surfacing fresh persona-specific angles.

### Persona 3: The Political Campaign Director

**Name:** David Okafor
**Role:** Digital Director for a gubernatorial campaign
**Context:** David manages a $5M digital ad budget across CTV, programmatic display, Meta, and YouTube. His campaign has identified 8 persuadable voter segments in key counties. He works with a political media firm that produces TV spots and digital creative.

**Pain points:**
- His media firm produces 3-5 ad variants per voter segment per month. He needs 20-30
- Each voter segment has different concerns (economy, education, public safety, healthcare) and different persuasion triggers. Generic messaging wastes budget on the already-decided
- CTV targeting can reach specific households in swing counties, but he's serving them the same generic spot
- Post-Cambridge Analytica, the industry lost many micro-targeting tools, but the need for segment-specific creative remains

**What he wants from Peitho:**
- Deep psychological profiles of each voter segment — not just demographics but what they fear, what they aspire to, what language resonates
- 20+ creative variants per segment, each pulling a different psychological lever
- Platform-native creative: CTV scripts, Meta video concepts, YouTube pre-roll, display ads
- Simulation scoring that helps predict which messages will actually persuade (not just get clicks)

**Success looks like:** 5x creative volume per voter segment, measurable improvement in persuasion metrics in targeted counties.

---

## 6. MVP Feature Specification

### Module 1: Audience Intelligence Engine

**Purpose:** Transform basic company and product information into detailed, actionable audience micro-segments.

#### Inputs

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Company name | String | Yes | Brand name |
| Product description | Text (long) | Yes | What the product/service is, key features, price range |
| Target market description | Text (long) | Yes | Who the brand currently targets, any known audience info |
| Website URL | URL | No | For additional context extraction |
| Customer data upload | CSV/Excel | No | Real customer data (demographics, purchase history, engagement metrics, LTV). Auto-detected column types, validated for quality. |
| Competitors | Text | No | Known competitors for positioning context |
| Brand assets | File upload | No | Logos, fonts, color palettes, photography, design guidelines for visual generation |

#### Customer Data Ingestion

When customer data is uploaded:

1. **Auto-Detection:** Column types are automatically detected (demographics, purchase history, engagement metrics, LTV) using pandas.
2. **Validation:** Data quality is assessed — missing fields, inconsistent values, and row counts are flagged in a validation summary.
3. **Enrichment:** For gaps in uploaded data, Claude infers psychographic and behavioral attributes so ICPs are grounded in real customer patterns rather than generated from scratch.
4. **CRM Integration (Phase 2):** Interfaces are defined for Shopify, Klaviyo, and HubSpot connectors for automated data sync.

#### Processing Pipeline

1. **Context Assembly:** Combine all inputs into a structured prompt context. When customer data is available, extract demographic patterns, purchase clusters, and behavioral segments to ground the generation in real data.
2. **ICP Generation (Pass 1):** Claude generates 3-8 initial ICP (Ideal Customer Profile) segments based on product-market fit analysis. When real customer data is available, ICPs are grounded in actual purchase patterns and demographics rather than generated from scratch. The number of segments scales with product breadth -- a single-SKU brand might get 3-4 segments; a multi-category brand might get 6-8.
3. **Profile Enrichment (Pass 2):** For each ICP, Claude generates a deep psychographic and behavioral profile through a second, focused prompt.
4. **Differentiation Check (Pass 3):** Claude reviews all generated ICPs together to ensure they are meaningfully distinct, merging or splitting segments as needed.

#### Output: ICP Segment

Each ICP segment includes:

**Demographics:**
- Age range (e.g., 28-35)
- Gender distribution (e.g., 70% female, 30% male)
- Income bracket
- Location tendencies (urban/suburban/rural, regions)
- Education level
- Household composition

**Psychographics:**
- Core values (ranked top 5)
- Lifestyle descriptors
- Personality traits (mapped to accessible language, not Big Five jargon)
- Cultural affinities (brands they like, media they consume, communities they belong to)

**Behavioral Profile:**
- Purchase triggers (what makes them buy *now*)
- Common objections (what makes them hesitate)
- Decision-making style (impulsive vs. researcher vs. social-proof-driven)
- Price sensitivity
- Brand loyalty tendencies
- Channel preferences (where they discover products, where they research, where they buy)

**Emotional Drivers:**
- Primary emotional need the product addresses
- Fears and anxieties the product alleviates
- Aspirational identity the product supports
- Social dynamics (do they buy for themselves or others? do they share purchases?)

**Media Consumption:**
- Platform preferences (Instagram vs. Facebook vs. TikTok vs. LinkedIn vs. YouTube)
- Content format preferences (short-form video, long-form articles, stories, reels)
- Peak engagement times
- Influencer/creator affinities
- Ad format receptivity (which ad types they engage with vs. ignore)

**Segment Metadata:**
- Estimated segment size (relative: small/medium/large)
- Estimated lifetime value potential (relative ranking)
- Confidence level (how much training data likely supports this profile)
- Recommended priority (based on product fit and segment accessibility)

#### Key Design Decisions

- **Number of segments:** Default to 5 segments. Allow users to request more or fewer (range: 3-8 for MVP). More segments increase downstream creative volume -- this is a feature, not a bug, but users should understand the tradeoff.
- **Confidence transparency:** Each segment gets a confidence indicator. "35-year-old urban professional interested in fitness" is a well-understood archetype with high confidence. "Left-handed amateur astronomers who homebrew kombucha" is a low-confidence niche. The system should be honest about this.
- **Editability:** Users can edit any field of any ICP after generation. The system should preserve edits through subsequent pipeline stages.

---

### Module 2: Ad Generation Engine

**Purpose:** For each ICP segment, generate a diverse set of ad variants that explore different emotional angles, messaging strategies, and creative approaches.

#### Generation Parameters

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| Variants per ICP | 10 | 5-15 | Number of ad variants to generate per segment |
| Platforms | Meta, Instagram | Meta, Instagram, LinkedIn, Google Display | Target ad platforms |
| Emotional angles | All | Fear/urgency, aspiration, social proof, rational, humor, storytelling, FOMO | Which angles to explore |
| Tone spectrum | Balanced | Casual to formal, playful to serious | Tone range to explore |
| CTA styles | Mixed | Direct, soft, question-based, urgency-driven | CTA approach variety |

#### Ad Variant Structure

Each generated ad variant includes:

**Copy Elements:**
- **Headline** (platform-appropriate length: Meta ~40 chars, LinkedIn ~70 chars)
- **Primary text / Body copy** (platform-appropriate: Meta ~125 chars above fold, LinkedIn ~150 chars)
- **Extended body** (for platforms that support it)
- **CTA text** (e.g., "Shop Now," "Learn More," "Get Yours")
- **CTA type** (button text for Meta; in-copy for LinkedIn)

**Visual Specification (Code-Based Generation):**
- **Visual code specification** (instructions for programmatic generation via Claude Code, Figma MCP, or Re:Motion — produces HTML/CSS, SVG, or design tool instructions)
- **Image concept description** (2-3 sentences describing the ideal image)
- **Color palette suggestion** (hex codes aligned with brand + segment psychology, incorporating uploaded brand assets)
- **Layout type** (product-focused, lifestyle, testimonial-style, text-overlay, before/after)
- **Visual mood** (warm, clinical, energetic, serene, bold, minimal)
- **Brand asset references** (which uploaded logos, fonts, photography, and guidelines to incorporate)

**Metadata:**
- **Target ICP segment** (which segment this variant is designed for)
- **Emotional angle** (which emotional lever this variant pulls)
- **Platform** (which ad platform this is formatted for)
- **Tone** (where on the casual-formal, playful-serious spectrum)
- **Key message** (one-sentence summary of the core argument)
- **Hypothesis** (why this variant might work for this segment -- the reasoning)

#### Platform-Specific Formatting

**Meta / Facebook Ad:**
- Primary text: 125 characters (above fold), up to 500 characters total
- Headline: 40 characters
- Description: 30 characters
- Image: 1080x1080 or 1200x628
- CTA button from predefined list

**Instagram Feed Ad:**
- Caption: 125 characters (above fold), up to 2,200 characters
- Image: 1080x1080 (square) or 1080x1350 (portrait)
- CTA overlay text
- Hashtag suggestions (3-5)

**Instagram Story Ad:**
- Text overlay: <100 characters
- Image: 1080x1920
- Swipe-up CTA text
- Sticker/poll suggestions (optional engagement elements)

**LinkedIn Sponsored Post:**
- Introductory text: 150 characters (above fold), up to 600 characters
- Image: 1200x627
- Headline: 70 characters
- CTA button from predefined list

**Google Display Ad:**
- Short headline: 30 characters
- Long headline: 90 characters
- Description: 90 characters
- Business name: 25 characters
- Images: multiple sizes (1200x628, 1200x1200, etc.)

#### Diversity Enforcement

The engine must ensure creative diversity across variants for each ICP:

- No more than 30% of variants should use the same emotional angle
- At least 3 different tone registers should be represented
- At least 2 different visual layout types should be represented
- CTA approaches should vary (not all "Shop Now")
- At least 1 variant should be a deliberate "wild card" -- an unconventional angle the marketer might not have considered

This diversity is the product's core value proposition. A human copywriter naturally gravitates toward their default style. The system should deliberately explore the space.

---

### Module 3: Multi-Agent Simulation & Scoring Engine

**Purpose:** Use multi-agent audience simulation to rank ad variants by likely effectiveness, surfacing the strongest candidates for human review and providing qualitative reasoning with confidence intervals for the rankings. Inspired by the MiroFish/OASIS architecture for population-scale agent simulation.

#### Agent Simulation Framework

**Agent Initialization:**
For each ICP segment, the system initializes 3-5 simulation agents with:
- **Persistent memory stores** — each agent tracks ad exposures, preference evolution, and human feedback across simulation runs
- **Unique behavioral signatures** — within the segment's parameters, each agent has distinct personality traits, decision-making tendencies, and response patterns (e.g., one agent is more skeptical, another is more impulse-driven)
- **Segment-grounded personality** — agents are initialized with the full psychographic profile from Module 1 as their baseline

**Multi-Round Simulation:**
Each ad variant is evaluated across multiple rounds (default: 5 runs per variant) for statistical confidence:
1. **Exposure round** — agents encounter the ad variant in a simulated feed context
2. **Reaction round** — agents generate authentic behavioral responses (scroll past, pause, click, share, dismiss)
3. **Social influence round** — agents interact with each other: word-of-mouth dynamics, opinion cascading, social proof effects. Ads that generate "share-worthy" reactions get amplification bonuses.
4. **Score aggregation** — behavioral signals across rounds and agents are aggregated into dimensional scores with confidence intervals

#### Scoring Dimensions

Each variant is scored on five dimensions:

| Dimension | Description | Scale |
|-----------|-------------|-------|
| **Attention** | Would this stop the scroll? Does the headline/image combination demand a second look? | 1-10 |
| **Relevance** | Does this feel like it's "for me"? Does it speak to my specific situation, not a generic audience? | 1-10 |
| **Emotional Resonance** | Does this make me feel something? Does the emotional angle land authentically? | 1-10 |
| **Clarity** | Do I immediately understand what's being offered and why I should care? | 1-10 |
| **CTA Effectiveness** | Am I motivated to take the next step? Is the ask appropriate for my relationship with this brand? | 1-10 |

**Composite Scoring:**
- Composite score = weighted average (Attention: 25%, Relevance: 25%, Emotional Resonance: 20%, Clarity: 15%, CTA Effectiveness: 15%)
- Weights are configurable but these defaults reflect the reality that in social feeds, attention and relevance are the primary gates.
- **Confidence intervals** are reported alongside each score based on variance across agents and simulation runs.

#### Human Feedback Integration

Users can submit feedback at any point ("our customers wouldn't respond to this because..."), which is:
- Incorporated into agent memory for subsequent simulation runs
- Used to adjust agent behavioral signatures and response patterns
- Tracked per agent/variant with full feedback history visible in the dashboard

#### Qualitative Analysis

For the top 5 and bottom 3 variants per ICP, the simulation generates:
- A 2-3 sentence explanation of *why* this variant scored well or poorly, grounded in agent behavioral patterns (not single-prompt judgments)
- Specific callouts of what works (e.g., "The urgency angle lands because this segment has high FOMO tendencies — 4 of 5 agents paused and engaged") or what falls flat (e.g., "The humor feels forced — agents with higher skepticism scores consistently scrolled past")
- Suggested improvements for borderline variants

#### Cross-Segment Analysis

After scoring all variants for all ICPs:
- Identify any "universal winners" -- variants that score well across multiple segments (these may indicate broadly effective messaging)
- Identify "segment specialists" -- variants that score very high for one segment but poorly for others (these are the precision tools)
- Flag any ICP segments where no variant scored above 6/10 composite (indicates the generation pass may need to be re-run with adjusted parameters)

#### Important Limitations (Surfaced in UI)

The dashboard must clearly communicate:
- "AI scores are a ranking heuristic, not a prediction of real-world performance."
- "High-scoring variants should be prioritized for A/B testing, not assumed to be winners."
- "The simulation reflects the AI model's understanding of audience psychology, which is approximate. Your real customers are the final judges."

These aren't disclaimers hidden in fine print. They're part of the UI, displayed alongside the scores. Trust comes from honesty.

---

### Module 4: Dashboard & Review Interface

**Purpose:** Provide a clean, efficient interface for creating campaigns, reviewing generated content, and exporting approved assets.

#### 4A: Campaign Creation Wizard

**Step 1 -- Company Info**
- Form fields for company name, product description, target market, website URL, competitors
- "Paste your landing page" option -- extracts product info from URL content
- Save as draft capability
- Template library for common DTC categories (skincare, supplements, apparel, home goods, food & beverage)

**Step 2 -- Configuration**
- Number of ICP segments (slider: 3-8, default 5)
- Variants per ICP (slider: 5-15, default 10)
- Target platforms (multi-select: Meta, Instagram, LinkedIn, Google Display)
- Emotional angles to explore (multi-select with "all" default)
- Brand voice guidelines (text field -- optional, for tone calibration)
- Brand assets upload (logos, fonts, color palettes, photography, design guidelines -- referenced by visual generation pipeline)
- Customer data upload (CSV/Excel -- optional, for grounding ICPs in real data)

**Step 3 -- Generation**
- Progress indicator showing pipeline stages (ICP Generation > Enrichment > Ad Generation > Scoring)
- Estimated time display
- Real-time preview of ICPs as they're generated (don't make the user wait for everything to finish)

#### 4B: Customer Data Panel

- **Upload interface** for CSV/Excel customer data files
- **Data preview table** showing uploaded data with detected column types
- **Validation summary** showing detected columns, data quality flags, missing fields, and row counts
- **CRM connection status indicators** (Shopify, Klaviyo, HubSpot -- active in Phase 2, stubs visible in MVP)
- **Re-upload / replace** controls for updating data

#### 4C: Brand Assets Panel

- **Upload interface** for brand assets: logos, fonts, color palettes, photography, design guidelines
- **Grid view** of uploaded assets with metadata (type, dimensions, upload date)
- **Delete/replace controls** per asset
- Assets are referenced by the visual generation pipeline when creating ad visuals

#### 4D: ICP Review Panel

- **Card layout** for each ICP segment with summary view (name, age range, key traits, priority ranking)
- **Expandable detail panel** showing full psychographic profile
- **Data grounding indicator** -- shows whether ICP was generated from uploaded customer data or from product/market inference alone
- **Edit capability** on all fields -- inline editing with save
- **Add/remove segments** after generation
- **Segment comparison view** -- side-by-side view of 2-3 segments to verify they're meaningfully distinct
- **Re-generate option** per segment (keeps others, regenerates one)

#### 4E: Ad Variant Gallery

- **Grouped by ICP segment** with tab or accordion navigation
- **Sorted by composite score** (highest first) within each group
- **Card view** for each variant showing:
  - Headline and body copy preview
  - Visual preview rendered from code-based generation (HTML/CSS, SVG, or design tool output)
  - Multi-agent simulation score with confidence intervals (color-coded: green 7+, yellow 5-6, red <5)
  - Emotional angle tag
  - Platform tag
- **Detail view** (click to expand) showing:
  - Full copy for all fields
  - Complete visual specification with rendered preview
  - All five dimensional scores with bar chart and confidence intervals
  - Qualitative analysis text (grounded in agent behavioral patterns)
  - Hypothesis text (why this might work)
  - **Style variation controls** -- regenerate visuals with different treatments while keeping copy fixed
- **Filter and sort** by:
  - Score (ascending/descending)
  - Emotional angle
  - Platform
  - Approval status
- **Bulk actions:** approve all above threshold, reject all below threshold

#### 4F: Agent Feedback Panel

- **Agent reasoning view** -- for each ad variant, see the reasoning from each simulation agent
- **Feedback submission** -- submit text feedback ("our customers wouldn't respond to this because...") to incorporate into agent memory for subsequent simulation runs
- **Feedback history** -- view all submitted feedback per agent and per variant
- **Re-score trigger** -- after submitting feedback, re-run simulation to see updated scores

#### 4G: Review Workflow

Three states for each variant:
- **Pending** (default) -- not yet reviewed
- **Approved** -- included in export
- **Rejected** -- excluded from export

Additional actions:
- **Edit** -- modify any copy field inline; edited variants are marked with an "edited" badge
- **Request style variation** -- regenerate visuals with different treatments while keeping copy fixed. Lock approved elements, regenerate only unlocked ones.
- **Duplicate & modify** -- create a copy of a variant as a starting point for a human-refined version
- **Star/favorite** -- mark as a top pick (orthogonal to approve/reject)
- **Add note** -- attach a comment for team context
- **View agent reasoning** -- see per-agent breakdown of simulation results and confidence intervals

#### 4H: Export

- **Export approved variants** as:
  - CSV (one row per variant, all fields as columns -- importable to Meta Ads Manager bulk upload)
  - JSON (structured data for programmatic use)
  - PDF (presentation-ready format with visual mockups -- for client reviews or internal alignment)
  - ZIP of individual ad cards (PNG mockups of each ad as it would appear on-platform)
- **Export includes:**
  - All copy fields in platform-specific format
  - Rendered visual assets from code-based generation (PNG/SVG)
  - Visual code specifications (for further iteration)
  - Image specifications (dimensions, color palette, layout notes)
  - ICP segment summary (so the media buyer knows which audience to target)
  - Recommended targeting parameters for each segment (age range, interests, behaviors -- mapped to platform targeting options)
- **Partial export** -- export by segment, by platform, or by score threshold

---

## 7. User Flow

### End-to-End Walkthrough

```
START
  |
  v
[1. Create Campaign]
  User clicks "New Campaign"
  Fills in: Company name, product description, target market
  Optionally: website URL, competitors, brand voice notes
  |
  v
[2. Configure Generation]
  Selects number of ICP segments (default: 5)
  Selects variants per ICP (default: 10)
  Selects target platforms (default: Meta + Instagram)
  Clicks "Generate"
  |
  v
[3. Pipeline Executes] (~2-5 minutes)
  3a. ICP Generation -- Claude analyzes product/market, produces segments
  3b. Profile Enrichment -- each segment gets deep psychographic detail
  3c. Ad Generation -- 10 variants per segment across emotional angles
  3d. Scoring -- each variant scored by simulated persona
  3e. Ranking -- variants sorted, qualitative analysis generated
  |
  User sees progress bar; ICPs appear in real-time as they're ready
  |
  v
[4. Review ICPs]
  User reviews generated segments
  Edits any that feel off ("this segment doesn't match our actual customers")
  Optionally adds or removes segments
  Optionally re-generates individual segments
  Confirms ICP set
  |
  v
[5. Review Ad Variants]
  User browses variant gallery, grouped by ICP
  Reads AI scores and qualitative analysis
  Approves strong variants, rejects weak ones
  Edits promising variants that need refinement
  Stars top picks
  |
  v
[6. Export]
  User selects export format (CSV for Meta upload, PDF for review, etc.)
  Downloads package with all approved variants + targeting specs
  |
  v
[7. Deploy Externally]
  User uploads creatives to Meta Ads Manager / Google Ads / etc.
  Sets up targeting based on Peitho's segment recommendations
  Runs campaigns
  |
  v
[8. (Future: Phase 2) Feed Back Results]
  User imports performance data back into Peitho
  System learns which segments/angles/tones actually performed
  Next campaign generation is informed by real data
  |
  v
END
```

### Time Expectations

| Step | Duration |
|------|----------|
| Campaign creation | 5-10 minutes |
| Pipeline execution | 2-5 minutes (5 segments x 10 variants) |
| ICP review | 10-15 minutes |
| Variant review | 20-40 minutes (for 50 variants) |
| Export | < 1 minute |
| **Total** | **~45-70 minutes** |

Compare to traditional process: 1-3 weeks for an agency to produce 10-20 variants for 2-3 segments. Peitho produces 50+ variants for 5+ segments in under an hour.

---

## 8. Technical Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│                     Next.js 15 + Tailwind + shadcn/ui                │
│                                                                      │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐   │
│  │ Campaign │ │ Customer │ │  ICP   │ │   Ad    │ │  Export  │   │
│  │ Wizard   │ │ Data &   │ │ Review │ │ Gallery │ │ Manager  │   │
│  │          │ │ Brand    │ │        │ │ & Agent │ │          │   │
│  │          │ │ Assets   │ │        │ │Feedback │ │          │   │
│  └────┬─────┘ └────┬─────┘ └───┬────┘ └────┬────┘ └────┬─────┘   │
│       └─────────────┴───────────┴───────────┴───────────┘         │
│                              │                                       │
│                         REST API calls                               │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                               v
┌──────────────────────────────────────────────────────────────────────┐
│                           BACKEND                                    │
│                      Python FastAPI                                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │                     API Router Layer                          │    │
│  │  /campaigns  /icps  /variants  /scores  /simulate            │    │
│  │  /customer-data  /brand-assets  /agent-feedback  /exports   │    │
│  └──────────────────────┬───────────────────────────────────────┘    │
│                         │                                            │
│  ┌──────────────────────v───────────────────────────────────────┐    │
│  │                   Service Layer                              │    │
│  │                                                              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │    │
│  │  │  Audience     │  │  Generation  │  │  Agent           │   │    │
│  │  │  Intelligence │  │  Engine      │  │  Simulation      │   │    │
│  │  │  Service      │  │  Service     │  │  Service         │   │    │
│  │  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │    │
│  │         └─────────────────┴───────────────────┘             │    │
│  │                           │                                  │    │
│  │              ┌────────────┴────────────┐                     │    │
│  │              v                         v                     │    │
│  │  ┌──────────────────┐   ┌──────────────────────┐            │    │
│  │  │  Claude API      │   │  Prompt Template     │            │    │
│  │  │  Client          │   │  Manager             │            │    │
│  │  │  (Anthropic SDK) │   │                      │            │    │
│  │  └──────────────────┘   └──────────────────────┘            │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                         │                                            │
│  ┌──────────────────────v───────────────────────────────────────┐    │
│  │                   Data Layer                                 │    │
│  │            SQLite + SQLAlchemy ORM                           │    │
│  └──────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**1. Prompt Template Manager**
All Claude prompts are stored as versioned templates with variable injection. This enables:
- Rapid iteration on prompt quality without code changes
- A/B testing different prompt strategies
- Audit trail of which prompt version generated which output

**2. Streaming Generation**
The pipeline uses server-sent events (SSE) to stream results to the frontend as they're generated. The user sees ICPs appear one by one, then variants, then scores -- rather than waiting for the entire pipeline to complete.

**3. Idempotent Pipeline Stages**
Each pipeline stage (ICP generation, enrichment, ad generation, scoring) is independently re-runnable. If scoring fails, you don't re-run generation. If one ICP needs re-generation, others are preserved.

**4. Structured Output**
All Claude API calls use structured output (JSON mode / tool use) to ensure responses parse reliably. The system never relies on free-text parsing.

**5. Rate Limiting & Cost Management**
- Token usage tracking per campaign
- Estimated cost displayed before generation begins
- Configurable concurrency limits for Claude API calls
- Caching layer for identical prompts (unlikely but possible in re-generation scenarios)

### Data Flow

```
User Input
    │
    ▼
Campaign Record (persisted to DB)
    │
    ▼
ICP Generation Prompt ──> Claude API ──> Structured ICP JSON
    │                                          │
    │                                          ▼
    │                                   ICP Records (DB)
    │                                          │
    ▼                                          ▼
Enrichment Prompt ──────> Claude API ──> Enriched ICP JSON
    │                                          │
    │                                          ▼
    │                                   Updated ICP Records (DB)
    │                                          │
    ▼                                          ▼
Ad Generation Prompt ───> Claude API ──> Ad Variant JSON (per ICP)
    │                                          │
    │                                          ▼
    │                                   AdVariant Records (DB)
    │                                          │
    ▼                                          ▼
Scoring Prompt ─────────> Claude API ──> Score JSON (per variant)
    │                                          │
    │                                          ▼
    │                                   Score Records (DB)
    │                                          │
    ▼                                          ▼
Frontend fetches via REST API ──────> Dashboard renders
```

---

## 9. Data Model

### Entity Relationship Diagram

```
Campaign (1) ──── (N) ICP
Campaign (1) ──── (N) CustomerDataUpload
Campaign (1) ──── (N) BrandAsset
ICP (1) ──── (N) AdVariant
ICP (1) ──── (N) SimulationAgent
SimulationAgent (1) ──── (N) AgentMemory
AdVariant (1) ──── (1) Score
Campaign (1) ──── (N) Export
```

### Entity Definitions

#### Campaign

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| name | String(255) | User-provided campaign name |
| company_name | String(255) | Brand/company name |
| product_description | Text | Product/service description |
| target_market | Text | Target market description |
| website_url | String(500) | Optional website URL |
| competitors | Text | Optional competitor info |
| brand_voice | Text | Optional brand voice guidelines |
| brand_colors | JSON | Optional brand color palette |
| config | JSON | Generation configuration (num_segments, variants_per_icp, platforms, etc.) |
| status | Enum | draft, generating, icps_ready, variants_ready, scored, completed |
| total_tokens_used | Integer | Cumulative Claude API token usage |
| estimated_cost | Float | Estimated API cost in USD |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

#### ICP (Ideal Customer Profile)

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Foreign key to Campaign |
| name | String(255) | Segment name (e.g., "Health-Conscious Millennial Professional") |
| summary | Text | 2-3 sentence segment summary |
| demographics | JSON | Age, gender, income, location, education, household |
| psychographics | JSON | Values, lifestyle, personality, cultural affinities |
| behavioral_profile | JSON | Purchase triggers, objections, decision style, channel preferences |
| emotional_drivers | JSON | Needs, fears, aspirations, social dynamics |
| media_consumption | JSON | Platforms, formats, timing, influencer affinities |
| segment_metadata | JSON | Size estimate, LTV potential, confidence, priority |
| sort_order | Integer | Display order (user-reorderable) |
| is_edited | Boolean | Whether user has manually edited this ICP |
| prompt_version | String(50) | Which prompt template version generated this |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

#### AdVariant

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| icp_id | UUID | Foreign key to ICP |
| campaign_id | UUID | Foreign key to Campaign (denormalized for query efficiency) |
| platform | Enum | meta, instagram, instagram_story, linkedin, google_display |
| headline | String(500) | Ad headline |
| body_copy | Text | Primary ad text |
| extended_body | Text | Extended text (for platforms that support it) |
| cta_text | String(100) | Call-to-action text |
| cta_type | String(50) | CTA button type |
| image_concept | Text | Image concept description |
| visual_code_spec | Text | Code-based visual generation specification (HTML/CSS, SVG, or design tool instructions) |
| color_palette | JSON | Suggested colors |
| layout_type | String(50) | Visual layout type |
| visual_mood | String(50) | Visual mood descriptor |
| emotional_angle | String(50) | Primary emotional lever |
| tone | String(50) | Tone descriptor |
| key_message | Text | One-sentence core message |
| hypothesis | Text | Why this variant might work |
| hashtags | JSON | Suggested hashtags (Instagram) |
| status | Enum | pending, approved, rejected |
| is_edited | Boolean | Whether user has manually edited |
| is_starred | Boolean | User favorite flag |
| user_notes | Text | User-attached notes |
| prompt_version | String(50) | Which prompt template version generated this |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

#### Score

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| variant_id | UUID | Foreign key to AdVariant (unique -- one score per variant) |
| attention_score | Float | 1-10 score for attention |
| relevance_score | Float | 1-10 score for relevance |
| resonance_score | Float | 1-10 score for emotional resonance |
| clarity_score | Float | 1-10 score for clarity |
| cta_score | Float | 1-10 score for CTA effectiveness |
| composite_score | Float | Weighted composite (calculated) |
| confidence_interval | JSON | Confidence intervals per dimension based on multi-agent variance |
| qualitative_analysis | Text | AI-generated reasoning grounded in agent behavioral patterns |
| suggested_improvements | Text | Improvement suggestions (for top/bottom variants) |
| scoring_prompt_version | String(50) | Which scoring prompt version was used |
| num_agents | Integer | Number of simulation agents used |
| num_rounds | Integer | Number of simulation rounds run |
| created_at | DateTime | Creation timestamp |

#### CustomerDataUpload

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Foreign key to Campaign |
| file_name | String(255) | Original uploaded file name |
| file_type | Enum | csv, excel |
| row_count | Integer | Number of data rows |
| detected_columns | JSON | Auto-detected column types (demographics, purchase history, engagement, LTV) |
| validation_summary | JSON | Data quality assessment (missing fields, inconsistencies, flags) |
| status | Enum | uploaded, validating, validated, error |
| created_at | DateTime | Creation timestamp |

#### SimulationAgent

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| icp_id | UUID | Foreign key to ICP |
| agent_index | Integer | Agent number within the ICP (1-5) |
| behavioral_signature | JSON | Unique personality traits, decision-making tendencies, response patterns |
| created_at | DateTime | Creation timestamp |

#### AgentMemory

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| agent_id | UUID | Foreign key to SimulationAgent |
| memory_type | Enum | ad_exposure, preference_evolution, human_feedback, social_influence |
| content | JSON | Memory content (ad reactions, feedback text, preference shifts) |
| created_at | DateTime | Creation timestamp |

#### BrandAsset

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Foreign key to Campaign |
| asset_type | Enum | logo, font, color_palette, photography, design_guidelines |
| file_path | String(500) | Path to stored asset file |
| metadata | JSON | Asset metadata (dimensions, format, description) |
| created_at | DateTime | Creation timestamp |

#### Export

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| campaign_id | UUID | Foreign key to Campaign |
| format | Enum | csv, json, pdf, zip |
| filters | JSON | What was included (segments, platforms, score thresholds) |
| variant_count | Integer | Number of variants in export |
| file_path | String(500) | Path to generated export file |
| created_at | DateTime | Creation timestamp |

---

## 10. API Endpoints

### Campaigns

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/campaigns` | Create a new campaign |
| GET | `/api/campaigns` | List all campaigns (paginated) |
| GET | `/api/campaigns/{id}` | Get campaign details |
| PATCH | `/api/campaigns/{id}` | Update campaign fields |
| DELETE | `/api/campaigns/{id}` | Delete campaign and all associated data |
| POST | `/api/campaigns/{id}/generate` | Trigger the full generation pipeline |
| GET | `/api/campaigns/{id}/status` | Get pipeline execution status |
| GET | `/api/campaigns/{id}/stats` | Get campaign summary statistics |

### ICPs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns/{id}/icps` | List all ICPs for a campaign |
| GET | `/api/icps/{id}` | Get full ICP detail |
| PATCH | `/api/icps/{id}` | Update ICP fields (user edits) |
| DELETE | `/api/icps/{id}` | Remove an ICP segment |
| POST | `/api/campaigns/{id}/icps/regenerate` | Regenerate all ICPs |
| POST | `/api/icps/{id}/regenerate` | Regenerate a single ICP |

### Ad Variants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns/{id}/variants` | List all variants (with filters: icp_id, platform, status, min_score) |
| GET | `/api/variants/{id}` | Get full variant detail with score |
| PATCH | `/api/variants/{id}` | Update variant fields (user edits, status changes) |
| POST | `/api/variants/bulk-status` | Bulk update status (approve/reject by filter) |
| POST | `/api/variants/{id}/duplicate` | Duplicate a variant for editing |
| POST | `/api/icps/{id}/variants/regenerate` | Regenerate variants for a specific ICP |

### Customer Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/campaigns/{id}/customer-data` | Upload customer data CSV/Excel for ICP grounding |
| GET | `/api/campaigns/{id}/customer-data` | List uploaded customer data files |
| GET | `/api/customer-data/{id}` | Get customer data upload details and validation summary |
| DELETE | `/api/customer-data/{id}` | Remove uploaded customer data |

### Brand Assets

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/campaigns/{id}/brand-assets` | Upload brand assets (logos, fonts, colors, photography, guidelines) |
| GET | `/api/campaigns/{id}/brand-assets` | List brand assets for a campaign |
| DELETE | `/api/brand-assets/{id}` | Remove a brand asset |

### Simulation & Scores

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/campaigns/{id}/simulate` | Run multi-agent simulation across ad variants |
| GET | `/api/campaigns/{id}/scores/summary` | Aggregate scoring summary across all segments with confidence intervals |
| GET | `/api/icps/{id}/scores` | Scores for all variants in an ICP |
| POST | `/api/campaigns/{id}/rescore` | Re-run simulation scoring for all variants |
| POST | `/api/icps/{id}/rescore` | Re-run simulation scoring for one ICP's variants |
| POST | `/api/campaigns/{id}/agent-feedback` | Submit feedback to simulation agents for memory integration |
| GET | `/api/campaigns/{id}/agent-feedback` | Get feedback history for a campaign |

### Exports

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/campaigns/{id}/export` | Generate export file |
| GET | `/api/exports/{id}/download` | Download generated export file |
| GET | `/api/campaigns/{id}/exports` | List past exports for a campaign |

### Pipeline Streaming

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/campaigns/{id}/stream` | SSE endpoint for real-time pipeline progress |

### Request/Response Examples

**POST `/api/campaigns`**

```json
{
  "name": "Q3 2026 Enterprise Push — Payment Infrastructure",
  "company_name": "VaultPay",
  "product_description": "Enterprise payment infrastructure API. Handles card processing, ACH, wire transfers, and cross-border payments with 99.99% uptime SLA. SOC 2 Type II certified...",
  "target_market": "Mid-market and enterprise fintech companies, SaaS platforms with payment needs, e-commerce companies processing $10M+/year",
  "website_url": "https://vaultpay.com",
  "competitors": "Stripe, Adyen, Braintree",
  "brand_voice": "Technical authority, understated confidence, peer-to-peer tone with engineering leaders",
  "config": {
    "num_segments": 5,
    "variants_per_icp": 10,
    "platforms": ["linkedin", "programmatic_display", "meta"],
    "emotional_angles": ["rational", "fear", "social_proof", "aspiration", "storytelling"],
    "tone_range": "professional_to_technical"
  }
}
```

**Response: 201 Created**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Q3 2026 Enterprise Push — Payment Infrastructure",
  "status": "draft",
  "created_at": "2026-04-03T10:30:00Z"
}
```

**GET `/api/campaigns/{id}/variants?icp_id=...&min_score=6&platform=linkedin&status=pending`**

```json
{
  "variants": [
    {
      "id": "...",
      "icp_id": "...",
      "icp_name": "Risk-Averse CTO at Mid-Market Fintech",
      "platform": "linkedin",
      "headline": "Your Payment Stack Shouldn't Keep You Up at Night",
      "body_copy": "When your processing volume hits $50M, 'good enough' infrastructure becomes a liability. VaultPay handles 99.99% uptime at scale — so your engineering team ships features, not hotfixes.",
      "cta_text": "See the Architecture",
      "emotional_angle": "fear",
      "tone": "peer_technical",
      "status": "pending",
      "score": {
        "composite": 8.1,
        "attention": 7,
        "relevance": 9,
        "resonance": 8,
        "clarity": 9,
        "cta": 8
      },
      "image_concept": "Clean, dark-mode dashboard aesthetic showing uptime metrics. Minimal, technical, no stock photography.",
      "visual_code_spec": "HTML/CSS dark-mode dashboard mockup with real-time uptime counter, subtle grid background, monospace typography, VaultPay logo mark"
    }
  ],
  "total": 23,
  "page": 1,
  "per_page": 20
}
```

---

## 11. Long-Term Roadmap

### Phase 1: MVP (Current)
**Timeline:** 4-6 weeks
**Goal:** Validate that AI-generated persona intelligence and creative are good enough to deploy in B2B campaigns.

- Campaign creation wizard with target account/persona definition and brand asset management
- Buyer persona generation and enrichment (3-8 personas per campaign), grounded in role-based psychology and industry context
- Ad variant generation (5-15 per persona, text + code-based visuals via Claude Code, Figma MCP, Re:Motion)
- Multi-agent simulation scoring with persistent memory, behavioral signatures, and confidence intervals
- Human-in-the-loop feedback integration into agent memory
- Human review dashboard with visual previews, agent reasoning, and style variation controls
- Export in CSV, JSON, PDF, ZIP formats with rendered visual assets — formatted for LinkedIn, programmatic display, and Meta
- Local deployment, single-user

**Exit criteria:** 5-10 B2B companies use Peitho to generate ABM campaign creative. At least 3 report that the persona-specific output was meaningfully better than their existing generic creative and saved them significant production time.

---

### Phase 2: Platform Integration & Cross-Platform Delivery
**Timeline:** 2-3 months post-MVP
**Goal:** Close the loop between generation and real-world delivery across precision targeting platforms.

**Features:**
- **LinkedIn Ads API integration:** Push approved variants directly to LinkedIn Campaign Manager as draft campaigns. Auto-configure targeting (company, job title, seniority) based on persona definitions.
- **ABM platform integrations:** Demandbase and 6sense API integrations — feed persona-specific creative into existing ABM targeting workflows. Trigger creative refreshes based on intent signals.
- **Programmatic DSP integration:** The Trade Desk or StackAdapt integration for display and CTV ad delivery. Map personas to firmographic and intent-based targeting segments.
- **Meta Ads API integration:** Push awareness-layer creative to Meta Advantage+ campaigns. Leverage persona-driven creative diversity for algorithmic optimization.
- **Performance data ingestion:** Pull engagement metrics (CTR, pipeline influenced, meetings booked, deal progression) back from platforms. Map performance to specific personas and creative angles.
- **Feedback-informed generation:** Next campaign generation is informed by which personas, angles, tones, and CTAs actually performed. The system builds a brand-specific and persona-specific performance model.
- **Cross-platform campaign plans:** Generate coordinated "surround sound" campaigns — LinkedIn for professional context, display for ambient awareness, CTV for evening reach, Meta for broad reinforcement — all from a single persona brief.
- **Political vertical expansion:** Voter segment modeling, CTV script generation, swing-state targeting integration. Timed for 2028 election cycle ramp-up.
- **Multi-user support:** Team accounts, role-based access, approval workflows.
- **Cloud deployment:** Hosted SaaS with user authentication and data isolation.

**Exit criteria:** Campaigns generated by Peitho and deployed via API integration measurably outperform the client's pre-Peitho creative on target account engagement metrics. Cross-platform campaigns show higher engagement than single-platform campaigns.

---

### Phase 3: Individual-Level Intelligence & Vertical Expansion
**Timeline:** 3-5 months post-Phase 2
**Goal:** Move from role-based personas to individual-level psychological models using publicly available data.

**Features:**
- **Public data enrichment pipeline:** For target individuals (e.g., a specific CTO), ingest publicly available data — LinkedIn profile, published interviews, conference talks, blog posts, company announcements, patent filings — to build an individual-level psychological model. What do they care about? What's their decision-making style? What language do they use? What have they publicly advocated for or against?
- **Individual-level creative generation:** Generate creative specifically tailored to a named individual's psychology, not just their role archetype. "A message for Sarah Chen, CTO of Acme Corp, who has publicly advocated for developer experience and has been at Acme for 3 years after leaving a startup" vs. "a message for CTOs."
- **Pharma HCP vertical:** NPI-level doctor profiling (specialty, prescribing patterns from public data, published research, conference participation). Generate creative tailored to specific physicians' likely concerns and evidence preferences. Regulatory compliance guardrails for pharma advertising.
- **Video ad generation:** Short-form video ads (6s, 15s, 30s) — AI video generation, template-based assembly, script generation per persona.
- **Multi-language support:** Culturally adapted (not just translated) ad variants for international campaigns.
- **Creative fatigue detection:** Monitor ad performance decay and auto-suggest refresh creatives when engagement drops.
- **Geofencing integration:** Generate creative designed for hyper-local delivery — Capitol Hill, conference venues, specific office buildings.

**Exit criteria:** Individual-level creative demonstrably outperforms role-archetype creative in A/B tests on engagement metrics. At least 2 non-B2B verticals (political, pharma, or luxury) onboarded with vertical-specific features.

---

### Phase 4: Autonomous Cross-Platform Orchestration
**Timeline:** 6-12 months post-Phase 3
**Goal:** Move from "tool that generates creative" to "system that orchestrates multi-platform persuasion campaigns."

**Features:**
- **Autonomous campaign orchestration:** AI plans and executes the full "surround sound" sequence: awareness on display → engagement on LinkedIn → reinforcement on CTV → direct outreach trigger to sales team. Human oversight and kill switches at every stage.
- **Intent-triggered creative escalation:** When 6sense or Bombora detects that a target account is actively researching your category, automatically escalate creative frequency and shift messaging from awareness to consideration.
- **Dynamic budget allocation:** AI reallocates budget across platforms, personas, and creative variants based on real-time engagement signals.
- **Cross-platform frequency management:** Prevent over-saturation by tracking impressions across LinkedIn, display, CTV, and Meta for each target account.
- **Automatic creative rotation:** Detect fatigue, generate replacement variants, deploy them, retire underperformers.
- **Natural language campaign management:** "Increase spend on the CTO persona at our top 50 accounts" or "Generate more ads like our best LinkedIn performer but for the CFO persona."

---

### Phase 5: Persuasion Intelligence Network
**Timeline:** 12-18 months post-Phase 4
**Goal:** Build the most comprehensive understanding of high-stakes persuasion dynamics in digital advertising.

**Features:**
- **Cross-customer persona intelligence:** Anonymized, aggregate data across all Peitho customers reveals patterns — what messaging works for CTOs in fintech vs. healthcare? What emotional angles resonate with CFOs evaluating $1M+ purchases? New customers get the benefit of this collective intelligence from day one.
- **Competitive intelligence:** Analyze competitor ad creative (from LinkedIn Ad Library, Meta Ad Library) to identify positioning gaps and emerging messaging trends in each vertical.
- **Predictive persona discovery:** Identify high-potential buyer personas that the client hasn't targeted yet, based on cross-customer patterns. "Companies like yours see 3x engagement when they also target the VP of Operations — here's why."
- **Cross-platform attribution:** Unified view of how campaigns across LinkedIn, display, CTV, and Meta contribute to pipeline and revenue, with incrementality testing.
- **Persuasion modeling:** A continuously refined model of what drives decisions in specific roles, industries, and contexts — informed by millions of real engagement data points across Peitho's customer base. This model is the long-term moat.
- **Vertical benchmarking:** "Your CTO-targeted LinkedIn creative is performing in the 72nd percentile for B2B infrastructure companies. Here's what the top 10% do differently."

---

## 12. Success Metrics

### MVP Success Metrics

**Primary (Must-Hit):**

| Metric | Target | How We Measure |
|--------|--------|----------------|
| Persona quality | 70%+ of generated buyer personas rated "useful and accurate" by B2B marketers | Post-generation survey (thumbs up/down per persona) |
| Variant usability | 30%+ of generated variants approved with no/minor edits | Approval rate in dashboard |
| Persona differentiation | Users confirm that creative for CTO vs. CFO vs. VP Eng is meaningfully different and appropriately targeted | User interviews |
| Time savings | 3x faster than user's current ABM creative process | Self-reported in user interviews |
| Willingness to pay | 60%+ of beta users say they'd pay $2K+/month | Post-trial survey |

**Secondary (Want-to-Hit):**

| Metric | Target | How We Measure |
|--------|--------|----------------|
| Pipeline completion rate | 95%+ of started campaigns complete without error | Backend logs |
| Generation quality trend | Variant approval rate increases across a user's 2nd and 3rd campaigns | Dashboard analytics |
| Time in dashboard | Average review session < 45 minutes for 50 variants | Frontend analytics |
| Export rate | 80%+ of completed campaigns result in at least one export | Backend logs |
| NPS | 40+ among beta users | Survey |

### Post-MVP Success Metrics (Phase 2+)

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Target account engagement lift | Peitho-generated persona-specific creative outperforms generic creative by 30%+ on CTR | Within 2 campaign cycles |
| Pipeline influence | Measurable increase in meetings booked and pipeline generated from ABM campaigns using Peitho creative | Within 3 months |
| Creative volume increase | 5x increase in creative variants tested per persona per month | Within 2 months of adoption |
| Cross-platform adoption | 50%+ of campaigns export creative for 2+ platforms (LinkedIn + display, LinkedIn + Meta, etc.) | Within 3 months of Phase 2 |
| Customer retention | 85%+ month-over-month retention | 6 months post-launch |
| Revenue per customer | $2K+ MRR average (higher value market than DTC) | 6 months post-launch |
| Platform-deployed campaigns | 50%+ of approved variants deployed via API integration (vs. manual export) | Within 3 months of Phase 2 launch |

---

## 13. Risks & Mitigations

### Technical Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Claude output quality inconsistency.** Generated ICPs or ad variants vary in quality between runs. | High | Medium | Implement structured output schemas, few-shot examples in prompts, and automated quality checks (length, completeness, diversity). Allow easy re-generation of individual components. |
| **AI scoring doesn't correlate with real performance.** LLM-based persona simulation may not predict what actually converts. | High | High | Position scoring as a ranking heuristic from day one. Never claim predictive accuracy. Build the feedback loop (Phase 2) as fast as possible to ground the system in real data. |
| **Prompt injection via user input.** Malicious or unusual product descriptions could cause unexpected Claude behavior. | Medium | Low | Input sanitization, output validation, and sandboxed prompt construction. Monitor for anomalous outputs. |
| **API cost overruns.** A campaign with 8 segments and 15 variants each requires many Claude API calls. | Medium | Medium | Token usage estimation before generation. Per-campaign cost caps. Prompt optimization to minimize token usage without sacrificing quality. Clear pricing that accounts for API costs. |
| **Latency.** Full pipeline (ICP generation + enrichment + ad generation + scoring) for a large campaign could take 10+ minutes. | Medium | Medium | Streaming/progressive rendering. Parallelize independent API calls (e.g., score multiple variants concurrently). Show partial results as they arrive. |

### Legal & Compliance Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **GDPR / CCPA exposure from individual profiling.** Phase 3's individual-level intelligence uses public data, but building psychological profiles of named individuals may trigger data protection obligations, especially under GDPR's "profiling" provisions. | High | Medium | Phase 1-2 use role-based archetypes only (no named individuals). Phase 3 individual profiling is built with legal review from day one. All data sourced from publicly available information. Provide data subject access/deletion mechanisms. Obtain legal opinion on GDPR Article 22 (automated decision-making) applicability. |
| **Ad platform policy violations.** Generated ad copy might violate platform-specific advertising policies (e.g., LinkedIn's B2B rules, Meta's rules on financial/health claims). | High | Medium | Build a policy-checking layer into the generation pipeline: after generating variants, run a validation pass that flags copy potentially violating known platform rules. Include platform policy summaries in generation prompts. |
| **Pharma regulatory compliance.** HCP marketing is heavily regulated (FDA, FTC). AI-generated pharma ads must comply with fair balance requirements, approved indications, and adverse event disclosures. | High | High (for pharma vertical) | Pharma vertical (Phase 3) built with regulatory compliance as a core constraint, not an afterthought. Mandatory human review for all pharma creative. Integration with MLR (Medical Legal Review) workflows. Conservative generation defaults. |
| **Political advertising regulations.** Many jurisdictions require disclosure of AI-generated political content and paid-for-by attributions. | Medium | Medium | Auto-include required disclosures. Track and comply with state-by-state AI disclosure laws. Transparent about AI generation in all political creative. |

### Ethical Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Manipulative persuasion.** Building psychological profiles and generating persuasion-optimized creative could be used to manipulate vulnerable people or promote harmful products. | High | Medium | Acceptable use policy prohibiting deceptive practices, targeting of vulnerable populations, and promotion of harmful products. Generation pipeline includes ethical guardrails — Claude will refuse to generate manipulative, deceptive, or harmful content. User vetting for high-risk verticals (political, pharma). |
| **Asymmetric power dynamics.** The tool gives sophisticated actors (corporations, campaigns) unprecedented ability to influence individuals who don't know they're being psychologically profiled. | High | High | This is an inherent property of the technology, not a bug to be mitigated away. We address it through: (1) transparency — the product and its capabilities are public, not covert; (2) the same technology is available to all market participants, not just incumbents; (3) we do not enable covert manipulation — all output is deployed through legitimate, regulated ad platforms with their own disclosure requirements. |
| **Individual profiling overreach.** Phase 3's individual-level intelligence could cross the line from "understanding your audience" to "surveillance-enabled persuasion." | High | Medium | Strictly limit data sources to publicly available information. No scraping of private accounts, no purchase of data broker profiles, no correlation with private communications. Clear data provenance tracking. Users can see exactly what data informed each profile. Individuals can request deletion of their profiles. |
| **Erosion of authentic discourse.** If widely adopted for political advertising, hyper-personalized persuasion could further fragment public discourse by telling each voter what they want to hear. | Medium | Low (near-term) | Not within our control to prevent at the industry level. Our contribution: transparency about capabilities, compliance with AI disclosure regulations, and refusal to generate disinformation or deceptive content. |

### Market Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **ABM creative is a feature, not a product.** Demandbase, 6sense, or LinkedIn could add AI creative generation as a feature. | High | High | Move fast. The moat is not in generation alone — it's in the persona intelligence depth + multi-agent scoring + cross-platform orchestration + feedback loop. An ABM platform bolting on "AI creative" will produce generic output. Peitho's value is the *depth* of persona understanding, which requires a dedicated product focus. Also: position as complementary to ABM platforms, not competitive. Integrate, don't replace. |
| **Market timing.** If every AI tool adds "ad generation," the feature becomes commoditized. | Medium | High | Generic ad generation is commoditizing. *Persona-specific persuasion for high-stakes decisions* is not. The more commodity creative tools exist, the more Peitho's depth of persona intelligence differentiates. |
| **B2B sales cycles are long.** Proving ROI takes 6-12 months because enterprise deals close slowly. | Medium | High | Focus MVP metrics on leading indicators (engagement rates, meeting bookings, pipeline influenced) not lagging indicators (closed deals). Offer a "creative quality" value prop alongside a "performance" value prop. |
| **Political vertical is cyclical.** Election spending concentrates in 18-month cycles with long gaps between. | Medium | Medium | Political is an expansion vertical, not the core. B2B revenue provides baseline; political provides cyclical upside. Phase 2 timing deliberately aligns with 2028 cycle ramp-up. |

---

## 14. Competitive Landscape

### Direct Competitors

| Tool | What It Does | Peitho's Differentiation |
|------|-------------|-------------------------|
| **Demandbase (Creative)** | ABM platform with targeting and basic display ad generation. | Demandbase solves targeting brilliantly but its creative tools are rudimentary — generic display templates, not persona-specific messaging. Peitho is the creative intelligence layer that Demandbase's targeting deserves. We integrate with Demandbase, not compete with it. |
| **6sense (Conversational Email)** | ABM intent platform with AI-generated email outreach. | 6sense focuses on email and intent detection. Strong on "when to reach out" but shallow on "what to say" and non-existent on visual/display/LinkedIn creative. Peitho complements 6sense's intent signals with multi-platform creative generation. |
| **Mutiny** | AI-powered website personalization for B2B. | Mutiny personalizes the website experience after a visitor arrives. Peitho generates the creative that gets them to visit in the first place. Different stage of the funnel. |
| **Jasper / Copy.ai** | AI copywriting tools. Generate ad copy, emails, blog posts from templates. | Writing tools for a single audience. No persona intelligence, no multi-agent scoring, no cross-platform creative strategy. Peitho is a *persuasion pipeline*, not a writing assistant. |
| **AdCreative.ai** | Generates ad creative with performance scoring based on historical data. | Scores based on aggregate patterns ("ads with this layout tend to work"). Peitho scores based on *persona-specific* simulation. AdCreative.ai has no audience intelligence — you bring your own audience. |

### Indirect Competitors

| Tool | What It Does | Why Peitho is Different |
|------|-------------|------------------------|
| **LinkedIn Campaign Manager** | LinkedIn's native ad creation and targeting interface. | Powerful targeting but creative tools are basic. No persona-driven creative generation, no simulation scoring. Peitho generates the creative that makes LinkedIn's targeting effective. |
| **Meta Advantage+ Creative** | Meta's native AI that generates ad variants within their platform. | Platform-locked (Meta only). No persona intelligence. Useful for algorithmic creative testing, but doesn't solve the "what should we say to this specific person" problem. |
| **Traditional agencies** | Human strategists and creatives produce campaigns. | 10-100x slower, 10-50x more expensive per variant. Limited by human bandwidth. But agencies bring strategic judgment and client relationships that AI can't replicate. Peitho is a tool *for* agencies as much as a replacement. |
| **Political data firms (HaystaqDNA, Civis Analytics)** | Voter modeling and campaign strategy for political campaigns. | These firms build the voter models and targeting strategy but don't generate the creative. Peitho generates the persona-specific creative that these firms' targeting delivers. Complementary, not competitive (in Phase 2+). |
| **Pharma HCP platforms (Doceree, DeepIntent)** | NPI-level targeting for pharmaceutical advertising to doctors. | Same pattern: strong targeting, weak creative. Peitho provides the intelligence-to-creative pipeline these platforms lack (in Phase 3+). |

### Competitive Moat (Over Time)

Peitho's defensibility increases with each phase:

1. **Phase 1 (MVP):** Low moat. The persona-to-creative pipeline is novel but technically reproducible. Defensibility comes from execution speed, prompt engineering quality, and being first to frame this as the creative layer for ABM.

2. **Phase 2 (Platform Integration):** Medium moat. Integrations with LinkedIn, Demandbase, 6sense, and DSPs create workflow lock-in. Performance data from real campaigns creates a proprietary dataset that improves generation quality per client.

3. **Phase 3 (Individual Intelligence):** High moat. The public data enrichment pipeline — building individual-level psychological models from LinkedIn, interviews, conference talks — is a genuinely novel capability. Combined with cross-customer data on what messaging works for what persona types, this creates a compounding intelligence advantage.

4. **Phase 5 (Persuasion Intelligence Network):** Very high moat. Aggregate data across hundreds of B2B companies about what persuades CTOs, CFOs, VPs of Engineering — broken down by industry, company stage, and individual psychology — is an asset no new entrant can replicate. Peitho knows what works because it has seen what works at scale.

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **ICP** | Ideal Customer Profile. In Peitho's context, a detailed psychological and behavioral profile of a target buyer persona (e.g., "Risk-Averse CTO at Mid-Market Fintech"). |
| **Buyer persona** | A specific role within a target account's buying committee, enriched with psychological drivers, objections, and decision-making patterns. |
| **ABM** | Account-Based Marketing. A B2B strategy that targets specific companies and individuals within those companies, rather than broad audiences. |
| **Buying committee** | The group of decision-makers involved in an enterprise purchase (typically 6-10 people with different roles and concerns). |
| **Ad variant** | A single ad creative (copy + visual specification) tailored to a specific buyer persona and platform. |
| **Composite score** | Weighted average of the five scoring dimensions (attention, relevance, resonance, clarity, CTA effectiveness). |
| **Emotional angle** | The primary psychological lever an ad variant uses (e.g., fear, aspiration, social proof). |
| **Surround sound** | A cross-platform campaign strategy that reaches the same target person across multiple channels (LinkedIn, display, CTV, Meta) with coordinated, platform-native messaging. |
| **DSP** | Demand-Side Platform. A programmatic advertising platform (e.g., The Trade Desk, StackAdapt, Demandbase) used to serve display, native, and CTV ads. |
| **CTV** | Connected TV. Streaming platforms (Hulu, Peacock, etc.) that support household-level ad targeting. |
| **NPI** | National Provider Identifier. A unique ID for each healthcare provider in the US, used for physician-level ad targeting in pharma. |
| **CTR** | Click-Through Rate. The percentage of ad impressions that result in a click. |
| **Pipeline influenced** | The dollar value of sales pipeline (deals in progress) that was exposed to advertising. A key B2B metric. |

## Appendix B: Prompt Architecture (High-Level)

The system uses four core prompt chains:

1. **ICP Generation Prompt**
   - Input: Company info, product description, target market, competitors
   - System prompt: Act as a senior market researcher. Generate distinct, actionable audience segments.
   - Output schema: Array of ICP objects with demographics, psychographics, behavioral profile
   - Key instruction: Segments must be *meaningfully distinct* -- different enough that they would respond to different messaging.

2. **ICP Enrichment Prompt**
   - Input: Basic ICP from step 1 + company context
   - System prompt: Act as a consumer psychologist. Deepen this profile with emotional drivers, media habits, and purchase behavior.
   - Output schema: Enriched ICP object with all fields populated
   - Key instruction: Be specific and concrete. "Values health" is too vague. "Reads ingredient labels, avoids parabens, follows 2-3 clean beauty influencers on Instagram" is useful.

3. **Ad Generation Prompt**
   - Input: Enriched ICP + company/product info + platform specs + generation config
   - System prompt: Act as a performance marketing creative director. Generate ad variants that speak directly to this specific audience segment.
   - Output schema: Array of AdVariant objects
   - Key instruction: Maximize diversity across emotional angles, tones, and visual approaches. Each variant must have a clear *hypothesis* for why it would work for this audience.

4. **Agent Initialization Prompt**
   - Input: ICP profile + agent index
   - System prompt: Establish a unique simulation agent within this segment. Define behavioral signature, personality traits, decision-making tendencies, and response patterns that differ from other agents in the same segment.
   - Output schema: SimulationAgent object with behavioral_signature JSON
   - Key instruction: Agents must be meaningfully distinct within the segment parameters — one skeptical, one impulse-driven, one research-oriented, etc.

5. **Multi-Round Scoring Prompt**
   - Input: Agent profile (with memory) + ad variant + social context from other agents
   - System prompt: You are this specific agent. You encounter this ad in your feed. React based on your behavioral signature, accumulated memory, and any social signals from other agents.
   - Output schema: Score object with five dimensions + qualitative analysis + confidence intervals
   - Key instruction: Be honest and critical. A score of 5 means "forgettable." Only give 8+ to variants that would genuinely stop the scroll for this persona. Scores emerge from behavioral patterns across multiple rounds, not single judgments.

---

*This document is a living artifact. It will be updated as we learn from beta users and real-world deployment data.*
