import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { person } from "@/content/site";
import { colors } from "@/styles/tokens";

/*
 * Images generated at build time with next/og. They're served as route
 * handlers with real .png names (og.png, favicon.png, apple-touch-icon.png)
 * so every static host sends the right content type.
 * Fonts: static instances of the site fonts (OFL), committed in /assets/og.
 */
const fontFile = (name: string) => readFile(join(process.cwd(), "assets/og", name));

export const OG_SIZE = { width: 1200, height: 630 };

export async function renderOgImage() {
  const [display, mono] = await Promise.all([
    fontFile("BigShoulders-Display-Black.ttf"),
    fontFile("JetBrainsMono-Medium.ttf"),
  ]);
  const [first, ...rest] = person.name.split(" ");
  const inset = 28;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: colors.plum,
          color: colors.ice,
          padding: 84,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: inset,
            left: inset,
            right: inset,
            bottom: inset,
            border: `2px solid ${colors.ice}`,
            opacity: 0.55,
          }}
        />
        <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 26, color: colors.wasabi }}>
          {"// portfolio"}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Big Shoulders",
            fontSize: 210,
            lineHeight: 0.86,
            letterSpacing: "-0.02em",
            color: colors.wasabi,
            textTransform: "uppercase",
          }}
        >
          <span>{first}</span>
          <span>{rest.join(" ")}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "JetBrains Mono", fontSize: 34 }}>
          <span>{person.tagline}</span>
          <span style={{ display: "flex", width: 20, height: 36, background: colors.persimmon }} />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Big Shoulders", data: display, weight: 900, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}

/** The VY monogram, wasabi on plum, at any square size. */
export async function renderMonogram(size: number) {
  const display = await fontFile("BigShoulders-Display-Black.ttf");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: colors.plum,
          color: colors.wasabi,
          fontFamily: "Big Shoulders",
          fontSize: Math.round(size * 0.78),
          letterSpacing: "-0.02em",
          paddingTop: Math.round(size * 0.06),
        }}
      >
        {person.monogram}
      </div>
    ),
    { width: size, height: size, fonts: [{ name: "Big Shoulders", data: display, weight: 900, style: "normal" }] },
  );
}
