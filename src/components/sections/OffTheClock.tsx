"use client";

import { useRef } from "react";
import { offTheClock } from "@/content/site";
import type { SpillItem } from "@/content/types";
import { BIG_MOTION, gsap, SMALL_MOTION, useIsoLayoutEffect } from "@/lib/gsap";
import { sfx, type SfxName } from "@/lib/sound";
import { EightBallArt } from "@/components/ink/Art";

/* Where each object lands (SVG units; the head's opening is at 150, 110). */
const DESK_VB = "-350 -260 1000 620";
const MOBILE_VB = "-130 -220 560 560";
const LAND: [number, number, number][] = [
  [-120, 40, -10],
  [-55, -160, -8],
  [-235, -55, 6],
  [85, -215, 4],
  [300, -175, 8],
  [430, -30, 12],
  [-245, 175, -6],
  [245, -45, -6],
  [455, 125, -4],
  [-205, -195, 0],
  [440, 255, 8],
];
const mobileLand = LAND.map(([x, y, r]) => [150 + (x - 150) * 0.52, 110 + (y - 110) * 0.72, r] as const);
const ORIGIN = { x: 150, y: 112 };

/** What each object says when you poke it. */
const VOICE: Record<SpillItem["kind"], { sound: SfxName; label: (i: SpillItem) => string }> = {
  eightball: { sound: "clack", label: () => "8-ball: billiards" },
  bubble: { sound: "blips", label: (i) => (i.kind === "bubble" ? `Hello in ${i.label}` : "Hello") },
  cat: { sound: "meow", label: () => "A cat" },
  candles: { sound: "coin", label: () => "A candlestick chart: trading" },
  book: { sound: "pages", label: () => "A number theory book" },
  horse: { sound: "neigh", label: () => "A horse" },
  laptop: { sound: "keys", label: () => "A laptop: coding" },
  network: { sound: "beeps", label: () => "A neural network: machine learning" },
  meme: { sound: "boing", label: () => "A meme" },
};

/** One object out of the head: hoverable, clickable and keyboard reachable, with its own sound. */
function Poke({ item }: { item: SpillItem }) {
  const v = VOICE[item.kind];
  const hit = (el: Element) => {
    el.classList.remove("is-hit");
    void (el as HTMLElement).getBoundingClientRect?.();
    el.classList.add("is-hit");
    window.setTimeout(() => el.classList.remove("is-hit"), 460);
  };
  return (
    <g
      className="spill"
      role="button"
      tabIndex={0}
      aria-label={v.label(item)}
      data-sfx={v.sound}
      data-sfx-hover={v.sound}
      onClick={(e) => hit(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        sfx[v.sound]();
        hit(e.currentTarget);
      }}
    >
      <circle className="spill-ring" r="66" fill="transparent" />
      <g className="spill-art">
        <Item item={item} />
      </g>
    </g>
  );
}

