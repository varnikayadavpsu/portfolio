import { renderMonogram } from "@/lib/og-images";

export const dynamic = "force-static";

/** Favicon: the VY monogram. */
export function GET() {
  return renderMonogram(64);
}
