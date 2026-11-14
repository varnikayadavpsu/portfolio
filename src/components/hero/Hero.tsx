import { hero, person, social } from "@/content/site";
import { DeskScene } from "./DeskScene";
import { Drift } from "./Drift";
import { Moth, Sparkle } from "@/components/ink/Art";

const stickers = [
  { Art: Moth, cls: "left-[1%] top-[3%] w-[11%] rotate-[-14deg]", depth: 14, sound: "flutter" },
  { Art: Sparkle, cls: "left-[44%] top-[1%] w-[6%] rotate-[8deg]", depth: -10, sound: "plink" },
  { Art: Moth, cls: "right-[0%] top-[33%] w-[8%] rotate-[18deg]", depth: -16, sound: "flutter" },
  { Art: Sparkle, cls: "left-[52%] bottom-[8%] w-[5%] rotate-[-6deg]", depth: 12, sound: "plink" },
];

/** Hero: A's typed "hello," + italic-serif name, B's hotspots, C's ink desk. */
export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col pt-[84px] md:pt-[100px]">
      <div className="wrap grid flex-1 items-center gap-6 pb-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-4">
        {/* ── left: text (A) ── */}
        <div className="relative z-10 max-w-[38rem]">
          <h1>
            <span className="sr-only">
              {hero.hello} {hero.intro} {person.name}
            </span>
            <span aria-hidden="true" className="block text-[clamp(4.25rem,10.5vw,9.75rem)] leading-[0.9] font-extrabold tracking-[-0.055em]">
              {Array.from(hero.hello).map((ch, i) => (
                <span key={i} className="type-ch" style={{ ["--i" as string]: i }}>
                  {ch}
                </span>
              ))}
              <span className="caret" />
            </span>
            <span
              aria-hidden="true"
              className="hero-rise mt-3 block text-[clamp(1.6rem,3vw,2.5rem)] leading-none font-extrabold tracking-[-0.03em]"
              style={{ ["--d" as string]: "0.85s" }}
            >
              {hero.intro}
            </span>
            <span
              aria-hidden="true"
              className="hero-rise block font-serif text-[clamp(4rem,9vw,8.25rem)] leading-[0.95] tracking-[-0.02em] text-lavender-ink italic"
              style={{ ["--d" as string]: "1s" }}
            >
              {hero.name}{" "}
              <span className="font-sans text-[0.42em] font-medium tracking-normal not-italic">{hero.kaomoji}</span>
            </span>
          </h1>

          <div className="hero-rise" style={{ ["--d" as string]: "1.2s" }}>
            <p className="mt-5 text-[clamp(1.25rem,2vw,1.6rem)] leading-tight font-bold tracking-[-0.02em]">
              <span className="hl">{hero.tagline}</span>
            </p>
            <p className="mt-3 max-w-[34rem] text-[1.02rem] text-muted">{hero.bio}</p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {social.map((s, i) => (
                <li key={s.key}>
                  <a href={s.href} className={`pill ${i === 0 ? "pill-cv" : "pill-grey"}`} target="_blank" rel="noopener" data-sfx="pop">
                    {s.key}
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── right: the ink desk (C) with hotspots (B) ── */}
        <div className="hero-rise relative" style={{ ["--d" as string]: "0.3s" }}>
          <Drift className="relative">
            <DeskScene />
            {stickers.map(({ Art, cls, depth, sound }, i) => (
              <span
                key={i}
                aria-hidden="true"
                data-sfx-hover={sound}
                className={`wiggle absolute ${cls} transition-transform duration-500 ease-out`}
                style={{
                  translate: `calc(var(--mx) * ${depth}px) calc(var(--my) * ${depth}px)`,
                }}
              >
                <Art className="h-auto w-full drop-shadow-[0_3px_0_rgb(20_20_20/0.12)]" />
              </span>
            ))}
          </Drift>
          <p className="mt-1 text-center font-serif text-[1.05rem] text-muted italic">{hero.hint} ↗</p>
        </div>
      </div>

      {/* A still label, not a ticker: points the way to the work. */}
      <a href="#work" data-sfx="whoosh" className="group wrap flex items-center gap-4 pb-6">
        <span aria-hidden="true" className="h-[2px] flex-1 bg-ink" />
        <span className="flex flex-col items-center">
          <span className="tape text-[0.95rem]" style={{ ["--r" as string]: "-2deg" }}>
            {hero.scrollCue}
          </span>
          <svg viewBox="0 0 24 32" className="bob mt-1 h-7 w-5" aria-hidden="true">
            <path d="M12 3 C11 12 13 18 12 27 M5 20 L12 28 L19 20" className="ink f-none" />
          </svg>
        </span>
        <span aria-hidden="true" className="h-[2px] flex-1 bg-ink" />
      </a>
    </section>
  );
}
