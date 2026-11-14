"use client";

import { useRef } from "react";
import { bigStats, experience } from "@/content/site";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import {
  CapIcon,
  Clothespin,
  LeadIcon,
  RoleIcon,
} from "@/components/ink/Icons";

/* Outer badges hang higher than inner ones, following the rope's sag. */
const SAG = ["lg:mt-[6px]", "lg:mt-[26px]", "lg:mt-[26px]", "lg:mt-[6px]"];
const TILT = ["-2.5deg", "1.5deg", "-1deg", "2deg"];
const MARKS = [
  "circle",
  "underline",
  "highlight",
  "circle",
  "underline",
] as const;

/** Hand-drawn marks (B) that draw onto each big number once it has counted up. */
function StatMark({ kind }: { kind: (typeof MARKS)[number] }) {
  if (kind === "highlight")
    return (
      <svg
        className="stat-mark stat-mark--hl absolute -inset-x-[0.08em] top-[38%] -z-10 h-[52%]"
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M3 9 C40 4 120 12 197 6 L196 35 C130 38 60 31 4 36 Z"
          fill="#f6e05e"
        />
      </svg>
    );
  if (kind === "underline")
    return (
      <svg
        className="stat-mark absolute -inset-x-[0.05em] -bottom-[0.12em] h-[0.2em]"
        viewBox="0 0 120 12"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M2 7 C20 2 30 11 48 6 S80 2 98 7 S114 9 118 5"
          pathLength={1}
          fill="none"
          stroke="#e3262f"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
    );
  return (
    <svg
      className="stat-mark absolute -inset-x-[0.22em] -inset-y-[0.16em] h-[calc(100%+0.32em)] w-[calc(100%+0.44em)]"
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M60 22 C160 2 330 8 378 52 C410 90 380 160 300 180 C200 202 70 194 30 150 C0 112 20 50 90 26 C120 16 150 14 180 15"
        pathLength={1}
        fill="none"
        stroke="#e3262f"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Experience (B timeline, C ink): roles as ID badges clipped to a clothesline,
 * big numbers with hand-drawn marks, leadership as stitched patches and the
 * degree as a ticket.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.fromTo(
          "[data-rope]",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.inOut",
            scrollTrigger: { trigger: "[data-badges]", start: "top 80%" },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-badge]", el).forEach((b, i) => {
          gsap.from(b, {
            y: -90,
            rotation: i % 2 ? 22 : -22,
            opacity: 0,
            duration: 1.5,
            delay: 0.25 + i * 0.13,
            ease: "elastic.out(1, 0.45)",
            scrollTrigger: { trigger: "[data-badges]", start: "top 80%" },
          });
        });
        el.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
          const to = Number(n.dataset.count);
          const obj = { v: 0 };
          const box = n.closest("[data-stat]");
          n.textContent = "0";
          gsap.to(obj, {
            v: to,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: n, start: "top bottom" },
            onUpdate: () => {
              n.textContent = String(Math.round(obj.v));
            },
            onComplete: () => box?.classList.add("is-drawn"),
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-patch]", el).forEach((p, i) => {
          gsap.from(p, {
            y: 60,
            rotation: i % 2 ? 10 : -10,
            scale: 0.85,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: "back.out(1.6)",
            scrollTrigger: { trigger: "[data-patches]", start: "top 85%" },
          });
        });
      },
      el,
    );
    mm.add("(prefers-reduced-motion: reduce)", () => {
      el.querySelectorAll("[data-stat]").forEach((s) =>
        s.classList.add("is-drawn"),
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="experience"
      aria-labelledby="exp-h"
      className="wrap py-24 md:py-32"
    >
      <p className="kicker">{experience.kicker}</p>
      <h2 id="exp-h" className="t-h2 mt-2">
        {experience.heading}
      </h2>

      {/* roles: ID badges on a clothesline */}
      <div data-badges className="relative mt-14 md:mt-20">
        <svg
          className="absolute inset-x-0 top-0 hidden h-[60px] w-full lg:block"
          viewBox="0 0 1000 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            data-rope
            d="M-10 8 C250 52 750 52 1010 8"
            pathLength={1}
            strokeDasharray="1"
            fill="none"
            stroke="#141414"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <ol className="grid gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-4 lg:gap-6">
          {experience.roles.map((r, i) => (
            <li
              key={r.org}
              data-badge
              data-sfx-hover="plink"
              className={`relative ${SAG[i]}`}
            >
              {/* GSAP drops the <li>; the tilt and hover swing live on this inner layer */}
              <div className="badge relative pt-9" style={{ rotate: TILT[i] }}>
                <span className="absolute top-0 left-1/2 z-10 h-11 w-6 -translate-x-1/2">
                  <Clothespin />
                </span>
                <div className="badge-card rounded-[18px] border-[2.5px] border-ink bg-paper shadow-[0_22px_34px_-24px_rgb(20_20_20/0.6)]">
                  <div className="relative h-11 rounded-t-[15px] border-b-2 border-ink bg-[radial-gradient(#141414_1.1px,transparent_1.5px)] [background-size:7px_7px]">
                    <span className="absolute top-3 left-1/2 h-2.5 w-14 -translate-x-1/2 rounded-full border-2 border-ink bg-paper" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="t-pixel text-sm text-muted">{r.dates}</p>
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-[2.5px] border-ink bg-paper p-1.5">
                        <RoleIcon kind={r.icon} />
                      </span>
                    </div>
                    <h3 className="mt-1 text-xl leading-tight font-extrabold tracking-[-0.02em]">
                      {r.role}
                    </h3>
                    <p className="mt-1 font-serif text-lg leading-tight italic">
                      {r.org}
                    </p>
                    {r.location && (
                      <p className="text-sm text-muted">{r.location}</p>
                    )}
                    <p className="mt-3 border-t-2 border-dashed border-ink/25 pt-3 text-[0.95rem] leading-snug">
                      {r.description}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* giant numbers with hand-drawn marks */}
      <ul className="mt-24 grid grid-cols-2 gap-x-6 gap-y-14 border-y-2 border-ink py-14 md:mt-28 lg:grid-cols-5">
        {bigStats.map((s, i) => (
          <li key={s.caption} data-stat className="isolate">
            <p className="text-[clamp(3.6rem,6.4vw,6.5rem)] leading-[0.85] font-extrabold tracking-[-0.06em] whitespace-nowrap">
              <span className="relative inline-block">
                <span data-count={s.value}>{s.value}</span>
                {s.suffix && <span className="text-red">{s.suffix}</span>}
                <StatMark kind={MARKS[i % MARKS.length]} />
              </span>
            </p>
            <p className="mt-4 max-w-[13rem] text-[0.95rem] leading-tight">
              {s.caption}
            </p>
          </li>
        ))}
      </ul>

      {/* leadership: stitched patches */}
      <h3 className="mt-20 text-[1.75rem] font-extrabold tracking-[-0.03em]">
        {experience.leadershipHeading} <span className="text-red">✦</span>
      </h3>
      <ul
        data-patches
        className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
      >
        {experience.leadership.map((l, i) => (
          <li key={l.org} data-patch data-sfx-hover="pop">
            {/* GSAP animates the <li>; the tilt and hover lift live on this inner layer */}
            <div
              className="patch h-full rounded-[28px] border-[2.5px] border-ink bg-paper p-2"
              style={{ rotate: ["-2deg", "1.5deg", "-1deg", "2.5deg"][i % 4] }}
            >
              <div className="h-full rounded-[21px] border-2 border-dashed border-ink/55 p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[2.5px] border-ink bg-[radial-gradient(#141414_1px,transparent_1.4px)] [background-size:6px_6px] p-1.5">
                    <span className="grid h-full w-full place-items-center rounded-full bg-paper p-1">
                      <LeadIcon kind={l.emblem} />
                    </span>
                  </span>
                  <p className="t-pixel pt-1 text-right text-sm text-muted">
                    {l.dates}
                  </p>
                </div>
                <p
                  className="tape mt-4 text-[0.9rem]"
                  style={{ ["--r" as string]: i % 2 ? "1.5deg" : "-2deg" }}
                >
                  {l.org}
                </p>
                <p className="mt-3 leading-tight font-bold">{l.role}</p>
                <p className="mt-2 text-[0.92rem] leading-snug">
                  {l.description}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* education: a ticket */}
      <div className="relative mt-16 flex flex-col gap-6 rounded-[22px] border-[2.5px] border-ink bg-paper p-6 md:flex-row md:items-center md:gap-10 md:p-8">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full border-[2.5px] border-ink p-2">
          <CapIcon />
        </span>
        <div className="flex-1">
          <p className="t-pixel text-sm text-muted">education</p>
          <p className="mt-1 text-[clamp(1.4rem,2.6vw,2rem)] leading-tight font-extrabold tracking-[-0.02em]">
            {experience.education.degree}
          </p>
          <p className="mt-1 font-serif text-xl italic">
            {experience.education.school}, {experience.education.expected}
          </p>
          <p className="mt-3 text-[0.95rem] text-muted">
            {experience.education.coursework.join(" ✦ ")}
          </p>
        </div>
        <div className="shrink-0 self-center md:border-l-2 md:border-dashed md:border-ink/30 md:pl-8">
          <svg
            viewBox="0 0 120 120"
            className="h-28 w-28 rotate-[-12deg]"
            aria-hidden="true"
          >
            <defs>
              <path
                id="stamp-ring"
                d="M60 60 m-42 0 a42 42 0 1 1 84 0 a42 42 0 1 1 -84 0"
              />
            </defs>
            <circle cx="60" cy="60" r="54" className="ink f-none" />
            <circle cx="60" cy="60" r="31" className="ink-2 f-none" />
            <text
              className="svg-pixel"
              fontSize="11.5"
              fill="#141414"
              letterSpacing="1"
            >
              <textPath href="#stamp-ring">
                CLASS OF 2028 ✦ PENN STATE ✦ CS + MATH ✦
              </textPath>
            </text>
            <text
              x="60"
              y="68"
              textAnchor="middle"
              className="svg-sans"
              fontSize="22"
              fontWeight="900"
              fill="#141414"
            >
              ’28
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
