import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires explicit qualities for any non-default (75) quality.
    qualities: [60, 75, 85, 100],
    // Enabling seam for curated stock photography. The site ships with local
    // labeled placeholders in /public/placeholders; drop real photos in /public
    // or reference an approved host below. TODO: confirm final image source.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "images.pexels.com", pathname: "/**" },
    ],
  },
};

export default withNextIntl(nextConfig);
