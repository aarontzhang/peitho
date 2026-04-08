# Peitho Design System

Design rules for ad generation, informed by Obrazur Brands (Behance) and Awwwards collections.
Referenced by `generate.mjs` (Gemini prompts) and `render.mjs` (text compositing).

---

## 1. Background Generation (Nano Banana / Gemini)

### Style Presets

Each campaign should pick ONE primary style. Gemini prompts should include the preset name and its constraints.

| Preset | Description | When to use |
|--------|-------------|-------------|
| `bold-solid` | Single saturated color with subtle texture/noise. No photos, no gradients. Think SkillShift yellow, Setience red. | Product launches, bold CTAs, high-energy campaigns |
| `organic-gradient` | Smooth flowing gradient with soft organic curves. Think Foremark's peach waves. | Lifestyle, wellness, premium/luxury brands |
| `dark-atmospheric` | Moody dark photography or abstract dark scene. Think Aerotech's architectural shots. | Enterprise B2B, security, dev tools |
| `3d-abstract` | Rendered 3D shapes or figures on a gradient. Think Solitone's purple figure. | Tech, AI, creative tools, future-forward brands |
| `editorial-clean` | Flat background with geometric accent shapes. Think Moverunion's black + orange blocks. | Professional services, logistics, fintech |
| `photo-composite` | Photography with strong color treatment (duotone, overlay). Think Flaren's purple-tinted portrait. | Consumer products, social-first campaigns |

### Gemini Prompt Rules

When constructing the image prompt, enforce these constraints:

```
BACKGROUND RULES:
- Maximum 2-3 colors total. Never muddy or busy.
- Leave at least 40% of the image as "quiet space" where text can sit.
- No text, words, letters, symbols, or watermarks in the image.
- No centered focal points — push visual interest to edges/corners so text has room.
- High contrast between the dominant background tone and white (for text readability).
```

### Color Discipline

Per-campaign, define exactly:
- **1 background color** (the dominant tone — dark, light, or saturated)
- **1 accent color** (used sparingly — geometric shapes, CTA buttons, highlights)
- **1 neutral** (white or black, for text)

Do NOT tell Gemini to "use these colors subtly." Be explicit:
```
Background fill: [exact hex]. 
Accent element color: [exact hex]. 
No other colors allowed.
```

---

## 2. Layout Templates

### Available Layouts

The renderer should select a layout based on platform format and campaign style.

#### `bottom-stack` (default for feed ads)
```
┌──────────────────────┐
│                      │
│     [background]     │
│                      │
│                      │
│  Brand               │
│  ━━━━━━━━━━━━━━━━━   │
│  Headline            │
│  Body text           │
│  [CTA]               │
└──────────────────────┘
```
- Text anchored to bottom-left
- Padding: 60px
- Headline max-width: 85%
- Body max-width: 75%
- Dark gradient overlay: 10% top -> 75% bottom

#### `center-stack` (for story formats + bold campaigns)
```
┌──────────────────────┐
│                      │
│                      │
│       Headline       │
│       Body text      │
│        [CTA]         │
│                      │
│                      │
└──────────────────────┘
```
- Everything centered vertically and horizontally
- Padding: 80px horizontal, auto vertical
- Headline max-width: 90%
- Use with `bold-solid` or `organic-gradient` presets (no overlay needed if background is a single color)

#### `split-left` (for wide formats: LinkedIn, display, newsletter)
```
┌────────────┬─────────────┐
│            │             │
│  Headline  │  [background │
│  Body      │   visual]   │
│  [CTA]     │             │
│            │             │
└────────────┴─────────────┘
```
- Left 45% is a solid color panel with text
- Right 55% is the Gemini-generated background
- No overlay needed — text sits on solid color
- Good for ads where the visual is a product shot or photo

#### `top-brand` (editorial/premium feel)
```
┌──────────────────────┐
│  Brand     [accent]  │
│                      │
│                      │
│                      │
│  Headline            │
│                      │
│  Body text    [CTA]  │
└──────────────────────┘
```
- Brand top-left, small accent shape top-right
- Headline middle-left, large (64px+)
- Body and CTA bottom, spread across width
- Sparse layout — lots of breathing room
- Works best with `dark-atmospheric` or `editorial-clean`

---

## 3. Typography Rules

### Hierarchy

| Element | Weight | Size | Letter Spacing | Color |
|---------|--------|------|----------------|-------|
| Brand | 600 | 16-18px | -0.02em | white @ 70% opacity |
| Headline | 800-900 | 48-64px (scale with canvas) | -0.03em | white @ 100% |
| Body | 400 | 18-22px | 0 | white @ 80% opacity |
| CTA | 600 | 16-18px | -0.01em | white on accent color |

