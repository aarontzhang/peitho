// Peitho persona schema — Patagonia campaign
// 5 ICPs targeting the full Patagonia buyer spectrum:
// corporate sustainability buyers, outdoor-enthusiast tech professionals,
// values-driven founders, retail category managers, and HR/people leaders.
//
// Patagonia operates across B2B (corporate sales, wholesale retail) and
// B2C (individual consumers on LinkedIn). Their anti-marketing ethos
// ("Don't Buy This Jacket") makes conventional ad creative feel off-brand.
// Every persona here must contend with the fact that Patagonia's strongest
// marketing move is not marketing at all.
//
// Schema design principle: only include fields that change LLM output
// compared to cold prompting. Every field here represents information
// Claude would NOT infer from the customer brief alone.

export const campaign = {
  product: "Patagonia — outdoor apparel and gear built to last, by a company that gave itself away to fight climate change",
  company: "Private B Corp. Ownership transferred to Patagonia Purpose Trust + Holdfast Collective in Sept 2022 (valued at ~$3B). All profits fund climate action. ~3,000 employees. Revenue ~$1.5B/yr.",
  competitors: ["Arc'teryx (owned by Amer Sports / ANTA)", "The North Face (VF Corp)", "REI Co-op brand", "Cotopaxi", "prAna (Columbia Sportswear)"],
  platform: "LinkedIn Organic Post — Single Image (1080x1080)",
  currentPain:
    "Patagonia's brand is revered in outdoor and sustainability circles, but they face three problems on LinkedIn: (1) every brand now claims to be 'sustainable,' drowning Patagonia's genuine record in greenwashing noise; (2) their anti-consumerist ethos makes conventional LinkedIn content feel inauthentic — they can't just 'promote product'; (3) B2B channels (corporate programs, wholesale) are under-penetrated because the brand is perceived as consumer-only. They need to speak to very different professional audiences — from procurement officers who need audit data to tech workers who want gear that survives El Cap — without ever sounding like they're trying to sell something.",
  visualDNA: {
    primaryDark: "#1B2A4A",
    accentSunset: "#F4845F",
    accentGlacier: "#73C2FB",
    accentForest: "#2D6A4F",
    gradientSunset: ["#F4845F", "#E8634A", "#D4483B"],
    gradientGlacier: ["#73C2FB", "#4A9FD9", "#2D7BB5"],
    gradientForest: ["#2D6A4F", "#1E5038", "#163D2B"],
    aesthetic: "clean minimalism, mountain silhouettes as recurring motif, earth tones and deep blues, nature-inspired textures, absolutely no corporate stock photography, no greenwashing visual cliches (no hands holding globes, no green leaves on white backgrounds, no smiling-people-in-nature stock shots)",
    voice: "Quiet confidence. Direct. Activist but never preachy. Says less, means more. Anti-corporate, anti-marketing. Would rather show the problem than sell the solution. Never uses exclamation marks. Trusts the reader to get it.",
  },
};

