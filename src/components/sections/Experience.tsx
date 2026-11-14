"use client";

import { useRef } from "react";
import { bigStats, experience } from "@/content/site";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { RoleIcon } from "@/components/ink/Icons";

/**
 * Experience (B): a timeline with an ink icon per role, giant stat numbers that
 * count up, then leadership and education in a smaller row.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-line]", {
        scaleX: 0,
        scaleY: 0,
        transformOrigin: "0 0",
        duration: 1.4,
        ease: "power2.inOut",
        scrollTrigger: { trigger: "[data-timeline]", start: "top 75%" },
      });
      gsap.from("[data-milestone]", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-timeline]", start: "top 75%" },
      });
      el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
        const to = Number(n.dataset.count);
        const obj = { v: 0 };
        n.textContent = "0";
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: n, start: "top bottom" },
          onUpdate: () => {
            n.textContent = String(Math.round(obj.v));
          },
        });
      });
    }, el);
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="experience" aria-labelledby="exp-h" className="wrap py-24 md:py-32">
      <p className="kicker">{experience.kicker}</p>
      <h2 id="exp-h" className="t-h2 mt-2">
        {experience.heading}
      </h2>

      {/* timeline */}
      <ol data-timeline className="relative mt-14 grid gap-10 pl-10 md:mt-20 md:grid-cols-4 md:gap-8 md:pl-0">
        <span
          data-line
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[19px] w-[3px] bg-ink md:top-[44px] md:right-0 md:bottom-auto md:left-0 md:h-[3px] md:w-auto"
        />
        {experience.roles.map((r) => (
          <li key={r.org} data-milestone className="relative">
            <p className="t-pixel text-sm text-muted md:h-6">{r.dates}</p>
            <div className="absolute top-0 -left-10 grid h-10 w-10 place-items-center rounded-full border-[3px] border-ink bg-paper p-1 md:relative md:left-0 md:mt-1 md:h-16 md:w-16 md:p-1.5">
              <RoleIcon kind={r.icon} />
            </div>
            <h3 className="mt-2 text-xl leading-tight font-extrabold tracking-[-0.02em] md:mt-5">{r.role}</h3>
            <p className="mt-1 font-serif text-lg leading-tight italic">{r.org}</p>
            {r.location && <p className="text-sm text-muted">{r.location}</p>}
            <p className="mt-2 text-[0.95rem] leading-snug">{r.description}</p>
          </li>
        ))}
      </ol>

      {/* giant numbers */}
      <ul className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 border-y-2 border-ink py-12 md:mt-32 lg:grid-cols-5">
        {bigStats.map((s) => (
          <li key={s.caption}>
            <p className="text-[clamp(3.6rem,6.4vw,6.5rem)] leading-[0.85] font-extrabold tracking-[-0.06em] whitespace-nowrap">
              <span data-count={s.value}>{s.value}</span>
              {s.suffix && <span className="text-red">{s.suffix}</span>}
            </p>
            <p className="mt-3 max-w-[13rem] text-[0.95rem] leading-tight">{s.caption}</p>
          </li>
        ))}
      </ul>

      {/* leadership */}
      <h3 className="mt-20 text-[1.75rem] font-extrabold tracking-[-0.03em]">
        {experience.leadershipHeading} <span className="text-red">✦</span>
      </h3>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {experience.leadership.map((l, i) => (
          <li key={l.org} className="rounded-2xl border-2 border-ink p-5">
            <p className="tape text-[0.9rem]" style={{ ["--r" as string]: i % 2 ? "1.5deg" : "-2deg" }}>
              {l.org}
            </p>
            <p className="mt-4 leading-tight font-bold">{l.role}</p>
            <p className="t-pixel mt-1 text-sm text-muted">{l.dates}</p>
            <p className="mt-2 text-[0.92rem] leading-snug">{l.description}</p>
          </li>
        ))}
      </ul>

      {/* education */}
      <div className="mt-16 flex flex-col gap-2 border-t-2 border-dashed border-ink/30 pt-8 md:flex-row md:items-baseline md:gap-10">
        <p className="t-pixel shrink-0 text-sm text-muted">education</p>
        <div>
          <p className="text-[clamp(1.4rem,2.6vw,2rem)] leading-tight font-extrabold tracking-[-0.02em]">
            {experience.education.degree}
          </p>
          <p className="mt-1 font-serif text-xl italic">
            {experience.education.school}, {experience.education.expected}
          </p>
          <p className="mt-3 text-[0.95rem] text-muted">{experience.education.coursework.join(" ✦ ")}</p>
        </div>
      </div>
    </section>
  );
}
