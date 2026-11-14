"use client";

import { useRef } from "react";
import { journey } from "@/content/site";
import type { PlaceId } from "@/content/types";
import { BIG_MOTION, gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { PLACE_XY, US_NATION, US_STATES, US_VIEWBOX } from "./usMap";

const VB_W = 975;
const VB_H = 610;

/* Berkeley and San Francisco are 4 map units apart; nudge Berkeley up-right so both pins read. */
const NUDGE: Partial<Record<PlaceId, [number, number]>> = { berkeley: [9, -12] };
const xy = (p: PlaceId): [number, number] => {
  const [x, y] = PLACE_XY[p];
  const [dx, dy] = NUDGE[p] ?? [0, 0];
  return [x + dx, y + dy];
};

const CITY_LABEL: Record<PlaceId, { text: string; pos: "top" | "left" | "right" | "below" }> = {
  "state-college": { text: "State College", pos: "top" },
  pittsburgh: { text: "Pittsburgh", pos: "left" },
  "college-park": { text: "College Park", pos: "below" },
  berkeley: { text: "Berkeley", pos: "right" },
  atlanta: { text: "Atlanta", pos: "right" },
  inglewood: { text: "Los Angeles", pos: "right" },
  "san-francisco": { text: "San Francisco", pos: "below" },
};

const stops = journey.stops;
const places = Array.from(new Set(stops.map((s) => s.place)));

/** Gently arched route segments between consecutive, different stops. */
const segments = stops.map((s, i) => {
  if (i === 0) return null;
  const a = xy(stops[i - 1].place);
  const b = xy(s.place);
  if (a[0] === b[0] && a[1] === b[1]) return null;
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const bend = (i % 2 ? 1 : -1) * 0.2;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  return `M${a[0]} ${a[1]} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b[0]} ${b[1]}`;
});

const pad = (n: number) => String(n).padStart(2, "0");

export function Journey({ thumbs }: { thumbs: Record<string, string> }) {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(BIG_MOTION, () => {
      const stage = el.querySelector<HTMLElement>("[data-stage]")!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
      const segEls = segments.map((_, i) => el.querySelector<SVGPathElement>(`[data-seg="${i}"]`));
      const head = el.querySelector<SVGCircleElement>("[data-head]")!;
      const pinEls = Object.fromEntries(places.map((p) => [p, el.querySelector<SVGGElement>(`[data-pin="${p}"]`)!]));
      const pings = Object.fromEntries(places.map((p) => [p, el.querySelector<SVGCircleElement>(`[data-ping="${p}"]`)!]));
      const lens = segEls.map((s) => (s ? s.getTotalLength() : 0));

      segEls.forEach((s, i) => s && gsap.set(s, { strokeDasharray: lens[i], strokeDashoffset: lens[i] }));
      gsap.set(cards.slice(1), { autoAlpha: 0, y: 50 });
      gsap.set(Object.values(pinEls), { opacity: 0.35 });
      gsap.set(pinEls[stops[0].place], { opacity: 1 });
      const [hx, hy] = xy(stops[0].place);
      gsap.set(head, { attr: { cx: hx, cy: hy } });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${(stops.length - 1) * window.innerHeight * 0.7}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < stops.length; i++) {
        const t0 = i - 1;
        const seg = segEls[i];
        if (seg) {
          const proxy = { t: 0 };
          const len = lens[i];
          tl.to(
            proxy,
            {
              t: 1,
              duration: 0.6,
              onUpdate: () => {
                seg.style.strokeDashoffset = String(len * (1 - proxy.t));
                const pt = seg.getPointAtLength(len * proxy.t);
                head.setAttribute("cx", String(pt.x));
                head.setAttribute("cy", String(pt.y));
              },
            },
            t0,
          );
        }
        const place = stops[i].place;
        tl.to(pinEls[place], { opacity: 1, duration: 0.05 }, t0 + 0.6);
        tl.fromTo(
          pings[place],
          { attr: { r: 6 }, opacity: 0.9 },
          { attr: { r: 30 }, opacity: 0, duration: 0.35, ease: "power2.out" },
          t0 + 0.6,
        );
        tl.to(cards[i - 1], { autoAlpha: 0, y: -40, duration: 0.25, ease: "power2.in" }, t0 + 0.3);
        tl.to(cards[i], { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, t0 + 0.6);
      }
      tl.to({}, { duration: 0.4 }); // hold on the last stop
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="journey" aria-labelledby="journey-h" className="relative">
      <div data-stage className="relative motion-lg:h-svh motion-lg:overflow-hidden">
        <div className="wrap flex h-full flex-col pt-24 pb-10 motion-lg:pt-[92px] motion-lg:pb-6">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
            <div>
              <p className="kicker">{journey.kicker}</p>
              <h2 id="journey-h" className="t-h2 mt-2">
                {journey.heading}
              </h2>
            </div>
            <p className="hidden font-serif text-lg text-muted italic motion-lg:block">{journey.hint} ↓</p>
          </div>

          <div className="jr-area relative mt-6 flex-1 motion-lg:min-h-0">
            {/* map */}
            <div className="jr-map relative mx-auto aspect-[975/610] w-full max-w-[1100px]">
              <svg viewBox={US_VIEWBOX} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                <path d={US_NATION} className="ht-1" opacity="0.2" />
                <path d={US_STATES} fill="none" stroke="#141414" strokeOpacity="0.16" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d={US_NATION} fill="none" stroke="#141414" strokeOpacity="0.4" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                {/* the whole route, faint and dotted */}
                {segments.map((d, i) => d && <path key={`f${i}`} d={d} fill="none" stroke="#2f5bd3" strokeOpacity="0.3" className="jr-route-faint" />)}
                {/* the route that draws as you scroll */}
                {segments.map(
                  (d, i) =>
                    d && (
                      <path key={`s${i}`} data-seg={i} d={d} fill="none" stroke="#2f5bd3" strokeLinecap="round" className="jr-route" />
                    ),
                )}
                {places.map((p) => {
                  const [x, y] = xy(p);
                  return (
                    <g key={p}>
                      <circle data-ping={p} cx={x} cy={y} r="6" fill="none" stroke="#e3262f" strokeWidth="2" opacity="0" />
                      <g data-pin={p}>
                        <circle cx={x} cy={y} className="jr-pin-dot" fill="#e3262f" stroke="#141414" />
                      </g>
                    </g>
                  );
                })}
                <circle data-head cx={xy(stops[0].place)[0]} cy={xy(stops[0].place)[1]} className="jr-head" fill="#2f5bd3" stroke="#f5f2eb" />
              </svg>

              {/* pin labels as HTML so they stay readable at any size */}
              {places.map((p) => {
                const [x, y] = xy(p);
                const lab = CITY_LABEL[p];
                const nums = stops.flatMap((s, i) => (s.place === p ? [pad(i)] : [])).join(" · ");
                const pos = {
                  top: "-translate-x-1/2 -translate-y-[160%]",
                  left: "-translate-x-[calc(100%+12px)] -translate-y-1/2",
                  right: "translate-x-[12px] -translate-y-1/2",
                  below: "-translate-x-[20%] translate-y-[55%]",
                }[lab.pos];
                return (
                  <span
                    key={p}
                    aria-hidden="true"
                    className={`absolute text-[0.78rem] leading-none font-semibold whitespace-nowrap text-ink ${pos}`}
                    style={{ left: `${(x / VB_W) * 100}%`, top: `${(y / VB_H) * 100}%` }}
                  >
                    <span className="hidden motion-lg:inline">{lab.text}</span>
                    <span className="t-pixel rounded-sm bg-paper/85 px-1 text-[0.7rem] motion-lg:hidden">{nums}</span>
                  </span>
                );
              })}
            </div>

            {/* cards */}
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 motion-lg:mt-0 motion-lg:block">
              {stops.map((s, i) => {
                const east = xy(s.place)[0] > VB_W / 2;
                const thumb = s.projectSlug ? thumbs[s.projectSlug] : undefined;
                return (
                  <li
                    key={s.id}
                    className={`motion-lg:pointer-events-none motion-lg:absolute motion-lg:inset-y-0 motion-lg:flex motion-lg:w-[min(23rem,31%)] motion-lg:items-center ${
                      east ? "motion-lg:left-0" : "motion-lg:right-0"
                    }`}
                  >
                    <article data-card className="jr-card w-full p-5" aria-label={`${pad(i)}: ${s.event}`}>
                      <p className="t-pixel flex flex-wrap justify-between gap-2 text-[0.85rem] text-muted">
                        <span>{pad(i)} / {pad(stops.length - 1)}</span>
                        <span>{s.dates}</span>
                      </p>
                      <h3 className="mt-2 text-xl leading-tight font-extrabold tracking-[-0.02em]">{s.event}</h3>
                      <p className="mt-1 text-sm text-muted">⌖ {s.city}</p>
                      {s.project && (
                        <div className="mt-3 flex items-center gap-3">
                          {thumb && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={thumb}
                              alt=""
                              width={96}
                              height={60}
                              loading="lazy"
                              decoding="async"
                              className="h-[60px] w-[96px] shrink-0 rounded-md border-2 border-ink object-cover object-top"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-serif text-2xl leading-none italic">{s.project}</p>
                            {s.prize && (
                              <p className="tape mt-2 text-[0.78rem] whitespace-normal" style={{ ["--r" as string]: "-1.5deg" }}>
                                ★ {s.prize}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      <p className="mt-3 text-[0.95rem] leading-snug">{s.story}</p>
                      <p className="mt-3 flex items-baseline gap-3 border-t-2 border-dashed border-ink/25 pt-3">
                        <span className="text-[2.6rem] leading-none font-extrabold tracking-[-0.04em]">{s.stat.value}</span>
                        <span className="text-sm leading-tight text-muted">{s.stat.caption}</span>
                      </p>
                      <p className="mt-2 text-[0.72rem] text-muted">source: {s.source}</p>
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