export const personas = [
  {
    id: "corp-sustainability-director",
    role: "VP / Director of Corporate Sustainability",
    segment: "Fortune 500 or large enterprise (5,000+ employees) with formal ESG program, sustainability-linked KPIs, and $500K–$5M annual budget for sustainable procurement",
    companyStage: "enterprise",

    cognition: {
      informationProcessing: "evidence-first",
      // Needs third-party validation, not brand claims. Reads B Corp
      // impact reports, checks supply chain audit summaries, looks for
      // Scope 3 emissions data before engaging with any vendor. Has been
      // burned by partners whose "sustainability" was marketing copy.
      // Will verify certifications independently. Treats marketing
      // language as a negative signal — the more polished the claim,
      // the less they trust it.
      proofHierarchy: [
        "third-party-certifications-bcorp-fair-trade-bluesign",
        "published-supply-chain-transparency-data",
        "measurable-environmental-impact-metrics-with-methodology",
        "named-enterprise-partnership-case-studies",
        "employee-and-factory-worker-testimonials",
      ],
      riskOrientation: "reputation-protecting",
      // One greenwashing scandal ends their career and sets the company's
      // ESG program back years. Every partnership must survive investigative
      // journalism, activist scrutiny, and board-level questioning.
      // They personally carry the reputational risk of every vendor they
      // champion — it's not just a procurement decision, it's a career bet.
    },

    objections: {
      surface: [
        "We need to see the full supply chain audit before proceeding",
        "Our procurement process requires competitive bidding — can't sole-source",
        "We're already committed to our current corporate apparel vendor through 2027",
        "The per-unit cost is 2-3x our current vendor",
      ],
      real: [
        "If I champion Patagonia and someone finds a labor issue in tier-3 of their supply chain, my credibility is destroyed and the entire ESG program gets questioned",
        "Is Patagonia's sustainability record genuinely better, or am I paying a 3x premium for marketing that happens to be true?",
        "My CFO already thinks ESG is a cost center — choosing the most expensive vendor confirms every bias they have about my department",
        "I need to justify this as a strategic procurement decision, not a personal brand preference",
      ],
    },

    antiPatterns: [
      "Vague sustainability claims without data — 'we care about the planet' means nothing to someone who reads GRI reports for breakfast",
      "Lifestyle imagery of people hiking or climbing — they're buying for 5,000+ employees, not personal use",
      "Consumer-facing marketing tone — this is a B2B procurement decision that goes through legal and finance",
      "Greenwashing visual cliches (green leaves, earth tones, recycling symbols, hands holding globes)",
      "Price avoidance or deflection — they know Patagonia is premium; dodging it signals you don't understand procurement",
      "Assuming they agree sustainability is worth paying for — their job is to make the business case, not assume it",
    ],

    communication: {
      preferredFormat: "impact-data-with-sourcing-methodology",
      socialProofType: "named-enterprise-sustainability-partnership-with-measurable-outcomes",
      attentionWindow: "3-seconds-linkedin-then-downloads-impact-report-if-data-looks-real",
    },
  },

  {
    id: "outdoor-tech-professional",
    role: "Senior Software Engineer / Engineering Lead",
    segment: "Tech worker (FAANG, Series B+ startup, or top-tier tech company), avid climber/hiker/trail runner/backcountry skier. Household income $200K+. Spends 30-50 weekends/year outdoors.",
    companyStage: "n/a-individual-consumer",

    cognition: {
      informationProcessing: "community-validated",
      // Checks r/ultralight, r/climbing, r/trailrunning, Mountain Project
      // forums, and Outdoor Gear Lab before buying anything. Trusts peer
      // reviews and field reports over any brand marketing. Judges gear
      // by real-world durability data, weight specs, and material science.
      // Has a spreadsheet of their gear with cost-per-use calculations.
      // Follows specific gear reviewers on YouTube (not lifestyle influencers).
      // Will read a 4,000-word review but won't read a 100-word ad.
      proofHierarchy: [
        "real-field-testing-and-multi-year-durability-reports",
        "worn-wear-repair-program-as-proof-of-build-quality",
        "peer-community-endorsement-reddit-mp-forums-not-influencers",
        "material-science-and-construction-details",
        "environmental-activism-credibility-as-tiebreaker",
      ],
      riskOrientation: "value-maximizing-over-lifetime",
      // High income but deeply allergic to waste. Willing to pay 2x if
      // the product lasts 5x longer. The calculus is always cost-per-year
      // and cost-per-use, never sticker price. Will repair a jacket three
      // times before replacing it. Planned obsolescence is a moral failing,
      // not just a business model.
    },

    objections: {
      surface: [
        "I can get similar technical specs from Arc'teryx or OR for less",
        "Is Patagonia actually better for alpine use or is it more lifestyle?",
        "I already have more gear than I need — I don't need another fleece",
      ],
      real: [
        "Am I paying for the brand identity or the actual product? I don't want to be the guy who buys Patagonia to look outdoorsy at a coffee shop",
        "If I buy Patagonia, am I signaling virtue or actually making a materially better choice? My climbing partners will roast me either way",
        "I want gear that performs on a multi-pitch in the Tetons — the sustainability stuff is important but it's a tiebreaker, not the reason I buy",
        "Is the quality still there or has it declined since the early 2010s? I've heard people say it has",
      ],
    },

    antiPatterns: [
      "Leading with sustainability over product performance — they buy gear to USE, not to feel good about owning",
      "Aspirational lifestyle marketing ('live your best life outdoors') — they're already outdoors every weekend, this is patronizing",
      "Instagram influencer aesthetics — posed photos at scenic overlooks feel manufactured and fake to actual climbers",
      "Tech-bro pandering ('from the office to the trail', 'Silicon Valley meets the Sierra') — instant cringe",
      "Newbie-level outdoor content — they know more about alpine conditions than your copywriter does",
      "Making sustainability the headline when performance should be — signals the brand prioritizes marketing over product",
    ],

    communication: {
      preferredFormat: "product-story-with-field-context-and-technical-detail",
      socialProofType: "real-climber-or-alpinist-endorsement-not-influencer",
      attentionWindow: "2-seconds-then-deep-read-if-authentic-outdoor-content-with-technical-substance",
    },
  },

  {
    id: "values-driven-founder",
    role: "Founder / CEO of a B Corp or Purpose-Driven Company",
    segment: "Series A–B startup or profitable bootstrapped company, 10–150 employees, certified B Corp or pursuing certification, mission is core to business model not a marketing layer",
    companyStage: "growth",

    cognition: {
      informationProcessing: "narrative-first",
      // Learns through stories, case studies, and founder narratives.
      // Patagonia's story (Yvon Chouinard giving away the company) is
      // their North Star example — the proof that it's possible.
      // Wants to understand HOW Patagonia maintains values at scale,
      // not THAT they do. Already believes in the mission — needs the
      // operational playbook. Reads Yvon's books, follows Rose Marcario's
      // career moves, has "Let My People Go Surfing" on their shelf.
      proofHierarchy: [
        "patagonia-business-model-as-existence-proof-that-values-scale",
        "revenue-growth-data-alongside-activism-timeline",
        "specific-decisions-that-cost-money-but-preserved-values",
        "employee-retention-and-culture-metrics-as-proof-of-internal-alignment",
        "honest-account-of-trade-offs-and-failures",
      ],
      riskOrientation: "existential-values-drift",
      // Biggest fear: becoming the thing they set out to disrupt. Growing
      // into just another company with a nice mission statement and zero
      // operational teeth. Watches Patagonia obsessively for proof that
      // growth doesn't require compromise — or for honest admission of
      // where it does.
    },

    objections: {
      surface: [
        "Patagonia had 50 years to build this — we're five years in",
        "We can't afford to give away our company (and our investors wouldn't let us)",
        "Our board wouldn't approve the level of political activism Patagonia does",
      ],
      real: [
        "Can I actually run a values-driven company at scale, or is Patagonia a once-in-a-generation exception that proves nothing about the general case?",
        "What did Patagonia sacrifice or get wrong along the way that they don't talk about in the books? What's the real cost?",
        "Am I naive for thinking business can be a force for good, or am I just not doing it right yet?",
        "If Patagonia's model only works because Chouinard is Chouinard, then there's no playbook for me",
      ],
    },

    antiPatterns: [
      "Corporate tone or polished enterprise language — they left corporate specifically to do something different",
      "Making Patagonia sound perfect, inevitable, or untouchable — they want the real, messy, hard story",
      "Lecturing about why sustainability matters — they already believe; they need the HOW, not the WHY",
      "Thought-leadership platitudes ('purpose is the new profit', 'do well by doing good') — too many LinkedIn gurus have ruined these phrases",
      "Ignoring the hard trade-offs and costs — pretending values-alignment is easy or free insults their daily experience",
      "Hagiography of Yvon Chouinard — they've read the book, they want what comes after the hero story",
    ],

    communication: {
      preferredFormat: "honest-narrative-with-trade-offs-and-costs-acknowledged",
      socialProofType: "founder-to-founder-real-talk-not-PR-case-study",
      attentionWindow: "3-seconds-then-shares-with-cofounders-and-team-if-it-feels-genuine",
    },
  },

  {
    id: "retail-category-manager",
    role: "Category Manager / Senior Buyer — Outdoor & Active Lifestyle",
    segment: "REI, Backcountry, Dick's Sporting Goods outdoor division, Moosejaw, or independent specialty outdoor retailers. Manages $5M–$50M in seasonal buy budgets.",
    companyStage: "enterprise-retail",

    cognition: {
      informationProcessing: "data-driven",
      // Evaluates brands on sell-through rate, margin contribution,
      // customer demand signals, return rates, and inventory turn.
      // Brand story matters only insofar as it drives foot traffic,
      // customer loyalty, and repeat visits. Will pull POS data before
      // taking a meeting. Thinks in open-to-buy budgets, seasonal buys,
      // and floor space ROI. Sentimentality about a brand's mission
      // doesn't survive a missed sell-through target.
      proofHierarchy: [
        "sell-through-rates-and-inventory-velocity-data",
        "brand-sentiment-search-trends-and-social-listening-data",
        "margin-structure-map-policy-and-wholesale-terms",
        "customer-lifetime-value-of-patagonia-shoppers-vs-category-average",
        "worn-wear-and-repair-program-as-repeat-traffic-driver",
      ],
      riskOrientation: "inventory-risk-averse",
      // Dead inventory = their problem. Markdown risk on premium product
      // is especially painful because the margin to absorb it is thin.
      // Needs high confidence that Patagonia products move at full price,
      // especially at $200+ price points where consumer hesitation is real.
    },

    objections: {
      surface: [
        "Patagonia's wholesale margins are tight compared to house brands or VF Corp labels",
        "Customers browse Patagonia in-store, take a photo, then buy direct on patagonia.com",
        "We need more SKU diversity in the $80–$150 mid-price range, not more $300+ shells",
        "Their MAP policy limits our promotional flexibility during clearance events",
      ],
      real: [
        "Does stocking Patagonia bring in the high-CLV customer I want, or do they just cherry-pick one R1 fleece and leave?",
        "Is Patagonia's DTC push (and now Worn Wear resale) going to cannibalize my channel over the next 3–5 years?",
        "Am I better off expanding Arc'teryx, Cotopaxi, or even our own private label instead? They're hungrier for retail partnerships.",
        "If I give Patagonia more floor space and they don't sell through, I'm the one explaining it to my VP of Merchandising",
      ],
    },

    antiPatterns: [
      "Leading with sustainability mission or environmental activism — they care about sell-through, not saving the planet",
      "Consumer marketing language or brand storytelling — this is a wholesale/retail negotiation, not a PR pitch",
      "Ignoring the DTC tension — pretending Patagonia isn't actively competing with its own retail partners is insulting",
      "Vague 'brand halo' claims without retail performance data — they need sell-through numbers, not 'brand equity' hand-waving",
      "Treating all retailers identically — REI's outdoor-core buyer is a completely different conversation from Dick's mass-market buyer",
      "Assuming brand prestige alone justifies floor space — every linear foot of shelf has an ROI target",
    ],

    communication: {
      preferredFormat: "data-brief-with-retail-performance-metrics-and-channel-strategy",
      socialProofType: "comparable-retailer-sell-through-and-customer-acquisition-case-study",
      attentionWindow: "5-seconds-then-requests-full-line-sheet-and-margin-structure-if-numbers-work",
    },
  },

  {
    id: "hr-people-director",
    role: "VP / Director of People & Culture",
    segment: "Tech or professional services company (500–5,000 employees), high-competition talent market, employee engagement and retention are top-3 OKRs, considering outdoor/wellness programs or sustainable corporate merchandise",
    companyStage: "growth-to-enterprise",

    cognition: {
      informationProcessing: "culture-signal-first",
      // Evaluates partnerships through the lens of "what does this say
      // about who we are as a company?" Every vendor choice, every piece
      // of merch, every wellness program is a signal to current and
      // prospective employees about company values. Reads Glassdoor
      // reviews of Patagonia's own internal culture as a credibility check.
      // If Patagonia treats their own people well, the partnership is
      // authentic. If they don't, it's hypocrisy dressed as merch.
      proofHierarchy: [
        "patagonia-internal-culture-data-employee-retention-glassdoor",
        "employee-engagement-lift-from-values-aligned-programs",
        "branded-merch-quality-and-longevity-vs-throwaway-swag",
        "sustainability-as-recruiting-differentiator-data",
        "case-studies-from-similar-sized-companies",
      ],
      riskOrientation: "culture-authenticity-protecting",
      // If they launch a "Patagonia partnership" and employees see it as
      // performative (especially if the company has other sustainability
      // gaps), it backfires spectacularly. The merch becomes a meme, not
      // a signal. Has to be part of a genuine values story, not a checkbox.
    },

    objections: {
      surface: [
        "Our swag budget is $30/item — Patagonia is $80+ per piece",
        "We already have a merch vendor and switching is operationally complex",
        "Not sure outdoor gear resonates with our entire workforce (we're not all hikers)",
      ],
      real: [
        "If I spend 3x on Patagonia merch and employees still leave, I look like I wasted budget on expensive swag instead of fixing real culture problems",
        "Will employees see this as genuine values alignment, or as corporate virtue signaling from a company that hasn't earned it?",
        "My CEO wants to cut costs, not triple the merch budget — how do I sell this as an investment in retention, not an expense?",
        "Is Patagonia corporate sales actually set up to handle our scale and timeline, or is this going to be a procurement nightmare?",
      ],
    },

    antiPatterns: [
      "Positioning Patagonia merch as 'premium swag' — they're not buying swag, they're buying a culture signal",
      "Consumer brand messaging — this person is evaluating a B2B vendor for employee programs",
      "Assuming the buyer personally loves the outdoors — many HR leaders are buying for diverse workforces, not for themselves",
      "Ignoring the cost conversation — budget justification is the hardest part of their job, not the merch selection",
      "Over-promising culture transformation from a merch partnership — they know a jacket doesn't fix retention",
      "Generic 'employee wellness' language without specific, measurable engagement outcomes",
    ],

    communication: {
      preferredFormat: "roi-brief-linking-values-alignment-to-retention-and-engagement-metrics",
      socialProofType: "named-company-hr-team-case-study-with-engagement-data",
      attentionWindow: "3-seconds-then-forwards-to-chief-people-officer-if-data-supports-budget-request",
    },
  },
];
