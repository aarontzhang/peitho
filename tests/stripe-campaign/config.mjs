// Peitho persona schema — Stripe campaign
// 5 ICPs targeting the full Stripe buyer spectrum:
// technical founders, engineering managers, finance leaders,
// indie hackers, and platform/marketplace product leaders.
//
// Schema design principle: only include fields that change LLM output
// compared to cold prompting. Every field here represents information
// Claude would NOT infer from the customer brief alone.

export const campaign = {
  product: "Stripe — payments infrastructure for the internet (Stripe Payments + Stripe Atlas)",
  company: "Public fintech, 8,000+ employees, $70B+ valuation",
  competitors: ["Adyen", "Braintree / PayPal", "Square", "Build in-house"],
  platform: "LinkedIn Sponsored Content — Single Image Ad (1080x1080)",
  currentPain:
    "Developer buyers hate marketing and have finely-tuned BS detectors. Non-technical buyers (finance, product) don't understand the technical differentiation. Stripe needs to reach both without diluting its developer-first credibility.",
  visualDNA: {
    primaryDark: "#0a2540",
    gradientColors: ["#635bff", "#80b3ff", "#7dd3fc"],
    accentPurple: "#635bff",
    aesthetic: "dark mode, code snippets as visual elements, rich purple-blue-teal gradients, precision typography, no stock photography",
    voice: "Developer-first, technically credible, premium. No buzzwords. Explains complex things simply.",
  },
};

