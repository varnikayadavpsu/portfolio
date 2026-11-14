"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";

/**
 * Section change (D): a full plum screen with one white word. The panel is
 * sticky, so it wipes up over the page, holds while the letters rise, then
 * wipes off the top. Reduced motion: a plain plum band with the word.
 */
export function PlumWipe({ word }: { word: string }) {
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const letters = el.querySelectorAll("[data-l]");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 65%", end: "bottom 35%", scrub: 0.5 },
      });
      tl.fromTo(letters, { yPercent: 110 }, { yPercent: 0, stagger: 0.04, duration: 0.5, ease: "power3.out" })
        .to({}, { duration: 0.6 })
        .to(letters, { yPercent: -110, stagger: 0.03, duration: 0.45, ease: "power3.in" });
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={root} className="wipe" role="presentation">
      <div className="wipe-panel">
        <p className="wipe-word" aria-hidden="true">
          {Array.from(word).map((ch, i) => (
            <span key={i} data-l>
              {ch}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
