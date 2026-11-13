import type { Metadata, Viewport } from "next";
import { Big_Shoulders, DM_Sans, JetBrains_Mono } from "next/font/google";
import { filled } from "@/content/types";
import { person, seo, siteUrl } from "@/content/site";
import { colors } from "@/styles/tokens";
import { withBase } from "@/lib/assets";
import { OG_SIZE } from "@/lib/og-images";
import "./globals.css";

/*
 * Google merged "Big Shoulders Display" into the single "Big Shoulders" family,
 * with an optical-size (opsz) axis. Loading that axis and setting opsz 72 in CSS
 * (see `t-display`) gives the Display cut.
 */
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-big-shoulders",
  display: "swap",
  // Next has no metric overrides for this family yet; headline lines never
  // wrap, so a plain condensed fallback causes no layout shift.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Roboto Condensed", "sans-serif"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

function resolveSiteUrl(): URL | undefined {
  const fromContent = filled(siteUrl);
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined);
  const value = fromContent || fromEnv;
  try {
    return value ? new URL(value) : undefined;
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title: seo.title,
  description: seo.description,
  authors: [{ name: person.name }],
  creator: person.name,
  icons: {
    icon: [{ url: withBase("/favicon.png"), type: "image/png", sizes: "64x64" }],
    apple: [{ url: withBase("/apple-touch-icon.png"), sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    title: seo.title,
    description: seo.description,
    siteName: person.name,
    locale: "en_US",
    images: [{ url: withBase("/og.png"), ...OG_SIZE, alt: seo.ogAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [{ url: withBase("/og.png"), alt: seo.ogAlt }],
  },
};

export const viewport: Viewport = {
  themeColor: colors.plum,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
