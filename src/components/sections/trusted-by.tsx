import { useTranslations } from "next-intl";
import {
  Building2,
  FileCheck2,
  Landmark,
  ShieldCheck,
  Store,
  Truck,
  KeyRound,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { ClientsServed } from "@/components/sections/clients-served";

/**
 * Social proof WITHOUT fake reviews. Three deliberately-layered levels:
 *  1. LIVE: anonymized client *categories* (zero legal risk, names never used).
 *  2. LIVE: the trust stack we can actually prove (a Veteran Owned Small Business
 *     with 28 years of military service, licensed + insured with a COI on request,
 *     chamber member). We render "Veteran Owned Small Business", never
 *     "SBA-certified" — the latter names the SBA VetCert registration, a stronger
 *     claim the owner has not made.
 *  3. GATED: the named client list (text only, no logos) — rendered by
 *     <ClientsServed/>, which stays off until Papo has written permission.
 * No client LOGOS anywhere, in any path: that needs per-brand written consent.
 */
const CATEGORIES = [
  { id: "insurance", Icon: ShieldCheck },
  { id: "retail", Icon: Store },
  { id: "equipment", Icon: Truck },
  { id: "realestate", Icon: KeyRound },
] as const;

const PROOF = [
  { id: "veteran", Icon: Building2 },
  { id: "insured", Icon: FileCheck2 },
  { id: "chamber", Icon: Landmark },
] as const;

export function TrustedBy({
  /** The dedicated page supplies its own <h1> via PageHero, so it hides this. */
  showHeading = true,
}: {
  showHeading?: boolean;
}) {
  const t = useTranslations("TrustedBy");

  return (
    <Section surface="cool">
      {showHeading ? (
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-heading text-sm font-semibold tracking-wide text-royal uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-balance text-navy sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-pretty text-muted-foreground">{t("subtitle")}</p>
        </div>
      ) : null}

      {/* 1. Anonymized client categories — real, but nobody is named. */}
      <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${showHeading ? "mt-10" : ""}`}>
        {CATEGORIES.map(({ id, Icon }) => (
          <li
            key={id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-5"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-royal">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="font-heading text-sm font-semibold text-navy">
              {t(`categories.${id}`)}
            </span>
          </li>
        ))}
      </ul>

      {/* 2. The proof we can actually stand behind. */}
      <div className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h3 className="text-center font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {t("proofTitle")}
        </h3>
        <ul className="mt-5 grid gap-5 sm:grid-cols-3">
          {PROOF.map(({ id, Icon }) => (
            <li key={id} className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-royal">
                <Icon className="size-4.5" aria-hidden />
              </span>
              <span className="text-sm leading-relaxed text-foreground">
                {t(`proof.${id}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Named client list: built, but DISABLED until written permission. */}
      <ClientsServed />
    </Section>
  );
}
