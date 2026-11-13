import { renderOgImage } from "@/lib/og-images";

export const dynamic = "force-static";

/** Open Graph / Twitter card image, generated at build time. */
export function GET() {
  return renderOgImage();
}
