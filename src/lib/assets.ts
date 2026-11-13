import "server-only";
import fs from "node:fs";
import path from "node:path";

/** Sub-path for GitHub Pages project sites (see next.config.ts). */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

/** Prefix a /public path with the base path (static export doesn't do this for us). */
export const withBase = (publicPath: string) => `${basePath}${publicPath}`;

/** Build-time check for a file in /public (e.g. photos, résumé). */
export function publicFileExists(publicPath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", publicPath.replace(/^\/+/, "")));
}
