import { filled, type ProjectLinks } from "@/content/types";

const LABELS: Record<keyof ProjectLinks, string> = {
  live: "Live",
  code: "Code",
  devpost: "Devpost",
};

/** Only the links that exist (TODOs and missing ones are skipped). */
export function projectLinks(links: ProjectLinks) {
  return (Object.keys(LABELS) as (keyof ProjectLinks)[])
    .map((key) => ({ key, label: LABELS[key], href: filled(links[key]) }))
    .filter((link): link is { key: keyof ProjectLinks; label: string; href: string } => Boolean(link.href));
}
