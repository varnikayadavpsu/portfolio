"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { scrollState } from "@/lib/scroll";
import { useLive } from "@/lib/useLive";

/**
 * A ticker-tape band that scrolls on its own and speeds up and leans with
 * your scroll. Decorative (aria-hidden): the same words are in the Toolbox.
 * Runs only while on screen; static under reduced motion.
 */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const tickRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const tween = gsap.to(track, { xPercent: -50, ease: "none", duration: 34, repeat: -1, paused: true });
    const skewTo = gsap.quickTo(track, "skewX", { duration: 0.45, ease: "power3" });
    let speed = 1;
    const tick = () => {
      const v = scrollState.lenis?.velocity ?? 0;
      const target = 1 + Math.min(8, Math.abs(v) * 0.3);
      speed += (target - speed) * 0.08;
      tween.timeScale(speed);
      skewTo(Math.max(-12, Math.min(12, -v * 0.4)));
    };
    tweenRef.current = tween;
    tickRef.current = tick;
    return () => {
      gsap.ticker.remove(tick);
      tween.kill();
      gsap.set(track, { clearProps: "transform" });
      tweenRef.current = null;
      tickRef.current = null;
    };
  }, []);

  useLive(rootRef, (live) => {
    const tween = tweenRef.current;
    const tick = tickRef.current;
    if (!tween || !tick) return;
    if (live) {
      tween.play();
      gsap.ticker.add(tick);
    } else {
      tween.pause();
      gsap.ticker.remove(tick);
    }
  });

  return (
    <div ref={rootRef} aria-hidden="true" className={`overflow-hidden bg-plum text-wasabi ${className}`}>
      <div ref={trackRef} className="flex w-max items-center py-3">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span
                key={`${copy}-${item}`}
                className="t-display flex items-center gap-5 pr-5 text-[clamp(1.5rem,2.3vw,2.25rem)] leading-none whitespace-nowrap"
              >
                {item}
                <span className="text-[0.55em] text-persimmon">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
