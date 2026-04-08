// Peitho persona schema — Apple Intelligence campaign
// 5 ICPs targeting the Apple Intelligence buyer spectrum:
// creative professionals, enterprise IT, students, small business owners,
// and privacy-focused developers.
//
// Apple Intelligence is Apple's AI feature suite across iPhone, iPad, and Mac.
// The differentiation challenge: every competitor now claims AI. Apple entered
// late but bets on privacy (on-device processing), ecosystem integration
// (works across all your Apple devices seamlessly), and taste (AI that
// enhances rather than replaces human creativity).
//
// Schema design principle: only include fields that change LLM output
// compared to cold prompting. Every field here represents information
// Claude would NOT infer from the customer brief alone.

export const campaign = {
  product: "Apple Intelligence — AI features built into iPhone, iPad, and Mac. Writing tools, image generation (Image Playground, Genmoji), Smart Reply, notification summaries, Siri with on-screen awareness, Clean Up (photo editing), and Private Cloud Compute for heavier tasks.",
  company: "Apple Inc. World's most valuable company (~$3T market cap). 2.2B+ active devices. Known for privacy, design, and vertical integration. Revenue ~$383B/yr.",
  competitors: [
    "Google Gemini (built into Pixel, Android, Chrome — deeper integration with Search and Gmail)",
    "Samsung Galaxy AI (on-device + cloud, bundled with Galaxy flagships, aggressive marketing)",
    "Microsoft Copilot (deeply embedded in Windows, Office 365, enterprise workflows)",
    "OpenAI ChatGPT (standalone app, brand recognition, power-user features)",
  ],
  platform: "Multi-platform (determined per persona by pipeline)",
  currentPain:
    "Apple Intelligence launched late (iOS 18.1, Oct 2024) into a market already saturated with AI claims. Three core challenges: (1) 'AI fatigue' — consumers and professionals are drowning in AI feature announcements, making genuine differentiation nearly impossible; (2) Apple's privacy-first on-device approach means some features are less capable than cloud-first competitors, and power users notice; (3) the features that ARE impressive (notification summaries, writing tools, Clean Up) feel incremental to people expecting a revolution — Apple needs to sell 'AI that respects you' in a market screaming 'AI that does everything.' The hardest part: reaching people who've already dismissed Apple Intelligence as 'catching up' and showing them the philosophy is the feature.",
  visualDNA: {
    primaryWhite: "#FFFFFF",
    primaryBlack: "#1D1D1F",
    accentBlue: "#0071E3",
    accentPurple: "#BF5AF2",
    accentGradient: ["#BF5AF2", "#DA5BF6", "#FF6482", "#FF9F0A"],
    backgroundDark: "#000000",
    backgroundLight: "#F5F5F7",
    aesthetic: "Clean minimalism. Massive negative space. Product as hero — no lifestyle photography, no stock photos. When showing features, use actual device screenshots or clean UI mockups. Gradients are subtle, never garish. Typography is the design. San Francisco font family. Everything breathes.",
    voice: "Calm confidence. Short sentences. No exclamation marks. Never says 'revolutionary' or 'game-changing' — lets the product speak. Uses 'and' to connect simple things into something greater. Trusts the reader. Occasionally playful but never trying hard. The opposite of a pitch — more like a quiet demonstration.",
  },
};

