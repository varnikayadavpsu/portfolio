/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every string, link, project and stat on the site lives in this file.
 *  Edit here; the components only read from it.
 *
 *  • Values written as todo("…") are placeholders. They never render in a
 *    production build. In `npm run dev` a dashed TODO tag marks the spot.
 *  • `npm run todos` lists every TODO still open.
 *  • Sources: varnikayadav.com (Nov 2026) and Devpost. Journey dates and
 *    locations were checked against each hackathon's Devpost page; the two
 *    events that aren't on Devpost say where they were confirmed instead.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import {
  todo,
  type FeaturedProject,
  type Fillable,
  type JourneyStop,
  type Leadership,
  type MiniProject,
  type Role,
  type SectionId,
  type SkillGroup,
  type SocialLink,
  type SpillItem,
  type Sticker,
} from "./types";

/* ── Identity & links ───────────────────────────────────────────────────── */

export const person = {
  name: "Varnika Yadav",
  first: "varnika",
  monogram: "VY",
  email: "varnika2271@gmail.com",
  location: "State College, PA",
  /** Not linked anywhere for now. Drop a PDF here later and add a link if you want one. */
  resumePath: "/resume.pdf",
  /** The photo on the hero desk (same one as the old site's hero). */
  photo: { src: "/images/varnika-polaroid.jpg", alt: "Varnika Yadav, smiling, on a train platform" },
  /** Optional: an ink drawing of your face for the nav button. A doodle is used until then. */
  facePath: "/face.png",
};

export const siteUrl: Fillable<string> = "https://varnikayadav.com";

export const social: SocialLink[] = [
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/varnika-yadav-vvy5053" },
  { key: "github", label: "GitHub", href: "https://github.com/varnikayadavpsu" },
  { key: "devpost", label: "Devpost", href: "https://devpost.com/varnikayadavpsu" },
];

export const seo = {
  title: "Varnika Yadav · Software for messy, real-world problems",
  description:
    "CS + Math double major at Penn State who builds full-stack, AI-powered tools for farms, payroll, hospitals and city water lines, and tests them until the numbers hold up.",
  ogAlt: "Varnika Yadav, software for messy, real-world problems",
};

/* ── Splash & nav ───────────────────────────────────────────────────────── */

export const splash = { lines: ["VARNIKA", "YADAV"] };

export const nav: { links: { label: string; target: SectionId }[]; homeLabel: string } = {
  links: [
    { label: "work", target: "work" },
    { label: "about", target: "about" },
    { label: "journey", target: "journey" },
    { label: "playground", target: "playground" },
    { label: "contact", target: "contact" },
  ],
  homeLabel: "Varnika Yadav, back to top",
};

export const skipLink = { label: "Skip to work", target: "work" as SectionId };

/* ── 1 · Hero ───────────────────────────────────────────────────────────── */

export const hero = {
  hello: "hello,",
  intro: "my name is",
  name: "varnika",
  kaomoji: ">ω<",
  tagline: "Software for messy, real-world problems.",
  bio: "CS + Math @ Penn State ’28. I build full-stack, AI-powered tools for farms, payroll, hospitals and city water systems, and test them until the numbers hold up.",
  hint: "psst: the coloured things on my desk are clickable (and make noise)",
  scrollCue: "things I’ve shipped",
  /** Labels that pop up on the desk objects, and where each one goes. */
  hotspots: {
    photo: { label: "that’s me → about", target: "about" as SectionId },
    laptop: { label: "$ ./mysh → work", target: "work" as SectionId },
    notebooks: { label: "∫ math notes → experience", target: "experience" as SectionId },
    trophy: { label: "prizes → journey", target: "journey" as SectionId },
    eightball: { label: "8-ball → off the clock", target: "off-the-clock" as SectionId },
    candles: { label: "PSU Quants → experience", target: "experience" as SectionId },
    phone: { label: "ring ring → contact", target: "contact" as SectionId },
  },
};

/* ── 2 · About story ────────────────────────────────────────────────────── */

export type StorySegment = { text: string; mark?: "highlight" | "underline" | "circle" };

