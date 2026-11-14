import { experience, featuredProjects, journey, moreBuilds, offTheClock, person, skipLink, transitions } from "@/content/site";
import { publicFileExists, withBase } from "@/lib/assets";
import { InkDefs } from "@/components/ink/Defs";
import { Splash } from "@/components/shell/Splash";
import { TapeNav } from "@/components/shell/TapeNav";
import { SoundLayer } from "@/components/shell/Sound";
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
  const faceSrc = ifExists(person.facePath);

  const images: Record<string, string> = {};
  for (const p of [...featuredProjects, ...moreBuilds]) {
    const src = p.image ? ifExists(p.image) : null;
    if (src) images[p.slug] = src;
  }

  // Corner facts on the plum transitions, counted from the content.
  const hackathons = journey.stops.filter((s) => s.id !== "home").length;
  const expMeta = `${experience.roles.length} roles ✦ ${experience.leadership.length} clubs ✦ ${hackathons} hackathons`;
  const [langs, hobbies] = offTheClock.columns;
  const otcMeta = `${langs.items.length} languages ✦ ${hobbies.items.length} hobbies ✦ class of 2028`;

  return (
    <>
      <InkDefs />
      <SoundLayer />
      <Splash />
      <a
        href={`#${skipLink.target}`}
        className="fixed top-3 left-3 z-[70] -translate-y-[200%] rounded-full bg-ink px-4 py-2 font-bold text-paper focus:translate-y-0"
      >
        {skipLink.label}
      </a>
      <TapeNav faceSrc={faceSrc} />

      <main id="main">
        <Hero />
        <AboutStory />
        <Journey thumbs={images} />
        <Work images={images} />
        <PlumWipe {...transitions.experience} meta={expMeta} />
        <Experience />
        <PlumWipe {...transitions.offTheClock} meta={otcMeta} />
        <OffTheClock />
        <Playground />
        <Toolbox />
        <Contact resumeHref={resumeHref} />
      </main>
    </>
  );
}
