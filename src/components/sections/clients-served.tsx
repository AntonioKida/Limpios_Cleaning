import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { clientsServed, clientsServedEnabled } from "@/content/clients";

/**
 * "Trusted by" client strip. GATED: renders NOTHING until `clientsServedEnabled`
 * is true in src/content/clients.ts — which must not happen until Papo has
 * written permission from each named client. It's wired into the homepage so
 * enabling it is a single one-line flag flip.
 */
export function ClientsServed() {
  const t = useTranslations("Home.clients");
  if (!clientsServedEnabled) return null;

  return (
    <section aria-label={t("title")} className="border-b border-border bg-surface">
      <Container className="py-10">
        <p className="text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {t("title")}
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {clientsServed.map((c) => (
            <li
              key={c.name}
              className="font-heading text-lg font-bold text-navy/70"
            >
              {c.name}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
