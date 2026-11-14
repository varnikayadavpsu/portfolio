import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, splash } from "@/content/site";
import { colors } from "@/styles/tokens";

/*
 * Images generated at build time with next/og, served as route handlers with
 * real .png names so every static host sends the right content type.
 * Fonts: static instances of the site fonts (OFL), committed in /assets/og.
 */
const fontFile = (name: string) => readFile(join(process.cwd(), "assets/og", name));

export const OG_SIZE = { width: 1200, height: 630 };

export async function renderOgImage() {
  const [splashFont, serif] = await Promise.all([
    fontFile("Gloock-Regular.ttf"),
    fontFile("InstrumentSerif-Italic.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: colors.paper,
          color: colors.ink,
          padding: "70px 84px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", fontFamily: "Gloock", color: colors.red, fontSize: 196, lineHeight: 0.9 }}>
          <span>{splash.lines[0]}</span>
          <span style={{ marginLeft: 220 }}>{splash.lines[1]}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22, fontFamily: "Instrument Serif", fontSize: 50 }}>
          <span style={{ display: "flex", background: colors.yellow, padding: "4px 18px" }}>{hero.tagline}</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Gloock", data: splashFont, weight: 400, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}

/** The VY monogram, red serif on paper, at any square size. */
export async function renderMonogram(size: number) {
  const splashFont = await fontFile("Gloock-Regular.ttf");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.paper,
          color: colors.red,
          fontFamily: "Gloock",
          fontSize: Math.round(size * 0.6),
          letterSpacing: "-0.04em",
          borderRadius: Math.round(size * 0.22),
        }}
      >
        VY
      </div>
    ),
    { width: size, height: size, fonts: [{ name: "Gloock", data: splashFont, weight: 400, style: "normal" }] },
  );
}
