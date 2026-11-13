import { gsap } from "gsap";

/**
 * In-panel motion, set up once per layout mode inside a gsap.matchMedia()
 * context (so everything is reverted automatically when the mode changes).
 *
 * Components only add data attributes:
 *   data-reveal            group whose [data-reveal-item] children slide up 24px and fade in
 *   svg[data-draw]         illustration; `.d` strokes draw in, `.fade` parts fade in
 *   [data-count-to]        numeral that counts up from 0
 *   [data-parallax="0.08"] drifts sideways as its panel passes (fraction of the viewport; hz only)
 *   [data-tilt]            rotates gently as it travels across the screen (hz only)
 *   [data-stamp]           slams down like a rubber stamp when it arrives
 *   [data-grow]            rule that grows from the left when it arrives
 *   [data-wipe]            photo that wipes up into view when it arrives
 *   [data-parallax-img]    photo that drifts inside its frame while scrolling
 */

type Trigger = ScrollTrigger.Vars;

/** Already visible when motion is set up? Then leave it as is (no flash). */
function onScreen(el: Element) {
  const r = el.getBoundingClientRect();
  return r.left < window.innerWidth && r.right > 0 && r.top < window.innerHeight && r.bottom > 0;
}

function triggerFor(el: Element, containerAnimation?: gsap.core.Animation): Trigger {
  return containerAnimation
    ? { trigger: el, containerAnimation, start: "left 82%", once: true }
    : { trigger: el, start: "top 85%", once: true };
}

/** Stagger 0.06s, compressed so a group never runs past ~0.57s in total. */
function staggerFor(count: number, duration: number) {
  if (count <= 1) return 0;
  return Math.min(0.06, (0.57 - duration) / (count - 1));
}

export function setupReveals(root: ParentNode, containerAnimation?: gsap.core.Animation) {
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((group) => {
    if (onScreen(group)) return;
    const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");
    const targets = items.length ? Array.from(items) : [group];
    const duration = 0.45;
    // Opacity only (not visibility), so hidden items stay keyboard-focusable.
    gsap.from(targets, {
      y: 24,
      opacity: 0,
      duration,
      ease: "power3.out",
      stagger: staggerFor(targets.length, duration),
      scrollTrigger: triggerFor(group, containerAnimation),
    });
  });
}

export function setupDraws(root: ParentNode, containerAnimation?: gsap.core.Animation) {
  root.querySelectorAll<SVGSVGElement>("svg[data-draw]").forEach((svg) => {
    if (onScreen(svg)) return;
    const strokes = Array.from(svg.querySelectorAll<SVGGeometryElement>(".d"));
    const fades = Array.from(svg.querySelectorAll<SVGElement>(".fade"));
    if (!strokes.length && !fades.length) return;

    // Read every length first, then write, so the browser lays out once.
    // A touch longer than the path so round caps don't leave a dot behind.
    const lengths = strokes.map((path) => path.getTotalLength() + 4);
    strokes.forEach((path, i) => {
      gsap.set(path, { strokeDasharray: `${lengths[i]} ${lengths[i]}`, strokeDashoffset: lengths[i] });
    });
    gsap.set(fades, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: triggerFor(svg, containerAnimation),
      // Animated illustrations change their path lengths; drop the dash once drawn.
      onComplete: () => gsap.set(strokes, { clearProps: "strokeDasharray,strokeDashoffset" }),
    });
    if (strokes.length) {
      tl.to(
        strokes,
        {
          strokeDashoffset: 0,
          duration: 0.45,
          ease: "power2.inOut",
          stagger: strokes.length > 1 ? Math.min(0.02, 0.1 / (strokes.length - 1)) : 0,
        },
        0,
      );
    }
    if (fades.length) {
      tl.to(fades, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0.3);
    }
  });
}

export function setupCounts(root: ParentNode, containerAnimation?: gsap.core.Animation): () => void {
  const restores: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>("[data-count-to]").forEach((el) => {
    const to = Number(el.dataset.countTo);
    if (!Number.isFinite(to) || onScreen(el)) return;
    const prefix = el.dataset.prefix ?? "";
    const suffix = el.dataset.suffix ?? "";
    const finalText = el.textContent ?? "";
    const state = { value: 0 };
    const render = () => {
      el.textContent = `${prefix}${Math.round(state.value)}${suffix}`;
    };
    render();
    const group = el.closest("[data-count-group]") ?? el;
    gsap.to(state, {
      value: to,
      duration: 0.55,
      ease: "power2.out",
      onUpdate: render,
      scrollTrigger: triggerFor(group, containerAnimation),
    });
    restores.push(() => {
      el.textContent = finalText;
    });
  });
  return () => restores.forEach((restore) => restore());
}

