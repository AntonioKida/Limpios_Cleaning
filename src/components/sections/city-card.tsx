import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";

/** Presentational city card for the service-areas hub. */
export function CityCard({
  name,
  countyLabel,
  blurb,
  href,
  cta,
}: {
  name: string;
  countyLabel: string;
  blurb: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="flex items-center gap-2.5">
        <span className="grid size-10 place-items-center rounded-xl bg-secondary text-sky transition-colors group-hover:bg-royal group-hover:text-white">
          <MapPin className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col">
          <h2 className="font-heading text-lg font-semibold text-navy">{name}</h2>
          <span className="text-sm font-medium text-muted-foreground">
            {countyLabel}
          </span>
        </div>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
        {blurb}
      </p>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-royal">
        {cta}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
