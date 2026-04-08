"""
Experiment 8: Gatorade-themed layered text overlay system.

LAYOUT: Side-by-side — text on the LEFT, bottle on the RIGHT.
The bottle is a tall vertical product, so top/bottom text zones would
squeeze it awkwardly. Instead, all copy is stacked vertically on the
left ~45% of the frame, and the bottle occupies the right ~55%.

Uses Futura for Gatorade's bold, athletic aesthetic.
Condensed ExtraBold for headlines, Bold for brand name, Medium for sublines.
Text rendered at 2x resolution and downscaled for crisp anti-aliasing.

Layers output:
  - background: product image resized to 1080x1080
  - gradient: dark overlay on LEFT side for text readability (RGBA)
  - text: all text on transparent background (RGBA)
  - composite: final flattened result (RGB)
"""

from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/System/Library/Fonts/Supplemental/Futura.ttc"
# Indices: 0=Medium, 1=Medium Italic, 2=Bold, 3=Condensed Medium, 4=Condensed ExtraBold

OUTPUT_SIZE = (1080, 1080)
SCALE = 2  # render text at 2x for crispness
RENDER_SIZE = (OUTPUT_SIZE[0] * SCALE, OUTPUT_SIZE[1] * SCALE)

# -------------------------------------------------------------------------
# Zone boundaries (at 1x) — LEFT-SIDE text layout
# All text lives in the left ~45% of the frame
# -------------------------------------------------------------------------
TEXT_LEFT = 60          # left margin
TEXT_RIGHT = 470        # right edge of text zone (~43% of 1080)
TEXT_WIDTH = TEXT_RIGHT - TEXT_LEFT  # usable text width

# Vertical regions within the left text zone
BRAND_TOP = 80          # brand name starts here
HEADLINE_TOP = 400      # headline starts roughly in the vertical middle
CTA_BOTTOM = 1000       # CTA should not go past this


def create_layers(bg: Image.Image, copy: dict, treatment: dict, brand: dict) -> dict:
    """
    Generate separate layers for compositing.

    Returns dict of PIL Images:
        'background'  — product bg resized to 1080x1080 (RGB)
        'gradient'    — dark left-side overlay (RGBA, transparent elsewhere)
        'text'        — all text on transparent bg (RGBA)
        'composite'   — final flattened ad (RGB)
    """
    p = treatment["palette"]

    # --- Background layer ---
    background = bg.copy()
    if background.size != OUTPUT_SIZE:
        background = background.resize(OUTPUT_SIZE, Image.LANCZOS)
    if background.mode != "RGBA":
        background = background.convert("RGBA")

    # --- Gradient layer ---
    gradient = _create_gradient_layer()

    # --- Text layer (rendered at 2x, then downscaled) ---
    text_layer = _create_text_layer(copy, p, brand)

    # --- Composite ---
    composite = Image.alpha_composite(background, gradient)
    composite = Image.alpha_composite(composite, text_layer)

    return {
        "background": background.convert("RGB"),
        "gradient": gradient,
        "text": text_layer,
        "composite": composite.convert("RGB"),
    }


# ---------------------------------------------------------------------------
# Gradient layer — left-side vignette
# ---------------------------------------------------------------------------

def _create_gradient_layer() -> Image.Image:
    """Dark overlay on the LEFT side of the frame for text readability.

    Strongest at the left edge, fading to transparent as it approaches
    the text zone boundary. Uses an ease-out curve for a natural look.
    """
    w, h = OUTPUT_SIZE
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    peak_alpha = 170
    fade_end = TEXT_RIGHT + 60  # gradient extends slightly past text zone

    for x in range(0, fade_end):
        progress = x / fade_end  # 0 at left edge, 1 at fade boundary
        alpha = int(peak_alpha * (1 - progress) ** 1.5)  # ease-out
        draw.rectangle([(x, 0), (x + 1, h)], fill=(0, 0, 0, alpha))

    return layer


# ---------------------------------------------------------------------------
# Text layer — left-aligned, stacked vertically
# ---------------------------------------------------------------------------

