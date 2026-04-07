# Peitho — Build Checklist

Target: AI-powered ad agency MVP. Cross-platform ad distribution, creative generation, and performance consolidation — delivered as a service.

**Stack:** Next.js 15 + Tailwind + shadcn/ui | Python FastAPI | Anthropic Claude API | SQLite (Supabase later) | Google Cloud

**Development philosophy:** Ship working code, refactor later when there's user demand. Don't over-optimize early.

---

## Phase 0: Customer Discovery & Validation

Goal: Validate the two entry points before building too much.

- [ ] **Read *The Mom Test*** — digest key frameworks for customer interviews
- [ ] **5 SMB discovery interviews** — local businesses (flooring, plumbing, etc.). Understand current ad spend, platforms used, pain points.
- [ ] **5 enterprise lead gen discovery interviews** — understand current agency relationships, what they'd pay commission on, decision-making process
- [ ] **Competitive landscape research** — AI ad space, existing cross-platform tools, agency automation plays
- [ ] **Define first paid engagement** — one real client, either SMB or enterprise, running real ads through our pipeline

---

## Phase 1: Core Pipeline (Backend)

Goal: End-to-end AI pipeline — campaign brief in, cross-platform ad creative + platform recommendations out.

### Project Setup
- [ ] **FastAPI project structure** — Create `backend/app/main.py` with CORS middleware, `routers/`, `services/`, `models/`, `schemas/` directories. Add `requirements.txt` (fastapi, uvicorn, sqlalchemy, anthropic, pydantic, python-dotenv).
- [ ] **SQLite + SQLAlchemy setup** — Create `database.py` with engine/session factory pointing to `peitho.db`. Define models:
  - `Campaign` (id, company_name, product_description, target_market, website_url, status, created_at)
  - `ICP` (id, campaign_id FK, name, demographics, psychographics, pain_points, goals, media_habits, objections, raw_json)
  - `AdVariant` (id, campaign_id FK, icp_id FK, headline, body_copy, cta, visual_code_spec, tone, platform, status [draft/approved/rejected], raw_json)
  - `SimulationScore` (id, ad_variant_id FK, icp_id FK, attention, relevance, resonance, clarity, cta_effectiveness, overall_score, reasoning, raw_json)
  - `PlatformRecommendation` (id, campaign_id FK, platform_name, predicted_roi, reasoning, raw_json)
- [ ] **Config & env** — `.env` file for `ANTHROPIC_API_KEY`, `DATABASE_URL`. Pydantic Settings class in `config.py`.

### AI Services
- [ ] **Buyer Persona Generation Service** (`services/icp_service.py`) — Takes campaign info. Builds buyer personas grounded in role-based psychology. For SMB: business owner profile + customer archetypes. For enterprise: buying committee roles (CTO, CFO, VP Eng, procurement).
- [ ] **Cross-Platform Ad Generation Service** (`services/ad_service.py`) — Takes persona + campaign context. Generates ad variants tailored to multiple platforms (not just Meta/LinkedIn — include niche placements, trade press, local media). Each variant includes platform rationale.
- [ ] **Platform Recommendation Service** (`services/platform_service.py`) — Given a campaign brief and ICP, recommend which platforms to test and why. Model expected performance across platforms before spending budget. This is the core differentiator.
- [ ] **Simulation/Scoring Service** (`services/scoring_service.py`) — Internal tool. Model how campaigns will perform across platforms. Score creative variants. Not customer-facing.

### API Endpoints
- [ ] **Campaign CRUD** — `POST /api/campaigns` (create), `GET /api/campaigns` (list all), `GET /api/campaigns/{id}` (detail with ICPs and ads).
- [ ] **ICP Generation** — `POST /api/campaigns/{id}/generate-icps`.
- [ ] **Ad Generation** — `POST /api/campaigns/{id}/generate-ads`. Cross-platform variants.
- [ ] **Platform Recommendations** — `POST /api/campaigns/{id}/recommend-platforms`. Surface where to spend.
- [ ] **Scoring** — `POST /api/campaigns/{id}/score-ads`. Score variants against target personas.
- [ ] **Export** — `GET /api/campaigns/{id}/export`. Approved ads formatted per platform spec.

### Integration Test
- [ ] **End-to-end test script** (`tests/test_pipeline.py`) — Create campaign → generate personas → generate cross-platform ads → get platform recommendations → score → export. Verify platform diversity in output.

---

## Phase 2: Frontend Dashboard

Goal: Internal dashboard to drive the service workflow. Not customer-facing yet.

### Project Setup
- [ ] **Initialize Next.js 15 app** — App Router, TypeScript, Tailwind, shadcn/ui.
- [ ] **API client layer** — Typed fetch wrappers for all backend endpoints.

### Pages
- [ ] **Campaign List** — List campaigns, "New Campaign" button.
- [ ] **Campaign Dashboard** — Tabbed layout:
  - **ICPs tab**: Persona cards with key details.
  - **Ads tab**: Grouped by ICP, sorted by score. Cross-platform variants visible.
  - **Platform Recommendations tab**: Which platforms to test, predicted ROI, reasoning.
  - **Export tab**: Platform selector, download formatted ads.

---

## Phase 3: Go Live as Service

Goal: First paying clients through both entry points.

- [ ] **SMB pilot** — Run ads for one SMB client across multiple platforms. Consolidate performance data. Prove cross-platform value.
- [ ] **Enterprise pilot** — Run lead gen campaign for one enterprise client. Commission model.
- [ ] **Performance dashboard** — Consolidated cross-platform performance view. What's working where.
- [ ] **Content / brand building** — Daily short-form content (TikTok, YouTube Shorts, LinkedIn). Film B-roll, record voiceovers. Non-negotiable.

---

## Phase 4: Scale

- [ ] **Platform API integrations** — LinkedIn Ads, programmatic DSPs, Meta. Push creative directly.
- [ ] **Performance tracking pipeline** — Pull metrics back from platforms. Map performance to platforms, personas, and creative angles.
- [ ] **Cross-platform campaign orchestration** — Coordinated "surround sound" from a single brief.
- [ ] **Productize into SaaS** — Once the service model is refined across 15-20 customers.
