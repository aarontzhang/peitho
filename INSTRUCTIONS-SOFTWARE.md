# Peitho Ad Pipeline — Software / Non-Physical Products

This is the process Claude follows to generate a full set of personalized ads for a **software platform, SaaS tool, or other non-physical product**. The core ICP-driven pipeline from `INSTRUCTIONS.md` still applies, but the visual model flips: there is no physical object to render, so the **message itself becomes the hero** and the background becomes a supporting canvas.

Read this document instead of `INSTRUCTIONS.md` when the product is a software platform, API, service, or anything without a photographable form.

---

## The Core Difference

With a physical product, Gemini renders a watch or a car and text wraps around it. With software:

- The **headline is the hero**. Typography carries the ad.
- The **background is a subtle canvas** — a quiet gradient, paper texture, side panel, or split wash. It never contains objects, scenes, or anything that competes with the copy.
- The **logo is the real brand asset** — the official PNG or SVG, composited in. Never a typographic approximation, never a fake dot-mark.
- **Each ICP gets its own distinct layout**, not a single template with swapped copy. A campaign should read as a deliberate set, not a variable substitution.
- Every piece of the layout exists to serve legibility of the message.

This is **typographic hero design**. It's what Stripe, Basecamp, and most serious B2B SaaS brands use when they can't put a product in the frame.

## Resolution & Quality

- Render the final composite at **2160×2160** minimum. 1080×1080 is where the ad will usually display, but producing at 2× gives crisp edges on large screens and retina display, and leaves headroom for future crops.
- Render the text layer at 2× supersampled (4320×4320) and downscale with LANCZOS for clean anti-aliasing on type.
- Save as PNG with `optimize=True`. Do not use JPEG for the final — text compresses badly.
- The logo is a pre-made PNG/SVG asset. Never approximate a brand wordmark with system fonts. Always source the real asset from the brand's public brand kit and composite it in.

## Layout Variety Rule

**Do not ship four ads that all look the same with different copy.** If every ICP gets the same centered-hero template, the campaign reads as lazy. Each ICP should get a layout that visually matches the message — different structure, different visual emphasis, different CTA style.

A good set of layouts to mix and match:

| Layout | Structure | Good for |
|--------|-----------|----------|
| `centered_hero` | Logo top-center, headline centered, subline centered, pill CTA | Broad-audience launches, founder-facing pitches |
| `left_editorial` | Logo top-left, horizontal accent rule, everything left-aligned, rectangular CTA with arrow | Technical audiences, engineering-first messaging |
| `numbered_steps` | Logo top-center, three numbered rows with dividers (01/02/03), subline centered, pill CTA | Process-heavy messages — "do X, then Y, then Z" |
| `oversized_display` | Massive headline dominating 60% of the frame, bottom cluster with logo + small subline + text-link CTA | Minimal brand statements, punchy single-idea ads |

Each layout pairs well with a distinct background style: corner glow, side panel (vertical accent bar), split panel (two-tone horizontal split), or flat grain.

---

## Research-Backed Composition & Copy Principles

This section codifies evidence from the `research/` folder (visual composition studies, copywriting meta-analyses, academic papers, case-study benchmarks). Treat these as hard constraints during generation, not suggestions. Every rule below has a citation in `research/01-visual-composition.md`, `research/02-copywriting.md`, `research/03-academic-papers.md`, or `research/04-case-studies-benchmarks.md`.

For software ads specifically (typographic hero layouts, no physical product), the composition rules apply with extra weight to typography, contrast, and white space — since the copy *is* the hero.

### Composition

**Three-element rule.** Human working memory holds 3-4 chunks. A static ad must have exactly **three primary focal points**: logo/brand, headline, CTA. The subline supports the headline and should be a single visual block, not a fourth element. Documented lifts from correcting visual hierarchy: +20-30% conversion, up to +340% in one case.

