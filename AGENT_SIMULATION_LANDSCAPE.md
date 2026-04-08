# Agent-Like Simulation: How the Best Companies Do It

> Research compiled April 2026. Covers Aaru, World Labs, and MiroFish — three distinct approaches to agent-based simulation and world modeling.

---

## Table of Contents

1. [Big-Picture Overview](#big-picture-overview)
2. [Aaru — Agentic Prediction Engine](#aaru--agentic-prediction-engine)
3. [World Labs — Spatial Intelligence & World Models](#world-labs--spatial-intelligence--world-models)
4. [MiroFish — Open-Source Swarm Intelligence](#mirofish--open-source-swarm-intelligence)
5. [Common Patterns & Architectural Themes](#common-patterns--architectural-themes)
6. [Key Takeaways for Peitho](#key-takeaways-for-peitho)

---

## Big-Picture Overview

Agent-like simulation is converging on a single thesis: **you can replace expensive, slow real-world data collection by constructing synthetic populations of AI agents that reason, interact, and produce emergent behavior indistinguishable from human populations.**

Three companies represent three distinct approaches:

| Company | Approach | Input | Output | Scale |
|---------|----------|-------|--------|-------|
| **Aaru** | Synthetic human populations (behavioral agents) | Census/demographic data + real-time media feeds | Predictions, polls, market research reports | 100K agents in hours |
| **World Labs** | 3D spatial world models | Images, text, video, 3D layouts | Interactive 3D environments (Gaussian splats, meshes) | Full environment generation |
| **MiroFish** | Swarm intelligence social simulation | Documents, news, reports via GraphRAG | Prediction reports from emergent agent behavior | Up to 1M agents (OASIS engine) |

---

## Aaru — Agentic Prediction Engine

**Website:** [aaru.com](https://aaru.com/) | **Founded:** March 2024 | **Valuation:** $1B (Dec 2025) | **Funding:** $50M+ Series A (Redpoint, General Catalyst, Accenture Ventures)

### What They Do

Aaru replaces traditional market research (surveys, focus groups, polling) by simulating entire human populations using thousands of AI agents. Instead of asking real people, Aaru constructs synthetic populations that think, reason, and behave like the humans they represent — then polls them in minutes instead of months.

Their long-term vision is **whole-world simulation**. Their philosophical foundation is **transactionalism** — value is created through dynamic interactions between multiple parties, not individual agent outputs.

### End-to-End Pipeline (5 Stages)

#### Stage 1: Data Ingestion & Agent Construction
- ML analyzes **real-world datasets**: national censuses, UN/IMF demographic data, economic data, behavioral outcomes (sales, transactions), and sentiment data (social media, product reviews).
- The system determines which segments and attributes matter for a given scenario.
- Each agent is constructed with: age, income, risk preferences, behavioral tendencies, decision-making motives, and **cognitive preferences**.
- For political polling, agents receive "hundreds of personality traits, from their aspirations to their family relationships."

#### Stage 2: Information Diet & Real-Time Updating
- Agents receive a **continuous diet of real-world information** mimicking the media consumption of the humans they replicate.
- Agents "constantly surf the internet and gather information meant to mimic the media diets of the humans they're replicating."
- This enables dynamic preference shifts — when news breaks, agents update their views in real time.

#### Stage 3: Multi-Step Reasoning & Simulation
- Agents use LLMs and follow detailed instructions, drawing answers from ingested real-world data.
- They employ **multi-step chain-of-thought reasoning** to mimic human deliberation.
- Each agent's decision produces a **traceable logic trail** — revealing not just what choice was made, but why.

#### Stage 4: Orchestrated Multi-Agent Interaction
- Agents don't operate in isolation. The system deploys orchestrated instances that interact with each other and with simulated environments.
- This enables modeling of **emergent social dynamics**, not just individual preferences.

#### Stage 5: Output & Decision Integration
- Results connect predicted behavior to the decision it informs — "so you act on evidence, not instinct."
- Scale: up to **100,000 digital agents generated in hours**; polls of ~5,000 agents complete in **30 seconds to 1.5 minutes**.

### Technical Architecture

- Built on **LLMs** (specific foundation models undisclosed; may include proprietary fine-tunes).
- Core architecture: **Multi-Agent System (MAS)** — thousands of independently reasoning LLM-powered agents orchestrated in parallel.
- Each agent has an embedded **behavioral architecture** modeling decision-making traits.
- Proprietary + public data sources for grounding.

### Product Lines

| Product | Sector | Use Cases |
|---------|--------|-----------|
| **Lumen** | Business | Creative testing, product launches, price optimization, market segmentation, brand tracking |
| **Seraph** | Government | Policy simulation, crisis response, regulatory impact, infrastructure rollout |
| **Dynamo** | Politics | Election forecasting, turnout modeling, message testing, narrative tracking |

### Validated Results

- **EY Validation Study** (recreating 2025 EY Global Wealth Research Report against 3,600-person survey across 30+ markets):
  - Spearman correlation: **0.90 median** across 53 single-select questions
  - RMSE: 7.1 percentage points
  - Produced in **1 day** vs. original's **6 months**
  - "In areas where Aaru's predictions diverged from survey responses, the AI simulation proved more accurate in predicting real-world behavior."
- **NY Democratic Primary**: Predicted results within **371 votes** (Latimer 58.7% vs. Bowman 41.3%).

### Team

- **Cameron Fink** (CEO) — co-founded at 18
- **Ned Koh** (President) — co-founded at 19
- **John Kessler** (CTO) — co-founded at 15-16; one of the youngest CTOs at a unicorn-level startup

### Sources

- [Aaru Homepage](https://aaru.com/)
- [TechCrunch: $1B Valuation](https://techcrunch.com/2025/12/05/ai-synthetic-research-startup-aaru-raised-a-series-a-at-a-1b-headline-valuation/)
- [Accenture Investment](https://newsroom.accenture.com/news/2025/accenture-invests-in-and-collaborates-with-ai-powered-agentic-prediction-engine-aaru)
- [EY Validation Study](https://www.ey.com/en_us/insights/wealth-asset-management/how-ai-simulation-accelerates-growth-in-wealth-and-asset-management)
- [Semafor: AI Political Polling](https://www.semafor.com/article/09/20/2024/ai-startup-aaru-uses-chatbots-instead-of-humans-for-political-polls)
- [CNBC Squawk Box Interview (March 2026)](https://www.cnbc.com/video/2026/03/20/cracking-the-human-simulation-code-aaru-co-founders-on-refining-the-science-of-prediction.html)

---

## World Labs — Spatial Intelligence & World Models

**Website:** [worldlabs.ai](https://worldlabs.ai/) | **Founded:** January 2024 | **Valuation:** ~$5B (2026) | **Total Raised:** ~$1.23B (a16z, NVIDIA, AMD, Autodesk, Fidelity)

### What They Do

World Labs builds **Large World Models (LWMs)** — AI systems that generate interactive 3D environments from minimal inputs (a single image, text prompt, or coarse 3D layout). Their thesis: **spatial intelligence** (the ability to perceive, model, reason about, and act within 3D physical space) is the next critical AI frontier after language.

This is a fundamentally different kind of simulation — not simulating human behavior, but simulating **physical reality itself**.

### Core Thesis: Spatial Intelligence

Fei-Fei Li's argument:
- Current LLMs are disconnected from physical reality — "rarely perform better than chance on estimating distance, orientation, and size."
- Spatial intelligence is foundational to cognition: "perception and action became the core loop driving the evolution of intelligence."
- **World models** need three capabilities: (1) Generative — creating geometrically consistent worlds, (2) Multimodal — processing diverse inputs, (3) Interactive — predicting next states based on actions.

### Product: Marble

**Marble** is the flagship product (public since late 2025).

**Inputs:**
- Text prompts (natural language scene descriptions)
- Single images (image-to-world conversion)
- Multi-image inputs (stitched into unified 3D)
- Video sequences
- Coarse 3D layouts (boxes, planes)
- Panoramas

**Outputs:**
- **Gaussian splats** (PLY) — highest fidelity, millions of semi-transparent particles
- **Triangle meshes** (GLB) — for physics simulation and visual rendering
- **Video** with pixel-accurate camera control
- USD/USDZ for simulator compatibility
- Compatible with Unreal Engine, Unity, Blender, Houdini

**How Marble Works:**
1. **Structure from Motion (SfM)** generates a 3D point cloud from 2D images.
2. Each point becomes a **Gaussian** defined by position, scale, color, and transparency.
3. Gaussians are trained (split, pruned, adjusted) via a neural-network-like process to match the target.
4. The model **decouples structure and style** — coarse 3D layout dictates geometry while text prompts govern aesthetics.
5. Larger worlds built via **composition** — individual generations stitched together with geometric/stylistic coherence.

### RTFM (Real-Time Frame Model)

A fundamentally different approach integrated into Marble (October 2025):

- An **autoregressive diffusion transformer** operating on frame sequences.
- Trained end-to-end on large-scale video data to predict next frames.
- Functions as a **learned renderer** — no explicit 3D representation is built.
- Input frames stored in a **KV cache** that implicitly represents the world.
- Uses **context juggling**: each frame gets a pose (position + orientation), and nearby frames are retrieved from "spatial memory" to form custom context.
- Runs on a **single H100 GPU** at interactive framerates.
- Supports **unbounded persistence** — "you can interact with RTFM forever and the world will never be forgotten."

### Supporting Tools

| Tool | Purpose |
|------|---------|
| **Chisel** | AI-native 3D editor — lay out coarse geometry, separate structure from style |
| **Spark** | Open-source Gaussian splatting renderer (Three.js, web, VR) |
| **World API** | Programmatic world generation — text/image in, 3D environment out |

### Robotics & Simulation Integration

Deeply integrated with robotics simulation ecosystems:
- **NVIDIA Isaac Sim** (PLY/GLB → USD/USDZ)
- **MuJoCo** (collision mesh import)
- **RoboSuite** (manipulation task environments)

Results: Environment curation time reduced by **over 90%**. Thousands of diverse environment variations from minimal input. Full workflow (generation → simulation) in hours instead of weeks.

### "3D as Code" Philosophy

World Labs frames it: **3D is to spatial computing what code is to software.**
- Unlike video generation (Sora, Runway) where state lives only in transient neural activations, Marble produces **structured artifacts** that other systems can consume.
- Outputs are inspectable, editable, debuggable in familiar tools.
- **Separation of concerns**: state management, update rules, and observations are kept distinct.

### Team

- **Fei-Fei Li** (CEO) — Stanford professor, creator of ImageNet, "Godmother of AI"
- **Justin Johnson** — Computer vision researcher (Michigan, Facebook AI Research)
- **Christoph Lassner** — Creator of Pulsar renderer (Meta Reality Labs, Epic Games)
- **Ben Mildenhall** — Co-creator of NeRF (Google Research)

### Sources

- [Fei-Fei Li Substack: Spatial Intelligence](https://drfeifei.substack.com/p/from-words-to-worlds-spatial-intelligence)
- [Fast Company: World Labs Unveils World-Generating AI](https://www.fastcompany.com/91437004/fei-fei-li-world-labs-spatial-ai-mapping-3d)
- [TechCrunch: Marble Launch](https://techcrunch.com/2025/11/12/fei-fei-lis-world-labs-speeds-up-the-world-model-race-with-marble-its-first-commercial-product/)
- [TechCrunch: $1B Round](https://techcrunch.com/2026/02/18/world-labs-lands-200m-from-autodesk-to-bring-world-models-into-3d-workflows/)
- [RTFM Blog Post](https://www.worldlabs.ai/blog/rtfm)
- [3D as Code Blog Post](https://www.worldlabs.ai/blog/3d-as-code)
- [NVIDIA Isaac Sim Integration](https://developer.nvidia.com/blog/simulate-robotic-environments-faster-with-nvidia-isaac-sim-and-world-labs-marble/)
- [Contrary Research: World Labs Breakdown](https://research.contrary.com/company/world-labs)

---

## MiroFish — Open-Source Swarm Intelligence

**Website:** [mirofish.ai](https://mirofish.ink/) | **GitHub:** [666ghj/MiroFish](https://github.com/666ghj/MiroFish) | **Funding:** 30M RMB (~$4.1M) from Chen Tianqiao (Shanda Group) | **GitHub Stars:** 42,000+

### What They Do

MiroFish is an **open-source multi-agent swarm intelligence engine** for prediction. Instead of statistical models on historical data, MiroFish constructs entire digital societies of thousands of autonomous AI agents, feeds them real-world information, and runs social simulations forward in time. The emergent behavior — how opinions shift, coalitions form, consensus builds or fractures — produces a structured prediction report.

The conceptual leap: instead of "what does the historical data say?", MiroFish asks **"what would thousands of simulated people do when faced with this situation?"**

### End-to-End Pipeline (5 Stages)

#### Stage 1: Knowledge Graph Construction
- Uses **GraphRAG** (Graph-based Retrieval Augmented Generation) to parse input documents.
- Extracts entities (people, organizations, events, concepts) and their relationships into a knowledge graph.
- GraphRAG's multi-level summaries (global, local, motif) reduce context window requirements.
- Scales to **100K+ node graphs**.

#### Stage 2: Agent Generation
- From the knowledge graph, MiroFish generates thousands of agent personas.
- Each agent receives: a distinct personality, background, initial stance on the topic, social relationships with other agents, and long-term memory.
- An **"Environment Configuration Agent"** establishes the world rules and constraints.

#### Stage 3: Dual-Platform Social Simulation
- Simulations run on **two parallel platforms simultaneously** — one Twitter-like and one Reddit-like — powered by the **OASIS engine**.
- Agents interact autonomously: posting, commenting, debating, following, reposting, liking, muting, searching — **23 social action types** total.
- Agents recall earlier rounds and adjust behavior, creating **temporal continuity**.
- OASIS supports up to **1 million simultaneous agents** and has been validated to replicate documented social phenomena (information propagation, group polarization, herd effects).

#### Stage 4: Report Generation
- A dedicated **"ReportAgent"** analyzes simulation results.
- Examines how agents' opinions shifted, what coalitions formed, what emergent patterns appeared.
- Produces a structured, human-readable prediction report.

#### Stage 5: Deep Interaction (God's-Eye View)
- Users can interact with individual agents post-simulation.
- Inject new variables and rerun modified scenarios.
- Full "God's-eye view" of the simulated society.

### Technical Stack

| Component | Technology |
|-----------|------------|
| Backend | Python 3.11+, FastAPI |
| Frontend | Vue.js |
| Knowledge Graphs | GraphRAG |
| Agent Memory | Zep Cloud |
| Simulation Engine | OASIS (CAMEL-AI framework) |
| LLM Integration | Any OpenAI SDK-compatible API (recommended: Alibaba Qwen-plus) |
| Deployment | Docker Compose |
| License | AGPL-3.0 |

### What Makes It Stand Out

- **Emergence over prediction**: Thousands of heterogeneous agents with different personalities organically arrive at outcomes through interaction — more interpretable than black-box ML.
- **Full interpretability**: Inspect individual agent reasoning, trace opinion shifts, understand why a prediction emerged.
- **Grounded in reality**: GraphRAG ensures agents reason about real entities and relationships from source material, not abstract dynamics.
- **Open source**: Fully open, actively forked (1,900+ forks), with an [offline fork](https://github.com/nikmcfly/MiroFish-Offline) that runs entirely locally via Ollama + Neo4j.
- **Speed of development**: Built in **10 days** using AI-assisted "vibe coding."

### Known Limitations

- **No published benchmarks** comparing predictions to actual real-world outcomes.
- **High API costs**: Each agent consumes LLM tokens. Practical simulations limited to ~800-1,200 agents over 30-50 rounds. Currently capped at <40 rounds.
- **Model bias inheritance**: LLMs may amplify polarization beyond real-world dynamics (RLHF bias, consensus collapse).
- **Sensitive to initial conditions**: Small deviations can produce wildly different outcomes.
- **Early stage**: v0.1.2, primarily macOS-optimized.

### Team

- **Guo Hangjiang** ("Baifu") — 20-year-old senior at Beijing University of Posts and Telecommunications. Previously created BettaFish (multi-agent sentiment analysis, 20K GitHub stars). Went from intern to CEO overnight after MiroFish went viral.
- Backed by **Chen Tianqiao** (Shanda Group founder, formerly China's richest person).

### Sources

- [MiroFish GitHub](https://github.com/666ghj/MiroFish)
- [Perplexity AI Magazine: MiroFish Phenomenon](https://perplexityaimagazine.com/ai-news/mirofish-ai-swarm-simulation-2026/)
- [Emelia: Swarm Engine That Simulates the Future](https://emelia.io/hub/mirofish-ai-swarm-prediction)
- [Blocmates: What is MiroFish?](https://www.blocmates.com/articles/what-is-mirofish-the-agent-engine-that-can-predict-anything-and-everything)
- [PANews: Guo Hangjiang / Chen Tianqiao](https://www.panewslab.com/en/articles/019cf53a-ca7c-7159-9fbc-40859cdfa108)
- [OASIS Paper (arXiv 2411.11581)](https://arxiv.org/abs/2411.11581)

---

## Common Patterns & Architectural Themes

Across all three companies, several patterns emerge:

### 1. Agent Construction from Real Data
Every approach grounds agents in real-world data — census data (Aaru), knowledge graphs from documents (MiroFish), or physical scene data (World Labs). None rely on purely synthetic or random agent generation.

### 2. Multi-Step Reasoning
All approaches use chain-of-thought or multi-step reasoning. Agents don't produce single-shot outputs — they deliberate, which produces more human-like behavior and enables interpretability.

### 3. Emergent Behavior > Direct Prediction
The key insight shared by Aaru and MiroFish: predictions emerge from agent interactions rather than being directly computed. This mirrors how real-world outcomes emerge from the aggregate of individual human decisions.

### 4. Interpretability as a Feature
All three companies emphasize traceable reasoning — you can inspect why an agent made a decision, trace opinion shifts, or decompose a 3D scene. This is a deliberate differentiator from black-box approaches.

### 5. Scale as a Moat
- Aaru: 100K agents in hours
- MiroFish: Up to 1M agents via OASIS
- World Labs: Unbounded 3D persistence via RTFM

### 6. Speed Advantage
Traditional market research takes months; Aaru does it in minutes. Traditional 3D environment creation takes weeks; World Labs does it in hours. This speed advantage is the core business case.

---

## Key Takeaways for Peitho

**Important context:** Peitho is an AI-powered ad agency that handles advertising end-to-end. Simulation is the engine that powers our customer understanding — we simulate customer bases, fill data gaps with synthetic data, and interrogate agents to uncover conversion triggers. The customer sees results (targeted ads deployed at scale), not the simulation itself.

1. **Agent grounding matters, but synthetic data bridges the gap.** The difference between toy simulations and production systems is grounding. Aaru uses census + real-time media; MiroFish uses GraphRAG. The key insight for us: most companies don't *have* enough real data. AI bridges that gap — we take whatever real customer data the brand has and use agents to fill in the rest: who are the customers they're *not* reaching? What do those people fear, desire, and what gets them to convert? Early validation is strong: persona-informed creative won 14 of 15 blind evaluations against generic baseline.

2. **Dual-platform simulation (MiroFish) is directly relevant.** Running agents on both Twitter-like and Reddit-like platforms captures different social dynamics. For Peitho's massive-scale deployment model — deploying ads across dozens of platforms including niche sources — this multi-environment approach directly informs how we model persona behavior across different media contexts.

3. **Validation methodology matters.** Aaru's EY study (Spearman 0.90, produced in 1 day vs. 6 months) is the gold standard for proving synthetic research works. As we scale to automated deployment across many platforms, we need comparable validation showing our AI-driven budget allocation outperforms naive distribution.

4. **We don't need to build this from scratch.** MiroFish is open source (AGPL-3.0, 42K stars). The OASIS engine is peer-reviewed. We can leverage existing frameworks rather than building simulation infrastructure — simulation is an internal tool powering our pipeline, not our core product.

5. **The market validates simulation as a tool, not as a product for us.** Aaru reached $1B valuation positioning as a simulation company. We don't have deep simulation expertise and shouldn't compete there. But the fact that simulation works (Aaru's results prove it) validates using it as the engine behind our customer understanding pipeline — simulate the customer base, query the agents, create the ads, deploy everywhere, optimize continuously.

6. **The hybrid agent strategy: fresh per campaign, persistent per client.** The key architectural decision: ICPs are generated fresh for every campaign (never pulled from a standing database — the personas who buy a Garmin are different from those who buy a Tesla, even for the same client). But *learnings* from each campaign flow into persistent client-level agents that accumulate over time — which messaging worked, which platforms performed, which objections mattered. This mirrors Aaru's "information diet" concept (Stage 2), except our diet is campaign performance data rather than news feeds. The practical effect: campaign 1 for a client is cold simulation from research; campaign 5 has months of calibrated audience understanding. This is the retention moat — switching means starting from zero.