export const aboutStory: {
  kicker: string;
  heading: string;
  paragraphs: { segments: StorySegment[]; note?: { text: string; tone: "yellow" | "pink" } }[];
  footnote: string;
} = {
  kicker: "$ cat about.txt",
  heading: "Hey, I’m Varnika!",
  paragraphs: [
    {
      segments: [
        { text: "I’m a double major in " },
        { text: "CS and Math", mark: "highlight" },
        {
          text: " at Penn State, class of 2028. I like problems where the math and the people both matter: crop losses, payroll, patients waiting on prescriptions, aging city infrastructure.",
        },
      ],
      note: { text: "3 or 4 hackathons a semester ✦", tone: "yellow" },
    },
    {
      segments: [
        { text: "I build full-stack, AI-powered tools for " },
        { text: "messy, real-world problems", mark: "underline" },
        { text: ", usually in 36 hours, with a team, on very little sleep, and I " },
        { text: "test them until the numbers hold up", mark: "circle" },
        { text: "." },
      ],
      note: { text: "I help run them too: education team @ HackPSU →", tone: "pink" },
    },
    {
      segments: [
        {
          text: "Off the hackathon floor I’m a strategy analyst at PSU Quants and an undergraduate researcher studying systemic risk, so I care a lot about whether the numbers are right.",
        },
      ],
      note: { text: "exec team @ Builders Collective: idea-to-prototype workshops", tone: "yellow" },
    },
  ],
  footnote: "Penn State Math Club ✦ Directed Reading Program Scholar",
};

/* ── 3 · Projects (used by Journey + Work) ──────────────────────────────── */

