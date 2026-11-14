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
| `public/me.png` | Your illustration sitting on the desk edge in the hero. Transparent PNG, portrait (about 1 : 2.5). Until it exists, a dashed placeholder shows. |
| `public/face.png` | Optional: an ink drawing of your face for the nav button. A doodle is used until then. |
| `public/resume.pdf` | Turns the "cv" pill and the "Resume ↗" pill into résumé links (they point to Experience until then). |
| `public/playlist/01.jpg …` | Album covers for the "jam with me" ring; list them in `playground.jam.covers`. Placeholder ink covers show until then. |

Each is checked at build time, so just add the file and rebuild.

## Design system

Tokens are CSS variables in the `@theme` block of `src/app/globals.css` (`src/styles/tokens.ts` mirrors the colours for the OG image and favicon).

- Paper `#F5F2EB`, ink `#141414`, accent red `#E3262F`, highlighter yellow `#F6E05E`, lavender `#8E8DB8` (the name uses `#8584B1`, a hair darker, to pass 3:1 contrast), plum `#351E28` for the full-screen transitions, route blue for the journey line.
- Fonts: Inter Tight (headings, body), Instrument Serif italic (name, small italics), Gloock (splash, counter, outlined numbers), Pixelify Sans (marquees, terminal lines), Caveat (sticky notes only).
- Halftone shading is three shared SVG dot patterns (`src/components/ink/Defs.tsx`), referenced as `url(#ht-1…3)`.

## Motion and accessibility

- The big scroll pieces (journey map, 3D project stack, exploding head) pin only at ≥ 1024 px with motion allowed. Below that, or with `prefers-reduced-motion: reduce`, they become plain stacked layouts, the splash is skipped and every loop stops.
- The splash shows once per tab session.
- Every desk object, sticker and the phone is keyboard reachable; stickers move with the arrow keys.

## Where each part comes from

- **A (nyree):** typed "hello,|", italic-serif name with `>ω<`, pill buttons, pixel-font `PROJECTS ·˚✧` marquee, "a scene of me surrounded by my things".
- **B (James Chugh):** clickable hotspot labels on the scene, Resume pill, highlighter/underline/circle marks and sticky notes, scroll-driven map route with cards, "the numbers they moved" with big stats, icon timeline, the gift box.
- **C (deesha):** ink + halftone comic illustration, colour only on clickable objects, yellow tape-label nav with a face, scattered moth/sparkle stickers, curved 3D album ring, sticker wall, the red rotary phone.
- **D (Huy Phan):** red serif name splash, 3D diagonal project stack with active list and rolling counter, full-screen word transitions (in plum), giant outlined "20 / 28" around a head that pops open.

## Structure

```
src/
  app/          layout.tsx (fonts, metadata, splash boot script), page.tsx (section order), globals.css
  content/      site.ts (all content) · types.ts (types + todo())
  components/
    shell/      Splash, TapeNav
    hero/       Hero, DeskScene (ink desk + hotspots), Drift (cursor stickers)
    journey/    Journey (pinned map), usMap.ts (pre-projected US map + pins)
    sections/   AboutStory, Work, PlumWipe, Experience, OffTheClock, Playground, Toolbox, Contact
    ink/        Defs (halftone), Art (phone, 8-ball, face, moth, sparkle), Icons, ProjectArt
    ui/         Marquee, Roll (odometer), Todo
  lib/          gsap.ts (ScrollTrigger + media queries), assets.ts, og-images.tsx
scripts/        todos.mjs, capture-projects.mjs, screenshots.mjs
```

## Deploy

Not deployed. When ready: push the branch, import it on Vercel (it detects Next.js and the static export). `siteUrl` in `site.ts` is used for absolute Open Graph URLs.
