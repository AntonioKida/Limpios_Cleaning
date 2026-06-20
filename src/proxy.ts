import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// next-intl locale negotiation + redirects (`/` -> `/en`, sets the active locale).
// Uses Next 16's `proxy.ts` file convention (the renamed `middleware.ts`).
export default createMiddleware(routing);

export const config = {
  // Skip Next internals, API routes, and any path with a file extension
  // (sitemap.xml, robots.txt, icon.svg, images, …).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
