import { hackathonLog } from "@/content/site";
import { filled } from "@/content/types";
import { Panel } from "@/components/ui/Panel";

function Star() {
  // Persimmon star with a plum outline so it holds up on jade.
  return (
    <svg viewBox="0 0 24 24" className="inline-block size-[1.05em] -translate-y-[0.1em]" aria-hidden="true">
      <path
        d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z"
        fill="var(--color-persimmon)"
        stroke="var(--color-plum)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HackathonLog() {
  return (
    <Panel id="hackathon-log" theme="jade" width="52cqw">
      <div className="flex flex-col justify-center px-8 pt-20 pb-16 sm:px-12 hz:h-full hz:px-12 hz:py-16">
        <div className="t-mono text-[0.68rem] sm:text-[0.85rem] hz:text-[min(0.95rem,1.15cqw)]">
          <p aria-hidden="true" className="opacity-80">
            $ {hackathonLog.command}
          </p>
          <ol className="mt-5 space-y-3.5" aria-label="Hackathons" data-reveal>
            {hackathonLog.entries.map((entry) => {
              const date = filled(entry.date);
              return (
                <li key={entry.event} data-reveal-item className="flex items-baseline gap-2">
                  <span className="shrink-0">
                    {date && <span className="mr-2 opacity-75">[{date}]</span>}
                    {entry.event}
                  </span>
                  <span aria-hidden="true" className="min-w-3 flex-1 overflow-hidden whitespace-nowrap opacity-60">
                    {".".repeat(60)}
                  </span>
                  <span className="sr-only">: </span>
                  <span className="shrink-0 font-bold">{entry.project}</span>
                  {entry.award && (
                    <span className="shrink-0">
                      <Star />
                      <span className="sr-only">, won </span> {entry.award}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <p aria-hidden="true" className="mt-5">
            <span className="cursor-blink inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-plum" />
          </p>
        </div>
      </div>
    </Panel>
  );
}
