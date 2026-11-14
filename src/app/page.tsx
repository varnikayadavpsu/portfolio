import { featuredProjects, moreBuilds, person, skipLink, transitions } from "@/content/site";
import { publicFileExists, withBase } from "@/lib/assets";
import { InkDefs } from "@/components/ink/Defs";
import { Splash } from "@/components/shell/Splash";
import { TapeNav } from "@/components/shell/TapeNav";
import { Hero } from "@/components/hero/Hero";
import { AboutStory } from "@/components/sections/AboutStory";
import { Journey } from "@/components/journey/Journey";
import { Work } from "@/components/sections/Work";
import { PlumWipe } from "@/components/sections/PlumWipe";
import { Experience } from "@/components/sections/Experience";
import { OffTheClock } from "@/components/sections/OffTheClock";
import { Playground } from "@/components/sections/Playground";
import { Toolbox } from "@/components/sections/Toolbox";
import { Contact } from "@/components/sections/Contact";

/** Build-time: only link to files that actually exist in /public. */
const ifExists = (p: string) => (publicFileExists(p) ? withBase(p) : null);

export default function Page() {
  const resumeHref = ifExists(person.resumePath);
  const illustrationSrc = ifExists(person.illustrationPath);
  const faceSrc = ifExists(person.facePath);

  const images: Record<string, string> = {};
  for (const p of [...featuredProjects, ...moreBuilds]) {
    const src = p.image ? ifExists(p.image) : null;
    if (src) images[p.slug] = src;
  }

  return (
    <>
      <InkDefs />
      <Splash />
      <a
        href={`#${skipLink.target}`}
        className="fixed top-3 left-3 z-[70] -translate-y-[200%] rounded-full bg-ink px-4 py-2 font-bold text-paper focus:translate-y-0"
      >
        {skipLink.label}
      </a>
      <TapeNav resumeHref={resumeHref} faceSrc={faceSrc} />

      <main id="main">
        <Hero resumeHref={resumeHref} illustrationSrc={illustrationSrc} />
        <AboutStory />
        <Journey thumbs={images} />
        <Work images={images} />
        <PlumWipe word={transitions.experience} />
        <Experience />
        <PlumWipe word={transitions.offTheClock} />
        <OffTheClock />
        <Playground />
        <Toolbox />
        <Contact resumeHref={resumeHref} />
      </main>
    </>
  );
}
