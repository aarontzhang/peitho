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

### 3. Define the ICPs

Identify 3-5 distinct customer personas who would buy this product. Each ICP should represent a genuinely different motivation — not just demographics, but different *reasons to care*.

For each ICP, define:
- **Label** — who they are
- **Pain points** — what they struggle with that this product solves
- **Visual treatment** — what kind of scene/mood would resonate with them

Don't write the copy yet. The next step handles that.

### 4. Simulate Each ICP and Write Messaging

This is the most important step and where most of the creative value lives.

For each ICP, simulate being that customer. Think through:
- What would make them stop scrolling?
- What specific anxiety or desire does this product address for them?
- What proof point would they find most compelling?

Then write the ad copy:

```
copy:
  product_title  — the product name (same across ICPs)
  tagline        — product category descriptor (same across ICPs)
  headline       — the big text, 1-2 lines (unique per ICP)
  subline        — supporting detail, specs, benefits (unique per ICP)
  cta            — button text (can vary per ICP)
```

#### Writing Good Headlines

The headline is the single most important element. It determines whether someone engages or scrolls past.

**What makes a good headline:**
- **Tied to the ICP's specific pain point** — the headline should answer "why should THIS person care?"
- **Passes the swap test** — if you swap the headline between two ICPs and it still works for both, it's too generic
- **Scannable** — a stranger should get it in under 2 seconds

**What makes a bad headline:**
- Works for any product in the category (or worse, any product at all)
- Requires context to understand
- Uses abstract metaphors instead of concrete benefits

**Rules of thumb:**
- Numbers and specifics tend to outperform adjectives and abstractions
- Name the benefit, not the category
- Short is good, but clear beats short
- If the headline sounds like it could be a motivational poster, rethink it

#### Refining the Messaging

After the first draft of copy, pressure-test it:
1. Read each headline as if you're the ICP, mid-scroll, seeing this for the first time
2. Ask: "Would I stop? Do I immediately know what this is and why I should care?"
3. If the answer is no, rewrite. Don't get attached to clever phrasing that doesn't land.

The subline should reinforce the headline with proof — specs, numbers, concrete details. The headline hooks; the subline convinces.

### 5. Assemble the Campaign JSON

Combine everything into the campaign config file:

```
brand        — name, voice, color palette
product      — name, category, price, hero features, path to product JSON
icps[]       — array of customer personas, each with:
  id         — slug for filenames
  label      — human-readable name
  pain_points— what this customer struggles with
  copy       — headline, subline, cta (written in step 4)
  visual_treatment:
    background_mood  — text description of the scene for Gemini
    palette          — hex codes for bg, text, CTA colors
```

The `background_mood` should match the ICP's world — not just look nice, but feel like a place this person would recognize or aspire to. Always include "darker at top and bottom edges for text contrast" in the mood description so Gemini leaves room for the text overlay.

### 6. Run the Pipeline

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
  ├── Adds composition rules (product placement, empty zones for text)
  ├── Sends to Gemini 3.1 Flash Image Preview
  └── Returns a 1024x1024 product image

  Step B — Text Overlay (text_overlay.py)
  ├── Resizes background to 1080x1080
  ├── Creates a subtle gradient vignette (NOT a black bar — smooth ease curve)
  ├── Renders all text at 2x resolution for crisp anti-aliasing
  │   ├── Top zone: brand name, product title, tagline
  │   └── Bottom zone: headline, subline, CTA button
  ├── Downscales text layer to 1080x1080
  └── Composites: background + gradient + text = final ad
```

### 7. Validate the Output

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

**image_gen.py** — composition rules change per product type:
- Watches: product floating on invisible stand, band orientation rules, anti-hallucination constraints
- Cars: product on ground plane, heroic low camera angle, no license plates
- Other products: adjust placement zones, camera angle, and forbidden behaviors accordingly

**text_overlay.py** — typography should match the brand:
- Font choice and weights (match the brand's actual typeface as closely as possible)
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