**The 1.5-second rule.** In-feed users decide in under 1.5s whether an ad is worth attention. Pre-attentive processing (shape + contrast, unconscious) happens in **200-500ms**. Design for the scan, not for a careful reader. The headline must be legible and comprehensible within this window.

**Scanning patterns matched to our layouts.**
- **Z-pattern**: eye enters top-left → sweeps top-right → diagonals to bottom-left → terminates bottom-right. CTA misalignment with the terminal cost **598% of clicks** in one documented test. Matches `centered_hero` and `left_editorial` layouts.
- **F-pattern**: long horizontal across the top, shorter below, then vertical down the left edge. Matches `left_editorial` and `numbered_steps`. 79% of readers follow an F-pattern on text-heavy layouts.

**Rule of thirds.** Divide the 2160×2160 frame into nine equal parts. Place the headline baseline near the top horizontal third line — a strong, stable placement. Slight asymmetry (left-editorial, oversized-display) increases dwell time vs dead-center.

**Golden ratio / Fibonacci sizing.** For typography, `subline_size ≈ headline_size / 1.618`. Use Fibonacci approximations (8, 13, 21, 34, 55, 89, 144) for whole-number scale. For layout, anchor primary elements at 61.8% / 38.2% spatial splits — this is why `split_panel` bg uses 62/38 and works.

**Contrast is the real conversion driver.**
- Target **7:1 contrast ratio** between CTA and its immediate background — this beats 4.5:1 by **26.4% on conversion**. WCAG AA minimum: 4.5:1 for normal text, 3:1 for large text. Never go below AA.
- "CTA color tests" actually measure **isolation, not hue**. The CTA that maximally contrasts with the rest of the frame wins.
- Complementary rule of thumb: blue canvas → orange CTA (+38% in one test); cream canvas → orange/black CTA; slate canvas → orange CTA; red canvas → green CTA.

**60-30-10 color rule.** Budget: **60% dominant/background**, **30% secondary/structure**, **10% accent (reserved for CTAs and key emphasis)**. For software ads this usually means: 60% base canvas color, 30% neutral text (ink or off-white), 10% brand accent (orange for PostHog, etc.). Breaking this ratio dilutes the accent and kills the CTA's isolation effect.

**Feature complexity vs. design complexity (Pieters, Wedel & Batra 2010, *Journal of Marketing*).**
- **Feature complexity** — dense perceptual noise, cluttered objects, competing shapes, busy backgrounds — **hurts** attention and brand attitude. This is why our backgrounds must stay quiet.
- **Design complexity** — deliberate creative elaboration, considered hierarchy, layered typography — **helps**.
- Strip feature complexity. Invest in design complexity.

**White space = comprehension + premium signal.**
- Generous white space improves comprehension by up to **20%** (Crazy Egg).
- High-end / high-consideration products benefit from MORE white space — signals exclusivity. Low-ticket products convert better with less.
- For B2B SaaS (our typical category), lean toward **more white space** — it reads as premium and serious.
- Use an **8px grid system** — all spacing in multiples of 8 — for rhythm.

**Gestalt principles in practice.**
- **Proximity**: group headline + subline + CTA tightly as one action unit. `centered_hero` and `oversized_display` depend on this.
- **Similarity + Von Restorff isolation**: break similarity intentionally for the CTA. One accent-colored element in a neutral field wins. The element that stands out is the one that's remembered and clicked.
- **Figure-ground**: non-negotiable clarity between text and background. If you can't instantly separate figure from ground, the ad fails.
- **Continuity**: use rules, lines, and directional elements to guide the eye. The accent rule in `left_editorial` and the divider lines in `numbered_steps` exist for this reason.

**Banner blindness.** Users skip anything that looks like an ad: bright borders, animation-mimicking compositions, promo flash. Native, editorial-restrained composition beats ad-like composition. **70-80% of Meta ad performance comes from creative quality, not budget or targeting** (2025 AppsFlyer). For B2B software, lean hard into editorial — magazine-page, not banner-ad.

