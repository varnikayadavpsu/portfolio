"use client";

import { Fragment, useRef } from "react";
import { aboutStory, type StorySegment } from "@/content/site";
import { gsap, ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";

/** Hand-drawn loop for the circled phrase (drawn with stroke-dashoffset). */
function Loop() {
  return (
    <svg className="mark-loop" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M40 6 C130 -1 300 0 378 10 C402 16 400 46 362 52 C262 61 112 60 38 53 C6 49 0 24 22 13 C38 6 66 3 100 4"
        pathLength={1}
        fill="none"
        stroke="#e3262f"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Words({ text }: { text: string }) {
  const parts = text.split(/(\s+)/);
  return (
    <>
      {parts.map((p, i) =>
        /^\s+$/.test(p) ? (
          <Fragment key={i}>{p}</Fragment>
        ) : (
          <span key={i} className="story-word">
            {p}
          </span>
        ),
      )}
    </>
  );
}

function Segment({ seg }: { seg: StorySegment }) {
  if (!seg.mark) return <Words text={seg.text} />;
  return (
    <span className={`mark mark--${seg.mark}`} data-mark>
      <Words text={seg.text} />
      {seg.mark === "circle" && <Loop />}
    </span>
  );
}

/**
 * About (B): big story text that turns from grey to ink as it passes the
 * reading line, hand-drawn marks that animate in, and sticky notes in the margin.
 */
export function AboutStory() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      el.querySelectorAll<HTMLElement>("[data-para]").forEach((p) => {
        const words = p.querySelectorAll(".story-word");
        gsap.to(words, {
          color: "#141414",
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: p, start: "top 82%", end: "bottom 58%", scrub: 0.4 },
        });
      });
      el.querySelectorAll<HTMLElement>("[data-mark]").forEach((m) => {
        ScrollTrigger.create({
          trigger: m,
          start: "top 62%",
          onEnter: () => m.classList.add("is-drawn"),
          onLeaveBack: () => m.classList.remove("is-drawn"),
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-note]", el).forEach((n, i) => {
        gsap.from(n, {
          y: 40,
          rotate: i % 2 ? 9 : -9,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: n, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      el.classList.add("story-done");
      el.querySelectorAll("[data-mark]").forEach((m) => m.classList.add("is-drawn"));
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="about" aria-labelledby="about-h" className="wrap py-24 md:py-36">
      <p className="kicker">{aboutStory.kicker}</p>
      <h2 id="about-h" className="mt-3 font-serif text-[clamp(2rem,4vw,3.25rem)] leading-none text-ink italic">
        {aboutStory.heading}
      </h2>

      <div className="mt-10 space-y-12 md:mt-14 md:space-y-16">
        {aboutStory.paragraphs.map((para, i) => (
          <div key={i} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
            <p
              data-para
              className="max-w-[60rem] text-[clamp(1.75rem,3.7vw,3.4rem)] leading-[1.14] font-semibold tracking-[-0.03em]"
            >
              {para.segments.map((seg, j) => (
                <Segment key={j} seg={seg} />
              ))}
            </p>
            {para.note && (
              <aside
                data-note
                className={`stickynote stickynote--${para.note.tone} h-fit self-start justify-self-start lg:mt-4 ${i % 2 ? "lg:justify-self-end" : ""}`}
              >
                {para.note.text}
              </aside>
            )}
          </div>
        ))}
      </div>

      <p className="mt-14 font-serif text-xl text-muted italic">{aboutStory.footnote}</p>
    </section>
  );
}
