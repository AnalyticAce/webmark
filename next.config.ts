import type { NextConfig } from "next";

/**
 * The demo build is the GitHub Pages site: a static export served from /webmark with the review
 * widget bundled in. A plain `next build` turns both off, so the CI bundle guard keeps checking
 * what every real consumer actually gets.
 */
const isDemo = process.env.NEXT_PUBLIC_WEBMARK_DEMO === "1";

const nextConfig: NextConfig = {
  // Inline the flag either way. Left unset, the comparison is not statically false, so the
  // bundler keeps the dynamic import reachable and emits the widget chunk into every build.
  env: { NEXT_PUBLIC_WEBMARK_DEMO: isDemo ? "1" : "0" },
  ...(isDemo ? { output: "export", basePath: "/webmark", images: { unoptimized: true } } : {}),
};

export default nextConfig;
