import type { NextConfig } from "next";

// Where the separate NestJS LMS backend actually runs.
const LMS_API_TARGET = process.env.LMS_API_PROXY_TARGET ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Proxy /api/* to the LMS backend server-side, so the browser only ever
  // talks to its own origin. This avoids the browser having to make a
  // cross-port (localhost:3000 -> localhost:4000) request at all, which
  // sidesteps CORS entirely and any local security software/extension that
  // blocks cross-origin credentialed requests to localhost (observed
  // symptom: POST requests failing with ERR_CONNECTION_REFUSED while GETs
  // to the same host:port succeeded). No existing app route uses "/api",
  // so this doesn't collide with anything.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${LMS_API_TARGET}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
