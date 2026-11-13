"use client";

import { useEffect, useRef } from "react";
import { framePath } from "@/lib/frame-path";

type FrameProps = {
  /** Text in the gap of the top line, e.g. "// selected work". */
  label?: string;
  labelId?: string;
  /** Render the label as the panel's <h2> (for panels without another heading). */
  labelAs?: "h2" | "p";
  /** px from the element's edges. Defaults to --frame-inset (24px). */
  inset?: number;
  /** Concave corner radius in px. Defaults to --frame-radius (28px). */
  radius?: number;
  className?: string;
};

function LabelText({ label }: { label: string }) {
  const match = label.match(/^(\/\/\s*)(.*)$/);
  if (!match) return <>{label}</>;
  return (
    <>
      <span aria-hidden="true">{match[1]}</span>
      {match[2]}
    </>
  );
}

/**
 * The thin inset frame every panel (and photo) gets: an absolutely positioned
 * SVG with concave ticket-stub corners and an optional label sitting in a gap
 * in the top line. Redraws on resize via ResizeObserver. Stroke is
 * currentColor, so it follows the panel's text color.
 */
export function Frame({ label, labelId, labelAs = "p", inset = 24, radius = 28, className = "" }: FrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const update = () => {
      const width = root.offsetWidth;
      const height = root.offsetHeight;
      const labelWidth = labelRef.current?.offsetWidth ?? 0;
      const d = framePath({
        width,
        height,
        inset,
        radius,
        gap: label ? { center: width / 2, width: labelWidth } : null,
      });
      // Written straight to the DOM: resizes shouldn't re-render React.
      svgRef.current?.firstElementChild?.setAttribute("d", d);
      if (d) svgRef.current?.setAttribute("data-ready", "");
    };
    const ro = new ResizeObserver(update);
    ro.observe(root);
    if (labelRef.current) ro.observe(labelRef.current);
    // No manual first call: the observer fires once the panel is laid out,
    // which for off-screen panels (content-visibility) is when they near view.
    return () => ro.disconnect();
  }, [inset, radius, label]);

  const labelClass =
    "t-mono pointer-events-auto absolute left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap px-[var(--frame-label-pad)] lowercase";

  return (
    <div ref={rootRef} className={`pointer-events-none absolute inset-0 ${className}`}>
      <svg
        ref={svgRef}
        className="frame-svg absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
        focusable="false"
      >
        <path />
      </svg>
      {label &&
        (labelAs === "h2" ? (
          <h2 ref={labelRef} id={labelId} className={labelClass} style={{ top: inset }}>
            <LabelText label={label} />
          </h2>
        ) : (
          <p ref={labelRef} id={labelId} className={labelClass} style={{ top: inset }}>
            <LabelText label={label} />
          </p>
        ))}
    </div>
  );
}
