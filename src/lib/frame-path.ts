export type FrameGeometry = {
  width: number;
  height: number;
  /** Distance from the element's edges to the frame line. */
  inset: number;
  /** Radius of the concave (inverted quarter-circle) corners. */
  radius: number;
  /** Optional gap in the top line, e.g. for a section label. */
  gap?: { center: number; width: number } | null;
};

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * SVG path for a rectangle with concave corners: each corner is a quarter
 * circle centred on the corner point itself, so it bites into the frame like
 * a ticket stub. The path runs clockwise; with a `gap`, it starts at the right
 * side of the gap and ends at the left side, leaving the gap open.
 */
export function framePath({ width: w, height: h, inset: i, radius, gap }: FrameGeometry): string {
  if (w <= i * 2 || h <= i * 2) return "";
  const r = Math.max(0, Math.min(radius, (w - i * 2) / 2, (h - i * 2) / 2));
  const L = i;
  const T = i;
  const R = w - i;
  const B = h - i;
  // Clockwise traversal + sweep-flag 0 = arc bulges toward the corner point's inside.
  const arc = (x: number, y: number) => `A${r2(r)} ${r2(r)} 0 0 0 ${r2(x)} ${r2(y)}`;

  const around = [
    `L${r2(R - r)} ${r2(T)}`,
    arc(R, T + r),
    `L${r2(R)} ${r2(B - r)}`,
    arc(R - r, B),
    `L${r2(L + r)} ${r2(B)}`,
    arc(L, B - r),
    `L${r2(L)} ${r2(T + r)}`,
    arc(L + r, T),
  ];

  if (gap && gap.width > 0) {
    const left = Math.max(L + r, gap.center - gap.width / 2);
    const right = Math.min(R - r, gap.center + gap.width / 2);
    return [`M${r2(right)} ${r2(T)}`, ...around, `L${r2(left)} ${r2(T)}`].join(" ");
  }
  return [`M${r2(L + r)} ${r2(T)}`, ...around, "Z"].join(" ");
}
