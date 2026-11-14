"use client";

import { useRef, useState } from "react";
import { featuredProjects, moreBuilds, work } from "@/content/site";
import { filled, type FeaturedProject, type ProjectLinks } from "@/content/types";
import { BIG_MOTION, gsap, type ScrollTrigger, useIsoLayoutEffect } from "@/lib/gsap";
import { ProjectArt } from "@/components/ink/ProjectArt";
import { Roll } from "@/components/ui/Roll";
import { TodoTag } from "@/components/ui/Todo";

const N = featuredProjects.length;
const pad = (n: number) => String(n).padStart(2, "0");

function Links({ links, name }: { links: ProjectLinks; name: string }) {
  const items = (["live", "code", "devpost"] as const)
    .map((k) => ({ k, href: filled(links[k]), raw: links[k] }))
    .filter((l) => l.raw !== undefined);
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {items.map(({ k, href, raw }) =>
        href ? (
          <li key={k}>
            <a
              href={href}
              target="_blank"
              rel="noopener"
              className="group inline-flex min-h-6 items-center gap-1 font-bold underline decoration-2 underline-offset-4 hover:decoration-red"
            >
              {k === "live" ? "Live" : k === "code" ? "Code" : "Devpost"}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
              <span className="sr-only">
                {name} (opens in a new tab)
              </span>
            </a>
          </li>
        ) : (
          <li key={k}>
            <TodoTag value={raw} />
          </li>
        ),
      )}
    </ul>
  );
}

function Shot({ p, src, className = "" }: { p: FeaturedProject; src?: string; className?: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`Screenshot of ${p.name}’s live site`}
      width={1280}
      height={800}
      loading="lazy"
      decoding="async"
      className={`block aspect-[16/10] w-full object-cover object-top ${className}`}
    />
  ) : (
    <ProjectArt kind="nod" className={`block aspect-[16/10] h-auto w-full ${className}`} />
  );
}