function Item({ item }: { item: SpillItem }) {
  switch (item.kind) {
    case "eightball":
      return (
        <g transform="scale(2.5)">
          <EightBallArt />
        </g>
      );
    case "bubble": {
      const w = item.lang === "pa" ? 200 : 132;
      return (
        <g>
          <path
            d={`M${-w / 2} -32 H${w / 2} Q${w / 2 + 12} -32 ${w / 2 + 12} -20 V18 Q${w / 2 + 12} 30 ${w / 2} 30 H-6 L-26 50 L-22 30 H${-w / 2} Q${-w / 2 - 12} 30 ${-w / 2 - 12} 18 V-20 Q${-w / 2 - 12} -32 ${-w / 2} -32 Z`}
            className="ink f-paper"
          />
          <text x="6" y="9" textAnchor="middle" fontSize="27" fontWeight="600" fill="#141414" lang={item.lang}>
            {item.text}
          </text>
        </g>
      );
    }
    case "book":
      return (
        <g transform="rotate(-8)">
          <rect x="-44" y="-56" width="88" height="112" rx="4" className="ink f-paper" />
          <rect x="-44" y="-56" width="16" height="112" className="ht-2" />
          <path d="M-28 -56 V56" className="ink-2" />
          <rect x="-20" y="-30" width="56" height="34" className="ink-2 f-paper" />
          <text x="8" y="-16" textAnchor="middle" className="svg-serif" fontSize="12" fill="#141414">
            number
          </text>
          <text x="8" y="-2" textAnchor="middle" className="svg-serif" fontSize="12" fill="#141414">
            theory
          </text>
          <text x="8" y="36" textAnchor="middle" className="svg-serif" fontSize="22" fill="#141414">
            p | n
          </text>
        </g>
      );
    case "candles":
      return (
        <g>
          <rect x="-56" y="-44" width="112" height="88" rx="6" className="ink f-paper" />
          <path d="M-44 30 H44" className="ink-2" opacity="0.5" />
          {[
            [-34, -4, 0, 20, 0],
            [-17, -14, -10, 8, 1],
            [0, -8, -4, 14, 0],
            [17, -26, -22, -2, 1],
            [34, -34, -30, -12, 1],
          ].map(([x, wt, bt, bb, up]) => (
            <g key={x}>
              <path d={`M${x} ${wt} V${bb + 8}`} className="ink-2" />
              <rect x={x - 5} y={bt} width="10" height={bb - bt} className={`ink-2 ${up ? "f-paper" : "f-ink"}`} />
            </g>
          ))}
        </g>
      );
    case "laptop":
      return (
        <g>
          <rect x="-50" y="-40" width="100" height="66" rx="6" className="ink f-paper" />
          <rect x="-42" y="-32" width="84" height="50" rx="2" className="ht-1" />
          <text x="0" y="0" textAnchor="middle" className="svg-pixel" fontSize="22" fill="#141414">
            &lt;/&gt;
          </text>
          <path d="M-62 26 H62 L54 38 H-54 Z" className="ink f-paper" />
        </g>
      );
    case "cat":
      return (
        <g>
          <path d="M-38 -20 L-34 -52 L-12 -32 Q0 -36 12 -32 L34 -52 L38 -20 Q46 4 34 24 Q18 40 0 40 Q-18 40 -34 24 Q-46 4 -38 -20 Z" className="ink f-paper" />
          <path d="M-32 -26 L-31 -42 L-20 -31 Z M32 -26 L31 -42 L20 -31 Z" className="ht-2" />
          <ellipse cx="-14" cy="-4" rx="5" ry="7" className="f-ink" />
          <ellipse cx="14" cy="-4" rx="5" ry="7" className="f-ink" />
          <path d="M-5 10 L0 14 L5 10 M0 14 Q-6 22 -12 18 M0 14 Q6 22 12 18" className="ink-2 f-none" />
          <path d="M-20 12 L-48 6 M-20 17 L-46 20 M20 12 L48 6 M20 17 L46 20" className="ink-2" />
        </g>
      );
    case "horse":
      return (
        <g>
          <path
            d="M-34 48 C-38 14 -30 -18 -6 -38 L-2 -56 L10 -40 C30 -36 46 -18 50 6 C52 20 44 28 32 26 L14 20 C10 30 8 40 6 48 Z"
            className="ink f-paper"
          />
          <path d="M-6 -38 C-22 -20 -30 4 -32 40 L-22 40 C-20 10 -14 -14 2 -34 Z" className="ht-3" />
          <circle cx="16" cy="-14" r="3.6" className="f-ink" />
          <circle cx="40" cy="14" r="2.6" className="f-ink" />
        </g>
      );
    case "network": {
      const L = [
        [-44, [-30, 0, 30]],
        [0, [-40, -13, 13, 40]],
        [44, [-18, 18]],
      ] as const;
      return (
        <g>
          {L.slice(0, -1).flatMap(([x, ys], li) =>
            ys.flatMap((y) => L[li + 1][1].map((y2) => <path key={`${x}${y}${y2}`} d={`M${x} ${y} L${L[li + 1][0]} ${y2}`} className="ink-2" opacity="0.45" />)),
          )}
          {L.flatMap(([x, ys]) => ys.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="8" className="ink-2 f-paper" />))}
        </g>
      );
    }
    case "meme":
      return (
        <g transform="rotate(4)">
          <rect x="-50" y="-50" width="100" height="100" className="ink f-paper" />
          <rect x="-42" y="-42" width="84" height="84" className="ht-1" />
          <circle cx="0" cy="2" r="22" className="ink f-paper" />
          <path d="M-10 -4 Q-7 -9 -4 -4 M4 -4 Q7 -9 10 -4 M-10 8 Q0 18 10 8" className="ink-2 f-none" />
          <text x="0" y="-30" textAnchor="middle" className="svg-sans" fontSize="15" fontWeight="900" fill="#f5f2eb" stroke="#141414" strokeWidth="3" paintOrder="stroke">
            LOL
          </text>
        </g>
      );
  }
}

