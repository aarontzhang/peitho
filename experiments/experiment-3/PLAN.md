# Experiment 3 — Plan

## Idea
Use Figma MCP to generate the poster layout/template (typography, colors, shapes, CTA), then use Gemini 3.1 Flash ("Nano Banana") to generate a brand-appropriate background image and insert it into the Figma frame as an image fill.

## Steps

1. **Figma MCP** — Create poster template per brand (done for Nike, Airbnb, Tesla, Spotify, Glossier)
2. **Gemini 3.1 Flash** — Generate a full-bleed background image per brand with a prompt tailored to its visual identity
3. **Figma MCP** — Add a large near-full-screen image frame to each poster, push the Gemini-generated image in via `figma.createImage(bytes)`
4. Screenshot final results and compare

## Blocked on
- Figma MCP Starter plan rate limit (resets daily)

## Before resuming
Upgrade Figma to Pro, or wait for rate limit reset. Then run: generate images with Gemini, push into Figma.