export const work = {
  kicker: "$ ls ~/shipped",
  headingLead: "Things I shipped, and ",
  headingMark: "the numbers they moved",
  headingTail: ".",
  moreHeading: "More builds",
};

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "terrametric",
    name: "Terrametric",
    event: "Bitcamp 2026 (UMD)",
    awards: [
      "Real World Prize (Ambrook track)",
      "Best Champion of Open Source w/ Featherless",
      "Best Intermediate Data Science Track Hack",
    ],
    prizeCount: 3,
    oneLiner:
      "Live crop-stress scores, 14-day forecasts and dollar-priced prescriptions that tell growers which field to treat first.",
    stat: { value: "3 prizes", caption: "at Bitcamp 2026" },
    stat2: { value: "14-day", caption: "crop-stress forecast" },
    stack: ["Python", "FastAPI", "WebSockets", "XGBoost", "Next.js", "TypeScript", "GLSL", "SQLite", "Vercel"],
    links: {
      live: "https://terrametric-delta.vercel.app",
      code: "https://github.com/vs-githjk/Terrametric",
      devpost: "https://devpost.com/software/terrametric",
    },
    team: ["Abhinav Dasari", "Vidyut Sriram"],
    image: "/projects/terrametric.jpg",
  },
  {
    slug: "firedrill-ar",
    name: "FireDrill AR",
    event: "MOLTEN Spatial Hackathon, LA Tech Week 2026",
    eventMeta: "6 hours · team of 5 · Apple Vision Pro",
    awards: ["Best Use of DataFeel (DataFeel track)", "Won a $1,500 DataFeel kit"],
    prizeCount: 1,
    oneLiner:
      "An immersive fire drill for kids and students: scan a real room and it becomes a fire you can see, hear and feel.",
    stat: { value: "6 hrs", caption: "to a fire you can see, hear and feel" },
    stat2: { value: "DataFeel", caption: "track winner" },
    stack: ["three.js", "WebXR", "Vite", "FastAPI", "WebSockets", "Claude API", "AssemblyAI", "DataFeel", "Unity"],
    links: {
      live: "https://firedrill-ar.vercel.app",
      code: "https://github.com/prakhar2000/FIreDrillAR",
    },
    team: ["Devajsinh Solanki", "Prakhar Goel", "Emma Sun", "Haotian Yin"],
    image: "/projects/firedrill-ar.jpg",
  },
  {
    slug: "rollpay",
    name: "RollPay",
    event: "Cal Hacks 13.0",
    eventMeta: "36 hours · team of 3",
    oneLiner:
      "An AI payroll assistant that catches bad hours before payday and hands the owner a payroll that’s right.",
    stat: { value: "59/60", caption: "planted errors caught, zero false alarms" },
    stat2: { value: "35/46", caption: "real pay periods matched to the cent" },
    stack: ["TypeScript", "Next.js", "React", "Convex", "Claude API", "Bun", "Vitest", "Playwright", "Zod", "iMessage"],
    links: {
      live: "https://rollpay-live.vercel.app",
      code: "https://github.com/Devaj6190/hyphenatable",
      devpost: "https://devpost.com/software/rollpay",
    },
    team: ["Devajsinh Solanki", "Shanin Drucquer"],
    image: "/projects/rollpay.jpg",
  },
  {
    slug: "nod",
    name: "Nod",
    event: "AI Startup Challenge, AWS Builder Loft 2026",
    eventMeta: "6 hours · team of 3",
    awards: ["Top 5", "Invited to speak at the AWS AI Summit"],
    prizeCount: 0,
    oneLiner:
      "Five AI agents that turn founders’ customer interviews into ranked, quote-backed feature cards, then write and ship the code.",
    stat: { value: "Top 5", caption: "and invited to speak at the AWS AI Summit" },
    stat2: { value: "5 agents", caption: "interviews → feature cards → shipped code" },
    stack: ["Python", "Flask", "AI agents", "Cognee", "Snyk", "Flexprice"],
    // No public demo exists (the repo only runs on localhost), so it links to the code.
    links: {
      code: "https://github.com/AnushaAgarwal27/Nod",
    },
    team: ["Anusha Agarwal", "Vedant Shirvi"],
  },
  {
    slug: "blue-grid",
    name: "Blue Grid",
    event: "UC Berkeley AI Hackathon 2026",
    oneLiner:
      "Finds the city water pipes most likely to break next and gives crews a 72-hour plan to fix them first.",
    stat: { value: "73%", caption: "of pipes that broke were in its highest-risk group" },
    stat2: { value: "72-hr", caption: "repair plan for crews" },
    stack: ["Python", "Flask", "scikit-learn", "pandas", "GeoPandas", "Redis", "Leaflet.js", "Claude API", "Browserbase"],
    links: {
      live: "https://blue-grid-kitchener.vercel.app",
      devpost: "https://devpost.com/software/blue-grid",
    },
    image: "/projects/blue-grid.jpg",
  },
  {
    slug: "echo-by-relay",
    name: "Echo by Relay",
    event: "HackGT 13 (Georgia Tech)",
    oneLiner:
      "From one sentence a doctor says out loud, Echo makes sure the patient actually gets their medicine.",
    stat: { value: "1 sentence", caption: "from a doctor starts the whole flow" },
    stat2: { value: "2 languages", caption: "plans explained in Spanish or English" },
    stack: ["TypeScript", "Next.js", "Supabase", "Tailwind CSS", "xAI Grok", "Vercel"],
    links: {
      // echobyrelay.tech stopped resolving (Nov 2026); this is the URL on the GitHub repo.
      live: "https://echo-by-relay.vercel.app",
      code: "https://github.com/anantp1910/EchoByRelay",
      devpost: "https://devpost.com/software/echobyrelay",
    },
    team: ["Vedant Shirvi", "Anant Patel"],
    image: "/projects/echo-by-relay.jpg",
  },
  {
    slug: "would-you-jump",
    name: "Would You Jump?",
    event: "National Renaissance Hackathon at super{set}",
    oneLiner:
      "A private AI matchmaker for co-founders. You only find out who someone is once you’ve both said yes.",
    stat: { value: "2 yeses", caption: "before any name or contact is revealed" },
    stat2: { value: "0 uploads", caption: "models run in your browser" },
    stack: ["TypeScript", "Next.js", "React", "TanStack Query", "Supabase", "ONNX Runtime Web", "Transformers.js", "WebGPU"],
    links: {
      live: "https://superset-wyj.vercel.app",
      code: "https://github.com/xyzmr114/superset-WYJ",
      devpost: "https://devpost.com/software/would-you-jump",
    },
    team: ["Harsh Rathi", "Abhinav Dasari", "Anusha Agarwal"],
    image: "/projects/would-you-jump.jpg",
  },
];