function Meta({ p }: { p: FeaturedProject }) {
  return (
    <>
      <p className="t-pixel text-sm text-muted">event</p>
      <p className="mt-1 leading-snug font-semibold">{p.event}</p>
      {p.eventMeta && <p className="text-sm text-muted">{p.eventMeta}</p>}
      {p.awards && (
        <ul className="mt-3 flex flex-col items-start gap-2">
          {p.awards.map((a, i) => (
            <li key={a} className="tape text-[0.8rem] whitespace-normal" style={{ ["--r" as string]: i % 2 ? "1deg" : "-1.5deg" }}>
              ★ {a}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-[0.98rem] leading-snug">{p.oneLiner}</p>
      <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">{p.stack.join(" ✦ ")}</p>
      {p.team && <p className="mt-2 text-[0.85rem] text-muted">w/ {p.team.join(", ")}</p>}
      <div className="mt-4">
        <Links links={p.links} name={p.name} />
      </div>
    </>
  );
}

function StatBadge({ p, big = false }: { p: FeaturedProject; big?: boolean }) {
  return (
    <div className={`rounded-xl border-2 border-ink bg-paper px-4 py-3 shadow-[0_14px_30px_-18px_rgb(20_20_20/0.6)] ${big ? "" : ""}`}>
      <p className={`leading-none font-extrabold tracking-[-0.045em] ${big ? "text-[clamp(2.8rem,4.6vw,4.6rem)]" : "text-[2.75rem]"}`}>
        <span className="hl">{p.stat.value}</span>
      </p>
      <p className="mt-1.5 max-w-[16rem] text-sm leading-tight">{p.stat.caption}</p>
      {p.stat2 && (
        <p className="mt-2 border-t-2 border-dashed border-ink/25 pt-2 text-sm leading-tight text-muted">
          <strong className="text-base text-ink">{p.stat2.value}</strong> {p.stat2.caption}
        </p>
      )}
    </div>
  );
}

/**
 * Work (D + B): a 3D diagonal stack of tilted project cards that fans as you
 * scroll, the active name bold in a list, a giant red rolling counter, and
 * each card's headline number big. Simple stacked list on small screens.
 */
export function Work({ images }: { images: Record<string, string> }) {
  const root = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(BIG_MOTION, () => {
      const stage = el.querySelector<HTMLElement>("[data-stage]")!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", el);
      const render = (v: number) => {
        cards.forEach((c, i) => {
          const k = i - v;
          let x: number, y: number, z: number, o: number;
          if (k >= 0) {
            x = k * 74;
            y = -k * 62;
            z = -k * 200;
            o = k > 3.4 ? 0 : 1 - Math.max(0, k - 2.4);
          } else {
            x = k * 150;
            y = -k * 170;
            z = -k * 260;
            o = Math.max(0, 1 + k * 1.7);
          }
          c.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(12deg) rotateY(-24deg) rotateZ(3deg)`;
          c.style.opacity = String(o);
          c.style.zIndex = String(100 - Math.round(Math.abs(k) * 10));
          c.style.visibility = o < 0.01 ? "hidden" : "visible";
          const badge = c.querySelector<HTMLElement>("[data-badge]");
          if (badge) badge.style.opacity = String(Math.max(0, 1 - Math.abs(k) * 2.2));
        });
      };
      /* Dwell on each project for most of its scroll, then move quickly to the next. */
      const dwell = (v: number) => {
        const i = Math.floor(v);
        const t = Math.min(1, Math.max(0, (v - i - 0.32) / 0.36));
        return i + t * t * (3 - 2 * t);
      };
      const proxy = { v: 0 };
      render(0);
      let last = 0;
      const tween = gsap.to(proxy, {
        v: N - 1,
        ease: "none",
        onUpdate: () => {
          const v = dwell(proxy.v);
          render(v);
          const a = Math.round(v);
          if (a !== last) {
            last = a;
            setActive(a);
          }
        },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${(N - 1) * window.innerHeight * 0.75}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
      stRef.current = tween.scrollTrigger ?? null;
      return () => {
        stRef.current = null;
      };
    });
    return () => mm.revert();
  }, []);

  const goTo = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    window.scrollTo({ top: st.start + (i / (N - 1)) * (st.end - st.start) + 2, behavior: "smooth" });
  };

  return (
    <section ref={root} id="work" aria-labelledby="work-h" className="relative pt-24 md:pt-32">
      <div className="wrap">
        <p className="kicker">{work.kicker}</p>
        <h2 id="work-h" className="t-h2 mt-2 max-w-[16ch]">
          {work.headingLead}
          <span className="hl">{work.headingMark}</span>
          {work.headingTail}
        </h2>
      </div>

      {/* ── desktop: pinned 3D stack ── */}
      <div data-stage className="relative hidden h-svh motion-lg:block">
        <div className="wrap grid h-full grid-cols-[16.5rem_minmax(0,1fr)_14rem] gap-10 pt-[92px] pb-8 xl:grid-cols-[18rem_minmax(0,1fr)_15rem]">
          {/* left: meta + counter */}
          <div className="relative flex min-h-0 flex-col">
            <div className="relative min-h-0 flex-1">
              {featuredProjects.map((p, i) => (
                <article
                  key={p.slug}
                  inert={i !== active}
                  aria-hidden={i !== active}
                  className={`absolute inset-x-0 top-0 transition-[opacity,translate] duration-500 ${
                    i === active ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                  }`}
                >
                  <h3 className="sr-only">{p.name}</h3>
                  <Meta p={p} />
                </article>
              ))}
            </div>
            <p className="font-splash text-[clamp(7rem,13vw,12rem)] leading-[0.8] tracking-[-0.04em] text-red">
              <Roll value={pad(active + 1)} />
              <span className="sr-only">
                Project {active + 1} of {N}
              </span>
              <span className="ml-2 align-top font-sans text-lg font-bold tracking-normal text-ink">/{pad(N)}</span>
            </p>
          </div>

          {/* centre: the stack */}
          <div className="stack-stage relative min-h-0">
            <div className="absolute inset-0 [transform-style:preserve-3d]">
              {featuredProjects.map((p) => (
                <div
                  key={p.slug}
                  data-stack-card
                  className="stack-card h-fit w-[min(100%,36rem)] translate-x-[-6%] translate-y-[6%]"
                  aria-hidden="true"
                >
                  <div className="overflow-hidden rounded-xl border-[2.5px] border-ink bg-paper p-2 shadow-[0_30px_60px_-30px_rgb(20_20_20/0.55)]">
                    <div className="overflow-hidden rounded-md border-2 border-ink">
                      <Shot p={p} src={images[p.slug]} />
                    </div>
                  </div>
                  <div data-badge className="absolute -bottom-10 -left-8 [transform:translateZ(40px)]">
                    <StatBadge p={p} big />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* right: the list */}
          <ol className="self-center">
            {featuredProjects.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === active ? "true" : undefined}
                  className={`flex w-full items-baseline gap-3 py-1.5 text-left text-[1.35rem] leading-tight font-bold tracking-[-0.02em] transition-colors ${
                    i === active ? "text-ink" : "text-fade hover:text-ink"
                  }`}
                >
                  <span className="t-pixel w-6 text-[0.8rem] font-medium text-muted">{pad(i + 1)}</span>
                  <span>{p.name}</span>
                  {i === active && <span aria-hidden="true" className="text-red">✦</span>}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ── small screens / reduced motion: a plain list ── */}
      <ol className="wrap mt-12 space-y-20 motion-lg:hidden">
        {featuredProjects.map((p, i) => (
          <li key={p.slug}>
            <article className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start md:gap-10">
              <div className="relative">
                <p className="font-splash text-[5.5rem] leading-[0.8] text-red" aria-hidden="true">
                  {pad(i + 1)}
                </p>
                <div
                  className="mt-3 overflow-hidden rounded-xl border-[2.5px] border-ink bg-paper p-1.5"
                  style={{ rotate: i % 2 ? "1.5deg" : "-1.5deg" }}
                >
                  <div className="overflow-hidden rounded-md border-2 border-ink">
                    <Shot p={p} src={images[p.slug]} />
                  </div>
                </div>
                <div className="relative z-10 -mt-8 ml-3 w-fit max-w-[90%]">
                  <StatBadge p={p} />
                </div>
              </div>
              <div>
                <h3 className="text-[2rem] leading-none font-extrabold tracking-[-0.03em]">{p.name}</h3>
                <div className="mt-4">
                  <Meta p={p} />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ol>

      {/* ── More builds (B): tilted thumbnails ── */}
      <div className="wrap pt-24 pb-10 motion-lg:pt-16">
        <h3 className="text-[1.75rem] font-extrabold tracking-[-0.03em]">
          {work.moreHeading} <span className="text-red">✦</span>
        </h3>
        <ul className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
          {moreBuilds.map((m, i) => (
            <li
              key={m.slug}
              className="transition-transform duration-300 hover:rotate-0"
              style={{ rotate: ["-2.5deg", "2deg", "-1.5deg"][i % 3] }}
            >
              <div className="overflow-hidden rounded-xl border-[2.5px] border-ink bg-paper p-1.5">
                <div className="overflow-hidden rounded-md border-2 border-ink">
                  {m.image && images[m.slug] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={images[m.slug]}
                      alt={`Screenshot of ${m.name}’s live site`}
                      width={1280}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="block aspect-[16/10] w-full object-cover object-top"
                    />
                  ) : (
                    <ProjectArt kind={m.art ?? "terminal"} className="block aspect-[16/10] h-auto w-full" />
                  )}
                </div>
              </div>
              <h4 className="mt-4 text-xl font-extrabold tracking-[-0.02em]">{m.name}</h4>
              <p className="t-pixel text-sm text-muted">{m.context}</p>
              <p className="mt-2 text-[0.95rem] leading-snug">{m.description}</p>
              <p className="mt-2 text-[0.82rem] text-muted">{m.stack.join(" ✦ ")}</p>
              <div className="mt-3">
                <Links links={m.links} name={m.name} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
