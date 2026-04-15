"""
Experiment 9: Gemini background generation for PostHog (typographic hero).

LAYOUT: The copy is the hero. This file generates a *subtle canvas* — a quiet
paper-like wash with a gentle corner glow in the ICP accent color. It must not
contain objects, scenes, or anything that competes with the headline typography.
The center 60% of the frame must be near-uniform so the overlay reads cleanly.

If Gemini fails or returns something too busy, generate.py will fall back to a
procedurally-generated PIL canvas (see `render_procedural_background`).
"""

import base64
import json
import os
import urllib.error
import urllib.request
from io import BytesIO

from PIL import Image, ImageDraw, ImageFilter

MODEL = "gemini-3.1-flash-image-preview"
OUTPUT_SIZE = (2160, 2160)


def generate_background(brand_system: dict, visual_treatment: dict, brand: dict) -> tuple[Image.Image | None, str]:
    """Generate a subtle canvas background via Gemini."""
    prompt = _build_prompt(brand_system, visual_treatment, brand)
    img = _call_gemini(prompt, label=visual_treatment.get("background_mood", "bg"))
    return img, prompt


def _build_prompt(brand_system: dict, treatment: dict, brand: dict) -> str:
    palette = treatment["palette"]
    bg_base = palette["bg_base"]
    bg_accent = palette["bg_accent"]

    forbidden = "\n".join(f"- {line}" for line in brand_system["background_aesthetic"]["forbidden"])

    return f"""Generate a 1080x1080 MINIMAL ABSTRACT CANVAS background for a typographic advertisement.

This is NOT a product photograph. This is NOT a scene. This is a quiet empty canvas that will have large typography overlaid on top. The only job of this image is to be a beautiful, subtle, uncluttered backdrop.

=== CORE AESTHETIC ===
{brand_system["background_aesthetic"]["description"]}

For this specific variant:
{treatment["background_mood"]}

=== COLOR ===
- Base color: {bg_base} — this dominates roughly 85% of the frame
- Accent color: {bg_accent} — appears ONLY as a very soft, low-opacity radial glow anchored at one edge or corner
- The accent must fade out gently, leaving the center of the frame nearly uniform base color
- Low contrast throughout. Think "whisper," not "pop."

=== COMPOSITION RULES (critical) ===
- The CENTER 60% of the image (roughly x:200-880, y:280-850) must be nearly uniform base color, with at most a barely-perceptible gradient. No details, no shapes, no texture spikes here.
- The accent glow lives in ONE corner or edge only — not spread across the frame.
- Subtle paper-like or linen-like micro-texture is acceptable, but extremely low in contrast.
- The overall feeling should be "premium minimalist gallery wall" — quiet, sophisticated, empty.

=== ABSOLUTELY FORBIDDEN (do not include any of these) ===
{forbidden}
- No UI mockups, dashboards, charts, or graphs
- No devices, screens, or product imagery
- No decorative flourishes, splashes, or abstract "design elements"
- No baked-in typography of any kind

=== STYLE ===
- Photorealistic paper / canvas / minimal-gradient aesthetic
- Looks like a blank premium backdrop, not an illustration
- Square format, 1080x1080
- Quiet, sophisticated, professional

The single test: if a reader saw this image without any overlay, would they say "that's a nice clean background"? That's the goal. Not "what an interesting image" — just "that's clean."
"""


