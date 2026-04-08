#!/usr/bin/env python3
"""
Experiment 6: Structured Ad Pipeline with Zone-Based Layout

Fixes over Experiment 5:
1. Anti-hallucination prompting (no more medal-watches)
2. Straight-on pose (display always readable)
3. Zone-based text layout (no overlap, Apple Watch ad style)

Usage: python3 generate.py campaigns/garmin.json
"""

import json
import shutil
import sys
from datetime import datetime
from pathlib import Path

from image_gen import generate_product_image
from text_overlay import create_layers

EXPERIMENT_DIR = Path(__file__).parent


def load_campaign(path: str) -> dict:
    """Load and validate a campaign config JSON."""
    config_path = EXPERIMENT_DIR / path
    with open(config_path) as f:
        config = json.load(f)

    # Load the product JSON
    product_json_path = EXPERIMENT_DIR / config["product"]["product_json_path"]
    with open(product_json_path) as f:
        config["product"]["_product_json"] = json.load(f)

    # Validate
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
        print(f"  Headline: {copy['headline'].replace(chr(10), ' / ')}")

        # Step 1: Generate product image via Gemini
        bg, prompt = generate_product_image(product_json, treatment, brand)

        # Save the prompt for debugging
        with open(output_dir / f"{icp_id}_prompt.txt", "w") as f:
            f.write(prompt)

        if not bg:
            print(f"  FAILED — skipping\n")
            results.append({"icp": icp_id, "status": "failed"})
            continue

        # Step 2: Create separate layers + composite
        layers = create_layers(bg, copy, treatment, brand)

        # Save each layer independently for editing
        layers["background"].save(output_dir / f"{icp_id}_bg.png", quality=95)
        layers["gradient"].save(output_dir / f"{icp_id}_gradient.png")
        layers["text"].save(output_dir / f"{icp_id}_text.png")
        layers["composite"].save(output_dir / f"{icp_id}_ad.png", quality=95)

        print(f"  Saved: {icp_id}_bg.png, _gradient.png, _text.png, _ad.png\n")
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
