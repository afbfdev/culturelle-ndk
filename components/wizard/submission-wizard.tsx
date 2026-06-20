"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  PartyPopper,
  Send,
  Sparkles
} from "lucide-react";

import { submitForm } from "@/app/actions/submitForm";
import type { XassidaOption } from "@/lib/data/xassidas";
import { CUSTOM_XASSIDA_VALUE, kamilOptions } from "@/lib/constants";
import {
  createSubmissionPayloadSchema,
  type SubmissionFormValues
} from "@/lib/validations/submission";
import { ArrayField } from "@/components/ui/array-field";
import { Button } from "@/components/ui/button";
import { CheckboxGrid } from "@/components/ui/checkbox-grid";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ZikrField } from "@/components/ui/zikr-field";
import { Toast } from "@/components/ui/toast";
import { Arabesque } from "@/components/site/arabesque";
import { Stepper } from "@/components/wizard/stepper";
import { cn } from "@/lib/utils";

const today = new Date().toISOString().slice(0, 10);

const MAX_XASSIDA_ROWS = 30;

type StepId = "identite" | "kamil" | "xassida" | "zikr" | "recap";

const steps: {
  id: StepId;
  title: string;
  fields: (keyof SubmissionFormValues)[];
}[] = [
  { id: "identite", title: "Identité", fields: ["date", "nom", "prenom"] },
  { id: "kamil", title: "Coran", fields: ["kamil"] },
  { id: "xassida", title: "Xassidas", fields: ["xassidas"] },
  { id: "zikr", title: "Zikrs", fields: ["zikrs"] },
  { id: "recap", title: "Récap", fields: [] }
];

type SubmissionWizardProps = {
  xassidaOptions: XassidaOption[];
};

function createDefaultValues(): SubmissionFormValues {
  return {
    date: today,
    nom: "",
    prenom: "",
    kamil: [],
    zikrs: [{ label: "", quantity: 0 }],
    xassidas: [{ xassidaId: "", quantity: 0 }]
  };
}

