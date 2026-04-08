"""
Gemini image generation module.

Sends product JSON + visual treatment to Gemini 3.1 Flash Image (Nano Banana 2)
and returns a PIL Image with the product rendered in scene.
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

# ---------------------------------------------------------------------------
# Composition templates — tell Gemini where to place the product
# ---------------------------------------------------------------------------

COMPOSITION_TEMPLATES = {
    "right": """PRODUCT PLACEMENT (THIS IS THE MOST IMPORTANT INSTRUCTION):
- Place the product firmly in the RIGHT 30% of the frame. The product's CENTER must be past the 70% horizontal mark.
- The LEFT 55% of the image MUST be completely empty — only atmospheric background, zero product parts.
- Nothing from the product (no strap, no edge, no shadow) may appear in the left half.
- Background is darkest on the far left, gradually lighter toward the product on the right.""",

    "left": """PRODUCT PLACEMENT (THIS IS THE MOST IMPORTANT INSTRUCTION):
- Place the product firmly in the LEFT 30% of the frame. The product's CENTER must be before the 30% horizontal mark.
- The RIGHT 55% of the image MUST be completely empty — only atmospheric background, zero product parts.
- Nothing from the product (no strap, no edge, no shadow) may appear in the right half.
- Background is darkest on the far right, gradually lighter toward the product on the left.""",

    "center-upper": """PRODUCT PLACEMENT (THIS IS THE MOST IMPORTANT INSTRUCTION):
- Place the product in the UPPER CENTER of the frame. The product's center must be above the 40% vertical mark.
- The BOTTOM 50% of the image MUST be completely empty — only atmospheric background, zero product parts.
- Nothing from the product (no strap hanging down, no shadow) may appear in the bottom half.
- Background is darkest at the bottom, gradually lighter toward the product above.""",
}

# ---------------------------------------------------------------------------
# Pose templates — different angles for visual variety
# ---------------------------------------------------------------------------

POSE_TEMPLATES = {
    "3/4-left-standard": "3/4 front view, watch tilted ~30 degrees from vertical, face angled toward upper-left. Camera is slightly above center. Band curves naturally as if on an invisible wrist — top strap curves back, bottom strap curves forward. All 5 buttons visible. This is the standard Garmin product photography angle.",
}


def generate_product_image(product_json: dict, visual_treatment: dict, brand: dict) -> Image.Image | None:
    """
    Generate a product hero image via Gemini.

    Args:
        product_json: Full product specification (the garmin-style JSON).
        visual_treatment: ICP's visual treatment config with background_mood,
                         palette, layout, product_position, and pose.
        brand: Brand config with name and visual_identity.

    Returns:
        PIL Image or None on failure.
    """
    prompt = _build_prompt(product_json, visual_treatment, brand)
    return _call_gemini(prompt, label=visual_treatment.get("background_mood", "image"))


def _build_prompt(product_json: dict, treatment: dict, brand: dict) -> str:
    """Build the Gemini prompt from product JSON + treatment config."""
    position = treatment["product_position"]
    composition = COMPOSITION_TEMPLATES[position]
    accent_hex = treatment["palette"]["bg_accent"]

    pose_key = treatment.get("pose", "3/4-left-standard")
    pose_desc = POSE_TEMPLATES.get(pose_key, POSE_TEMPLATES["3/4-left-standard"])

    return f"""Generate a 1080x1080 premium advertisement image featuring this product.

Here is the full product specification as JSON:

{json.dumps(product_json, indent=2)}

Use the JSON above to accurately render this product as the hero of the image.
Pay close attention to the physical form, color palette, button layout, display content, and all visual details described in the spec.

PRODUCT ANGLE/POSE:
{pose_desc}

{composition}

Background: {treatment["background_mood"]}
Subtle {accent_hex} light accents in the environment matching the product's accent color.

Style: Premium commercial product photography composited into a cinematic environment.
Photorealistic, high quality, 1080x1080 square.
No text, words, letters, logos, or typography anywhere in the image.
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
