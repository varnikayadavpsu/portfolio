"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { menu, person } from "@/content/site";
import { scrollState, scrollToSection } from "@/lib/scroll";
import { Terminal } from "@/components/illustrations/Terminal";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function setBackgroundInert(inert: boolean) {
  document.querySelectorAll<HTMLElement>("[data-inert-when-menu]").forEach((el) => {
    el.inert = inert;
  });
}

/**
 * Fixed chrome: the left rail (top bar on small screens / reduced motion),
 * the slide-out menu and the small "open to internships" pill on mobile.
 */
export function SiteChrome() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef(true);
  const hasOpenedRef = useRef(false);

  const close = useCallback((restoreFocus = true) => {
    restoreFocusRef.current = restoreFocus;
    setOpen(false);
  }, []);

  // Open/close side effects: lock scroll, inert the page, move focus.
  useEffect(() => {
    if (open) {
      hasOpenedRef.current = true;
      scrollState.lenis?.stop();
      setBackgroundInert(true);
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      // Wait a frame so the panel is visible (and focusable) first.
      const id = requestAnimationFrame(() => first?.focus());
      return () => cancelAnimationFrame(id);
    }
    if (!hasOpenedRef.current) return; // first render: nothing to undo
    scrollState.lenis?.start();
    setBackgroundInert(false);
    if (restoreFocusRef.current) burgerRef.current?.focus({ preventScroll: true });
    restoreFocusRef.current = true;
  }, [open]);

  // Esc closes; Tab cycles between the menu button and the menu's links.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab") return;
      const items = [
        burgerRef.current,
        ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []),
      ].filter((el): el is HTMLElement => Boolean(el));
      if (!items.length) return;
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = event.shiftKey
        ? index <= 0
          ? items.length - 1
          : index - 1
        : index === -1 || index === items.length - 1
          ? 0
          : index + 1;
      event.preventDefault();
      items[next].focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const onMenuLink = (event: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault();
    scrollState.lenis?.start();
    close(false);
    // Let the menu start closing, then travel.
    requestAnimationFrame(() => scrollToSection(target));
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex h-[var(--topbar-h)] items-center justify-between bg-plum px-4 text-ice hz:inset-x-auto hz:bottom-0 hz:left-0 hz:h-auto hz:w-[var(--rail-w)] hz:flex-col hz:px-0 hz:py-5"
      >
        <a
          href="#top"
          data-inert-when-menu
          className="t-display text-[2rem] leading-none text-wasabi [--focus:var(--color-wasabi)]"
          aria-label={`${person.name}, back to top`}
        >
          {person.monogram}
        </a>


        <button
          ref={burgerRef}
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => (open ? close(true) : setOpen(true))}
          className="group grid size-11 place-items-center text-ice [--focus:var(--color-wasabi)]"
        >
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
            <g stroke="currentColor" strokeWidth="1.75" strokeLinecap="square">
              <line
                x1="3"
                y1="6"
                x2="21"
                y2="6"
                className="origin-center transition-transform duration-300 group-aria-expanded:translate-y-[6px] group-aria-expanded:rotate-45"
              />
              <line
                x1="3"
                y1="12"
                x2="21"
                y2="12"
                className="transition-opacity duration-200 group-aria-expanded:opacity-0"
              />
              <line
                x1="3"
                y1="18"
                x2="21"
                y2="18"
                className="origin-center transition-transform duration-300 group-aria-expanded:-translate-y-[6px] group-aria-expanded:-rotate-45"
              />
            </g>
          </svg>
        </button>
      </header>

      {/* Scrim: the page stays visible to the right, slightly dimmed. */}
      <div
        className="menu-scrim fixed inset-0 z-30 bg-plum/45"
        data-open={open}
        aria-hidden="true"
        onClick={() => close(true)}
      />

      <div
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        data-open={open}
        className="menu-panel theme-plum fixed top-[var(--topbar-h)] bottom-0 left-0 z-40 flex w-full flex-col justify-between overflow-y-auto border-r border-ice/20 px-8 pt-10 pb-8 hz:top-0 hz:left-[var(--rail-w)] hz:w-[min(560px,calc(100vw-var(--rail-w)))] hz:px-12 hz:pt-14"
      >
        <nav aria-label="Sections">
          <ul className="flex flex-col">
            {menu.links.map((link) => (
              <li key={link.target}>
                <a
                  href={`#${link.target}`}
                  onClick={(event) => onMenuLink(event, link.target)}
                  className="group t-display flex items-center gap-3 py-1 text-[clamp(3rem,10vh,5.75rem)] text-ice transition-colors duration-200 hover:text-wasabi focus-visible:text-wasabi"
                >
                  <span
                    aria-hidden="true"
                    className="t-mono w-0 -translate-x-2 overflow-hidden text-[0.45em] text-persimmon opacity-0 transition-all duration-200 group-hover:w-[0.6em] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:w-[0.6em] group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  >
                    &gt;
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 flex items-end justify-between gap-6">
          <Terminal draw={false} className="w-[min(220px,45vw)]" />
          <p className="t-mono text-[0.75rem] text-ice/80">{menu.copyright}</p>
        </div>
      </div>

    </>
  );
}
