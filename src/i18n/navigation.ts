import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation APIs. Always import `Link`, `redirect`, `usePathname`
 * and `useRouter` from here (not from `next/*`) so locale prefixes are handled
 * automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
