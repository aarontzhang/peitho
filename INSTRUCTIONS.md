# Peitho Ad Pipeline — How It Works

This is the process Claude follows to generate a full set of personalized ads for a physical product. The pipeline takes a brand + product and produces multiple ad creatives, each tailored to a different simulated customer persona (ICP).

---

## Research-Backed Composition & Copy Principles

This section codifies evidence from the `research/` folder (visual composition studies, copywriting meta-analyses, academic papers, and case-study benchmarks). Treat these as hard constraints during generation, not suggestions. Every decision below has a citation in `research/01-visual-composition.md`, `research/02-copywriting.md`, `research/03-academic-papers.md`, or `research/04-case-studies-benchmarks.md`.

### Composition

**Three-element rule.** Human working memory holds 3-4 chunks. A static ad must have exactly **three primary focal points**: headline, hero visual, CTA. Anything fourth degrades the set. Documented lifts from correcting visual hierarchy: +20-30% conversion, up to +340% in one case.

**The 1.5-second rule.** In-feed users decide in under 1.5s whether an ad is worth attention. Pre-attentive processing (shape + contrast, unconscious) happens in 200-500ms. Design for that scan, not for a careful reader.

**Scanning patterns.**
- **Z-pattern** (visual-heavy ads): eye enters top-left, sweeps top-right, diagonals to bottom-left, terminates bottom-right. Place the logo top-left, headline top-third, CTA bottom-right. CTA misalignment with this terminal cost **598% of clicks** in one documented test.
- **F-pattern** (text-heavy layouts): long horizontal read across the top, shorter below, then vertical scan down the left edge. Works with left-aligned editorial layouts.

**Rule of thirds.** Divide the 1080x1080 frame into nine equal parts. Place key elements at the four intersection points, not dead center. Aligning headlines along the top horizontal third is a strong, stable placement. Slight asymmetry increases dwell time.

**Golden ratio / Fibonacci sizing.** For typography, `subline_size ≈ headline_size / 1.618`. Use Fibonacci approximations (8, 13, 21, 34, 55, 89) for whole-number sizes. For layout, place primary elements at 61.8% / 38.2% spatial splits. This reduces cognitive load.

**Contrast is the real conversion driver.**
- Target **7:1 contrast ratio** between CTA and its immediate background — this beats 4.5:1 by **26.4% on conversion**. WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text. Don't go below AA.
- "CTA color tests" actually measure **isolation**, not hue. The CTA that maximally contrasts with the rest of the frame wins — color is secondary.
- Complementary pairings: blue canvas → orange CTA (+38% in one test); red canvas → green CTA (+31%). Match the CTA to the complementary of the dominant hue.

**60-30-10 color rule.** Budget: **60% dominant/background**, **30% secondary/structure**, **10% accent** (reserved for CTAs and key emphasis). Breaking this ratio dilutes the accent and kills the CTA's isolation effect.

**Feature complexity vs. design complexity (Pieters, Wedel & Batra 2010, *Journal of Marketing*).**
- **Feature complexity** — dense perceptual noise, cluttered objects, competing shapes, busy backgrounds — *hurts* attention and brand attitude.
- **Design complexity** — deliberate creative elaboration, considered hierarchy, layered typography — *helps* both.
- Strip feature complexity. Invest in design complexity.

**White space = comprehension + premium signal.**
- Generous white space improves comprehension up to **20%** (Crazy Egg survey).
- **Context-dependent**: luxury / high-consideration products benefit from MORE white space (signals exclusivity); low-ticket products actually convert better with LESS. Match density to price point.
- Use an **8px grid system** — all spacing in multiples of 8 (8, 16, 24, 32, 48px) for rhythm.

