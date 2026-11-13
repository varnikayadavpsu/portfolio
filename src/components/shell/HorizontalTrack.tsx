"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  HZ_QUERY,
  REDUCED_QUERY,
  STACKED_MOTION_QUERY,
  scrollState,
  scrollToSection,
  scrollToY,
} from "@/lib/scroll";
import {
  observeIllustrationScale,
  setupArrivals,
  setupCounts,
  setupDraws,
  setupParallax,
  setupReveals,
} from "@/lib/motion";

/**
 * The pinned horizontal track.
 *
 * Desktop (≥ 900px, motion allowed): the viewport is pinned and the track of
 * panels translates sideways, scrubbed by vertical scroll (1px down = 1px left).
 * Below 900px or with reduced motion: no pinning, panels simply stack.
 */
export function HorizontalTrack({ children }: { children: ReactNode }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const mm = gsap.matchMedia();
    mm.add(
      { hz: HZ_QUERY, stackedMotion: STACKED_MOTION_QUERY, reduced: REDUCED_QUERY },
      (context) => {
        const { hz, reduced } = context.conditions as { hz: boolean; reduced: boolean };

        // Smooth scrolling, driven by GSAP's ticker so Lenis and ScrollTrigger stay in lockstep.
        let lenis: Lenis | null = null;
        const raf = (time: number) => lenis?.raf(time * 1000);
        if (!reduced) {
          lenis = new Lenis({ autoRaf: false, lerp: 0.12, anchors: false });
          lenis.on("scroll", ScrollTrigger.update);
          gsap.ticker.add(raf);
          gsap.ticker.lagSmoothing(0);
        }
        scrollState.lenis = lenis;
        scrollState.reduced = reduced;
        scrollState.mode = hz ? "hz" : "stacked";

        let containerAnimation: gsap.core.Tween | undefined;
        if (hz) {
          const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
          containerAnimation = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: viewport,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
          scrollState.trackTrigger = containerAnimation.scrollTrigger ?? null;
          scrollState.track = track;

          // Headlines lean into fast scrolls and settle when you stop.
          const leaners = track.querySelectorAll<HTMLElement>("[data-panel] h2.t-display, [data-skew]");
          if (lenis && leaners.length) {
            const lean = gsap.quickTo(leaners, "skewX", { duration: 0.5, ease: "power3" });
            lenis.on("scroll", (instance: Lenis) => lean(Math.max(-9, Math.min(9, -instance.velocity * 0.18))));
          }
        }

        // In-panel motion isn't needed until the user scrolls, so set it up
        // one panel per idle task instead of in one long startup task.
        const restores: Array<() => void> = [];
        let cancelled = false;
        let pending: number | undefined;
        const hasIdle = typeof window.requestIdleCallback === "function";
        const schedule = (fn: () => void) => {
          pending = hasIdle ? window.requestIdleCallback(fn, { timeout: 600 }) : window.setTimeout(fn, 16);
        };
        if (!reduced) {
          const queue = Array.from(track.querySelectorAll<HTMLElement>("[data-panel]"));
          const next = () => {
            const panel = queue.shift();
            if (cancelled || !panel) return;
            context.add(() => {
              setupReveals(panel, containerAnimation);
              setupDraws(panel, containerAnimation);
              setupArrivals(panel, containerAnimation);
              setupParallax(panel, containerAnimation);
              restores.push(setupCounts(panel, containerAnimation));
            });
            schedule(next);
          };
          schedule(next);
        }

        // Fonts change text widths, which changes the track width.
        document.fonts?.ready.then(() => {
          if (!cancelled) ScrollTrigger.refresh();
        });

        return () => {
          cancelled = true;
          if (pending !== undefined) {
            if (hasIdle) window.cancelIdleCallback(pending);
            else window.clearTimeout(pending);
          }
          restores.forEach((restore) => restore());
          gsap.ticker.remove(raf);
          lenis?.destroy();
          scrollState.lenis = null;
          scrollState.trackTrigger = null;
          scrollState.track = null;
        };
      },
    );

    // In-page links (#work, #contact…) go through scrollToSection so they
    // land on the right panel in the horizontal layout too.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const id = decodeURIComponent(link.hash.slice(1));
      if (!id || !document.getElementById(id)) return;
      event.preventDefault();
      scrollToSection(id);
    };

    // Keyboard users: when focus lands on something off-screen in the track,
    // scroll so it's visible.
    const onFocusIn = (event: FocusEvent) => {
      const { mode, trackTrigger, programmaticFocus } = scrollState;
      if (mode !== "hz" || !trackTrigger || programmaticFocus) return;
      const target = event.target as HTMLElement | null;
      if (!target || !track.contains(target) || target.hasAttribute("data-panel")) return;
      const viewportWidth = viewport.clientWidth;
      const x = target.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const width = target.getBoundingClientRect().width;
      const current = window.scrollY - trackTrigger.start;
      const margin = 48;
      if (x >= current + margin && x + width <= current + viewportWidth - margin) return;
      const goal = trackTrigger.start + x - viewportWidth * 0.3;
      scrollToY(Math.min(Math.max(goal, trackTrigger.start), trackTrigger.end), { immediate: true });
    };

    const stopScale = observeIllustrationScale(document);
    document.addEventListener("click", onClick);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocusIn);
      stopScale();
      mm.revert();
    };
  }, []);

  return (
    <div className="hz:pl-[var(--rail-w)]" data-inert-when-menu>
      <div ref={viewportRef} className="track-viewport">
        <div ref={trackRef} className="track">
          {children}
        </div>
      </div>
    </div>
  );
}
