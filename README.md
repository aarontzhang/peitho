# Peitho

**AI-Powered Precision Persuasion for High-Stakes Advertising**

Peitho builds deep psychological profiles of the specific people you need to influence — understanding their motivations, fears, decision-making patterns, and emotional triggers — then generates creative precisely designed to persuade them across every platform where they can be reached. Multi-agent simulation scores each variant before you spend a dollar on media. Human-in-the-loop at every stage.

> *Named after the Greek goddess of persuasion.*

---

## The Problem

In high-stakes advertising — B2B enterprise sales, political campaigns, pharma, government affairs — the challenge isn't reaching "anyone who might convert." It's reaching *specific people* and persuading them. ABM platforms like Demandbase and 6sense solve targeting (they can find the CTO). But the creative they serve is generic — the same display ad goes to the CTO, CFO, and VP of Engineering, despite fundamentally different motivations and objections. The targeting is surgical; the message is a shotgun.

## The Solution

Peitho closes the gap between precision targeting and precision creative:

1. **Deep Persona Intelligence** — Given your product, target accounts, and market, Claude builds richly detailed buyer personas: role-based psychology, decision-making patterns, likely objections, emotional triggers, and platform preferences. When enrichment data is available, personas are grounded in real signals rather than archetypes alone.
2. **Persona-Specific Ad Creation** — For each buyer persona, Claude generates 5-15 ad variants with diverse emotional tones, CTAs, and psychological angles — tailored to each platform's content grammar (LinkedIn thought leadership, programmatic display, Meta, CTV). Visuals are generated programmatically using code-based tools (Claude Code, Figma MCP, Re:Motion).
3. **Multi-Agent Simulation Scoring** — Multiple simulation agents per persona — each with persistent memory and unique behavioral signatures — evaluate ads across multiple runs. Scores emerge from agent behavior patterns, not single prompts. Human feedback is incorporated into agent memory.
4. **Cross-Platform Export** — Approved ads are formatted to LinkedIn, programmatic display, Meta, and Google Display specs, with targeting recommendations per persona. Ready for deployment through ABM platforms, DSPs, and ad managers.

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
| **MVP** | AI pipeline + dashboard — generate buyer personas, create persona-specific ads (code-based visuals), multi-agent simulation scoring, human feedback, cross-platform export | In progress |
| **Phase 2** | LinkedIn/DSP/ABM platform integrations, cross-platform campaign orchestration, performance feedback loop, political vertical expansion | Planned |
| **Phase 3** | Individual-level intelligence from public data, pharma HCP vertical, video generation, geofencing integration | Future |
| **Phase 4** | Autonomous cross-platform orchestration, intent-triggered creative escalation, dynamic budget allocation | Future |
| **Phase 5** | Persuasion intelligence network — cross-customer persona insights, competitive intelligence, vertical benchmarking | Future |

---

## License

MIT