**Simplicity wins.**
- **1-2 typefaces maximum**. One display sans for headline + one body sans for subline is the ceiling.
- Avoid: gradients as decoration, drop shadows, mixed typefaces, low-resolution stock imagery, busy backgrounds. Simple wins "9 times out of 10" (industry reviews).
- One idea per ad.

**Safe zones (platform-specific).**
- **Meta feed**: leave 14% top, 35% bottom, 6% each side clear of critical content (platform chrome overlays).
- **Stories / Reels (9:16)**: top ~250px + bottom ~350px are UI-covered.
- **Cross-platform rule**: keep essential content within **5-10% margins** on all sides.

### Copy

**The 80/20 rule (Ogilvy).** **80% of people read the headline; only 20% read past it.** The headline must carry the entire value proposition. The subline is a reinforcement, not a load-bearing wall.

**Headline formulas that work.**

| Formula | When to use | Example |
|---|---|---|
| **Direct benefit / command** | Product clarity is the priority | "Save 10+ hours a week on bookkeeping" |
| **PAS (Pain-Agitate-Solution)** | Pain-driven audiences | "Your users keep churning. You don't know why." |
| **Number / list** | Feature-rich or comparison plays | "5 tools. One dashboard. 70% less setup." |
| **Question** | Curiosity-led awareness | "What if analytics, flags, and replays lived in one tool?" |
| **Curiosity gap** | High-engagement audiences, paired with a benefit | "The reason your users churn (and nobody told you)" |

- Numbered headlines get **+36% more clicks** (CoSchedule, 4M+ headlines analyzed).
- Question headlines lifted engagement +41% and conversions +19% in one test — but a How-To headline beat a Question headline by +52% in an opt-in test. Context matters.

**Headline length — new guidance.** Our prior "short is cringe" feedback still holds, but there are real platform ceilings:

| Context | Optimal |
|---|---|
| Typographic hero ads (our default) | 6-14 words — clarity over brevity |
| Ad headlines (general research average) | 6-10 words — **21% CTR sweet spot** |
| Facebook paid headline | 25-40 characters / ~5 words |
| LinkedIn ad/article headline | 40-49 characters |
| Google Ads headline | ≤30 characters each |

Longer isn't always worse. AdEspresso's $1,000 Facebook copy test found **three-paragraph copy beat one-sentence copy by 2.4x per lead**. 89% of marketers predicted the opposite. Length should match product complexity, not default to short.

**Power words and loss framing.**
- Power words in headlines: **+20% CTR**.
- "Now" increased sales **+332%** in one test — use sparingly so it doesn't cheapen.
- **Loss-framed beats gain-framed**: "Don't Miss Out! 20% Off Ends Today" beat "20% Off Premium" by **+31% CTR** (Google Ads). Kahneman/Tversky: losses are felt ~2x as strongly as equivalent gains.
- Caution: over-urgency reads as manipulation and tanks trust sharply (CXL).

**Reading level.**
- Target **6th-8th grade reading level** (Flesch Reading Ease 60-90). One site doubled conversions rewriting from 14.2 to 7th grade.
- **Maximum sentence length: 20 words.** Break anything longer.
- Readability accounts for ~11% of conversion variance across 33 sites tested (Portent).
- For developer/engineering audiences (who tolerate more density) you can push this slightly — but clarity still wins.

**Subline length and content.**
- Open with what the product *is* — one concrete sentence before any benefit. (The "passive reader" rule from prior feedback.)
- Then a specific proof point: a number, a named customer, a measured outcome.
- **Benefit-focused copy beats feature-focused copy by 3x** (Gitnux).
- **Pain-point targeting: +2.9x conversion lift.**
- 2-5 sentences is a good range for typographic hero ads where the copy is doing the work.

**CTA rules (hard constraints).**

