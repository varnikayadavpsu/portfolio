"use client";

import { useRef, useState } from "react";
import { toolbox } from "@/content/site";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";

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

/** Toolbox (B): "Everything I know, unwrapped." Click the box and the skills fly out as tape labels. */
export function Toolbox() {
  const [open, setOpen] = useState(false);
  const lidRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useIsoLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const lid = lidRef.current;
    const box = boxRef.current;
    const grid = gridRef.current;
    if (!lid || !box) return;
    const reduced = prefersReducedMotion();

    if (!open) {
      gsap.to(lid, { x: 0, y: 0, rotationZ: 0, rotationX: 0, duration: reduced ? 0 : 0.5, ease: "back.out(1.4)" });
      return;
    }
    if (reduced) {
      gsap.set(lid, { x: box.offsetWidth * 0.55, y: -box.offsetWidth * 0.38, rotationZ: 24 });
      return;
    }
    const tl = gsap.timeline();
    tl.to(box, { rotation: 4, duration: 0.06, yoyo: true, repeat: 5, ease: "none" })
      .set(box, { rotation: 0 })
      .to(lid, { y: -box.offsetWidth * 0.38, x: box.offsetWidth * 0.55, rotationZ: 26, rotationX: -18, duration: 0.6, ease: "power3.out" });

    if (grid) {
      const b = box.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      const tapes = grid.querySelectorAll<HTMLElement>("[data-tape]");
      const heads = grid.querySelectorAll<HTMLElement>("[data-group-head]");
      tapes.forEach((t) => {
        const r = t.getBoundingClientRect();
        gsap.set(t, { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2), scale: 0.2, opacity: 0 });
      });
      gsap.set(heads, { opacity: 0, y: 16 });
      tl.to(tapes, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.3)", stagger: { each: 0.018, from: "random" } }, 0.5);
      tl.to(heads, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.9);
    }
    return () => {
      tl.kill();
    };
  }, [open]);

  return (
    <section id="toolbox" aria-labelledby="tb-h" className="wrap py-24 md:py-32">
      <p className="kicker">{toolbox.kicker}</p>
      <h2 id="tb-h" className="t-h2 mt-2">
        {toolbox.headingLead}
        <span className="hl">{toolbox.headingMark}</span>.
      </h2>

      <div className="mt-20 flex flex-col items-center md:mt-24">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="skills-grid"
          onClick={() => setOpen((v) => !v)}
          className="group grid h-[15rem] w-[15rem] cursor-pointer place-items-center rounded-3xl [--s:140px] [perspective:900px] md:h-[20rem] md:w-[20rem] md:[--s:190px]"
        >
          <span className="sr-only">{open ? "Wrap the toolbox back up" : "Unwrap my toolbox"}</span>
          <div ref={boxRef} className="transition-[scale,rotate] duration-300 group-hover:scale-105 group-hover:-rotate-2">
            <GiftBox lidRef={lidRef} />
          </div>
        </button>
        {open ? (
          <button type="button" onClick={() => setOpen(false)} className="pill pill-grey mt-4 text-sm">
            {toolbox.reset} <span aria-hidden="true">↺</span>
          </button>
        ) : (
          <p className="mt-4 font-serif text-xl italic" aria-hidden="true">
            {toolbox.cta} ↑
          </p>
        )}
      </div>

      <div
        id="skills-grid"
        ref={gridRef}
        data-open={open}
        className="tb-grid mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5"
      >
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