export function SubmissionWizard({ xassidaOptions }: SubmissionWizardProps) {
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const defaultValues = useMemo(() => createDefaultValues(), []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(createSubmissionPayloadSchema(xassidaOptions)),
    defaultValues,
    mode: "onTouched"
  });

  const selectedKamil = watch("kamil");
  const xassidas = watch("xassidas");
  const zikrs = watch("zikrs");
  const formValues = watch();
  const xassidaLabelById = useMemo(
    () => new Map(xassidaOptions.map((option) => [option.id, option.label])),
    [xassidaOptions]
  );

  const activeXassidas = xassidas.filter((entry) =>
    entry.xassidaId === CUSTOM_XASSIDA_VALUE
      ? (entry.customLabel ?? "").trim().length > 0 && entry.quantity > 0
      : entry.xassidaId.trim().length > 0 && entry.quantity > 0
  );
  const canAddXassidaRow = xassidas.length < MAX_XASSIDA_ROWS;

  const xassidaRowErrors = Array.isArray(errors.xassidas)
    ? errors.xassidas.map((entry) =>
        entry
          ? entry.message ??
            entry.customLabel?.message ??
            entry.xassidaId?.message ??
            entry.quantity?.message
          : undefined
      )
    : [];
  const xassidaGeneralError = Array.isArray(errors.xassidas)
    ? undefined
    : errors.xassidas?.message;

  const activeZikrs = zikrs.filter(
    (entry) => entry.label.trim().length > 0 && entry.quantity > 0
  );
  const canAddZikrRow = zikrs.length < MAX_XASSIDA_ROWS;
  const zikrRowErrors = Array.isArray(errors.zikrs)
    ? errors.zikrs.map((entry) =>
        entry
          ? entry.message ?? entry.label?.message ?? entry.quantity?.message
          : undefined
      )
    : [];

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggleKamil = (value: number) => {
    const isSelected = selectedKamil.includes(value);
    const next = isSelected
      ? selectedKamil.filter((entry) => entry !== value)
      : [...selectedKamil, value];

    setValue("kamil", next, { shouldDirty: true, shouldValidate: true });
  };

  const updateXassidaQuantity = (index: number, quantity: number) => {
    const safe = Number.isNaN(quantity) ? 0 : Math.max(0, quantity);
    setValue(
      "xassidas",
      xassidas.map((entry, i) => (i === index ? { ...entry, quantity: safe } : entry)),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const updateXassidaSelection = (index: number, xassidaId: string) => {
    setValue(
      "xassidas",
      xassidas.map((entry, i) =>
        i === index
          ? {
              ...entry,
              xassidaId,
              // On conserve le texte libre seulement si « Autre » reste choisi.
              customLabel:
                xassidaId === CUSTOM_XASSIDA_VALUE ? entry.customLabel ?? "" : ""
            }
          : entry
      ),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const updateXassidaCustomLabel = (index: number, customLabel: string) => {
    setValue(
      "xassidas",
      xassidas.map((entry, i) => (i === index ? { ...entry, customLabel } : entry)),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const addXassidaRow = () => {
    setValue("xassidas", [...xassidas, { xassidaId: "", quantity: 0 }], {
      shouldDirty: true
    });
  };

  const removeXassidaRow = (index: number) => {
    const next = xassidas.filter((_, i) => i !== index);
    setValue("xassidas", next.length > 0 ? next : [{ xassidaId: "", quantity: 0 }], {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const updateZikrLabel = (index: number, label: string) => {
    setValue(
      "zikrs",
      zikrs.map((entry, i) => (i === index ? { ...entry, label } : entry)),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const updateZikrQuantity = (index: number, quantity: number) => {
    const safe = Number.isNaN(quantity) ? 0 : Math.max(0, quantity);
    setValue(
      "zikrs",
      zikrs.map((entry, i) => (i === index ? { ...entry, quantity: safe } : entry)),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const addZikrRow = () => {
    setValue("zikrs", [...zikrs, { label: "", quantity: 0 }], { shouldDirty: true });
  };

  const removeZikrRow = (index: number) => {
    const next = zikrs.filter((_, i) => i !== index);
    setValue("zikrs", next.length > 0 ? next : [{ label: "", quantity: 0 }], {
      shouldDirty: true,
      shouldValidate: true
    });
  };

  const goNext = async () => {
    const fields = steps[current].fields;
    const valid = fields.length === 0 ? true : await trigger(fields);
    if (!valid) return;
    setCurrent((value) => Math.min(value + 1, steps.length - 1));
  };

  const goBack = () => setCurrent((value) => Math.max(value - 1, 0));

  const doSubmit = handleSubmit(async (values) => {
    const result = await submitForm(values);

    if (!result.ok) {
      setToast({ kind: "error", message: result.error ?? "La soumission a échoué." });
      return;
    }

    reset(createDefaultValues());
    setSubmitted(true);
    setToast({
      kind: "success",
      message: result.message ?? "Votre déclaration a bien été enregistrée."
    });
  });

  const isLastStep = current === steps.length - 1;

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLastStep) {
      void doSubmit();
    } else {
      void goNext();
    }
  };

  const restart = () => {
    reset(createDefaultValues());
    setSubmitted(false);
    setCurrent(0);
  };

  if (submitted) {
    return (
      <SuccessPanel onRestart={restart}>
        {toast ? (
          <Toast kind={toast.kind} message={toast.message} onClose={() => setToast(null)} />
        ) : null}
      </SuccessPanel>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-4xl border border-border/70 bg-card/85 shadow-soft backdrop-blur-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 text-primary/[0.06]">
          <Arabesque id="wizard-veil" size={56} />
        </div>

        <div className="relative border-b border-border/60 px-5 py-6 sm:px-8">
          <Stepper steps={steps} current={current} />
        </div>

        <form onSubmit={onFormSubmit} className="relative px-5 py-6 sm:px-8 sm:py-8">
          <div key={current} className="animate-step-in">
            {steps[current].id === "identite" ? (
              <StepShell
                eyebrow="Qui déclare ?"
                title="Vos informations"
                description="Renseignez votre identité et la date de votre déclaration."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Prénom" error={errors.prenom?.message}>
                    <Input placeholder="Ex : Aïssatou" {...register("prenom")} />
                  </Field>
                  <Field label="Nom" error={errors.nom?.message}>
                    <Input placeholder="Ex : Ndiaye" {...register("nom")} />
                  </Field>
                  <Field
                    className="sm:col-span-2"
                    label="Date de déclaration"
                    error={errors.date?.message}
                  >
                    <DatePicker {...register("date")} />
                  </Field>
                </div>
              </StepShell>
            ) : null}

            {steps[current].id === "kamil" ? (
              <StepShell
                eyebrow="Coran"
                optional
                title="Vos Jukki complétés"
                description="Touchez chaque numéro de Jukki (lecture complète du Coran) que vous avez achevé. Laissez vide si rien à déclarer."
                counter={`${selectedKamil.length} sélectionné${selectedKamil.length > 1 ? "s" : ""}`}
              >
                <CheckboxGrid
                  options={kamilOptions}
                  selectedValues={selectedKamil}
                  onToggle={toggleKamil}
                />
                {errors.kamil ? (
                  <p className="mt-3 text-sm text-red-700">{errors.kamil.message}</p>
                ) : null}
              </StepShell>
            ) : null}

            {steps[current].id === "xassida" ? (
              <StepShell
                eyebrow="Xassidas"
                optional
                title="Vos Xassidas récitées"
                description="Sélectionnez chaque Xassida et indiquez le nombre de fois où vous l'avez récitée. Laissez vide si rien à déclarer."
                counter={`${activeXassidas.length} renseignée${activeXassidas.length > 1 ? "s" : ""}`}
              >
                <ArrayField
                  options={xassidaOptions}
                  items={xassidas}
                  canAddRow={canAddXassidaRow}
                  onAddRow={addXassidaRow}
                  onChange={updateXassidaQuantity}
                  onSelectChange={updateXassidaSelection}
                  onCustomLabelChange={updateXassidaCustomLabel}
                  onRemoveRow={removeXassidaRow}
                  rowErrors={xassidaRowErrors}
                />
                {xassidaGeneralError ? (
                  <p className="mt-3 text-sm text-red-700">{xassidaGeneralError}</p>
                ) : null}
              </StepShell>
            ) : null}

            {steps[current].id === "zikr" ? (
              <StepShell
                eyebrow="Zikrs"
                optional
                title="Vos Zikrs effectués"
                description="Indiquez chaque formule et le nombre de fois récité. Laissez vide si rien à déclarer."
                counter={`${activeZikrs.length} renseigné${activeZikrs.length > 1 ? "s" : ""}`}
              >
                <ZikrField
                  items={zikrs}
                  canAddRow={canAddZikrRow}
                  onAddRow={addZikrRow}
                  onLabelChange={updateZikrLabel}
                  onQuantityChange={updateZikrQuantity}
                  onRemoveRow={removeZikrRow}
                  rowErrors={zikrRowErrors}
                />
                {!Array.isArray(errors.zikrs) && errors.zikrs?.message ? (
                  <p className="mt-3 text-sm text-red-700">{errors.zikrs.message}</p>
                ) : null}
              </StepShell>
            ) : null}

            {steps[current].id === "recap" ? (
              <RecapStep
                values={formValues}
                activeXassidas={activeXassidas}
                xassidaLabelById={xassidaLabelById}
              />
            ) : null}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={current === 0 || isSubmitting}
              className={cn("gap-2", current === 0 && "invisible")}
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>

            {isLastStep ? (
              <Button type="submit" variant="gold" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Confirmer ma déclaration
                  </>
                )}
              </Button>
            ) : (
              <Button type="submit" className="gap-2">
                Continuer
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>

      {toast ? (
        <Toast kind={toast.kind} message={toast.message} onClose={() => setToast(null)} />
      ) : null}
    </>
  );
}

/* ---------- Sous-composants internes ---------- */

type StepShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  counter?: string;
  optional?: boolean;
  children: React.ReactNode;
};

function StepShell({
  eyebrow,
  title,
  description,
  counter,
  optional = false,
  children
}: StepShellProps) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              {eyebrow}
            </p>
            {optional ? (
              <span className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Facultatif
              </span>
            ) : null}
          </div>
          <h3 className="mt-1.5 font-heading text-2xl font-semibold text-primary sm:text-3xl">
            {title}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {counter ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {counter}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function RecapStep({
  values,
  activeXassidas,
  xassidaLabelById
}: {
  values: SubmissionFormValues;
  activeXassidas: { xassidaId: string; customLabel?: string; quantity: number }[];
  xassidaLabelById: Map<string, string>;
}) {
  const formattedDate = (() => {
    const parsed = new Date(values.date);
    return Number.isNaN(parsed.getTime())
      ? values.date
      : new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(parsed);
  })();

  const sortedKamil = [...values.kamil].sort((a, b) => a - b);
  const activeZikrsRecap = values.zikrs.filter(
    (entry) => entry.label.trim().length > 0 && entry.quantity > 0
  );

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
          Dernière vérification
        </p>
        <h3 className="mt-1.5 font-heading text-2xl font-semibold text-primary sm:text-3xl">
          Récapitulatif
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Vérifiez vos informations avant de confirmer votre déclaration.
        </p>
      </div>

      <div className="space-y-3">
        <RecapRow label="Déclarant">
          {values.prenom} {values.nom}
        </RecapRow>
        <RecapRow label="Date">{formattedDate}</RecapRow>
        <RecapRow label="Jukki (Coran)">
          {sortedKamil.length > 0 ? (
            <span className="flex flex-wrap gap-1.5">
              {sortedKamil.map((value) => (
                <span
                  key={value}
                  className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-primary px-1.5 text-xs font-semibold text-primary-foreground"
                >
                  {value}
                </span>
              ))}
            </span>
          ) : (
            <span className="text-muted-foreground">Aucun</span>
          )}
        </RecapRow>
        <RecapRow label="Xassidas">
          {activeXassidas.length > 0 ? (
            <span className="flex flex-col gap-1.5">
              {activeXassidas.map((entry, i) => {
                const label =
                  entry.xassidaId === CUSTOM_XASSIDA_VALUE
                    ? entry.customLabel ?? "Xassida"
                    : xassidaLabelById.get(entry.xassidaId) ?? entry.xassidaId;
                return (
                  <span
                    key={`${entry.xassidaId}-${i}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <span>{label}</span>
                    <span className="rounded-md bg-gold-soft px-2 py-0.5 text-xs font-semibold text-primary">
                      ×{entry.quantity}
                    </span>
                  </span>
                );
              })}
            </span>
          ) : (
            <span className="text-muted-foreground">Aucune</span>
          )}
        </RecapRow>
        <RecapRow label="Zikrs">
          {activeZikrsRecap.length > 0 ? (
            <span className="flex flex-col gap-1.5">
              {activeZikrsRecap.map((entry, i) => (
                <span
                  key={`${entry.label}-${i}`}
                  className="flex items-center justify-between gap-3"
                >
                  <span>{entry.label}</span>
                  <span className="rounded-md bg-gold-soft px-2 py-0.5 text-xs font-semibold text-primary">
                    ×{entry.quantity}
                  </span>
                </span>
              ))}
            </span>
          ) : (
            <span className="text-muted-foreground">Non renseignés</span>
          )}
        </RecapRow>
      </div>
    </div>
  );
}

function RecapRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 rounded-2xl border border-border/70 bg-card/60 p-4 sm:grid-cols-[140px_1fr] sm:gap-4">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{children}</span>
    </div>
  );
}

function SuccessPanel({
  onRestart,
  children
}: {
  onRestart: () => void;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="relative overflow-hidden rounded-4xl border border-border/70 bg-card/90 px-6 py-12 text-center shadow-soft sm:px-10">
        <div className="pointer-events-none absolute inset-0 text-primary/[0.05]">
          <Arabesque id="success-veil" size={56} />
        </div>
        <div className="relative mx-auto flex max-w-md flex-col items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <p className="font-arabic text-2xl text-gold" lang="ar" dir="rtl">
            جزاك الله خيرا
          </p>
          <h3 className="font-heading text-3xl font-semibold text-primary">
            Déclaration enregistrée
          </h3>
          <p className="text-sm leading-7 text-muted-foreground">
            Qu&apos;Allah accepte vos réalisations et vous compte parmi les serviteurs
            dévoués du Magal 2026. Votre contribution rejoint celle de toute la Daara.
          </p>
          <div className="mt-2">
            <Button onClick={onRestart} className="gap-2">
              <PartyPopper className="h-4 w-4" />
              Nouvelle déclaration
            </Button>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
