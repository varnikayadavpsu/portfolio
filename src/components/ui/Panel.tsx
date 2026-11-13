import type { CSSProperties, ReactNode } from "react";
import { sections } from "@/content/site";
import type { SectionId } from "@/content/types";
import { Frame } from "./Frame";

export type PanelTheme = "ice" | "wasabi" | "jade" | "plum";

type PanelProps = {
  id: SectionId;
  theme: PanelTheme;
  /** Width in the horizontal layout, e.g. "130cqw" (cqw = % of the visible track). */
  width?: string;
  /** id of the panel's own heading. Without it, the frame label becomes the <h2>. */
  headingId?: string;
  /** Hide the frame (when a panel draws its own). */
  frame?: boolean;
  as?: "section" | "footer";
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * One full-height panel of the horizontal track (a normal section when stacked).
 */
export function Panel({
  id,
  theme,
  width,
  headingId,
  frame = true,
  as: Tag = "section",
  className = "",
  style,
  children,
}: PanelProps) {
  const meta = sections[id];
  const labelId = `${id}-label`;
  const labelledBy = headingId ?? (meta.label ? labelId : undefined);

  return (
    <Tag
      id={id}
      data-panel=""
      data-hud={meta.hud}
      data-auto-width={width === "auto" ? "" : undefined}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={`panel theme-${theme} outline-none ${className}`}
      style={{ ...(width ? ({ "--panel-w": width } as CSSProperties) : null), ...style }}
    >
      {frame && <Frame label={meta.label} labelId={labelId} labelAs={headingId ? "p" : "h2"} />}
      {children}
    </Tag>
  );
}
