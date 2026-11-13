import type { CSSProperties } from "react";
import { hero, person } from "@/content/site";
import { Panel } from "@/components/ui/Panel";
import { SpinBadge } from "@/components/ui/SpinBadge";

/**
 * Panel 1: the name is the masthead.
 * Horizontal layout: lockup + spinning sticker on top, tagline + bio card in
 * the middle, VARNIKA YADAV across the full width at the bottom.
 * Stacked layout: the name sits right under the lockup, in two lines.
 */
export function Hero() {
  // Split a trailing arrow off the hint so it can nudge on its own.
  const hint = hero.hint.endsWith("→")
    ? { text: hero.hint.slice(0, -1), arrow: "→" }
    : { text: hero.hint, arrow: "" };
  const words = person.name.split(" ");

  return (
    <Panel id="top" theme="ice" width="100cqw" headingId="hero-heading">
      <div className="relative flex flex-col px-8 pt-12 pb-14 hz:h-full hz:px-14 hz:pt-11 hz:pb-9">
        {/* lockup + sticker */}
        <div className="flex items-start justify-between gap-4">
          <p className="t-mono intro-fade max-w-[24rem] pt-2 uppercase">{hero.lockup}</p>
          <SpinBadge
            label={hero.badge}
            href={`#${hero.cta.target}`}
            className="intro-pop -mt-3 -mr-3 size-[6.25rem] shrink-0 hz:-mt-4 hz:-mr-6 hz:size-[8.5rem]"
          />
        </div>

        {/* the name */}
        <h1 id="hero-heading" className="t-display hero-name mt-5 hz:order-last hz:mt-0">
          <span className="sr-only">{person.name}</span>
          <span aria-hidden="true" data-skew className="flex flex-col hz:flex-row hz:gap-[0.2em] hz:whitespace-nowrap">
            {words.map((word, i) => (
              <span key={word} className="intro-mask -mb-[0.06em] block overflow-hidden pb-[0.06em]">
                <span className="intro-rise block" style={{ "--i": i } as CSSProperties}>
                  {word}
                </span>
              </span>
            ))}
          </span>
        </h1>

        {/* tagline + bio card */}
        <div className="mt-10 grid gap-10 hz:my-auto hz:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] hz:items-end hz:gap-16">
          <div>
            <p className="t-display hero-tagline">
              {hero.headline.map((line, i) => (
                <span key={line} className="intro-mask -mb-[0.1em] block overflow-hidden pb-[0.1em]">
                  <span className="intro-rise block whitespace-nowrap" style={{ "--i": i + 2 } as CSSProperties}>
                    {line}
                    {i < hero.headline.length - 1 ? " " : null}
                  </span>
                </span>
              ))}
            </p>
            <p
              className="t-mono intro-fade mt-8 hidden hz:block"
              aria-hidden="true"
              style={{ "--d": "1000ms" } as CSSProperties}
            >
              {hint.text}
              {hint.arrow && <span className="nudge">{hint.arrow}</span>}
            </p>
          </div>

          <div className="hard-shadow intro-slide relative z-10">
            <p className="theme-wasabi px-6 pt-6 pb-7 text-[1.0625rem] leading-[1.5] font-medium">{hero.card}</p>
            <a
              href={`#${hero.cta.target}`}
              className="cta-bar t-mono flex items-center justify-between gap-4 bg-plum px-6 py-4 text-wasabi uppercase [--focus:var(--color-plum)]"
            >
              <span>{hero.cta.lead}</span>
              <span className="flex items-center gap-2 whitespace-nowrap">
                {hero.cta.action}
                <span className="btn-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </Panel>
  );
}