export const moreBuilds: MiniProject[] = [
  {
    slug: "watchcare-ai",
    name: "WatchCare-AI",
    context: "NexHacks @ Carnegie Mellon · 24 hours",
    description:
      "Real-time fall detection on existing hospital camera feeds, with alerts pushed to an Android nurse app.",
    stack: ["Python", "OpenCV", "MediaPipe Pose", "Firebase", "Kotlin"],
    links: {
      code: "https://github.com/anantp1910/WatchCare-AI",
      devpost: "https://devpost.com/software/watchcareai",
    },
    art: "fall-alert",
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
    image: "/projects/fadethat.jpg",
  },
  {
    slug: "mysh",
    name: "mysh",
    context: "CMPSC 311",
    description: "A Unix shell in C with pipes, I/O redirection, background jobs and env-var expansion.",
    stack: ["C", "Valgrind"],
    links: { code: "https://github.com/AnushaAgarwal27/MyShell" },
    art: "terminal",
  },
];

/* ── 4 · Journey: tail hackathons.log ───────────────────────────────────── */

export const journey: { kicker: string; heading: string; hint: string; stops: JourneyStop[] } = {
  kicker: "$ tail hackathons.log",
  heading: "One map, eight hackathons.",
  hint: "keep scrolling to follow the route",
  stops: [
    {
      id: "home",
      place: "state-college",
      city: "State College, PA",
      event: "Home base: Penn State",
      dates: "CS + Math, class of 2028",
      story: "Where the route starts. I go to three or four hackathons a semester, and help run HackPSU too.",
      stat: { value: "3–4", caption: "hackathons a semester" },
      source: "varnikayadav.com",
    },
    {
      id: "nexhacks",
      place: "pittsburgh",
      city: "Pittsburgh, PA",
      event: "NexHacks @ Carnegie Mellon",
      dates: "Jan 17–18, 2026",
      project: "WatchCare-AI",
      projectSlug: "watchcare-ai",
      story: "Fall detection on the hospital cameras that already exist, pushing alerts straight to a nurse’s phone.",
      stat: { value: "24 hrs", caption: "camera feed to nurse alert" },
      source: "Devpost",
      sourceUrl: "https://nexhacks.devpost.com/",
    },
    {
      id: "bitcamp",
      place: "college-park",
      city: "College Park, MD",
      event: "Bitcamp 2026",
      dates: "Apr 10–12, 2026",
      project: "Terrametric",
      projectSlug: "terrametric",
      prize: "3 prizes, incl. Real World Prize (Ambrook)",
      story: "Crop-stress scores and dollar-priced prescriptions that tell growers which field to treat first.",
      stat: { value: "3", caption: "prizes in one weekend" },
      source: "Devpost",
      sourceUrl: "https://bitcamp-2026.devpost.com/",
    },
    {
      id: "berkeley-ai",
      place: "berkeley",
      city: "Berkeley, CA",
      event: "UC Berkeley AI Hackathon 2026",
      dates: "Jun 20–21, 2026",
      project: "Blue Grid",
      projectSlug: "blue-grid",
      story: "Trained on a real city’s pipe inventory and break history to find the water mains most likely to fail next.",
      stat: { value: "73%", caption: "of broken pipes were in the top-risk group" },
      source: "Devpost",
      sourceUrl: "https://ai-hackathon-2026.devpost.com/",
    },
    {
      id: "hackgt",
      place: "atlanta",
      city: "Atlanta, GA",
      event: "HackGT 13",
      dates: "Sep 25–27, 2026",
      project: "Echo by Relay",
      projectSlug: "echo-by-relay",
      story: "A voice-first copilot that turns one sentence from a doctor into coverage checks and a plan the patient understands.",
      stat: { value: "1", caption: "sentence from a doctor is all it needs" },
      source: "Devpost",
      sourceUrl: "https://hackgt13.devpost.com/",
    },
    {
      id: "molten",
      place: "inglewood",
      city: "Los Angeles (Inglewood), CA",
      event: "MOLTEN Spatial Hackathon, LA Tech Week",
      dates: "Oct 2026",
      project: "FireDrill AR",
      projectSlug: "firedrill-ar",
      prize: "Best Use of DataFeel",
      story: "Scan a real room on a Vision Pro and it becomes a fire drill you can see, hear and feel on your wrists.",
      stat: { value: "6 hrs", caption: "team of 5, one Apple Vision Pro" },
      source: "Not on Devpost: venue from the event’s Luma listing",
      sourceUrl: "https://luma.com/5jo47m0d",
    },
    {
      id: "aws-loft",
      place: "san-francisco",
      city: "San Francisco, CA",
      event: "AI Startup Challenge, AWS Builder Loft",
      dates: "Oct 20, 2026",
      project: "Nod",
      projectSlug: "nod",
      prize: "Top 5, invited to speak at the AWS AI Summit",
      story: "Five agents turn founders’ customer interviews into ranked, quote-backed feature cards, then ship the code.",
      stat: { value: "Top 5", caption: "out of the whole room" },
      source: "Not on Devpost: date and venue from the event’s Luma listing",
      sourceUrl: "https://luma.com/0oww46mm",
    },
    {
      id: "superset",
      place: "san-francisco",
      city: "San Francisco, CA",
      event: "National Renaissance Hackathon at super{set}",
      dates: "Oct 22, 2026",
      project: "Would You Jump?",
      projectSlug: "would-you-jump",
      story: "A private co-founder matchmaker whose models run in your browser. Names stay hidden until both people say yes.",
      stat: { value: "2", caption: "yeses before anyone is revealed" },
      source: "Devpost",
      sourceUrl: "https://national-renaissance-hackathon.devpost.com/",
    },
    {
      id: "calhacks",
      place: "san-francisco",
      city: "San Francisco, CA",
      event: "Cal Hacks 13.0",
      dates: "Oct 23–25, 2026",
      project: "RollPay",
      projectSlug: "rollpay",
      story: "An AI payroll assistant, validated on a real landscaping company’s books before anyone got paid.",
      stat: { value: "59/60", caption: "planted payroll errors caught" },
      source: "Devpost (venue: 3601 Lyon St, San Francisco)",
      sourceUrl: "https://cal-hacks-13-0.devpost.com/",
    },
  ],
};