**Face gaze direction (Sajjacholapunt & Ball 2014; Adcock Solutions; *Journal of Consumer Research*).**
- Faces capture attention mechanically in Stage 1, then gaze direction guides attention interpretively in Stage 2.
- **Hedonic products** (cosmetics, food, lifestyle, vacations): use **averted gaze** — model looks at the product or CTA. Measured lifts: +0.94 attractiveness, +1.00 product evaluation, +1.01 purchase intention.
- **Functional products** (insurance, safety, credibility plays): use **direct gaze** — model looks at the viewer to convey trust.
- Gaze cueing *reinforces* existing visual flow — it cannot create one from nothing.

**Gestalt principles in practice.**
- **Proximity**: group headline + subline + CTA tightly as one action unit. Put unrelated elements in real space apart.
- **Similarity** + **isolation effect (Von Restorff)**: break similarity intentionally for the CTA. One orange pill in a cream field wins. The element that stands out is the one that's remembered and clicked.
- **Figure-ground**: non-negotiable clarity between subject and background. If you can't identify figure vs. ground instantly, the ad fails.
- **Continuity**: use directional elements (rules, lines, implicit arrows) to guide the eye from headline → product → CTA.

**Banner blindness.** Users skip anything that looks like an ad: bright borders, animation-mimicking compositions, right-rail placements, "promo flash" aesthetics. Native-feeling, editorial-restrained composition beats ad-like composition. **70-80% of Meta ad performance comes from creative quality, not budget or targeting** (2025 AppsFlyer).

**Simplicity wins.**
- **1-2 fonts maximum**. One display sans for headline + one body sans for subline is the ceiling.
- Avoid: gratuitous gradients, overlay effects, drop shadows, mixed typefaces, low-resolution stock imagery. Simple designs outperform embellished ones "9 times out of 10" (industry reviews).
- Ads that try to say two things say nothing. One idea per ad.

**Safe zones (platform-specific).**
- **Meta feed**: leave 14% top, 35% bottom, 6% each side clear of critical content.
- **Stories / Reels (9:16)**: top ~250px and bottom ~350px are covered by platform UI.
- **Cross-platform rule**: keep essential content within **5-10% margins** on all sides.

### Copy

**The 80/20 rule (Ogilvy).** **80% of people read the headline; only 20% read past it.** The headline must carry the entire value proposition if nothing else is read. Design for that.

**Headline formulas that work.**

| Formula | When to use | Example |
|---|---|---|
| **Direct benefit / command** | Product clarity is the priority | "Save 10+ hours a week on bookkeeping" |
| **PAS (Pain-Agitate-Solution)** | Pain-driven audiences | "Back pain after 8 hours at your desk?" |
| **Number / list** | Feature-rich or comparison plays | "3 tools. One dashboard. 70% less setup." |
| **Question** | Curiosity-led awareness | "What if your analytics and replays lived in one place?" |
| **Curiosity gap** | High-engagement audiences, paired with a benefit | "The reason your users churn (and nobody told you)" |

- Numbered headlines: **+36% more clicks** (CoSchedule, 4M+ headlines analyzed).
- Question headlines lifted engagement +41% and conversions +19% in one A/B test — but a How-To headline beat a Question headline by +52% in an opt-in test. Context matters.

**Headline length sweet spots.**

| Context | Optimal |
|---|---|
| Ad headlines (general) | 6-10 words — **21% CTR sweet spot** |
| Facebook paid headline | 25-40 characters / ~5 words |
| LinkedIn ad/article headline | 40-49 characters |
| Google Ads headline | ≤30 characters each |
| Blog/content headline | 10-13 words |

Longer isn't always worse: AdEspresso's $1,000 Facebook copy test found **three-paragraph copy beat one-sentence copy by 2.4x per lead**. 89% of marketers predicted the opposite. Match length to product complexity, not to a dogma.

