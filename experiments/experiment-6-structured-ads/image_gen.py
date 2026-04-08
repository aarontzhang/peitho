"""
Experiment 6: Improved Gemini image generation with anti-hallucination prompting.

Fixes from Experiment 5:
- Explicit band orientation instructions prevent medal/V-shape artifacts
- Straight-on pose keeps the display readable (no weird wrist angles)
- Zone-aware composition reserves top/bottom for text overlay
- Strong negative constraints prevent object merging hallucinations
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
    Generate a product hero image via Gemini.

    Returns:
        (PIL Image or None, prompt string used)
    """
    prompt = _build_prompt(product_json, visual_treatment, brand)
    img = _call_gemini(prompt, label=visual_treatment.get("background_mood", "image"))
    return img, prompt


def _build_prompt(product_json: dict, treatment: dict, brand: dict) -> str:
    """Build Gemini prompt with explicit anti-hallucination guardrails."""
    accent_hex = treatment["palette"]["bg_accent"]

    return f"""Generate a 1080x1080 premium product photography image.

PRODUCT SPECIFICATION (render this product exactly as described):

{json.dumps(product_json, indent=2)}

Use the JSON above to accurately render every detail: case shape, button positions, display content, band material, and colors.

=== CAMERA & POSE ===
- Camera is slightly to the LEFT of center (approximately 15-20 degrees left of center), at eye level.
- This makes the watch face angle slightly toward the RIGHT side of the frame — a subtle 3/4 view.
- The display content (time 10:10:38, date SAT 01, stats 25 mi, VO2 50) must still be clearly readable and right-side-up.
- 12 o'clock position is at the TOP of the watch face.
- The right-side buttons (START/STOP with lime-green accent ring, BACK in silver) should be slightly more visible/prominent than the left-side buttons.

=== BAND ORIENTATION — THIS IS THE MOST CRITICAL INSTRUCTION ===
The watch is displayed vertically, as if mounted on an invisible watch display stand in a retail store.
- The TOP strap extends UPWARD from the 12 o'clock side of the case, staying close to vertical. It may curve very gently backward (away from the camera) but remains roughly straight and narrow.
- The BOTTOM strap extends DOWNWARD from the 6 o'clock side of the case, staying close to vertical. Same gentle backward curve allowed.
- Both straps are roughly PARALLEL to each other and form a TALL, NARROW, VERTICAL silhouette.
- The overall shape is: narrow strap on top → round watch case in the middle → narrow strap on bottom.

ABSOLUTELY FORBIDDEN band behaviors:
- DO NOT splay the straps outward into a V-shape, Y-shape, or fan shape.
- DO NOT have both straps going upward (this makes it look like a medal on a ribbon).
- DO NOT merge, combine, or blend the watch with any other object.
- DO NOT turn the band into a ribbon, rope, chain, fabric, or necklace.
- The band is a simple BLACK SILICONE SPORT STRAP with a pin buckle — keep it looking exactly like that.

=== PRODUCT PLACEMENT IN FRAME ===
- The watch case is CENTERED HORIZONTALLY (at the 50% horizontal mark).
- The watch case center is at approximately 43% from the top (slightly above vertical center).
- The TOP 12% of the frame (top ~130 pixels) must be completely empty — no product, no strap tip. This area is reserved for text overlay.
- The BOTTOM 28% of the frame (bottom ~300 pixels) must be completely empty — no product, no strap tip. This area is reserved for text overlay.
- The watch + visible band should fill roughly 55% of the frame height.

=== BACKGROUND ===
{treatment["background_mood"]}
Subtle {accent_hex} light accents in the environment matching the brand accent color.
The background should be darker/muted in the top 12% and bottom 28% to ensure text readability.

=== STYLE ===
- Premium commercial product photography composited into a cinematic environment.
- Photorealistic, high resolution, 1080x1080 square format.
- Sharp focus on the product, slightly softer background.
- No text, words, letters, numbers, logos, watermarks, or typography anywhere in the image.
- No human body parts (no wrist, no hand, no arm, no fingers).
- This is a WATCH displayed floating on its own — not worn, not held, not hanging from anything visible.
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
