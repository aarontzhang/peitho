# Peitho — Strategic Direction

**Date:** April 5, 2026
**Status:** Working draft — internal alignment document

---

## 1. What Peitho Is Now

Peitho is a pre-spend creative intelligence service for B2B advertising. We use AI to tell companies which creative angles to test before they spend money finding out.

The insight is simple: in B2B, targeting is solved. LinkedIn, Demandbase, and 6sense can already find the CTO at your target account. The gap is what you say to them when you get there. A B2B company spending $30-50K/month on ABM wastes 30-40% of that budget in the creative testing phase — running ads against personas with angles that were never going to land. That waste is our wedge.

What makes this more urgent now: Meta's Andromeda algorithm (rolled out late 2024) has made the creative itself the targeting signal. You no longer tell Meta who to show your ad to — Meta reads your creative and decides. This means getting the creative right for a specific type of person matters more than ever, across every platform. The companies that win are the ones whose creative speaks to specific buyer psychology, not the ones with the best audience settings. Nobody is doing the pre-spend intelligence work to make that happen systematically.

---

## 2. What We Are and What We Aren't

**We are:**
- A pre-spend creative filter. You have 15 angles you could test. We tell you which 3 are most likely to speak to the psychology of your specific buyer persona. If starting from our shortlist saves money in the testing phase compared to going in blind, that's the proof.
- A creative direction tool grounded in buyer psychology. We apply validated decision-making and procurement psychology frameworks to construct personas and evaluate creative angles. We're not inventing new research — we're applying research that already exists and is academically backed, using AI to eliminate the manual process.
- An AI-native service. We operate the pipeline. Customers get deliverables — ranked creative angles, psychological rationale, ready-to-use copy. They don't interact with software.

**We aren't:**
- A performance predictor. When someone sees your ad in the wild, they've been scrolling for 20 minutes, they got a bad text that morning, their thumb is moving at a certain speed. Meta's algorithm reads hundreds of micro-signals we don't have. We can tell you what a CFO might think about your angle in the abstract. We cannot tell you whether that CFO stops scrolling for it on a Tuesday afternoon. There's a gap between resonance and behavior — a video can resonate intellectually and still not trigger the scroll-stop. We don't claim to predict performance. We claim to filter out angles that were never going to work before you waste budget discovering that yourself.
- A SaaS product (yet). We're a service first. The technology is our internal advantage, not a product we sell directly. Customers don't need to know how it works — they need it to work.

---

## 3. Why Service First

The fastest path to validation is not building a polished SaaS dashboard. It's using the AI pipeline ourselves to deliver results to one real customer.

- **Validates without product risk.** We need to know if the pre-filter signal is real before investing in UI/UX, onboarding flows, and self-serve infrastructure.
- **Opacity is a moat.** Customers cannot tell us how to run our pipeline. We can iterate the AI, swap models, change prompt architecture — all without a product migration. Compare this to a SaaS tool where every change is a feature request negotiation.
- **Faster to first revenue.** A service engagement can start in days. A SaaS product needs months of build before anyone pays.
- **Every engagement produces validation data.** Each campaign we run through the pipeline generates a comparison: our ranked angles vs. actual performance. That data compounds. We build our validation in the market, not in a lab.
- **Productize later.** Once the signal is proven across 10-20 engagements, we know exactly what the product should look like because we've been the user. The SaaS version becomes a codification of a process we've already refined, not a guess about what customers want.

---

## 4. Target Market

**Primary:** B2B companies running account-based marketing (ABM) campaigns.

- Spending $30-50K+/month on LinkedIn, programmatic display, or ABM platforms (Demandbase, 6sense, Terminus)
- Selling high-ticket products to enterprise ($50K-$50M+ deal sizes)
- Targeting specific decision-makers: CTOs, CFOs, VPs of Engineering, heads of marketing, procurement leads
- Creative production is the bottleneck — they know their targeting is precise but their messaging is generic
- Small marketing teams (3-20 people) without dedicated ABM creative resources, or working with an agency that can't produce enough persona-specific variants

