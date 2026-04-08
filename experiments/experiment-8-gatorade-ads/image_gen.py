"""
Experiment 8: Gemini image generation adapted for beverage bottles (Gatorade).

LAYOUT: Side-by-side — bottle on the RIGHT side of the frame, LEFT side
reserved for text overlay. This is because the bottle is a tall vertical
product; a top/bottom text layout would squeeze it or waste horizontal space.

Key differences from previous experiments:
- Bottle offset to right ~60-65% of frame, left ~45% reserved for copy
- No top/bottom text zone constraints — text goes on the left side
- Condensation and refreshment cues for beverage appeal
"""

import json
import os
import base64
import requests
from PIL import Image
from io import BytesIO

API_KEY = os.environ["GEMINI_API_KEY"]
MODEL = "gemini-3.1-flash-image-preview"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"


def generate_product_image(product_json: dict, visual_treatment: dict, brand: dict) -> tuple[Image.Image | None, str]:
    """
    Generate a Gatorade bottle hero image via Gemini.

    Returns:
        (PIL Image or None, prompt string used)
    """
    prompt = _build_prompt(product_json, visual_treatment, brand)
    img = _call_gemini(prompt, label=visual_treatment.get("background_mood", "image"))
    return img, prompt


def _build_prompt(product_json: dict, treatment: dict, brand: dict) -> str:
    """Build Gemini prompt for beverage bottle — side-by-side layout."""
    accent_hex = treatment["palette"]["bg_accent"]

    return f"""Generate a 1080x1080 premium beverage product photography image.

PRODUCT SPECIFICATION (render this bottle exactly as described):

{json.dumps(product_json, indent=2)}

Use the JSON above to accurately render: bottle shape, cap color, liquid color, label design, and proportions.

=== CAMERA & COMPOSITION ===
- Straight-on front view with very slight rotation (5-10 degrees) so the label is fully readable but the bottle has depth.
- Camera height: eye level, centered on the middle of the bottle.
- The Gatorade label must be clearly visible and facing the camera.
- The orange liquid must be visible through the translucent bottle above and below the label.
- The orange cap must be visible at the top.

=== BOTTLE PLACEMENT IN FRAME (SIDE-BY-SIDE LAYOUT) ===
- The bottle is positioned on the RIGHT side of the frame.
- The bottle's center should be at roughly 65% from the left edge horizontally.
- The LEFT 45% of the frame should be mostly empty — just background/atmosphere. This area is reserved for text overlay.
- The bottle (cap to base) should occupy roughly 70-75% of the frame height, centered vertically.
- The bottle should span roughly 25-30% of the frame width (it's a narrow upright bottle).
- Leave a small margin at the top and bottom — the cap should not touch the top edge and the base should not touch the bottom edge.

=== SURFACE AND ENVIRONMENT ===
{treatment["background_mood"]}
- The bottle sits upright on a flat surface — it is NOT floating or tilted.
- Subtle shadow and reflection beneath the bottle for grounding.
- Subtle {accent_hex} color accents in the environment (reflections, light sources, atmosphere).
- The LEFT side of the background should be darker/muted for text readability — a natural vignette or shadow falling on the left.

=== BEVERAGE-SPECIFIC DETAILS ===
- Light condensation droplets on the outside of the bottle — it looks cold and refreshing.
- The orange liquid inside should look vibrant and appealing, not murky.
- The bottle should look like you could reach out and grab it.
- Clean, crisp product rendering — this is a premium commercial photograph.

=== CRITICAL STYLE RULES ===
- This is a REAL bottle photographed in an environment — photorealistic, not a render or illustration.
- Premium commercial product photography, advertising quality.
- Photorealistic, 1080x1080 square format.
- Sharp focus on the bottle, slightly softer background (shallow depth of field).
- NO text, words, letters, numbers, logos, watermarks, or typography anywhere in the image.
- NO hands or people visible.
- NO other bottles, cans, or products in the frame.
- NO Gatorade branding text baked into the image — keep the bottle generic/clean.
- The bottle is the sole subject — clean, bold, refreshing.

=== BRAND AESTHETIC ===
- Gatorade's visual identity is bold, athletic, and confident.
- High contrast, vivid colors, dynamic energy.
- The image should feel active and powerful, never passive or clinical.
- The orange of the liquid should pop against the background.
"""


def _call_gemini(prompt: str, label: str) -> Image.Image | None:
    """Send prompt to Gemini and extract the returned image."""
    print(f"  Generating image: {label[:60]}...")
    print(f"  Prompt length: {len(prompt)} chars")

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
        },
    }

    resp = requests.post(API_URL, json=payload, timeout=120)

    if resp.status_code != 200:
        print(f"  ERROR {resp.status_code}: {resp.text[:300]}")
        return None

    data = resp.json()
    candidates = data.get("candidates", [])
    if not candidates:
        print(f"  ERROR: No candidates in response")
        return None

    for part in candidates[0].get("content", {}).get("parts", []):
        if "inlineData" in part:
            img_data = base64.b64decode(part["inlineData"]["data"])
            img = Image.open(BytesIO(img_data))
            print(f"  Got image: {img.size}")
            return img
        elif "text" in part:
            print(f"  Model note: {part['text'][:150]}")

    print("  ERROR: No image in response")
    return None
