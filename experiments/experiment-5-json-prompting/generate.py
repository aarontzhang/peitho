#!/usr/bin/env python3
"""
Experiment 5: Reusable JSON-Prompting Ad Pipeline

Reads a campaign config JSON, generates visually distinct ads for each ICP
using Gemini 3.1 Flash Image (Nano Banana 2) for product rendering and
Pillow for text overlay.

Usage: python3 generate.py campaigns/garmin.json
"""

import json
import shutil
import sys
from datetime import datetime
from pathlib import Path

from image_gen import generate_product_image
from text_overlay import overlay_text

EXPERIMENT_DIR = Path(__file__).parent


def load_campaign(path: str) -> dict:
    """Load and validate a campaign config JSON."""
    config_path = EXPERIMENT_DIR / path
    with open(config_path) as f:
        config = json.load(f)

    # Load the product JSON from its path
    product_json_path = EXPERIMENT_DIR / config["product"]["product_json_path"]
    with open(product_json_path) as f:
        config["product"]["_product_json"] = json.load(f)

    # Validate basics
    assert "brand" in config, "Missing 'brand' in campaign config"
    assert "product" in config, "Missing 'product' in campaign config"
    assert "icps" in config and len(config["icps"]) > 0, "Need at least 1 ICP"

    for icp in config["icps"]:
        assert "id" in icp, "Each ICP needs an 'id'"
        assert "copy" in icp, f"ICP '{icp['id']}' missing 'copy'"
        assert "visual_treatment" in icp, f"ICP '{icp['id']}' missing 'visual_treatment'"
        for field in ("headline", "subline", "cta"):
            assert field in icp["copy"], f"ICP '{icp['id']}' copy missing '{field}'"
        for field in ("background_mood", "palette", "layout", "product_position"):
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
    product_json = product["_product_json"]
    icps = config["icps"]

    # Create timestamped output directory
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    brand_slug = brand["name"].lower().replace(" ", "-")
    output_dir = EXPERIMENT_DIR / "output" / f"{brand_slug}_{timestamp}"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Save campaign snapshot
    shutil.copy2(EXPERIMENT_DIR / campaign_path, output_dir / "campaign.json")

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
        print(f"  Layout: {treatment['layout']} | Product: {treatment['product_position']}")
        print(f"  Headline: {copy['headline'].replace(chr(10), ' / ')}")

        # Step 1: Generate product image via Gemini
        bg = generate_product_image(product_json, treatment, brand)
        if not bg:
            print(f"  FAILED — skipping\n")
            results.append({"icp": icp_id, "status": "failed"})
            continue

        # Save raw background
        bg.save(output_dir / f"{icp_id}_bg.png")

        # Step 2: Overlay text
        final = overlay_text(bg, copy, treatment, brand)
        final.save(output_dir / f"{icp_id}_ad.png", quality=95)

        print(f"  Saved: {icp_id}_ad.png\n")
        results.append({"icp": icp_id, "status": "ok"})

    # Summary
    ok = sum(1 for r in results if r["status"] == "ok")
    print(f"{'='*50}")
    print(f"DONE — {ok}/{len(icps)} ads generated")
    print(f"Output: {output_dir}")
    for r in results:
        status = "OK" if r["status"] == "ok" else "FAILED"
        print(f"  {r['icp']}: {status}")


if __name__ == "__main__":
    main()
