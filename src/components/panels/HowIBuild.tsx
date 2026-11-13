import { howIBuild } from "@/content/site";
import { Panel } from "@/components/ui/Panel";
import { PipeNetwork } from "@/components/illustrations/PipeNetwork";

export function HowIBuild() {
  return (
    <Panel id="how-i-build" theme="ice" width="130cqw">
      <div className="relative flex flex-col px-8 pt-20 pb-10 hz:h-full hz:justify-center hz:px-16 hz:pt-20 hz:pb-[calc(clamp(150px,26vh,270px)+3rem)]">
        <ol className="grid gap-14 hz:grid-cols-3 hz:gap-16">
          {howIBuild.map((step) => (
            <li key={step.step} data-reveal>
              <p data-reveal-item className="t-mono">
                {step.step} ·
              </p>
              <h3 data-reveal-item className="t-display t-panel mt-3">
                {step.heading}
              </h3>
              <p data-reveal-item className="t-body mt-5">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
      <PipeNetwork className="mx-[var(--frame-inset)] mt-4 mb-10 h-[clamp(150px,26vh,270px)] w-[calc(100%-2*var(--frame-inset))] hz:absolute hz:right-[var(--frame-inset)] hz:bottom-[calc(var(--frame-inset)+18px)] hz:left-[var(--frame-inset)] hz:m-0 hz:w-auto" />
    </Panel>
  );
}
