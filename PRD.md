# Peitho - Product Requirements Document

**Version:** 1.0
**Date:** April 3, 2026
**Status:** Draft

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

Peitho (named after the Greek goddess of persuasion) is an AI-powered advertising platform that replaces the traditional ad creation workflow with a data-driven pipeline capable of generating hyper-personalized ad variants at a scale no human team can match. Instead of producing one campaign creative and hoping it resonates with a broad audience, Peitho generates hundreds of tailored ad variants across dozens of micro-segments, scores them using AI-based audience simulation, and surfaces the strongest performers for human review and deployment.

The platform's core insight is that AI has commoditized content creation itself. The competitive advantage has shifted to two things: (1) the quality of your *audience intelligence* -- how deeply you understand who you're trying to reach -- and (2) your ability to *test at massive scale* rather than betting on a handful of creatives. Peitho operationalizes both. It uses large language models to generate detailed audience profiles, produce creative variants tailored to each segment's psychology, and simulate audience reactions -- all as hypotheses that get validated through real-world deployment data.

The MVP targets e-commerce and DTC brands, where conversion metrics are clear, ad formats are standardized, and ROI is directly measurable. The initial product is an export-only tool: it generates and scores ad creatives that marketers download and deploy through their existing ad platform workflows. Platform API integrations, real performance feedback loops, and autonomous campaign management come in later phases.

---

## 2. Problem Statement

Digital advertising is broken in ways that both advertisers and consumers feel.

**For advertisers:**

- **Creative bottleneck.** A typical DTC brand's marketing team produces 5-10 ad variants per campaign. An agency might produce 20-30. But modern ad platforms can serve thousands of distinct impressions per day. The creative supply is orders of magnitude below what the distribution infrastructure can handle.
- **Audience understanding is shallow.** Most brands operate with 2-3 broad audience segments ("women 25-45 interested in fitness"). These segments are too coarse to capture the psychological differences that determine whether an ad converts. A 28-year-old marathon runner and a 42-year-old yoga practitioner have fundamentally different motivations, objections, and emotional triggers -- but they land in the same bucket.
- **Testing is expensive and slow.** A/B testing at the creative level is table stakes, but testing 5 variants is not the same as testing 500. Agencies charge per creative. Internal teams are bottlenecked by designers and copywriters. The result is that brands test a tiny fraction of the creative space they should be exploring.
- **Feedback loops are broken.** Performance data from Meta or Google tells you *what* happened (CTR, conversion rate) but not *why*. A low-performing ad gets killed, but the team rarely understands whether the problem was the headline, the emotional angle, the visual style, or the audience-message mismatch. Learnings don't compound.
- **Agency economics don't scale.** Agencies charge $5K-$50K/month for creative services. For that budget, a DTC brand gets a handful of campaigns. The cost per creative variant makes true personalization economically impossible.

**For consumers:**

- Ads feel generic, irrelevant, or tone-deaf because they were never designed for the specific person seeing them. This drives ad fatigue, banner blindness, and declining engagement rates across every major platform.

**The gap:** The ad distribution infrastructure (Meta, Google, TikTok) can target with extraordinary precision. But the creative pipeline feeding that infrastructure produces at artisan scale. Peitho closes that gap.

---

## 3. Vision & Core Thesis

### The Paradigm Shift

Traditional advertising operates on a simple model: a small team of humans crafts a small number of creatives, guided by intuition and experience, and deploys them to broad audiences. AI changes the economics of this model completely.

Peitho's thesis: **The winning advertising strategy is no longer about crafting the perfect ad. It's about generating the right ad for the right micro-segment, at a scale that makes "personalized at the cohort level" economically viable for the first time.**

Going from 3 audience segments to 50-200 micro-segments, and from 10 ad variants to 500-1,000, is not a linear improvement. It's a qualitative change in how advertising works. It means every micro-segment gets creative that speaks to their specific motivations, addresses their specific objections, and uses the emotional register that resonates with them specifically.

### Honest Caveats

This vision is powerful, but we build it on a foundation of intellectual honesty about what AI can and cannot do today:

