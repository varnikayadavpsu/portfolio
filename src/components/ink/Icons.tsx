import type { Leadership, Role } from "@/content/types";

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

/** Ink emblems for the leadership patches, 64 × 64. */
export function LeadIcon({ kind }: { kind: Leadership["emblem"] }) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true" focusable="false">
      {kind === "bulb" && (
        <g>
          <path d="M32 8 C20 8 14 17 14 26 C14 34 20 38 23 43 H41 C44 38 50 34 50 26 C50 17 44 8 32 8 Z" className="ink f-paper" />
          <path d="M40 14 C45 18 46 24 45 28" className="ink-2 f-none" opacity="0.6" />
          <rect x="23" y="43" width="18" height="10" rx="2" className="ink ht-2" />
          <path d="M26 57 H38 M32 26 L28 34 H36 L32 42" className="ink f-none" />
          <path d="M6 24 H10 M54 24 H58 M12 8 L15 11 M52 8 L49 11" className="ink-2" />
        </g>
      )}
      {kind === "tools" && (
        <g>
          <path d="M14 50 L40 24" className="ink-4" />
          <rect x="36" y="10" width="20" height="12" rx="2" transform="rotate(45 46 16)" className="ink f-paper" />
          <rect x="36" y="10" width="20" height="12" rx="2" transform="rotate(45 46 16)" className="ht-2" />
          <path d="M50 50 L24 24" className="ink-4" />
          <path d="M14 14 C10 18 12 26 18 26 L24 24 L26 18 C26 12 18 10 14 14 Z" className="ink f-paper" />
          <circle cx="50" cy="50" r="5" className="ink f-ink" />
        </g>
      )}
      {kind === "ball" && (
        <g>
          <circle cx="32" cy="34" r="22" className="ink f-ink" />
          <circle cx="36" cy="31" r="10" className="f-paper" />
          <text x="36" y="36" textAnchor="middle" className="svg-sans" fontSize="13" fontWeight="800" fill="#141414">
            8
          </text>
          <path d="M18 24 Q20 18 25 15" stroke="#f5f2eb" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M4 60 L26 44" className="ink-4" />
        </g>
      )}
      {kind === "book" && (
        <g>
          <path d="M6 16 C16 12 26 13 32 18 C38 13 48 12 58 16 V52 C48 48 38 49 32 54 C26 49 16 48 6 52 Z" className="ink f-paper" />
          <path d="M32 18 V54" className="ink-2" />
          <path d="M12 24 C18 22 23 22 27 24 M12 31 C18 29 23 29 27 31 M12 38 C18 36 23 36 27 38" className="ink-2 f-none" opacity="0.7" />
          <path d="M40 40 L54 26 L58 30 L44 44 L39 45 Z" className="ink f-paper" />
          <path d="M54 26 L58 30" className="ink ht-3" />
        </g>
      )}
    </svg>
  );
}

/** Graduation cap for the education ticket. */
export function CapIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true" focusable="false">
      <path d="M4 24 L32 12 L60 24 L32 36 Z" className="ink f-ink" />
      <path d="M16 30 V44 C24 50 40 50 48 44 V30 L32 37 Z" className="ink f-paper" />
      <path d="M16 30 V44 C24 50 40 50 48 44 V30 L32 37 Z" className="ht-1" />
      <path d="M56 26 V42" className="ink-2" />
      <circle cx="56" cy="45" r="3" className="ink-2 f-ink" />
    </svg>
  );
}

/** A wooden clothespin, 24 × 44, clip end at the top. */
export function Clothespin() {
  return (
    <svg viewBox="0 0 24 44" className="h-full w-full" aria-hidden="true" focusable="false">
      <rect x="4" y="2" width="7" height="40" rx="3" className="ink-2 f-paper" />
      <rect x="13" y="2" width="7" height="40" rx="3" className="ink-2 f-paper" />
      <rect x="13" y="2" width="7" height="40" rx="3" className="ht-1" />
      <circle cx="12" cy="22" r="4" className="ink-2 f-paper" />
      <path d="M8 22 H16" className="ink-2" />
    </svg>
  );
}
