"use client";

import { useRef } from "react";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { sfx } from "@/lib/sound";
import { Moth, Sparkle } from "@/components/ink/Art";

export type WipeProps = {
  word: string;
  /** Chapter number, top-left. */
  index: string;
  /** Top-right label. */
  label: string;
  /** Bottom-left facts, counted from the content. */
  meta: string;
  /** Text on the yellow tape slapped across the word. */
  tape: string;
};

const ECHOES = [-3, -2, -1, 1, 2, 3];

/**
 * Section change (D, with C's stickers): a full plum screen with one white word.
 * As you scroll, outlined echoes of the word slide into a stack, the letters
 * flip up, a tape label slaps across it, stickers pop in, then everything
 * flies off the top. Reduced motion: the finished composition, still.
 */
export function PlumWipe({ word, index, label, meta, tape }: WipeProps) {
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(el);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 25%", scrub: 0.6 },
      });
      // in
      tl.fromTo(q("[data-dots]"), { backgroundPosition: "0px 0px" }, { backgroundPosition: "0px -260px", duration: 3 }, 0);
      q("[data-echo]").forEach((e) => {
        const o = Number((e as HTMLElement).dataset.echo);
        // y: 0 clears the static CSS offset so GSAP's yPercent is the only one
        tl.fromTo(e, { y: 0, yPercent: o * 260, opacity: 0 }, { y: 0, yPercent: o * 92, opacity: 0.55 - Math.abs(o) * 0.13, duration: 0.9, ease: "power2.out" }, 0);
      });
      tl.fromTo(
        q("[data-l]"),
        { yPercent: 115, rotationX: -85, opacity: 0 },
        { yPercent: 0, rotationX: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: "back.out(1.7)" },
        0.15,
      );
      tl.fromTo(q("[data-corner]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.3 }, 0.4);
      tl.fromTo(q("[data-tape]"), { scale: 2.2, rotation: -26, opacity: 0 }, { scale: 1, rotation: -7, opacity: 1, duration: 0.25, ease: "back.out(2.4)" }, 1.0);
      tl.call(() => sfx.slap(), undefined, 1.02);
      tl.fromTo(q("[data-sticker]"), { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, stagger: 0.08, duration: 0.3, ease: "back.out(2)" }, 1.1);
      // hold
      tl.to({}, { duration: 0.6 });
      // out
      tl.to(q("[data-l]"), { yPercent: -130, rotationX: 70, opacity: 0, stagger: 0.035, duration: 0.5, ease: "power2.in" }, 2.1);
      q("[data-echo]").forEach((e) => {
        const o = Number((e as HTMLElement).dataset.echo);
        tl.to(e, { yPercent: o * 320, opacity: 0, duration: 0.6, ease: "power2.in" }, 2.1);
      });
      tl.to(q("[data-tape], [data-sticker]"), { scale: 0, rotation: 40, stagger: 0.04, duration: 0.3, ease: "power2.in" }, 2.15);
      tl.to(q("[data-corner]"), { opacity: 0, duration: 0.3 }, 2.3);
    });
    return () => mm.revert();
  }, []);

  // Longer words get a smaller size so they always fit on one line.
  const fs = `clamp(2.4rem, ${Math.min(11.5, 112 / word.length).toFixed(2)}vw, 11rem)`;

  return (
    <div ref={root} className="wipe" role="presentation" style={{ ["--fs" as string]: fs }}>
      <div className="wipe-panel">
        <div data-dots aria-hidden="true" className="wipe-dots" />

        <p data-corner aria-hidden="true" className="wipe-corner top-20 left-[var(--gutter)] md:top-28">
          {index} <span className="text-yellow">✦</span> chapter
        </p>
        <p data-corner aria-hidden="true" className="wipe-corner top-20 right-[var(--gutter)] text-right md:top-28">
          {label}
        </p>
        <p data-corner aria-hidden="true" className="wipe-corner bottom-6 left-[var(--gutter)]">
          {meta}
        </p>
        <p data-corner aria-hidden="true" className="wipe-corner right-[var(--gutter)] bottom-6 text-right">
          keep scrolling ↓
        </p>

        <div className="relative" aria-hidden="true">
          {ECHOES.map((o) => (
            <p
              key={o}
              data-echo={o}
              className="wipe-word wipe-echo absolute inset-x-0 top-0"
              style={{ ["--o" as string]: o, opacity: 0.55 - Math.abs(o) * 0.13 }}
            >
              {word}
            </p>
          ))}
          <p className="wipe-word relative [perspective:800px]">
            {Array.from(word).map((ch, i) => (
              <span key={i} data-l className="inline-block [transform-origin:50%_100%]">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </p>
          <span
            data-tape
            className="tape absolute top-[125%] left-[6%] text-[0.8rem] md:top-[62%] md:left-[58%] md:text-[clamp(0.85rem,1.6vw,1.25rem)]"
            style={{ ["--r" as string]: "0deg" }}
          >
            {tape}
          </span>
          <span data-sticker className="absolute -top-[18%] left-[6%] w-[clamp(2rem,5vw,4.5rem)]">
            <Sparkle className="h-auto w-full" />
          </span>
          <span data-sticker className="absolute -bottom-[30%] left-[20%] w-[clamp(3rem,7vw,6rem)] rotate-[-12deg]">
            <Moth className="h-auto w-full" />
          </span>
          <span data-sticker className="absolute -top-[30%] right-[8%] w-[clamp(1.5rem,3.5vw,3rem)] rotate-12">
            <Sparkle className="h-auto w-full" />
          </span>
        </div>
      </div>
    </div>
  );
}
