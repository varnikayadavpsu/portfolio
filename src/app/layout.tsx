import type { Metadata, Viewport } from "next";
import { Caveat, Gloock, Instrument_Serif, Inter_Tight, Pixelify_Sans } from "next/font/google";
import { filled } from "@/content/types";
import { person, seo, siteUrl } from "@/content/site";
import { colors } from "@/styles/tokens";
import { withBase } from "@/lib/assets";
import { OG_SIZE } from "@/lib/og-images";
import "./globals.css";

/* The five fonts of the design system. No others. */
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const splash = Gloock({ subsets: ["latin"], weight: "400", variable: "--font-gloock", display: "swap" });
const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixelify", display: "swap" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap", preload: false });

function resolveSiteUrl(): URL | undefined {
  const value =
    filled(siteUrl) ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
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
  themeColor: colors.paper,
  width: "device-width",
  initialScale: 1,
};

/*
 * Runs before first paint: swaps no-js → js, and turns the splash off for
 * repeat visits in this tab session (or when reduced motion is on).
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.remove('no-js');d.classList.add('js');try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(r||sessionStorage.getItem('vy-splash')){d.setAttribute('data-splash','off')}else{sessionStorage.setItem('vy-splash','1')}}catch(e){d.setAttribute('data-splash','off')}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`no-js ${sans.variable} ${serif.variable} ${splash.variable} ${pixel.variable} ${hand.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
