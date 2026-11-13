import { goodFit, sections } from "@/content/site";
import { Panel } from "@/components/ui/Panel";
import { Frame } from "@/components/ui/Frame";

/** Ice panel inside a plum frame band: the plum shows around a concave ice "print". */
export function GoodFit() {
  return (
    <Panel id="good-fit" theme="plum" width="100cqw" headingId="good-fit-heading" frame={false} className="p-[var(--frame-inset)]">
      <div className="theme-ice concave relative h-full">
        <Frame label={sections["good-fit"].label} inset={16} />
        <div className="grid gap-12 px-7 pt-16 pb-14 hz:h-full hz:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] hz:items-center hz:gap-16 hz:px-16 hz:py-16">
          <div data-reveal>
            <h2 id="good-fit-heading" data-reveal-item className="t-display t-panel">
              {goodFit.heading}
            </h2>
            <ul aria-hidden="true" className="mt-8 space-y-1">
              {goodFit.roles.map((role, i) => (
                <li
                  key={role}
                  data-reveal-item
                  data-parallax={i % 2 ? "-0.09" : "0.09"}
                  className="t-display text-[clamp(2.75rem,7.5vw,7rem)] text-transparent [-webkit-text-stroke:1.5px_var(--color-plum)]"
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="max-w-[34rem]">
            {goodFit.body.map((paragraph) => (
              <p key={paragraph} data-reveal-item className="t-body mt-5 first:mt-0">
                {paragraph}
              </p>
            ))}
            <a
              href={`#${goodFit.cta.target}`}
              data-reveal-item
              className="cta-bar hard-shadow mt-10 block bg-plum p-6 text-wasabi [--focus:var(--color-plum)] [--shadow:var(--color-wasabi)]"
            >
              <span className="t-display block text-[clamp(2.5rem,4vw,3.75rem)]">{goodFit.cta.lead}</span>
              <span className="t-mono mt-3 flex items-center gap-2 uppercase">
                {goodFit.cta.action}
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
