import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

/** Consistent inner-page header (the page's single h1). */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  align = "center",
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate border-b border-border bg-cool py-14 sm:py-16 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          align={align}
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          titleClassName="text-5xl"
        />
        {children ? (
          <div
            className={
              align === "center"
                ? "mt-8 flex flex-wrap items-center justify-center gap-3"
                : "mt-8 flex flex-wrap items-center gap-3"
            }
          >
            {children}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
