# Peitho MVP — Build Checklist

Target: Functional MVP in 1-2 days. AI-powered hyper-personalized ad generation pipeline with a dashboard UI.

**Stack:** Next.js 15 + Tailwind + shadcn/ui | Python FastAPI | Anthropic Claude API | SQLite

---

## Day 1: Core Pipeline (Backend)

Goal: End-to-end AI pipeline — campaign in, scored ad variants out.

### Project Setup
- [ ] **FastAPI project structure** — Create `backend/app/main.py` with CORS middleware, `routers/`, `services/`, `models/`, `schemas/` directories. Add `requirements.txt` (fastapi, uvicorn, sqlalchemy, anthropic, pydantic, python-dotenv).
- [ ] **SQLite + SQLAlchemy setup** — Create `database.py` with engine/session factory pointing to `peitho.db`. Define models:
  - `Campaign` (id, company_name, product_description, target_market, website_url, status, created_at)
  - `ICP` (id, campaign_id FK, name, demographics, psychographics, pain_points, goals, media_habits, objections, raw_json)
  - `AdVariant` (id, campaign_id FK, icp_id FK, headline, body_copy, cta, image_prompt, tone, platform, status [draft/approved/rejected], raw_json)
  - `SimulationScore` (id, ad_variant_id FK, icp_id FK, attention, relevance, resonance, clarity, cta_effectiveness, overall_score, reasoning, raw_json)
- [ ] **Config & env** — `.env` file for `ANTHROPIC_API_KEY`, `DATABASE_URL`. Pydantic Settings class in `config.py`.

### AI Services
- [ ] **ICP Generation Service** (`services/icp_service.py`) — Takes campaign info (company, product, market, URL). Builds a prompt asking Claude to generate 3-8 detailed ICP segments. Each ICP includes: name, age range, income, job title, psychographic profile, pain points, goals, media consumption habits, likely objections. Parse structured JSON response. Store each ICP in DB linked to campaign.
- [ ] **Ad Generation Service** (`services/ad_service.py`) — Takes a single ICP profile + campaign context. Prompts Claude to generate 5-15 ad variants tailored to that ICP. Each variant: headline (max 40 chars), body copy (max 125 chars for Meta, longer for others), CTA text, image prompt (for DALL-E/Midjourney), emotional tone, suggested platform. Parse and store in DB.
- [ ] **Simulation/Scoring Service** (`services/scoring_service.py`) — Takes an ICP profile + ad variant. Prompts Claude to role-play AS that ICP persona: "You are [name], a [demographics]. You see this ad while [context]. Rate it." Return scores 1-10 for: attention grab, personal relevance, emotional resonance, message clarity, CTA effectiveness. Also return a written reasoning paragraph. Compute weighted overall score. Store in DB.

### API Endpoints
- [ ] **Campaign CRUD** — `POST /api/campaigns` (create), `GET /api/campaigns` (list all), `GET /api/campaigns/{id}` (detail with ICPs and ads).
- [ ] **ICP Generation** — `POST /api/campaigns/{id}/generate-icps`. Calls ICP service, returns generated ICPs. Idempotent — clears old ICPs if re-run.
- [ ] **Ad Generation** — `POST /api/campaigns/{id}/generate-ads`. Iterates all ICPs for the campaign, generates ad variants for each. Optional query param `?icp_id=X` to generate for a single ICP.
- [ ] **Scoring** — `POST /api/campaigns/{id}/score-ads`. Scores all unscored ad variants against their target ICP. Returns scores sorted by overall rating.
- [ ] **Ad Status Update** — `PATCH /api/ads/{id}` with `{ "status": "approved" | "rejected" }`.
- [ ] **Export** — `GET /api/campaigns/{id}/export?platform=meta|linkedin|google`. Returns approved ads formatted to platform specs (character limits, field mapping). JSON response, optionally CSV download.

### Prompt Engineering
- [ ] **Write and test ICP prompt** — System prompt establishing Claude as a market research expert. Few-shot example of good ICP output. Enforce JSON schema in the prompt. Temperature ~0.7 for creativity.
- [ ] **Write and test ad generation prompt** — System prompt as world-class copywriter. Include the full ICP as context. Request diverse tones across variants (urgent, aspirational, fear-based, social-proof, etc.). Temperature ~0.8.
- [ ] **Write and test scoring prompt** — System prompt: "You ARE this person." Include full ICP and ad. Request structured scoring with mandatory reasoning. Temperature ~0.3 for consistency.

### Integration Test
- [ ] **End-to-end test script** (`tests/test_pipeline.py`) — Create campaign for a sample company → generate ICPs → generate ads for each ICP → score all ads → verify top-scored ads make sense → export to Meta format. Use `httpx` against running server. Print summary: X ICPs, Y total ads, top 3 ads with scores.