| Rule | Data |
|---|---|
| Use **first-person pronouns** ("Start my free trial") | **+90% CTR** vs "Start your free trial" (Unbounce) |
| **Personalized CTAs** (contextual to the reader/ICP) | **+202%** vs default (HubSpot) |
| **Specific action verbs** | Beat vague CTAs across the board |
| **Never "Learn More"** | Consistently underperforms — dead on arrival |
| Urgency when genuine | **+35% CTR**; one test saw +147% conversions |
| CTAs near anchor elements (rules, dividers) | Leverages proximity + continuity |
| Minimum tap target | **44x44px** (Apple/WCAG), optimal 44-60px |
| Primary vs secondary CTA ratio | **2.5:1** for clear priority |

- **Action verbs to prefer**: Start, Get, Try, Explore, See, Build, Run, Ship, Claim, Try free.
- **Never use**: "Learn More", "Click Here", "Submit", "Find Out More", "#1" claims without proof.

**Benefit > feature.**
- Benefit-focused copy: **3x higher conversion** than feature-focused (Gitnux).
- Use the **FAB** progression — Feature → Advantage → Benefit. Always land on Benefit.
- "Save 10 hours/week with AI automation" beats "AI automation" because it names the outcome.

**Specificity beats superlatives.**
- "Used by 10,000+ engineering teams" beats "Popular with engineers."
- "Reduce production from 4 hours to 12 minutes" beats "faster."
- Hyperbolic unsupported claims ("#1 tool for growth") trigger skepticism and kill trust. Never ship them.

**Emotional vs. rational (IPA DataBANK — 1,400 case studies across 30+ years).**
- **Purely emotional campaigns**: +31% profitability lift.
- **Purely rational campaigns**: +16%.
- **Combined**: +26%.
- **Short-term sales activation** → rational wins.
- **Long-term brand building** → emotional wins (recall, loyalty, pricing power).
- B2B software often sits in **high-involvement / credence services** territory → lead rational in the subline (specs, proof, social proof). But keep an emotional hook in the headline (frustration, relief, aspiration) — the combined approach is +26%, and pure-rational is the worst of the three.

**Cialdini primitives to deploy in the subline.**
- **Social proof**: testimonials lift conversion up to **+270%** (Spiegel). Use named customers ("Used by teams at Airbus, Hasura, Y Combinator startups"), specific counts, or star ratings. **4.2-4.5 stars is peak trust** — a perfect 5.0 reads as fake.
- **Authority**: cite studies or credentialed users. "Used by the YC batch" beats "Used by top teams."
- **Scarcity** (when genuine): "Free tier ends at 1M events" → +15-25% conversion. Never fake scarcity — trust collapse is sharp.
- **Unity / in-group**: "Join 10,000+ engineering teams" — invokes belonging.
- **Reciprocity**: free trial, free tier, free tool → increases willingness to buy.

**Copy frameworks by funnel stage.**

| Stage | Framework | Why |
|---|---|---|
| **Awareness** | AIDA / BAB | Capture attention, spark curiosity |
| **Consideration** | PAS (Problem-Agitate-Solution) | Highlight urgency of the problem |
| **Conversion** | PPPP (Problem-Promise-Proof-Proposal) / FAB | Clarity and confidence before purchase |

**Anti-patterns — never ship these.**
- Clickbait language ("Click here now", "You won't believe") — repels quality audiences.
- Vague CTAs ("Learn More", "Find Out More").
- Hyperbolic claims without proof.
- **Typos / grammar errors**: reduce Google Ad clicks by **-70%**, hike bounce **+85%**.
- Copy that requires the reader to be mid-crisis to understand (passive-reader rule from prior feedback).
- Motivational-poster phrasing (the cringe filter).

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

Same as physical products, but with additional emphasis on **typographic identity** and **the real logo asset**:
- Find the brand's typeface (or closest available system font) — type IS the product here.
- Note the brand's color palette, especially primary accent and any signature neutral (cream, slate, off-white).
- Study how the brand uses type in its own marketing — sizes, weights, letter spacing, hierarchy.
- Capture the brand's voice from their docs, blog, and landing page — is it terse, playful, technical, formal?
- **Download the real logo as a PNG/SVG** from the brand's public brand kit. Save at least two variants: the default (for light backgrounds) and an all-white version (for dark backgrounds). Store them in an `assets/` folder inside the experiment. Never approximate the logo with system fonts.

