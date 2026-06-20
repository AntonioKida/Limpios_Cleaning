import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { routes } from "@/lib/routes";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main
      id="main-content"
      className="flex flex-1 items-center justify-center px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-md text-center">
        <p className="font-heading text-7xl font-bold text-royal/20 sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-heading text-3xl font-bold text-navy">
          {t("title")}
        </h1>
        <p className="mt-2 font-medium text-royal">{t("subtitle")}</p>
        <p className="mt-3 text-muted-foreground">{t("body")}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="cta" size="lg" className="h-11 px-6">
            <Link href={routes.home}>{t("backHome")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-11 px-6">
            <Link href={routes.services}>{t("browseServices")}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
