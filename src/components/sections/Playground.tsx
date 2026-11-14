"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { playground } from "@/content/site";
import { filled, type Sticker } from "@/content/types";
import { TodoTag } from "@/components/ui/Todo";

const COVERS = 12;
const isDev = process.env.NODE_ENV === "development";

/** Placeholder album art in the ink style until real covers are added. */
function CoverArt({ i }: { i: number }) {
  const v = i % 6;
  const dark = i % 3 === 1;
  const fg = dark ? "#f5f2eb" : "#141414";
  return (
    <svg viewBox="0 0 100 100" className="block h-full w-full" aria-hidden="true">
      <rect width="100" height="100" fill={dark ? "#141414" : "#f5f2eb"} />
      {v === 0 && (
        <>
          <circle cx="50" cy="46" r="28" className="ht-2" />
          <path d="M8 74 H92 M16 82 H84 M26 90 H74" stroke={fg} strokeWidth="3" />
        </>
      )}
      {v === 1 &&
        [40, 30, 20, 10].map((r) => <circle key={r} cx="50" cy="50" r={r} fill="none" stroke={fg} strokeWidth="2.5" />)}
      {v === 2 &&
        Array.from({ length: 9 }, (_, k) => (
          <path key={k} d={`M${k * 14 - 30} 100 L${k * 14 + 20} 0`} stroke={fg} strokeWidth="4" />
        ))}
      {v === 3 && (
        <>
          <rect x="10" y="10" width="80" height="80" className="ht-1" />
          <path d="M50 22 C52 40 60 48 78 50 C60 52 52 60 50 78 C48 60 40 52 22 50 C40 48 48 40 50 22 Z" fill={fg} />
        </>
      )}
      {v === 4 &&
        [30, 45, 60, 75].map((y) => (
          <path key={y} d={`M0 ${y} Q25 ${y - 12} 50 ${y} T100 ${y}`} fill="none" stroke={fg} strokeWidth="3" />
        ))}
      {v === 5 && (
        <text x="50" y="68" textAnchor="middle" fontSize="54" className="svg-serif" fill={fg}>
          ♪
        </text>
      )}
      <rect width="100" height="100" fill="none" stroke="#141414" strokeWidth="4" />
    </svg>
  );
}

function StickerArt({ s }: { s: Sticker }) {
  const fill = s.tone === "red" ? "#e3262f" : s.tone === "yellow" ? "#f6e05e" : "#f5f2eb";
  const text = s.tone === "red" ? "#ffffff" : "#141414";
  const shape = {
    circle: <circle cx="70" cy="70" r="58" />,
    ticket: <path d="M14 34 H126 V58 A12 12 0 0 0 126 82 V106 H14 V82 A12 12 0 0 0 14 58 Z" />,
    hex: <polygon points="70,10 122,40 122,100 70,130 18,100 18,40" />,
    rounded: <rect x="8" y="36" width="124" height="68" rx="22" />,
    flame: <path d="M70 8 C88 34 114 46 112 82 C111 112 92 132 70 132 C48 132 28 112 28 84 C28 60 46 50 50 26 C60 40 64 44 70 8 Z" />,
    braces: <rect x="12" y="34" width="116" height="72" rx="12" />,
    burst: (
      <polygon
        points={Array.from({ length: 32 }, (_, k) => {
          const a = (k * Math.PI) / 16;
          const r = k % 2 ? 50 : 64;
          return `${(70 + Math.cos(a) * r).toFixed(1)},${(70 + Math.sin(a) * r).toFixed(1)}`;
        }).join(" ")}
      />
    ),
    bubble: <path d="M22 26 H118 Q130 26 130 38 V88 Q130 100 118 100 H64 L42 122 L46 100 H22 Q10 100 10 88 V38 Q10 26 22 26 Z" />,
  }[s.shape];
  const yStart = 70 - (s.lines.length - 1) * 9 + (s.shape === "flame" ? 12 : 0) + (s.shape === "bubble" ? -6 : 0);
  return (
    <svg viewBox="0 0 140 140" className="block h-full w-full" aria-hidden="true">
      <g stroke="#ffffff" strokeWidth="12" strokeLinejoin="round" fill="#ffffff">
        {shape}
      </g>
      <g stroke="#141414" strokeWidth="3" strokeLinejoin="round" fill={fill}>
        {shape}
      </g>
      {s.shape === "braces" && (
        <>
          <text x="27" y="84" textAnchor="middle" className="svg-serif" fontSize="46" fill="#141414">
            {"{"}
          </text>
          <text x="113" y="84" textAnchor="middle" className="svg-serif" fontSize="46" fill="#141414">
            {"}"}
          </text>
        </>
      )}
      {s.lines.map((l, k) => (
        <text
          key={k}
          x="70"
          y={yStart + k * 18 + 5}
          textAnchor="middle"
          className="svg-sans"
          fontSize={k === 0 ? 16 : 13}
          fontWeight="800"
          fill={text}
          letterSpacing="0.02em"
        >
          {l}
        </text>
      ))}
    </svg>
  );
}

const START: [number, number, number][] = [
  [4, 8, -8],
  [24, 44, 7],
  [44, 6, -4],
  [66, 40, 10],
  [84, 8, -6],
  [6, 60, 5],
  [36, 70, -10],
  [58, 72, 6],
  [82, 62, -4],
];

