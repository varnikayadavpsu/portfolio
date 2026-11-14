/**
 * Ink line art (C): thick black outlines, halftone dot shading, and spot
 * colour only on things you can click. All hand-built inline SVG.
 */

/** Red rotary phone, drawn in a 140 × 100 box with its base on y = 100. */
export function PhoneArt({ shakeClass = "" }: { shakeClass?: string }) {
  const holes = Array.from({ length: 10 }, (_, i) => {
    const a = ((-150 + i * 29) * Math.PI) / 180;
    return { x: 70 + Math.cos(a) * 14.5, y: 70 + Math.sin(a) * 14.5 };
  });
  return (
    <g className={shakeClass}>
      {/* cord */}
      <path
        d="M20 86 c-9 1 -12 7 -8 10 c5 3 4 -8 -3 -7 c-7 1 -9 9 -4 11 c5 2 3 -9 -4 -8 c-6 1 -10 8 -14 8"
        className="ink-2 f-none"
      />
      {/* body */}
      <path d="M18 100 L28 47 C30 39 38 34 48 34 L92 34 C102 34 110 39 112 47 L122 100 Z" className="ink f-red" />
      <path d="M97 37 C104 39 109 43 111 48 L121 100 L101 100 Z" className="ht-2" opacity="0.5" />
      {/* feet */}
      <path d="M26 100 v4 h14 v-4 M100 100 v4 h14 v-4" className="ink-2 f-ink" />
      {/* cradle prongs */}
      <rect x="30" y="28" width="12" height="9" rx="2" className="ink-2 f-paper" />
      <rect x="98" y="28" width="12" height="9" rx="2" className="ink-2 f-paper" />
      {/* handset */}
      <path
        d="M6 34 C2 12 28 4 70 4 C112 4 138 12 134 34 L114 38 C112 27 98 21 70 21 C42 21 28 27 26 38 Z"
        className="ink f-red"
      />
      <path d="M30 12 C48 8 92 8 110 12" className="ink-2 f-none" opacity="0.55" />
      {/* dial */}
      <circle cx="70" cy="70" r="23" className="ink f-paper" />
      {holes.map((h, i) => (
        <circle key={i} cx={h.x} cy={h.y} r="3.4" className="ink-2 f-paper" />
      ))}
      <circle cx="70" cy="70" r="6.5" className="ink-2 f-red" />
      <path d="M86 84 L92 90" className="ink-2" />
    </g>
  );
}

/** 8-ball, centred on (0, 0), radius 17. The yellow "8" disc is its spot colour. */
export function EightBallArt() {
  return (
    <g>
      <circle cx="0" cy="0" r="17" className="ink f-ink" />
      <circle cx="3" cy="-2" r="7.6" className="f-yellow" />
      <text x="3" y="2" textAnchor="middle" className="svg-sans" fontSize="10" fontWeight="800" fill="#141414">
        8
      </text>
      <path d="M-11 -8 Q-9 -12 -5 -14" stroke="#f5f2eb" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** A small ink doodle of Varnika's face (round glasses, dark hair). Used until public/face.png exists. */
export function InkFace({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30" className="f-paper" />
      <path d="M44 9 C52 3 60 9 56 18" className="ink-2 f-ink" />
      <path d="M13 40 C8 18 20 7 33 7 C48 7 57 19 52 42 C50 33 46 24 39 20 C33 25 22 27 15 31 Z" className="f-ink" />
      <path d="M15 34 C14 46 20 55 32 56 C44 55 51 46 50 34 C46 27 40 23 39 20 C33 25 22 28 15 34 Z" className="ink-2 f-paper" />
      <circle cx="20.5" cy="44" r="3" className="ht-1" />
      <circle cx="43.5" cy="44" r="3" className="ht-1" />
      <path d="M19 33 Q20 30 24 30 H28 Q31 30.5 31 34 L30.5 38 Q29 40.5 26 40.5 H22.5 Q19.5 40 19 37 Z" className="ink-2 f-none" />
      <path d="M33.5 34 Q33.5 30.5 37 30 H41 Q44.5 30 45 33 L45 37 Q44.5 40 41.5 40.5 H38 Q35 40.5 34 38 Z" className="ink-2 f-none" />
      <path d="M31 33.5 Q32.2 32 33.5 33.5" className="ink-2 f-none" />
      <circle cx="25" cy="35.4" r="1.5" className="f-ink" />
      <circle cx="39.4" cy="35.4" r="1.5" className="f-ink" />
      <path d="M27.5 47 Q32 50.5 37 46.6" className="ink-2 f-none" />
      <circle cx="32" cy="32" r="30" className="ink-2 f-none" />
    </svg>
  );
}

/** Ink moth sticker with a paper die-cut border. */
export function Moth({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 64" className={className} aria-hidden="true" focusable="false">
      <g stroke="#f5f2eb" strokeWidth="9" strokeLinejoin="round" fill="#f5f2eb">
        <path d="M40 30 C26 8 6 6 6 20 C6 32 22 34 36 34 C24 40 14 52 22 58 C30 62 38 48 40 38 C42 48 50 62 58 58 C66 52 56 40 44 34 C58 34 74 32 74 20 C74 6 54 8 40 30 Z" />
      </g>
      <path
        d="M40 30 C26 8 6 6 6 20 C6 32 22 34 36 34 C24 40 14 52 22 58 C30 62 38 48 40 38 C42 48 50 62 58 58 C66 52 56 40 44 34 C58 34 74 32 74 20 C74 6 54 8 40 30 Z"
        className="ink-2 f-paper"
      />
      <path d="M38 30 C26 14 12 14 12 21 C12 28 24 30 34 31 Z M42 30 C54 14 68 14 68 21 C68 28 56 30 46 31 Z" className="ht-2" />
      <circle cx="22" cy="22" r="3.4" className="ink-2 f-paper" />
      <circle cx="58" cy="22" r="3.4" className="ink-2 f-paper" />
      <path d="M40 26 V46" className="ink" />
      <path d="M39 26 C36 18 32 14 28 12 M41 26 C44 18 48 14 52 12" className="ink-2 f-none" />
    </svg>
  );
}

/** Four-point ink sparkle ✦ sticker. */
export function Sparkle({ className = "" }: { className?: string }) {
  const d = "M30 2 C33 20 40 27 58 30 C40 33 33 40 30 58 C27 40 20 33 2 30 C20 27 27 20 30 2 Z";
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" focusable="false">
      <path d={d} stroke="#f5f2eb" strokeWidth="8" strokeLinejoin="round" fill="#f5f2eb" />
      <path d={d} className="ink-2 f-paper" />
      <path d="M30 14 C31.5 24 36 28.5 46 30 C36 31.5 31.5 36 30 46 Z" className="ht-2" />
    </svg>
  );
}
