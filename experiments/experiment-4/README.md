# Experiment 4 — 25-Poster Ad Gallery (5 Brands x 5 Ads)

## Context

Peitho's core thesis: persona-driven creative outperforms generic ads. Experiments 1-3 proved the pipeline (Stripe video, Apple campaign, Figma posters). Experiment 4 creates a polished, self-contained HTML gallery showcasing 25 poster-style ads across 5 real brands, each targeting a distinct persona/agent ID. This is a visual proof-of-concept that demonstrates Peitho's output quality.

## Output

**Single file:** `experiments/experiment-4/index.html` — open in browser, no build step.

## Viewer UI

- Dark background (`#07080A`), sidebar (`#0E1014`, ~320px)
- **Brand tabs** (vertical): Apple, Tesla, Airbnb, Glossier, Spotify — each with a colored accent dot
- **5 numbered circle buttons** to switch ads within a brand
- **Persona panel** (collapsible) showing agent ID, role, segment, hook for the current ad
- **Ad canvas**: 1080x1080px centered, scaled via `transform: scale()` to fit viewport
- Crossfade transitions between ads
- Keyboard: 1-5 for ads, Up/Down for brands
- Viewer fonts: DM Sans + JetBrains Mono

## Brand Design System (5 distinct treatments)

| Brand | Font | Palette | Style |
|-------|------|---------|-------|
| Apple | Outfit (300/400/600/800) | Black, white, `#0071E3` blue, `#BF5AF2` purple, Aurora gradient | Ultra-clean minimalism, massive whitespace, product as hero |
| Tesla | Space Grotesk (300/400/500/700) | Black, white, `#E82127` red, `#393C41` gray | Dark futuristic, spec grids, precision, minimal |
| Airbnb | Plus Jakarta Sans (400-800) | `#FF5A5F` coral, `#00A699` teal, `#FC642D` orange, white | Warm, human, travel photography, coral accents |
| Glossier | Syne (400-800) | `#F5C6C6` pink, `#FFF0F0` light pink, `#2D2D2D` dark text, `#C2185B` rose | Soft pastels, dewy, editorial minimalism |
| Spotify | Bricolage Grotesque (400-800) | `#1DB954` green, `#191414` black, coral, lavender | Dark + vibrant color bursts, duotone, Wrapped energy |

## Logos

All 5 brand logos as inline SVGs embedded in JS data objects (no external dependencies). Glossier uses styled text (Syne 800, all-caps).

## Backgrounds

- Mostly **CSS-only** (gradients, noise textures via SVG data URIs, geometric pseudo-elements)
- **Unsplash photos** for ~4-6 ads (Airbnb travel, Tesla roads) with CSS gradient fallbacks
- SVG grain overlay for tactile depth (reuse pattern from comparison.html)

## 25 Personas & Ads

### Apple
1. **creative-pro** — "Your ideas. Now with a collaborator." / Dark mode, centered, Aurora gradient accent
2. **college-student** — "GPT-4 power. Zero subscriptions." / Light mode, bottom-stack, blue CTA pill
3. **privacy-advocate** — "Your data never leaves your device." / Full Aurora gradient bg, white text
4. **enterprise-it** — "Managed. Auditable. On-device." / Editorial split, dark left / gradient right
5. **small-biz-owner** — "Reply to 40 emails in 10 minutes." / Minimal dark, floating purple accent orb

### Tesla
1. **early-adopter** — "0-60 in 1.99s. Over the air." / Dark bg, spec grid layout
2. **eco-conscious** — "340 miles. Zero emissions. Full lifecycle." / Road photo bg with overlay
3. **luxury-buyer** — "The only car that improves overnight." / Split: white panel left, dark gradient right
4. **performance-enthusiast** — "1,020 hp. Instant. Every time." / Minimal dark, large red accent line
5. **family-safety** — "5 stars. Every category. Every test." / Gradient dark-to-gray, centered editorial

### Airbnb
1. **adventure-traveler** — "Stay where the locals actually go." / Travel photo with coral gradient overlay
2. **digital-nomad** — "Your office is wherever you unpack." / Solid coral bg, centered white text
3. **family-vacationer** — "A whole house. Not a hotel room." / Split: photo right, white panel left
4. **budget-explorer** — "Split a villa. Cheaper than two rooms." / Teal accent bg, floating stats
5. **experience-seeker** — "Dinner cooked by someone's grandmother." / Nature photo, dark overlay, bottom-stack

### Glossier
1. **gen-z-skincare** — "Three products. That's it." / Full blush-pink bg, dark text, accent circle
2. **minimalist-beauty** — "Skin first. Makeup maybe." / White bg, bottom-stack, rose CTA
3. **social-creator** — "Looks like skin, not product." / Split: pink gradient left, white right
4. **self-care-advocate** — "Five minutes that are actually yours." / Soft dewy photo bg, white overlay
5. **clean-beauty-convert** — "What's not in it matters most." / Deep rose accent band, white below

### Spotify
1. **music-discovery** — "The song you didn't know you needed." / Dark bg, green+pink gradient blobs
2. **podcast-enthusiast** — "5 million podcasts. Zero dead air." / Solid Spotify-green bg, black text
3. **social-sharer** — "Your year. Your taste. Your identity." / Duotone purple-to-coral gradient
4. **workout-mood** — "180 BPM when you need it." / Dark editorial, green accent line
5. **indie-underground** — "100K artists uploaded this week." / Wrapped-style vibrant multi-gradient

## Implementation Steps

1. **Create directory** — `experiments/experiment-4/`
2. **Build HTML skeleton** — fonts (7 families via Google Fonts), viewer shell CSS, responsive scaling
3. **Build viewer JS** — brand tabs, ad buttons, persona panel, navigation, state management
4. **Define brand configs** — colors, fonts, inline SVG logos per brand
5. **Define 25 ad data objects** — persona metadata + headline + subline + CTA + layout variant + bg config
6. **Build ad renderers** — per-brand render functions applying distinct visual treatments
7. **Polish** — transitions, grain textures, accent elements, keyboard shortcuts, fallbacks

## Key Reference Files
- `experiments/experiment-2-mvp/pipeline/templates/ad.html` — base ad structure
- `experiments/experiment-2-mvp/pipeline/templates/DESIGN_SYSTEM.md` — overlay strategies, layout templates
- `experiments/experiment-2-mvp/campaigns/apple.mjs` — persona schema reference

## Verification
1. Open in Chrome, cycle through all 25 ads — each visually distinct
2. Brand consistency: same font/palette/logo within a brand, varied layouts
3. DevTools font check: correct Google Font applied per brand (no system fallback)
4. Resize window 1920px -> 1280px — ad scales smoothly
5. Disable network — Unsplash ads show gradient fallbacks
6. Persona panel shows correct metadata for each ad
7. Keyboard nav works (1-5, Up/Down)
8. No generic aesthetics: no Inter, no purple-gradient-on-white, no cookie-cutter layouts
