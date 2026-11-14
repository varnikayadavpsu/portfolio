"use client";

import { useEffect, useRef, useState } from "react";
import { contact, person, social } from "@/content/site";
import { PhoneArt } from "@/components/ink/Art";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { sfx } from "@/lib/sound";

/**
 * Contact (C): the red rotary phone from the hero, larger. Scroll to it and it
 * rings by itself (with sound, once the visitor has clicked anything on the
 * page), then picks up and an ink speech bubble shows the email and links.
 */
export function Contact({ resumeHref }: { resumeHref: string | null }) {
  const [ringing, setRinging] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const phoneRef = useRef<HTMLButtonElement>(null);

  const ring = () => {
    window.clearTimeout(timer.current);
    const reduced = prefersReducedMotion();
    setRinging(!reduced);
    sfx.ring();
    timer.current = window.setTimeout(
      () => {
        setRinging(false);
        setAnswered(true);
        sfx.pickup();
      },
      reduced ? 0 : 2700,
    );
  };

  // Ring as soon as the phone scrolls into view, no click needed.
  useEffect(() => {
    const el = phoneRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({ trigger: el, start: "top 75%", once: true, onEnter: ring });
    return () => {
      st.kill();
      window.clearTimeout(timer.current);
    };
  }, []);

  const call = () => {
    if (answered) {
      setAnswered(false);
      sfx.pickup(); // hang up
      return;
    }
    if (!ringing) ring();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      sfx.ding();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${person.email}`;
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-h" className="pt-24 md:pt-32">
      <div className="wrap grid gap-10 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
        <div>
          <p className="kicker">{contact.kicker}</p>
          <h2 id="contact-h" className="t-h2 mt-2 max-w-[11ch]">
            {contact.heading}
          </h2>
          <p className="mt-6 max-w-[30rem] text-[1.2rem] leading-snug font-semibold">
            <span className="hl">{contact.line}</span>
          </p>
          <p className="mt-6 font-serif text-xl text-muted italic">
            {contact.hint} <span aria-hidden="true">→</span>
          </p>
        </div>

        <div className={`relative flex flex-col items-center lg:items-end ${ringing ? "is-ringing" : ""}`}>
          <button
            ref={phoneRef}
            type="button"
            data-sfx="none"
            onClick={call}
            aria-expanded={answered}
            aria-controls="call-bubble"
            className="group relative w-[min(100%,26rem)] cursor-pointer rounded-3xl"
          >
            <span className="sr-only">{answered ? "Hang up" : "Ring Varnika: show her email and links"}</span>
            <svg viewBox="-34 -46 210 168" className="h-auto w-full overflow-visible" aria-hidden="true">
              {/* ring lines */}
              <g className={`transition-opacity duration-200 ${ringing ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}>
                <path d="M-6 -2 Q-22 18 -10 40 M-18 -12 Q-38 18 -22 50" className="ink f-none" />
                <path d="M146 -2 Q162 18 150 40 M158 -12 Q178 18 162 50" className="ink f-none" />
              </g>
              <ellipse cx="70" cy="110" rx="70" ry="7" className="ht-2" opacity="0.6" />
              <g className="rshake origin-[50%_90%] transition-transform duration-300 [transform-box:fill-box] group-hover:-rotate-2">
                <PhoneArt />
              </g>
              {ringing && (
                <text x="70" y="-24" textAnchor="middle" className="svg-pixel" fontSize="16" fill="#e3262f">
                  {contact.ringing}
                </text>
              )}
            </svg>
          </button>

          <div
            id="call-bubble"
            role="region"
            aria-label="Contact details"
            aria-live="polite"
            hidden={!answered}
            className="relative z-10 mt-4 w-[min(100%,30rem)] rounded-[2rem] border-[3px] border-ink bg-paper p-6 shadow-[0_20px_40px_-26px_rgb(20_20_20/0.55)] lg:absolute lg:-top-12 lg:left-0 lg:mt-0 lg:w-[21rem]"
          >
            <span
              aria-hidden="true"
              className="absolute -top-[15px] left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-t-[3px] border-l-[3px] border-ink bg-paper lg:top-auto lg:-right-[15px] lg:bottom-12 lg:left-auto lg:translate-x-0 lg:rotate-[135deg]"
            />
            <p className="font-serif text-2xl italic">{contact.bubbleLead}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a href={`mailto:${person.email}`} className="text-[1.15rem] font-bold break-all underline decoration-2 underline-offset-4 hover:decoration-red">
                {person.email}
              </a>
              <button type="button" data-sfx="none" onClick={copy} className="pill pill-yellow min-h-9 px-3 py-1.5 text-sm">
                {copied ? contact.copiedLabel : contact.copyLabel}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied" : ""}
              </span>
            </div>
            <ul className="mt-4 flex flex-wrap gap-2">
              {social.map((s) => (
                <li key={s.key}>
                  <a href={s.href} target="_blank" rel="noopener" className="pill pill-grey min-h-10 text-sm">
                    {s.label} <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
              {resumeHref && (
                <li>
                  <a href={resumeHref} target="_blank" rel="noopener" className="pill pill-dark min-h-10 text-sm">
                    Resume <span aria-hidden="true">↗</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <footer className="wrap flex flex-col gap-3 border-t-2 border-ink py-8 text-sm md:flex-row md:items-center md:justify-between">
        <p className="t-pixel">$ ./mysh --exit</p>
        <p className="text-muted">
          {contact.copyright} <span aria-hidden="true">✦</span> {person.location}
        </p>
        <a href="#top" className="font-bold underline decoration-2 underline-offset-4">
          back to top <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </section>
  );
}
