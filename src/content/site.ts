/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every string, link, project and stat on the site lives in this file.
 *  Edit here; the components only read from it.
 *
 *  • Values written as todo("…") are placeholders. They never render.
 *    Replace them with a real string when you have it.
 *  • `npm run todos` lists every TODO still open.
 *  • Headings are written in normal case; the CSS makes them uppercase.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import {
  todo,
  type Capability,
  type FeaturedProject,
  type Fillable,
  type LogEntry,
  type OffClockGroup,
  type MiniProject,
  type Photo,
  type SectionId,
  type SectionMeta,
  type SocialLink,
  type TimelineEntry,
} from "./types";

/* ── Identity & links ───────────────────────────────────────────────────── */

export const person = {
  name: "Varnika Yadav",
  monogram: "VY",
  tagline: "SWE · CS + Math @ Penn State",
  email: "varnika2271@gmail.com",
  /** Only rendered if public/resume.pdf exists at build time. */
  resumePath: "/resume.pdf",
};

/** Used for absolute Open Graph URLs. Vercel fills this in automatically if left as a TODO. */
export const siteUrl: Fillable<string> = "https://varnikayadav.com";

export const social: SocialLink[] = [
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/varnika-yadav-vvy5053" },
  { key: "github", label: "GitHub", href: "https://github.com/varnikayadavpsu" },
  { key: "devpost", label: "Devpost", href: "https://devpost.com/varnikayadavpsu" },
];

export const seo = {
  title: "Varnika Yadav — Software Engineer",
  description:
    "I’m a CS + Math double major at Penn State who builds full-stack, AI-powered tools for farms, payroll, hospitals and city water lines, and tests them until the numbers hold up.",
  ogAlt: "Varnika Yadav — SWE · CS + Math @ Penn State",
};

/* ── Photos (see §6 of the brief) ───────────────────────────────────────── */

export const photos: { portrait: Photo; about: Photo; aboutFallbackPosition: string } = {
  portrait: {
    src: "/images/varnika-portrait.jpg",
    alt: "Portrait of Varnika Yadav",
    objectPosition: "45% 30%",
  },
  about: {
    src: "/images/varnika-about.jpg",
    alt: "Varnika Yadav at Cal Hacks 13.0, eating a cup of mango",
    objectPosition: "55% 40%",
  },
  /** If varnika-about.jpg is missing, the portrait is reused with this crop. */
  aboutFallbackPosition: "50% 70%",
};

/* ── Panels, in order (labels, HUD names) ───────────────────────────────── */

export const sections: Record<SectionId, SectionMeta> = {
  top: { id: "top", hud: "intro" },
  "what-i-do": { id: "what-i-do", label: "// what i do", hud: "what i do" },
  "how-i-build": { id: "how-i-build", label: "// how i build", hud: "how i build" },
  work: { id: "work", label: "// selected work", hud: "selected work" },
  "hackathon-log": { id: "hackathon-log", label: "// hackathon log", hud: "hackathon log" },
  about: { id: "about", hud: "hey, i’m varnika" },
  experience: { id: "experience", label: "// experience", hud: "experience" },
  "off-the-clock": { id: "off-the-clock", label: "// off the clock", hud: "off the clock" },
  "good-fit": { id: "good-fit", label: "// good fit?", hud: "good fit?" },
  toolbox: { id: "toolbox", label: "// toolbox", hud: "toolbox" },
  contact: { id: "contact", label: "// let’s build", hud: "let’s build" },
  footer: { id: "footer", hud: "online" },
};

export const sectionOrder: SectionId[] = [
  "top",
  "what-i-do",
  "how-i-build",
  "work",
  "hackathon-log",
  "about",
  "experience",
  "off-the-clock",
  "good-fit",
  "toolbox",
  "contact",
  "footer",
];

/* ── Shell: rail, menu ──────────────────────────────────────────────────── */

export const rail = {
  cta: "Open to Summer 2027 SWE internships",
  ctaTarget: "contact" as SectionId,
};

export const menu = {
  links: [
    { label: "Work", target: "work" },
    { label: "About", target: "about" },
    { label: "Experience", target: "experience" },
    { label: "Off the clock", target: "off-the-clock" },
    { label: "Toolbox", target: "toolbox" },
    { label: "Contact", target: "contact" },
  ] satisfies { label: string; target: SectionId }[],
  copyright: "© 2026 Varnika Yadav",
};

