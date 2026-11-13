import { experience } from "@/content/site";
import type { TimelineEntry } from "@/content/types";
import { Panel } from "@/components/ui/Panel";
import { Candlestick } from "@/components/illustrations/Candlestick";

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative mt-6 space-y-7 hz:space-y-6 border-l-2 border-plum pl-7">
      {entries.map((entry) => (
        <li key={`${entry.role}-${entry.org}`} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-[0.3rem] -left-[calc(1.75rem+8px)] size-[14px] rounded-full border-[1.5px] border-plum bg-wasabi"
          />
          <h4 className="text-[1.0625rem] leading-snug font-bold">{entry.role}</h4>
          <p className="mt-0.5 font-medium">{entry.org}</p>
          <p className="t-mono mt-1 text-[0.78rem]">
            {[entry.dates, entry.location].filter(Boolean).join(" · ")}
          </p>
          {entry.description && <p className="mt-2 max-w-[56ch] text-[0.95rem] leading-[1.5]">{entry.description}</p>}
        </li>
      ))}
    </ol>
  );
}

export function Experience() {
  const { education } = experience;
  return (
    <Panel id="experience" theme="ice" width="125cqw">
      <div className="grid gap-14 px-8 pt-20 pb-16 hz:h-full hz:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.8fr)] hz:gap-16 hz:px-16 hz:pt-24 hz:pb-14">
        <div data-reveal>
          <h3 data-reveal-item className="t-display text-[2.25rem]">
            {experience.experienceHeading}
          </h3>
          <div data-reveal-item>
            <Timeline entries={experience.experience} />
          </div>
        </div>

        <div className="flex flex-col gap-12" data-reveal>
          <div>
            <h3 data-reveal-item className="t-display text-[2.25rem]">
              {experience.leadershipHeading}
            </h3>
            <div data-reveal-item>
              <Timeline entries={experience.leadership} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10" data-reveal>
          <div data-reveal-item className="hard-shadow border-[1.5px] border-plum bg-wasabi p-6 [--shadow:var(--color-plum)]">
            <p className="t-mono text-[0.75rem] uppercase">education</p>
            <p className="mt-2 font-bold">{education.school}</p>
            <p className="mt-0.5">
              {education.degree}, {education.expected}
            </p>
            <p className="t-mono mt-3 text-[0.75rem] leading-relaxed">
              <span className="sr-only">Coursework: </span>
              {education.coursework.join(" · ")}
            </p>
          </div>
          <div data-parallax="0.06" className="mx-auto w-full max-w-[24rem]">
            <Candlestick className="w-full" />
          </div>
        </div>
      </div>
    </Panel>
  );
}