/* ── 5 · Transitions ────────────────────────────────────────────────────── */

export const transitions = {
  experience: {
    word: "EXPERIENCE",
    index: "05",
    label: "where I’ve worked",
    tape: "PSU Quants ✦ Penn State ✦ Lavner",
  },
  offTheClock: {
    word: "OFF THE CLOCK",
    index: "06",
    label: "what’s in my head",
    tape: "billiards ✦ cats ✦ horses ✦ memes",
  },
};

/* ── 6 · Experience ─────────────────────────────────────────────────────── */

export const experience: {
  kicker: string;
  heading: string;
  roles: Role[];
  badgeLabel: string;
  leadershipHeading: string;
  leadership: Leadership[];
  education: { degree: string; school: string; expected: string; coursework: string[] };
} = {
  kicker: "$ cat experience.log",
  heading: "Where I’ve worked.",
  badgeLabel: "staff",
  roles: [
    {
      role: "Learning Assistant & Grader",
      org: "Penn State Mathematics",
      dates: "Aug 2025 to now",
      description: "LA for MATH 220 (Matrices, 50+ students) and MATH 230 (Calculus & Vector Analysis); grader for MATH 22 (80+ students) and MATH 230.",
      icon: "integral",
    },
    {
      role: "Strategy Analyst, Microstructure Trading Algorithm",
      org: "PSU Quants",
      dates: "Sept 2025 to now",
      location: "State College, PA",
      description: "Model liquidity imbalances, spread dynamics and trade impact from high-frequency order book data, and backtest strategies on Sharpe ratio, drawdown and execution.",
      icon: "candles",
    },
    {
      role: "Undergraduate Researcher",
      org: "Penn State Research, Dr. Stefan M. Lewellen",
      dates: "Jan 2026 to now",
      description: "Quantitative models of shadow banking, systemic risk and financial intermediation.",
      icon: "bank",
    },
    {
      role: "National EdTech & IT Intern",
      org: "Lavner Education",
      dates: "May to Aug 2026",
      location: "Philadelphia, PA",
      description: "IT for 50+ STEM summer camp sites nationwide (robotics, Minecraft, Roblox, AI), working directly with instructors to keep camps running.",
      icon: "robot",
    },
  ],
  leadershipHeading: "Leadership",
  leadership: [
    {
      role: "Education Team Organizer",
      org: "HackPSU",
      dates: "Sept 2025 to now",
      description: "Pre-hackathon workshops with campus clubs; voting and judging at Penn State’s largest hackathon.",
      emblem: "bulb",
    },
    {
      role: "Exec Team: Event Planner & Secretary",
      org: "Builders Collective",
      dates: "May 2026 to now",
      description: "Helped run c0mpiled-15 ($10K+ in prizes) and get Penn State teams to hackathons in SF and LA.",
      emblem: "tools",
    },
    {
      role: "Web Manager",
      org: "ERO Billiards Club",
      dates: "Feb 2026 to now",
      description: "Run the club site: schedules, results, tournament sign-ups and weekly recaps.",
      emblem: "ball",
    },
    {
      role: "Team Lead",
      org: "Women Power Society",
      dates: "2020 to 2023",
      description: "Led a program that taught 100 adults in slum communities to read and write in Hindi.",
      emblem: "book",
    },
  ],
  education: {
    degree: "B.S. Computer Science + B.S. Mathematics",
    school: "The Pennsylvania State University",
    expected: "May 2028",
    coursework: ["Data Structures & Algorithms", "Systems Programming", "Probability", "Linear Programming", "Real Analysis"],
  },
};