export const skipLink = { label: "Skip to work", target: "work" as SectionId };

/* ── Panel 1 · Hero ─────────────────────────────────────────────────────── */

export const hero = {
  lockup: "Varnika Yadav — SWE · CS + Math @ Penn State",
  headline: ["Software", "for messy,", "real-world", "problems."],
  card: "I’m a CS + Math double major at Penn State who builds full-stack, AI-powered tools for farms, payroll, hospitals and city water lines, and tests them until the numbers hold up.",
  cta: { lead: "Want to build together?", action: "Let’s talk", target: "contact" as SectionId },
  hint: "scroll ↓ to move →",
  /** Text on the spinning sticker on the hero photo (links to the contact panel). */
  badge: "Open to Summer 2027 SWE internships",
};

/* ── Panel 2 · What I do ────────────────────────────────────────────────── */

export const whatIDo = {
  heading: "I’m a full-stack developer.",
  body: [
    "I find a problem someone is losing money, time or sleep over and ship a working product around it, usually in 36 hours, with a team, on very little sleep. TypeScript, React and Next.js on the front; Python and FastAPI on the back; LLMs and ML models where they actually earn their place.",
    "Off the hackathon floor I’m a strategy analyst at PSU Quants and an undergraduate researcher studying systemic risk, so I care a lot about whether the numbers are right.",
  ],
  button: { label: "See the work", target: "work" as SectionId },
};

/* ── Panel 3 · How I build ──────────────────────────────────────────────── */

export const howIBuild = [
  {
    step: "01",
    heading: "Find the real problem.",
    body: "Before we wrote a line of RollPay, my teammate had a 29-page payroll runbook and a log of 125 real problems from three pay periods. We built for those, then walked a 25-person restaurant in Oakland through it to make sure it wasn’t one company’s headache.",
  },
  {
    step: "02",
    heading: "Prove it works.",
    body: "Demos are easy. I’d rather show receipts. RollPay matched 35 of 46 real pay periods to the cent and caught 59 of 60 planted errors with zero false alarms. Blue Grid’s model put 73% of the pipes that actually broke into its highest-risk group.",
  },
  {
    step: "03",
    heading: "Keep a human in the loop.",
    body: "Every message RollPay’s AI drafts gets approved by a person before it sends. Nod redacts emails, phone, card and bank numbers before anything is stored, and blocks any feature with a medium-or-higher Snyk finding.",
  },
];

/* ── Panel 4 · Selected work ────────────────────────────────────────────── */

