"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Mobile URL bars resize the viewport while scrolling; don't re-measure pins for that.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };

/** Big scroll set pieces (pins, 3D stacks) run only here. Keep in sync with `motion-lg` in globals.css. */
export const BIG_MOTION = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
export const SMALL_MOTION = "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)";
export const REDUCED = "(prefers-reduced-motion: reduce)";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
}
