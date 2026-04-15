"""
Experiment 9: PostHog — four distinct typographic layouts.

Each ICP gets its own layout so the campaign reads as a deliberate set, not a
swap-the-copy template. Layouts live in the LAYOUTS dispatch dict and operate
in 2160x2160 final-pixel coordinates. Text is supersampled at 2x.

Layouts:
  centered_hero     — Logo top-center, headline + subline + pill CTA centered.
  left_editorial    — Logo top-left, horizontal rule, everything left-aligned.
  numbered_steps    — Three numbered steps for a three-line headline.
  oversized_display — Headline dominates the frame; logo + subline + link CTA
                      cluster at the bottom edge.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/System/Library/Fonts/HelveticaNeue.ttc"
ASSETS_DIR = Path(__file__).parent / "assets"
LOGO_DARK_ON_LIGHT = ASSETS_DIR / "posthog-logo.png"
LOGO_WHITE_ON_DARK = ASSETS_DIR / "posthog-logo-white.png"

IDX_REGULAR = 0
IDX_BOLD = 1
IDX_COND_BOLD = 4
IDX_LIGHT = 7
IDX_COND_BLACK = 9
IDX_MEDIUM = 10

OUTPUT_SIZE = (2160, 2160)
SCALE = 2
RENDER_SIZE = (OUTPUT_SIZE[0] * SCALE, OUTPUT_SIZE[1] * SCALE)


# ===========================================================================
# Public API
# ===========================================================================

def create_layers(bg: Image.Image, copy: dict, treatment: dict, brand: dict,
                  layout: str = "centered_hero") -> dict:
    background = bg.copy()
    if background.size != OUTPUT_SIZE:
        background = background.resize(OUTPUT_SIZE, Image.LANCZOS)
    if background.mode != "RGBA":
        background = background.convert("RGBA")

    palette = treatment["palette"]
    gradient = _create_contrast_layer(palette)
    text_layer = _create_text_layer(copy, palette, layout)

    composite = Image.alpha_composite(background, gradient)
    composite = Image.alpha_composite(composite, text_layer)

    return {
        "background": background.convert("RGB"),
        "gradient": gradient,
        "text": text_layer,
        "composite": composite.convert("RGB"),
    }


def _create_contrast_layer(palette: dict) -> Image.Image:
    """Very soft center wash — almost imperceptible, never competes."""
    w, h = OUTPUT_SIZE
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bg_base = _hex(palette["bg_base"])
    is_dark = sum(bg_base) / 3 < 128

    draw = ImageDraw.Draw(layer)
    peak = 35 if is_dark else 20
    color = (*bg_base, 0) if is_dark else (0, 0, 0, 0)
    base_rgb = bg_base if is_dark else (0, 0, 0)

    center_y = h // 2
    reach = h // 2
    for y in range(h):
        dist = abs(y - center_y)
        alpha = int(peak * max(0, 1 - dist / reach))
        if alpha:
            draw.rectangle([(0, y), (w, y + 1)], fill=(*base_rgb, alpha))
    return layer


def _create_text_layer(copy: dict, palette: dict, layout_name: str) -> Image.Image:
    S = SCALE
    canvas = Image.new("RGBA", RENDER_SIZE, (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    bg_base = _hex(palette["bg_base"])
    is_dark_bg = sum(bg_base) / 3 < 128

    layout_fn = LAYOUTS.get(layout_name, _layout_centered_hero)
    layout_fn(canvas, draw, copy, palette, is_dark_bg, S)

    return canvas.resize(OUTPUT_SIZE, Image.LANCZOS)


# ===========================================================================
# Layout A — Centered Hero (startup_cto)
# ===========================================================================

def _layout_centered_hero(canvas, draw, copy, palette, is_dark_bg, S):
    text_primary = _hex(palette["text_primary"])
    text_secondary = _hex(palette["text_secondary"])
    cta_bg = _hex(palette["cta_bg"])
    cta_text = _hex(palette["cta_text"])

    _paste_logo(
        canvas, is_dark_bg,
        target_h=150 * S,
        center=(OUTPUT_SIZE[0] // 2 * S, 270 * S),
    )

    _draw_multiline_fitted(
        draw, copy["headline"], text_primary,
        x_center=OUTPUT_SIZE[0] // 2 * S,
        y_top=540 * S,
        y_bottom=1260 * S,
        max_width=(OUTPUT_SIZE[0] - 400) * S,
        font_max=152 * S,
        font_min=96 * S,
        index=IDX_BOLD,
        line_height=1.06,
        align="center",
    )

    _draw_wrapped_fitted(
        draw, copy["subline"], text_secondary,
        x_center=OUTPUT_SIZE[0] // 2 * S,
        y_top=1330 * S,
        y_bottom=1720 * S,
        max_width=(OUTPUT_SIZE[0] - 560) * S,
        font_max=54 * S,
        font_min=42 * S,
        index=IDX_MEDIUM,
        line_height=1.36,
        align="center",
    )

    _draw_cta_pill(
        draw, copy["cta"], cta_bg, cta_text,
        cx=OUTPUT_SIZE[0] // 2 * S,
        cy=1920 * S,
        S=S,
    )


# ===========================================================================
# Layout B — Left Editorial (engineering_lead)
# ===========================================================================

def _layout_left_editorial(canvas, draw, copy, palette, is_dark_bg, S):
    text_primary = _hex(palette["text_primary"])
    text_secondary = _hex(palette["text_secondary"])
    accent = _hex(palette["bg_accent"])
    cta_bg = _hex(palette["cta_bg"])
    cta_text = _hex(palette["cta_text"])

    left_margin = 220 * S
    content_right = (OUTPUT_SIZE[0] - 220) * S
    content_width = content_right - left_margin

    # Logo anchored top-left
    _paste_logo(
        canvas, is_dark_bg,
        target_h=120 * S,
        top_left=(left_margin, 200 * S),
    )

    # Accent horizontal rule
    rule_y = 400 * S
    draw.rectangle(
        [(left_margin, rule_y), (content_right, rule_y + 6 * S)],
        fill=accent,
    )

    # Headline — left aligned, wrapped to content width
    headline_bottom = _draw_multiline_fitted(
        draw, copy["headline"], text_primary,
        x_left=left_margin,
        y_top=500 * S,
        y_bottom=1320 * S,
        max_width=content_width,
        font_max=160 * S,
        font_min=100 * S,
        index=IDX_BOLD,
        line_height=1.04,
        align="left",
    )

    # Subline — left aligned, tighter width for readability
    _draw_wrapped_fitted(
        draw, copy["subline"], text_secondary,
        x_left=left_margin,
        y_top=max(headline_bottom + 80 * S, 1380 * S),
        y_bottom=1780 * S,
        max_width=min(content_width, 1500 * S),
        font_max=50 * S,
        font_min=40 * S,
        index=IDX_MEDIUM,
        line_height=1.38,
        align="left",
    )

    # CTA — rectangular button with arrow, anchored left
    _draw_cta_rect_arrow(
        draw, copy["cta"], cta_bg, cta_text,
        left=left_margin,
        top=1890 * S,
        S=S,
    )


# ===========================================================================
# Layout C — Numbered Steps (growth_pm)
# ===========================================================================

def _layout_numbered_steps(canvas, draw, copy, palette, is_dark_bg, S):
    text_primary = _hex(palette["text_primary"])
    text_secondary = _hex(palette["text_secondary"])
    accent = _hex(palette["bg_accent"])
    cta_bg = _hex(palette["cta_bg"])
    cta_text = _hex(palette["cta_text"])

    _paste_logo(
        canvas, is_dark_bg,
        target_h=120 * S,
        center=(OUTPUT_SIZE[0] // 2 * S, 240 * S),
    )

    # Parse the headline into steps
    steps = [line.strip() for line in copy["headline"].split("\n") if line.strip()]

    zone_top = 500 * S
    zone_bot = 1300 * S
    zone_h = zone_bot - zone_top
    row_h = zone_h // max(len(steps), 1)

    num_font = ImageFont.truetype(FONT_PATH, 72 * S, index=IDX_MEDIUM)
    step_font = ImageFont.truetype(FONT_PATH, 108 * S, index=IDX_BOLD)

    # Measure widest step text to pick a common left x for alignment of step text
    widths = [draw.textbbox((0, 0), s, font=step_font)[2] for s in steps]
    num_w = draw.textbbox((0, 0), "00", font=num_font)[2]
    gap = 60 * S
    block_w = num_w + gap + max(widths)
    block_x = (RENDER_SIZE[0] - block_w) // 2

    for i, step in enumerate(steps):
        row_y = zone_top + i * row_h + (row_h - 120 * S) // 2

        num_text = f"{i + 1:02d}"
        draw.text((block_x, row_y + 30 * S), num_text, font=num_font, fill=accent)

        draw.text((block_x + num_w + gap, row_y), step, font=step_font, fill=text_primary)

        if i < len(steps) - 1:
            rule_y = zone_top + (i + 1) * row_h - 8 * S
            draw.rectangle(
                [(block_x, rule_y), (block_x + block_w, rule_y + 2 * S)],
                fill=(*text_secondary, 110),
            )

    _draw_wrapped_fitted(
        draw, copy["subline"], text_secondary,
        x_center=OUTPUT_SIZE[0] // 2 * S,
        y_top=1420 * S,
        y_bottom=1780 * S,
        max_width=(OUTPUT_SIZE[0] - 560) * S,
        font_max=50 * S,
        font_min=40 * S,
        index=IDX_MEDIUM,
        line_height=1.38,
        align="center",
    )

    _draw_cta_pill(
        draw, copy["cta"], cta_bg, cta_text,
        cx=OUTPUT_SIZE[0] // 2 * S,
        cy=1920 * S,
        S=S,
    )


# ===========================================================================
# Layout D — Oversized Display (indie_founder)
# ===========================================================================

def _layout_oversized_display(canvas, draw, copy, palette, is_dark_bg, S):
    text_primary = _hex(palette["text_primary"])
    text_secondary = _hex(palette["text_secondary"])
    accent = _hex(palette["bg_accent"])

    # Massive headline dominates the top two-thirds of the frame
    _draw_multiline_fitted(
        draw, copy["headline"], text_primary,
        x_left=180 * S,
        y_top=280 * S,
        y_bottom=1480 * S,
        max_width=(OUTPUT_SIZE[0] - 360) * S,
        font_max=240 * S,
        font_min=140 * S,
        index=IDX_BOLD,
        line_height=1.02,
        align="left",
    )

    # Thin accent rule just below the headline block
    rule_y = 1560 * S
    draw.rectangle(
        [(180 * S, rule_y), ((OUTPUT_SIZE[0] - 180) * S, rule_y + 6 * S)],
        fill=accent,
    )

    # Bottom cluster: logo left, subline center-left, CTA (text link) bottom-right
    _paste_logo(
        canvas, is_dark_bg,
        target_h=100 * S,
        top_left=(180 * S, 1640 * S),
    )

    _draw_wrapped_fitted(
        draw, copy["subline"], text_secondary,
        x_left=180 * S,
        y_top=1800 * S,
        y_bottom=1980 * S,
        max_width=1400 * S,
        font_max=40 * S,
        font_min=32 * S,
        index=IDX_MEDIUM,
        line_height=1.32,
        align="left",
    )

    _draw_cta_text_link(
        draw, copy["cta"], accent,
        right=(OUTPUT_SIZE[0] - 180) * S,
        baseline_y=1920 * S,
        S=S,
    )


LAYOUTS = {
    "centered_hero": _layout_centered_hero,
    "left_editorial": _layout_left_editorial,
    "numbered_steps": _layout_numbered_steps,
    "oversized_display": _layout_oversized_display,
}


# ===========================================================================
# Drawing primitives
# ===========================================================================

def _paste_logo(canvas, is_dark_bg, target_h, center=None, top_left=None):
    path = LOGO_WHITE_ON_DARK if is_dark_bg else LOGO_DARK_ON_LIGHT
    logo = Image.open(path).convert("RGBA")

    ratio = target_h / logo.height
    target_w = int(logo.width * ratio)
    logo = logo.resize((target_w, target_h), Image.LANCZOS)

    if top_left is not None:
        x, y = top_left
    else:
        cx, cy = center
        x = cx - target_w // 2
        y = cy - target_h // 2

    canvas.alpha_composite(logo, (int(x), int(y)))


def _draw_multiline_fitted(draw, text, color, *, x_left=None, x_center=None,
                           y_top, y_bottom, max_width, font_max, font_min,
                           index, line_height, align):
    """Render explicit \\n-separated lines, fit font to zone, return bottom y."""
    lines = text.split("\n")
    zone_h = y_bottom - y_top

    size = font_max
    step = max(1, 2 * SCALE)
    while size >= font_min:
        font = ImageFont.truetype(FONT_PATH, size, index=index)
        widths = [draw.textbbox((0, 0), line, font=font)[2] for line in lines]
        total_h = int(size * line_height) * len(lines)
        if max(widths) <= max_width and total_h <= zone_h:
            break
        size -= step
    else:
        font = ImageFont.truetype(FONT_PATH, font_min, index=index)
        size = font_min

    line_step = int(size * line_height)
    block_h = line_step * len(lines)
    y = y_top + (zone_h - block_h) // 2

    for line in lines:
        lw = draw.textbbox((0, 0), line, font=font)[2]
        if align == "center":
            x = (x_center - lw // 2) if x_center is not None else (x_left)
        else:
            x = x_left
        draw.text((x, y), line, font=font, fill=color)
        y += line_step

    return y


def _draw_wrapped_fitted(draw, text, color, *, x_left=None, x_center=None,
                         y_top, y_bottom, max_width, font_max, font_min,
                         index, line_height, align):
    """Word-wrap text to fit zone, return bottom y."""
    zone_h = y_bottom - y_top

    size = font_max
    step = max(1, 1 * SCALE)
    while size >= font_min:
        font = ImageFont.truetype(FONT_PATH, size, index=index)
        lines = _wrap_text(draw, text, font, max_width)
        total_h = int(size * line_height) * len(lines)
        widest = max(draw.textbbox((0, 0), line, font=font)[2] for line in lines)
        if total_h <= zone_h and widest <= max_width:
            break
        size -= step
    else:
        font = ImageFont.truetype(FONT_PATH, font_min, index=index)
        lines = _wrap_text(draw, text, font, max_width)
        size = font_min

    line_step = int(size * line_height)
    block_h = line_step * len(lines)
    y = y_top + (zone_h - block_h) // 2

    for line in lines:
        lw = draw.textbbox((0, 0), line, font=font)[2]
        if align == "center":
            x = (x_center - lw // 2) if x_center is not None else x_left
        else:
            x = x_left
        draw.text((x, y), line, font=font, fill=color)
        y += line_step

    return y


def _wrap_text(draw, text, font, max_width):
    words = text.split()
    lines, current = [], []
    for word in words:
        trial = " ".join(current + [word])
        if draw.textbbox((0, 0), trial, font=font)[2] <= max_width:
            current.append(word)
        else:
            if current:
                lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return lines


def _draw_cta_pill(draw, text, bg_color, text_color, *, cx, cy, S):
    font = ImageFont.truetype(FONT_PATH, 44 * S, index=IDX_BOLD)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    px, py = 72 * S, 36 * S
    bw = tw + px * 2
    bh = th + py * 2
    bx = cx - bw // 2
    by = cy - bh // 2
    radius = bh // 2

    draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=radius, fill=bg_color)
    draw.text((bx + (bw - tw) // 2 - bbox[0], by + (bh - th) // 2 - bbox[1]),
              text, font=font, fill=text_color)


def _draw_cta_rect_arrow(draw, text, bg_color, text_color, *, left, top, S):
    font = ImageFont.truetype(FONT_PATH, 44 * S, index=IDX_BOLD)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    arrow_gap = 40 * S
    arrow_w = 44 * S
    arrow_h = 28 * S

    px, py = 64 * S, 34 * S
    bw = tw + arrow_gap + arrow_w + px * 2
    bh = th + py * 2
    radius = 12 * S

    draw.rounded_rectangle([(left, top), (left + bw, top + bh)], radius=radius, fill=bg_color)

    text_x = left + px - bbox[0]
    text_y = top + (bh - th) // 2 - bbox[1]
    draw.text((text_x, text_y), text, font=font, fill=text_color)

    arrow_cx = left + px + tw + arrow_gap + arrow_w // 2
    arrow_cy = top + bh // 2
    _draw_arrow(draw, arrow_cx, arrow_cy, arrow_w, arrow_h, text_color, S)


def _draw_arrow(draw, cx, cy, width, height, color, S):
    """Draw a clean right-arrow: horizontal shaft + triangular head."""
    shaft_thickness = max(4 * S, 6)
    shaft_left = cx - width // 2
    shaft_right = cx + width // 2 - height // 2
    draw.rectangle(
        [(shaft_left, cy - shaft_thickness // 2),
         (shaft_right, cy + shaft_thickness // 2)],
        fill=color,
    )
    head_tip = (cx + width // 2, cy)
    head_top = (shaft_right, cy - height // 2)
    head_bot = (shaft_right, cy + height // 2)
    draw.polygon([head_top, head_tip, head_bot], fill=color)


def _draw_cta_text_link(draw, text, color, *, right, baseline_y, S):
    font = ImageFont.truetype(FONT_PATH, 46 * S, index=IDX_BOLD)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]

    arrow_gap = 32 * S
    arrow_w = 48 * S
    arrow_h = 26 * S
    total_w = tw + arrow_gap + arrow_w

    x = right - total_w
    y = baseline_y - th // 2 - bbox[1]
    draw.text((x, y), text, font=font, fill=color)

    arrow_cx = x + tw + arrow_gap + arrow_w // 2
    arrow_cy = baseline_y
    _draw_arrow(draw, arrow_cx, arrow_cy, arrow_w, arrow_h, color, S)

    underline_y = y + th + bbox[1] + 12 * S
    draw.rectangle([(x, underline_y), (x + tw, underline_y + 4 * S)], fill=color)


def _hex(color: str) -> tuple:
    c = color.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