export const work = {
  heading: "Things I’ve shipped.",
  meta: "8 hackathon builds · 4 prizes · live demos below",
  moreHeading: "More builds",
};

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "terrametric",
    name: "Terrametric",
    event: "Bitcamp 2026 (UMD)",
    award: {
      stamp: "3 prizes",
      details: [
        "Real World Prize (Ambrook track)",
        "Best Champion of Open Source w/ Featherless",
        "Best Intermediate Data Science Track Hack",
      ],
    },
    oneLiner:
      "Live crop-stress scores, 14-day forecasts and dollar-priced prescriptions that tell growers which field to treat first.",
    bullets: [
      "XGBoost scores stress per field from five satellite signals (NDVI, NDWI, SWIR heat stress, NASA SMAP soil moisture, rainfall deficit), and a second model prices it in dollars from USDA yields and crop prices ($888/acre corn, $628/acre soybeans).",
      "A FastAPI backend streams 120+ live field records over WebSockets to a 3D globe and real-time dashboard.",
      "An ROI engine weighs each fix’s cost against loss avoided and the cost of waiting.",
      "Event-driven SMS alerts go out for high-risk fields.",
    ],
    stack: ["Python", "FastAPI", "WebSockets", "XGBoost", "Next.js", "TypeScript", "GLSL", "SQLite", "Vercel"],
    links: {
      live: "https://terrametric-delta.vercel.app",
      code: "https://github.com/vs-githjk/Terrametric",
      devpost: "https://devpost.com/software/terrametric",
    },
    team: ["Abhinav Dasari", "Vidyut Sriram"],
    // myRole: the bullets above already describe Varnika's work.
  },
  {
    slug: "firedrill-ar",
    name: "FireDrill AR",
    event: "MOLTEN Spatial Hackathon, LA Tech Week 2026",
    eventMeta: "6 hours · team of 5 · Apple Vision Pro",
    award: {
      stamp: "DataFeel winner",
      details: ["Best Use of DataFeel (DataFeel track)", "Won a $1,500 DataFeel kit"],
    },
    oneLiner:
      "An immersive fire drill for kids and students: scan a real room and it becomes a fire you can see, hear and feel.",
    bullets: [
      "A headset scan of the room becomes the stage: fire spreads across the floor and furniture, smoke drops from the ceiling so students learn to stay low, and EXIT and BLOCKED signs mark the way out.",
      "DataFeel haptic dots on both wrists warm up on the side the fire is on, buzz in the smoke and cool down at the safe exit, with skin-safe limits (38 °C max, automatic cut-outs).",
      "A Claude voice coach answers questions from the live room state, and every run ends with a review: the path taken, escape time, time in smoke and how long you stayed low.",
    ],
    stack: ["three.js", "WebXR", "Vite", "FastAPI", "WebSockets", "Claude API", "AssemblyAI", "DataFeel", "Unity"],
    links: {
      live: "https://firedrill-ar.vercel.app",
      code: "https://github.com/prakhar2000/FIreDrillAR",
    },
    team: ["Devajsinh Solanki", "Prakhar Goel", "Emma Sun", "Haotian Yin"],
    myRole: todo("What you built on FireDrill AR"),
  },
  {
    slug: "rollpay",
    name: "RollPay",
    event: "Cal Hacks 13.0 (UC Berkeley)",
    eventMeta: "36 hours · team of 3",
    oneLiner:
      "An AI payroll assistant that catches bad hours before payday and hands the owner a payroll that’s right.",
    bullets: [
      "Syncs Jobber, QuickBooks and Gusto, runs 23 rule-based checks on hours, rates and pay, and drafts a Gusto payroll for the owner to approve.",
      "When pay data doesn’t add up, it texts the right worker or manager a short question over iMessage. A human approves every AI-drafted message first.",
      "Validated on an anonymized real landscaping company: 35/46 pay periods matched to the cent, 59/60 planted errors caught with zero false alarms, and 700+ automated tests.",
    ],
    stack: ["TypeScript", "Next.js", "React", "Convex", "Claude API", "Bun", "Vitest", "Playwright", "Zod", "iMessage"],
    links: {
      live: "https://rollpay-live.vercel.app",
      code: "https://github.com/Devaj6190/hyphenatable",
      devpost: "https://devpost.com/software/rollpay",
    },
    team: ["Devajsinh Solanki", "Shanin Drucquer"],
    // myRole: the bullets above already describe Varnika's work.
  },
  {
    slug: "nod",
    name: "Nod",
    event: "AI Startup Challenge, AWS Builder Loft 2026",
    eventMeta: "6 hours · team of 3",
    award: { stamp: "Top 5", details: ["Invited to speak at the AWS AI Summit"] },
    oneLiner:
      "Five AI agents that turn founders’ customer interviews into ranked, quote-backed feature cards, then write and ship the code.",
    bullets: [
      "A 5-agent system built in Python/Flask goes from raw interview transcripts to prioritized, quote-backed feature cards to shipped code.",
      "Shared long-term memory with Cognee, so customer insights, conflicts and security lessons persist across restarts.",
      "PII is redacted from every transcript before storage. Any feature with a medium-or-higher Snyk finding is blocked from shipping.",
    ],
    stack: ["Python", "Flask", "AI agents", "Cognee", "Snyk", "Flexprice"],
    links: {
      live: todo("Nod demo link"),
      code: "https://github.com/AnushaAgarwal27/Nod",
    },
    team: ["Anusha Agarwal", "Vedant Shirvi"],
    // myRole: the bullets above already describe Varnika's work.
  },
  {
    slug: "blue-grid",
    name: "Blue Grid",
    event: "UC Berkeley AI Hackathon 2026",
    oneLiner:
      "Finds the city water pipes most likely to break next and gives crews a 72-hour plan to fix them first.",
    bullets: [
      "Trained on a real city’s open data (its full pipe inventory and complete break history), scoring every pipe on age, material, past breaks and flood exposure.",
      "Backtested: 73% of pipes that actually broke landed in the model’s highest-risk group.",
      "A Leaflet map over real pipe geometry, Claude-written action plans and explanations, and a Browserbase agent that pulls fresh break records from the city’s live data portal.",
    ],
    stack: [
      "Python",
      "Flask",
      "scikit-learn",
      "pandas",
      "GeoPandas",
      "Redis",
      "Leaflet.js",
      "Claude API",
      "Browserbase",
      "Render",
      "Vercel",
    ],
    links: {
      live: "https://blue-grid-kitchener.vercel.app",
      devpost: "https://devpost.com/software/blue-grid",
    },
    myRole: todo("What you built on Blue Grid"),
  },
  {
    slug: "echo-by-relay",
    name: "Echo by Relay",
    event: "HackGT 13 (Georgia Tech)",
    oneLiner:
      "From one sentence a doctor says out loud, Echo makes sure the patient actually gets their medicine.",
    bullets: [
      "Voice-first: it checks coverage and prior-auth requirements, then routes the patient to a free bridge supply, a patient assistance program or cash pay.",
      "Drafts prior-authorization letters that cite exact sentences from the drug’s FDA label, so every clinical claim is traceable.",
      "Explains the plan to patients in Spanish or English. Caregivers see nothing until they sign a consent and privacy agreement.",
    ],
    stack: ["TypeScript", "Next.js", "Supabase", "Tailwind CSS", "xAI Grok", "Vercel"],
    links: {
      live: "https://echobyrelay.tech",
      code: "https://github.com/anantp1910/EchoByRelay",
      devpost: "https://devpost.com/software/echobyrelay",
    },
    team: ["Vedant Shirvi", "Anant Patel"],
    myRole: todo("What you built on Echo by Relay"),
  },
  {
    slug: "would-you-jump",
    name: "Would You Jump?",
    event: "National Renaissance Hackathon at super{set}",
    oneLiner:
      "A private AI matchmaker for co-founders. You only find out who someone is once you’ve both said yes.",
    bullets: [
      "Models run in the visitor’s browser: Laya through ONNX Runtime Web in a web worker, and Bonsai 1.7B through Transformers.js and WebGPU. Your pasted background never leaves your device.",
      "Introductions need two independent approvals before names or contact details are revealed.",
      "Built on Next.js, React, TypeScript and TanStack Query with Supabase Postgres. Optional cloud enhancement only ever sees fields you approved.",
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "React",
      "TanStack Query",
      "Supabase",
      "ONNX Runtime Web",
      "Transformers.js",
      "WebGPU",
    ],
    links: {
      live: "https://superset-wyj.vercel.app",
      code: "https://github.com/xyzmr114/superset-WYJ",
      devpost: "https://devpost.com/software/would-you-jump",
    },
    team: ["Harsh Rathi", "Abhinav Dasari", "Anusha Agarwal"],
    myRole: todo("What you built on Would You Jump?"),
  },
];

