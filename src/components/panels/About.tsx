import { about } from "@/content/site";
import { Panel } from "@/components/ui/Panel";
import { FramedPhoto } from "@/components/ui/FramedPhoto";

type AboutProps = {
  photo: { src: string | null; alt: string; objectPosition: string; placeholderPath: string };
};

export function About({ photo }: AboutProps) {
  return (
    <Panel id="about" theme="plum" width="80cqw" headingId="about-heading">
      <div className="relative flex flex-col px-8 pt-14 pb-16 sm:px-12 hz:block hz:h-full hz:p-0">
        <div className="relative aspect-[4/5] max-h-[78svh] w-full hz:absolute hz:top-12 hz:bottom-12 hz:left-12 hz:aspect-auto hz:max-h-none hz:w-[56%]">
          <FramedPhoto
            src={photo.src}
            alt={photo.alt}
            objectPosition={photo.objectPosition}
            sizes="(min-width: 900px) 46vw, 100vw"
            placeholderPath={photo.placeholderPath}
            placeholderTone="wasabi"
            className="h-full w-full"
            wrapperProps={{ "data-wipe": "" }}
          />
          {photo.src && (
            <p
              data-stamp
              className="t-mono absolute -top-3 left-4 z-10 -rotate-6 bg-persimmon px-3 py-1.5 text-[0.78rem] text-plum uppercase shadow-[4px_4px_0_var(--color-wasabi)] hz:top-6 hz:left-6"
            >
              <span aria-hidden="true">↳ </span>
              {about.photoTag}
            </p>
          )}
        </div>

        <div className="relative z-10 mx-3 -mt-20 hz:absolute hz:top-1/2 hz:left-[calc(3rem+56%-6rem)] hz:m-0 hz:w-[min(29rem,calc(44%-1rem))] hz:-translate-y-1/2">
          <div data-reveal className="hard-shadow border-[1.5px] border-ice bg-plum p-7 [--shadow:var(--color-wasabi)] hz:p-8">
            <h2 id="about-heading" data-reveal-item className="t-display t-panel text-persimmon">
              {about.heading}
            </h2>
            {about.body.map((paragraph) => (
              <p key={paragraph} data-reveal-item className="mt-5 text-[1rem] leading-[1.55] text-ice">
                {paragraph}
              </p>
            ))}
          </div>
          <p className="t-mono mt-6 inline-block bg-plum py-1.5 pr-3 text-[0.8rem] text-ice hz:ml-24 hz:pl-3">{about.footnote}</p>
        </div>
      </div>
    </Panel>
  );
}
