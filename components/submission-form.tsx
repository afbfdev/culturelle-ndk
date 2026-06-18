"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";

import { submitForm } from "@/app/actions/submitForm";
import type { XassidaOption } from "@/lib/data/xassidas";
import { kamilOptions } from "@/lib/constants";
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
import { SectionCard } from "@/components/ui/section-card";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";

const today = new Date().toISOString().slice(0, 10);

type SubmissionFormProps = {
  xassidaOptions: XassidaOption[];
};

function createDefaultValues(): SubmissionFormValues {
  return {
    date: today,
    nom: "",
    prenom: "",
    kamil: [],
    zikrs: "",
    xassidas: [
      {
        xassidaId: "",
        quantity: 0
      }
    ]
  };
}

export function SubmissionForm({ xassidaOptions }: SubmissionFormProps) {
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const defaultValues = createDefaultValues();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(createSubmissionPayloadSchema(xassidaOptions)),
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange"
  });

  const selectedKamil = watch("kamil");
  const xassidas = watch("xassidas");
  const activeXassidas = xassidas.filter(
    (entry) => entry.xassidaId.trim().length > 0 && entry.quantity > 0
  ).length;
  const selectedXassidaCount = xassidas.filter(
    (entry) => entry.xassidaId.trim().length > 0
  ).length;
  const canAddXassidaRow = selectedXassidaCount < xassidaOptions.length;
  const isLoading = isSubmitting;
  const xassidaRowErrors = Array.isArray(errors.xassidas)
    ? errors.xassidas.map((entry) => {
        if (!entry) {
          return undefined;
        }

        return entry.message ?? entry.xassidaId?.message ?? entry.quantity?.message;
      })
    : [];
  const xassidaGeneralError = Array.isArray(errors.xassidas)
    ? undefined
    : errors.xassidas?.message;

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggleKamil = (value: number) => {
    const isSelected = selectedKamil.includes(value);
    const nextValues = isSelected
      ? selectedKamil.filter((entry) => entry !== value)
      : [...selectedKamil, value];

    setValue("kamil", nextValues, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const updateXassidaQuantity = (index: number, quantity: number) => {
    const safeQuantity = Number.isNaN(quantity) ? 0 : Math.max(0, quantity);
    const nextEntries = xassidas.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, quantity: safeQuantity } : entry
    );

    setValue("xassidas", nextEntries, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const updateXassidaSelection = (index: number, xassidaId: string) => {
    const nextEntries = xassidas.map((entry, entryIndex) =>
      entryIndex === index ? { ...entry, xassidaId } : entry
    );

    setValue("xassidas", nextEntries, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const addXassidaRow = () => {
    setValue(
      "xassidas",
      [...xassidas, { xassidaId: "", quantity: 0 }],
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      }
    );
  };

  const removeXassidaRow = (index: number) => {
    const nextEntries = xassidas.filter((_, entryIndex) => entryIndex !== index);

    setValue("xassidas", nextEntries.length > 0 ? nextEntries : [{ xassidaId: "", quantity: 0 }], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    const result = await submitForm(values);

    if (!result.ok) {
      setToast({
        kind: "error",
        message: result.error ?? "La soumission a echoue."
      });
      return;
    }

    reset(defaultValues);
    setToast({
      kind: "success",
      message: result.message ?? "Votre declaration a bien ete enregistree."
    });
  });

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5">
        <SectionCard
          eyebrow="Informations personnelles"
          title="Soumission individuelle"
          description="Renseignez votre identite et la date de declaration. Les messages d'erreur apparaissent en temps reel."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date de soumission</Label>
              <DatePicker id="date" {...register("date")} />
              {errors.date ? (
                <p className="text-sm text-red-700">{errors.date.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input id="nom" placeholder="Ex: Ndiaye" {...register("nom")} />
              {errors.nom ? (
                <p className="text-sm text-red-700">{errors.nom.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="prenom">Prenom</Label>
              <Input id="prenom" placeholder="Ex: Aissatou" {...register("prenom")} />
              {errors.prenom ? (
                <p className="text-sm text-red-700">{errors.prenom.message}</p>
              ) : null}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Kamil"
          title="Selectionnez les numéros completes"
          description="Touchez les tuiles correspondantes pour declarer chaque Kamil recite."
        >
          <div className="mb-4 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
            {selectedKamil.length} selectionne{selectedKamil.length > 1 ? "s" : ""}
          </div>
          <CheckboxGrid
            options={kamilOptions}
            selectedValues={selectedKamil}
            onToggle={toggleKamil}
          />
          {errors.kamil ? (
            <p className="mt-3 text-sm text-red-700">{errors.kamil.message}</p>
          ) : null}
        </SectionCard>

        <SectionCard
          eyebrow="Xassida"
          title="Selectionnez les Xassida depuis la liste"
          description="Le catalogue est alimente cote backend pour preparer son pilotage futur depuis le dashboard."
        >
          <div className="mb-4 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
            {activeXassidas} type{activeXassidas > 1 ? "s" : ""} renseigne
          </div>
          <ArrayField
            options={xassidaOptions}
            items={xassidas}
            canAddRow={canAddXassidaRow}
            onAddRow={addXassidaRow}
            onChange={updateXassidaQuantity}
            onSelectChange={updateXassidaSelection}
            onRemoveRow={removeXassidaRow}
            rowErrors={xassidaRowErrors}
          />
          {xassidaGeneralError ? (
            <p className="mt-3 text-sm text-red-700">{xassidaGeneralError}</p>
          ) : null}
        </SectionCard>

        <SectionCard
          eyebrow="Zikrs"
          title="Detaillez les zikrs effectues"
          description="Utilisez ce champ libre pour preciser les formules et les quantites."
        >
          <div className="space-y-2">
            <Label htmlFor="zikrs">Description libre</Label>
            <Textarea
              id="zikrs"
              placeholder="Ex: 500 salatoul nabi, 200 astaghfirullah..."
              {...register("zikrs")}
            />
            {errors.zikrs ? (
              <p className="text-sm text-red-700">{errors.zikrs.message}</p>
            ) : null}
          </div>
        </SectionCard>

        <div className="rounded-[28px] border border-white/60 bg-white/90 p-4 shadow-soft sm:p-5">
          <Button type="submit" className="w-full gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enregistrement en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Soumettre la declaration
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
            Les donnees sont controlees cote client puis validees cote serveur avant insertion.
          </p>
        </div>
      </form>

      {toast ? (
        <Toast
          kind={toast.kind}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
}
