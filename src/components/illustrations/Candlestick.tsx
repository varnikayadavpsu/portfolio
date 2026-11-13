"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import { Illustration, type IllustrationProps } from "./Illustration";

/**
 * PSU Quants: a candlestick chart that trades while it's on screen.
 * Candles (up = accent fill, down = hollow) and a moving average scroll left
 * like a live feed, and a dashed price line with a persimmon tag tracks the
 * newest close. The series is a seeded random walk that returns to its start,
 * so the loop is seamless. Shapes only; no real data.
 */
const N = 9; // candles on screen
const STEP = 32;
const X0 = 70;
const BODY = 18;
const RIGHT = X0 + (N - 1) * STEP; // x of the newest visible candle

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// [open, close, high, low] in chart y-coordinates (smaller = higher price).
const base: [number, number, number, number][] = (() => {
  const rand = mulberry32(11);
  const raw = Array.from({ length: N }, () => (rand() - 0.55) * 46);
  const mean = raw.reduce((a, b) => a + b, 0) / N;
  const deltas = raw.map((d) => d - mean); // sums to 0 → periodic
  let price = 176;
  return deltas.map((d) => {
    const open = price;
    const close = Math.max(70, Math.min(236, price + d));
    price = close;
    const high = Math.min(open, close) - 6 - rand() * 14;
    const low = Math.max(open, close) + 6 + rand() * 14;
    return [open, close, high, low];
  });
})();
// Fix the last close so the series returns exactly to the first open.
base[N - 1][1] = base[0][0];
const series = [...base, ...base, ...base.slice(0, 2)];
const closes = series.map((c) => c[1]);
const ma = closes.map((_, i) => {
  const w = closes.slice(Math.max(0, i - 2), i + 1);
  return w.reduce((a, b) => a + b, 0) / w.length + 10;
});
const maPath = ma.map((y, i) => `${i ? "L" : "M"}${X0 + i * STEP} ${y.toFixed(1)}`).join(" ");

/** Close price under x (chart coords) when the feed has scrolled by `offset`. */
function closeAt(offset: number) {
  const pos = (RIGHT - X0 + offset) / STEP;
  const i = Math.floor(pos);
  const t = pos - i;
  const a = closes[i] ?? closes[closes.length - 1];
  const b = closes[i + 1] ?? a;
  return a + (b - a) * t;
}

export function Candlestick(props: IllustrationProps) {
  const clipId = `cs-${useId().replace(/:/g, "")}`;
  const feedRef = useRef<SVGGElement>(null);
  const priceRef = useRef<SVGGElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const feed = feedRef.current;
    const price = priceRef.current;
    if (!feed || !price) return;
    const state = { offset: 0 };
    const render = () => {
      feed.setAttribute("transform", `translate(${(-state.offset).toFixed(2)} 0)`);
      price.setAttribute("transform", `translate(0 ${(closeAt(state.offset) - closes[N - 1]).toFixed(2)})`);
    };
    const tween = gsap.to(state, {
      offset: N * STEP,
      duration: N * 1.35,
      ease: "none",
      repeat: -1,
      paused: true,
      onUpdate: render,
    });
    tweenRef.current = tween;
    return () => {
      tween.kill();
      tweenRef.current = null;
      state.offset = 0;
      render();
    };
  }, []);

  const onLiveChange = (live: boolean) => {
    if (live) tweenRef.current?.play();
    else tweenRef.current?.pause();
  };

  const lastClose = closes[N - 1];

  return (
    <Illustration viewBox="0 0 360 300" onLiveChange={onLiveChange} {...props}>
      <defs>
        <clipPath id={clipId}>
          <rect x="44" y="16" width="290" height="244" />
        </clipPath>
      </defs>

      {/* axes + grid */}
      <path className="s d" d="M40 24 L40 262 L340 262" />
      {[82, 142, 202].map((y) => (
        <line key={y} className="s s-dash fade" x1="40" y1={y} x2="340" y2={y} opacity="0.6" />
      ))}

      {/* the feed */}
      <g clipPath={`url(#${clipId})`}>
        <g ref={feedRef}>
          {series.map(([open, close, high, low], i) => {
            const x = X0 + i * STEP;
            const up = close < open;
            const top = Math.min(open, close);
            const height = Math.max(2, Math.abs(open - close));
            return (
              <g key={i}>
                <line className="s" x1={x} y1={high} x2={x} y2={top} />
                <line className="s" x1={x} y1={top + height} x2={x} y2={low} />
                <rect className={up ? "f" : "bg"} x={x - BODY / 2} y={top} width={BODY} height={height} />
                <rect className="s" x={x - BODY / 2} y={top} width={BODY} height={height} />
                <line className="s" x1={x} y1="262" x2={x} y2="268" />
              </g>
            );
          })}
          <path className="s" d={maPath} opacity="0.85" />
        </g>
      </g>

      {/* live price line + tag */}
      <g ref={priceRef} className="fade">
        <line className="s s-dash" x1="44" y1={lastClose} x2="334" y2={lastClose} opacity="0.7" />
        <path className="p" d={`M334 ${lastClose} l8 -8 h18 v16 h-18 z`} />
      </g>
    </Illustration>
  );
}