export const moreBuilds: MiniProject[] = [
  {
    slug: "watchcare-ai",
    name: "WatchCare-AI",
    context: "NexHacks @ Carnegie Mellon · 24 hours",
    description:
      "Real-time fall detection on existing hospital camera feeds: pose estimation flags slumps and slides, and Firebase pushes alerts to an Android nurse app with claim/resolve and an audit trail.",
    stack: ["Python", "OpenCV", "MediaPipe Pose", "Firebase Firestore", "Kotlin"],
    links: {
      code: "https://github.com/anantp1910/WatchCare-AI",
      devpost: "https://devpost.com/software/watchcareai",
    },
    myRole: todo("What you built on WatchCare-AI"),
  },
  {
    slug: "fadethat",
    name: "FadeThat",
    context: "Idea to live deploy in 3 hours",
    description: "Paste any article and it ranks every claim by how wrong it is, in under 10 seconds.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Claude API", "Vercel"],
    links: {
      live: "https://fadethat.vercel.app",
      code: "https://github.com/Devaj6190/FadeThat",
    },
    myRole: todo("What you built on FadeThat"),
  },
  {
    slug: "mysh",
    name: "mysh",
    context: "CMPSC 311",
    description: "A Unix shell in C with pipes, I/O redirection, background jobs and env-var expansion.",
    stack: ["C", "Valgrind"],
    links: {
      code: "https://github.com/AnushaAgarwal27/MyShell",
    },
    myRole:
      "I built the tokenizer/parser, process execution, signal handling and background jobs (fork, execvp, waitpid, dup2, sigaction), and checked memory with Valgrind.",
  },
];