def _create_text_layer(copy: dict, palette: dict, brand: dict) -> Image.Image:
    """Render all text at 2x on a transparent canvas, then downscale to 1080."""
    S = SCALE
    canvas = Image.new("RGBA", RENDER_SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    primary = _hex(palette["text_primary"])
    secondary = _hex(palette["text_secondary"])
    cta_bg = palette["cta_bg"]
    cta_text = palette["cta_text"]

    max_w = TEXT_WIDTH * S
    left_x = TEXT_LEFT * S

    # --- BRAND SECTION (top of left zone) ---
    cursor_y = BRAND_TOP * S

    # Brand name — Bold, uppercase with moderate tracking
    font_brand = ImageFont.truetype(FONT_PATH, 20 * S, index=2)  # Bold
    brand_text = brand["name"].upper()
    _draw_left_tracked(draw, brand_text, left_x, cursor_y, font_brand, primary, tracking=7 * S)
    cursor_y += _text_h(draw, brand_text, font_brand) + 16 * S

    # Product title — Condensed ExtraBold
    if "product_title" in copy:
        font_title = ImageFont.truetype(FONT_PATH, 32 * S, index=4)  # Condensed ExtraBold
        draw.text((left_x, cursor_y), copy["product_title"], font=font_title, fill=primary)
        cursor_y += _text_h(draw, copy["product_title"], font_title) + 8 * S

    # Tagline — Medium, understated
    if "tagline" in copy:
        font_tag = ImageFont.truetype(FONT_PATH, 14 * S, index=0)  # Medium
        draw.text((left_x, cursor_y), copy["tagline"], font=font_tag, fill=secondary)

    # --- HEADLINE SECTION (middle of left zone) ---
    cursor_y = HEADLINE_TOP * S

    # Headline — Condensed ExtraBold, maximum impact
    hl_font, hl_size = _fit_font(draw, copy["headline"], max_w, 48 * S, 28 * S, index=4)
    _draw_left_ml(draw, copy["headline"], left_x, cursor_y, hl_font, primary, hl_size)
    cursor_y += _ml_height(copy["headline"], hl_size) + 16 * S

    # Subline — Medium weight
    if cursor_y < CTA_BOTTOM * S - 90 * S:
        sub_font, sub_size = _fit_font(draw, copy["subline"], max_w, 16 * S, 12 * S, index=0)
        _draw_left_ml(draw, copy["subline"], left_x, cursor_y, sub_font, secondary, sub_size)
        cursor_y += _ml_height(copy["subline"], sub_size) + 22 * S

    # CTA button — Bold, left-aligned
    if cursor_y < CTA_BOTTOM * S:
        _draw_cta(draw, copy["cta"], left_x, cursor_y, cta_bg, cta_text, S)

    # Downscale to 1080x1080 for crisp result
    return canvas.resize(OUTPUT_SIZE, Image.LANCZOS)


# ---------------------------------------------------------------------------
# Drawing primitives
# ---------------------------------------------------------------------------

def _text_h(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[3] - bbox[1]


def _fit_font(draw, text, max_w, start, minimum, index=4):
    size = start
    while size > minimum:
        font = ImageFont.truetype(FONT_PATH, size, index=index)
        widths = [draw.textbbox((0, 0), ln, font=font)[2] for ln in text.split("\n")]
        if max(widths) <= max_w:
            return font, size
        size -= 2
    return ImageFont.truetype(FONT_PATH, minimum, index=index), minimum


def _draw_left_tracked(draw, text, x, y, font, fill, tracking=0):
    """Draw left-aligned text with letter-spacing (tracking)."""
    for i, ch in enumerate(text):
        draw.text((x, y), ch, font=font, fill=fill)
        cw = draw.textbbox((0, 0), ch, font=font)[2]
        x += cw + (tracking if i < len(text) - 1 else 0)


def _draw_left_ml(draw, text, x, y, font, fill, font_size):
    """Draw left-aligned multiline text."""
    line_h = int(font_size * 1.2)
    for line in text.split("\n"):
        draw.text((x, y), line, font=font, fill=fill)
        y += line_h


def _ml_height(text, font_size):
    return int(font_size * 1.2) * len(text.split("\n"))


def _draw_cta(draw, text, left_x, y, bg_color, text_color, S):
    """Draw a left-aligned CTA button."""
    font = ImageFont.truetype(FONT_PATH, 16 * S, index=2)  # Bold
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    px, py = 30 * S, 12 * S
    bw = tw + px * 2
    bh = th + py * 2

    draw.rounded_rectangle(
        [(left_x, y), (left_x + bw, y + bh)],
        radius=8 * S,
        fill=_hex(bg_color),
    )
    draw.text((left_x + px, y + py), text, font=font, fill=_hex(text_color))


def _hex(color: str) -> tuple:
    c = color.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
