/**
 * Types for src/content/site.ts.
 *
 * Anything Varnika still has to provide is written as `todo("…")`. A TODO is
 * never rendered: components call `filled()` and skip the value until it's a
 * real string. Run `npm run todos` to list every open TODO.
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

export type SectionId =
  | "top"
  | "what-i-do"
  | "how-i-build"
  | "work"
  | "hackathon-log"
  | "about"
  | "experience"
  | "off-the-clock"
  | "good-fit"
  | "toolbox"
  | "contact"
  | "footer";

export type SectionMeta = {
  id: SectionId;
  /** Label shown in the gap of the panel frame, e.g. "// selected work". Omit for an unbroken frame. */
  label?: string;
  /** Short name shown in the bottom-right progress HUD. */
  hud: string;
};

export type Photo = {
  /** Path inside /public, e.g. "/images/varnika-portrait.jpg". */
  src: string;
  alt: Fillable<string>;
  /** CSS object-position, e.g. "50% 20%". Adjust to move the crop. */
  objectPosition: string;
};

export type ProjectLinks = {
  live?: Fillable<string>;
  code?: Fillable<string>;
  devpost?: Fillable<string>;
};

export type Award = {
  /** Short text inside the round stamp, e.g. "3 prizes". */
  stamp: string;
  /** Full prize names, listed on the ticket stub. */
  details?: string[];
};

export type FeaturedProject = {
  slug: string;
  name: string;
  event: string;
  /** Extra event facts, e.g. "36 hours · team of 3". */
  eventMeta?: string;
  award?: Award;
  oneLiner: string;
  bullets: string[];
  stack: string[];
  links: ProjectLinks;
  team?: string[];
  /** What Varnika personally built. Not rendered until filled. */
  myRole?: Fillable<string>;
};

export type MiniProject = {
  slug: string;
  name: string;
  /** Where/how it was built, e.g. "NexHacks @ Carnegie Mellon · 24 hours". */
  context: string;
  description: string;
  stack: string[];
  links: ProjectLinks;
  myRole?: Fillable<string>;
};

export type LogEntry = {
  event: string;
  project: string;
  /** Short award text, e.g. "3 prizes". Adds a ★. */
  award?: string;
  /** e.g. "Apr 2026". Rendered only when filled. */
  date?: Fillable<string>;
};

export type TimelineEntry = {
  role: string;
  org: string;
  dates: string;
  location?: string;
  description?: string;
};

export type Capability = {
  heading: string;
  tags: string[];
};

export type SocialKey = "linkedin" | "github" | "devpost";

export type SocialLink = {
  key: SocialKey;
  label: string;
  href: string;
};

export type OffClockGroup = {
  label: string;
  items: { name: string; note?: string }[];
};
