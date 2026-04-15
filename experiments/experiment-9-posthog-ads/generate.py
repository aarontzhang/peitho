#!/usr/bin/env python3
"""
Experiment 9: PostHog — typographic hero ads for a software platform.

No product JSON. No product render. The copy is the hero, the background is a
quiet canvas. Falls back to a procedural PIL canvas if Gemini is unavailable
or returns something unusable.

Usage: python3 generate.py campaigns/posthog.json
"""

import json
import os
import shutil
import sys
from pathlib import Path

from image_gen import generate_background, render_procedural_background
from text_overlay import create_layers

EXPERIMENT_DIR = Path(__file__).parent
OUTPUT_SIZE = (1080, 1080)


def load_campaign(path: str) -> dict:
    config_path = EXPERIMENT_DIR / path
    with open(config_path) as f:
        config = json.load(f)

    brand_system_path = EXPERIMENT_DIR / config["product"]["brand_system_path"]
    with open(brand_system_path) as f:
        config["product"]["_brand_system"] = json.load(f)

    assert "brand" in config, "Missing 'brand'"
    assert "product" in config, "Missing 'product'"
    assert "icps" in config and len(config["icps"]) > 0, "Need at least 1 ICP"

    for icp in config["icps"]:
        assert "id" in icp, "Each ICP needs an 'id'"
        assert "copy" in icp, f"ICP '{icp['id']}' missing 'copy'"
        assert "visual_treatment" in icp, f"ICP '{icp['id']}' missing 'visual_treatment'"
        for field in ("headline", "subline", "cta"):
            assert field in icp["copy"], f"ICP '{icp['id']}' copy missing '{field}'"
        for field in ("background_mood", "palette"):
            assert field in icp["visual_treatment"], f"ICP '{icp['id']}' treatment missing '{field}'"

    return config


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 generate.py campaigns/<campaign>.json")
        sys.exit(1)

    campaign_path = sys.argv[1]
    config = load_campaign(campaign_path)

    brand = config["brand"]
    product = config["product"]
    brand_system = product["_brand_system"]
    icps = config["icps"]

    # Stable output folder — final ads at the top level, intermediates in layers/.
    brand_slug = brand["name"].lower().replace(" ", "-")
    output_dir = EXPERIMENT_DIR / "output" / brand_slug
    if output_dir.exists():
        shutil.rmtree(output_dir)
    layers_dir = output_dir / "layers"
    layers_dir.mkdir(parents=True, exist_ok=True)

    shutil.copy2(EXPERIMENT_DIR / campaign_path, layers_dir / "campaign.json")

    print(f"Campaign: {brand['name']} — {product['name']}")
    print(f"ICPs: {len(icps)}")
    print(f"Output: {output_dir}")
    print()

    results = []

    for i, icp in enumerate(icps, 1):
        icp_id = icp["id"]
        treatment = icp["visual_treatment"]
        copy = icp["copy"]

        print(f"[{i}/{len(icps)}] ICP: {icp.get('label', icp_id)}")
        print(f"  Platform: {icp.get('platform', 'unspecified')}")
        print(f"  Headline: {copy['headline'].replace(chr(10), ' / ')}")

        # For typographic-hero ads we prefer a procedural canvas: guaranteed
        # quiet, guaranteed no-compete with the copy. Set USE_GEMINI_BG=1 to
        # let Gemini generate the background instead.
        use_gemini = os.environ.get("USE_GEMINI_BG") == "1"

        bg_style = icp.get("bg_style", "corner_glow")
        layout = icp.get("layout", "centered_hero")

        if use_gemini:
            bg, prompt = generate_background(brand_system, treatment, brand)
            with open(layers_dir / f"{icp_id}_prompt.txt", "w") as f:
                f.write(prompt)
            if bg is None:
                print("  Gemini failed — falling back to procedural canvas")
                bg = render_procedural_background(treatment, style=bg_style)
                bg_source = "procedural (fallback)"
            else:
                bg_source = "gemini"
        else:
            bg = render_procedural_background(treatment, style=bg_style)
            bg_source = f"procedural ({bg_style})"
            with open(layers_dir / f"{icp_id}_prompt.txt", "w") as f:
                f.write(f"Procedural canvas ({bg_style}) — see image_gen.render_procedural_background\n")

        layers = create_layers(bg, copy, treatment, brand, layout=layout)

        layers["background"].save(layers_dir / f"{icp_id}_bg.png")
        layers["gradient"].save(layers_dir / f"{icp_id}_gradient.png")
        layers["text"].save(layers_dir / f"{icp_id}_text.png")
        layers["composite"].save(output_dir / f"{icp_id}_ad.png", optimize=True)

        print(f"  Saved (bg: {bg_source}): {icp_id}_bg.png, _gradient.png, _text.png, _ad.png\n")
        results.append({"icp": icp_id, "status": "ok", "bg": bg_source})

    ok = sum(1 for r in results if r["status"] == "ok")
    print(f"{'='*50}")
    print(f"DONE — {ok}/{len(icps)} ads generated")
    print(f"Output: {output_dir}")
    for r in results:
        print(f"  {r['icp']}: OK (bg: {r['bg']})")


if __name__ == "__main__":
    main()
