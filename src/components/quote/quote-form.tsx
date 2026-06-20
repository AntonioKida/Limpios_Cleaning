"use client";

import { useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/icon";
import { serviceSlugs, getService } from "@/content/services";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const PROPERTY_TYPES = ["house", "apartment", "office", "other"] as const;
const FREQUENCIES = ["onetime", "weekly", "biweekly", "monthly"] as const;

type QuoteFormValues = {
  service: string;
  propertyType: string;
  bedrooms?: string;
  bathrooms?: string;
  sqft?: string;
  frequency: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  message?: string;
  consent: boolean;
  company?: string; // honeypot
};

const STEP_FIELDS: (keyof QuoteFormValues)[][] = [
  ["service"],
  ["propertyType", "bedrooms", "bathrooms", "sqft"],
  ["frequency"],
  ["name", "email", "phone", "address", "message", "consent"],
];

type Status = "idle" | "submitting" | "success" | "error";

export function QuoteForm({
  defaultService = "",
  onClose,
}: {
  defaultService?: string;
  onClose?: () => void;
}) {
  const t = useTranslations("Quote");
  const tf = useTranslations("Quote.fields");
  const tv = useTranslations("Quote.validation");
  const ts = useTranslations("Quote.steps");
  const locale = useLocale();

  const schema = useMemo(
    () =>
      z.object({
        service: z
          .string()
          .refine((v) => (serviceSlugs as readonly string[]).includes(v), {
            error: tv("serviceRequired"),
          }),
        propertyType: z
          .string()
          .refine((v) => (PROPERTY_TYPES as readonly string[]).includes(v), {
            error: tv("propertyTypeRequired"),
          }),
        bedrooms: z.string().optional(),
        bathrooms: z.string().optional(),
        sqft: z.string().optional(),
        frequency: z
          .string()
          .refine((v) => (FREQUENCIES as readonly string[]).includes(v), {
            error: tv("frequencyRequired"),
          }),
        name: z.string().min(2, tv("nameMin")),
        email: z.string().min(1, tv("emailRequired")).email(tv("emailInvalid")),
        phone: z.string().min(7, tv("phoneInvalid")),
        address: z.string().optional(),
        message: z.string().max(1000).optional(),
        consent: z.boolean().refine((v) => v === true, {
          error: tv("consentRequired"),
        }),
        company: z.string().max(0).optional(),
      }),
    [tv],
  );

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(schema) as Resolver<QuoteFormValues>,
    mode: "onTouched",
    defaultValues: {
      service: defaultService,
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      frequency: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
      consent: false,
      company: "",
    },
  });

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [devMode, setDevMode] = useState(false);
  const totalSteps = STEP_FIELDS.length;
  const { register, formState } = form;
  const { errors } = formState;

  async function next() {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, totalSteps - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: QuoteFormValues) {
    // Honeypot: bots fill hidden fields. Silently "succeed" without sending.
    if (values.company) {
      setStatus("success");
      return;
    }
    setStatus("submitting");
    try {
      const { company: _omit, ...lead } = values;
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, locale }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as { ok: boolean; dev?: boolean };
      setDevMode(Boolean(data.dev));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-secondary text-royal">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h3 className="font-heading text-xl font-bold text-navy">
          {t("success.title")}
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {t("success.body")}
        </p>
        {devMode ? (
          <p className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            {t("devNote")}
          </p>
        ) : null}
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="cta" size="lg" className="h-11 px-5">
            <a href={site.phone.href}>
              <Phone className="size-4" aria-hidden />
              {t("success.callPrompt")}
            </a>
          </Button>
          {onClose ? (
            <Button variant="outline" size="lg" className="h-11 px-5" onClick={onClose}>
              {t("buttons.done")}
            </Button>
          ) : null}
        </div>
      </div>
    );
  }

  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>{t("stepLabel", { current: step + 1, total: totalSteps })}</span>
          <span className="text-royal">{ts(`${stepKey(step)}.title`)}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-royal transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Honeypot (hidden from users & assistive tech) */}
      <div aria-hidden className="hidden">
        <label>
          Company
          <input type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
        </label>
      </div>

      <div className="min-h-[15rem]">
        {step === 0 ? (
          <Fieldset
            legend={tf("service.label")}
            description={ts("service.description")}
            error={errors.service?.message}
          >
            <div className="grid gap-2.5 sm:grid-cols-2">
              {serviceSlugs.map((slug) => (
                <OptionCard
                  key={slug}
                  label={tf(`service.options.${slug}`)}
                  value={slug}
                  iconName={getService(slug)?.icon}
                  {...register("service")}
                />
              ))}
            </div>
          </Fieldset>
        ) : null}

        {step === 1 ? (
          <Fieldset
            legend={ts("property.title")}
            description={ts("property.description")}
            error={errors.propertyType?.message}
          >
            <div className="flex flex-col gap-5">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PROPERTY_TYPES.map((pt) => (
                  <OptionCard
                    key={pt}
                    label={tf(`propertyType.options.${pt}`)}
                    value={pt}
                    {...register("propertyType")}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label={tf("bedrooms.label")} htmlFor="bedrooms">
                  <Input
                    id="bedrooms"
                    inputMode="numeric"
                    placeholder={tf("bedrooms.placeholder")}
                    {...register("bedrooms")}
                  />
                </Field>
                <Field label={tf("bathrooms.label")} htmlFor="bathrooms">
                  <Input
                    id="bathrooms"
                    inputMode="numeric"
                    placeholder={tf("bathrooms.placeholder")}
                    {...register("bathrooms")}
                  />
                </Field>
              </div>
              <Field label={tf("sqft.label")} htmlFor="sqft" hint={tf("sqft.help")}>
                <Input
                  id="sqft"
                  inputMode="numeric"
                  placeholder={tf("sqft.placeholder")}
                  {...register("sqft")}
                />
              </Field>
            </div>
          </Fieldset>
        ) : null}

        {step === 2 ? (
          <Fieldset
            legend={tf("frequency.label")}
            description={ts("frequency.description")}
            error={errors.frequency?.message}
          >
            <div className="grid gap-2.5 sm:grid-cols-2">
              {FREQUENCIES.map((f) => (
                <OptionCard
                  key={f}
                  label={tf(`frequency.options.${f}`)}
                  value={f}
                  {...register("frequency")}
                />
              ))}
            </div>
          </Fieldset>
        ) : null}

        {step === 3 ? (
          <Fieldset
            legend={ts("contact.title")}
            description={ts("contact.description")}
          >
            <div className="flex flex-col gap-4">
              <Field label={tf("name.label")} htmlFor="name" error={errors.name?.message}>
                <Input id="name" autoComplete="name" placeholder={tf("name.placeholder")} {...register("name")} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={tf("email.label")} htmlFor="email" error={errors.email?.message}>
                  <Input id="email" type="email" autoComplete="email" placeholder={tf("email.placeholder")} {...register("email")} />
                </Field>
                <Field label={tf("phone.label")} htmlFor="phone" error={errors.phone?.message}>
                  <Input id="phone" type="tel" autoComplete="tel" placeholder={tf("phone.placeholder")} {...register("phone")} />
                </Field>
              </div>
              <Field label={tf("address.label")} htmlFor="address">
                <Input id="address" autoComplete="street-address" placeholder={tf("address.placeholder")} {...register("address")} />
              </Field>
              <Field label={tf("message.label")} htmlFor="message">
                <Textarea id="message" rows={3} placeholder={tf("message.placeholder")} {...register("message")} />
              </Field>
              <label className="flex items-start gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 rounded border-input accent-royal"
                  {...register("consent")}
                />
                <span>{tf("consent.label")}</span>
              </label>
              {errors.consent?.message ? (
                <p className="text-sm text-destructive">{errors.consent.message}</p>
              ) : null}
              {status === "error" ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <p className="font-semibold">{t("error.title")}</p>
                  <p>{t("error.body")}</p>
                </div>
              ) : null}
            </div>
          </Fieldset>
        ) : null}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        {step > 0 ? (
          <Button type="button" variant="ghost" size="lg" className="h-11 px-4" onClick={back}>
            <ArrowLeft className="size-4" />
            {t("buttons.back")}
          </Button>
        ) : (
          <span />
        )}
        {step < totalSteps - 1 ? (
          <Button type="button" variant="cta" size="lg" className="h-11 px-6" onClick={next}>
            {t("buttons.next")}
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button type="submit" variant="cta" size="lg" className="h-11 px-6" disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {t("buttons.submitting")}
              </>
            ) : (
              t("buttons.submit")
            )}
          </Button>
        )}
      </div>
    </form>
  );
}

function stepKey(step: number): "service" | "property" | "frequency" | "contact" {
  return (["service", "property", "frequency", "contact"] as const)[step];
}

function Fieldset({
  legend,
  description,
  error,
  children,
}: {
  legend: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="flex flex-col gap-1">
        <span className="font-heading text-base font-semibold text-navy">{legend}</span>
        {description ? (
          <span className="text-sm text-muted-foreground">{description}</span>
        ) : null}
      </legend>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </fieldset>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

const OptionCard = function OptionCard({
  ref,
  label,
  value,
  iconName,
  ...props
}: React.ComponentProps<"input"> & {
  label: string;
  iconName?: Parameters<typeof Icon>[0]["name"];
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-navy transition-colors",
        "hover:border-sky/50 has-[:checked]:border-royal has-[:checked]:bg-secondary has-[:checked]:ring-1 has-[:checked]:ring-royal",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
      )}
    >
      <input ref={ref} type="radio" value={value} className="sr-only" {...props} />
      {iconName ? (
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-royal">
          <Icon name={iconName} className="size-4" />
        </span>
      ) : null}
      <span>{label}</span>
    </label>
  );
};
