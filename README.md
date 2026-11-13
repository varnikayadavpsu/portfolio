# Varnika Yadav — portfolio

A one-page portfolio built as a horizontal, scroll-driven poster: twelve framed panels that slide sideways as you scroll down, in the Pinterest Palette 2026 (plum, wasabi, cool blue, jade, persimmon).

**Stack:** Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · `next/font` · `next/og`. No component library: everything is hand-built.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static site → out/
npm start          # preview out/ locally (npx serve)
npm run lint       # ESLint
npm run todos      # list content you still need to fill in
```

Requires Node 20.9+.

---

## Edit the content: `src/content/site.ts`

Every string, link, project, stat and label lives in **`src/content/site.ts`**. Components only read from it, so you never need to touch a component to update the site.

- **Headings are written in normal case.** The CSS uppercases them, which keeps them readable for screen readers.
- **Missing info is written as `todo("…")`.** A TODO never renders: a `myRole` stays hidden, a missing link isn't shown and a hackathon date is left off until you replace the `todo(…)` with a real string. Run `npm run todos` to see what's still open.
- **Add a project:** copy an object in `featuredProjects` (ticket cards, in order) or `moreBuilds` (the compact list). Links are optional. Only the ones you include are rendered. `award.stamp` is the short text in the round stamp; `award.details` lists the full prize names on the stub.
- **Receipts:** each numeral is `{ value, suffix, caption }`. The number counts up from 0; the suffix (`/60`, `+`, `%`, ` hrs`) stays put.
- **Hackathon log:** add `date: "Apr 2026"` to an entry to show it.
- **Panel labels and HUD names** (`// selected work`, `03 / 12 · how i build`) are in `sections`.

### Photos

| File | Used for |
| --- | --- |
| `public/images/varnika-portrait.jpg` | Hero portrait (vertical, ideally ≥ 1600px tall) |
| `public/images/varnika-about.jpg` | About panel (something candid). If it's missing, the portrait is reused with a different crop. |

Until a file exists, a labeled placeholder shows instead. Adjust the crop with `objectPosition` in `photos` (e.g. `"50% 20%"`).

A static export can't resize images on the fly, so the original file is what visitors download. Export photos at about 1600px tall and compress them to roughly 300–400 KB (e.g. with [Squoosh](https://squoosh.app)).

### Résumé

Drop `public/resume.pdf` in and rebuild. The **Résumé ↗** link appears automatically; it's hidden while the file doesn't exist.

### Colors, fonts, spacing

Design tokens are CSS variables in the `@theme` block of `src/app/globals.css` (Tailwind v4 keeps its config in CSS). `src/styles/tokens.ts` mirrors the colors for the generated images (Open Graph, favicon), which can't read CSS. Keep the two in sync.

Fonts come from Google via `next/font`: **Big Shoulders** (Google has merged "Big Shoulders Display" into this family; the CSS sets its optical-size axis to 72, which is the Display cut), **JetBrains Mono** and **DM Sans**.

---

## Deploy to Vercel

**From the dashboard:** push this folder to a GitHub repo, then go to [vercel.com/new](https://vercel.com/new), import the repo and click **Deploy**. Vercel detects Next.js and the static export on its own, so there are no settings to change.

**From the terminal:**

```bash
npm i -g vercel
vercel login
vercel            # first run: links the project and creates a preview URL
vercel --prod     # deploys to production
```

Optional: once you know your final URL, put it in `siteUrl` in `site.ts` (Vercel fills it in automatically if you don't).

### GitHub Pages (alternative)

Project sites live under a sub-path, so build with it:

```bash
NEXT_PUBLIC_BASE_PATH=/your-repo-name npm run build
```

Then publish the `out/` folder (e.g. with the `actions/deploy-pages` action). `public/.nojekyll` is already included so GitHub serves the `_next/` folder. Set `siteUrl` in `site.ts` so social previews get absolute URLs.

---

## How it works

```
src/
  app/            layout.tsx (fonts, metadata), page.tsx (panel order), globals.css (tokens)
                  og.png/, favicon.png/, apple-touch-icon.png/ → images generated with next/og
  content/        site.ts (all content) · types.ts (types + todo() helper)
  components/
    shell/        HorizontalTrack (GSAP pin + Lenis), SiteChrome (rail, menu, mobile pill), ProgressHUD
    ui/           Frame, Panel, Button, Tag, Stamp, TicketCard, Numeral, FramedPhoto, CopyEmail, SocialIcon
    panels/       Hero → Footer, one file per panel
    illustrations/Globe, PipeNetwork, Terminal, Candlestick, PoseSkeleton (inline SVG line art)
  lib/            scroll.ts (scroll-to-panel), motion.ts (reveals, draw-ins, count-ups), frame-path.ts
assets/og/        static font files for the generated images (SIL Open Font License)
```

- **Horizontal scroll** (≥ 900px wide and motion allowed): the track is pinned and translated with `scrub: 1`; 1px of vertical scroll = 1px of horizontal travel, so menu links scroll to `pinStart + panel.offsetLeft`. Lenis drives smooth scrolling from GSAP's ticker.
- **Below 900px or with `prefers-reduced-motion: reduce`:** no pinning. Panels stack vertically, the rail becomes a top bar and the internship CTA becomes a pill. Reduced motion also turns off draw-ins, reveals and count-ups.
- **Motion** is declared with data attributes (`data-reveal`, `svg[data-draw]`, `data-count-to`) and set up in `lib/motion.ts` inside a `gsap.matchMedia()` context, so it's torn down and rebuilt when the layout mode changes.
- **Ambient motion:** the globe (live 3D spin that reacts to scroll speed and the cursor, orbiting satellite, downlink beams), pipe flow, terminal typing, the scrolling candlestick feed and the moving skeleton run only while they're on screen (`lib/useLive.ts`). The hero intro is pure CSS so it starts with the first paint. The ticker, parallax, ticket tilt, stamp slam, headline lean and cursor trail are all switched off under reduced motion.
- **Performance:** each panel hydrates as its own Suspense boundary, off-screen panels skip rendering (`content-visibility: auto`), and in-panel animations are set up in idle time.

## Credits

Layout and interaction ideas inspired by [bigdirty.agency](https://www.bigdirty.agency). All copy, colors and illustrations are original. GitHub and Devpost icons: [Simple Icons](https://simpleicons.org) (CC0).
