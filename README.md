# Peitho

**AI-Powered Hyper-Personalized Advertising at Scale**

Peitho generates highly targeted ad variants by first building detailed Ideal Customer Profiles (ICPs) from your company info, then creating dozens of tailored ad creatives per segment, and finally scoring each ad through AI-simulated audience reactions. The result: a ranked portfolio of ads optimized for each customer persona before you spend a dollar on media.

> *Named after the Greek goddess of persuasion.*

---

## The Problem

Digital advertising is stuck in a loop of broad targeting and generic creative. Marketers manually build 2-3 audience segments, write a handful of ad variants, and rely on expensive live A/B testing to find what works. Most ad spend is wasted on the wrong message reaching the wrong person. The feedback cycle takes weeks and thousands of dollars.

## The Solution

Peitho inverts the process:

1. **Deep ICP Generation** — Given your company, product, and market, Claude builds 3-8 richly detailed customer personas: demographics, psychographics, pain points, goals, media habits, and likely objections.
2. **Hyper-Personalized Ad Creation** — For each ICP, Claude generates 5-15 ad variants with diverse emotional tones, CTAs, and angles — all written specifically for that persona.
3. **Simulated Audience Scoring** — Claude role-plays as each ICP persona reviewing the ad, scoring it on attention, relevance, resonance, clarity, and CTA effectiveness. Ads are ranked before any real spend.
4. **Platform-Ready Export** — Approved ads are formatted to Meta, LinkedIn, and Google Display specs, ready for upload.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│  Campaign Creation → ICP Review → Ad Gallery → Export    │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API
┌──────────────────────────┴──────────────────────────────┐
│                    FastAPI Backend                        │
│                                                          │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐            │
│  │   ICP     │   │   Ad     │   │ Scoring  │            │
│  │ Generator │──▶│ Generator│──▶│ Simulator│            │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘            │
│       │              │              │                    │
│       ▼              ▼              ▼                    │
│  ┌─────────────────────────────────────────┐            │
│  │           Claude API (Anthropic)         │            │
│  └─────────────────────────────────────────┘            │
│       │              │              │                    │
│       ▼              ▼              ▼                    │
│  ┌─────────────────────────────────────────┐            │
│  │              SQLite Database             │            │
│  │  Campaigns | ICPs | Ads | Scores         │            │
│  └─────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | Next.js 15, React 19, TypeScript  |
| Styling    | Tailwind CSS, shadcn/ui           |
| Backend    | Python 3.12+, FastAPI             |
| AI         | Anthropic Claude API              |
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
│   │   │   └── simulation_score.py
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/             # API route handlers
│   │   │   ├── campaigns.py
│   │   │   ├── ads.py
│   │   │   └── export.py
│   │   └── services/            # Core business logic
│   │       ├── icp_service.py
│   │       ├── ad_service.py
│   │       ├── scoring_service.py
│   │       └── export_service.py
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
| **MVP** | AI pipeline + dashboard — generate ICPs, create ads, simulate scores, export | In progress |
| **Phase 2** | Real ad platform integrations (Meta, Google, LinkedIn), performance tracking, A/B testing | Planned |
| **Phase 3** | Video generation, multi-language, autonomous campaign management, population-scale simulation | Future |

---

## License

MIT
