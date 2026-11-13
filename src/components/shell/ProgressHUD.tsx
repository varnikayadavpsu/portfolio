"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scroll";
import { sectionOrder, sections } from "@/content/site";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Fixed bottom HUD: a 2px wasabi progress line across the bottom and the
 * current section ("03 / 12 · how i build") at the bottom right.
 *
 * Panel positions are measured once (and again on resize / ScrollTrigger
 * refresh); each frame only compares numbers, so it never forces layout.
 */
export function ProgressHUD() {
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const bar = barRef.current;
    const label = labelRef.current;
    if (!bar || !label) return;

    let panels: HTMLElement[] = [];
    let starts: number[] = [];
    let measuredMode: "hz" | "stacked" | null = null;
    let maxScroll = 1;
    let lastPos = Number.NaN;
    let lastIndex = -1;

    const measure = () => {
      panels = Array.from(document.querySelectorAll<HTMLElement>("[data-panel]"));
      measuredMode = scrollState.mode;
      // hz: offset along the track; stacked: distance from the top of the page.
      starts =
        measuredMode === "hz"
          ? panels.map((p) => p.offsetLeft)
          : panels.map((p) => p.getBoundingClientRect().top + window.scrollY);
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      lastPos = Number.NaN;
    };

    const tick = () => {
      if (measuredMode !== scrollState.mode) measure();
      const { mode, track, trackTrigger } = scrollState;
      let pos: number;
      let progress: number;
      let probe: number;
      if (mode === "hz" && track && trackTrigger) {
        // Follow the scrubbed track itself so the HUD matches what's on screen.
        pos = -Number(gsap.getProperty(track, "x"));
        const distance = trackTrigger.end - trackTrigger.start;
        progress = distance > 0 ? pos / distance : 0;
        probe = pos + window.innerWidth / 2;
      } else {
        pos = window.scrollY;
        progress = pos / maxScroll;
        probe = pos + window.innerHeight / 2;
      }
      if (pos === lastPos) return;
      lastPos = pos;

      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress)).toFixed(4)})`;

      let index = 0;
      for (let i = 0; i < starts.length; i++) if (starts[i] <= probe) index = i;
      if (index !== lastIndex && panels[index]) {
        lastIndex = index;
        label.textContent = `${pad(index + 1)} / ${pad(panels.length)} · ${panels[index].dataset.hud ?? ""}`;
      }
    };

    measure();
    gsap.ticker.add(tick);
    ScrollTrigger.addEventListener("refresh", measure);
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    document.fonts?.ready.then(measure);
    // Cheap safety net: panel widths can settle late (fonts, images).
    const interval = window.setInterval(measure, 2000);
    return () => {
      gsap.ticker.remove(tick);
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div aria-hidden="true" data-inert-when-menu>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-[3px]">
        <div
          ref={barRef}
          className="h-full origin-left border-t border-plum bg-wasabi"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
      <p
        ref={labelRef}
        className="t-mono pointer-events-none fixed right-6 bottom-4 z-40 hidden bg-plum px-3 py-1.5 text-[0.75rem] text-wasabi lowercase hz:block"
      >
        {`01 / ${pad(sectionOrder.length)} · ${sections[sectionOrder[0]].hud}`}
      </p>
    </div>
  );
}
