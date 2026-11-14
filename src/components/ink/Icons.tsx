import type { Role } from "@/content/types";

/** Small ink icons for the experience timeline (B), 64 × 64. */
export function RoleIcon({ kind }: { kind: Role["icon"] }) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true" focusable="false">
      {kind === "integral" && (
        <g>
          <rect x="8" y="12" width="48" height="34" rx="3" className="ink f-paper" />
          <rect x="8" y="12" width="48" height="34" rx="3" className="ht-1" opacity="0.4" />
          <text x="32" y="38" textAnchor="middle" className="svg-serif" fontSize="22" fill="#141414">
            ∫dx
          </text>
          <path d="M20 46 L14 58 M44 46 L50 58" className="ink" />
        </g>
      )}
      {kind === "candles" && (
        <g>
          <path d="M8 54 H56" className="ink-2" />
          {[
            [16, 30, 36, 48, 0],
            [27, 22, 26, 40, 1],
            [38, 26, 30, 44, 0],
            [49, 10, 14, 30, 1],
          ].map(([x, wt, bt, bb, up]) => (
            <g key={x}>
              <path d={`M${x} ${wt} V${bb + 5}`} className="ink-2" />
              <rect x={x - 4} y={bt} width="8" height={bb - bt} className={`ink-2 ${up ? "f-paper" : "f-ink"}`} />
            </g>
          ))}
        </g>
      )}
      {kind === "bank" && (
        <g>
          <path d="M8 24 L32 10 L56 24 Z" className="ink f-paper" />
          <path d="M14 24 V46 M24 24 V46 M40 24 V46 M50 24 V46" className="ink" />
          <rect x="8" y="46" width="48" height="6" className="ink f-paper" />
          <circle cx="44" cy="40" r="11" className="ink f-paper" />
          <circle cx="44" cy="40" r="11" className="ht-1" opacity="0.5" />
          <path d="M52 48 L60 56" className="ink-4" />
        </g>
      )}
      {kind === "robot" && (
        <g>
          <path d="M32 6 V14" className="ink-2" />
          <circle cx="32" cy="6" r="3" className="ink-2 f-ink" />
          <rect x="14" y="14" width="36" height="28" rx="6" className="ink f-paper" />
          <circle cx="25" cy="27" r="4" className="ink-2 f-ink" />
          <circle cx="39" cy="27" r="4" className="ink-2 f-ink" />
          <path d="M26 36 H38" className="ink-2" />
          <rect x="20" y="44" width="24" height="14" rx="3" className="ink f-paper" />
          <rect x="20" y="44" width="24" height="14" rx="3" className="ht-2" opacity="0.6" />
          <path d="M14 30 H8 M50 30 H56" className="ink" />
        </g>
      )}
    </svg>
  );
}
