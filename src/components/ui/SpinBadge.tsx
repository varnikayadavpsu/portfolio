import type { CSSProperties } from "react";

/**
 * Round sticker with text running around its edge, spinning slowly (still
 * under reduced motion). The whole sticker is a link; screen readers get the
 * plain label.
 */
export function SpinBadge({
  label,
  href,
  className = "",
  style,
}: {
  label: string;
  href: string;
  className?: string;
  style?: CSSProperties;
}) {
  const r = 50;
  const circumference = 2 * Math.PI * r;
  return (
    <a
      href={href}
      aria-label={label}
      className={`spin-badge group block rounded-full [--focus:var(--color-plum)] ${className}`}
      style={style}
    >
      <svg viewBox="0 0 140 140" className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
        <defs>
          <path id="spin-badge-ring" d={`M70 70 m-${r} 0 a${r} ${r} 0 1 1 ${r * 2} 0 a${r} ${r} 0 1 1 -${r * 2} 0`} />
        </defs>
        <circle cx="70" cy="70" r="68" fill="var(--color-wasabi)" stroke="var(--color-plum)" strokeWidth="1.5" />
        <g className="spin-badge-ring">
          <text
            fill="var(--color-plum)"
            fontFamily="var(--font-mono)"
            fontSize="10.5"
            fontWeight="500"
            letterSpacing="0"
            style={{ textTransform: "uppercase" }}
          >
            <textPath href="#spin-badge-ring" textLength={circumference - 2} lengthAdjust="spacing">
              {`${label} ✦ `}
            </textPath>
          </text>
        </g>
        <circle cx="70" cy="70" r="30" fill="var(--color-plum)" />
        <text
          x="70"
          y="70"
          dy="0.35em"
          textAnchor="middle"
          fill="var(--color-wasabi)"
          fontFamily="var(--font-display)"
          fontSize="30"
          fontWeight="900"
          className="spin-badge-arrow"
        >
          →
        </text>
      </svg>
    </a>
  );
}
