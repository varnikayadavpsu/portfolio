import type { NextConfig } from "next";

/**
 * Static export: `npm run build` writes a plain HTML/CSS/JS site to `out/`.
 *
 * GitHub Pages project sites live under a sub-path (username.github.io/repo),
 * so set NEXT_PUBLIC_BASE_PATH=/repo for that build. Leave it empty for Vercel
 * or a custom domain.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  // The default image optimizer needs a server; a static export serves the
  // original files instead. Keep photos reasonably sized (see README).
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