**Power words + loss framing.**
- Power words in headlines: **+20% CTR**.
- The word "now" increased sales **+332%** in one test — use sparingly so it doesn't cheapen.
- **Loss-framed beats gain-framed**: "Don't Miss Out! 20% Off Ends Today" beat "20% Off Premium" by **+31% CTR** (Google Ads test). Kahneman/Tversky: losses are felt ~2x as strongly as equivalent gains.
- Caution: over-urgency reads as manipulation and tanks trust sharply (CXL).

**Reading level.**
- **Target 6th-8th grade reading level** (Flesch Reading Ease 60-90). One site doubled conversions rewriting from 14.2 to 7th grade level.
- **Maximum sentence length: 20 words.** Break anything longer.
- Readability accounts for ~11% of conversion variance across 33 sites tested (Portent).

**Body copy length.**
- Landing pages under 200 words have highest avg. conversion (Unbounce).
- **55% of readers spend <15 seconds on copy.**
- For complex / high-consideration products, readers tolerate longer copy (20-23 words per line). For entertainment / low-involvement, 1-2 words wins. Match length to category.

**CTA rules (hard constraints).**

| Rule | Data |
|---|---|
| Use **first-person pronouns** ("Start my free trial" vs "Start your free trial") | **+90% CTR** (Unbounce) |
| **Personalized CTAs** (contextual to the reader) | **+202%** vs default (HubSpot) |
| **Specific action verbs** ("Start free", "Explore pricing", "See the demo") | Beat vague CTAs across the board |
| **Never "Learn More"** — consistently underperforms specific action CTAs | Multiple A/B tests |
| Adding urgency ("now", countdown) | **+35% CTR**; one test: +147% conversions |
| CTAs near product imagery | **+29% conversion** |
| Minimum tap target | **44x44px** (Apple/WCAG), optimal 44-60px |
| Primary / secondary CTA size ratio | **2.5:1** to establish clear priority |

- **Action verbs to prefer**: Start, Get, Try, Explore, See, Build, Run, Ship, Claim.
- **CTAs to avoid**: "Learn More" (dead on arrival), "Click Here" (dates the ad), "Submit" (cold), "#1" claims without proof.

**Benefit > feature.**
- Benefit-focused copy: **3x** higher conversion than feature-focused (Gitnux).
- Pain-point targeting: **+2.9x** conversion lift.
- Use the **FAB** progression — Feature → Advantage → Benefit. Always land on Benefit.
- "Save 10 hours/week with AI automation" beats "AI automation" because it names the outcome.

**Specificity beats superlatives.**
- "Used by 10,000 teams daily" beats "Popular."
- "Reduce production from 4 hours to 12 minutes" beats "faster."
- Hyperbolic unsupported claims ("#1 tool for growth") trigger skepticism and kill trust.

**Emotional vs. rational (IPA DataBANK — 1,400 case studies across 30+ years).**
- **Purely emotional campaigns**: +31% profitability lift.
- **Purely rational campaigns**: +16%.
- **Combined**: +26%.
- **Short-term sales activation** → rational wins.
- **Long-term brand building** → emotional wins (recall, loyalty, pricing power).
- **Low-involvement products** → lead emotional. **High-involvement / credence services (legal, medical, B2B infra)** → lead rational.
- **Rule for our work**: the headline carries the emotional hook, the subline carries the rational proof. Both matter.

**Cialdini primitives to deploy in subline / CTA.**
- **Social proof**: testimonials lift conversion up to **+270%** (Spiegel Research Center). Use named customers, specific counts, or a star rating. **4.2-4.5 stars is peak trust** — a perfect 5.0 reads as fake.
- **Authority**: cite studies, named sources, or credentialed users. "According to 2026 IPA data..." beats "experts agree."
- **Scarcity** (when genuine): "Only 3 left" or "Ends Friday" → +15-25% conversion.
- **Unity / in-group**: "Join 10,000+ engineering teams" — invokes belonging.
- **Reciprocity**: free trial, free tool, free resource → increases willingness to buy.

**Copy frameworks by funnel stage.**

