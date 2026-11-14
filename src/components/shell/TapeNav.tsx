"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import type { SectionId } from "@/content/types";
import { InkFace } from "@/components/ink/Art";

const tilts = ["-3deg", "2deg", "-1.5deg", "2.5deg", "-2deg"];

/**
 * Yellow tape-label tabs with an ink face in the middle (C), plus a dark
 * "Resume ↗" pill (B). Shrinks to a compact sticky bar once you scroll.
 */
export function TapeNav({ resumeHref, faceSrc }: { resumeHref: string | null; faceSrc: string | null }) {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mark the tab for the section in the middle of the screen.
  useEffect(() => {
    const ids = nav.links.map((l) => l.target);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const left = nav.links.slice(0, 3);
  const right = nav.links.slice(3);

  const tab = (l: (typeof nav.links)[number], i: number) => (
    <li key={l.target}>
      <a
        href={`#${l.target}`}
        className="tape text-[0.95rem] data-[compact=true]:text-[0.85rem]"
        data-compact={compact}
        style={{ ["--r" as string]: tilts[i % tilts.length] }}
        aria-current={active === l.target ? "true" : undefined}
        onClick={() => setOpen(false)}
      >
        {active === l.target && <span aria-hidden="true">✦</span>}
        {l.label}
      </a>
    </li>
  );

  const face = faceSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={faceSrc} alt="" className="h-full w-full rounded-full object-cover" />
  ) : (
    <InkFace className="h-full w-full" />
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-300 ${
        compact ? "bg-paper/95 py-1.5 shadow-[0_2px_0_rgb(20_20_20/0.9)]" : "py-3"
      }`}
    >
      <div className="wrap relative flex items-center justify-between gap-3 md:justify-center">
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-2.5 lg:gap-3.5">
            {left.map((l, i) => tab(l, i))}
            <li className="mx-1.5">
              <a
                href="#top"
                aria-label={nav.homeLabel}
                className={`block overflow-hidden rounded-full transition-all duration-300 hover:-rotate-6 ${
                  compact ? "h-11 w-11" : "h-16 w-16"
                }`}
              >
                {face}
              </a>
            </li>
            {right.map((l, i) => tab(l, i + 3))}
          </ul>
        </nav>

        {/* Mobile: face + menu tape */}
        <a href="#top" aria-label={nav.homeLabel} className="block h-12 w-12 shrink-0 overflow-hidden rounded-full md:hidden">
          {face}
        </a>
        <button
          type="button"
          className="tape text-base md:hidden"
          style={{ ["--r" as string]: "-2deg" }}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "close ✕" : "menu ✦"}
        </button>

        <a
          href={resumeHref ?? "#experience"}
          {...(resumeHref ? { target: "_blank", rel: "noopener" } : {})}
          className={`pill pill-dark shrink-0 text-[0.9rem] md:absolute md:right-[var(--gutter)] ${compact ? "min-h-10 py-2" : ""}`}
        >
          {nav.resumeLabel} <span aria-hidden="true">{resumeHref ? "↗" : "↓"}</span>
        </a>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        hidden={!open}
        className="border-b-2 border-ink bg-paper px-[var(--gutter)] pt-3 pb-6 md:hidden"
      >
        <ul className="flex flex-wrap gap-3">{nav.links.map((l, i) => tab(l, i))}</ul>
      </div>
    </header>
  );
}
