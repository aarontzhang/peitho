"""
Text overlay module.

Composites headline, subline, and CTA onto a product background image
using layout-aware rendering. Supports multiple layouts so each ICP
gets a visually distinct ad.
"""

from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/System/Library/Fonts/Avenir Next.ttc"
# Indices: 0=Bold, 2=DemiBold, 5=Medium, 7=Regular, 8=Heavy

CANVAS_SIZE = (1080, 1080)

# Text safe zones — keeps text well away from the product
# For split layouts, text stays in a narrow column on its side
SPLIT_TEXT_MAX_X = 460     # text column width for split-left (px from left edge)
SPLIT_RIGHT_MIN_X = 600   # text starts here for split-right


def overlay_text(bg: Image.Image, copy: dict, treatment: dict, brand: dict) -> Image.Image:
    """Route to the correct layout renderer based on treatment config."""
    renderers = {
        "split-left": _render_split_left,
        "split-right": _render_split_right,
        "bottom-stack": _render_bottom_stack,
        "top-brand": _render_top_brand,
    }

    layout = treatment["layout"]
    renderer = renderers.get(layout, _render_split_left)
    return renderer(bg, copy, treatment, brand)


# ---------------------------------------------------------------------------
# Layout renderers
# ---------------------------------------------------------------------------

def _render_split_left(bg, copy, treatment, brand):
    """Product right, text left. Text confined to left 42% of image."""
    img = _prepare_canvas(bg)
    p = treatment["palette"]

    # Heavy gradient covering left 65% — solid dark on far left
    _apply_gradient(img, direction="left", max_alpha=220, width_pct=0.65)

    draw = ImageDraw.Draw(img)
    m = 60

    _draw_brand(draw, brand["name"], m, 50, p["text_primary"])
    _draw_headline(draw, copy["headline"], m, 380, p["text_primary"], max_width=SPLIT_TEXT_MAX_X - m)
    _draw_subline(draw, copy["subline"], m, 590, p["text_secondary"], max_width=SPLIT_TEXT_MAX_X - m)
    _draw_cta(draw, copy["cta"], m, 730, p["cta_bg"], p["cta_text"])

    return img.convert("RGB")


def _render_split_right(bg, copy, treatment, brand):
    """Product left, text right. Text confined to right 42% of image."""
    img = _prepare_canvas(bg)
    p = treatment["palette"]

    # Heavy gradient covering right 65%
    _apply_gradient(img, direction="right", max_alpha=220, width_pct=0.65)

    draw = ImageDraw.Draw(img)
    m = SPLIT_RIGHT_MIN_X

    _draw_brand(draw, brand["name"], m, 50, p["text_primary"])
    _draw_headline(draw, copy["headline"], m, 380, p["text_primary"], max_width=1080 - m - 40)
    _draw_subline(draw, copy["subline"], m, 590, p["text_secondary"], max_width=1080 - m - 40)
    _draw_cta(draw, copy["cta"], m, 730, p["cta_bg"], p["cta_text"])

    return img.convert("RGB")


def _render_bottom_stack(bg, copy, treatment, brand):
    """Product center-upper, text stacked at bottom."""
    img = _prepare_canvas(bg)
    p = treatment["palette"]

    # Very heavy bottom gradient — bottom 60%, high alpha
    _apply_gradient(img, direction="bottom", max_alpha=230, width_pct=0.60)

    draw = ImageDraw.Draw(img)
    m = 60

    _draw_brand(draw, brand["name"], m, 50, p["text_primary"])
    _draw_headline(draw, copy["headline"], m, 700, p["text_primary"], max_width=900)
    _draw_subline(draw, copy["subline"], m, 890, p["text_secondary"], max_width=900)
    _draw_cta(draw, copy["cta"], m, 1000, p["cta_bg"], p["cta_text"])

    return img.convert("RGB")


def _render_top_brand(bg, copy, treatment, brand):
    """Product center-right, brand top-left, headline mid-left, CTA bottom."""
    img = _prepare_canvas(bg)
    p = treatment["palette"]

    _apply_gradient(img, direction="left", max_alpha=210, width_pct=0.60)

    draw = ImageDraw.Draw(img)
    m = 60

    font_brand = ImageFont.truetype(FONT_PATH, 28, index=0)
    draw.text((m, 50), brand["name"].upper(), font=font_brand, fill=_hex(p["text_primary"]))

    _draw_headline(draw, copy["headline"], m, 320, p["text_primary"], max_width=SPLIT_TEXT_MAX_X - m)
    _draw_subline(draw, copy["subline"], m, 520, p["text_secondary"], max_width=SPLIT_TEXT_MAX_X - m)
    _draw_cta(draw, copy["cta"], m, 670, p["cta_bg"], p["cta_text"])

    return img.convert("RGB")


