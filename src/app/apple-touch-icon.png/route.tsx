import { renderMonogram } from "@/lib/og-images";

export const dynamic = "force-static";

/** Home-screen icon: the VY monogram. */
export function GET() {
  return renderMonogram(180);
}
