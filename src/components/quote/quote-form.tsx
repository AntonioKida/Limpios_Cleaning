"use client";

import { useMemo, useRef, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  KeyRound,
  Loader2,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/icon";
import { getService } from "@/content/services";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

// The form forks on the first question. Values map to Quote.fields.*.options.* keys.
const AUDIENCES = ["business", "property-manager"] as const;
const SPACE_TYPES = ["office", "retail", "medical", "construction", "other"] as const;
// Business services — a subset of the catalog; labels reuse Quote.fields.service.options.*.
const BUSINESS_SERVICES = ["commercial", "post-construction", "window-cleaning", "carpet-cleaning"] as const;
const BUSINESS_FREQ = ["daily", "weekly", "monthly", "onetime"] as const;
const FLOORING = ["carpet", "lvt", "lvp", "marble"] as const;
const PM_CARPET = ["none", "steam", "steam-deodorizer"] as const;
const PREFERRED_CONTACT = ["phone", "email", "text"] as const;

type QuoteFormValues = {
  audience: string;
  // business
  spaceType?: string;
  services?: string[];
  restrooms?: string;
  offices?: string;
  conferenceRooms?: string;
  windows?: string;
  flooring?: string;
  lastCleaning?: string;
  firstTimeDeepClean?: boolean;
  blindsType?: string;
  specialSurfaces?: string;
  // property-manager
  bedrooms?: string;
  bathrooms?: string;
  sqft?: string;
  carpetCleaning?: string;
  appliances?: boolean;
  blinds?: boolean;
  lvtSteam?: boolean;
  lvtSteamGrout?: boolean;
  // shared
  frequency?: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  preferredContact?: string;
  message?: string;
  consent: boolean;
  website?: string; // honeypot
};

// Fields validated when leaving each step. The details step (1) is all-optional.
const STEP_FIELDS: (keyof QuoteFormValues)[][] = [
  ["audience"],
  [],
  ["name", "company", "email", "phone", "preferredContact", "message", "consent"],
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

  // ?service= prefill: only when it's one of the business services — pre-pick the
  // business audience + check that service so the CTA lands mid-flow.
  const isBizService = Boolean(
    defaultService && (BUSINESS_SERVICES as readonly string[]).includes(defaultService),
  );

  const schema = useMemo(
    () =>
      z.object({
        audience: z.preprocess(
          (v) => v ?? "",
          z.string().refine((v) => (AUDIENCES as readonly string[]).includes(v), {
            error: tv("audienceRequired"),
          }),
        ),
        spaceType: z.string().optional(),
        services: z.array(z.string()).optional(),
        restrooms: z.string().optional(),
        offices: z.string().optional(),
        conferenceRooms: z.string().optional(),
        windows: z.string().optional(),
        flooring: z.string().optional(),
        lastCleaning: z.string().optional(),
        firstTimeDeepClean: z.boolean().optional(),
        blindsType: z.string().optional(),
        specialSurfaces: z.string().optional(),
        bedrooms: z.string().optional(),
        bathrooms: z.string().optional(),
        sqft: z.string().optional(),
        carpetCleaning: z.string().optional(),
        appliances: z.boolean().optional(),
        blinds: z.boolean().optional(),
        lvtSteam: z.boolean().optional(),
        lvtSteamGrout: z.boolean().optional(),
        frequency: z.string().optional(),
        name: z.string().min(1, tv("nameRequired")).min(2, tv("nameMin")),
        company: z.string().max(160).optional(),
        email: z.string().min(1, tv("emailRequired")).email(tv("emailInvalid")),
        phone: z.string().min(1, tv("phoneRequired")).min(7, tv("phoneInvalid")),
        preferredContact: z.string().optional(),
        message: z.string().max(2000).optional(),
        consent: z.boolean().refine((v) => v === true, { error: tv("consentRequired") }),
        website: z.string().max(0).optional(),
      }),
    [tv],
  );

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(schema) as Resolver<QuoteFormValues>,
    mode: "onTouched",
    defaultValues: {
      audience: isBizService ? "business" : "",
      spaceType: "",
      services: isBizService ? [defaultService] : [],
      restrooms: "",
      offices: "",
      conferenceRooms: "",
      windows: "",
      flooring: "",
      lastCleaning: "",
      firstTimeDeepClean: false,
      blindsType: "",
      specialSurfaces: "",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      carpetCleaning: "",
      appliances: false,
      blinds: false,
      lvtSteam: false,
      lvtSteamGrout: false,
      frequency: "",
      name: "",
      company: "",
      email: "",
      phone: "",
      preferredContact: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [devMode, setDevMode] = useState(false);
  // "The user tried to move on and could not." Scoped to the CURRENT step and reset
  // by any navigation, so a freshly-entered step is always clean. RHF's global
  // `isSubmitted` never resets, which is why it cannot be used here.
  //
  // This gates the step-0 audience error too. That error cannot gate on
  // `touchedFields` like the contact fields do: `trigger()` does not mark a field
  // touched, so the Next-with-nothing-selected error would never appear. Left
  // ungated it had the opposite bug — merely focusing and blurring the radio (which
  // the dialog used to do on open, all by itself) was enough to paint it red.
  const [attemptedAdvance, setAttemptedAdvance] = useState(false);
  const submittingRef = useRef(false);
  const totalSteps = STEP_FIELDS.length;
  const { register, formState } = form;
  const { errors, touchedFields } = formState;
  // An error is shown once it is EARNED: either the user engaged that field and left
  // it invalid (blur), or they tried to advance and could not. Nothing red on arrival.
  //
  // `attemptedAdvance` is load-bearing here, not just belt-and-braces. RHF's
  // handleSubmit does not mark fields touched, so gating on `touchedFields` alone
  // meant a failed submit identified NO field — the user got one generic summary line
  // and no way to tell which inputs were wrong. That is a WCAG 3.3.1 (Level A) miss,
  // and axe cannot see it.
  const fieldError = (name: keyof QuoteFormValues) =>
    touchedFields[name] || attemptedAdvance ? errors[name]?.message : undefined;

  /** Ties an input to its error text so assistive tech announces the two together. */
  const errorProps = (name: keyof QuoteFormValues) =>
    fieldError(name)
      ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` }
      : {};
  const audience = useWatch({ control: form.control, name: "audience" });

  async function next() {
    const fields = STEP_FIELDS[step];
    const valid = fields.length === 0 ? true : await form.trigger(fields);
    if (!valid) {
      setAttemptedAdvance(true); // now the error is earned, so show it
      return;
    }
    setAttemptedAdvance(false); // a newly-entered step always renders clean
    setStep((s) => Math.min(s + 1, totalSteps - 1));
  }
  function back() {
    setAttemptedAdvance(false);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function onSubmit(values: QuoteFormValues) {
    if (submittingRef.current) return;
    if (values.website) {
      setStatus("success"); // honeypot: silently "succeed" without sending
      return;
    }
    submittingRef.current = true;
    setStatus("submitting");
    try {
      const { website: _omit, ...lead } = values;
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
    } finally {
      submittingRef.current = false;
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-secondary text-royal">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h3 className="font-heading text-xl font-bold text-navy">{t("success.title")}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{t("success.body")}</p>
        {devMode ? (
          <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
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
    // onSubmit reads submittingRef only inside the deferred submit handler.
    // eslint-disable-next-line react-hooks/refs
    <form onSubmit={form.handleSubmit(onSubmit, () => setAttemptedAdvance(true))} noValidate className="flex flex-col gap-8">
      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
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

      {/* Honeypot */}
      <div aria-hidden className="hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="min-h-[15rem]">
        {/* STEP 0 — audience fork */}
        {step === 0 ? (
          <Fieldset
            legend={tf("audience.label")}
            description={ts("audience.description")}
            error={attemptedAdvance ? errors.audience?.message : undefined}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <OptionCard
                label={tf("audience.options.business")}
                sublabel={tf("audience.hint.business")}
                value="business"
                icon={<Building2 className="size-5" />}
                {...register("audience", {
                  // Clear the "who are you?" error the moment they pick one —
                  // otherwise it stays stuck on screen after they've fixed it.
                  onChange: () => form.clearErrors("audience"),
                })}
              />
              <OptionCard
                label={tf("audience.options.property-manager")}
                sublabel={tf("audience.hint.property-manager")}
                value="property-manager"
                icon={<KeyRound className="size-5" />}
                {...register("audience", {
                  // Clear the "who are you?" error the moment they pick one —
                  // otherwise it stays stuck on screen after they've fixed it.
                  onChange: () => form.clearErrors("audience"),
                })}
              />
            </div>
          </Fieldset>
        ) : null}

        {/* STEP 1 — branch details (all optional) */}
        {step === 1 ? (
          <Fieldset legend={ts("details.title")} description={ts("details.description")}>
            {audience === "business" ? (
              <div className="flex flex-col gap-7">
                <FieldGroup label={tf("spaceType.label")}>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {SPACE_TYPES.map((s) => (
                      <OptionCard key={s} label={tf(`spaceType.options.${s}`)} value={s} {...register("spaceType")} />
                    ))}
                  </div>
                </FieldGroup>

                <FieldGroup label={tf("servicesNeeded.label")} hint={tf("servicesNeeded.description")}>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {BUSINESS_SERVICES.map((s) => (
                      <CheckCard
                        key={s}
                        label={tf(`service.options.${s}`)}
                        value={s}
                        iconName={getService(s)?.icon}
                        {...register("services")}
                      />
                    ))}
                  </div>
                </FieldGroup>

                <FieldGroup label={tf("businessFrequency.label")}>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {BUSINESS_FREQ.map((f) => (
                      <OptionCard key={f} label={tf(`frequency.options.${f}`)} value={f} {...register("frequency")} />
                    ))}
                  </div>
                </FieldGroup>

                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  <NumberField id="restrooms" label={tf("restrooms.label")} placeholder={tf("restrooms.placeholder")} reg={register("restrooms")} />
                  <NumberField id="offices" label={tf("offices.label")} placeholder={tf("offices.placeholder")} reg={register("offices")} />
                  <NumberField id="conferenceRooms" label={tf("conferenceRooms.label")} placeholder={tf("conferenceRooms.placeholder")} reg={register("conferenceRooms")} />
                  <NumberField id="windows" label={tf("windows.label")} placeholder={tf("windows.placeholder")} reg={register("windows")} />
                </div>

                <FieldGroup label={tf("flooring.label")}>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {FLOORING.map((f) => (
                      <OptionCard key={f} label={tf(`flooring.options.${f}`)} value={f} {...register("flooring")} />
                    ))}
                  </div>
                </FieldGroup>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={tf("lastCleaning.label")} htmlFor="lastCleaning">
                    <Input id="lastCleaning" placeholder={tf("lastCleaning.placeholder")} {...register("lastCleaning")} />
                  </Field>
                  <Field label={tf("blindsType.label")} htmlFor="blindsType">
                    <Input id="blindsType" placeholder={tf("blindsType.placeholder")} {...register("blindsType")} />
                  </Field>
                </div>
                <Field label={tf("specialSurfaces.label")} htmlFor="specialSurfaces">
                  <Input id="specialSurfaces" placeholder={tf("specialSurfaces.placeholder")} {...register("specialSurfaces")} />
                </Field>

                <Toggle label={tf("firstTimeDeepClean.label")} hint={tf("firstTimeDeepClean.hint")} {...register("firstTimeDeepClean")} />
              </div>
            ) : (
              <div className="flex flex-col gap-7">
                <div className="grid grid-cols-3 gap-5">
                  <NumberField id="bedrooms" label={tf("bedrooms.label")} placeholder={tf("bedrooms.placeholder")} reg={register("bedrooms")} />
                  <NumberField id="bathrooms" label={tf("bathrooms.label")} placeholder={tf("bathrooms.placeholder")} reg={register("bathrooms")} />
                  <NumberField id="sqft" label={tf("sqft.label")} placeholder={tf("sqft.placeholder")} reg={register("sqft")} />
                </div>

                <FieldGroup label={tf("carpetCleaning.label")}>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {PM_CARPET.map((c) => (
                      <OptionCard key={c} label={tf(`carpetCleaning.options.${c}`)} value={c} {...register("carpetCleaning")} />
                    ))}
                  </div>
                </FieldGroup>

                <FieldGroup label={tf("pmExtras.label")}>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    <Toggle label={tf("appliances.label")} {...register("appliances")} />
                    <Toggle label={tf("blinds.label")} {...register("blinds")} />
                    <Toggle label={tf("lvtSteam.label")} {...register("lvtSteam")} />
                    <Toggle label={tf("lvtSteamGrout.label")} {...register("lvtSteamGrout")} />
                  </div>
                </FieldGroup>
              </div>
            )}
          </Fieldset>
        ) : null}

        {/* STEP 2 — contact (shared) */}
        {step === 2 ? (
          <Fieldset legend={ts("contact.title")} description={ts("contact.description")}>
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={tf("name.label")} htmlFor="name" error={fieldError("name")}>
                  <Input id="name" autoComplete="name" placeholder={tf("name.placeholder")} {...errorProps("name")} {...register("name")} />
                </Field>
                <Field label={tf("company.label")} htmlFor="company">
                  <Input id="company" autoComplete="organization" placeholder={tf("company.placeholder")} {...register("company")} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={tf("email.label")} htmlFor="email" error={fieldError("email")}>
                  <Input id="email" type="email" autoComplete="email" placeholder={tf("email.placeholder")} {...errorProps("email")} {...register("email")} />
                </Field>
                <Field label={tf("phone.label")} htmlFor="phone" error={fieldError("phone")}>
                  <Input id="phone" type="tel" autoComplete="tel" placeholder={tf("phone.placeholder")} {...errorProps("phone")} {...register("phone")} />
                </Field>
              </div>
              <FieldGroup label={tf("preferredContact.label")}>
                <div className="grid grid-cols-3 gap-2.5">
                  {PREFERRED_CONTACT.map((c) => (
                    <OptionCard key={c} label={tf(`preferredContact.options.${c}`)} value={c} {...register("preferredContact")} />
                  ))}
                </div>
              </FieldGroup>
              <Field label={tf("message.label")} htmlFor="message">
                <Textarea id="message" rows={3} placeholder={tf("message.placeholder")} {...register("message")} />
              </Field>
              <label className="flex items-start gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 rounded border-input accent-royal"
                  {...errorProps("consent")}
                  {...register("consent")}
                />
                <span>{tf("consent.label")}</span>
              </label>
              {fieldError("consent") ? (
                <p id="consent-error" className="text-sm text-destructive">
                  {fieldError("consent")}
                </p>
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

      {/* Calm summary after a failed submit — never a per-field wall on arrival. */}
      {step === totalSteps - 1 && attemptedAdvance && Object.keys(errors).length > 0 ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {tv("incompleteForm")}
        </p>
      ) : null}

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
        {/* The `key`s are load-bearing. Without them React reuses ONE DOM node for
            both buttons and just rewrites `type` — and on the details step `next()`
            never awaits (no fields to validate), so that rewrite lands synchronously
            INSIDE the click dispatch. The browser then reads the fresh type="submit"
            when it runs the click's default action and submits the form the user
            never submitted, failing validation and painting the contact step red on
            arrival. Distinct keys unmount the Next button instead of mutating it, so
            the clicked node is detached before any default action can fire. */}
        {step < totalSteps - 1 ? (
          <Button key="next" type="button" variant="cta" size="lg" className="h-11 px-6" onClick={next}>
            {t("buttons.next")}
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button key="submit" type="submit" variant="cta" size="lg" className="h-11 px-6" disabled={status === "submitting"}>
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

function stepKey(step: number): "audience" | "details" | "contact" {
  return (["audience", "details", "contact"] as const)[step];
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
        {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
      </legend>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </fieldset>
  );
}

/** A labelled group inside a step (for radio/checkbox clusters). */
function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-sm font-semibold text-navy">{label}</span>
      {hint ? <span className="-mt-1.5 text-sm text-muted-foreground">{hint}</span> : null}
      {children}
    </div>
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
      {/* Reserve a consistent label height so side-by-side fields keep their
          inputs on the same line even if one label wraps. */}
      <Label htmlFor={htmlFor} className="min-h-6 leading-tight">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Small numeric input (count/area). Inputs stay ≥16px via the shared Input. */
function NumberField({
  id,
  label,
  placeholder,
  reg,
}: {
  id: string;
  label: string;
  placeholder?: string;
  reg: React.ComponentProps<"input">;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* min-h reserves a consistent label height so the inputs in a row stay
          aligned even when one label wraps to two lines. */}
      <Label htmlFor={id} className="min-h-8 text-xs leading-tight">
        {label}
      </Label>
      <Input id={id} inputMode="numeric" placeholder={placeholder} {...reg} />
    </div>
  );
}

const OptionCard = function OptionCard({
  ref,
  label,
  sublabel,
  value,
  icon,
  ...props
}: React.ComponentProps<"input"> & {
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
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
      {icon ? (
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-royal">
          {icon}
        </span>
      ) : null}
      <span className="flex flex-col">
        <span>{label}</span>
        {sublabel ? <span className="text-xs font-normal text-muted-foreground">{sublabel}</span> : null}
      </span>
    </label>
  );
};

/** Multi-select card (checkbox) — same look as OptionCard, for services etc. */
const CheckCard = function CheckCard({
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
      <input ref={ref} type="checkbox" value={value} className="sr-only" {...props} />
      {iconName ? (
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-royal">
          <Icon name={iconName} className="size-4" />
        </span>
      ) : null}
      <span>{label}</span>
    </label>
  );
};

/** Boolean checkbox styled as a togglable pill (add-on questions). */
const Toggle = function Toggle({
  ref,
  label,
  hint,
  ...props
}: React.ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-medium text-navy transition-colors",
        "hover:border-sky/50 has-[:checked]:border-royal has-[:checked]:bg-secondary",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        className="mt-0.5 size-4 shrink-0 rounded border-input accent-royal"
        {...props}
      />
      <span className="flex flex-col">
        <span>{label}</span>
        {hint ? <span className="text-xs font-normal text-muted-foreground">{hint}</span> : null}
      </span>
    </label>
  );
};