def _call_gemini(prompt: str, label: str) -> Image.Image | None:
    print(f"  Generating background: {label[:60]}...")
    print(f"  Prompt length: {len(prompt)} chars")

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("  ERROR: GEMINI_API_KEY is not set")
        return None

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={api_key}"

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
        },
    }

    req = urllib.request.Request(
        api_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            status = resp.status
            body = resp.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        print(f"  ERROR {exc.code}: {body[:300]}")
        return None
    except urllib.error.URLError as exc:
        print(f"  ERROR: {exc.reason}")
        return None

    if status != 200:
        print(f"  ERROR {status}: {body[:300]}")
        return None

    data = json.loads(body)
    candidates = data.get("candidates", [])
    if not candidates:
        print("  ERROR: No candidates in response")
        return None

    for part in candidates[0].get("content", {}).get("parts", []):
        if "inlineData" in part:
            img_data = base64.b64decode(part["inlineData"]["data"])
            img = Image.open(BytesIO(img_data))
            print(f"  Got image: {img.size}")
            return img
        if "text" in part:
            print(f"  Model note: {part['text'][:150]}")

    print("  ERROR: No image in response")
    return None


# ---------------------------------------------------------------------------
# Procedural fallback — always safe, always quiet.
# ---------------------------------------------------------------------------

def render_procedural_background(treatment: dict, style: str = "corner_glow") -> Image.Image:
    """
    Build a quiet canvas in PIL. Four styles matched to four layouts:

      corner_glow       — Base color + one tight radial glow anchored at a corner.
      side_panel        — Base color + a full-height accent bar along the left edge.
      split_panel       — Two-tone vertical split (base top, slightly darker bottom).
      flat_grain        — Flat base color with an extremely subtle grain.
    """
    style_fn = {
        "corner_glow": _bg_corner_glow,
        "side_panel": _bg_side_panel,
        "split_panel": _bg_split_panel,
        "flat_grain": _bg_flat_grain,
    }.get(style, _bg_corner_glow)
    return style_fn(treatment)


def _bg_corner_glow(treatment):
    palette = treatment["palette"]
    base = _hex(palette["bg_base"])
    accent = _hex(palette["bg_accent"])
    w, h = OUTPUT_SIZE
    img = Image.new("RGB", OUTPUT_SIZE, base)

    mood = treatment.get("background_mood", "").lower()
    if "top-right" in mood:
        cx, cy = w * 1.05, h * -0.05
    elif "bottom-left" in mood:
        cx, cy = w * -0.05, h * 1.05
    elif "top-left" in mood:
        cx, cy = w * -0.05, h * -0.05
    elif "bottom-right" in mood:
        cx, cy = w * 1.05, h * 1.05
    else:
        cx, cy = w * 1.05, h * -0.05

    glow = Image.new("L", OUTPUT_SIZE, 0)
    gdraw = ImageDraw.Draw(glow)
    max_r = 1040
    for r in range(max_r, 0, -4):
        intensity = int(200 * (1 - r / max_r) ** 3.0)
        gdraw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=intensity)
    glow = glow.filter(ImageFilter.GaussianBlur(180))
    glow_capped = glow.point(lambda p: min(p, 140))

    accent_layer = Image.new("RGB", OUTPUT_SIZE, accent)
    return Image.composite(accent_layer, img, glow_capped)


def _bg_side_panel(treatment):
    """Full-height accent bar on the left; rest of frame is clean base."""
    palette = treatment["palette"]
    base = _hex(palette["bg_base"])
    accent = _hex(palette["bg_accent"])
    w, h = OUTPUT_SIZE
    img = Image.new("RGB", OUTPUT_SIZE, base)
    draw = ImageDraw.Draw(img)

    bar_width = 24
    draw.rectangle([(0, 0), (bar_width, h)], fill=accent)

    # Soft shadow bleeding into the frame from the bar for depth.
    shadow = Image.new("L", OUTPUT_SIZE, 0)
    sdraw = ImageDraw.Draw(shadow)
    for x in range(bar_width, bar_width + 260):
        alpha = int(60 * (1 - (x - bar_width) / 260) ** 2)
        sdraw.rectangle([(x, 0), (x + 1, h)], fill=alpha)
    shadow = shadow.filter(ImageFilter.GaussianBlur(40))
    dark = Image.new("RGB", OUTPUT_SIZE, (0, 0, 0))
    img = Image.composite(dark, img, shadow)
    return img


def _bg_split_panel(treatment):
    """Upper 62% base color, lower 38% slightly warmer/deeper with a soft seam."""
    palette = treatment["palette"]
    base = _hex(palette["bg_base"])
    w, h = OUTPUT_SIZE

    darker = tuple(max(0, c - 14) for c in base)

    img = Image.new("RGB", OUTPUT_SIZE, base)
    draw = ImageDraw.Draw(img)

    split_y = int(h * 0.62)
    draw.rectangle([(0, split_y), (w, h)], fill=darker)

    # Soft feathered seam so the split reads as a gentle gradient, not a hard line.
    mask = Image.new("L", OUTPUT_SIZE, 0)
    mdraw = ImageDraw.Draw(mask)
    for y in range(split_y - 80, split_y + 80):
        t = (y - (split_y - 80)) / 160
        mdraw.rectangle([(0, y), (w, y + 1)], fill=int(255 * t))
    mask = mask.filter(ImageFilter.GaussianBlur(30))

    over = Image.new("RGB", OUTPUT_SIZE, darker)
    return Image.composite(over, img, mask)


def _bg_flat_grain(treatment):
    """Flat warm canvas with an extremely subtle grain — no shape cues at all."""
    palette = treatment["palette"]
    base = _hex(palette["bg_base"])
    w, h = OUTPUT_SIZE
    img = Image.new("RGB", OUTPUT_SIZE, base)

    # Grain via low-alpha noise layer
    import random
    random.seed(0)
    noise = Image.new("L", OUTPUT_SIZE, 0)
    px = noise.load()
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            px[x, y] = random.randint(0, 30)
    noise = noise.filter(ImageFilter.GaussianBlur(1))
    dark = Image.new("RGB", OUTPUT_SIZE, (0, 0, 0))
    return Image.composite(dark, img, noise)


def _hex(color: str) -> tuple[int, int, int]:
    c = color.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))
