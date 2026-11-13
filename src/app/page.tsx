import { Suspense, type ReactNode } from "react";
import { filled } from "@/content/types";
import { person, photos, skipLink } from "@/content/site";
import { publicFileExists } from "@/lib/assets";
import { HorizontalTrack } from "@/components/shell/HorizontalTrack";
import { ProgressHUD } from "@/components/shell/ProgressHUD";
import { SiteChrome } from "@/components/shell/SiteChrome";
import { Hero } from "@/components/panels/Hero";
import { WhatIDo } from "@/components/panels/WhatIDo";
import { HowIBuild } from "@/components/panels/HowIBuild";
import { SelectedWork } from "@/components/panels/SelectedWork";
import { HackathonLog } from "@/components/panels/HackathonLog";
import { About } from "@/components/panels/About";
import { Experience } from "@/components/panels/Experience";
import { OffTheClock } from "@/components/panels/OffTheClock";
import { GoodFit } from "@/components/panels/GoodFit";
import { Toolbox } from "@/components/panels/Toolbox";
import { Contact } from "@/components/panels/Contact";
import { Footer } from "@/components/panels/Footer";

/** Each panel hydrates as its own unit, so startup work is split into short tasks. */
const Island = ({ children }: { children: ReactNode }) => <Suspense fallback={null}>{children}</Suspense>;

export default function Page() {
  // Build-time checks: anything missing falls back gracefully.
  const hasPortrait = publicFileExists(photos.portrait.src);
  const hasAboutPhoto = publicFileExists(photos.about.src);
  const hasResume = publicFileExists(person.resumePath);

  const portraitSrc = hasPortrait ? photos.portrait.src : null;
  const aboutPhoto = hasAboutPhoto
    ? {
        src: photos.about.src,
        alt: filled(photos.about.alt) ?? person.name,
        objectPosition: photos.about.objectPosition,
        placeholderPath: photos.about.src,
      }
    : {
        // No candid shot yet: reuse the portrait with a different crop.
        src: portraitSrc,
        alt: filled(photos.portrait.alt) ?? person.name,
        objectPosition: photos.aboutFallbackPosition,
        placeholderPath: photos.about.src,
      };

  return (
    <>
      <a
        href={`#${skipLink.target}`}
        className="t-mono fixed top-3 left-3 z-[60] -translate-y-[200%] bg-wasabi px-4 py-2 text-plum uppercase [--focus:var(--color-plum)] focus:translate-y-0"
      >
        {skipLink.label}
      </a>

      <SiteChrome />

      <HorizontalTrack>
        <main id="main" className="track-main">
          <Island>
            <Hero />
          </Island>
          <Island>
            <WhatIDo />
          </Island>
          <Island>
            <HowIBuild />
          </Island>
          <Island>
            <SelectedWork />
          </Island>
          <Island>
            <HackathonLog />
          </Island>
          <Island>
            <About photo={aboutPhoto} />
          </Island>
          <Island>
            <Experience />
          </Island>
          <Island>
            <OffTheClock />
          </Island>
          <Island>
            <GoodFit />
          </Island>
          <Island>
            <Toolbox />
          </Island>
          <Island>
            <Contact hasResume={hasResume} />
          </Island>
        </main>
        <Island>
            <Footer />
          </Island>
      </HorizontalTrack>

      <ProgressHUD />
    </>
  );
}
