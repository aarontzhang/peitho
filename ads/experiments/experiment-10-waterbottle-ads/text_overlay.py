"""
Experiment 10: Water bottle layered text overlay system.

LAYOUT: Stacked copy zones. Brand and product metadata sit in the top band,
the bottle + splash owns the middle, and the selling message sits in the bottom band.
This matches Gemini's top/bottom reserved zones for the background render.

Uses Futura for a bold, active aesthetic.
Text rendered at 2x resolution and downscaled for crisp anti-aliasing.

Layers output:
  - background: product image resized to 1080x1080
  - gradient: dark overlays for top and bottom text zones (RGBA)
  - text: all text on transparent background (RGBA)
  - composite: final flattened result (RGB)
"""

from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/System/Library/Fonts/Supplemental/Futura.ttc"
# Indices: 0=Medium, 1=Medium Italic, 2=Bold, 3=Condensed Medium, 4=Condensed ExtraBold

OUTPUT_SIZE = (1080, 1080)
SCALE = 2
RENDER_SIZE = (OUTPUT_SIZE[0] * SCALE, OUTPUT_SIZE[1] * SCALE)

TOP_ZONE = (0, 170)
PRODUCT_ZONE = (170, 770)
BOTTOM_ZONE = (770, 1065)

H_MARGIN = 68
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

    background = bg.copy()
    if background.size != OUTPUT_SIZE:
        background = background.resize(OUTPUT_SIZE, Image.LANCZOS)
    if background.mode != "RGBA":
        background = background.convert("RGBA")

    gradient = _create_gradient_layer()
    text_layer = _create_text_layer(copy, p, brand)

    composite = Image.alpha_composite(background, gradient)
    composite = Image.alpha_composite(composite, text_layer)

    return {
        "background": background.convert("RGB"),
        "gradient": gradient,
        "text": text_layer,
        "composite": composite.convert("RGB"),
    }


def _create_gradient_layer() -> Image.Image:
    """Soft top and bottom vignettes for copy legibility without hard bars."""
    w, h = OUTPUT_SIZE
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    peak_alpha = 165

    t_start, t_end = TOP_ZONE
    t_span = t_end - t_start
    for y in range(t_start, t_end):
        progress = (y - t_start) / t_span
        alpha = int(peak_alpha * (1 - progress) ** 1.8)
        draw.rectangle([(0, y), (w, y + 1)], fill=(0, 0, 0, alpha))

    b_start, b_end = BOTTOM_ZONE
    b_span = b_end - b_start
    for y in range(b_start, b_end):
        progress = (y - b_start) / b_span
        alpha = int(peak_alpha * progress ** 1.8)
        draw.rectangle([(0, y), (w, y + 1)], fill=(0, 0, 0, alpha))

    return layer


def _create_text_layer(copy: dict, palette: dict, brand: dict) -> Image.Image:
    """Render all text at 2x on a transparent canvas, then downscale to 1080."""
    S = SCALE
    canvas = Image.new("RGBA", RENDER_SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    primary = _hex(palette["text_primary"])
    secondary = _hex(palette["text_secondary"])
    cta_bg = palette["cta_bg"]
    cta_text = palette["cta_text"]

    cursor_y = (TOP_ZONE[0] + 34) * S

    font_brand = ImageFont.truetype(FONT_PATH, 18 * S, index=2)
    brand_text = brand["name"].upper()
    _draw_centered_tracked(draw, brand_text, cursor_y, font_brand, primary, tracking=8 * S)
    cursor_y += _text_h(draw, brand_text, font_brand) + 18 * S

    if "product_title" in copy:
        font_title = ImageFont.truetype(FONT_PATH, 34 * S, index=4)
        _draw_centered(draw, copy["product_title"], cursor_y, font_title, primary)
        cursor_y += _text_h(draw, copy["product_title"], font_title) + 10 * S

    if "tagline" in copy:
        font_tag = ImageFont.truetype(FONT_PATH, 15 * S, index=0)
        _draw_centered(draw, copy["tagline"], cursor_y, font_tag, secondary)

    cursor_y = (BOTTOM_ZONE[0] + 18) * S
    zone_end = BOTTOM_ZONE[1] * S

    hl_font, hl_size = _fit_font(draw, copy["headline"], MAX_TEXT_WIDTH * S, 52 * S, 30 * S, index=4)
    _draw_centered_ml(draw, copy["headline"], cursor_y, hl_font, primary, hl_size)
    cursor_y += _ml_height(copy["headline"], hl_size, 1.12) + 18 * S

    if cursor_y < zone_end - 96 * S:
        sub_font, sub_size = _fit_font(draw, copy["subline"], MAX_TEXT_WIDTH * S, 18 * S, 12 * S, index=0)
        _draw_centered_ml(draw, copy["subline"], cursor_y, sub_font, secondary, sub_size, line_height=1.22)
        cursor_y += _ml_height(copy["subline"], sub_size, 1.22) + 24 * S

    if cursor_y < zone_end - 52 * S:
        _draw_cta(draw, copy["cta"], cursor_y, cta_bg, cta_text, S)

    return canvas.resize(OUTPUT_SIZE, Image.LANCZOS)


def _text_h(draw, text, font):
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[3] - bbox[1]


def _fit_font(draw, text, max_w, start, minimum, index=4):
    size = start
    while size > minimum:
        font = ImageFont.truetype(FONT_PATH, size, index=index)
        widths = [draw.textbbox((0, 0), line, font=font)[2] for line in text.split("\n")]
        if max(widths) <= max_w:
            return font, size
        size -= 2
    return ImageFont.truetype(FONT_PATH, minimum, index=index), minimum


def _draw_centered(draw, text, y, font, fill):
    width = draw.textbbox((0, 0), text, font=font)[2]
    x = (RENDER_SIZE[0] - width) // 2
    draw.text((x, y), text, font=font, fill=fill)


def _draw_centered_tracked(draw, text, y, font, fill, tracking=0):
    total_w = 0
    for i, ch in enumerate(text):
        cw = draw.textbbox((0, 0), ch, font=font)[2]
        total_w += cw + (tracking if i < len(text) - 1 else 0)

    x = (RENDER_SIZE[0] - total_w) // 2
    for i, ch in enumerate(text):
        draw.text((x, y), ch, font=font, fill=fill)
        cw = draw.textbbox((0, 0), ch, font=font)[2]
        x += cw + (tracking if i < len(text) - 1 else 0)


def _draw_centered_ml(draw, text, y, font, fill, font_size, line_height=1.12):
    step = int(font_size * line_height)
    for line in text.split("\n"):
        lw = draw.textbbox((0, 0), line, font=font)[2]
        x = (RENDER_SIZE[0] - lw) // 2
        draw.text((x, y), line, font=font, fill=fill)
        y += step


def _ml_height(text, font_size, line_height):
    return int(font_size * line_height) * len(text.split("\n"))


def _draw_cta(draw, text, y, bg_color, text_color, S):
    font = ImageFont.truetype(FONT_PATH, 17 * S, index=2)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    px, py = 30 * S, 13 * S
    bw = tw + px * 2
    bh = th + py * 2
    bx = (RENDER_SIZE[0] - bw) // 2

    draw.rounded_rectangle(
        [(bx, y), (bx + bw, y + bh)],
        radius=8 * S,
        fill=_hex(bg_color),
    )
    draw.text((bx + px, y + py), text, font=font, fill=_hex(text_color))


def _hex(color: str) -> tuple:
    c = color.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
