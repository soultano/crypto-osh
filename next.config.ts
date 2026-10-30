import type { NextConfig } from "next";
import { gaId } from "./lib/site";

const isDev = process.env.NODE_ENV !== "production";

// Google Analytics hosts, allowed only while analytics is on.
const ga = gaId()
  ? " https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com"
  : "";

// Strict Content Security Policy. The site has no forms and no user-generated
// content; the only external origins are YouTube (privacy-enhanced embeds,
// loaded on click), its thumbnail CDN and, when turned on, Google Analytics.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${ga}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://i.ytimg.com${ga}`,
  "font-src 'self'",
  `connect-src 'self'${ga}`,
  "frame-src https://www.youtube-nocookie.com",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
  // The auction page was removed; old links go to the home page.
  async redirects() {
    return [{ source: "/:locale(uz|ru|en)/auction", destination: "/:locale", permanent: true }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
