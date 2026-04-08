# Peitho Ad Pipeline — How It Works

This is the process Claude follows to generate a full set of personalized ads for a brand. The pipeline takes a brand name and produces multiple ad creatives, each tailored to a different simulated customer persona (ICP).

---

## The Pipeline (Step by Step)

### 1. Research the Brand

Go online and study the brand's visual identity:
- Find official product images (press photos, hero shots)
- Note the brand's color palette, typography style, and overall aesthetic
- Understand the product's key specs and selling points
- Save reference images locally for visual grounding

**Example:** For Tesla, we found Model S press photos on EVKX.net, noted the ultra-minimal design language (no grille, clean surfaces), and identified the color palette (black, white, red #E82127).

### 2. Create the Product JSON

Write a detailed product specification file (`<product>.json`) that describes the product's physical appearance for the image generator. This is the equivalent of a creative brief for a photographer.

Include:
- **Physical form** — shape, dimensions, materials, key design details
- **Color palette** — hex codes for every visible color and where each is used
- **Rendering instructions** — camera angle, lighting setup, depth of field
- **Prompt templates** — base prompts and style variations

The more specific this JSON is, the more accurate Gemini's output will be. Describe what the product actually looks like, not what you wish it looked like.

**File:** `tesla_model_s.json`

### 3. Create the Campaign JSON

This is the core creative file. It defines the brand voice, product info, and — most importantly — the ICPs (Ideal Customer Profiles).

**File:** `campaigns/tesla.json`

#### Structure:

```
brand        — name, voice, color palette
product      — name, category, price, hero features, path to product JSON
icps[]       — array of customer personas, each with:
  id         — slug for filenames (e.g., "performance-purist")
  label      — human-readable name
  pain_points— what this customer struggles with (informs the copy)
  copy       — the actual ad text:
    product_title  — e.g., "MODEL S PLAID"
    tagline        — e.g., "Electric Performance Sedan"
    headline       — the big text (1-2 lines)
    subline        — supporting detail (specs, benefits)
    cta            — button text
  visual_treatment — mood and colors for this persona's ad:
    background_mood  — text description of the scene for Gemini
    palette          — hex codes for bg, text, CTA colors
```

#### Writing Good Headlines

This is the most important part. Headlines should be:

- **Concrete and specific** — lead with a real number, a real benefit, or a real contrast
- **Immediately clear** — a stranger should understand it in under 2 seconds
- **Tied to the ICP's pain point** — the headline should answer "why should THIS person care?"

| Quality | Headline | Why |
|---------|----------|-----|
| Great | "1.99 SECONDS." | Specific, dramatic, instantly understood |
| Great | "ZERO EMISSIONS. ZERO COMPROMISE." | Clear contrast, addresses the eco buyer's fear of sacrifice |
| Bad | "THE SOFTWARE IS THE CAR." | Ambiguous — what does this mean to someone scrolling? |
| Bad | "SILENCE IS POWER." | Vague — could be a yoga ad |

**Rules of thumb:**
- If the headline works for a different product, it's too generic
- Numbers beat adjectives ("1,020 HP" > "INCREDIBLY POWERFUL")
- Name the benefit, not the category ("396 MILES. NO GAS STATION." > "ELECTRIC DRIVING")
- Short is good, but clear beats short

### 4. Run the Pipeline

```bash
cd experiments/experiment-7-tesla-ads
export GEMINI_API_KEY="your-key"
python3 generate.py campaigns/tesla.json
```

**What happens under the hood:**

```
For each ICP:

  Step A — Image Generation (image_gen.py)
  ├── Embeds the full product JSON into a Gemini prompt
  ├── Adds the ICP's background_mood and accent color
  ├── Adds composition rules (car placement, empty zones for text)
  ├── Sends to Gemini 3.1 Flash Image Preview
  └── Returns a 1024x1024 product image

  Step B — Text Overlay (text_overlay.py)
  ├── Resizes background to 1080x1080
  ├── Creates a subtle gradient vignette (NOT a black bar)
  ├── Renders all text at 2x resolution for crisp anti-aliasing
  │   ├── Top zone: brand name (letter-spaced), product title, tagline
  │   └── Bottom zone: headline, subline, CTA button
  ├── Downscales text layer to 1080x1080
  └── Composites: background + gradient + text = final ad
```

### 5. Check the Output

Each ICP produces 5 files:

| File | What it is |
|------|------------|
| `{icp}_prompt.txt` | The exact Gemini prompt used (for debugging) |
| `{icp}_bg.png` | Raw background image from Gemini |
| `{icp}_gradient.png` | The vignette overlay layer |
| `{icp}_text.png` | Text layer on transparent background |
| `{icp}_ad.png` | Final composited ad (this is the deliverable) |

The separate layers let you swap or edit components independently (e.g., try a different background with the same text, or adjust text without re-generating the image).

**Validation checklist:**
- [ ] Car/product is fully visible and not clipped by text zones
- [ ] Headline is readable at thumbnail size
- [ ] Subline is legible (bump font size if not)
- [ ] CTA button has enough contrast against background
- [ ] No Gemini hallucinations (wrong product, extra objects, text baked into image)
- [ ] Gradient blends smoothly — no visible black bars or hard edges
- [ ] Overall feel matches the brand's aesthetic

---

## Adapting for a New Brand

To run this pipeline for a different company:

1. **Find reference imagery** online for the product
2. **Create `<product>.json`** describing the product's physical appearance
3. **Create `campaigns/<brand>.json`** with:
   - Brand identity (voice, colors)
   - Product info + path to product JSON
   - 3-5 ICPs with tailored copy and visual treatments
4. **Adjust `image_gen.py`** if the product category is very different (e.g., the watch pipeline had band-orientation rules; the car pipeline has ground-plane rules)
5. **Adjust `text_overlay.py`** for brand-appropriate typography:
   - Font choice and weights
   - Margins and spacing
   - Letter-spacing for brand name
   - CTA button style
6. **Run:** `python3 generate.py campaigns/<brand>.json`

---

## File Structure

```
experiment-7-tesla-ads/
├── campaigns/
│   └── tesla.json              # Campaign config (brand + ICPs + copy)
├── tesla_model_s.json          # Product spec (physical description for Gemini)
├── generate.py                 # Orchestrator — loads config, runs pipeline
├── image_gen.py                # Gemini API integration
├── text_overlay.py             # Layered text composition
├── reference_model_s.webp      # Reference image from web (not used in pipeline)
├── reference_exterior.webp     # Reference image from web (not used in pipeline)
└── output/
    └── tesla_20260408-135133/  # Timestamped output
        ├── campaign.json       # Config snapshot
        ├── {icp}_prompt.txt    # Gemini prompt used
        ├── {icp}_bg.png        # Raw Gemini image
        ├── {icp}_gradient.png  # Vignette layer
        ├── {icp}_text.png      # Text layer
        └── {icp}_ad.png        # Final composite
```

## Dependencies

- Python 3.10+
- `Pillow` (PIL) — image processing
- `requests` — Gemini API calls
- `GEMINI_API_KEY` environment variable
- macOS system fonts (Helvetica Neue for Tesla; Avenir Next for Garmin in Experiment 6)