function StickerWall() {
  const [pos, setPos] = useState(() => playground.stickers.items.map(() => ({ x: 0, y: 0 })));
  const [order, setOrder] = useState(() => playground.stickers.items.map((_, i) => i));
  const drag = useRef<{ i: number; sx: number; sy: number; ox: number; oy: number } | null>(null);

  const front = (i: number) => setOrder((o) => [...o.filter((k) => k !== i), i]);

  const onDown = (i: number) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { i, sx: e.clientX, sy: e.clientY, ox: pos[i].x, oy: pos[i].y };
    front(i);
  };
  const onMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const x = d.ox + e.clientX - d.sx;
    const y = d.oy + e.clientY - d.sy;
    setPos((p) => p.map((v, k) => (k === d.i ? { x, y } : v)));
  };
  const onUp = () => {
    drag.current = null;
  };
  const onKey = (i: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 40 : 12;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!delta) return;
    e.preventDefault();
    front(i);
    setPos((p) => p.map((v, k) => (k === i ? { x: v.x + delta[0], y: v.y + delta[1] } : v)));
  };

  return (
    <div className="relative mx-auto h-[34rem] max-w-[68rem] touch-none overflow-hidden rounded-[2rem] border-[3px] border-ink bg-paper-2 md:h-[30rem]">
      <div aria-hidden="true" className="absolute inset-0 [background:radial-gradient(circle_at_100%_100%,rgb(20_20_20/0.07),transparent_45%)]" />
      <span aria-hidden="true" className="absolute top-1/2 left-1/2 -translate-1/2 font-serif text-[6rem] text-ink/10 italic">
        ✦
      </span>
      {playground.stickers.items.map((s, i) => {
        const [l, t, r] = START[i % START.length];
        return (
          <button
            key={s.id}
            type="button"
            onPointerDown={onDown(i)}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey(i)}
            className="absolute h-[5.75rem] w-[5.75rem] cursor-grab rounded-full transition-[filter,scale] duration-200 select-none active:scale-110 active:cursor-grabbing active:drop-shadow-[0_14px_14px_rgb(20_20_20/0.35)] md:h-[7.5rem] md:w-[7.5rem]"
            style={{
              left: `min(${l}%, calc(100% - 6.5rem))`,
              top: `min(${t}%, calc(100% - 6.5rem))`,
              translate: `${pos[i].x}px ${pos[i].y}px`,
              rotate: `${r}deg`,
              zIndex: order.indexOf(i) + 1,
            }}
          >
            <span className="sr-only">{`${s.lines.join(" ")} sticker. Drag it, or use the arrow keys to move it.`}</span>
            <StickerArt s={s} />
          </button>
        );
      })}
    </div>
  );
}

function Spotify({ url, label }: { url?: string; label: string }) {
  if (url)
    return (
      <a href={url} target="_blank" rel="noopener" className="pill pill-yellow mt-5">
        {label} <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  // No playlist yet: show the button on localhost only, so the design can be judged.
  return isDev ? (
    <span className="pill pill-yellow mt-5">
      {label} <span aria-hidden="true">↗</span>
    </span>
  ) : null;
}

/** Playground (C): the curved 3D album ring around "jam with me", and a draggable sticker wall. */
export function Playground() {
  const { jam, stickers } = playground;
  const url = filled(jam.playlistUrl);
  const covers = filled(jam.covers);

  return (
    <section id="playground" aria-labelledby="pg-h" className="py-24 md:py-32">
      <div className="wrap">
        <p className="kicker">{playground.kicker}</p>
        <h2 id="pg-h" className="sr-only">
          Playground
        </h2>
      </div>

      {/* jam with me */}
      <div className="alb-stage relative mx-auto mt-4 h-[23rem] max-w-[1440px] overflow-hidden [--R:190px] [--cw:76px] [--ty:-34px] md:h-[42rem] md:[--R:440px] md:[--cw:132px] md:[--ty:0px]">
        <div className="alb-ring" style={{ transform: "rotateX(-27deg) rotateZ(-4deg)" }}>
          <div className="alb-spin">
            {Array.from({ length: COVERS }, (_, i) => (
              <div
                key={i}
                className="alb-item overflow-hidden rounded-md"
                style={{
                  width: "var(--cw)",
                  height: "var(--cw)",
                  left: "calc(var(--cw) / -2)",
                  top: "calc(var(--cw) / -2)",
                  transform: `rotateY(${(360 / COVERS) * i}deg) translateZ(var(--R))`,
                }}
              >
                {covers?.[i] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={covers[i].src} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <CoverArt i={i} />
                )}
              </div>
            ))}
          </div>
          <div
            className="absolute top-0 left-0 grid w-[min(20rem,80vw)] place-items-center text-center md:w-[40rem]"
            style={{ transform: "translate(-50%, calc(-50% + var(--ty))) translateZ(calc(var(--R) * 0.45)) rotateZ(4deg) rotateX(27deg)" }}
          >
            <h3 className="font-serif text-[clamp(3rem,7vw,6.25rem)] leading-[0.9] italic">{jam.heading}</h3>
            <p className="mt-2 hidden text-muted md:block">{jam.body}</p>
          </div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center md:-mt-4">
        <p className="text-muted md:hidden">{jam.body}</p>
        <Spotify url={url} label={jam.spotifyLabel} />
        {!url && <TodoTag value={jam.playlistUrl} className="mt-3" />}
        {!covers && <TodoTag value={jam.covers} className="mt-2" />}
      </div>

      {/* sticker wall */}
      <div className="wrap mt-20">
        <h3 className="text-[1.75rem] font-extrabold tracking-[-0.03em]">
          {stickers.heading} <span className="text-red">✦</span>
        </h3>
        <p className="mt-1 font-serif text-lg text-muted italic">{stickers.hint}</p>
        <div className="mt-8">
          <StickerWall />
        </div>
      </div>
    </section>
  );
}
