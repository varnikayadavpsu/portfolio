/**
 * TypeScript mirror of the colour tokens in src/app/globals.css (@theme).
 * Only used where CSS variables can't reach: the generated Open Graph image,
 * the favicon and the browser theme colour. Keep the two in sync.
 */
export const colors = {
  paper: "#f5f2eb",
  ink: "#141414",
  red: "#e3262f",
  yellow: "#f6e05e",
  lavender: "#8e8db8",
  plum: "#351e28",
} as const;