**Why enterprise B2B specifically:**
- Personas are stable and role-defined. A CTO's motivations, objections, and decision-making patterns are well-documented and consistent enough to model.
- The value per conversion justifies the spend. Even marginal improvement in creative effectiveness on a $500K deal is worth real money.
- LinkedIn targeting lets you actually reach the right person, so validation data is clean — you know who saw what.
- Text-first. LinkedIn ads are primarily copy. We don't need visual generation infrastructure to deliver value on day one.

**Why NOT Meta/consumer right now:**
- Meta exposes all the hardest problems (algorithmic distribution, behavioral unpredictability, visual-first creative) without the infrastructure to handle them yet.
- Consumer personas are unstable and context-dependent in ways B2B personas aren't.
- Meta is Phase 2, once the core loop is validated on LinkedIn where the signal is clean.

---

## 5. MVP Service Offering

### What the customer gives us
- Their product/service and value proposition
- Target accounts and/or ICP description
- Buyer roles they're trying to reach (CTO, CFO, VP Eng, etc.)
- Current creative (optional — useful for benchmarking)
- Any existing customer research, win/loss data, or ICP documentation

### What we deliver
1. **Persona intelligence briefs** — Deep buyer persona profiles for each target role, grounded in validated B2B psychology frameworks: role-based motivations, decision-making patterns, likely objections, emotional triggers, information preferences, risk tolerance. Not generic archetypes — specific enough to surface objections the customer hadn't considered.
2. **Ranked creative angles** — For each persona, a ranked list of creative angles with psychological rationale. "Here are 12 angles for your CTO persona. Here's why #1-3 are most likely to speak to this buyer's psychology, and here's specifically why #10-12 won't land." Each angle includes the psychological mechanism (fear/risk, aspiration, social proof, ROI/rational, authority, peer pressure).
3. **Ready-to-use LinkedIn copy** — For the top-ranked angles, finished ad copy formatted for LinkedIn Sponsored Content. Headline, body, CTA. Platform-native tone and length.
4. **Competitive angle analysis** — What psychological angles competitors are using (from ad libraries) and where the gaps are.

### The core pipeline (internal)
```
Customer brief → Persona construction (validated psych frameworks + AI)
             → Creative angle generation (diverse psychological approaches)
             → Pre-filter ranking (which angles match this persona's psychology)
             → LinkedIn copy generation
             → Deliverable package
```

### What we explicitly don't build yet
- Multi-agent simulation with persistent memory
- Social influence engines or agent-to-agent interaction
- Visual/image generation
- SaaS dashboard or self-serve UI
- CRM integrations (Shopify, Klaviyo, HubSpot)
- Meta, Google Display, or CTV ad formats
- Cross-platform campaign orchestration
- Performance tracking pipeline

All of these are real and valuable. None of them are needed to validate the core hypothesis.

---

## 6. Validation Plan

### The hypothesis
AI-constructed buyer personas, grounded in existing psychology frameworks, can reliably identify which creative angles will resonate with specific B2B buyer roles — well enough that starting from our shortlist saves money compared to the current process of testing angles blind.

### How we test it
1. **Find one real customer.** Ideally someone spending real money on ABM who has a defined ICP and is actively making creative decisions. They need to be willing to walk us through their current process.
2. **Run the pipeline.** Construct personas for their target buyer roles. Generate and rank creative angles. Produce LinkedIn copy for the top angles.
3. **Sit with them.** Walk through the output together. Capture: What did the pipeline get right? What did it miss? What objections did it surface that they hadn't considered? How does this compare to how they currently decide which angles to test?
4. **Deploy and compare.** If they're willing, run our top-ranked angles alongside their normal creative in a live campaign. Compare engagement metrics. This is the real signal.
5. **Repeat.** Five engagements and a pattern starts emerging. What types of personas does the pipeline model well? Where does it fall short? What do we need to adjust?