**1. Micro-segments, not individuals.**
Ad platforms use cohort-based targeting. You cannot target "John Smith" -- you target "men, 30-40, in Austin, interested in outdoor recreation, with household income $100K+." Peitho's innovation is not individual-level personalization (which is neither technically possible nor desirable from a privacy standpoint). It is taking brands from 2-3 broad audiences to 50-200 micro-segments -- a 10-100x increase in targeting granularity that maps directly onto what ad platforms can actually deliver.

**2. Synthetic profiles are hypotheses, not ground truth.**
When we use Claude to generate a profile of "a 45-year-old suburban mom who shops at Whole Foods," we are leveraging the model's training data to produce a *plausible hypothesis* about what that person cares about, fears, and responds to. This is genuinely useful -- it's what a skilled marketer does mentally, but at 100x the speed and with more systematic coverage. But it is a hypothesis. The real validation comes from deployment data. Peitho's architecture is designed around this reality: generate hypotheses fast, test them in the real world, feed performance data back in.

**3. Privacy-first by design.**
Peitho never scrapes, stores, or processes personally identifiable information. All audience modeling works with aggregate demographic and psychographic data. The platform is designed to be GDPR and CCPA compliant from day one -- not as an afterthought, but as a core architectural constraint. We work with the same targeting parameters that ad platforms expose publicly.

**4. AI scoring is a heuristic, not a prediction.**
Using an LLM to role-play a persona and evaluate an ad is a useful ranking heuristic -- it's good at separating obviously bad creative from plausibly good creative. But it is not a reliable predictor of real-world performance. We use AI scoring to rank 1,000 variants down to 50 for human review. Real A/B testing on real platforms with real audiences is the actual validation layer. The PRD and the product messaging should never claim that AI scoring predicts conversion rates.

**5. Start with static creatives.**
The MVP generates text copy and image specifications (prompts, layout descriptions). Video generation is Phase 3+. Social ad creatives for Meta, Instagram, LinkedIn, and Google Display are the MVP medium -- they represent the highest volume, most standardized ad formats with the clearest performance metrics.

---

## 4. Target Customer

### Why E-Commerce / DTC Brands First

| Factor | Why DTC is ideal |
|--------|-----------------|
| **Clear conversion metrics** | Revenue, ROAS, CPA are directly measurable. No ambiguity about whether Peitho is working. |
| **Standard ad formats** | Social media ads (Meta, Instagram, Google Display) follow well-defined format specs. |
| **High creative volume needs** | DTC brands run continuous campaigns across multiple products and seasons. Creative is always the bottleneck. |
| **Price sensitivity** | Most DTC brands can't afford a full-service agency. Peitho's price point ($500-$2K/month) fits their budget. |
| **Willingness to experiment** | DTC founders are typically data-driven and open to new tools. |
| **Short feedback loops** | Purchase decisions happen in days, not months. Performance data comes back fast. |
| **Fragmented market** | Thousands of DTC brands, no single dominant player in the "AI ad creative" space for this segment. |

### Ideal Customer Profile

- **Revenue:** $500K - $50M annual revenue
- **Team size:** 2-50 people
- **Ad spend:** $5K - $500K/month across Meta, Google, and/or TikTok
- **Current creative process:** Founder doing it themselves, a small in-house team, or a freelancer/small agency
- **Pain:** Knows they need more creative variants, can't afford to produce them at the volume they need
- **Sophistication:** Understands basic ad metrics (CTR, ROAS, CPA), runs A/B tests, uses Meta Ads Manager or Google Ads

---

## 5. User Personas

### Persona 1: The DTC Founder-Marketer

**Name:** Sarah Chen
**Role:** Founder & CEO of a DTC skincare brand ($2M ARR)
**Context:** Sarah handles marketing herself with one part-time VA. She spends 15 hours/week on ad creative -- writing copy, briefing her freelance designer, reviewing assets. She runs Meta ads and Instagram ads.

**Pain points:**
- Spends too much time on creative production, not enough on strategy
- Knows her "women 25-45" targeting is too broad but doesn't have the bandwidth to create segment-specific creative
- Has a gut feeling about what works but can't test enough variants to validate it
- Agency quotes ($8K/month+) are too expensive for her stage

**What she wants from Peitho:**
- Generate 50+ ad variants in an afternoon instead of 5 in a week
- Understand her customers at a deeper level than "women who like skincare"
- Get a starting point for creative that she can refine, not a black box she has to trust blindly
- Export assets she can upload directly to Meta Ads Manager

