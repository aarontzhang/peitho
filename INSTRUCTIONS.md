# Peitho Ad Pipeline — How It Works

This is the process Claude follows to generate a full set of personalized ads for a physical product. The pipeline takes a brand + product and produces multiple ad creatives, each tailored to a different simulated customer persona (ICP).

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

Identify 3-5 distinct customer personas who would buy this product. Each ICP should represent a genuinely different motivation — not just demographics, but different *reasons to care*.

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

**Rules of thumb:**
- Numbers and specifics tend to outperform adjectives and abstractions
- Name the benefit, not the category
- Short is good, but clear beats short
- If the headline sounds like it could be a motivational poster, rethink it

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

**Validation checklist:**
- [ ] Product is fully visible and not clipped by text zones
- [ ] Headline is readable at thumbnail size
- [ ] Subline is legible (bump font size if not)
- [ ] CTA button has enough contrast against background
- [ ] No Gemini hallucinations (wrong product, extra objects, text baked into image)
- [ ] Gradient blends smoothly — no visible black bars or hard edges
- [ ] Overall feel matches the brand's aesthetic
- [ ] Each ICP's ad feels distinct from the others (different mood, not just different text)

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
