// Screenshots every section at desktop (1440) and mobile (390) widths.
// Usage: node scripts/screenshots.mjs [baseUrl] [outDir]   (REDUCED=1 to emulate prefers-reduced-motion)
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "screenshots";
await mkdir(out, { recursive: true });

// [name, selector, offset in viewport heights from the section's top, action?]
const shots = [
  ["01-hero", "#top", 0],
  ["02-about", "#about", 0.15],
  ["03-journey-start", "#journey", 0],
  ["04-journey-mid", "#journey", 3.2],
  ["05-journey-end", "#journey", 5.7],
  ["06-work-start", "#work", 0.6],
  ["07-work-mid", "#work", 3.3],
  ["08-wipe-experience", ".wipe", 0.6],
  ["09-experience", "#experience", 0],
  ["10-experience-stats", "#experience", 1.1],
  ["11-off-the-clock", "#off-the-clock", 1.1],
  ["12-playground", "#playground", 0.1],
  ["13-stickers", "#playground", 1.0],
  ["14-toolbox-open", "#toolbox", 0.1, "gift"],
  ["15-contact", "#contact", 0, "phone"],
];

const errors = [];
const browser = await chromium.launch();
for (const [label, vp] of [
  ["desktop", { width: 1440, height: 900 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
    isMobile: label === "mobile",
    hasTouch: label === "mobile",
    reducedMotion: process.env.REDUCED ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && errors.push(`${label}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${label}: ${e.message}`));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: "nextjs-portal{display:none!important}" }); // hide the dev badge
  await page.waitForTimeout(2600); // splash + typing
  for (const [name, sel, off, action] of shots) {
    const ok = await page.evaluate(
      ([sel, off]) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        // Pinned sections live inside a pin-spacer; measure from the outermost box.
        const box = el.closest(".pin-spacer") ?? el;
        const top = box.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + off * window.innerHeight, behavior: "instant" });
        return true;
      },
      [sel, off],
    );
    if (!ok) {
      errors.push(`${label}: missing ${sel}`);
      continue;
    }
    await page.waitForTimeout(1300);
    if (action === "gift") {
      await page.click("#toolbox button[aria-controls='skills-grid']");
      await page.waitForTimeout(1900);
    }
    if (action === "phone") {
      await page.click("#contact button[aria-controls='call-bubble']");
      await page.waitForTimeout(1700);
    }
    await page.screenshot({ path: `${out}/${label}-${name}.jpg`, type: "jpeg", quality: 70 });
  }
  // Horizontal overflow check
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) errors.push(`${label}: horizontal overflow ${overflow}px`);
  await ctx.close();
}
await browser.close();
console.log(errors.length ? errors.join("\n") : "no console errors, no horizontal overflow");
