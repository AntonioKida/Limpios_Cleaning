import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /services/residential was folded into /services/move-in-out (owner
      // confirmed he does not clean occupied homes; the turnover page already
      // said what he actually does). Permanent, so the crawl equity transfers.
      //
      // Both forms are listed on purpose. next.config redirects run at step 2 of
      // the routing chain, BEFORE the i18n proxy at step 3, so a bare
      // /services/residential is redirected here first and only then gets its
      // locale prefix. The prefixed form catches every real inbound link.
      // Next issues 308 (not 301) for permanent: same SEO meaning, but it also
      // preserves the request method.
      {
        source: "/:locale(en|es)/services/residential",
        destination: "/:locale/services/move-in-out",
        permanent: true,
      },
      {
        source: "/services/residential",
        destination: "/services/move-in-out",
        permanent: true,
      },
    ];
  },
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
