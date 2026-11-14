import type { ReactNode } from "react";
import { hero, person } from "@/content/site";
import type { SfxName } from "@/lib/sound";
import { withBase } from "@/lib/assets";
import { EightBallArt, PhoneArt } from "@/components/ink/Art";

/*
 * The hero scene (C + B): an ink/halftone desk made of things that say who
 * Varnika is. Only the clickable objects carry colour; each one is an <a> with
 * a label that pops up on hover/focus (always shown on touch screens).
 * viewBox 800 × 640. Pure SVG + CSS, no client JS.
 */

type HotspotKey = keyof typeof hero.hotspots;

function Hotspot({
  id,
  hit,
  label,
  dot,
  sound,
  children,
}: {
  id: HotspotKey;
  /** The object's own sound: on hover with a mouse, on tap/Enter otherwise. */
  sound: SfxName;
  /** Invisible hit area / focus ring: x, y, w, h. */
  hit: [number, number, number, number];
  /** Label position (centre-bottom). */
  label: [number, number];
  /** Pulsing marker position. */
  dot: [number, number];
  children: ReactNode;
}) {
  const h = hero.hotspots[id];
  const w = Math.round(h.label.length * 7.3 + 28);
  return (
    <a href={`#${h.target}`} className="hotspot" data-sfx={sound} data-sfx-hover={sound}>
      <rect className="hs-ring" x={hit[0]} y={hit[1]} width={hit[2]} height={hit[3]} rx="14" fill="transparent" />
      <g className="obj" aria-hidden="true">
        {children}
      </g>
      <g aria-hidden="true">
        <circle cx={dot[0]} cy={dot[1]} r="5" className="f-red hs-dot" />
        <circle cx={dot[0]} cy={dot[1]} r="5" className="f-red ink-2" />
      </g>
      <g className="hs-label">
        <rect x={label[0] - w / 2} y={label[1] - 26} width={w} height="27" rx="13.5" className="f-ink" aria-hidden="true" />
        <text x={label[0]} y={label[1] - 8} textAnchor="middle" className="svg-sans" fontSize="13.5" fontWeight="650" fill="#f5f2eb">
          {h.label}
        </text>
      </g>
    </a>
  );
}

const candles: [number, number, number, number, boolean][] = [
  // x, wickTop, bodyTop, bodyBottom, up?
  [22, 56, 62, 80, false],
  [38, 48, 54, 72, true],
  [54, 40, 44, 62, true],
  [70, 46, 50, 66, false],
  [86, 30, 34, 52, true],
  [102, 20, 26, 42, true],
];