---

## Day 2: Frontend Dashboard

Goal: Clean, usable dashboard to drive the full workflow.

### Project Setup
- [ ] **Initialize Next.js 15 app** — `npx create-next-app@latest frontend` with App Router, TypeScript, Tailwind. Install shadcn/ui (`npx shadcn-ui@latest init`). Add components: Button, Card, Input, Textarea, Badge, Dialog, Tabs, Select, Skeleton, Toast.
- [ ] **API client layer** — `lib/api.ts` with typed fetch wrappers for all backend endpoints. Base URL from env var `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`).
- [ ] **Types** — `types/index.ts` mirroring backend schemas: Campaign, ICP, AdVariant, SimulationScore, ExportFormat.

### Pages
- [ ] **Landing / Campaign List** (`app/page.tsx`) — List existing campaigns as cards (name, date, status, ICP count, ad count). "New Campaign" button.
- [ ] **Campaign Creation** (`app/campaigns/new/page.tsx`) — Form with fields: Company Name, Product/Service Description (textarea), Target Market, Website URL. Submit creates campaign via API, redirects to dashboard.
- [ ] **Campaign Dashboard** (`app/campaigns/[id]/page.tsx`) — Tabbed layout:
  - **ICPs tab**: Cards for each ICP showing name, key demographics, pain points. "Generate ICPs" button (shows loading state during generation). Click card to expand full profile in a dialog.
  - **Ads tab**: Grouped by ICP. Each ad variant shows headline, body preview, score badge (color-coded: green >7, yellow 5-7, red <5). "Generate Ads" and "Score Ads" buttons with progress indicators.
  - **Export tab**: Platform selector (Meta, LinkedIn, Google Display). Preview formatted ads. Download button.
- [ ] **Ad Detail / Edit Dialog** — Full ad variant view: all fields editable. Score breakdown as a radar chart or bar chart (use recharts or just styled bars). Approve / Reject buttons. Save edits.

### UX Polish
- [ ] **Loading states** — Skeleton loaders for cards while data fetches. Spinner overlays during AI generation (which can take 10-30s). Disable buttons during processing.
- [ ] **Error handling** — Toast notifications for API errors. Retry buttons. Form validation on campaign creation.
- [ ] **Responsive layout** — Works on desktop and tablet. Sidebar nav or top nav with campaign breadcrumb.
- [ ] **Score visualization** — Color-coded score badges. Score breakdown tooltip or expandable section on each ad card. Sort ads by score within each ICP group.
- [ ] **Empty states** — Helpful messages when no ICPs/ads generated yet with clear CTAs to trigger generation.

---

## Phase 2 (Future — Real Ad Platform Integration)

- [ ] **Meta Ads API integration** — OAuth flow, campaign creation, audience targeting from ICPs, automated ad upload with approved creatives.
- [ ] **Google Ads API integration** — Responsive display ads, audience segments, conversion tracking setup.
- [ ] **LinkedIn Ads API integration** — Sponsored content creation, matched audiences from ICP firmographics.
- [ ] **Performance tracking pipeline** — Ingest CTR, CPC, conversion rate from ad platforms. Store per-variant metrics. Dashboard showing real vs simulated performance.
- [ ] **ICP refinement loop** — Compare simulated scores vs actual performance. Fine-tune ICP profiles and scoring weights. Flag when simulation diverges from reality.
- [ ] **A/B test management** — Auto-create A/B tests from top-scored variants. Statistical significance calculator. Auto-pause underperformers.
- [ ] **Budget allocation engine** — Distribute budget across ICPs proportional to predicted/actual ROAS. Rebalance daily.

## Phase 3+ (Future — Scale & Autonomy)

- [ ] **Video ad generation** — Generate video scripts per ICP. Integrate with video generation APIs (Runway, Pika). Auto-edit templates with generated copy.
- [ ] **Multi-language ad generation** — Detect target market languages. Generate culturally-adapted (not just translated) ad variants.
- [ ] **Autonomous campaign management** — Agent loop: monitor performance → pause losers → scale winners → generate new variants → repeat. Human-in-the-loop approval gates.
- [ ] **Population-scale simulation** — Simulate thousands of synthetic personas (not just ICP archetypes). Monte Carlo scoring for confidence intervals on ad performance.
- [ ] **Competitive intelligence module** — Scrape competitor ad libraries (Meta Ad Library, Google Ads Transparency). Analyze positioning gaps. Generate counter-positioning ads.
- [ ] **Cross-platform attribution** — Unified view of ad performance across all platforms. Multi-touch attribution modeling. Customer journey visualization.
