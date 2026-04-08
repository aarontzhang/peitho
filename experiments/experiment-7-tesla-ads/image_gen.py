"""
Experiment 7: Gemini image generation adapted for automotive (Tesla).

Key differences from Experiment 6 (Garmin watch):
- Car-specific composition: vehicle fills mid-frame, ground plane visible
- No band/strap logic — replaced with wheel/stance instructions
- Environmental backgrounds replace product-on-stand concept
- Zone-aware composition still reserves top/bottom for text overlay
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
    Generate a Tesla hero image via Gemini.

    Returns:
        (PIL Image or None, prompt string used)
    """
    prompt = _build_prompt(product_json, visual_treatment, brand)
    img = _call_gemini(prompt, label=visual_treatment.get("background_mood", "image"))
    return img, prompt


def _build_prompt(product_json: dict, treatment: dict, brand: dict) -> str:
    """Build Gemini prompt for automotive product photography."""
    accent_hex = treatment["palette"]["bg_accent"]

    return f"""Generate a 1080x1080 premium automotive photography image.

PRODUCT SPECIFICATION (render this car exactly as described):

{json.dumps(product_json, indent=2)}

Use the JSON above to accurately render: body shape, headlight style, wheel design, exterior color, and proportions.

=== CAMERA & COMPOSITION ===
- 3/4 front view: camera positioned front-left, roughly 25-30 degrees from head-on.
- Camera height: slightly below the car's belt line (low, heroic perspective).
- The car's front fascia and driver-side profile are both clearly visible.
- The car is facing toward the RIGHT side of the frame.
- The grille-less, smooth front of the Tesla must be clearly visible — this is the signature design element.
- Slim blade LED headlights must be visible and sharp.

=== CAR PLACEMENT IN FRAME ===
- The car occupies the MIDDLE of the frame, centered horizontally.
- The car center is at approximately 55% from the top (slightly below vertical center).
- TOP 15% of the frame (top ~160 pixels): COMPLETELY EMPTY of any car parts. Reserved for text overlay.
- BOTTOM 20% of the frame (bottom ~215 pixels): ground plane and shadows only — no important car details. Reserved for text overlay.
- The car (bumper to bumper) should span roughly 75-80% of the frame width.

=== GROUND AND ENVIRONMENT ===
{treatment["background_mood"]}
- The car sits firmly on a ground surface — it is NOT floating.
- Subtle shadow beneath the car for grounding.
- Subtle {accent_hex} color accents in the environment (reflections, light sources, atmosphere).
- Background should be darker/muted in the top 15% and bottom 20% for text readability.

=== CRITICAL STYLE RULES ===
- This is a REAL car photographed in an environment — not a render, not a toy, not a drawing.
- Premium commercial automotive photography, cinematic quality.
- Photorealistic, 1080x1080 square format.
- Sharp focus on the car body, slightly softer background (shallow depth of field).
- The car's Ultra Red multi-coat paint should show depth and reflections.
- NO text, words, letters, numbers, logos, watermarks, or typography anywhere in the image.
- NO license plates.
- NO people visible.
- NO other cars in the frame.
- The car is the sole subject — clean, minimal, powerful.

=== BRAND AESTHETIC ===
- Tesla's design language is ultra-minimal: clean surfaces, no unnecessary details.
- The image should feel premium and forward-looking, never busy or cluttered.
- Negative space is a feature, not a problem.
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
