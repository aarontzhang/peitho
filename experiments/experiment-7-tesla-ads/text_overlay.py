"""
Experiment 7: Tesla-themed layered text overlay system.

Uses Helvetica Neue for Tesla's ultra-minimal aesthetic.
Thin/Light weights for brand name, Bold for headlines — high contrast, clean.
Text rendered at 2x resolution and downscaled for crisp anti-aliasing.

Layers output:
  - background: product image resized to 1080x1080
  - gradient: dark overlays for text zones (RGBA)
  - text: all text elements on transparent background (RGBA)
  - composite: final flattened result (RGB)
"""

from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/System/Library/Fonts/HelveticaNeue.ttc"
# Indices: 0=Regular, 1=Bold, 5=UltraLight, 7=Light, 10=Medium, 12=Thin

OUTPUT_SIZE = (1080, 1080)
SCALE = 2  # render text at 2x for crispness
RENDER_SIZE = (OUTPUT_SIZE[0] * SCALE, OUTPUT_SIZE[1] * SCALE)

# -------------------------------------------------------------------------
# Zone boundaries (at 1x — scaled up internally for rendering)
# Adjusted for automotive: car sits lower, so top zone can be taller
# -------------------------------------------------------------------------
TOP_ZONE = (0, 180)
PRODUCT_ZONE = (180, 780)
BOTTOM_ZONE = (780, 1065)

H_MARGIN = 80  # wider margins for that Tesla breathing room
MAX_TEXT_WIDTH = OUTPUT_SIZE[0] - 2 * H_MARGIN


