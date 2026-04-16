"""
Experiment 10: Gemini image generation for insulated water bottle — splash backgrounds.

LAYOUT: Stacked top/bottom copy zones with the bottle centered in the middle.
Gemini renders the bottle surrounded by dynamic water splash effects.
Top and bottom bands stay darker for text overlay.
"""

import base64
import json
import os
import urllib.error
import urllib.request
from io import BytesIO

from PIL import Image

MODEL = "gemini-3.1-flash-image-preview"


def generate_product_image(product_json: dict, visual_treatment: dict, brand: dict) -> tuple[Image.Image | None, str]:
    """
    Generate a water bottle hero image with splash background via Gemini.

    Returns:
        (PIL Image or None, prompt string used)
    """
    prompt = _build_prompt(product_json, visual_treatment, brand)
    img = _call_gemini(prompt, label=visual_treatment.get("background_mood", "image"))
    return img, prompt


def _build_prompt(product_json: dict, treatment: dict, brand: dict) -> str:
    """Build Gemini prompt for a centered bottle with dramatic water splash."""
    accent_hex = treatment["palette"]["bg_accent"]

    return f"""Generate a 1080x1080 premium product photography image featuring a dramatic water splash.

PRODUCT SPECIFICATION (render this bottle exactly as described):

{json.dumps(product_json, indent=2)}

Use the JSON above to accurately render: bottle shape, gradient color (burnt orange at base to golden yellow-orange at top), black flip-top lid, paracord wrist loop, and matte powder-coated finish.

=== CAMERA & COMPOSITION ===
- Straight-on front view with very slight rotation (5-10 degrees) so the bottle has depth and the gradient is clearly visible.
- Camera height: eye level, centered on the middle of the bottle.
- The full bottle must be visible — cap to base.
- The orange-to-yellow gradient on the body must be clearly rendered.
- The black flip-top lid and paracord loop should be visible.

=== BOTTLE PLACEMENT IN FRAME ===
- The bottle is centered horizontally in the frame.
- The bottle center is at approximately 50% from the top (vertically centered).
- The bottle (cap to base) should occupy roughly 55-65% of the frame height.
- TOP 15% of the frame (top ~160 pixels): EMPTY of bottle parts. Reserved for text overlay.
- BOTTOM 22% of the frame (bottom ~240 pixels): Only splash water and shadows — no bottle. Reserved for text overlay.
- The bottle should span roughly 20-25% of the frame width (narrow upright bottle).

=== WATER SPLASH ENVIRONMENT ===
{treatment["background_mood"]}
- The splash is the key visual element alongside the bottle — it should be dramatic, dynamic, and eye-catching.
- Water should look crystal-clear and realistic — frozen high-speed photography style.
- Individual droplets visible, suspended mid-air.
- The splash wraps around and erupts from around the bottle — the bottle is the epicenter.
- Light refracts through the water creating sparkle and depth.
- Subtle {accent_hex} color accents in the lighting and water reflections.
- Background behind the splash should be dark/moody for contrast.
- Top 15% and bottom 22% should remain darker for text readability.

=== BOTTLE-SPECIFIC DETAILS ===
- Light condensation beads on the bottle surface — it's ice cold.
- The powder-coated matte finish should catch the light — not glossy, not flat.
- The orange-yellow gradient should look warm against the cool water splash.
- The bottle should look solid, grounded, and premium.

=== CRITICAL STYLE RULES ===
- Ultra high-speed splash photography style — water frozen mid-motion.
- Premium commercial product photography, advertising quality.
- Photorealistic, 1080x1080 square format.
- Sharp focus on the bottle, splash in sharp focus too.
- NO text, words, letters, numbers, logos, watermarks, or typography anywhere in the image.
- NO hands or people visible.
- NO other bottles or products in the frame.
- NO brand text baked into the image.
- The bottle + splash is the sole subject — clean, bold, refreshing.

=== BRAND AESTHETIC ===
- Warm, active, reliable — the visual should say "this bottle goes where you go."
- High contrast between warm orange bottle and cool blue water splash.
- Dynamic energy — this is a product that moves with you.
- The orange of the bottle should pop against the splash and dark background.
"""


def _call_gemini(prompt: str, label: str) -> Image.Image | None:
    """Send prompt to Gemini and extract the returned image."""
    print(f"  Generating image: {label[:60]}...")
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
