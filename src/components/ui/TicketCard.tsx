import type { FeaturedProject } from "@/content/types";
import { filled } from "@/content/types";
import { TagList } from "./Tag";
import { Stamp } from "./Stamp";
import { projectLinks } from "./links";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A project as a ticket: the main section (name, one-liner, bullets, stack)
 * and a stub (event, award stamp, links) separated by a dashed perforation
 * with semicircle notches. Each half is masked with concave corners, so where
 * they meet the notches form; the wrapper's drop-shadow follows the shape.
 * Stub sits on the right when the card is ≥ 540px wide, below it otherwise.
 */
export function TicketCard({ project, index }: { project: FeaturedProject; index: number }) {
  const links = projectLinks(project.links);
  const role = filled(project.myRole);
  const titleId = `project-${project.slug}`;

  return (
    <article aria-labelledby={titleId} className="ticket w-full max-w-[640px] hz:w-[600px] hz:max-w-none">
      <div className="ticket-inner">
        <div className="ticket-piece concave flex-1 px-6 pt-5 pb-6">
          <p className="t-mono text-[0.7rem] opacity-75" aria-hidden="true">
            № {pad(index + 1)}
          </p>
          <h3 id={titleId} className="t-display mt-1 text-[2.6rem]">
            {project.name}
          </h3>
          <p className="mt-3 text-[0.98rem] leading-[1.4] font-medium">{project.oneLiner}</p>
          {role && (
            <p className="t-mono mt-3 text-[0.75rem]">
              <span className="font-bold">my role → </span>
              {role}
            </p>
          )}
          <ul className="mt-4 space-y-2 text-[0.875rem] leading-[1.45]">
            {project.bullets.map((bullet) => (
              <li key={bullet} className="relative pl-4">
                <span aria-hidden="true" className="absolute top-[0.55em] left-0 size-[6px] bg-plum" />
                {bullet}
              </li>
            ))}
          </ul>
          <TagList tags={project.stack} label={`${project.name} stack`} className="mt-5" />
        </div>

        <div className="ticket-piece ticket-stub concave px-5 py-5">
          <div className="ticket-stub-body flex h-full flex-row flex-wrap items-start justify-between gap-x-6 gap-y-4">
            <div className="min-w-[8rem] flex-1 space-y-2">
              <p className="t-mono text-[0.68rem] leading-snug uppercase opacity-75">event</p>
              <p className="t-mono text-[0.75rem] leading-snug">{project.event}</p>
              {project.eventMeta && <p className="t-mono text-[0.7rem] leading-snug">{project.eventMeta}</p>}
              {project.team && project.team.length > 0 && (
                <p className="t-mono text-[0.7rem] leading-snug">w/ {project.team.join(", ")}</p>
              )}
            </div>

            {project.award && (
              <div className="space-y-3">
                <Stamp text={project.award.stamp} />
                {project.award.details && (
                  <ul className="t-mono space-y-1.5 text-[0.66rem] leading-snug" aria-label="Prizes">
                    {project.award.details.map((prize) => (
                      <li key={prize}>★ {prize}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {links.length > 0 && (
              <ul className="t-mono flex flex-col gap-1.5 text-[0.8rem] uppercase sm:mt-auto" aria-label={`${project.name} links`}>
                {links.map((link) => (
                  <li key={link.key}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-[1.5px] underline-offset-[3px] hover:decoration-[3px] [--focus:var(--color-plum)]"
                    >
                      {link.label} <span aria-hidden="true">↗</span>
                      <span className="sr-only"> {project.name} (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
