import { toolbox, whatIDo } from "@/content/site";
import { Marquee } from "@/components/ui/Marquee";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Globe } from "@/components/illustrations/Globe";

// The ticker reuses the Toolbox tags (short ones only).
const tickerItems = Array.from(new Set(toolbox.flatMap((c) => c.tags))).filter((t) => t.length <= 14);

export function WhatIDo() {
  return (
    <Panel id="what-i-do" theme="wasabi" width="100cqw" headingId="what-i-do-heading">
      <div className="grid gap-12 px-8 pt-20 pb-12 hz:h-full hz:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] hz:items-center hz:gap-16 hz:px-16 hz:pt-16 hz:pb-32">
        <div data-reveal className="max-w-[40rem]">
          <h2 id="what-i-do-heading" data-reveal-item className="t-display t-panel">
            {whatIDo.heading}
          </h2>
          {whatIDo.body.map((paragraph) => (
            <p key={paragraph} data-reveal-item className="t-body mt-6">
              {paragraph}
            </p>
          ))}
          <div data-reveal-item className="mt-9">
            <Button href={`#${whatIDo.button.target}`}>{whatIDo.button.label}</Button>
          </div>
        </div>
        <div data-parallax="0.07" className="mx-auto w-full max-w-[min(34rem,64vh)]">
          <Globe className="w-full" />
        </div>
      </div>
      <Marquee
        items={tickerItems}
        className="mx-[var(--frame-inset)] mb-10 hz:absolute hz:right-[var(--frame-inset)] hz:bottom-[calc(var(--frame-inset)+20px)] hz:left-[var(--frame-inset)] hz:m-0"
      />
    </Panel>
  );
}