| Stage | Framework | Why |
|---|---|---|
| **Awareness** | AIDA (Attention-Interest-Desire-Action) or BAB (Before-After-Bridge) | Capture attention, spark curiosity |
| **Consideration** | PAS (Problem-Agitate-Solution) | Highlight urgency of the problem |
| **Conversion** | PPPP (Problem-Promise-Proof-Proposal) or FAB | Clarity and confidence before purchase |

**Anti-patterns — never ship these.**
- Clickbait language ("Click here now", "You won't believe...") — repels quality audiences.
- Vague CTAs ("Learn More", "Find Out More").
- Hyperbolic claims without proof.
- **Typos / grammar errors**: reduce Google Ad clicks by **-70%**, increase bounce **+85%**.
- Copy that requires the reader to be mid-crisis to understand (passive-reader rule from prior feedback).

**Platform copy caps — respect as ceilings, not targets.**

| Platform | Headline | Body / caption |
|---|---|---|
| Facebook paid | 5 words / 25-40 chars | ~19 words |
| Instagram sponsored | — | ≤125 chars |
| LinkedIn sponsored | 70 chars | 150 chars intro |
| Google Ads | 30 chars | 90 chars description |
| X (Twitter) | — | 71-100 chars (+17% engagement) |

---

## The Pipeline (Step by Step)

### 1. Research the Brand

Go online and study the brand's visual identity:
- Find official product images (press photos, hero shots)
- Note the brand's color palette, typography style, and overall aesthetic
- Understand the product's key specs and selling points
- Save reference images locally for visual grounding

The goal is to internalize how the brand presents itself so that every downstream decision (color, font weight, copy tone, background mood) feels native to the brand.

### 2. Create the Product JSON

Write a detailed product specification file (`<product>.json`) that describes the product's physical appearance for the image generator. This is the equivalent of a creative brief for a photographer.

Include:
- **Physical form** — shape, dimensions, materials, key design details
- **Color palette** — hex codes for every visible color and where each is used
- **Rendering instructions** — camera angle, lighting setup, depth of field
- **Prompt templates** — base prompts and style variations

The more specific this JSON is, the more accurate Gemini's output will be. Describe what the product actually looks like, not what you wish it looked like.

### 3. Choose the Ad Layout

Before writing any code, decide where the product and text should go in the 1080x1080 frame. This is a creative judgment call — the layout should follow the product's natural shape, not a fixed template.

**The core question:** What orientation is the product, and where does that leave room for copy?

- **Horizontal products** (cars, laptops, shoes) — the product fills the middle band of the frame. Text goes in the top and bottom zones. This is the "stacked" layout.
- **Vertical products** (bottles, cans, wine, perfume) — the product is tall and narrow. Placing text above and below it wastes most of the frame and squeezes the product. Instead, offset the product to one side (e.g. right) and stack the copy on the opposite side (e.g. left). This is the "side-by-side" layout.
- **Compact/square products** (watches, headphones, cosmetics) — the product sits in the center. Text goes in the top and bottom zones, similar to horizontal products.

**What to decide:**
- **Product placement** — where in the frame the product sits (centered, left-offset, right-offset)
- **Text zone locations** — which regions of the frame hold copy (top/bottom, left-side, right-side)
- **Gemini reserved zones** — which areas of the image Gemini should keep empty/dark for text overlay
- **Gradient placement** — where the vignette goes to ensure text readability

Document the layout decision in a brief comment at the top of both `image_gen.py` and `text_overlay.py` so the intent is clear.

### 4. Define the ICPs

**Always generate fresh.** Identify 3-5 distinct customer personas who would buy this product. Never pull from a pre-built database of generic archetypes — ICPs are generated from scratch for every campaign based on the specific product and brief. The personas who buy a Garmin Forerunner are fundamentally different from those who buy a Tesla Model S, even for the same client. Pre-built profiles lead to lazy demographic segmentation instead of the purchase-motivation reasoning that produces our best work.