### 2. Create the Brand System JSON

Instead of a product JSON, write a `<brand>_system.json` that describes the **visual brand system**, not a physical object. This is the creative brief for the typographic layout, not for a photographer.

Include:
- **Palette** — hex codes for primary, accent, neutral canvas colors, text colors, and CTA states
- **Typography rules** — which system font (or fallback) to use, weight choices for headline / subline / CTA, letter spacing, line-height
- **Logo treatment** — how the wordmark should render (text-based wordmark, icon + wordmark, size, position)
- **Background aesthetic** — the kind of quiet canvas the brand lives on (warm cream, deep ink, paper texture, minimal gradient)
- **Layout constraints** — logo zone, headline zone, subline zone, CTA zone (y-coordinate ranges in a 1080x1080 frame)

The brand system JSON is referenced by both `image_gen.py` (for background mood) and `text_overlay.py` (for type rules). It replaces the product JSON.

### 3. Pick a Layout Per ICP

Each ICP gets a layout from the layout library above (or a new one designed specifically for the campaign). The question is **which structure serves this ICP's message best**.

Guidance:
- **Centered hero** — the default. Works when the headline is a standalone statement and the subline is a paragraph-length explainer.
- **Left editorial** — works for technical audiences who read top-to-bottom like a docs page. Feels serious and considered.
- **Numbered steps** — works when the headline is naturally a sequence ("Do A. Then B. Then C."). Parses the headline on `\n` and renders each line as a numbered row.
- **Oversized display** — works when the headline is short, punchy, and self-sufficient. Pushes everything else to the bottom.

**Do not reuse the same layout across all ICPs in a campaign.** Mix at least 2-3 different layouts so the set reads as intentional. If a layout only really fits one ICP's message, that's fine — use different ones for the others.

Each ICP in the campaign JSON declares:
```json
"layout": "centered_hero | left_editorial | numbered_steps | oversized_display",
"bg_style": "corner_glow | side_panel | split_panel | flat_grain"
```

Background style typically pairs with layout:
- `centered_hero` + `corner_glow`
- `left_editorial` + `side_panel`
- `numbered_steps` + `split_panel`
- `oversized_display` + `flat_grain`

But pairings are not required — mix if it serves the ad.

### 4. Define the ICPs

Same as physical products — generate 3-5 fresh ICPs per campaign based on **purchase motivation**, not demographics. See `INSTRUCTIONS.md` step 4 for the full ICP definition process.

For B2B software specifically, pay extra attention to:
- **Role + company stage** matters more than age/income. "CTO at a seed-stage startup" and "CTO at a 500-person company" are different ICPs with different problems even though they share a title.
- **Technical vs non-technical buyer**. A developer will respond to "self-hostable and open source." A PM will respond to "ship experiments faster." Don't mix these signals in one ad.
- **The buying trigger** — for B2B, the trigger is usually a moment of frustration with an existing tool or a new requirement (compliance, scale, consolidation).

### 5. Simulate Each ICP and Write Messaging

This is where the biggest difference from physical products shows up. **Software messaging has to explain what the product is.** You cannot assume the reader knows.

#### Part A: Become the ICP

Same as `INSTRUCTIONS.md` step 5A. Walk through: day, trigger, scroll-stopper, objection, proof point.

#### Part B: Choose the Platform

Same platform table as `INSTRUCTIONS.md` step 5B. For B2B software, LinkedIn and Twitter (for dev audiences) tend to dominate, with Reddit and HackerNews for open-source / developer-tool audiences.

#### Part C: Write the Copy — Clarity Rules

The copy rules diverge from physical products here. **Read carefully.**

##### The Passive Reader Test

Every headline must land for a reader who is:
1. NOT actively thinking about the problem the product solves
2. NOT in a crisis moment
3. Scrolling casually at the end of their day