export function DeskScene() {
  const photo = withBase(person.photo.src);
  return (
    <svg
      viewBox="0 0 800 640"
      className="h-auto w-full overflow-visible"
      role="group"
      aria-label="An ink drawing of Varnika’s desk. The coloured objects are links to sections of the page."
    >
      {/* ── wall: photo strip (A), shelf with books ───────────────────── */}
      <g transform="rotate(4 264 110)">
        <rect x="238" y="36" width="54" height="150" className="ink-2 f-paper" />
        {[44, 90, 136].map((y) => (
          <g key={y}>
            <rect x="245" y={y} width="40" height="40" className="ht-1" />
            <rect x="245" y={y} width="40" height="40" className="ink-2 f-none" />
            <circle cx="265" cy={y + 17} r="7" className="ink-2 f-paper" />
            <path d={`M252 ${y + 40} C254 ${y + 28} 276 ${y + 28} 278 ${y + 40}`} className="ink-2 f-paper" />
          </g>
        ))}
        <circle cx="265" cy="30" r="4" className="ink-2 f-ink" />
      </g>

      <rect x="470" y="150" width="300" height="12" className="ink f-paper" />
      <rect x="476" y="163" width="288" height="7" className="ht-2" />
      <path d="M500 162 V194 L524 162 M740 162 V194 L716 162" className="ink-2 f-none" />
      <rect x="664" y="84" width="20" height="66" className="ink-2 f-paper" />
      <path d="M664 96 H684 M664 138 H684" className="ink-2" />
      <rect x="686" y="96" width="18" height="54" className="ht-2" />
      <rect x="686" y="96" width="18" height="54" className="ink-2 f-none" />
      <rect x="706" y="76" width="22" height="74" className="ink-2 f-paper" />
      <path d="M706 90 H728 M711 104 H723" className="ink-2" />
      <g transform="rotate(16 738 150)">
        <rect x="730" y="98" width="16" height="52" className="ht-1" />
        <rect x="730" y="98" width="16" height="52" className="ink-2 f-none" />
      </g>

      {/* ── desk lamp + light (ink only) ──────────────────────────────── */}
      <polygon points="156,290 204,262 302,404 140,404" className="ht-1" opacity="0.45" />
      <path d="M42 404 C46 390 98 390 102 404 Z" className="ink f-paper" />
      <path d="M50 402 C56 394 88 394 96 402 Z" className="ht-2" />
      <polyline points="72,394 56,300 128,244" className="ink-4 f-none" />
      <circle cx="56" cy="300" r="6" className="ink-2 f-paper" />
      <polygon points="118,232 134,220 204,254 150,292" className="ht-3" />
      <polygon points="118,232 134,220 204,254 150,292" className="ink f-none" />
      <ellipse cx="177" cy="273" rx="33" ry="9" transform="rotate(-35 177 273)" className="ink f-paper" />
      <circle cx="128" cy="236" r="5" className="ink-2 f-paper" />

      {/* ── desk ──────────────────────────────────────────────────────── */}
      <path d="M0 636 H800" className="ink-2" opacity="0.4" />
      <rect x="26" y="472" width="22" height="164" className="ink f-paper" />
      <rect x="38" y="474" width="9" height="160" className="ht-2" />
      <rect x="752" y="472" width="22" height="164" className="ink f-paper" />
      <rect x="764" y="474" width="9" height="160" className="ht-2" />
      <rect x="0" y="446" width="800" height="26" className="f-paper" />
      <rect x="0" y="446" width="800" height="26" className="ht-1" />
      <rect x="0" y="446" width="800" height="26" className="ink f-none" />
      <polygon points="30,404 770,404 800,446 0,446" className="ink f-paper" />
      <path d="M120 424 H196 M420 434 H520 M600 416 H648" className="ink-2" opacity="0.35" />

      {/* ── sticky note: candlestick chart (PSU Quants) ───────────────── */}
      <Hotspot id="candles" sound="coin" hit={[58, 52, 156, 146]} label={[136, 222]} dot={[196, 70]}>
        <g transform="translate(70 64) rotate(-5)">
          <rect x="0" y="0" width="128" height="118" className="ink-2 f-yellow" />
          <rect x="40" y="-9" width="48" height="18" fill="#f5f2eb" opacity="0.8" transform="rotate(3 64 0)" />
          <path d="M12 92 H116" className="ink-2" opacity="0.5" />
          {candles.map(([x, wt, bt, bb, up]) => (
            <g key={x}>
              <path d={`M${x} ${wt} V${bb + 8}`} className="ink-2" />
              <rect x={x - 4.5} y={bt} width="9" height={bb - bt} className={`ink-2 ${up ? "f-red" : "f-ink"}`} />
            </g>
          ))}
          <text x="64" y="112" textAnchor="middle" className="svg-hand" fontSize="19" fill="#141414">
            PSU Quants
          </text>
        </g>
      </Hotspot>

      {/* ── trophy + prize ribbon on the shelf ────────────────────────── */}
      <Hotspot id="trophy" sound="trophy" hit={[512, 66, 128, 140]} label={[572, 62]} dot={[594, 86]}>
        <path d="M532 90 C514 90 514 112 536 114 M588 90 C606 90 606 112 584 114" className="ink f-none" />
        <path d="M532 82 H588 V96 C588 116 576 126 560 126 C544 126 532 116 532 96 Z" className="ink f-yellow" />
        <path d="M578 86 V100 C578 112 572 118 566 121" className="ht-2" />
        <text x="555" y="110" textAnchor="middle" fontSize="18" fill="#141414">
          ✦
        </text>
        <path d="M554 126 H566 L568 136 H552 Z" className="ink-2 f-paper" />
        <rect x="540" y="136" width="40" height="14" rx="2" className="ink-2 f-paper" />
        <rect x="562" y="138" width="16" height="10" className="ht-2" />
        <path d="M618 162 V174" className="ink-2" />
        <path d="M612 182 L606 206 L613 201 L617 208 L620 184 Z M624 182 L630 206 L623 201 L619 208 L616 184 Z" className="ink-2 f-red" />
        <circle cx="618" cy="182" r="11" className="ink-2 f-red" />
        <circle cx="618" cy="182" r="5" className="ink-2 f-yellow" />
      </Hotspot>

      {/* ── math notebooks ────────────────────────────────────────────── */}
      <Hotspot id="notebooks" sound="pages" hit={[104, 240, 144, 166]} label={[168, 236]} dot={[198, 256]}>
        <g transform="rotate(-6 157 344)">
          <rect x="120" y="250" width="74" height="94" rx="4" className="ink f-red" />
          <path d="M129 254 V340" className="ink-2" />
          <rect x="134" y="264" width="52" height="22" rx="2" className="ink-2 f-paper" />
          <text x="160" y="279" textAnchor="middle" className="svg-pixel" fontSize="10" fill="#141414">
            MATH 230
          </text>
          <text x="161" y="320" textAnchor="middle" className="svg-serif" fontSize="22" fill="#f5f2eb">
            ∫ f dx
          </text>
        </g>
        <rect x="112" y="382" width="130" height="22" rx="3" className="ink f-paper" />
        <path d="M118 389 H236 M118 395 H236" className="ink-2" opacity="0.55" />
        <rect x="120" y="362" width="118" height="20" rx="3" className="f-paper" />
        <rect x="120" y="362" width="118" height="20" rx="3" className="ht-1" />
        <rect x="120" y="362" width="118" height="20" rx="3" className="ink f-none" />
        <rect x="108" y="342" width="126" height="20" rx="3" className="ink f-red" transform="rotate(-2 171 352)" />
      </Hotspot>

      {/* ── laptop running mysh ───────────────────────────────────────── */}
      <Hotspot id="laptop" sound="keys" hit={[190, 226, 276, 182]} label={[328, 220]} dot={[420, 248]}>
        <rect x="230" y="240" width="196" height="140" rx="9" className="ink f-paper" />
        <rect x="241" y="251" width="174" height="118" rx="4" className="ink-2 f-yellow" />
        <circle cx="328" cy="245.5" r="2" className="f-ink" />
        <g className="svg-pixel" fill="#141414">
          <text x="252" y="275" fontSize="17">
            $ ./mysh
          </text>
          <text x="252" y="297" fontSize="11">
            mysh&gt; ls ~/shipped
          </text>
          <text x="252" y="313" fontSize="11">
            terrametric rollpay
          </text>
          <text x="252" y="329" fontSize="11">
            nod blue-grid echo
          </text>
          <text x="252" y="354" fontSize="12">
            mysh&gt;
          </text>
        </g>
        <rect x="294" y="344" width="8" height="12" className="f-ink screen-caret" />
        <path d="M214 380 H442 L462 404 H194 Z" className="ink f-paper" />
        <polygon points="230,385 426,385 437,397 219,397" className="ht-2" />
        <path d="M310 401 H346" className="ink-2" />
      </Hotspot>

      {/* ── pencil mug (ink only) ─────────────────────────────────────── */}
      <path d="M456 352 L448 318 L453 315 L462 351" className="ink-2 f-paper" />
      <path d="M448 318 L449 306 L453 315 Z" className="ink-2 f-ink" />
      <path d="M468 352 L474 316 L480 318 L474 352" className="ink-2 f-paper" />
      <path d="M474 316 L478 305 L480 318 Z" className="ink-2 f-ink" />
      <path d="M480 362 C494 362 494 388 478 388" className="ink f-none" />
      <path d="M448 352 H480 L477 402 Q464 406 451 402 Z" className="ink f-paper" />
      <path d="M468 354 H480 L477 402 Q472 404 468 404 Z" className="ht-2" />
      <text x="460" y="386" textAnchor="middle" fontSize="14" fill="#141414">
        ✦
      </text>

      {/* ── red rotary phone ──────────────────────────────────────────── */}
      <Hotspot id="phone" sound="ring" hit={[478, 290, 152, 120]} label={[556, 290]} dot={[612, 316]}>
        <g transform="translate(492 314) scale(0.9)">
          <PhoneArt shakeClass="phone-shake" />
        </g>
      </Hotspot>

      {/* ── 8-ball + chalk at the front edge ─────────────────────────── */}
      <Hotspot id="eightball" sound="clack" hit={[270, 400, 90, 56]} label={[306, 494]} dot={[318, 412]}>
        <ellipse cx="300" cy="444" rx="16" ry="3" className="ht-2" />
        <g transform="translate(300 427)">
          <EightBallArt />
        </g>
        <rect x="330" y="428" width="15" height="14" rx="1.5" className="ink-2 f-paper" />
        <rect x="333" y="428" width="9" height="5" className="ht-2" />
      </Hotspot>

      {/* ── Varnika's photo as a taped polaroid propped on the desk ─── */}
      <ellipse cx="708" cy="410" rx="74" ry="6" className="ht-2" opacity="0.7" />
      <Hotspot id="photo" sound="shutter" hit={[618, 206, 176, 212]} label={[708, 202]} dot={[778, 230]}>
        <g transform="rotate(4 708 408)">
          <defs>
            <clipPath id="polaroid-clip">
              <rect x="643" y="234" width="130" height="146" />
            </clipPath>
          </defs>
          <rect x="633" y="224" width="150" height="186" rx="3" className="ink f-paper" />
          <image
            href={photo}
            x="643"
            y="234"
            width="130"
            height="146"
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#polaroid-clip)"
          >
            <title>{person.photo.alt}</title>
          </image>
          <rect x="643" y="234" width="130" height="146" className="ink-2 f-none" />
          <text x="708" y="400" textAnchor="middle" className="svg-serif" fontSize="15" fill="#141414">
            that’s me ✦
          </text>
          <rect x="678" y="214" width="60" height="20" className="f-yellow" opacity="0.92" transform="rotate(-6 708 224)" />
        </g>
      </Hotspot>
    </svg>
  );
}