**Exception — client context:** If this is a repeat client with persistent client-level agent data from prior campaigns, use that accumulated context (what messaging worked, what platforms performed, what objections mattered) to inform ICP generation — but still generate the ICPs fresh. The learnings shape the reasoning, not the profiles themselves.

Each ICP should represent a genuinely different motivation — not just demographics, but different *reasons to care*.

#### Choosing the right ICPs

Before listing personas, ask: **who actually buys this product, and why?** Don't just segment by demographics (age, income). Segment by *purchase motivation* — two 30-year-olds might buy the same product for completely different reasons, and that's two ICPs.

**How to find the right ICPs:**
1. Start with the product's core value proposition. What does it *actually* do?
2. List every distinct reason someone would reach for this product. Each reason is a candidate ICP.
3. Eliminate overlaps — if two personas would respond to the same headline, they're the same ICP.
4. Prioritize ICPs that represent the largest or most reachable audiences.

**For each ICP, define:**
- **Label** — who they are (specific enough to picture a real person)
- **Pain points** — what they struggle with that this product solves
- **Where they live online** — which platforms they spend time on (this drives Step 5)
- **Visual treatment** — what kind of scene/mood would resonate with them

Don't write the copy yet. The next step handles that.

### 5. Simulate Each ICP and Write Messaging

This is the most important step and where most of the creative value lives. It has three parts: simulate the person, choose the platform, then write copy tailored to both.

#### Part A: Become the ICP

For each ICP, step into their shoes. Don't write *about* them — think *as* them. Work through these questions in order:

1. **What's their day like?** Where are they when they'd encounter this product? What were they doing 5 minutes before?
2. **What's the trigger?** What moment or feeling makes them think "I need this"? Be specific — not "they want to stay hydrated" but "it's the third quarter, their legs are cramping, and they just got subbed out."
3. **What would make them stop scrolling?** If they're mid-feed on Instagram or LinkedIn, what image + text combo would interrupt their thumb? The answer is different for each ICP.
4. **What objection do they have?** What's the reason they *wouldn't* buy? The subline should preemptively address this.
5. **What proof point would close them?** A number, a stat, a testimonial angle, a comparison. The thing that moves them from "interesting" to "add to cart."

Write down the answers. They become the raw material for the copy.

#### Part B: Choose the Platform

Each ICP has a primary platform where they're most reachable and most receptive to this kind of message. Don't default to "Instagram for everyone" — reason about it.

**Platform characteristics that matter:**

| Platform | Content style | Audience mindset | Ad format strengths |
|----------|--------------|------------------|-------------------|
| Instagram Feed | Visual-first, polished, aspirational | Browsing, discovery mode | Strong hero image + short punchy copy |
| Instagram Stories | Full-screen, ephemeral, raw | Casual, low-attention | Bold text, single message, swipe-up CTA |
| TikTok | Video-native, authentic, trend-driven | Entertainment-seeking | User-generated feel, not polished ads |
| Facebook | Text-heavier, community-driven | Intentional browsing, older skew | Longer copy OK, carousel for features |
| LinkedIn | Professional, credential-heavy | Work mode, status-conscious | ROI framing, professional proof points |
| YouTube Pre-roll | Interrupted viewing, 5-sec hook critical | Impatient, will skip | Front-load the hook, no slow builds |
| Reddit | Text-first, skeptical, anti-ad | Research mode, wants depth | Honest, no-BS tone, community voice |

**For each ICP, decide:**
- **Primary platform** — where the ad will run (drives format, tone, and image dimensions)
- **Why this platform** — one sentence explaining the match between this ICP's behavior and this platform's strengths
- **Format implications** — does this platform favor short or long copy? Polished or raw? Text-heavy or image-first?

Record the platform choice in the campaign JSON. Even though the current pipeline generates a single 1080x1080 image, the platform choice should influence the *tone and length* of the copy.

#### Part C: Write the Copy

