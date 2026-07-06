import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/json-ld";
import {
  serviceSchema,
  faqPageSchema,
  breadcrumbSchema,
} from "@/lib/json-ld";
import { faqIds } from "@/content/faq";
import { CheckList } from "@/components/check-list";
import { ServiceCard } from "@/components/sections/service-card";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { PortraitVideo } from "@/components/sections/portrait-video";
import { JobPhotos } from "@/components/sections/job-photos";
import { galleryForService } from "@/content/gallery";
import { videoForService } from "@/content/media";
import { photosForService } from "@/content/photos";
import { Faq } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta-section";
import { QuoteCTA } from "@/components/quote/quote-cta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import {
  type Service,
  serviceSlugs,
  getService,
  isServiceSlug,
} from "@/content/services";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";
import { formatCurrency } from "@/lib/format";

export function generateStaticParams() {
  return serviceSlugs.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; service: string }>;
}): Promise<Metadata> {
  const { locale, service } = await params;
  if (!isServiceSlug(service)) return {};
  const t = await getTranslations({ locale, namespace: "Services.items" });
  return buildMetadata({
    title: t(`${service}.name`),
    description: t(`${service}.metaDescription`),
    locale,
    path: `/services/${service}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; service: string }>;
}) {
  const { locale, service } = await params;
  if (!isServiceSlug(service)) notFound();
  setRequestLocale(locale);

  const svc = getService(service)!;
  const t = await getTranslations("Services");
  const tc = await getTranslations("Common");
  const tf = await getTranslations("Home.finalCta");
  const tv = await getTranslations("Video");
  const tFaq = await getTranslations("Faq.items");
  const tNav = await getTranslations("Nav");

  const gallery = galleryForService(service);
  const serviceVideos = videoForService(service);
  const servicePhotos = photosForService(service);

  const serviceName = t(`items.${service}.name`);
  const serviceUrl = `${site.url}/${locale}/services/${service}`;
  const faqItems = faqIds.map((id) => ({
    q: tFaq(`${id}.q`),
    a: tFaq(`${id}.a`),
  }));

  const included = t.raw(`items.${service}.included`) as string[];
  const who = t.raw(`items.${service}.who`) as string[];
  const factors = t.raw(`items.${service}.factors`) as string[];

  const priceLabel =
    svc.price.model === "from" && svc.price.amount
      ? tc("from", { amount: formatCurrency(svc.price.amount, locale) })
      : svc.price.model === "custom"
        ? tc("customQuote")
        : tc("requestQuote");

  const related = svc.related
    .map((slug) => getService(slug))
    .filter((s): s is Service => Boolean(s));

  return (
    <main id="main-content">
      <JsonLd
        data={[
          serviceSchema({
            name: serviceName,
            description: t(`items.${service}.metaDescription`),
            url: serviceUrl,
          }),
          faqPageSchema(faqItems),
          breadcrumbSchema([
            { name: tNav("home"), url: `${site.url}/${locale}` },
            { name: tNav("services"), url: `${site.url}/${locale}/services` },
            { name: serviceName, url: serviceUrl },
          ]),
        ]}
      />
      <PageHero
        align="left"
        eyebrow={t(`items.${service}.tagline`)}
        title={serviceName}
        subtitle={t(`items.${service}.description`)}
      >
        <QuoteCTA service={service} location="service" />
        <Button asChild variant="outline" size="xl">
          <a href={site.phone.href}>
            <Phone className="size-5" aria-hidden />
            {tc("callNow")}
          </a>
        </Button>
        <Badge variant="soft" size="md" className="px-3.5 py-2 text-sm">
          {svc.price.model === "from" && svc.price.amount
            ? `${t("labels.startingAt")} ${formatCurrency(svc.price.amount, locale)}`
            : priceLabel}
        </Badge>
      </PageHero>

      {/* Breadcrumb back link */}
      <Container className="pt-8">
        <Link
          href={routes.services}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:underline"
        >
          <ArrowLeft className="size-4" />
          {t("labels.allServices")}
        </Link>
      </Container>

      <Section surface="none" className="pt-8">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-bold text-navy">
              {t("labels.included")}
            </h2>
            <CheckList items={included} columns={2} className="mt-6" />
          </div>
          <aside className="flex flex-col gap-8">
            <div>
              <h2 className="font-heading text-xl font-bold text-navy">
                {t("labels.whoFor")}
              </h2>
              <CheckList items={who} className="mt-5" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold text-navy">
                {t("labels.priceFactors")}
              </h2>
              <CheckList items={factors} className="mt-5" />
            </div>
          </aside>
        </div>
      </Section>

      {gallery.length > 0 ? (
        <Section surface="cool">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-bold text-navy">
              {t("labels.galleryTitle")}
            </h2>
            <p className="max-w-prose text-muted-foreground">
              {t("labels.gallerySubtitle")}
            </p>
          </div>
          <div className="mt-8">
            <GalleryGrid lead={gallery.slice(0, 3)} more={gallery.slice(3)} />
          </div>
        </Section>
      ) : null}

      {servicePhotos.length > 0 ? (
        /* border-t separates this from the (also cool) gallery when both render. */
        <Section surface="cool" className={gallery.length > 0 ? "border-t border-border" : undefined}>
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl font-bold text-navy">
              {t("labels.photosTitle")}
            </h2>
            <p className="max-w-prose text-muted-foreground">
              {t("labels.photosSubtitle")}
            </p>
          </div>
          <div className="mt-8">
            <JobPhotos photos={servicePhotos} />
          </div>
        </Section>
      ) : null}

      {serviceVideos.length > 0 ? (
        <Section surface="white">
          <h2 className="font-heading text-2xl font-bold text-navy">
            {t("labels.videoTitle")}
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {serviceVideos.map((v) => (
              <PortraitVideo
                key={v.id}
                className="w-full max-w-[15rem] sm:w-60"
                poster={v.poster}
                url={v.url}
                selfSrc={v.selfSrc}
                provider={v.provider}
                spokenCaptions={v.spokenCaptions}
                caption={tv(`captions.${v.id}`)}
                playLabel={tv("playLabel")}
                sizes="(max-width: 640px) 80vw, 240px"
              />
            ))}
          </div>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section surface="white">
          <h2 className="font-heading text-2xl font-bold text-navy">
            {t("labels.related")}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ServiceCard key={r.slug} service={r} />
            ))}
          </div>
        </Section>
      ) : null}

      <Faq />

      <CTASection title={tf("title")} subtitle={tf("subtitle")} service={service} />
    </main>
  );
}
