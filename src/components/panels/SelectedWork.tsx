import { featuredProjects, moreBuilds, work } from "@/content/site";
import { filled } from "@/content/types";
import { Panel } from "@/components/ui/Panel";
import { TicketCard } from "@/components/ui/TicketCard";
import { projectLinks } from "@/components/ui/links";

export function SelectedWork() {
  return (
    <Panel id="work" theme="plum" width="auto" headingId="work-heading">
      <div className="flex flex-col gap-14 px-8 pt-20 pb-16 sm:px-12 hz:h-full hz:flex-row hz:items-center hz:gap-14 hz:px-16 hz:py-16">
        {/* Intro */}
        <div data-reveal className="hz:w-[min(30cqw,30rem)] hz:shrink-0">
          <h2 id="work-heading" data-reveal-item className="t-display t-panel text-wasabi">
            {work.heading}
          </h2>
          <p data-reveal-item className="t-mono mt-5 max-w-[26rem]">
            {work.meta}
          </p>
          <p data-reveal-item aria-hidden="true" className="t-display mt-8 hidden text-[4rem] text-wasabi hz:block">
            →
          </p>
        </div>

        {/* Ticket cards */}
        <ul className="grid gap-10 [grid-template-columns:repeat(auto-fill,minmax(min(100%,34rem),1fr))] hz:flex hz:items-stretch hz:gap-12">
          {featuredProjects.map((project, index) => (
            <li key={project.slug} data-tilt className="flex justify-center hz:justify-start">
              <TicketCard project={project} index={index} />
            </li>
          ))}
        </ul>

        {/* More builds */}
        <section aria-labelledby="more-builds" className="hz:w-[26rem] hz:shrink-0">
          <h3 id="more-builds" className="t-display text-[2.25rem] text-wasabi">
            {work.moreHeading}
          </h3>
          <ul className="mt-5 divide-y-[1.5px] divide-ice/40 border-y-[1.5px] border-ice/40">
            {moreBuilds.map((build) => {
              const links = projectLinks(build.links);
              const role = filled(build.myRole);
              return (
                <li key={build.slug} className="py-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h4 className="t-display text-[1.65rem]">{build.name}</h4>
                    <p className="t-mono text-[0.7rem] text-wasabi">{build.context}</p>
                  </div>
                  <p className="mt-1.5 text-[0.875rem] leading-[1.45]">{build.description}</p>
                  {role && <p className="mt-1.5 text-[0.875rem] leading-[1.45]">{role}</p>}
                  <p className="t-mono mt-2 text-[0.7rem] opacity-85">{build.stack.join(" · ")}</p>
                  {links.length > 0 && (
                    <ul className="t-mono mt-2 flex gap-4 text-[0.75rem] uppercase" aria-label={`${build.name} links`}>
                      {links.map((link) => (
                        <li key={link.key}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-wasabi underline decoration-[1.5px] underline-offset-[3px]"
                          >
                            {link.label} <span aria-hidden="true">↗</span>
                            <span className="sr-only"> {build.name} (opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </Panel>
  );
}
