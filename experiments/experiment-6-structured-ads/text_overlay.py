"""
Experiment 6: Layered text overlay system.

Outputs separate transparent PNG layers so each element can be edited independently.
Text is rendered at 2x resolution and downscaled for crisp anti-aliasing.

Layers output:
  - background: product image resized to 1080x1080
  - gradient: dark overlays for text zones (RGBA)
  - text: all text elements on transparent background (RGBA)
  - composite: final flattened result (RGB)
"""

from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/System/Library/Fonts/Avenir Next.ttc"
# Indices: 0=Bold, 2=DemiBold, 5=Medium, 7=Regular, 8=Heavy

OUTPUT_SIZE = (1080, 1080)
SCALE = 2  # render text at 2x for crispness
RENDER_SIZE = (OUTPUT_SIZE[0] * SCALE, OUTPUT_SIZE[1] * SCALE)

# -------------------------------------------------------------------------
# Zone boundaries (at 1x — scaled up internally for rendering)
# -------------------------------------------------------------------------
TOP_ZONE = (0, 170)
PRODUCT_ZONE = (170, 770)
BOTTOM_ZONE = (770, 1065)

H_MARGIN = 60
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


# Legacy API — drop-in replacement for experiment 5 callers
def overlay_text(bg: Image.Image, copy: dict, treatment: dict, brand: dict) -> Image.Image:
    return create_layers(bg, copy, treatment, brand)["composite"]


# ---------------------------------------------------------------------------
# Gradient layer
# ---------------------------------------------------------------------------

def _create_gradient_layer() -> Image.Image:
    """Strong dark overlays in text zones only. Transparent in product zone."""
    w, h = OUTPUT_SIZE
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    max_alpha = 235

    # Top zone: solid dark, short fade at bottom edge
    t_start, t_end = TOP_ZONE
    fade_start = t_end - int((t_end - t_start) * 0.25)
    for y in range(t_start, t_end):
        if y < fade_start:
            alpha = max_alpha
        else:
            progress = (y - fade_start) / (t_end - fade_start)
            alpha = int(max_alpha * (1 - progress ** 1.5))
        draw.rectangle([(0, y), (w, y + 1)], fill=(0, 0, 0, alpha))

    # Bottom zone: short fade at top edge, then solid dark
    b_start, b_end = BOTTOM_ZONE
    fade_end = b_start + int((b_end - b_start) * 0.20)
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
    cursor_y = (TOP_ZONE[0] + 32) * S

    # Brand name
    font_brand = ImageFont.truetype(FONT_PATH, 24 * S, index=0)
    brand_text = brand["name"].upper()
    _draw_centered(draw, brand_text, cursor_y, font_brand, primary, S)
    cursor_y += _text_h(draw, brand_text, font_brand) + 18 * S

    # Product title
    if "product_title" in copy:
        font_title = ImageFont.truetype(FONT_PATH, 38 * S, index=8)
        _draw_centered(draw, copy["product_title"], cursor_y, font_title, primary, S)
        cursor_y += _text_h(draw, copy["product_title"], font_title) + 14 * S

    # Tagline
    if "tagline" in copy:
        font_tag = ImageFont.truetype(FONT_PATH, 20 * S, index=5)
        _draw_centered(draw, copy["tagline"], cursor_y, font_tag, secondary, S)

    # --- BOTTOM ZONE ---
    cursor_y = (BOTTOM_ZONE[0] + 18) * S
    zone_end = BOTTOM_ZONE[1] * S

    # Headline
    hl_font, hl_size = _fit_font(draw, copy["headline"], MAX_TEXT_WIDTH * S, 50 * S, 28 * S, index=8)
    _draw_centered_ml(draw, copy["headline"], cursor_y, hl_font, primary, hl_size, S)
    cursor_y += _ml_height(copy["headline"], hl_size) + 20 * S

    # Subline
    if cursor_y < zone_end - 90 * S:
        sub_font, sub_size = _fit_font(draw, copy["subline"], MAX_TEXT_WIDTH * S, 20 * S, 14 * S, index=5)
        _draw_centered_ml(draw, copy["subline"], cursor_y, sub_font, secondary, sub_size, S)
        cursor_y += _ml_height(copy["subline"], sub_size) + 24 * S

    # CTA button
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


def _fit_font(draw, text, max_w, start, minimum, index=8):
    size = start
    while size > minimum:
        font = ImageFont.truetype(FONT_PATH, size, index=index)
        widths = [draw.textbbox((0, 0), ln, font=font)[2] for ln in text.split("\n")]
        if max(widths) <= max_w:
            return font, size
        size -= 2  # step by 2 since we're at 2x
    return ImageFont.truetype(FONT_PATH, minimum, index=index), minimum


def _draw_centered(draw, text, y, font, fill, S):
    w = draw.textbbox((0, 0), text, font=font)[2]
    x = (RENDER_SIZE[0] - w) // 2
    draw.text((x, y), text, font=font, fill=fill)


def _draw_centered_ml(draw, text, y, font, fill, font_size, S):
    line_h = int(font_size * 1.25)
    for line in text.split("\n"):
        lw = draw.textbbox((0, 0), line, font=font)[2]
        x = (RENDER_SIZE[0] - lw) // 2
        draw.text((x, y), line, font=font, fill=fill)
        y += line_h


def _ml_height(text, font_size):
    return int(font_size * 1.25) * len(text.split("\n"))


def _draw_cta(draw, text, y, bg_color, text_color, S):
    font = ImageFont.truetype(FONT_PATH, 22 * S, index=2)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    px, py = 32 * S, 16 * S
    bw = tw + px * 2
    bh = th + py * 2
    bx = (RENDER_SIZE[0] - bw) // 2

    draw.rounded_rectangle(
        [(bx, y), (bx + bw, y + bh)],
        radius=10 * S,
        fill=_hex(bg_color),
    )
    draw.text((bx + px, y + py), text, font=font, fill=_hex(text_color))


def _hex(color: str) -> tuple:
    c = color.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
