# Varnika Yadav · portfolio (redesign 2026)

A one-page portfolio drawn like a comic: paper, black ink line art with halftone dots, and colour only on the things you can click. Built from four references (see "Where each part comes from").

**Stack:** Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · `next/font` · `next/og`. No component library: everything, including the illustrations, is hand-built inline SVG.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site → out/
npm start          # preview out/ locally (npx serve, gzip on)
npm run todos      # list content you still need to fill in
npm run capture    # re-screenshot each project's live site into public/projects/
node scripts/screenshots.mjs http://localhost:3000 screenshots   # every section at 1440 + 390 px
```

Heads-up: with this repo's Turbopack CSS rule, edits to `src/app/globals.css` don't hot-reload. Restart `npm run dev` after changing it. Content and component edits reload normally.

## Edit the content: `src/content/site.ts`

Every string, link, project, stat and hackathon stop lives in **`src/content/site.ts`**. Components only read from it.

- **Missing info is `todo("…")`.** A TODO never renders in a production build; on `npm run dev` a dashed red "TODO" tag shows where it goes. `npm run todos` lists them.
- **Big numbers** under Experience (projects, hackathons, prizes) are counted from the data, so they stay true when you add a project or a stop.
- **Journey stops** (`journey.stops`) are in route order. `place` picks the pin; new cities need a projected position in `src/components/journey/usMap.ts`.

## Files to drop into `/public`

| File | What it does |
| --- | --- |
| `public/images/varnika-polaroid.jpg` | The photo on the hero desk (a smaller copy of the old site's portrait). Replace it to change the photo. |
| `public/face.png` | Optional: an ink drawing of your face for the nav button. A doodle is used until then. |
| `public/playlist/01.jpg …` | Album covers for the "jam with me" ring; list them in `playground.jam.covers`. Placeholder ink covers show until then. |

There's no résumé link on the site right now, by choice.

Each is checked at build time, so just add the file and rebuild.

## Design system

Tokens are CSS variables in the `@theme` block of `src/app/globals.css` (`src/styles/tokens.ts` mirrors the colours for the OG image and favicon).

- Paper `#F5F2EB`, ink `#141414`, accent red `#E3262F`, highlighter yellow `#F6E05E`, lavender `#8E8DB8` (the name uses `#8584B1`, a hair darker, to pass 3:1 contrast), plum `#351E28` for the full-screen transitions, route blue for the journey line.
- Fonts: Inter Tight (headings, body), Instrument Serif italic (name, small italics), Gloock (splash, counter, outlined numbers), Pixelify Sans (marquees, terminal lines), Caveat (sticky notes only).
- Halftone shading is three shared SVG dot patterns (`src/components/ink/Defs.tsx`), referenced as `url(#ht-1…3)`.

## Sound

Every sound is synthesised live with the Web Audio API in `src/lib/sound.ts` (no audio files). Give any element `data-sfx="name"` (plays on click/tap) or `data-sfx-hover="name"` (plays on mouse hover) and `<SoundLayer />` handles it. Sounds include the phone ring and pick-up, laptop keys, page flips, trophy ding, billiard clack, cash register, tape rip, sticker peel and slap, gift-box burst, cat meow, horse whinny, speech blips, beeps, boing and the record player's lo-fi loop.

Browsers only allow audio after the visitor's first click, tap or key press, so the phone's ring on scroll is silent until then. The nav has a sound on/off switch (remembered per browser).

## Motion and accessibility

- The big scroll pieces (journey map, 3D project stack, exploding head) pin only at ≥ 1024 px with motion allowed. Below that, or with `prefers-reduced-motion: reduce`, they become plain stacked layouts, the splash is skipped and every loop stops.
- The splash shows once per tab session.
- The phone rings and opens its bubble when it scrolls into view; the gift box bursts the same way. Neither needs a click.
- Every desk object, sticker and the phone is keyboard reachable; stickers move with the arrow keys.

## Where each part comes from

- **A (nyree):** typed "hello,|", italic-serif name with `>ω<`, pill buttons, "a scene of me surrounded by my things".
- **B (James Chugh):** clickable hotspot labels on the scene, Resume pill, highlighter/underline/circle marks and sticky notes, scroll-driven map route with cards, "the numbers they moved" with big stats, icon timeline, the gift box.
- **C (deesha):** ink + halftone comic illustration, colour only on clickable objects, yellow tape-label nav with a face, scattered moth/sparkle stickers, curved 3D album ring, sticker wall, the red rotary phone.
- **D (Huy Phan):** red serif name splash, 3D diagonal project stack with active list and rolling counter, full-screen word transitions (in plum, with outlined echoes, tape and stickers), giant outlined "20 / 28" around a head that pops open.

## Structure

```
src/
  app/          layout.tsx (fonts, metadata, splash boot script), page.tsx (section order), globals.css
  content/      site.ts (all content) · types.ts (types + todo())
  components/
    shell/      Splash, TapeNav, Sound (SoundLayer + on/off switch)
    hero/       Hero, DeskScene (ink desk + hotspots), Drift (cursor stickers)
    journey/    Journey (pinned map), usMap.ts (pre-projected US map + pins)
    sections/   AboutStory, Work, PlumWipe, Experience, OffTheClock, Playground (album ring, record player, stickers), Toolbox, Contact
    ink/        Defs (halftone), Art (phone, 8-ball, face, moth, sparkle), Icons, ProjectArt
    ui/         Roll (odometer), Todo
  lib/          gsap.ts (ScrollTrigger + media queries), sound.ts (all sounds), assets.ts, og-images.tsx
scripts/        todos.mjs, capture-projects.mjs, screenshots.mjs
```

## Deploy

Live at [varnikayadav.com](https://varnikayadav.com), hosted on Vercel (project `portfolio`). The Vercel project isn't connected to this repo, so pushing to GitHub doesn't update the site. Deploy from a clean copy of `main`:

```bash
npx vercel@latest login                     # once per machine
npx vercel@latest link --yes --project portfolio
npx vercel@latest deploy --prod --yes
```

Vercel detects Next.js and the static export. `siteUrl` in `site.ts` is used for absolute Open Graph URLs.