### Sizing by Canvas Width

| Canvas Width | Headline | Body | CTA |
|-------------|----------|------|-----|
| 600px (newsletter) | 36px | 16px | 14px |
| 1080px (Instagram) | 52px | 20px | 17px |
| 1200px+ (LinkedIn, display) | 56px | 22px | 18px |
| 1920px (YouTube, CTV) | 64px | 26px | 20px |

### Font Stack

Primary: `Inter` (already loaded via Google Fonts)
Fallback: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`

### Line Heights

- Headline: `1.05` (tight — headlines should feel punchy)
- Body: `1.5` (readable)
- CTA: `1.0`

---

## 4. Overlay Rules

The dark gradient overlay ensures text readability. But it should adapt:

| Background Preset | Overlay Strategy |
|-------------------|-----------------|
| `bold-solid` | **No overlay** if text contrast ratio > 4.5:1 against the solid color. Otherwise thin 20% overlay. |
| `organic-gradient` | Light overlay: 5% top -> 50% bottom |
| `dark-atmospheric` | Standard overlay: 10% top -> 75% bottom |
| `3d-abstract` | Standard overlay: 10% top -> 75% bottom |
| `editorial-clean` | **No overlay** — background is already designed for text |
| `photo-composite` | Heavy overlay: 20% top -> 85% bottom |

For `split-left` layout: **no overlay on the text panel side** (it's a solid color).

---

## 5. CTA Styling

### Button CTA (default)
```css
padding: 14px 28px;
border-radius: 980px;       /* pill shape */
background: [accent color];
color: #FFFFFF;
font-weight: 600;
```

### Text-Link CTA
```css
background: none;
color: [accent color];
font-weight: 600;
/* append → arrow */
```

### Platform-Specific CTA Rules

| Platform | Style | Notes |
|----------|-------|-------|
| Instagram Feed | Button | Short, action-oriented (3-4 words) |
| Instagram Story | Swipe-up text | "Swipe up" or custom, no button |
| LinkedIn | Button | Professional tone, can be longer |
| Reddit | Text-link | Buttons feel too ad-like on Reddit |
| Newsletter | Text-link | Blend with editorial content |
| Display/Banner | Button | High contrast, urgent |

---

## 6. Safe Zones & Text Placement

Gemini backgrounds should leave quiet areas for text. The prompt should specify WHERE the quiet zone is based on the selected layout.

### Quiet Zone Mapping

| Layout | Quiet Zone | Tell Gemini |
|--------|-----------|-------------|
| `bottom-stack` | Bottom 45% | "Keep visual interest in the top half. The bottom should be darker or less detailed." |
| `center-stack` | Center 60% | "Push visual elements to the edges and corners. Center should be relatively clear." |
| `split-left` | Left 45% | "All visual elements on the right side only. Left side is empty." |
| `top-brand` | Bottom 40% + top 15% | "Visual interest in the middle band. Top and bottom should be clean." |

---

## 7. Platform-Layout Mapping

Default layout selection per platform. Can be overridden by campaign config.

| Platform | Default Layout | Reasoning |
|----------|---------------|-----------|
| Instagram Feed | `bottom-stack` | Familiar feed pattern, thumb-friendly CTA |
| Instagram Story | `center-stack` | Full-screen immersive, centered for quick scan |
| LinkedIn | `bottom-stack` or `split-left` | Professional, editorial feel |
| Meta/Facebook | `bottom-stack` | Standard feed pattern |
| Reddit | `bottom-stack` | Blends with content posts |
| Newsletter | `split-left` | Editorial layout matches email context |
| Google Display | `center-stack` | Small format, needs centered impact |
| Trade Publication | `split-left` | Professional, information-dense |
| YouTube Pre-Roll | `center-stack` | Full-screen, centered title card |
| Connected TV | `center-stack` | Living room viewing, centered |

---

## 8. Design Anti-Patterns

Things to explicitly avoid:

- **Gradient soup**: More than 3 colors blending together
- **Centered focal point in background**: Competes with text overlay
- **Thin/light headline weight**: Headlines should always be 800+ weight
- **Text on busy areas**: If overlay can't make text readable, the background is wrong
- **Generic stock photo feel**: Gemini should produce abstract/atmospheric, not "business people shaking hands"
- **Overly literal visuals**: If selling security software, don't generate a padlock. Generate atmosphere (dark, structured, precise)
- **Small CTA buttons**: CTA should be clearly tappable/clickable, minimum 44px touch target
- **Crowded layouts**: When in doubt, remove elements. Whitespace > clutter