**Success looks like:** 2x her creative output while cutting time spent on ad production by 60%.

### Persona 2: The Growth Marketing Manager

**Name:** Marcus Rivera
**Role:** Head of Growth at a DTC supplement brand ($15M ARR)
**Context:** Marcus manages a $200K/month ad budget across Meta, Google, and TikTok. He has a 2-person creative team (1 designer, 1 copywriter) and works with a creative agency for quarterly campaigns. He's data-driven and runs structured A/B tests.

**Pain points:**
- His creative team is the bottleneck -- they can produce ~30 new creatives per month, but he needs 100+
- His agency produces polished work but it takes 3-4 weeks per campaign and costs $15K
- He's frustrated by how little insight he gets from ad performance data -- he knows *what* converts but not *why*
- He wants to test more emotional angles and messaging approaches but doesn't have the creative bandwidth

**What he wants from Peitho:**
- A systematic way to explore the creative space -- different angles, tones, CTAs for different segments
- AI-generated audience insights that give his copywriter better briefs
- A scoring/ranking system that helps him prioritize which variants to test first
- Enough volume that he can run statistically significant tests faster

**Success looks like:** 3x creative volume without adding headcount, with measurably better ROAS from more targeted messaging.

### Persona 3: The Agency Strategist

**Name:** Priya Patel
**Role:** Strategy Director at a performance marketing agency
**Context:** Priya's agency manages ad spend for 15 DTC clients. Each client gets a dedicated account manager and shared creative resources. The agency is always creative-constrained.

**Pain points:**
- Clients want more creative variants but aren't willing to pay for them
- Her creative team spends 60% of their time on "good enough" social ads, not high-impact campaign work
- She suspects there are audience segments they're missing but doesn't have the research bandwidth to find them
- Client churn happens when ROAS plateaus and the agency can't find new angles fast enough

**What she wants from Peitho:**
- Generate first-draft creative at scale so her team can focus on refinement and strategy
- Audience intelligence that surfaces segments and angles her team hasn't considered
- A tool that makes her agency *more* valuable to clients, not one that replaces her

**Success looks like:** Serve the same number of clients with 2x the creative output, reduce churn by consistently surfacing fresh angles.

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
  "name": "Summer 2026 Sunscreen Launch",
  "company_name": "SolGuard",
  "product_description": "Mineral sunscreen with SPF 50, reef-safe, lightweight formula...",
  "target_market": "Health-conscious consumers who spend time outdoors...",
  "website_url": "https://solguard.com",
  "competitors": "Supergoop, Sun Bum, Blue Lizard",
  "brand_voice": "Confident but approachable, science-backed without being clinical",
  "config": {
    "num_segments": 5,
    "variants_per_icp": 10,
    "platforms": ["meta", "instagram"],
    "emotional_angles": ["aspiration", "fear", "social_proof", "rational", "storytelling"],
    "tone_range": "casual_to_balanced"
  }
}
```

**Response: 201 Created**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Summer 2026 Sunscreen Launch",
  "status": "draft",
  "created_at": "2026-04-03T10:30:00Z"
}
```

**GET `/api/campaigns/{id}/variants?icp_id=...&min_score=6&platform=meta&status=pending`**