/** The ink head: the lid (hair + top of skull) is a separate group so it can pop open. */
function Head() {
  return (
    <g>
      <path d="M110 300 L112 266 H188 L190 300 C230 306 262 320 276 340 H24 C38 320 70 306 110 300 Z" className="ink f-paper" />
      <path d="M122 300 Q150 318 178 300" className="ink-2 f-none" />
      <path d="M226 150 C258 196 254 262 232 300 C226 262 228 206 212 166 Z" className="ink f-ink" />
      <path d="M80 168 C62 160 60 192 82 198 M220 168 C238 160 240 192 218 198" className="ink f-paper" />
      <ellipse cx="150" cy="116" rx="70" ry="13" className="ink ht-3" />
      <path
        d="M78 118 L92 108 L106 120 L120 108 L134 120 L148 108 L162 120 L176 108 L190 120 L204 108 L222 118 C226 200 196 270 150 272 C104 270 74 200 78 118 Z"
        className="ink f-paper"
      />
      <path d="M80 122 C70 170 70 222 80 262 C86 236 88 190 94 142 Z" className="f-ink" />
      <path d="M220 122 C230 170 230 222 220 262 C214 236 212 190 206 142 Z" className="f-ink" />
      <circle cx="106" cy="214" r="12" className="ht-1" />
      <circle cx="196" cy="214" r="12" className="ht-1" />
      <path d="M104 150 Q118 144 132 150 M168 150 Q182 144 196 150" className="ink" />
      <path d="M100 168 Q104 160 114 160 H128 Q138 162 140 172 L138 188 Q134 198 122 198 H112 Q100 196 98 186 Z" className="ink f-none" />
      <path d="M160 172 Q162 162 172 160 H186 Q196 160 200 168 L202 186 Q200 196 188 198 H178 Q166 198 162 188 Z" className="ink f-none" />
      <path d="M140 174 Q150 168 160 174 M98 172 L82 166 M202 172 L218 166" className="ink-2 f-none" />
      <circle cx="120" cy="180" r="4.5" className="f-ink" />
      <circle cx="181" cy="180" r="4.5" className="f-ink" />
      <path d="M150 186 Q145 204 153 210 M130 230 Q151 245 172 228" className="ink f-none" />
      <g data-lid>
        <path
          d="M78 118 L92 108 L106 120 L120 108 L134 120 L148 108 L162 120 L176 108 L190 120 L204 108 L222 118 C226 66 194 26 150 26 C106 26 74 66 78 118 Z"
          className="ink f-ink"
        />
        <path d="M150 28 C144 52 136 76 122 100" stroke="#f5f2eb" strokeWidth="2.5" fill="none" opacity="0.7" />
        <path d="M110 52 C126 40 168 38 190 54" stroke="#f5f2eb" strokeWidth="3" fill="none" opacity="0.35" strokeLinecap="round" />
        <path d="M168 32 C178 12 206 14 202 34" className="ink f-ink" />
      </g>
    </g>
  );
}

/**
 * Off the clock (D): giant outlined "20" and "28" either side of an ink head
 * that pops open and spills out the things she's into.
 */