If the headline only makes sense when the reader is already in pain about the exact problem, **it's too narrow**. Rewrite it.

Bad (too narrow): "Your 4th A/B test this week just broke."
→ Assumes the reader just had an A/B test break, is currently annoyed, and is in the middle of a week of heavy experimentation. Miss any of those and the ad is nonsense.

Good (passive-friendly): "Launch the test. Watch the replay. Read the results. In one tool."
→ Makes sense to anyone who knows what A/B tests, replays, and results are. No required emotional state.

##### The "What Is This?" Rule

**The subline must explain what the product is.** Do not assume the reader has heard of it. One sentence minimum of concrete description — what the thing literally does — before any benefits or proof points.

Bad (context-free): "Stop flying blind. Start shipping with confidence."
→ What is the product? A plane? A therapist? A CI/CD tool? The reader cannot tell.

Good (self-contained): "PostHog is an open-source product analytics platform with session replay, feature flags, A/B testing, and surveys in one stack. Free up to 1M events per month."
→ Reader now knows exactly what it is, what it replaces, and what the free tier looks like. They can evaluate whether to click.

##### The Length Rule

**Don't over-index on short.** Short headlines are prized for physical-product ads because the product image is already doing half the work. With typographic hero, the copy IS the work. Give it room.

- Headline: 6-14 words is fine. Clarity beats brevity.
- Subline: 2-5 sentences is fine. Explain the product. Give one proof point. Close with a reason to click.
- Avoid the temptation to cut a clear sentence down to a cryptic fragment. Fragments read as lazy, not punchy.

##### The Cringe Filter

Don't write anything that sounds like a motivational poster, a LinkedIn influencer post, or a 2017 startup billboard. If the headline uses words like *unleash*, *supercharge*, *elevate*, *revolutionize*, or *game-changer*, rewrite it.

**How to cringe-check:** read the headline aloud to yourself. If you'd be embarrassed to say it in a meeting, you'd be embarrassed to ship it.

##### Apply the research-backed rules (from the "Research-Backed Composition & Copy Principles" section above)

All of these apply in addition to the passive-reader / what-is-this / length / cringe rules above. They are hard constraints, not suggestions:

- **Headline formula**: pick one of Direct Benefit, PAS, Number/List, Question, or Curiosity Gap — not freestyle.
- **Emotional hook in the headline, rational proof in the subline.** Combined emotional+rational campaigns are +26% profitability (IPA); pure-rational is +16% and the worst of the three.
- **Loss framing beats gain framing by +31% CTR** — consider "Don't keep stitching five tools together" over "Ship faster with one stack." Use sparingly; don't manufacture urgency.
- **Numbered headlines get +36% more clicks.** If the product allows a number, lead with it.
- **Max sentence length: 20 words.** 6th-8th grade reading level target.
- **Specificity beats superlatives.** Use named customers, specific counts, measured outcomes. Never "#1" or "best ever" without proof.
- **Subline should deploy at least one Cialdini primitive**: social proof (named customers, counts, ratings), authority (cited source), scarcity (genuine), unity (in-group), or reciprocity (free tier).

##### CTA rules (hard)

- Never "Learn More". Use a specific action verb: Start, Get, Try, Explore, See, Build, Run, Ship, Claim.
- Prefer **first-person framing** when it fits the voice: "Start my free trial" beat "Start your free trial" by **+90% CTR** (Unbounce).
- Personalized CTAs (contextual to the ICP) lift CTR **+202%** (HubSpot).
- CTA-to-background contrast: target **7:1** ratio, never below 4.5:1 (WCAG AA). Contrast — not hue — is the lever.
- The CTA must sit at the natural scan terminal of its layout (Z-pattern bottom-right, F-pattern end-of-row, or the gestalt-proximity anchor of the headline/subline block).

##### Final Copy Spec

