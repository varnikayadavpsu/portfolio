/**
 * Types for src/content/site.ts.
 *
 * Anything still missing is written as `todo("…")`. A TODO never renders in a
 * production build: components call `filled()` and skip the value until it's a
 * real string. In `npm run dev` a small dashed "TODO" tag shows where it goes.
 * Run `npm run todos` to list every open TODO.
 */

export type Todo = { readonly todo: string };

/** Mark a value as "still missing". It will not render. */
export const todo = (note: string): Todo => ({ todo: note });

/** A value that may still be a TODO. */
export type Fillable<T> = T | Todo;

export function isTodo(value: unknown): value is Todo {
  return (
    typeof value === "object" &&
    value !== null &&
    "todo" in value &&
    typeof (value as Todo).todo === "string"
  );
}

/** Returns the value if it has been filled in, otherwise `undefined`. */
export function filled<T>(value: Fillable<T> | undefined | null): T | undefined {
  if (value === undefined || value === null || isTodo(value)) return undefined;
  return value;
}

/** Ids of the on-page sections (used for anchors and nav). */
export type SectionId =
  | "top"
  | "about"
  | "journey"
  | "work"
  | "experience"
  | "off-the-clock"
  | "playground"
  | "toolbox"
  | "contact";

export type SocialKey = "linkedin" | "github" | "devpost";

export type SocialLink = {
  key: SocialKey;
  label: string;
  href: string;
};

export type ProjectLinks = {
  live?: Fillable<string>;
  code?: Fillable<string>;
  devpost?: Fillable<string>;
};

/** One big number. `value` is shown as written ("59/60", "73%", "Top 5"). */
export type Stat = {
  value: string;
  caption: string;
};

export type FeaturedProject = {
  slug: string;
  name: string;
  event: string;
  /** Extra event facts, e.g. "36 hours · team of 3". */
  eventMeta?: string;
  /** Prize line(s) as they appear on Devpost or the site. */
  awards?: string[];
  /** How many of `awards` are prizes (used to count prizes site-wide). */
  prizeCount?: number;
  oneLiner: string;
  /** The headline number shown big on the card. */
  stat: Stat;
  /** Optional second, smaller number. */
  stat2?: Stat;
  stack: string[];
  links: ProjectLinks;
  team?: string[];
  /** Screenshot in /public/projects (captured by `npm run capture`). */
  image?: string;
};

export type MiniProject = {
  slug: string;
  name: string;
  context: string;
  description: string;
  stack: string[];
  links: ProjectLinks;
  /** Screenshot in /public/projects, or an ink drawing when there's no live site. */
  image?: string;
  art?: "terminal" | "fall-alert";
};

/** Map pins. Positions are projected in src/components/journey/usMap.ts. */
export type PlaceId =
  | "state-college"
  | "pittsburgh"
  | "college-park"
  | "berkeley"
  | "atlanta"
  | "inglewood"
  | "san-francisco";

export type JourneyStop = {
  id: string;
  place: PlaceId;
  city: string;
  event: string;
  dates: string;
  project?: string;
  /** Slug of a featured project or more-build (for the thumbnail). */
  projectSlug?: string;
  prize?: string;
  story: string;
  stat: Stat;
  /** Where the date and location were confirmed. */
  source: string;
  sourceUrl?: string;
};

export type Role = {
  role: string;
  org: string;
  dates: string;
  location?: string;
  description: string;
  icon: "integral" | "candles" | "bank" | "robot";
};

export type Leadership = {
  role: string;
  org: string;
  dates: string;
  description: string;
};

export type SkillGroup = {
  heading: string;
  tags: string[];
};

export type Sticker = {
  id: string;
  lines: string[];
  shape: "circle" | "ticket" | "hex" | "rounded" | "flame" | "braces" | "burst" | "bubble";
  tone: "red" | "yellow" | "paper";
};

export type SpillItem =
  | { kind: "eightball" }
  | { kind: "bubble"; text: string; lang: string; label: string }
  | { kind: "book"; label: string }
  | { kind: "candles" }
  | { kind: "laptop" }
  | { kind: "cat" }
  | { kind: "horse" }
  | { kind: "meme" }
  | { kind: "network" };