# ---------------------------------------------------------------------------
# Drawing helpers
# ---------------------------------------------------------------------------

def _prepare_canvas(bg: Image.Image) -> Image.Image:
    """Resize to 1080x1080 and convert to RGBA."""
    img = bg.copy()
    if img.size != CANVAS_SIZE:
        img = img.resize(CANVAS_SIZE, Image.LANCZOS)
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    return img


def _apply_gradient(img: Image.Image, direction: str, max_alpha: int = 220, width_pct: float = 0.65):
    """Apply a dark gradient overlay for text legibility.

    Uses a two-phase approach: solid dark zone + smooth falloff.
    """
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    span = int((w if direction != "bottom" else h) * width_pct)
    # First 30% of the span is near-solid, then smooth falloff
    solid_zone = int(span * 0.30)

    if direction == "left":
        for x in range(span):
            if x < solid_zone:
                alpha = max_alpha
            else:
                progress = (x - solid_zone) / (span - solid_zone)
                alpha = int(max_alpha * (1 - progress ** 1.3))
            draw.rectangle([(x, 0), (x + 1, h)], fill=(0, 0, 0, alpha))

    elif direction == "right":
        start = w - span
        for x in range(start, w):
            dist_from_edge = w - x
            if dist_from_edge < solid_zone:
                alpha = max_alpha
            else:
                progress = (dist_from_edge - solid_zone) / (span - solid_zone)
                alpha = int(max_alpha * (1 - progress ** 1.3))
            draw.rectangle([(x, 0), (x + 1, h)], fill=(0, 0, 0, alpha))

    elif direction == "bottom":
        start = h - span
        for y in range(start, h):
            dist_from_edge = h - y
            if dist_from_edge < solid_zone:
                alpha = max_alpha
            else:
                progress = (dist_from_edge - solid_zone) / (span - solid_zone)
                alpha = int(max_alpha * (1 - progress ** 1.3))
            draw.rectangle([(0, y), (w, y + 1)], fill=(0, 0, 0, alpha))

    composited = Image.alpha_composite(img, overlay)
    img.paste(composited, (0, 0))


def _draw_brand(draw: ImageDraw.Draw, name: str, x: int, y: int, color: str):
    """Draw brand name at top."""
    font = ImageFont.truetype(FONT_PATH, 22, index=0)
    draw.text((x, y), name.upper(), font=font, fill=_hex(color))


def _draw_headline(draw: ImageDraw.Draw, text: str, x: int, y: int, color: str, max_width: int = 400):
    """Draw headline text (multi-line), sized to fit within max_width."""
    # Start at 68px, shrink if any line exceeds max_width
    size = 68
    while size > 36:
        font = ImageFont.truetype(FONT_PATH, size, index=8)  # Heavy
        widths = [draw.textbbox((0, 0), line, font=font)[2] for line in text.split("\n")]
        if max(widths) <= max_width:
            break
        size -= 2

    font = ImageFont.truetype(FONT_PATH, size, index=8)
    line_height = int(size * 1.18)
    for i, line in enumerate(text.split("\n")):
        draw.text((x, y + i * line_height), line, font=font, fill=_hex(color))


def _draw_subline(draw: ImageDraw.Draw, text: str, x: int, y: int, color: str, max_width: int = 400):
    """Draw subline text (multi-line), sized to fit."""
    size = 23
    while size > 16:
        font = ImageFont.truetype(FONT_PATH, size, index=5)  # Medium
        widths = [draw.textbbox((0, 0), line, font=font)[2] for line in text.split("\n")]
        if max(widths) <= max_width:
            break
        size -= 1

    font = ImageFont.truetype(FONT_PATH, size, index=5)
    line_height = int(size * 1.45)
    for i, line in enumerate(text.split("\n")):
        draw.text((x, y + i * line_height), line, font=font, fill=_hex(color))


def _draw_cta(draw: ImageDraw.Draw, text: str, x: int, y: int, bg_color: str, text_color: str):
    """Draw CTA as a clean rounded button."""
    font = ImageFont.truetype(FONT_PATH, 22, index=2)  # Demi Bold
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    pad_x, pad_y = 26, 13
    btn_w = text_w + pad_x * 2
    btn_h = text_h + pad_y * 2

    draw.rounded_rectangle(
        [(x, y), (x + btn_w, y + btn_h)],
        radius=8,
        fill=_hex(bg_color),
    )
    draw.text((x + pad_x, y + pad_y), text, font=font, fill=_hex(text_color))


def _hex(color: str) -> tuple:
    """Convert hex color string to RGB tuple."""
    c = color.lstrip("#")
    return tuple(int(c[i:i+2], 16) for i in (0, 2, 4))
