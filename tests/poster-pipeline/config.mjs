// Peitho persona schema + example B2B buyer personas
// These personas are programmatically consumed by the pipeline to generate
// persona-specific creative briefs via Claude API.
//
// Schema design principle: only include fields that change LLM output
// compared to cold prompting. Every field here represents information
// Claude would NOT infer from the customer brief alone.

// --- EXAMPLE: Observability platform selling to engineering orgs ---

export const campaign = {
  product: "CloudPulse — unified observability platform (logs, metrics, traces)",
  company: "Series C infrastructure startup, 200 employees",
  dealSize: "$80K-$300K ARR",
  competitors: ["Datadog", "New Relic", "Grafana Cloud"],
  platform: "LinkedIn Sponsored Content",
  currentPain:
    "Prospects default to Datadog because it's the safe choice. CloudPulse wins on cost and flexibility but loses when buyers don't evaluate deeply enough.",
};

export const personas = [
  {
    id: "vp-eng-growth",
    role: "VP Engineering",
    segment: "Growth-stage technical leader",
    companyStage: "growth", // 100-500 employees, Series B-C

    cognition: {
      informationProcessing: "data-first",
      // Leads with metrics, then wants the narrative around them.
      // Will dismiss copy that opens with a story before establishing credibility.
      proofHierarchy: [
        "benchmark-data-from-similar-scale-companies",
        "named-peer-case-study",
        "migration-complexity-analysis",
        "analyst-report",
      ],
      riskOrientation: "regret-minimizing",
      // Not loss-averse (willing to switch), but terrified of a bad migration
      // that wastes 2 quarters. Needs to believe the switch cost is bounded.
    },

    objections: {
      surface: [
        "We're already on Datadog and it works fine",
        "Switching cost is too high mid-roadmap",
        "Need to evaluate 3+ vendors before deciding",
      ],
      real: [
        "I chose Datadog — switching implies I was wrong",
        "My team will revolt if I force another tool migration",
        "If the new tool causes an outage during migration, it's my job",
      ],
    },

    // HIGHEST VALUE: what will make this person disengage or distrust
    antiPatterns: [
      "Implying Datadog is bad — they chose it, you're attacking their judgment",
      "Unsubstantiated cost savings claims without showing the math",
      "Buzzword-heavy copy ('AI-powered observability', 'next-gen platform')",
      "Comparing feature checklists — they know features aren't the bottleneck",
      "Urgency tactics ('limited time', 'act now') — enterprise buyers don't respond to scarcity",
      "Showing screenshots of dashboards — every observability tool has pretty dashboards",
    ],

    communication: {
      preferredFormat: "executive-brief-with-data",
      // Wants a 2-minute read that leads with a concrete number,
      // then backs it up with a named company's experience.
      socialProofType: "peer-at-similar-stage-company",
      // Analyst reports don't move them. A VP Eng at a similar-sized
      // company saying "we migrated in 3 weeks" does.
      attentionWindow: "3-seconds-linkedin-then-2-minute-read-if-hooked",
    },
  },

  {
    id: "cto-enterprise",
    role: "CTO",
    segment: "Enterprise technical executive",
    companyStage: "enterprise", // 1000+ employees

    cognition: {
      informationProcessing: "narrative-first",
      // Counterintuitive for a CTO, but at this level they think in
      // strategic narratives, not data points. They want the story of
      // where observability is going, then the data to validate it.
      proofHierarchy: [
        "strategic-alignment-with-industry-direction",
        "named-enterprise-case-study",
        "total-cost-of-ownership-analysis",
        "analyst-quadrant-placement",
      ],
      riskOrientation: "status-quo-biased",
      // The current stack works. The burden of proof is on the challenger.
      // They need to believe NOT switching is the riskier move.
    },

    objections: {
      surface: [
        "We have an enterprise agreement with our current vendor",
        "Security and compliance review would take 6 months",
        "Need board-level approval for infrastructure changes this large",
      ],
      real: [
        "I don't want to own the risk of a platform migration at this scale",
        "My team leads have built their workflows around the current tool",
        "If this goes wrong, the board remembers it was my call",
      ],
    },

    antiPatterns: [
      "Startup energy or 'move fast' positioning — they want stability",
      "Feature-level comparisons — at enterprise scale, features matter less than ecosystem",
      "ROI claims without TCO methodology they can reproduce internally",
      "Casual tone or first-name-basis copy — they expect professional gravitas",
      "Implying their org is behind or slow to adopt — triggers defensiveness",
      "Any claim that can't survive a security team's scrutiny",
    ],

    communication: {
      preferredFormat: "strategic-narrative-with-tco-backup",
      // Opens with where the industry is heading, positions CloudPulse
      // as aligned with that direction, then provides the financial case.
      socialProofType: "named-enterprise-logo-with-quote",
      // They need to see companies at their scale or larger.
      // A 200-person company case study is irrelevant.
      attentionWindow: "5-seconds-linkedin-then-delegates-to-team-for-deep-eval",
    },
  },

  {
    id: "platform-eng-lead",
    role: "Platform Engineering Lead",
    segment: "Hands-on technical evaluator",
    companyStage: "growth", // 100-500 employees

    cognition: {
      informationProcessing: "peer-validated",
      // Checks HackerNews, Reddit, Discord communities before trusting
      // any vendor claim. Will search "[product] vs Datadog" before
      // clicking any ad. If the community doesn't vouch, the ad is noise.
      proofHierarchy: [
        "community-reputation-and-word-of-mouth",
        "open-source-components-or-transparency",
        "hands-on-trial-experience",
        "technical-blog-posts-showing-internals",
      ],
      riskOrientation: "loss-averse",
      // They're the one who'll be on-call if the new tool breaks.
      // Personal downside risk is high. Need to believe the tool
      // won't create 3am pages during migration.
    },

    objections: {
      surface: [
        "Datadog's ecosystem and integrations are hard to replicate",
        "My team already knows Datadog query language",
        "We'd need to rewrite all our dashboards and alerts",
      ],
      real: [
        "I'll be the one debugging this at 3am if it breaks",
        "If I champion this and it fails, I lose credibility with my VP",
        "I don't trust that a smaller company can handle our scale",
      ],
    },

    antiPatterns: [
      "Marketing-speak of any kind — they have finely tuned BS detectors",
      "Gated content (requiring email for whitepapers) — instant distrust",
      "Stock photography or generic tech imagery",
      "Claims about 'seamless migration' — they know migrations are never seamless",
      "Positioning as 'the Datadog alternative' — feels derivative, not differentiated",
      "Any copy that doesn't demonstrate the author understands observability deeply",
    ],

    communication: {
      preferredFormat: "technical-deep-dive-or-demo",
      // Wants to see the actual product, actual query language, actual
      // architecture. A blog post about how CloudPulse handles cardinality
      // at scale moves them more than any ad.
      socialProofType: "community-endorsement-or-technical-blog",
      // A trending HN post or a respected SRE's blog endorsement
      // outweighs any enterprise case study.
      attentionWindow: "2-seconds-linkedin-skip-unless-technical-hook",
    },
  },
];