```
copy:
  headline       — the big text, 1-3 lines, 6-14 words (unique per ICP)
                   Picks a proven formula (Direct Benefit / PAS / Number / Question / Curiosity Gap).
                   Emotional hook. Passes the 1.5-second scan test.
  subline        — 2-5 sentences. Opens with what the product IS.
                   Rational proof point (number, named customer, measured outcome).
                   At least one Cialdini primitive (social proof is the default).
                   Max 20 words per sentence, 6th-8th grade reading level.
  cta            — 2-4 words. Specific action verb. First-person where it fits.
                   Never "Learn More".
  platform       — primary platform this ad is designed for
```

Note: no `product_title` / `tagline` at the top of the frame here. In typographic hero the logo handles brand identification — the top band shouldn't also repeat the product name.

### 6. Assemble the Campaign JSON

```
brand        — name, voice, palette, logo rules
icps[]       — array of customer personas, each with:
  id         — slug for filenames
  label      — human-readable name
  layout     — one of: centered_hero | left_editorial | numbered_steps | oversized_display
  bg_style   — one of: corner_glow | side_panel | split_panel | flat_grain
  pain_points— what this customer struggles with
  platform   — primary platform (e.g. "linkedin", "twitter", "reddit")
  platform_rationale — why this ICP is best reached on this platform
  copy       — headline, subline, cta (written in step 5)
  visual_treatment:
    background_mood  — description of the subtle canvas (also used by Gemini path)
    palette          — bg_base, bg_accent, text_primary, text_secondary, cta_bg, cta_text
```

Mix layouts across ICPs in the same campaign. If all four ICPs end up with the same `layout` value, rethink — the campaign will feel like one ad with four captions.

The `background_mood` should describe a **subtle canvas**, not a scene. Phrases like "minimal cream canvas with a faint orange glow in the corner" or "deep charcoal with a soft radial wash of accent color" are right. Avoid scenes, objects, or anything with visual weight.

### 7. Run the Pipeline

```bash
cd experiments/<experiment-folder>
export GEMINI_API_KEY="your-key"
python3 generate.py campaigns/<brand>.json
```

**What happens under the hood:**

```
For each ICP:

  Step A — Background Generation (image_gen.py)
  ├── Reads the ICP's `bg_style` (corner_glow / side_panel / split_panel / flat_grain)
  ├── By default, renders a procedural PIL canvas — guaranteed quiet, no hallucinations
  ├── With USE_GEMINI_BG=1, calls Gemini with a minimal "empty canvas" prompt instead
  ├── Output is 2160x2160 RGB
  └── The center is always near-uniform so copy sits cleanly

  Step B — Typographic Overlay (text_overlay.py)
  ├── Resizes background to 2160x2160 if needed
  ├── Applies a very faint center contrast wash for headline legibility
  ├── Dispatches to the ICP's `layout` function (centered_hero / left_editorial / etc.)
  ├── Each layout composites the real logo PNG (white on dark, default on light)
  ├── Each layout renders headline + subline + CTA in its own structure
  ├── Text is supersampled at 2x (rendered at 4320x4320, downscaled to 2160) for clean AA
  └── Composites: background + gradient + text = final ad
```

### 8. Validate the Output

Typographic hero has a different validation checklist than physical-product ads:

Render:
- [ ] **Resolution is at least 2160x2160.** Zoom in — edges of the headline characters should be crisp, not fuzzy.
- [ ] **Logo is the real brand asset** (composited PNG/SVG), not a typographic approximation. White variant on dark backgrounds, default on light.
- [ ] Arrows and any non-ASCII glyphs render as shapes, not as tofu/boxes. If the chosen font doesn't carry the glyph, draw it with PIL primitives.
- [ ] No Gemini hallucinations if the Gemini path is used (baked-in text, random objects, figures in the canvas).
- [ ] Outputs land in `output/<brand>/` with only final ads at the top level and intermediates in `layers/`.