### What "working" looks like
- The pipeline's top 3 angles outperform the customer's bottom 3 angles more often than chance
- Customers report that the persona briefs surfaced objections or motivations they hadn't considered
- The time from "brief" to "ready-to-test creative" is compressed from weeks to days
- Customers would pay for this as an ongoing service

### What "not working" looks like
- The pipeline's ranking doesn't correlate with actual engagement
- Persona briefs feel generic and don't surface anything the customer didn't already know
- The psychological rationale sounds plausible but doesn't translate to real creative differentiation

If it's not working, we need to diagnose *where* the signal breaks down: persona construction, angle generation, or ranking. Each failure mode has a different fix.

---

## 7. The Long Game

The MVP is a narrow wedge. Here's where it goes once validated.

**Near-term (post-validation):**
- Data flywheel: every engagement produces sim-score-vs-actual-performance data. Accumulated across customers, this becomes the validation layer and a compounding competitive advantage.
- Expand to Meta and programmatic display once we've proven the core loop on LinkedIn.
- Social listening as a data input — real public sentiment data to ground personas in what people actually say, not just what psychology predicts they'd say. Synthetic data fills gaps; real data leads.

**Medium-term:**
- Productize into SaaS once the service model has been refined across 15-20 customers and we know exactly what the product should look like.
- Individual-level intelligence from public data (LinkedIn profiles, conference talks, published content) for named-account targeting.
- ABM platform integrations (Demandbase, 6sense) — feed persona-specific creative directly into existing targeting workflows.
- Performance tracking pipeline connecting sim scores to real campaign metrics.

**Long-term vision:**
- AI-native ABM agency that scales beyond what human-staffed agencies can do — not by replacing people but by making the creative intelligence layer autonomous.
- Cross-platform orchestration: coordinated "surround sound" campaigns from a single persona brief (LinkedIn for professional context, display for ambient awareness, CTV for evening reach).
- Political vertical timed for the 2028 cycle — voter segment modeling, micro-targeted persuasion creative.
- Persuasion intelligence network: cross-customer persona insights, competitive intelligence, vertical benchmarking.

The massive version of this is an AI system that understands specific people well enough to generate precision creative across every touchpoint where they can be reached, and learns from every deployment to get better. We start with "which LinkedIn ad angle should you test first for your CTO persona" and build toward that.

---

## 8. What We Believe and What We Still Need to Prove

### Beliefs (strong conviction, based on existing evidence)
- **AI can meaningfully model B2B buyer psychology by role.** Role-based decision-making in procurement is well-studied. A CTO's motivations and objections are documented and consistent enough across companies that an AI-constructed persona is useful, even if imperfect.
- **Existing psychology frameworks + AI = credible persona construction without original research.** We're not claiming to have done the research. We're claiming to apply research that already exists. That's a defensible position.
- **The pre-filter is valuable even if imperfect.** If we can reliably eliminate the bottom 30% of angles before any money is spent, that's worth paying for. We don't need to be right about what will work — we need to be right about what won't.
- **Creative diversity driven by persona intelligence is what algorithms reward.** Andromeda penalizes creative similarity and rewards genuine diversity. Persona-driven creative naturally produces that diversity.

### What we need to prove
- **Does the pre-filter actually save money in the testing phase?** This is the core question. If customers test 15 angles blind and we can narrow it to 5, does starting from our 5 produce better results than a random 5?
- **Are role-based psychological models predictive enough of real behavior?** There's a gap between "a CFO cares about TCO" (true in the abstract) and "this specific CFO will click on this specific ad" (unknowable). Where on that spectrum does our output land, and is it useful enough?
- **Will B2B companies pay for this as a service?** The budget exists (they're already spending on agencies and ABM platforms). The question is whether our framing and delivery are compelling enough.

### How we prove it
In the market, not in a lab. Every engagement is a data point. We don't need a 20-year validation study like Neurons. We need 5 real engagements and the intellectual honesty to read the signal clearly — including if it says we're wrong.
