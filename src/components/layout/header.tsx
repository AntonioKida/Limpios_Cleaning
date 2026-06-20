"use client";

import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routes } from "@/lib/routes";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { LocaleToggle } from "@/components/locale-toggle";
import { PhoneLink } from "@/components/phone-link";
import { QuoteCTA } from "@/components/quote/quote-cta";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { key: "services", href: routes.services },
  { key: "serviceAreas", href: routes.serviceAreas },
  { key: "pricing", href: routes.pricing },
  { key: "about", href: routes.about },
  { key: "reviews", href: routes.reviews },
] as const;

export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === routes.home ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-border bg-surface/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-surface/85"
          : "border-transparent bg-cool/70 backdrop-blur supports-[backdrop-filter]:bg-cool/60",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <Link
          href={routes.home}
          className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label={site.name}
        >
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                isActive(item.href)
                  ? "text-royal"
                  : "text-foreground/80 hover:text-royal",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <PhoneLink
            showIcon
            className="text-sm font-semibold text-foreground/80 transition-colors hover:text-royal"
          />
          <LocaleToggle />
          <QuoteCTA size="lg" className="h-10 px-5" withIcon />
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <Button
            asChild
            variant="ghost"
            size="icon-lg"
            aria-label={`Call ${site.phone.display}`}
            className="text-royal"
          >
            <a href={site.phone.href}>
              <Phone className="size-5" aria-hidden />
            </a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon-lg" aria-label={t("openMenu")}>
                <Menu className="size-6" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[88vw] max-w-sm gap-0 p-0"
            >
              <SheetTitle className="border-b border-border px-6 py-5">
                <Logo />
              </SheetTitle>
              <nav
                aria-label="Mobile"
                className="flex flex-col gap-1 px-4 py-4"
              >
                {navItems.map((item) => (
                  <SheetClose asChild key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-3 py-3 text-base font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-secondary text-royal"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href={routes.contact}
                    className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {t("contact")}
                  </Link>
                </SheetClose>
              </nav>
              <div className="mt-auto flex flex-col gap-4 border-t border-border px-6 py-6">
                <SheetClose asChild>
                  <QuoteCTA fullWidth withIcon />
                </SheetClose>
                <PhoneLink
                  showIcon
                  className="justify-center text-base font-semibold text-royal"
                />
                <div className="flex justify-center">
                  <LocaleToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
