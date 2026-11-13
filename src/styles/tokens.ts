/**
 * TypeScript mirror of the color tokens in src/app/globals.css (@theme).
 * Only used where CSS variables can't reach: the generated Open Graph image,
 * the favicon and the browser theme color. Keep the two in sync.
 */
export const colors = {
  plum: "#351e28",
  wasabi: "#e9f056",
  ice: "#d7efff",
  jade: "#aeb8a0",
  persimmon: "#ff5c34",
} as const;