```json
{
  "variants": [
    {
      "id": "...",
      "icp_id": "...",
      "icp_name": "Outdoor Active Professional",
      "platform": "meta",
      "headline": "Your Sunscreen Shouldn't Make You Choose",
      "body_copy": "Reef-safe. Lightweight. SPF 50. SolGuard protects your skin without compromising the ocean.",
      "cta_text": "Shop Now",
      "emotional_angle": "rational",
      "tone": "confident",
      "status": "pending",
      "score": {
        "composite": 7.8,
        "attention": 7,
        "relevance": 9,
        "resonance": 7,
        "clarity": 8,
        "cta": 8
      },
      "image_concept": "Split-screen: crystal clear ocean on one side, person applying sunscreen on the other. Clean, bright aesthetic.",
      "visual_code_spec": "HTML/CSS split-screen layout with gradient ocean-blue left panel, product photography placeholder right panel, brand font overlay, SVG wave divider element"
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
**Goal:** Validate that AI-generated audience intelligence and ad creative are good enough to be useful.

- Campaign creation wizard with customer data upload and brand asset management
- ICP generation and enrichment (3-8 segments), grounded in real customer data when available
- Ad variant generation (5-15 per ICP, text + code-based visuals via Claude Code, Figma MCP, Re:Motion)
- Multi-agent simulation scoring with persistent memory, behavioral signatures, and confidence intervals
- Human-in-the-loop feedback integration into agent memory
- Human review dashboard with visual previews, agent reasoning, and style variation controls
- Export in CSV, JSON, PDF, ZIP formats with rendered visual assets
- Local deployment, single-user

**Exit criteria:** 5-10 DTC brands use Peitho to generate real campaigns. At least 3 report that the output was "good enough to deploy with minor edits" and saved them meaningful time.

---

### Phase 2: Platform Integration & Feedback Loop
**Timeline:** 2-3 months post-MVP
**Goal:** Close the loop between generation and real-world performance.

**Features:**
- **Meta Ads API integration:** Push approved variants directly to Meta Ads Manager as draft campaigns. Auto-configure targeting parameters based on ICP segments.
- **Google Ads API integration:** Same for Google Display Network and Performance Max.
- **LinkedIn Ads API integration:** Same for LinkedIn Sponsored Content.
- **CRM integrations:** Shopify, Klaviyo, HubSpot automated data sync. Pull customer data on schedule, update ICP grounding continuously.
- **Performance data ingestion:** Pull CTR, CPA, ROAS, conversion data back from platforms.
- **Feedback-informed generation:** Next campaign generation is informed by which segments, angles, tones, and CTAs actually performed in previous campaigns. The system builds a brand-specific performance model.
- **Scaling simulation:** Increase agent count per ICP, more complex social dynamics, richer inter-agent communication patterns.
- **Multi-user support:** Team accounts, role-based access, approval workflows.
- **Cloud deployment:** Hosted SaaS with user authentication and data isolation.

**Exit criteria:** Campaigns generated by Peitho and deployed via API integration measurably outperform the brand's pre-Peitho creative on CPA or ROAS. Feedback loop demonstrably improves generation quality over 3+ campaign cycles.

---

### Phase 3: Video & Multi-Language
**Timeline:** 3-5 months post-Phase 2
**Goal:** Expand creative format coverage and geographic reach.

**Features:**
- **Video ad generation:** Generate short-form video ads (6s, 15s, 30s) using:
  - AI video generation models for synthetic footage
  - Clip extraction and remixing from provided long-form content (brand videos, UGC, product demos)
  - Template-based video assembly (text overlays, product shots, transitions)
- **Multi-language support:** Generate ad variants in 10+ languages with cultural adaptation (not just translation -- actual localization of emotional angles, cultural references, humor).
- **TikTok integration:** Native TikTok ad format support and TikTok Ads API integration.
- **Creative fatigue detection:** Monitor ad performance decay and auto-suggest refresh creatives when engagement drops.
- **Automated A/B test design:** Given a set of approved variants, automatically design statistically sound A/B tests with proper sample size calculations and runtime estimates.
- **Cross-customer intelligence:** Anonymized patterns across brands. Identify what works for similar product categories, market segments, and audience profiles.

---

### Phase 4: Autonomous Campaign Management
**Timeline:** 6-12 months post-Phase 3
**Goal:** Move from "tool that helps marketers" to "system that manages campaigns."

**Features:**
- **End-to-end automation:** Generation, deployment, monitoring, and optimization happen without human intervention (with human oversight and kill switches).
- **Dynamic budget allocation:** AI reallocates budget across segments and variants based on real-time performance data.
- **Automatic creative rotation:** Detect fatigue, generate replacement variants, deploy them, and retire underperformers.
- **Cross-platform optimization:** Optimize holistically across Meta, Google, TikTok, and LinkedIn rather than platform-by-platform.
- **Anomaly detection and alerting:** Detect sudden performance drops, policy violations, or budget anomalies and alert the user.
- **Natural language campaign management:** "Increase spend on our best-performing segment by 20%" or "Generate more ads like our top performer but with a humor angle."

---

### Phase 5: Population-Scale Intelligence
**Timeline:** 12-18 months post-Phase 4
**Goal:** Build the most comprehensive understanding of consumer segments in digital advertising.

**Features:**
- **Population-scale simulation engine:** A continuously updated model of consumer behavior across millions of micro-segments, informed by aggregate performance data across all Peitho customers (privacy-preserving, no PII).
- **Competitive intelligence:** Analyze competitor ad creative (from public ad libraries like Meta Ad Library) to identify gaps, counter-position, and spot emerging trends.
- **Cross-platform attribution:** Unified view of how campaigns across platforms contribute to conversions, with incrementality testing.
- **Predictive audience discovery:** Identify high-potential micro-segments the brand hasn't targeted yet, based on cross-customer patterns.
- **Category benchmarking:** "Your sunscreen ads are performing in the 72nd percentile for DTC skincare on Meta. Here's what the top 10% are doing differently."
- **Marketplace:** Brands can opt-in to share anonymized performance data in exchange for better benchmarking and audience intelligence.

---

## 12. Success Metrics

### MVP Success Metrics

**Primary (Must-Hit):**

| Metric | Target | How We Measure |
|--------|--------|----------------|
| ICP quality | 70%+ of generated ICPs rated "useful and accurate" by users | Post-generation survey (thumbs up/down per ICP) |
| Variant usability | 30%+ of generated variants approved with no/minor edits | Approval rate in dashboard |
| Time savings | 3x faster than user's current creative process | Self-reported in user interviews |
| Willingness to pay | 60%+ of beta users say they'd pay $500+/month | Post-trial survey |

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
| ROAS improvement | Peitho-generated campaigns outperform brand's baseline by 20%+ | Within 3 campaign cycles |
| Creative volume increase | 5x increase in creative variants tested per month per brand | Within 2 months of adoption |
| Customer retention | 80%+ month-over-month retention | 6 months post-launch |
| Revenue per customer | $1K+ MRR average | 6 months post-launch |
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
| **GDPR / CCPA exposure.** Even though Peitho doesn't process PII, generated profiles might *feel* like personal data to regulators. | Medium | Low | All generated profiles are clearly synthetic, based on aggregate demographic patterns, not real individuals. Include legal review of data handling practices. Terms of service explicitly state no PII is processed. |
| **Ad platform policy violations.** Generated ad copy might violate platform-specific advertising policies (e.g., Meta's rules on health claims, financial promises). | High | Medium | Build a policy-checking layer into the generation pipeline: after generating variants, run a validation pass that flags copy potentially violating known platform rules. Include platform policy summaries in generation prompts. |
| **Intellectual property.** Generated copy or image prompts might inadvertently reproduce copyrighted material. | Low | Low | Claude's training data guardrails help here. Add a similarity check against known slogans/taglines for the brand's industry. Terms of service clarify IP ownership of generated content. |
| **Misleading ad claims.** AI-generated copy might make claims the product can't support. | Medium | Medium | Include a "factual claims" flag in the generation pipeline. Prompt Claude to avoid specific performance claims unless the user provides supporting data. Surface flagged claims in the review UI. |

### Market Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **"Good enough" is hard to define.** DTC marketers may judge AI-generated creative against the best agency work, not against their realistic alternative (doing it themselves or not doing it at all). | High | Medium | Position Peitho as "better than what you'd do yourself in 10% of the time," not "better than what a $20K/month agency produces." User onboarding should calibrate expectations. |
| **Market timing.** If every AI tool adds "ad generation," the feature becomes commoditized. | Medium | High | The moat is not in generation alone -- it's in the audience intelligence + scoring + feedback loop pipeline. Generation is one module. The system's value compounds over time as the feedback loop improves quality. |
| **DTC market contraction.** E-commerce headwinds (rising CAC, declining VC funding for DTC) could shrink the target market. | Medium | Medium | DTC is the beachhead, not the endgame. The platform generalizes to any advertiser. Phase 2+ expands to agencies, SaaS companies, and larger brands. Rising CAC actually *increases* demand for better creative performance. |
| **Ad platform targeting restrictions.** Meta, Google, and others are continuously restricting targeting granularity (removing interest categories, limiting demographic targeting). | Medium | Medium | Peitho's value doesn't depend on hyper-narrow targeting. Even with broad targeting, better creative relevance improves performance. The system can adapt to targeting constraints by generating creative that self-selects audiences (i.e., the ad content itself acts as a filter). |

---

## 14. Competitive Landscape

### Direct Competitors

| Tool | What It Does | Peitho's Differentiation |
|------|-------------|-------------------------|
| **Jasper** | AI copywriting tool. Generates ad copy, blog posts, emails from templates. | Jasper is a *writing tool*. It generates copy for a single audience. It has no audience intelligence, no segmentation, no scoring, and no systematic exploration of emotional angles. Peitho is a *strategy-to-creative pipeline*. |
| **Copy.ai** | Similar to Jasper. AI copy generation with templates and workflows. | Same differentiation as Jasper. Copy.ai generates individual pieces of copy. Peitho generates entire campaign structures across segments. |
| **AdCreative.ai** | Generates ad creative (images + copy) with performance scoring based on historical data. | AdCreative.ai scores based on aggregate historical data ("ads with this layout tend to perform well"). Peitho scores based on *audience-specific* simulation. AdCreative.ai also lacks the audience intelligence layer -- you bring your own audience definition. |
| **Pencil (by Brandtech)** | AI-generated video and static ads with performance prediction. | Pencil focuses on creative production and has strong video capabilities. But its audience understanding is shallow -- it doesn't generate ICPs or explore segment-specific messaging strategies. |
| **Predis.ai** | Social media content generation with AI. Covers posts, ads, and carousels. | Predis is a content creation tool, not an advertising strategy tool. No audience segmentation, no scoring against personas. |

### Indirect Competitors

| Tool | What It Does | Why Peitho is Different |
|------|-------------|------------------------|
| **Meta Advantage+ Creative** | Meta's native AI that generates ad variants within their platform. | Platform-locked (Meta only). Limited to minor variations (text overlaps, cropping). No audience intelligence. No cross-platform strategy. |
| **Google Performance Max** | Google's automated campaign type that generates and tests creative across Google properties. | Platform-locked (Google only). Black box -- advertiser has limited visibility into what's being generated and why. No audience intelligence layer. |
| **Traditional agencies** | Human strategists and creatives produce campaigns. | 10-100x slower, 10-50x more expensive per variant. Limited by human bandwidth. But agencies bring brand understanding, strategic judgment, and relationship value that AI can't replicate. Peitho is a tool *for* agencies as much as a replacement. |
| **Canva + ChatGPT** | DIY approach: use ChatGPT for copy, Canva for design. | No integration between audience intelligence and creative. No scoring. No systematic exploration. It's a toolkit, not a pipeline. Works for one-off assets, not for campaign-scale variant generation. |

### Competitive Moat (Over Time)

Peitho's defensibility increases with each phase:

1. **Phase 1 (MVP):** Low moat. The pipeline is novel but technically reproducible. Defensibility comes from execution speed and prompt engineering quality.

2. **Phase 2 (Feedback Loop):** Medium moat. Performance data from real campaigns creates a proprietary dataset that improves generation quality. Each brand's history makes the system more valuable for that brand (switching cost).

3. **Phase 3+ (Cross-Customer Intelligence):** High moat. Aggregate, anonymized performance data across hundreds of brands creates a network effect. Peitho gets better at predicting what works for a new sunscreen brand because it has seen what worked for 50 other sunscreen brands. No new entrant has this data.

4. **Phase 5 (Population-Scale Simulation):** Very high moat. A continuously updated model of consumer behavior across segments, informed by millions of real ad performance data points, is extremely difficult to replicate.

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **ICP** | Ideal Customer Profile. A detailed description of a target audience micro-segment. |
| **Micro-segment** | A narrowly defined audience group (more specific than a traditional segment, less specific than an individual). |
| **Ad variant** | A single ad creative (copy + visual specification) tailored to a specific ICP and platform. |
| **Composite score** | Weighted average of the five scoring dimensions (attention, relevance, resonance, clarity, CTA effectiveness). |
| **Emotional angle** | The primary psychological lever an ad variant uses (e.g., fear, aspiration, social proof). |
| **Synthetic profile** | An AI-generated description of a hypothetical audience member, used for simulation and scoring. |
| **DTC** | Direct-to-Consumer. Brands that sell directly to end customers, typically via e-commerce. |
| **ROAS** | Return on Ad Spend. Revenue generated per dollar spent on advertising. |
| **CPA** | Cost Per Acquisition. The cost to acquire one customer through advertising. |
| **CTR** | Click-Through Rate. The percentage of ad impressions that result in a click. |

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