Now write the ad copy, informed by both the ICP simulation (Part A) and the platform choice (Part B).

```
copy:
  product_title  — the product name (same across ICPs)
  tagline        — product category descriptor (same across ICPs)
  headline       — the big text, 1-2 lines (unique per ICP)
  subline        — supporting detail, specs, benefits (unique per ICP)
  cta            — button text (can vary per ICP)
  platform       — primary platform this ad is designed for
```

**Platform-specific copy guidelines:**

- **Instagram Feed** — headline should work as a standalone statement. Subline can be a single reinforcing line. Keep total copy under 15 words visible on the image.
- **Instagram Stories** — even shorter. Headline only, maybe 4-6 words. Subline optional. CTA must be a verb.
- **Facebook** — can go slightly longer. Subline can include 2-3 proof points. CTA can be more descriptive.
- **LinkedIn** — professional tone. Lead with outcomes or ROI. Avoid casual slang.
- **Reddit** — drop the marketing voice. Be direct, almost conversational. "Here's what it does" beats "Unlock your potential."
- **YouTube** — the image is a thumbnail or end card. Headline must work at tiny sizes. Bold, simple, high contrast.

#### Writing Good Headlines

The headline is the single most important element. It determines whether someone engages or scrolls past.

**What makes a good headline:**
- **Tied to the ICP's specific pain point** — the headline should answer "why should THIS person care?"
- **Passes the swap test** — if you swap the headline between two ICPs and it still works for both, it's too generic
- **Passes the platform test** — does this headline feel native to the platform? A LinkedIn headline shouldn't sound like a TikTok caption, and vice versa
- **Scannable** — a stranger should get it in under 2 seconds

**What makes a bad headline:**
- Works for any product in the category (or worse, any product at all)
- Requires context to understand
- Uses abstract metaphors instead of concrete benefits
- Sounds the same regardless of which platform it's on

**Rules of thumb (grounded in the research section above):**
- **6-10 words** is the sweet spot for ad headlines (21% CTR peak). Facebook paid caps at 25-40 chars / ~5 words.
- Pick a proven formula — Direct Benefit, PAS, Number/List, Question, or Curiosity Gap — not a freestyle.
- **Numbered headlines get +36% more clicks** (CoSchedule). Lead with a number when the product allows.
- **Loss framing outperforms gain framing by +31% CTR** in paid social. "Don't miss" > "Save."
- **Power words lift CTR by ~20%**. "Now" alone lifted sales 332% in one test. Use sparingly to preserve voice.
- Name the benefit, not the category. "Save 10 hours a week" > "Productivity tool."
- Clear beats short. A 12-word clear headline beats a 4-word cryptic one.
- If the headline sounds like a motivational poster, rewrite it.
- Emotional hook in the headline, rational proof in the subline (IPA: +31% profitability for purely emotional vs +16% for purely rational over 1,400 case studies).

**Subline rules:**
- Open with what the product *is* (the "passive reader" rule) — one sentence of concrete description before any benefit.
- Then a specific proof point: a number, a named customer, a measured outcome. **Benefit-focused copy beats feature-focused copy by 3x.**
- Max sentence length: 20 words. Target 6th-8th grade reading level.
- Avoid hyperbolic unsupported claims ("#1", "best"). Hyperbole triggers skepticism.

**CTA rules (hard):**
- Never "Learn More". Use a specific action verb: Start, Get, Try, Explore, See, Build, Ship, Claim.
- Prefer **first-person framing** when it fits the voice: "Start my free trial" beat "Start your free trial" by **+90% CTR** (Unbounce).
- Personalized CTAs (contextual to the ICP) lift CTR **+202%** vs generic (HubSpot).
- CTA-to-background contrast: target **7:1**, never below 4.5:1 (WCAG AA). Contrast — not hue — is the real lever.

#### Refining the Messaging