/* ── Panel 6 · Hackathon log ────────────────────────────────────────────── */

export const hackathonLog: { command: string; entries: LogEntry[] } = {
  command: "tail hackathons.log",
  entries: [
    { event: "MOLTEN · LA Tech Week", project: "FireDrill AR", award: "DataFeel", date: "Oct 2026" },
    { event: "Bitcamp 2026", project: "Terrametric", award: "3 prizes", date: "Apr 2026" },
    { event: "AWS Builder Loft 2026", project: "Nod", award: "Top 5", date: todo("AWS Builder Loft date") },
    { event: "Cal Hacks 13.0", project: "RollPay", date: todo("Cal Hacks 13.0 date") },
    { event: "UC Berkeley AI Hack 2026", project: "Blue Grid", date: todo("UC Berkeley AI Hackathon date") },
    { event: "HackGT 13", project: "Echo by Relay", date: todo("HackGT 13 date") },
    { event: "super{set} Renaissance", project: "Would You Jump?", date: todo("super{set} Renaissance date") },
    { event: "NexHacks @ CMU", project: "WatchCare-AI", date: "Jan 2026" },
  ],
};

/* ── Panel 7 · About ────────────────────────────────────────────────────── */

export const about = {
  heading: "Hey, I’m Varnika!",
  body: [
    "I’m a double major in Computer Science and Mathematics at Penn State, class of 2028. I like problems where the math and the people both matter: crop losses, payroll, patients waiting on prescriptions, aging city infrastructure.",
    "I go to three or four hackathons a semester, and I help run them too: I’m on the education team for HackPSU, Penn State’s flagship hackathon, and on the exec team of Builders Collective, where I run idea-to-prototype workshops and take members to hackathons.",
  ],
  footnote: "Penn State Math Club · Directed Reading Program Scholar",
  /** Small tag stamped on the about photo. */
  photoTag: "Cal Hacks 13.0",
};

/* ── Panel 8 · Experience ───────────────────────────────────────────────── */

export const experience: {
  experienceHeading: string;
  experience: TimelineEntry[];
  leadershipHeading: string;
  leadership: TimelineEntry[];
  education: { school: string; degree: string; expected: string; coursework: string[] };
} = {
  experienceHeading: "Experience",
  experience: [
    {
      role: "Strategy Analyst, Microstructure Trading Algorithm",
      org: "PSU Quants",
      dates: "Sept 2025–Present",
      location: "State College, PA",
      description:
        "Analyze high-frequency order book data to model liquidity imbalances, spread dynamics and trade impact. Backtest strategies on Sharpe ratio, drawdown and execution efficiency, and work with engineers to turn trading logic into code.",
    },
    {
      role: "Undergraduate Researcher",
      org: "Dr. Stefan M. Lewellen, Penn State",
      dates: "Jan 2026–Present",
      description: "Quantitative models of shadow banking, systemic risk and financial intermediation.",
    },
    {
      role: "Learning Assistant & Grader",
      org: "Penn State Mathematics",
      dates: "Aug 2025–Present",
      description:
        "Learning assistant for MATH 220 (Matrices, 50+ students) and MATH 230 (Calculus & Vector Analysis); grader for MATH 22 (80+ students) and MATH 230.",
    },
    {
      role: "National EdTech & IT Intern",
      org: "Lavner Education",
      dates: "May–Aug 2026",
      location: "Philadelphia, PA",
      description:
        "Supported IT for 50+ STEM summer camp sites nationwide (robotics, Minecraft, Roblox and AI programs) and resolved 900+ support tickets, working directly with instructors to keep camps running.",
    },
  ],
  leadershipHeading: "Leadership",
  leadership: [
    {
      role: "Education Team Organizer",
      org: "HackPSU",
      dates: "Sept 2025–Present",
      description: "Plan pre-hackathon workshops with campus clubs and run voting and judging at Penn State’s largest hackathon.",
    },
    {
      role: "Executive Team: Event Planner & Secretary",
      org: "Builders Collective",
      dates: "May 2026–Present",
      description: "Helped run c0mpiled-15 ($10K+ in prizes) and get Penn State teams to hackathons in SF and LA.",
    },
    {
      role: "Web Manager",
      org: "Penn State ERO Billiards Club",
      dates: "Feb 2026–Present",
      description: "Run the club site: schedules, results, tournament sign-up forms and weekly recaps.",
    },
    {
      role: "Team Lead",
      org: "Women Power Society",
      dates: "2020–2023",
      description: "Led a program that taught 100 adults in slum communities to read and write in Hindi.",
    },
  ],
  education: {
    school: "The Pennsylvania State University",
    degree: "B.S. Computer Science & B.S. Mathematics",
    expected: "expected May 2028",
    coursework: [
      "Data Structures & Algorithms",
      "Systems Programming",
      "Probability",
      "Linear Programming",
      "Real Analysis",
    ],
  },
};