/** Counted from the data above so they stay true when you add things. */
const projectCount = featuredProjects.length + moreBuilds.length;
const prizeCount = featuredProjects.reduce((n, p) => n + (p.prizeCount ?? 0), 0);
const hackathonCount = journey.stops.filter((s) => s.id !== "home").length;

export const bigStats: { value: number; suffix?: string; caption: string }[] = [
  { value: 900, suffix: "+", caption: "support tickets resolved at Lavner Education" },
  { value: 50, suffix: "+", caption: "STEM camp sites kept running" },
  { value: projectCount, caption: "projects shipped" },
  { value: hackathonCount, caption: "hackathons" },
  { value: prizeCount, caption: "hackathon prizes" },
];

/* ── 7 · Off the clock ──────────────────────────────────────────────────── */

export const offTheClock: {
  heading: string;
  numbers: [string, string];
  funFact: string;
  mission: string;
  hint: string;
  columns: { label: string; items: { name: string; note?: string }[] }[];
  spill: SpillItem[];
} = {
  heading: "What’s in my head",
  numbers: ["20", "28"],
  funFact: "Fun fact: I speak Hindi, English and Punjabi, and I run the website for Penn State’s billiards club.",
  mission: "Building software for messy, real-world problems.",
  hint: "class of 2028",
  columns: [
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
      items: [{ name: "Billiards", note: "ERO Billiards Club" }, { name: "Cats" }, { name: "Horses" }, { name: "Memes" }],
    },
    {
      label: "always learning",
      items: [
        { name: "Machine Learning Specialization", note: "DeepLearning.AI & Stanford · 2025" },
        { name: "NAiSS ML Bootcamp", note: "Nittany AI Student Society · 2026" },
        { name: "Directed Reading Program", note: "number theory & proofs · 2026" },
        { name: "Penn State Math Club" },
      ],
    },
  ],
  spill: [
    { kind: "eightball" },
    { kind: "bubble", text: "नमस्ते", lang: "hi", label: "Hindi" },
    { kind: "cat" },
    { kind: "candles" },
    { kind: "bubble", text: "hello!", lang: "en", label: "English" },
    { kind: "book", label: "number theory" },
    { kind: "horse" },
    { kind: "laptop" },
    { kind: "bubble", text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", lang: "pa", label: "Punjabi" },
    { kind: "network" },
    { kind: "meme" },
  ],
};