After the first draft of copy, pressure-test it:
1. Read each headline as if you're the ICP, mid-scroll *on their platform*, seeing this for the first time
2. Ask: "Would I stop? Do I immediately know what this is and why I should care?"
3. Ask: "Does this feel native to this platform, or does it feel like a generic ad dropped in?"
4. If the answer to any of these is no, rewrite. Don't get attached to clever phrasing that doesn't land.

The subline should reinforce the headline with proof — specs, numbers, concrete details. The headline hooks; the subline convinces.

### 6. Assemble the Campaign JSON

Combine everything into the campaign config file:

```
brand        — name, voice, color palette
product      — name, category, price, hero features, path to product JSON
icps[]       — array of customer personas, each with:
  id         — slug for filenames
  label      — human-readable name
  pain_points— what this customer struggles with
  platform   — primary platform (e.g. "instagram_feed", "facebook", "linkedin")
  platform_rationale — why this ICP is best reached on this platform
  copy       — headline, subline, cta (written in step 5)
  visual_treatment:
    background_mood  — text description of the scene for Gemini
    palette          — hex codes for bg, text, CTA colors
```

The `background_mood` should match the ICP's world — not just look nice, but feel like a place this person would recognize or aspire to. Include instructions for Gemini to keep the text zone areas darker/muted (the specific zones depend on the layout chosen in Step 3).

### 7. Run the Pipeline

```bash
cd experiments/<experiment-folder>
export GEMINI_API_KEY="your-key"
python3 generate.py campaigns/<brand>.json
```

**What happens under the hood:**

```
For each ICP:

  Step A — Image Generation (image_gen.py)
  ├── Embeds the full product JSON into a Gemini prompt
  ├── Adds the ICP's background_mood and accent color
  ├── Adds composition rules (product placement, reserved zones for text)
  ├── Zone layout depends on product orientation (see Step 3)
  ├── Sends to Gemini 3.1 Flash Image Preview
  └── Returns a 1024x1024 product image

  Step B — Text Overlay (text_overlay.py)
  ├── Resizes background to 1080x1080
  ├── Creates a subtle gradient vignette (NOT a black bar — smooth ease curve)
  ├── Renders all text at 2x resolution for crisp anti-aliasing
  │   └── Text placement matches the layout chosen in Step 3
  ├── Downscales text layer to 1080x1080
  └── Composites: background + gradient + text = final ad
```

### 8. Validate the Output

Each ICP produces 5 files:

| File | What it is |
|------|------------|
| `{icp}_prompt.txt` | The exact Gemini prompt used (for debugging) |
| `{icp}_bg.png` | Raw background image from Gemini |
| `{icp}_gradient.png` | The vignette overlay layer |
| `{icp}_text.png` | Text layer on transparent background |
| `{icp}_ad.png` | Final composited ad (the deliverable) |

The separate layers let you swap or edit components independently — try a different background with the same text, or adjust text without re-generating the image.

**Validation checklist (composition + copy + render):**

Render:
- [ ] Product is fully visible and not clipped by text zones
- [ ] No Gemini hallucinations (wrong product, extra objects, baked-in text)
- [ ] Gradient blends smoothly — no visible black bars or hard edges
- [ ] Overall feel matches the brand's aesthetic

Composition (research-backed):
- [ ] Exactly three primary focal points — headline, hero, CTA. Anything fourth is noise.
- [ ] CTA-to-background contrast meets 7:1 (ideal) or at least 4.5:1 (WCAG AA floor)
- [ ] Key elements sit at rule-of-thirds intersections or top horizontal third — not dead center
- [ ] CTA is placed at the natural scan terminal (Z-pattern bottom-right for visual ads, F-pattern end-of-row for text-heavy)
- [ ] Color budget respects 60-30-10 — accent is reserved for the CTA and nothing else
- [ ] Feature complexity is stripped (no busy backgrounds, no competing shapes, no stock noise)
- [ ] ≤2 typefaces across the whole ad
- [ ] Proximity groups headline + subline + CTA as one action unit
- [ ] Platform safe zones respected (14% top, 35% bottom, 6% sides for Meta feed)
- [ ] If the ad has a face: gaze direction matches product type (averted for hedonic, direct for functional)
- [ ] Each ICP's ad is visually distinct — different mood, composition, and copy, not just a color swap

