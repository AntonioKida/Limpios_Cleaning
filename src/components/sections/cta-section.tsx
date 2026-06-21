import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { QuoteCTA } from "@/components/quote/quote-cta";
import { site } from "@/content/site";

/**
 * Reusable repeat-CTA band (navy panel, orange primary CTA + click-to-call).
 * Text is passed in so each page supplies its own copy.
 */
export function CTASection({
  title,
  subtitle,
  primaryLabel,
  service,
}: {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  service?: string;
}) {
  const tc = useTranslations("Common");

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy px-6 py-14 text-center text-white sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] [mask-image:radial-gradient(circle_at_70%_0%,black,transparent_70%)] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:54px_54px]"
          />
          <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold text-balance sm:text-4xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-xl text-pretty text-cool/75">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <QuoteCTA
              size="2xl"
              withIcon
              label={primaryLabel}
              service={service}
              className="w-full sm:w-auto"
            />
            <Button
              asChild
              variant="outline"
              size="2xl"
              className="w-full border-white/40 bg-transparent text-white hover:border-white/60 hover:bg-white/10 hover:text-white sm:w-auto"
            >
              <a href={site.phone.href}>
                <Phone className="size-5" aria-hidden />
                {tc("callNow")}
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