/* ── 8 · Playground ─────────────────────────────────────────────────────── */

export const playground: {
  kicker: string;
  jam: {
    heading: string;
    body: string;
    spotifyLabel: string;
    spotifyUrl: Fillable<string>;
    playerNote: string;
    /** Square cover images in /public/playlist, e.g. "/playlist/01.jpg". */
    covers: Fillable<{ src: string; alt: string }[]>;
  };
  stickers: { heading: string; hint: string; items: Sticker[] };
} = {
  kicker: "$ open ~/playground",
  jam: {
    heading: "jam with me",
    body: "what’s on repeat while I build",
    spotifyLabel: "my spotify",
    spotifyUrl: "https://open.spotify.com/user/312d56xyscbtgmbqwnvsyriq5tze",
    playerNote: "drop the needle for a little lo-fi loop, or hear what I actually play →",
    covers: todo("8 to 12 square album covers in public/playlist/ (01.jpg, 02.jpg, …)"),
  },
  stickers: {
    heading: "Sticker wall",
    hint: "one for every hackathon. drag them around",
    items: [
      { id: "bitcamp", lines: ["BITCAMP", "’26", "★ 3 PRIZES"], shape: "circle", tone: "yellow" },
      { id: "calhacks", lines: ["CAL HACKS", "13.0"], shape: "ticket", tone: "red" },
      { id: "hackgt", lines: ["HACKGT", "13"], shape: "hex", tone: "paper" },
      { id: "molten", lines: ["MOLTEN", "★ DATAFEEL"], shape: "flame", tone: "red" },
      { id: "superset", lines: ["super", "set"], shape: "braces", tone: "paper" },
      { id: "berkeley", lines: ["AI HACK", "BERKELEY ’26"], shape: "burst", tone: "yellow" },
      { id: "aws", lines: ["TOP 5", "AWS LOFT"], shape: "bubble", tone: "red" },
      { id: "nexhacks", lines: ["NEXHACKS", "@ CMU"], shape: "rounded", tone: "yellow" },
      { id: "hackpsu", lines: ["HACKPSU", "ORGANIZER"], shape: "circle", tone: "paper" },
    ],
  },
};

/* ── 9 · Toolbox ────────────────────────────────────────────────────────── */

export const toolbox: { kicker: string; headingLead: string; headingMark: string; again: string; groups: SkillGroup[] } = {
  kicker: "$ unzip toolbox.zip",
  headingLead: "Everything I know, ",
  headingMark: "unwrapped",
  again: "tap the box to burst it again",
  groups: [
    {
      heading: "Frontend",
      tags: ["TypeScript", "JavaScript", "React", "Next.js", "Tailwind CSS", "shadcn/ui", "TanStack Query", "HTML/CSS"],
    },
    {
      heading: "Backend & real-time",
      tags: ["Python", "FastAPI", "Flask", "Node.js", "Bun", "WebSockets", "REST APIs", "Convex", "Supabase/Postgres", "Firebase Firestore", "Redis", "SQL"],
    },
    {
      heading: "AI/ML",
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
      heading: "Data & quant",
      tags: ["pandas", "GeoPandas", "Satellite & geospatial data", "Backtesting", "Order-book analysis", "Probability & linear programming"],
    },
    {
      heading: "Systems & tooling",
      tags: ["C", "Java", "Linux/Unix", "Git", "Vitest", "Playwright", "Zod", "Snyk", "Vercel", "Render", "Kotlin/Android"],
    },
  ],
};

/* ── 10 · Contact ───────────────────────────────────────────────────────── */

export const contact = {
  kicker: "$ ./mysh --call varnika",
  heading: "Let’s build something.",
  line: "Looking for Summer 2027 SWE internships: full-stack, backend, AI/ML, quant-dev.",
  hint: "it’s ringing, I promise",
  ringing: "RING RING",
  bubbleLead: "hi! it’s varnika.",
  copyLabel: "copy",
  copiedLabel: "copied ✓",
  copyright: "© 2026 Varnika Yadav",
};
