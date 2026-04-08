# Peitho — Build Checklist

Target: AI-powered ad agency. Full pipeline: brand intake → customer simulation → persona interrogation → targeted ad creation → massive-scale deployment → AI-driven optimization. Delivered as a service — clients buy guaranteed results, not software.

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

Goal: End-to-end AI pipeline — brand intake → customer simulation → persona interrogation → targeted ad creation → platform recommendations.

### Project Setup
- [ ] **FastAPI project structure** — Create `backend/app/main.py` with CORS middleware, `routers/`, `services/`, `models/`, `schemas/` directories. Add `requirements.txt` (fastapi, uvicorn, sqlalchemy, anthropic, pydantic, python-dotenv).
- [ ] **SQLite + SQLAlchemy setup** — Create `database.py` with engine/session factory pointing to `peitho.db`. Define models:
  - `Campaign` (id, company_name, product_description, target_market, website_url, status, created_at)
  - `BrandIntake` (id, campaign_id FK, brand_assets, customer_data, previous_ads, voice_guidelines, raw_json)
  - `SimulationAgent` (id, campaign_id FK, icp_id FK, behavioral_signature, memory, persona_type [customer/potential])
  - `ICP` (id, campaign_id FK, name, demographics, psychographics, pain_points, goals, media_habits, objections, conversion_triggers, raw_json)
  - `AdVariant` (id, campaign_id FK, icp_id FK, headline, body_copy, cta, visual_code_spec, tone, platform, status [draft/approved/rejected], raw_json)
  - `SimulationScore` (id, ad_variant_id FK, icp_id FK, attention, relevance, resonance, clarity, cta_effectiveness, overall_score, reasoning, raw_json)
  - `PlatformRecommendation` (id, campaign_id FK, platform_name, predicted_roi, reasoning, raw_json)
- [ ] **Config & env** — `.env` file for `ANTHROPIC_API_KEY`, `DATABASE_URL`. Pydantic Settings class in `config.py`.

### AI Services
- [ ] **Brand Intake Service** (`services/intake_service.py`) — Ingests brand info, customer data, brand assets, previous ads, and voice guidelines. Parses and structures all inputs for the simulation pipeline.
- [ ] **Customer Simulation Service** (`services/simulation_service.py`) — Creates AI agents representing the client's customer base + potential customers. Grounds agents in real customer data; fills gaps with synthetic data. Each agent has distinct behavioral signatures and persistent memory.
- [ ] **Persona Interrogation Service** (`services/interrogation_service.py`) — Queries simulation agents to surface wants, desires, fears, objections, and conversion triggers. Aggregates agent responses into structured persona intelligence.
- [ ] **Buyer Persona Generation Service** (`services/icp_service.py`) — Takes simulation output + campaign info. Builds buyer personas grounded in agent interrogation results, role-based psychology, and industry context.
- [ ] **Cross-Platform Ad Generation Service** (`services/ad_service.py`) — Takes persona + campaign context. Generates highly targeted ad variants addressing each persona's specific concerns and conversion triggers. Tailored to multiple platforms including niche placements, trade press, local media.
- [ ] **Platform Recommendation Service** (`services/platform_service.py`) — Given persona intelligence and media consumption data from agents, recommend every platform where these personas spend time — including niche sources agencies would never test.
- [ ] **Simulation/Scoring Service** (`services/scoring_service.py`) — Score creative variants using multi-agent simulation. Internal tool, not customer-facing.

### API Endpoints
- [ ] **Campaign CRUD** — `POST /api/campaigns` (create), `GET /api/campaigns` (list all), `GET /api/campaigns/{id}` (detail with ICPs and ads).
- [ ] **Brand Intake** — `POST /api/campaigns/{id}/intake`. Upload brand info, customer data, assets, previous ads.
- [ ] **Customer Simulation** — `POST /api/campaigns/{id}/simulate-customers`. Create and run simulation agents.
- [ ] **Persona Interrogation** — `POST /api/campaigns/{id}/interrogate`. Query agents for conversion intelligence.
- [ ] **ICP Generation** — `POST /api/campaigns/{id}/generate-icps`. Generate personas from interrogation output.
- [ ] **Ad Generation** — `POST /api/campaigns/{id}/generate-ads`. Targeted cross-platform variants.
- [ ] **Platform Recommendations** — `POST /api/campaigns/{id}/recommend-platforms`. Surface every platform where personas spend time.
- [ ] **Scoring** — `POST /api/campaigns/{id}/score-ads`. Score variants against simulated personas.
- [ ] **Export** — `GET /api/campaigns/{id}/export`. Approved ads formatted per platform spec.

### Integration Test
- [ ] **End-to-end test script** (`tests/test_pipeline.py`) — Brand intake → simulate customers → interrogate agents → generate personas → generate ads → get platform recommendations → score → export. Verify persona depth and platform diversity in output.

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

Goal: First paying clients. Handle everything end-to-end — brand intake through deployment and optimization.

- [ ] **SMB pilot** — Full pipeline for one SMB client. Intake → simulation → ads → deploy across 10+ platforms → track → optimize. Prove massive-scale deployment value.
- [ ] **Enterprise pilot** — Full pipeline for one enterprise client. Commission on leads generated. Deploy persona-specific creative across every platform the buying committee uses.
- [ ] **Automated deployment pipeline** — Push creative directly to platforms via API. Launch across niche media sources, not just Meta/Google.
- [ ] **AI performance tracking** — Track every source in real time. AI recommends (and eventually auto-executes) budget reallocation to highest-converting sources.
- [ ] **Content / brand building** — Daily short-form content (TikTok, YouTube Shorts, LinkedIn). Film B-roll, record voiceovers. Non-negotiable.

---

## Phase 4: Scale

- [ ] **Full platform API integrations** — LinkedIn Ads, programmatic DSPs, Meta, Google, niche publishers. Automated deployment at scale.
- [ ] **Automated budget reallocation** — AI continuously shifts budget to whatever converts best. No manual intervention.
- [ ] **Cross-platform campaign orchestration** — Coordinated "surround sound" from a single brand intake — LinkedIn for professional context, display for ambient awareness, trade press for credibility, CTV for evening reach.
- [ ] **Creative fatigue detection** — Auto-detect when ads fatigue, generate replacement variants, deploy automatically.
- [ ] **Productize into SaaS** — Once the service model is refined across 15-20 customers.
