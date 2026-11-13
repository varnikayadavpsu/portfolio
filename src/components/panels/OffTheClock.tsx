import { offTheClock } from "@/content/site";
import { Panel } from "@/components/ui/Panel";

const tilts = ["-rotate-2", "rotate-1", "-rotate-1"];

export function OffTheClock() {
  return (
    <Panel id="off-the-clock" theme="wasabi" width="95cqw" headingId="off-the-clock-heading">
      <div className="flex flex-col px-8 pt-20 pb-16 sm:px-12 hz:h-full hz:justify-center hz:px-16 hz:py-16">
        <h2 id="off-the-clock-heading" data-reveal className="t-display t-panel">
          <span data-reveal-item className="block">{offTheClock.heading}</span>
        </h2>
        <div className="mt-10 grid gap-8 hz:mt-12 hz:grid-cols-3 hz:gap-10">
          {offTheClock.groups.map((group, g) => (
            <section
              key={group.label}
              data-tilt
              className={`hard-shadow border-[1.5px] border-plum bg-ice p-6 [--shadow:var(--color-plum)] hz:p-7 ${tilts[g % tilts.length]}`}
            >
              <h3 className="t-mono text-[0.78rem] uppercase">
                <span aria-hidden="true">{"// "}</span>
                {group.label}
              </h3>
              <ul className="mt-5 space-y-3" data-reveal>
                {group.items.map((item) => (
                  <li key={item.name} data-reveal-item className="border-b border-plum/30 pb-3 last:border-0 last:pb-0">
                    <p className="text-[1.125rem] leading-snug font-bold">{item.name}</p>
                    {item.note && <p className="t-mono mt-1 text-[0.75rem] opacity-80">{item.note}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Panel>
  );
}