export const personas = [
  {
    id: "startup-cto",
    role: "Startup CTO / Technical Co-Founder",
    segment: "Seed–Series A, 2-20 engineers",
    companyStage: "early", // pre-seed to Series A

    cognition: {
      informationProcessing: "code-first",
      // Reads API docs before any marketing material. If the docs are
      // good, the product is good. Will open the API reference in the
      // first 30 seconds.
      proofHierarchy: [
        "api-documentation-quality",
        "github-activity-and-open-source-sdks",
        "technical-blog-posts-on-internals",
        "yc-and-founder-community-endorsement",
      ],
      riskOrientation: "speed-maximizing",
      // Not afraid of risk — afraid of wasting time on undifferentiated
      // work. Every hour on payments is an hour not on the core product.
    },

    objections: {
      surface: [
        "We could build this ourselves",
        "Don't want vendor lock-in",
        "2.9% + 30¢ adds up at scale",
      ],
      real: [
        "If I use Stripe for everything, what's technically defensible about our stack?",
        "Am I being lazy by not building this?",
        "What happens when we need something Stripe doesn't support?",
      ],
    },

    antiPatterns: [
      "Enterprise sales tactics — requiring a 'book a demo' call is instant close-tab",
      "Pricing opacity or 'contact sales' — can't see the price, don't trust you",
      "Case studies from Fortune 500 — irrelevant to their scale, signals 'not for me'",
      "Marketing superlatives ('world-class', 'best-in-class') — BS detector fires",
      "Screenshots of dashboards — they want to see code, not UI",
    ],

    communication: {
      preferredFormat: "code-example-with-time-to-value",
      socialProofType: "yc-founder-or-technical-peer-endorsement",
      attentionWindow: "2-seconds-linkedin-then-45-minutes-in-docs-if-hooked",
    },
  },

  {
    id: "eng-manager-growth",
    role: "Engineering Manager",
    segment: "Growth-stage company (Series B–C), evaluating migration from existing provider",
    companyStage: "growth", // 50-300 engineers

    cognition: {
      informationProcessing: "peer-validated",
      // Checks engineering blogs, conf talks, HN threads, and asks
      // their network before trusting any vendor claim. Will search
      // "Stripe vs [current vendor] migration" before clicking any ad.
      proofHierarchy: [
        "migration-case-study-with-honest-timeline",
        "community-reputation-hn-reddit",
        "open-source-sdks-and-transparency",
        "technical-architecture-posts",
      ],
      riskOrientation: "regret-minimizing",
      // A botched migration wastes a quarter of eng capacity and burns
      // their credibility with the VP. Switch cost must be bounded.
    },

    objections: {
      surface: [
        "Our current system works fine",
        "Migration would take too long",
        "We'd have to retrain the whole payments team",
      ],
      real: [
        "If I push for this migration and it goes sideways, I created unnecessary work and I own that failure",
        "My team will resent another tool change",
        "I don't want to be the person who broke checkout in prod",
      ],
    },

    antiPatterns: [
      "Calling migration 'seamless' or 'easy' — they know migrations are never seamless",
      "Attacking their current vendor — they chose it, you're attacking their judgment",
      "Feature comparison checklists — features aren't the bottleneck, migration risk is",
      "Buzzword-heavy copy ('AI-powered payments', 'next-gen infrastructure')",
      "Urgency tactics — enterprise eng managers don't respond to scarcity",
    ],

    communication: {
      preferredFormat: "technical-deep-dive-with-migration-narrative",
      socialProofType: "engineer-at-similar-scale-company",
      attentionWindow: "3-seconds-linkedin-then-full-blog-read-if-technical-hook",
    },
  },

  {
    id: "vp-finance",
    role: "VP / Head of Finance",
    segment: "Growth-stage to mid-market, drowning in payment operations",
    companyStage: "growth-to-enterprise", // Series C+, 200-2000 employees

    cognition: {
      informationProcessing: "outcome-first",
      // Leads with business impact numbers (hours saved, error rates
      // reduced), then wants the "how." Won't engage with technical
      // architecture — needs the translation layer.
      proofHierarchy: [
        "financial-impact-metrics-hours-saved-error-reduction",
        "named-company-cfo-testimonial",
        "compliance-and-audit-trail-capabilities",
        "analyst-coverage",
      ],
      riskOrientation: "compliance-anchored",
      // "Will this pass our audit?" is question #1. SOC 2, PCI DSS,
      // revenue recognition compliance are table stakes, not differentiators.
    },

    objections: {
      surface: [
        "Need to evaluate total cost of switching",
        "Need to ensure SOC 2 / PCI compliance first",
        "Our current provider has preferred pricing through our bank",
      ],
      real: [
        "I don't understand the technical side well enough to evaluate this, and I don't want to look ignorant",
        "If payments break, the board asks me — not the CTO",
        "Switching introduces audit risk during a critical period",
      ],
    },

    antiPatterns: [
      "Technical jargon (APIs, webhooks, SDKs) — alienating, signals 'not for you'",
      "Developer-focused messaging or code snippets",
      "'Move fast' startup energy — they want stability and predictability",
      "Vague ROI claims without methodology they can reproduce internally",
      "Any messaging that makes them feel like a secondary audience to developers",
    ],

    communication: {
      preferredFormat: "executive-brief-with-financial-impact",
      socialProofType: "named-company-finance-team-testimonial",
      attentionWindow: "5-seconds-linkedin-then-forwards-to-team-if-compelling",
    },
  },

  {
    id: "solo-founder",
    role: "Solo Founder / Indie Hacker",
    segment: "Pre-revenue to early revenue, bootstrapped or pre-seed, 1-3 person team",
    companyStage: "pre-seed",

    cognition: {
      informationProcessing: "tutorial-first",
      // Follows quickstart guides, watches YouTube walkthroughs, lurks
      // in indie hacker communities (Twitter/X, Indie Hackers, HN Show).
      // Learns by copying a working example, not reading architecture docs.
      proofHierarchy: [
        "speed-to-first-transaction",
        "indie-hacker-and-twitter-community-endorsement",
        "transparent-pricing-no-surprises",
        "quickstart-tutorial-quality",
      ],
      riskOrientation: "cost-sensitive-but-future-aware",
      // Every dollar matters today, but terrified of picking the wrong
      // stack and having to rebuild at scale.
    },

    objections: {
      surface: [
        "Is Stripe the cheapest option?",
        "Do I really need Stripe vs Gumroad / Lemon Squeezy?",
        "The 2.9% fee cuts into my thin margins",
      ],
      real: [
        "What if I pick the wrong payments stack and have to rebuild when I get traction?",
        "I can't afford enterprise pricing but I don't want to outgrow a toy solution",
        "I just need to get paid — why does this feel so complicated?",
      ],
    },

    antiPatterns: [
      "Enterprise language ('contact sales', 'custom pricing', 'talk to an expert')",
      "Complex multi-step integration requirements — if it's not copy-paste, they bounce",
      "Messaging about scale they haven't reached — 'process billions' is intimidating, not aspirational",
      "Requiring a team to implement — signals 'not for you if you're alone'",
      "Gated content or email-walled resources",
    ],

    communication: {
      preferredFormat: "10-minute-quickstart-with-proof",
      socialProofType: "indie-founder-twitter-endorsement",
      attentionWindow: "3-seconds-then-follows-tutorial-thread-if-real-results-shown",
    },
  },

  {
    id: "vp-product-platform",
    role: "VP of Product",
    segment: "Platform/marketplace company where payments are a core product feature",
    companyStage: "growth-to-enterprise",

    cognition: {
      informationProcessing: "strategic-first",
      // Thinks about payments as a product capability, not a technical
      // integration. Evaluates how payment features unlock new business
      // models, new geographies, new user segments.
      proofHierarchy: [
        "platform-case-studies-shopify-lyft-instacart",
        "feature-breadth-for-marketplace-flows",
        "geographic-and-regulatory-coverage",
        "partner-ecosystem-and-extensibility",
      ],
      riskOrientation: "competitive-threat-aware",
      // If their payment experience is worse than a competitor's
      // marketplace, users leave. Also worried about dependency:
      // "If Stripe changes terms, we're hostage."
    },

    objections: {
      surface: [
        "We need full control over the payment UX",
        "Not sure one provider handles all our payment flows",
        "International expansion requirements are complex",
      ],
      real: [
        "If we go all-in on Stripe Connect and they change pricing, we have no leverage",
        "Our payment flows are complex enough we might need to build some custom",
        "I need to justify this to my CEO as a strategic choice, not just a vendor pick",
      ],
    },

    antiPatterns: [
      "Positioning Stripe as 'just a payment processor' — they need a payments platform",
      "Ignoring marketplace complexity (split payments, escrow, multi-party payouts)",
      "Oversimplifying international expansion — they know cross-border is hard",
      "Developer-only positioning — this persona makes product/business decisions, not code decisions",
      "Feature-by-feature comparisons that miss the strategic picture",
    ],

    communication: {
      preferredFormat: "strategic-partnership-narrative-with-platform-examples",
      socialProofType: "named-platform-architecture-case-study",
      attentionWindow: "5-seconds-linkedin-then-deep-read-if-strategic-framing",
    },
  },
];
