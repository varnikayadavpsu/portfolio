import { toolbox } from "@/content/site";
import { Panel } from "@/components/ui/Panel";
import { TagList } from "@/components/ui/Tag";
import { PoseSkeleton } from "@/components/illustrations/PoseSkeleton";

const pad = (n: number) => String(n).padStart(2, "0");

export function Toolbox() {
  return (
    <Panel id="toolbox" theme="wasabi" width="130cqw">
      <div className="flex flex-col gap-14 px-8 pt-20 pb-16 hz:h-full hz:flex-row hz:items-center hz:gap-12 hz:px-16 hz:py-16">
        <div data-parallax="0.06" className="mx-auto w-[min(17rem,70vw)] hz:mx-0 hz:w-[min(22cqw,58vh)] hz:shrink-0">
          <PoseSkeleton className="w-full" />
        </div>
        <ol className="grid gap-12 sm:grid-cols-2 hz:flex hz:flex-1 hz:gap-0 hz:self-stretch hz:py-6">
          {toolbox.map((capability, index) => (
            <li
              key={capability.heading}
              data-reveal
              className="hz:flex hz:flex-1 hz:flex-col hz:justify-start hz:border-l-[1.5px] hz:border-plum hz:px-6 hz:pt-[18vh]"
            >
              <p data-reveal-item className="t-mono">
                {pad(index + 1)}
              </p>
              <h3 data-reveal-item className="t-display mt-3 text-[clamp(2.25rem,2.7vw,2.9rem)]">
                {capability.heading}
              </h3>
              <div data-reveal-item>
                <TagList tags={capability.tags} label={capability.heading} className="mt-5" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
}