Copy (research-backed):
- [ ] Headline passes the 1.5-second scan test — comprehensible without reading the subline
- [ ] Headline is 6-10 words (or 25-40 chars for Facebook paid)
- [ ] Headline uses one of the proven formulas: direct benefit, PAS, number, question, or curiosity
- [ ] Reading level is 6th-8th grade (no sentence over 20 words)
- [ ] Subline names a concrete benefit OR a specific proof point (number, customer name, stat)
- [ ] No hyperbolic unsupported claims ("#1", "best ever")
- [ ] No clickbait ("Click Here", "You won't believe")
- [ ] CTA uses a specific action verb — never "Learn More"
- [ ] CTA prefers first-person framing ("Start my free trial") when it fits the voice
- [ ] Emotional hook in the headline, rational proof in the subline
- [ ] Zero typos and zero grammar errors
- [ ] Copy respects the platform character cap (see Platform copy caps table)

---

## Adapting for a New Product Category

The `image_gen.py` and `text_overlay.py` scripts are product-category-specific. When moving to a new category, adjust:

**Layout** — the first thing to decide (Step 3):
- Think about the product's natural shape and orientation
- Vertical products (bottles, cans) work best with a side-by-side layout (product on one side, copy on the other)
- Horizontal/compact products (cars, watches) work best with stacked layout (copy top and bottom, product in the middle)
- This decision drives everything in both `image_gen.py` and `text_overlay.py`

**image_gen.py** — composition rules change per product type:
- Watches: product floating on invisible stand, band orientation rules, anti-hallucination constraints
- Cars: product on ground plane, heroic low camera angle, no license plates
- Bottles: product offset to one side, leaving the opposite side empty for copy
- Other products: reason about the shape and adjust placement zones, camera angle, and forbidden behaviors accordingly

**text_overlay.py** — typography and layout should match the brand and product:
- Font choice and weights (match the brand's actual typeface as closely as possible)
- Text zone placement must match the layout decision (side zones, top/bottom zones, etc.)
- Gradient placement must cover the text zones, wherever they are
- Margins and spacing (minimal brands need more breathing room)
- Letter-spacing for brand name (some brands use wide tracking)
- CTA button style (rounded vs sharp corners, pill vs rectangle)

---

## File Structure

Each experiment folder follows this layout:

```
experiments/<experiment>/
├── campaigns/
│   └── <brand>.json            # Campaign config (brand + ICPs + copy)
├── <product>.json              # Product spec (physical description for Gemini)
├── generate.py                 # Orchestrator — loads config, runs pipeline
├── image_gen.py                # Gemini API integration (product-category-specific)
├── text_overlay.py             # Layered text composition (brand-specific typography)
└── output/
    └── <brand>_<timestamp>/    # Timestamped output
        ├── campaign.json       # Config snapshot
        ├── {icp}_prompt.txt    # Gemini prompt used
        ├── {icp}_bg.png        # Raw Gemini image
        ├── {icp}_gradient.png  # Vignette layer
        ├── {icp}_text.png      # Text layer
        └── {icp}_ad.png        # Final composite
```

**Reference experiments:**
- `experiment-6-structured-ads/` — Garmin Forerunner 255 (watch)
- `experiment-7-tesla-ads/` — Tesla Model S Plaid (car)

## Dependencies

- Python 3.10+
- `Pillow` (PIL) — image processing
- `requests` — Gemini API calls
- `GEMINI_API_KEY` environment variable
- macOS system fonts (choose a font that matches the brand's typography)