/**
 * Keep illustration strokes at exactly 1.75px on screen, whatever size the
 * SVG renders at, by exposing its current scale as --illo-scale.
 */
export function observeIllustrationScale(root: ParentNode = document): () => void {
  const update = (svg: SVGSVGElement, width: number, height: number) => {
    const vb = svg.viewBox.baseVal;
    if (!vb || !vb.width || !vb.height || !width || !height) return;
    const sx = width / vb.width;
    const sy = height / vb.height;
    const par = svg.getAttribute("preserveAspectRatio") ?? "";
    const scale = par.includes("slice") ? Math.max(sx, sy) : par === "none" ? (sx + sy) / 2 : Math.min(sx, sy);
    svg.style.setProperty("--illo-scale", scale.toFixed(4));
  };
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const svg = entry.target as SVGSVGElement;
      const box = entry.contentRect;
      if (box.width && box.height) update(svg, box.width, box.height);
      else {
        const rect = svg.getBoundingClientRect();
        update(svg, rect.width, rect.height);
      }
    }
  });
  root.querySelectorAll<SVGSVGElement>("svg.illo").forEach((svg) => ro.observe(svg));
  return () => ro.disconnect();
}

/** Scroll-scrubbed depth: things drift at different speeds as a panel passes. */
export function setupParallax(panel: HTMLElement, containerAnimation?: gsap.core.Animation) {
  // Photos drift inside their frames (sideways in the horizontal layout, vertically when stacked).
  panel.querySelectorAll<HTMLElement>("[data-parallax-img]").forEach((img) => {
    const frame = img.parentElement ?? img;
    if (containerAnimation) {
      gsap.fromTo(
        img,
        { xPercent: -6, scale: 1.16 },
        {
          xPercent: 6,
          scale: 1.16,
          ease: "none",
          scrollTrigger: { trigger: panel, containerAnimation, start: "left right", end: "right left", scrub: true },
        },
      );
    } else {
      gsap.fromTo(
        img,
        { yPercent: -5, scale: 1.12 },
        {
          yPercent: 5,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }
  });
  if (!containerAnimation) return;
  panel.querySelectorAll<HTMLElement | SVGElement>("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset.parallax) || 0.08;
    const distance = () => window.innerWidth * amount;
    gsap.fromTo(
      el,
      { x: () => distance() },
      {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          containerAnimation,
          start: "left right",
          end: "right left",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });
  panel.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el, i) => {
    const sign = i % 2 ? -1 : 1;
    gsap.fromTo(
      el,
      { rotation: 3.5 * sign },
      {
        rotation: -3.5 * sign,
        ease: "none",
        scrollTrigger: { trigger: el, containerAnimation, start: "left right", end: "right left", scrub: true },
      },
    );
  });
}

/** One-shot arrivals: stamps slam down, rules grow. */
export function setupArrivals(root: ParentNode, containerAnimation?: gsap.core.Animation) {
  root.querySelectorAll<HTMLElement>("[data-stamp]").forEach((stamp) => {
    if (onScreen(stamp)) return;
    gsap.from(stamp, {
      scale: 2.6,
      rotation: -38,
      opacity: 0,
      duration: 0.38,
      ease: "power4.in",
      scrollTrigger: containerAnimation
        ? { trigger: stamp, containerAnimation, start: "left 72%", once: true }
        : { trigger: stamp, start: "top 80%", once: true },
    });
  });
  root.querySelectorAll<HTMLElement>("[data-wipe]").forEach((photo) => {
    if (onScreen(photo)) return;
    gsap.fromTo(
      photo,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: containerAnimation
          ? { trigger: photo, containerAnimation, start: "left 85%", once: true }
          : { trigger: photo, start: "top 85%", once: true },
        onComplete: () => gsap.set(photo, { clearProps: "clipPath" }),
      },
    );
  });
  root.querySelectorAll<HTMLElement>("[data-grow]").forEach((rule) => {
    if (onScreen(rule)) return;
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: "0% 50%",
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: triggerFor(rule, containerAnimation),
    });
  });
}