/* ── Panel 9 · Off the clock ───────────────────────────────────────────── */

export const offTheClock: { heading: string; groups: OffClockGroup[] } = {
  heading: "Off the clock.",
  groups: [
    {
      label: "languages i speak",
      items: [
        { name: "Hindi", note: "native" },
        { name: "English", note: "full professional" },
        { name: "Punjabi", note: "full professional" },
      ],
    },
    {
      label: "when i’m not coding",
      items: [
        { name: "Billiards", note: "ERO Billiards Club" },
        { name: "Cats" },
        { name: "Horses" },
        { name: "Memes" },
      ],
    },
    {
      label: "always learning",
      items: [
        { name: "Machine Learning Specialization", note: "DeepLearning.AI & Stanford · 2025" },
        { name: "NAiSS Machine Learning Bootcamp", note: "Nittany AI Student Society · 2026" },
        { name: "Directed Reading Program", note: "Number theory & proofs · 2026" },
        { name: "Penn State Math Club" },
      ],
    },
  ],
};

/* ── Panel 10 · Good fit ─────────────────────────────────────────────────── */

export const goodFit = {
  heading: "Where I’ll be useful.",
  roles: ["Full-stack", "Backend", "AI/ML", "Quant-dev"],
  body: [
    "I’m looking for Summer 2027 software engineering internships: full-stack, backend, AI/ML, or quant-dev teams.",
    "We’ll get along if your team ships fast, sweats whether the numbers are actually right, and wants an intern who has already taken products from an empty repo to a live demo in 36 hours, with tests.",
  ],
  cta: { lead: "Hiring?", action: "Let’s talk", target: "contact" as SectionId },
};

/* ── Panel 10 · Toolbox ─────────────────────────────────────────────────── */

export const toolbox: Capability[] = [
  {
    heading: "Full-stack web.",
    tags: ["TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS", "shadcn/ui", "TanStack Query", "HTML/CSS"],
  },
  {
    heading: "Backend & real-time.",
    tags: [
      "Python",
      "FastAPI",
      "Flask",
      "Node.js",
      "Bun",
      "WebSockets",
      "REST APIs",
      "Convex",
      "Supabase/Postgres",
      "Firebase Firestore",
      "Redis",
      "SQL",
    ],
  },
  {
    heading: "AI & ML.",
    tags: [
      "LLM APIs (Claude, Grok, DeepSeek)",
      "Multi-agent systems",
      "XGBoost",
      "scikit-learn",
      "Pose estimation (MediaPipe/OpenCV)",
      "In-browser inference (ONNX Runtime Web, Transformers.js, WebGPU)",
    ],
  },
  {
    heading: "Data & quant.",
    tags: [
      "pandas",
      "GeoPandas",
      "Satellite & geospatial data",
      "Backtesting",
      "Order-book analysis",
      "Probability & linear programming",
    ],
  },
  {
    heading: "Systems & shipping.",
    tags: ["C", "Java", "Linux/Unix", "Git", "Vitest", "Playwright", "Zod", "Snyk", "Vercel", "Render", "Kotlin/Android"],
  },
];

/* ── Panel 11 · Contact ─────────────────────────────────────────────────── */

export const contact = {
  heading: "Let’s build something.",
  body: "Internship, hackathon team, or a problem that needs building? My inbox is open.",
  copyLabel: "Copy email address",
  copiedToast: "copied ✓",
  resumeLabel: "Résumé",
};

/* ── Panel 12 · Footer ──────────────────────────────────────────────────── */

export const footer = {
  heading: "Where I hang out online",
};
