"use client";

import { useRef, useState } from "react";
import { toolbox } from "@/content/site";
import { gsap, prefersReducedMotion, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { sfx } from "@/lib/sound";

const tilt = (i: number) => `${((i * 37) % 7) - 3}deg`;

/** A CSS 3D gift box (B): red with a yellow ribbon; the lid flies off when opened. */
function GiftBox({ lidRef }: { lidRef: React.RefObject<HTMLDivElement | null> }) {
  const half = "calc(var(--s) / 2)";
  const L = "calc(var(--s) * 1.1)";
  const hL = "calc(var(--s) * 0.24)";
  const sides = [0, 90, 180, -90];
  return (
    <div className="gift" style={{ transform: "rotateX(-22deg) rotateY(-34deg)" }}>
      <div className="gift-face" style={{ transform: `translateZ(${half})` }} />
      <div className="gift-face" style={{ transform: `rotateY(180deg) translateZ(${half})` }} />
      <div className="gift-face" style={{ transform: `rotateY(90deg) translateZ(${half})`, filter: "brightness(0.82)" }} />
      <div className="gift-face" style={{ transform: `rotateY(-90deg) translateZ(${half})`, filter: "brightness(0.82)" }} />
      <div className="gift-face is-bottom" style={{ transform: `rotateX(-90deg) translateZ(${half})` }} />
      {/* inside of the box, seen once the lid is off */}
      <div
        className="absolute inset-0 border-[3px] border-ink"
        style={{ transform: `rotateX(90deg) translateZ(calc(var(--s) * 0.3))`, backgroundColor: "#141414" }}
      />
      <div ref={lidRef} className="absolute inset-0 [transform-style:preserve-3d]">
        <div
          className="gift-face is-top absolute"
          style={{
            width: L,
            height: L,
            left: "calc(var(--s) * -0.05)",
            top: "calc(var(--s) * -0.05)",
            transform: `rotateX(90deg) translateZ(calc(${half} + 2px))`,
          }}
        />
        {sides.map((deg) => (
          <div
            key={deg}
            className="gift-face absolute"
            style={{
              width: L,
              height: hL,
              left: "calc(var(--s) * -0.05)",
              top: `calc((var(--s) - ${hL}) / 2)`,
              transform: `rotateY(${deg}deg) translateY(calc((${hL} - var(--s)) / 2 - 2px)) translateZ(calc(${L} / 2))`,
              filter: deg === 90 || deg === -90 ? "brightness(0.82)" : undefined,
            }}
          />
        ))}
        {/* bow */}
        <svg
          viewBox="0 0 120 70"
          className="absolute left-1/2 w-[70%]"
          style={{ top: 0, transform: `translate(-50%, calc(-100% - ${half} * 0 - 6px)) translateY(calc(var(--s) * -0.02))` }}
          aria-hidden="true"
        >
          <path d="M60 52 C40 20 6 12 10 40 C12 58 40 58 60 52 Z" className="ink f-yellow" />
          <path d="M60 52 C80 20 114 12 110 40 C108 58 80 58 60 52 Z" className="ink f-yellow" />
          <path d="M60 52 L44 68 M60 52 L76 68" className="ink-4" />
          <circle cx="60" cy="52" r="9" className="ink f-yellow" />
          <path d="M30 34 C36 38 44 42 50 46 M90 34 C84 38 76 42 70 46" className="ink-2" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

const CONFETTI = Array.from({ length: 26 }, (_, i) => ({
  color: ["#f6e05e", "#e3262f", "#141414", "#f5f2eb"][i % 4],
  round: i % 3 === 0,
  w: 8 + ((i * 7) % 9),
}));

/**
 * Toolbox (B): "Everything I know, unwrapped." Scroll to it and the box bursts
 * by itself: it shakes, the lid blows off with a pop, confetti flies and the
 * skills land as tape labels. Click the box to burst it again.
 */
export function Toolbox() {
  const root = useRef<HTMLElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [burst, setBurst] = useState(false);
  const playRef = useRef<() => void>(() => {});

  useIsoLayoutEffect(() => {
    const el = root.current;
    const lid = lidRef.current;
    const box = boxRef.current;
    const grid = gridRef.current;
    if (!el || !lid || !box || !grid) return;
    const confetti = gsap.utils.toArray<HTMLElement>("[data-confetti]", el);
    const tapes = grid.querySelectorAll<HTMLElement>("[data-tape]");
    const heads = grid.querySelectorAll<HTMLElement>("[data-group-head]");

    if (prefersReducedMotion()) {
      const w = box.offsetWidth;
      gsap.set(lid, { x: w * 0.55, y: -w * 0.38, rotationZ: 24 });
      setBurst(true);
      return;
    }

    let tl: gsap.core.Timeline | null = null;
    const play = () => {
      tl?.kill();
      const w = box.offsetWidth;
      const b = box.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      gsap.set(lid, { x: 0, y: 0, rotationZ: 0, rotationX: 0 });
      gsap.set(confetti, { x: 0, y: 0, rotation: 0, opacity: 0, scale: 1 });
      tapes.forEach((t) => {
        const r = t.getBoundingClientRect();
        gsap.set(t, { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2), scale: 0.2, opacity: 0 });
      });
      gsap.set(heads, { opacity: 0, y: 16 });

      tl = gsap.timeline();
      tl.to(box, { rotation: 5, duration: 0.05, yoyo: true, repeat: 7, ease: "none" })
        .to(box, { scaleY: 0.86, scaleX: 1.08, duration: 0.12, ease: "power2.in" }, ">-0.05")
        .call(() => {
          sfx.burst();
          setBurst(true);
        })
        .to(box, { rotation: 0, scaleY: 1, scaleX: 1, duration: 0.6, ease: "elastic.out(1.2, 0.35)" })
        .to(lid, { y: -w * 1.15, x: w * 0.3, rotationZ: 70, rotationX: -40, duration: 0.35, ease: "power2.out" }, "<")
        .to(lid, { y: -w * 0.38, x: w * 0.6, rotationZ: 24, rotationX: -18, duration: 0.7, ease: "bounce.out" }, ">-0.02")
        .to(
          confetti,
          {
            x: () => gsap.utils.random(-w * 2.2, w * 2.2),
            y: () => gsap.utils.random(-w * 1.6, -w * 0.3),
            rotation: () => gsap.utils.random(-540, 540),
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.008,
          },
          "<-0.65",
        )
        .to(confetti, { y: `+=${w * 1.8}`, opacity: 0, duration: 1.1, ease: "power1.in", stagger: 0.01 }, ">-0.1")
        .to(tapes, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.3)", stagger: { each: 0.016, from: "random" } }, "<-0.9")
        .to(heads, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, "<0.3");
    };
    playRef.current = play;

    const st = ScrollTrigger.create({ trigger: box, start: "top 72%", once: true, onEnter: play });
    return () => {
      st.kill();
      tl?.kill();
    };
  }, []);

  return (
    <section ref={root} id="toolbox" aria-labelledby="tb-h" className="wrap py-24 md:py-32">
      <p className="kicker">{toolbox.kicker}</p>
      <h2 id="tb-h" className="t-h2 mt-2">
        {toolbox.headingLead}
        <span className="hl">{toolbox.headingMark}</span>.
      </h2>

      <div className="mt-20 flex flex-col items-center md:mt-24">
        <button
          type="button"
          data-sfx="none"
          onClick={() => playRef.current()}
          className="group relative grid h-[15rem] w-[15rem] cursor-pointer place-items-center rounded-3xl [--s:140px] [perspective:900px] md:h-[20rem] md:w-[20rem] md:[--s:190px]"
        >
          <span className="sr-only">Burst the gift box again</span>
          <div ref={boxRef} className="transition-[scale] duration-300 group-hover:scale-105">
            <GiftBox lidRef={lidRef} />
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                data-confetti
                className="absolute block border-2 border-ink opacity-0"
                style={{
                  width: c.w,
                  height: c.round ? c.w : c.w * 0.55,
                  background: c.color,
                  borderRadius: c.round ? "999px" : "2px",
                  marginLeft: -c.w / 2,
                  marginTop: -c.w / 2,
                }}
              />
            ))}
          </span>
        </button>
        <p className={`mt-4 font-serif text-lg text-muted italic transition-opacity duration-500 ${burst ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
          {toolbox.again}
        </p>
      </div>

      <div id="skills-grid" ref={gridRef} className="tb-grid mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
        {toolbox.groups.map((g, gi) => (
          <div key={g.heading}>
            <h3 data-group-head className="t-pixel border-b-2 border-ink pb-2 text-[1.05rem]">
              {g.heading}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {g.tags.map((t, ti) => (
                <li key={t} data-tape className="tape text-[0.88rem] whitespace-normal" style={{ ["--r" as string]: tilt(gi * 13 + ti) }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
