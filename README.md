# Peitho

**AI-Powered Hyper-Personalized Advertising at Scale**

Peitho generates highly targeted ad variants by building detailed ICPs from your company info and existing customer data, creating dozens of tailored ad creatives with code-based visuals per segment, and scoring each ad through multi-agent simulation. Human-in-the-loop at every stage. The result: a ranked portfolio of ads optimized for each customer persona before you spend a dollar on media.

> *Named after the Greek goddess of persuasion.*

---

## The Problem

Digital advertising is stuck in a loop of broad targeting and generic creative. Marketers manually build 2-3 audience segments, write a handful of ad variants, and rely on expensive live A/B testing to find what works. Most ad spend is wasted on the wrong message reaching the wrong person. The feedback cycle takes weeks and thousands of dollars.

## The Solution

Peitho inverts the process:

1. **Deep ICP Generation** — Given your company, product, and market, Claude builds 3-8 richly detailed customer personas: demographics, psychographics, pain points, goals, media habits, and likely objections. When real customer data is available, ICPs are grounded in actual purchase patterns and demographics rather than generated from scratch.
2. **Hyper-Personalized Ad Creation** — For each ICP, Claude generates 5-15 ad variants with diverse emotional tones, CTAs, and angles. Visuals are generated programmatically using code-based tools (Claude Code, Figma MCP, Re:Motion), incorporating uploaded brand assets for pixel-perfect control.
3. **Multi-Agent Simulation Scoring** — Multiple simulation agents per ICP — each with persistent memory and unique behavioral signatures — evaluate ads across multiple runs. Scores emerge from agent behavior patterns, not single prompts. Human feedback is incorporated into agent memory.
4. **Platform-Ready Export** — Approved ads — including rendered visuals from code-based generation — are formatted to Meta, LinkedIn, and Google Display specs, ready for upload.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                        │
│  Campaign Creation → Data Upload → Brand Assets → ICP Review │
│  → Ad Gallery → Agent Feedback → Visual Iteration → Export   │
└────────────────────────────┬────────────────────────────────┘
                             │ REST API
┌────────────────────────────┴────────────────────────────────┐
│                      FastAPI Backend                          │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │
│  │   Data    │  │   ICP    │  │    Ad     │  │  Agent    │  │
│  │ Ingestion │  │Generator │  │ Generator │  │Simulation │  │
│  └────┬─────┘  └────┬─────┘  └────┬──────┘  └────┬──────┘  │
│       │              │             │               │         │
│       │         ┌────┴─────────────┴───────────────┘         │
│       │         ▼                                            │
│       │    ┌──────────────────────────────────┐              │
│       │    │      Claude API (Anthropic)       │              │
│       │    └──────────────────────────────────┘              │
│       │         │              │                             │
│       │    ┌────┴──────┐  ┌───┴────────────┐                │
│       │    │  Visual   │  │  Agent Memory  │                │
│       │    │Generation │  │    Store       │                │
│       │    │ Pipeline  │  │               │                 │
│       │    └───────────┘  └───────────────┘                 │
│       ▼              ▼              ▼                        │
│  ┌──────────────────────────────────────────────┐            │
│  │               SQLite Database                 │            │
│  │ Campaigns | ICPs | Ads | Scores | Agents     │            │
│  │ CustomerData | BrandAssets | AgentMemory      │            │
│  └──────────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 15, React 19, TypeScript  |
| Styling    | Tailwind CSS, shadcn/ui           |
| Backend    | Python 3.12+, FastAPI             |
| AI         | Anthropic Claude API              |
| Simulation | Multi-agent framework (OASIS-inspired) |
| Visuals    | Claude Code, Figma MCP, Re:Motion |
| Data       | pandas (CSV/Excel parsing)        |
| Database   | SQLite + SQLAlchemy               |
| Validation | Pydantic v2                       |

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 20+
- An [Anthropic API key](https://console.anthropic.com/)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Run the server
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000` and expects the backend at `http://localhost:8000`.

---

## Project Structure

```
peitho/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, lifespan
│   │   ├── config.py            # Pydantic settings, env vars
│   │   ├── database.py          # SQLAlchemy engine & session
│   │   ├── models/              # SQLAlchemy ORM models
│   │   │   ├── campaign.py
│   │   │   ├── icp.py
│   │   │   ├── ad_variant.py
│   │   │   ├── simulation_score.py
│   │   │   ├── customer_data.py
│   │   │   ├── simulation_agent.py
│   │   │   ├── agent_memory.py
│   │   │   └── brand_asset.py
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/             # API route handlers
│   │   │   ├── campaigns.py
│   │   │   ├── ads.py
│   │   │   ├── customer_data.py
│   │   │   ├── brand_assets.py
│   │   │   ├── simulation.py
│   │   │   └── export.py
│   │   └── services/            # Core business logic
│   │       ├── icp_service.py
│   │       ├── ad_service.py
│   │       ├── scoring_service.py
│   │       ├── export_service.py
│   │       ├── data_ingestion_service.py
│   │       ├── visual_generation_service.py
│   │       ├── simulation_service.py
│   │       └── brand_asset_service.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Campaign list
│   │   ├── campaigns/
│   │   │   ├── new/page.tsx     # Campaign creation form
│   │   │   └── [id]/page.tsx    # Campaign dashboard
│   │   └── layout.tsx
│   ├── components/              # Reusable UI components
│   │   │                        # Includes agent feedback panel,
│   │   │                        # visual iteration UI, brand asset
│   │   │                        # uploader, and data import views
│   ├── lib/
│   │   └── api.ts               # Backend API client
│   ├── types/
│   │   └── index.ts             # Shared TypeScript types
│   └── package.json
├── TODO.md
└── README.md
```

---

## Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| **MVP** | AI pipeline + dashboard — generate ICPs (with customer data ingestion), create ads (code-based visuals), multi-agent simulation scoring, human feedback, export | In progress |
| **Phase 2** | Real ad platform integrations, CRM connectors (Shopify, Klaviyo, HubSpot), performance tracking, scaling simulation | Planned |
| **Phase 3** | Video generation, multi-language, population-scale simulation, cross-customer intelligence | Future |

---

## License

MIT
