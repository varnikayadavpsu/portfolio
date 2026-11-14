// Captures a screenshot of each project's live site into public/projects/.
// Usage: npm run capture   (needs a Playwright Chromium: npx playwright install chromium)
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

// [slug, url, extra wait in ms for slow intros / WebGL]
const targets = [
  ["terrametric", "https://terrametric-delta.vercel.app", 15000],
  ["firedrill-ar", "https://firedrill-ar.vercel.app"],
  ["rollpay", "https://rollpay-live.vercel.app"],
  ["blue-grid", "https://blue-grid-kitchener.vercel.app"],
  ["echo-by-relay", "https://echo-by-relay.vercel.app", 8000],
  ["would-you-jump", "https://superset-wyj.vercel.app"],
  ["fadethat", "https://fadethat.vercel.app"],
];

await mkdir("public/projects", { recursive: true });
const only = process.argv.slice(2);
const browser = await chromium.launch({
  channel: "chromium", // full Chromium (new headless) so WebGL pages render
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
for (const [slug, url, wait = 3500] of targets) {
  if (only.length && !only.includes(slug)) continue;
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(wait); // let intro animations settle
    await page.screenshot({ path: `public/projects/${slug}.jpg`, type: "jpeg", quality: 72 });
    console.log("ok  ", slug, url);
  } catch (err) {
    console.log("fail", slug, url, String(err).split("\n")[0]);
  } finally {
    await page.close();
  }
}
await browser.close();
