"use client";

import { useRef, type ReactNode, type SVGProps } from "react";
import { useLive } from "@/lib/useLive";

export type IllustrationProps = {
  className?: string;
  /** Draw in on scroll (stroke-dashoffset). Off for illustrations that animate their own entrance. */
  draw?: boolean;
};

/**
 * Shared <svg> wrapper for the line-art illustrations.
 *
 * Class vocabulary inside an illustration:
 *   .s     1.75px stroke in the panel's text color (plum on light, ice on dark)
 *   .d     stroke that draws itself in
 *   .f     the illustration's one flat accent fill (wasabi on light, persimmon on dark)
 *   .p     persimmon marker
 *   .bg    panel background (to mask lines behind a shape)
 *   .fade  fades in after the strokes
 *   .amb   ambient CSS loop: only runs while the SVG is on screen ([data-live])
 */
export function Illustration({
  viewBox,
  className = "",
  draw = true,
  preserveAspectRatio,
  onLiveChange,
  children,
  ...rest
}: IllustrationProps & {
  viewBox: string;
  preserveAspectRatio?: string;
  onLiveChange?: (live: boolean) => void;
  children: ReactNode;
} & Omit<SVGProps<SVGSVGElement>, "viewBox" | "className" | "children" | "ref">) {
  const ref = useRef<SVGSVGElement>(null);
  useLive(ref, onLiveChange);

  return (
    <svg
      suppressHydrationWarning
      ref={ref}
      viewBox={viewBox}
      className={`illo ${className}`}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      focusable="false"
      data-draw={draw ? "" : undefined}
      {...rest}
    >
      {children}
    </svg>
  );
}