export function OffTheClock() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const svg = el.querySelector<SVGSVGElement>("[data-head-svg]")!;
    const lid = el.querySelector("[data-lid]")!;
    const items = gsap.utils.toArray<SVGGElement>("[data-spill]", el);
    const mm = gsap.matchMedia();

    const build = (land: readonly (readonly [number, number, number])[]) => {
      const tl = gsap.timeline({ paused: true });
      tl.to(lid, { rotation: -52, svgOrigin: "78 118", duration: 0.35, ease: "back.out(2)" });
      items.forEach((it, i) => {
        const [x, y, r] = land[i];
        tl.fromTo(
          it,
          { x: ORIGIN.x, y: ORIGIN.y, scale: 0.15, rotation: 0, opacity: 0, transformOrigin: "50% 50%" },
          { x, y, scale: 1, rotation: r, opacity: 1, duration: 0.6, ease: "back.out(1.4)", transformOrigin: "50% 50%" },
          0.18 + i * 0.06,
        );
      });
      return tl;
    };

    mm.add(BIG_MOTION, () => {
      svg.setAttribute("viewBox", DESK_VB);
      const tl = build(LAND);
      gsap.to(tl, {
        progress: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el.querySelector("[data-otc-stage]"),
          start: "top top",
          end: "+=110%",
          pin: true,
          scrub: 0.6,
        },
      });
    });
    mm.add(SMALL_MOTION, () => {
      svg.setAttribute("viewBox", MOBILE_VB);
      const tl = build(mobileLand);
      gsap.to(tl, {
        progress: 1,
        duration: 1.6,
        ease: "none",
        scrollTrigger: { trigger: svg, start: "top 70%", toggleActions: "play none none reverse" },
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      svg.setAttribute("viewBox", wide ? DESK_VB : MOBILE_VB);
      build(wide ? LAND : mobileLand).progress(1);
    });
    return () => mm.revert();
  }, []);

  const [n1, n2] = offTheClock.numbers;
  const outlined = "font-splash text-transparent [-webkit-text-stroke:2px_#141414] leading-[0.8] tracking-[-0.04em] select-none";

  return (
    <section ref={root} id="off-the-clock" aria-labelledby="otc-h" className="relative">
      <div data-otc-stage className="wrap relative flex flex-col pt-24 pb-14 motion-lg:h-svh motion-lg:pt-[92px] motion-lg:pb-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="kicker">$ ls ~/head</p>
            <h2 id="otc-h" className="mt-2 font-serif text-[clamp(2.4rem,4.6vw,4rem)] leading-none italic">
              {offTheClock.heading}
            </h2>
          </div>
          <p className="max-w-[24rem] text-[1.2rem] leading-tight font-extrabold tracking-[-0.01em] text-red uppercase md:text-right">
            {offTheClock.funFact}
          </p>
        </div>

        <div className="relative my-6 flex flex-1 items-center justify-center motion-lg:my-2 motion-lg:min-h-0">
          <span aria-hidden="true" className={`${outlined} absolute top-1/2 left-0 -translate-y-1/2 text-[clamp(6rem,24vw,22rem)]`}>
            {n1}
          </span>
          <span aria-hidden="true" className={`${outlined} absolute top-1/2 right-0 -translate-y-1/2 text-[clamp(6rem,24vw,22rem)]`}>
            {n2}
          </span>
          <span className="sr-only">Class of 2028.</span>
          <svg
            data-head-svg
            viewBox={DESK_VB}
            className="relative h-auto max-h-full w-full max-w-[64rem] overflow-visible motion-lg:h-full"
            role="group"
            aria-label="An ink drawing of Varnika’s head popping open. Each thing that spills out makes a sound when you click it."
          >
            <Head />
            {offTheClock.spill.map((it, i) => (
              <g key={i} data-spill transform={`translate(${LAND[i][0]} ${LAND[i][1]}) rotate(${LAND[i][2]})`}>
                <Poke item={it} />
              </g>
            ))}
          </svg>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {offTheClock.columns.map((c) => (
              <li key={c.label}>
                <p className="t-pixel text-sm text-muted">{c.label}</p>
                <ul className="mt-2 space-y-1">
                  {c.items.map((it) => (
                    <li key={it.name} className="text-[0.95rem] leading-snug">
                      <span className="font-bold">{it.name}</span>
                      {it.note && <span className="text-muted"> · {it.note}</span>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="max-w-[20rem] text-[1.2rem] leading-tight font-extrabold text-red uppercase md:text-right">
            {offTheClock.mission}
          </p>
        </div>
      </div>
    </section>
  );
}
