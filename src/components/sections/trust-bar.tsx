import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/icon";
import { trustStats } from "@/content/home";

// Credentials strip — deliberately carries DIFFERENT proof than the hero's
// star line (veteran/insured) and the "Why" cards, so nothing is restated.
//
// No `{year}` is threaded in: the founding year was never confirmed by the owner,
// and the strip now leads with the SBA/military proof instead. Passing an
// unconfirmed 2023 in "just in case" is how a false founding claim ships the day
// someone edits the message back to "Serving since {year}".
export function TrustBar() {
  const t = useTranslations("Home.trustBar");

  return (
    <section aria-label={t("local")} className="border-y border-border bg-surface">
      <Container>
        <ul className="grid grid-cols-2 divide-border sm:grid-cols-4 sm:divide-x">
          {trustStats.map((stat) => (
            <li
              key={stat.id}
              className="flex items-center justify-center gap-2.5 px-4 py-6 sm:py-7"
            >
              <span className="shrink-0 text-sky">
                <Icon name={stat.icon} className="size-6" />
              </span>
              <span className="text-sm font-semibold text-navy">{t(stat.id)}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
