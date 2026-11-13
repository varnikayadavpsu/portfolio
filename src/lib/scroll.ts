import type Lenis from "lenis";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

/** Desktop horizontal experience. */
export const HZ_QUERY = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
/** Vertical layout, with motion allowed. */
export const STACKED_MOTION_QUERY = "(max-width: 899.98px) and (prefers-reduced-motion: no-preference)";
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

type ScrollState = {
  mode: "hz" | "stacked";
  reduced: boolean;
  lenis: Lenis | null;
  /** The pinned ScrollTrigger that drives the horizontal track (hz mode only). */
  trackTrigger: ScrollTrigger | null;
  track: HTMLElement | null;
  /** True while we move focus ourselves, so the focus-follow logic stays out of the way. */
  programmaticFocus: boolean;
};

export const scrollState: ScrollState = {
  mode: "stacked",
  reduced: false,
  lenis: null,
  trackTrigger: null,
  track: null,
  programmaticFocus: false,
};

function topbarOffset(): number {
  const value = getComputedStyle(document.documentElement).getPropertyValue("--topbar-h");
  return Number.parseFloat(value) || 0;
}

/** Scroll the window to an absolute Y position (Lenis if available). */
export function scrollToY(y: number, { immediate = false }: { immediate?: boolean } = {}) {
  const { lenis, reduced } = scrollState;
  if (lenis) {
    lenis.scrollTo(y, { immediate, force: true, duration: 1.1 });
  } else {
    window.scrollTo({ top: y, behavior: immediate || reduced ? "auto" : "smooth" });
  }
}

/**
 * Bring a section (or any element inside one) into view.
 * In the horizontal layout, vertical scroll maps 1:1 to the track's translate,
 * so the target is the pin's start plus the panel's offsetLeft.
 */
export function scrollToSection(
  id: string,
  { focus = true, immediate = false }: { focus?: boolean; immediate?: boolean } = {},
) {
  const el = document.getElementById(id);
  if (!el) return;

  const { mode, trackTrigger, track } = scrollState;
  if (id === "top") {
    scrollToY(0, { immediate });
  } else if (mode === "hz" && trackTrigger && track) {
    const panel = (el.closest("[data-panel]") as HTMLElement | null) ?? el;
    const x = panel.offsetLeft;
    const target = Math.min(trackTrigger.start + x, trackTrigger.end);
    scrollToY(target, { immediate });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY - topbarOffset();
    scrollToY(Math.max(0, y), { immediate });
  }

  if (focus) {
    const focusTarget = el.closest("[data-panel]") ?? el;
    if (focusTarget instanceof HTMLElement) {
      scrollState.programmaticFocus = true;
      focusTarget.focus({ preventScroll: true });
      requestAnimationFrame(() => {
        scrollState.programmaticFocus = false;
      });
    }
  }
}
