"use client";

import { useEffect, useRef, type RefObject } from "react";

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;
}

/**
 * Ambient motion should only run while it can be seen. This marks the element
 * with `data-live` while it's on (or near) screen and motion is allowed, and
 * calls `onChange(true/false)` as that flips. CSS loops key off `[data-live]`;
 * JS loops start/stop in `onChange`.
 */
export function useLive<T extends Element>(ref: RefObject<T | null>, onChange?: (live: boolean) => void) {
  const callback = useRef(onChange);
  useEffect(() => {
    callback.current = onChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia(REDUCED_MOTION);
    let visible = false;
    let live = false;
    const apply = () => {
      const next = visible && !mq.matches;
      if (next === live) return;
      live = next;
      if (live) el.setAttribute("data-live", "");
      else el.removeAttribute("data-live");
      callback.current?.(live);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        apply();
      },
      { rootMargin: "120px" },
    );
    io.observe(el);
    mq.addEventListener("change", apply);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", apply);
      if (live) callback.current?.(false);
    };
  }, [ref]);
}