Composition (research-backed):
- [ ] Exactly three primary focal points — logo, headline, CTA. Subline supports the headline as one visual block.
- [ ] **Layouts vary across ICPs.** If all four ads share the same structure, that fails. The set should feel like a deliberately-varied campaign.
- [ ] Headline is the biggest visual element within its layout — nothing competes with it.
- [ ] Headline does not overlap the logo, rule, subline, or CTA zones.
- [ ] CTA-to-background contrast meets **7:1 target**, at minimum **4.5:1 (WCAG AA)**.
- [ ] Color budget respects **60-30-10** — accent is reserved for the CTA and key emphasis only.
- [ ] Background is quiet — no objects, no patterns, no distracting shapes, no feature complexity.
- [ ] Background does NOT compete with the headline for attention.
- [ ] Key elements sit at rule-of-thirds intersections or the top horizontal third — not dead center (unless the layout is `centered_hero`).
- [ ] CTA sits at the natural scan terminal of its layout (Z-pattern bottom-right, F-pattern end-of-row, or proximity anchor).
- [ ] ≤2 typefaces across the whole ad.
- [ ] Proximity groups headline + subline + CTA as one action unit.
- [ ] Platform safe zones respected (14% top, 35% bottom, 6% sides for Meta feed).
- [ ] Light/dark theme mix across the campaign is intentional — not a default 3-light / 1-dark lazy split.

Copy (research-backed):
- [ ] Headline passes the **1.5-second scan test** — comprehensible without reading the subline.
- [ ] Headline uses one of the proven formulas: Direct Benefit, PAS, Number, Question, or Curiosity Gap.
- [ ] Headline length respects platform ceiling (25-40 chars for Facebook paid; 40-49 for LinkedIn; 6-14 words for typographic hero).
- [ ] Emotional hook in the headline, rational proof in the subline.
- [ ] Subline opens with **what the product IS** (passive-reader rule).
- [ ] Subline deploys at least one Cialdini primitive: social proof, authority, scarcity, unity, or reciprocity.
- [ ] Subline names a concrete benefit OR a specific proof point (number, named customer, stat).
- [ ] Reading level is **6th-8th grade** (no sentence over 20 words).
- [ ] No hyperbolic unsupported claims ("#1", "best ever", "revolutionary").
- [ ] No clickbait, no motivational-poster phrasing, no "unleash / supercharge / elevate / game-changer."
- [ ] CTA uses a specific action verb — **never "Learn More"**.
- [ ] CTA prefers first-person framing ("Start my free trial") when it fits the voice.
- [ ] Zero typos, zero grammar errors.

**If any ad fails validation**, either regenerate the background with tighter constraints OR fall back to a procedurally-generated PIL canvas (solid base color + subtle radial gradient). For typographic hero, a procedural background is always acceptable — the copy is the hero, not the canvas.

---

## File Structure

```
experiments/<experiment>/
├── assets/                     # Real brand assets (logos, etc.)
│   ├── <brand>-logo.png        # Default / light-bg variant
│   └── <brand>-logo-white.png  # Dark-bg variant
├── campaigns/
│   └── <brand>.json            # Campaign config (brand + ICPs + copy + layout + bg_style)
├── <brand>_system.json         # Brand system (type, palette, layout zones)
├── generate.py                 # Orchestrator
├── image_gen.py                # Gemini + procedural background generators
├── text_overlay.py             # Layout dispatch + typographic composition
└── output/
    └── <brand>/                # Stable folder — overwrites on each run
        ├── {icp}_ad.png        # ONLY the final ads at the top level
        └── layers/             # Intermediates, prompts, campaign snapshot
            ├── campaign.json
            ├── {icp}_prompt.txt
            ├── {icp}_bg.png
            ├── {icp}_gradient.png
            └── {icp}_text.png
```

The output folder holds **only final ads at the top level**. All intermediate assets (raw background, gradient layer, text layer, Gemini prompt, campaign snapshot) live in the `layers/` subfolder. The folder is stable — each run wipes and re-writes the same path, no timestamped directories.

## Dependencies

Same as `INSTRUCTIONS.md`: Python 3.10+, Pillow, requests, `GEMINI_API_KEY`.
