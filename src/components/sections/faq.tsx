import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqIds } from "@/content/faq";

export function Faq() {
  const t = useTranslations("Home.faq");
  const tf = useTranslations("Faq.items");

  return (
    <Section id="faq" surface="cool">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {faqIds.map((id) => (
            <AccordionItem
              key={id}
              value={id}
              className="rounded-xl border border-border bg-surface px-5 shadow-sm"
            >
              <AccordionTrigger className="py-4 text-left font-heading text-base font-semibold text-navy hover:no-underline">
                {tf(`${id}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {tf(`${id}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