def create_layers(bg: Image.Image, copy: dict, treatment: dict, brand: dict) -> dict:
    """
    Generate separate layers for compositing.

    Returns dict of PIL Images:
        'background'  — product bg resized to 1080x1080 (RGB)
        'gradient'    — dark zone overlays (RGBA, transparent elsewhere)
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
# Gradient layer
# ---------------------------------------------------------------------------

def _create_gradient_layer() -> Image.Image:
    """Dark overlays in text zones only. Transparent in product zone."""
    w, h = OUTPUT_SIZE
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    max_alpha = 220  # slightly more transparent than exp6 for elegance

    # Top zone: solid dark, smooth fade at bottom edge
    t_start, t_end = TOP_ZONE
    fade_start = t_end - int((t_end - t_start) * 0.30)
    for y in range(t_start, t_end):
        if y < fade_start:
            alpha = max_alpha
        else:
            progress = (y - fade_start) / (t_end - fade_start)
            alpha = int(max_alpha * (1 - progress ** 1.5))
        draw.rectangle([(0, y), (w, y + 1)], fill=(0, 0, 0, alpha))

    # Bottom zone: smooth fade at top edge, then solid dark
    b_start, b_end = BOTTOM_ZONE
    fade_end = b_start + int((b_end - b_start) * 0.22)
    for y in range(b_start, b_end):
        if y > fade_end:
            alpha = max_alpha
        else:
            progress = (y - b_start) / (fade_end - b_start)
            alpha = int(max_alpha * (progress ** 1.5))
        draw.rectangle([(0, y), (w, y + 1)], fill=(0, 0, 0, alpha))

    return layer


# ---------------------------------------------------------------------------
# Text layer (rendered at 2x, downscaled for crisp anti-aliasing)
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

    # --- TOP ZONE ---
    cursor_y = (TOP_ZONE[0] + 36) * S

    # Brand name — Tesla uses ultra-thin, widely spaced uppercase
    font_brand = ImageFont.truetype(FONT_PATH, 18 * S, index=7)  # Light
    brand_text = brand["name"].upper()
    _draw_centered_tracked(draw, brand_text, cursor_y, font_brand, primary, S, tracking=12 * S)
    cursor_y += _text_h(draw, brand_text, font_brand) + 22 * S

    # Product title — bold, clean
    if "product_title" in copy:
        font_title = ImageFont.truetype(FONT_PATH, 32 * S, index=1)  # Bold
        _draw_centered(draw, copy["product_title"], cursor_y, font_title, primary, S)
        cursor_y += _text_h(draw, copy["product_title"], font_title) + 12 * S

    # Tagline — light, subtle
    if "tagline" in copy:
        font_tag = ImageFont.truetype(FONT_PATH, 16 * S, index=7)  # Light
        _draw_centered(draw, copy["tagline"], cursor_y, font_tag, secondary, S)

    # --- BOTTOM ZONE ---
    cursor_y = (BOTTOM_ZONE[0] + 20) * S
    zone_end = BOTTOM_ZONE[1] * S

    # Headline — bold, impactful
    hl_font, hl_size = _fit_font(draw, copy["headline"], MAX_TEXT_WIDTH * S, 48 * S, 28 * S, index=1)
    _draw_centered_ml(draw, copy["headline"], cursor_y, hl_font, primary, hl_size, S)
    cursor_y += _ml_height(copy["headline"], hl_size) + 18 * S

    # Subline — light weight for contrast
    if cursor_y < zone_end - 90 * S:
        sub_font, sub_size = _fit_font(draw, copy["subline"], MAX_TEXT_WIDTH * S, 17 * S, 13 * S, index=7)
        _draw_centered_ml(draw, copy["subline"], cursor_y, sub_font, secondary, sub_size, S)
        cursor_y += _ml_height(copy["subline"], sub_size) + 22 * S

    # CTA button — minimal, clean
    if cursor_y < zone_end - 50 * S:
        _draw_cta(draw, copy["cta"], cursor_y, cta_bg, cta_text, S)

    # Downscale to 1080x1080 for crisp result
    return canvas.resize(OUTPUT_SIZE, Image.LANCZOS)


# ---------------------------------------------------------------------------
# Drawing primitives
# ---------------------------------------------------------------------------

def _text_h(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[3] - bbox[1]


def _fit_font(draw, text, max_w, start, minimum, index=1):
    size = start
    while size > minimum:
        font = ImageFont.truetype(FONT_PATH, size, index=index)
        widths = [draw.textbbox((0, 0), ln, font=font)[2] for ln in text.split("\n")]
        if max(widths) <= max_w:
            return font, size
        size -= 2
    return ImageFont.truetype(FONT_PATH, minimum, index=index), minimum


def _draw_centered(draw, text, y, font, fill, S):
    w = draw.textbbox((0, 0), text, font=font)[2]
    x = (RENDER_SIZE[0] - w) // 2
    draw.text((x, y), text, font=font, fill=fill)


def _draw_centered_tracked(draw, text, y, font, fill, S, tracking=0):
    """Draw centered text with letter-spacing (tracking)."""
    # Calculate total width with tracking
    total_w = 0
    for i, ch in enumerate(text):
        cw = draw.textbbox((0, 0), ch, font=font)[2]
        total_w += cw + (tracking if i < len(text) - 1 else 0)

    x = (RENDER_SIZE[0] - total_w) // 2
    for i, ch in enumerate(text):
        draw.text((x, y), ch, font=font, fill=fill)
        cw = draw.textbbox((0, 0), ch, font=font)[2]
        x += cw + (tracking if i < len(text) - 1 else 0)


def _draw_centered_ml(draw, text, y, font, fill, font_size, S):
    line_h = int(font_size * 1.3)  # slightly more line spacing for Tesla's airy feel
    for line in text.split("\n"):
        lw = draw.textbbox((0, 0), line, font=font)[2]
        x = (RENDER_SIZE[0] - lw) // 2
        draw.text((x, y), line, font=font, fill=fill)
        y += line_h


def _ml_height(text, font_size):
    return int(font_size * 1.3) * len(text.split("\n"))


def _draw_cta(draw, text, y, bg_color, text_color, S):
    font = ImageFont.truetype(FONT_PATH, 18 * S, index=10)  # Medium
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    px, py = 36 * S, 14 * S
    bw = tw + px * 2
    bh = th + py * 2
    bx = (RENDER_SIZE[0] - bw) // 2

    # Tesla-style: very subtle rounded corners, almost pill-shaped
    draw.rounded_rectangle(
        [(bx, y), (bx + bw, y + bh)],
        radius=6 * S,
        fill=_hex(bg_color),
    )
    draw.text((bx + px, y + py), text, font=font, fill=_hex(text_color))


def _hex(color: str) -> tuple:
    c = color.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