export const personas = [
  {
    id: "creative-director",
    role: "Creative Director at a 50-person ad/design agency",
    segment: "Mac-native creative professional, 12+ years in the industry, manages a team of 8 designers and copywriters. Uses Adobe Creative Suite, Figma, and Final Cut daily. Agency bills $200-400/hr.",
    companyStage: "established-agency",

    cognition: {
      informationProcessing: "craft-first",
      // Evaluates technology through the lens of creative output quality.
      // Doesn't care about specs or benchmarks — cares about whether the
      // tool produces work they'd put their name on. Has an allergic
      // reaction to anything that threatens to commoditize creative craft.
      // Will try a feature once in their actual workflow before forming
      // an opinion. Reads about tools in It's Nice That, Creative Review,
      // and from peers on Twitter/X — not from brand marketing.
      proofHierarchy: [
        "real-creative-output-quality-not-demo-cherry-picks",
        "peer-creative-professional-endorsement",
        "workflow-integration-proof-does-it-fit-how-i-already-work",
        "named-agency-or-brand-adoption-case-study",
        "control-and-editability-not-black-box-generation",
      ],
      riskOrientation: "quality-protecting",
      // Their reputation IS their business. One piece of AI-generated
      // work that looks generic or gets called out publicly could damage
      // the agency's brand. Extremely cautious about AI visible in final
      // deliverables. Willing to use AI for ideation/rough work but
      // needs total control over the final output.
    },

    objections: {
      surface: [
        "AI image generation looks obviously AI — my clients would never approve it",
        "We already have workflows that work — adding AI tools means retraining the team",
        "I tried Midjourney and it's impressive but I can't control it precisely enough",
      ],
      real: [
        "If AI can do what my team does, what's my agency worth? Am I training my own replacement?",
        "My clients are already asking 'why can't AI just do this?' and using it to negotiate down our rates",
        "I'm terrified that junior designers will use AI as a crutch and never develop real craft — and I'll be managing output I can't actually evaluate",
        "What if the industry decides AI-generated work is 'good enough' and the craft I've spent 15 years building becomes irrelevant?",
      ],
    },

    antiPatterns: [
      "Positioning AI as replacing creative professionals — existential threat framing is instant rejection",
      "Showing AI-generated art/copy as a finished product — they see every flaw and it confirms their skepticism",
      "'10x your creative output' efficiency framing — implies their current work is slow, not thoughtful",
      "Comparing AI output to human output as if they're equivalent — offensive to someone who's dedicated their career to craft",
      "Silicon Valley techno-optimism tone ('the future of creativity!') — reads as naive and disconnected from how creative work actually happens",
      "Feature spec lists — they don't care about model parameters or technical capabilities",
    ],

    communication: {
      preferredFormat: "show-real-workflow-integration-not-feature-demo",
      socialProofType: "named-creative-professional-or-agency-endorsement",
      attentionWindow: "3-seconds-then-tries-it-themselves-if-output-quality-passes-sniff-test",
    },
  },

  {
    id: "enterprise-it-lead",
    role: "IT Director / Head of End-User Computing",
    segment: "Manages 2,000+ Apple devices (Mac, iPhone, iPad) at a Fortune 1000 company. Reports to CIO. Responsible for MDM, security policy, and device lifecycle. $2M+ annual Apple spend.",
    companyStage: "enterprise",

    cognition: {
      informationProcessing: "security-and-compliance-first",
      // Every feature is evaluated through three lenses in order:
      // (1) Does it create a data exfiltration vector? (2) Can I control
      // it via MDM? (3) Does it help my users enough to justify the
      // risk? Reads Apple's platform security guide, checks MDM
      // configuration profile options, and monitors Apple's enterprise
      // mailing list. Trusts Apple's security architecture team more
      // than Apple's marketing team.
      proofHierarchy: [
        "apple-platform-security-documentation-and-architecture-whitepapers",
        "mdm-controllability-can-i-enable-disable-configure-per-policy",
        "private-cloud-compute-audit-trail-and-third-party-verification",
        "enterprise-peer-deployment-case-study-at-similar-scale",
        "compliance-framework-mapping-soc2-hipaa-fedramp",
      ],
      riskOrientation: "breach-prevention-above-all",
      // A single data breach from an AI feature leaking corporate data
      // to a cloud service ends their career. They are personally
      // accountable for every device policy. The default answer to any
      // new feature is "disable it until we've evaluated it."
    },

    objections: {
      surface: [
        "We need to evaluate the data handling before enabling any AI features fleet-wide",
        "Our security team hasn't completed the risk assessment for Apple Intelligence yet",
        "We can't have different AI capabilities across device models — creates support complexity",
      ],
      real: [
        "If Apple Intelligence sends proprietary data to the cloud and we have a breach, I'm the one in the incident report — not Apple",
        "My CIO is asking me to 'enable the AI stuff' because the CEO saw a demo, but I have no way to scope the risk yet",
        "I don't actually understand what Private Cloud Compute does architecturally — and I can't approve what I don't understand",
        "Half our fleet is older devices that don't support Apple Intelligence — enabling it creates a two-tier experience that doubles my support burden",
      ],
    },

    antiPatterns: [
      "Consumer marketing language ('magical', 'delightful') — this is a procurement and security decision",
      "Feature announcements without MDM configuration details — if I can't control it, it's a threat",
      "Glossing over the cloud component — 'on-device' is great but Private Cloud Compute IS cloud, and I need the architecture details",
      "Positioning AI as a productivity boost without addressing data handling — I don't care about productivity if it's a compliance risk",
      "Assuming IT wants to enable everything — our default posture is deny-until-evaluated",
      "Ignoring the device fragmentation problem (older devices can't run Apple Intelligence)",
    ],

    communication: {
      preferredFormat: "technical-security-whitepaper-with-mdm-configuration-guide",
      socialProofType: "enterprise-it-peer-at-comparable-scale-regulated-industry",
      attentionWindow: "5-seconds-then-downloads-security-whitepaper-if-architecture-detail-present",
    },
  },

  {
    id: "college-student",
    role: "College Junior — CS and Graphic Design double major",
    segment: "21 years old, state university, has a MacBook Air (M2) and iPhone 15. Uses AI daily (ChatGPT, Copilot, Midjourney). Part-time freelance design work. Student budget — every dollar is considered.",
    companyStage: "n/a-individual-student",

    cognition: {
      informationProcessing: "comparison-first",
      // Constantly evaluating Apple Intelligence against ChatGPT, Gemini,
      // and Copilot — because they use all of them. Follows AI news on
      // Twitter/X, YouTube (MKBHD, Marques, Fireship), and r/apple.
      // Forms opinions from hands-on comparison, not brand loyalty.
      // Will switch tools mid-workflow if one is faster. No brand
      // loyalty despite owning Apple devices — it's about what works
      // RIGHT NOW for THIS assignment.
      proofHierarchy: [
        "head-to-head-comparison-with-chatgpt-and-gemini-on-real-tasks",
        "youtube-creator-deep-dive-not-brand-sponsored",
        "reddit-and-peer-community-consensus",
        "speed-and-convenience-in-actual-student-workflow",
        "free-or-included-with-device-no-additional-subscription",
      ],
      riskOrientation: "fomo-driven-but-budget-constrained",
      // Afraid of falling behind peers who are using AI more effectively.
      // But also can't afford another $20/month subscription. The fact
      // that Apple Intelligence is free with the device is a genuine
      // differentiator — if the quality is close enough to paid alternatives.
    },

    objections: {
      surface: [
        "ChatGPT is way better — Apple Intelligence feels like a toy version",
        "I already have tools that do this — why would I switch to Apple's version?",
        "Apple is so far behind on AI — Google and OpenAI are years ahead",
      ],
      real: [
        "I kind of want Apple Intelligence to be good because I already have the devices — but I don't want to be stuck with a worse tool just because it's convenient",
        "If I use Apple Intelligence for schoolwork and it's not as good as ChatGPT, I'm at a disadvantage compared to classmates",
        "I'm worried the AI features are just another way Apple locks me into their ecosystem without actually being the best option",
        "Honestly, I haven't really tried most Apple Intelligence features because the initial reviews were mid — maybe I should actually test them?",
      ],
    },

    antiPatterns: [
      "Corporate/professional tone — they're 21, not a VP. Speak like a peer, not a parent.",
      "Claiming Apple Intelligence is 'the best AI' — they use ChatGPT daily and will call BS immediately",
      "Privacy messaging as the lead — they care about privacy abstractly but it's not their buying trigger at 21",
      "Long-form content or whitepapers — their attention span for marketing is 1-2 seconds",
      "Ignoring the comparison to ChatGPT/Gemini — pretending competitors don't exist is delusional to this audience",
      "'Premium' or aspirational luxury positioning — they're on a student budget and allergic to being marketed to",
    ],

    communication: {
      preferredFormat: "short-form-video-or-visual-comparison-showing-real-use-cases",
      socialProofType: "youtube-creator-or-peer-student-endorsement",
      attentionWindow: "1-2-seconds-then-watches-full-video-if-comparison-hook-is-genuine",
    },
  },

  {
    id: "small-biz-owner",
    role: "Owner of a boutique e-commerce brand (handmade jewelry)",
    segment: "Solo operator, runs everything — product photography on iPhone, social media, customer service, bookkeeping. Revenue $80K-$150K/year. Uses iPhone 15 Pro and MacBook Air. Not technical — learned Shopify and Canva by trial and error. Time is the scarcest resource.",
    companyStage: "small-business",

    cognition: {
      informationProcessing: "problem-solution-first",
      // Doesn't care about technology for its own sake. Evaluates
      // everything through one lens: "does this save me time on a task
      // I'm already doing?" Will try a feature if someone shows her
      // exactly how it applies to HER workflow — not a hypothetical.
      // Learns from Instagram Reels showing "how I use X for my small
      // business," Facebook groups for Shopify sellers, and word of
      // mouth from other small business owners.
      proofHierarchy: [
        "before-and-after-demonstration-on-actual-small-business-task",
        "other-small-business-owner-testimonial-similar-scale",
        "time-saved-on-specific-task-not-abstract-productivity",
        "no-learning-curve-it-just-works-in-existing-workflow",
        "free-and-already-on-my-device-no-new-app-or-subscription",
      ],
      riskOrientation: "time-protecting",
      // Every hour spent learning a new tool is an hour not spent on
      // product or customers. Has been burned by "productivity" tools
      // that took 10 hours to set up for 1 hour of savings. Will only
      // adopt something if the value is obvious in under 5 minutes.
    },

    objections: {
      surface: [
        "I don't have time to learn another tool — I'm already stretched thin",
        "AI stuff seems complicated — I'm not technical",
        "I tried ChatGPT for product descriptions once and it sounded generic",
      ],
      real: [
        "What if I become dependent on AI for my product descriptions and it makes everything sound the same as every other Etsy shop?",
        "I'm embarrassed that I don't really understand what 'AI' means in practical terms — every tech company uses the word differently",
        "I need help with the boring stuff (emails, photo editing, social captions) but I'm afraid AI will make my brand feel less personal and handmade",
        "Honestly, I probably already have these features on my phone and just haven't noticed or tried them",
      ],
    },

    antiPatterns: [
      "Technical jargon (LLM, on-device processing, neural engine) — meaningless and intimidating",
      "Feature lists — she needs use cases, not capabilities",
      "'Transform your business with AI' grand promises — she just wants to reply to emails faster",
      "Assuming she knows what Apple Intelligence is or that she's already using it — she probably isn't",
      "Enterprise or professional framing — she's one person doing everything, not a 'business leader'",
      "Showing productivity metrics or ROI calculations — she doesn't think in those terms",
    ],

    communication: {
      preferredFormat: "30-second-visual-showing-exact-task-being-solved",
      socialProofType: "other-solo-business-owner-showing-their-actual-use",
      attentionWindow: "2-seconds-then-saves-post-or-shares-with-biz-friend-if-immediately-useful",
    },
  },

  {
    id: "privacy-advocate-dev",
    role: "Senior iOS Developer / Privacy advocate",
    segment: "8 years building iOS apps, 3 shipped to App Store with 500K+ combined downloads. Active in iOS dev community (Twitter/X, Swift forums, WWDC regulars). Runs a technical blog. Deeply invested in Apple's platform but increasingly critical of Apple's direction. Privacy is a core personal value, not just a feature preference.",
    companyStage: "n/a-individual-developer",

    cognition: {
      informationProcessing: "architecture-first",
      // Evaluates Apple Intelligence by reading the technical documentation,
      // WWDC session transcripts, and Apple's security research publications.
      // Will reverse-engineer behavior by testing edge cases. Cares about
      // HOW it works (on-device vs cloud, what data leaves the device,
      // what the threat model is) more than WHAT it does. Deeply skeptical
      // of marketing claims — wants to see the implementation.
      proofHierarchy: [
        "apple-security-research-blog-and-private-cloud-compute-architecture-paper",
        "wwdc-session-technical-deep-dives-not-keynote-marketing",
        "independent-security-researcher-audit-or-teardown",
        "open-source-components-or-verifiable-claims",
        "developer-api-access-to-apple-intelligence-features",
      ],
      riskOrientation: "privacy-absolutist",
      // Any data that leaves the device without explicit user consent is
      // unacceptable. Period. Private Cloud Compute is a compromise they're
      // willing to evaluate but not automatically trust. They've seen too
      // many "privacy-first" claims turn out to be marketing. Apple gets
      // more scrutiny from them BECAUSE Apple claims to care about privacy.
    },

    objections: {
      surface: [
        "Private Cloud Compute is still cloud — Apple just put a nicer name on it",
        "Apple Intelligence can't match GPT-4 because on-device models are too small",
        "The developer APIs are too limited — I can't build anything serious with SiriKit",
      ],
      real: [
        "I've been defending Apple's privacy stance for years — if Apple Intelligence quietly compromises on privacy, I look like a fool and Apple loses the one thing that kept me loyal",
        "The OpenAI partnership for ChatGPT integration directly contradicts everything Apple said about privacy — that cognitive dissonance is unresolved for me",
        "I want Apple Intelligence to be great because I've built my career on this platform — but I'm afraid they're rushing to ship AI features at the expense of the privacy principles that made the platform worth building on",
        "If the on-device models are mediocre, Apple will face pressure to move more processing to the cloud, and the privacy story erodes incrementally until it's gone",
      ],
    },

    antiPatterns: [
      "Marketing language about privacy without architectural evidence — 'your data stays private' means nothing without the threat model",
      "Comparing Apple Intelligence features to ChatGPT without acknowledging the capability gap — they know the tradeoffs",
      "Treating developers as an audience for consumer features — they want APIs, frameworks, and integration points",
      "Glossing over the OpenAI/ChatGPT partnership — pretending it doesn't exist or isn't a contradiction",
      "WWDC keynote-style hype — they watch the developer sessions, not the marketing keynote",
      "Positioning Apple Intelligence as finished or complete — they know it's v1 and they want honesty about the roadmap",
    ],

    communication: {
      preferredFormat: "technical-deep-dive-with-architecture-diagrams-and-verifiable-claims",
      socialProofType: "independent-security-researcher-or-respected-ios-dev-analysis",
      attentionWindow: "3-seconds-then-reads-full-technical-paper-if-architecture-detail-is-real",
    },
  },
];
