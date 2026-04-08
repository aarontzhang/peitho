# Experiment 3 — Figma MCP Brand Poster Generation

## Goal
Test using Figma MCP to programmatically generate marketing posters for different brands, exploring how well AI-driven design tooling can produce varied visual assets purely through code.

## Figma File
[Experiment 3 — Brand Marketing Posters](https://www.figma.com/design/LkUTgvgYGykGlx17DexMMU)

## Brands

| Brand | Style | Page |
|-------|-------|------|
| Nike | Dark bg, orange accents, bold typography, action-oriented | Nike |
| Airbnb | Coral gradient hero, warm off-white, stats row, community feel | Airbnb |
| Tesla | Dark gradient, spec grid, thin/black type contrast, minimal | Tesla |
| Spotify | Dark bg, colorful gradient blobs, green/pink duotone, Wrapped theme | Nike (2nd frame) |
| Glossier | Blush pastels, soft pink palette, product circles, light typography | Airbnb (2nd frame) |

## Format
- 1080x1350px (Instagram portrait)
- Typography only (Inter family) — no imported imagery
- Built via `use_figma` tool (Figma Plugin API)

## Observations
- Figma MCP handles layout, typography, gradients, and shapes well
- No image import via Plugin API — designs are type/shape only
- Starter plan limits: 3 pages max, rate-limited tool calls
- Each poster took a single `use_figma` call with ~100 lines of JS
