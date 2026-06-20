import { z } from "zod";

import { CUSTOM_XASSIDA_VALUE } from "@/lib/constants";
import type { XassidaOption } from "@/lib/data/xassidas";

export type SubmissionFormValues = {
  date: string;
  nom: string;
  prenom: string;
  kamil: number[];
  xassidas: {
    xassidaId: string;
    customLabel?: string;
    quantity: number;
  }[];
  zikrs: {
    label: string;
    quantity: number;
  }[];
};

const xassidaEntrySchema = z.object({
  xassidaId: z.string(),
  customLabel: z
    .string()
    .trim()
    .max(120, "Le nom de la Xassida est trop long.")
    .optional()
    .or(z.literal("")),
  quantity: z.coerce.number().int().min(0).max(999)
});

const zikrEntrySchema = z.object({
  label: z.string().trim().max(120, "Le nom du zikr est trop long."),
  quantity: z.coerce.number().int().min(0).max(1000000)
});

/** Clé de déduplication locale pour une Xassida saisie librement. */
function customKey(label: string) {
  return `custom:${label.trim().toLowerCase()}`;
}

export function createSubmissionPayloadSchema(xassidaOptions: XassidaOption[]) {
  const optionMap = new Map(xassidaOptions.map((option) => [option.id, option.label]));

  return z
    .object({
      date: z
        .string()
        .min(1, "La date de soumission est requise.")
        .refine((value) => !Number.isNaN(Date.parse(value)), "Date invalide."),
      nom: z
        .string()
        .trim()
        .min(2, "Le nom doit contenir au moins 2 caractères.")
        .max(80, "Le nom est trop long."),
      prenom: z
        .string()
        .trim()
        .min(2, "Le prénom doit contenir au moins 2 caractères.")
        .max(80, "Le prénom est trop long."),
      // Étape facultative : aucun Kamil n'est obligatoire.
      kamil: z.array(z.coerce.number().int().min(1).max(99)),
      // Étape facultative : aucune Xassida n'est obligatoire.
      xassidas: z.array(xassidaEntrySchema),
      // Étape facultative : aucun Zikr n'est obligatoire.
      zikrs: z.array(zikrEntrySchema)
    })
    .superRefine((value, ctx) => {
      const selectedIds = new Set<string>();

      value.xassidas.forEach((entry, index) => {
        const isCustom = entry.xassidaId === CUSTOM_XASSIDA_VALUE;
        const hasId = entry.xassidaId.trim().length > 0;
        const hasCustomLabel = (entry.customLabel ?? "").trim().length > 0;
        const hasQuantity = entry.quantity > 0;

        // Ligne entièrement vide : ignorée.
        if (!hasId && !hasQuantity && !hasCustomLabel) {
          return;
        }

        // Xassida saisie librement (« Autre »).
        if (isCustom) {
          if (!hasCustomLabel) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["xassidas", index, "customLabel"],
              message: "Indiquez le nom de la Xassida."
            });
            return;
          }

          if (!hasQuantity) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["xassidas", index],
              message: "Indiquez une quantité."
            });
            return;
          }

          const key = customKey(entry.customLabel ?? "");
          if (selectedIds.has(key)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["xassidas", index, "customLabel"],
              message: "Cette Xassida est déjà renseignée."
            });
            return;
          }

          selectedIds.add(key);
          return;
        }

        // Xassida issue du catalogue.
        if (!hasId || !hasQuantity) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["xassidas", index],
            message: "Sélectionnez une Xassida et indiquez une quantité."
          });
          return;
        }

        if (!optionMap.has(entry.xassidaId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["xassidas", index, "xassidaId"],
            message: "La Xassida sélectionnée n'est pas disponible."
          });
          return;
        }

        if (selectedIds.has(entry.xassidaId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["xassidas", index, "xassidaId"],
            message: "Cette Xassida est déjà sélectionnée."
          });
          return;
        }

        selectedIds.add(entry.xassidaId);
      });

      const zikrKeys = new Set<string>();

      value.zikrs.forEach((entry, index) => {
        const hasLabel = entry.label.trim().length > 0;
        const hasQuantity = entry.quantity > 0;

        if (!hasLabel && !hasQuantity) {
          return;
        }

        if (!hasLabel || !hasQuantity) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["zikrs", index],
            message: "Indiquez le zikr et son nombre."
          });
          return;
        }

        const key = entry.label.trim().toLowerCase();
        if (zikrKeys.has(key)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["zikrs", index, "label"],
            message: "Ce zikr est déjà renseigné."
          });
          return;
        }

        zikrKeys.add(key);
      });
    });
}

export function createSubmissionSchema(xassidaOptions: XassidaOption[]) {
  const optionMap = new Map(xassidaOptions.map((option) => [option.id, option.label]));

  return createSubmissionPayloadSchema(xassidaOptions).transform((value) => ({
    date: new Date(value.date),
    nom: value.nom.trim(),
    prenom: value.prenom.trim(),
    kamil: [...new Set(value.kamil)].sort((left, right) => left - right),
    xassidas: value.xassidas
      .filter((entry) => {
        if (entry.xassidaId === CUSTOM_XASSIDA_VALUE) {
          return (entry.customLabel ?? "").trim().length > 0 && entry.quantity > 0;
        }
        return entry.xassidaId.trim().length > 0 && entry.quantity > 0;
      })
      .map((entry) => {
        if (entry.xassidaId === CUSTOM_XASSIDA_VALUE) {
          const label = (entry.customLabel ?? "").trim();
          return {
            id: null as string | null,
            customLabel: label,
            label,
            quantity: entry.quantity
          };
        }
        return {
          id: entry.xassidaId as string | null,
          customLabel: null as string | null,
          label: optionMap.get(entry.xassidaId) ?? entry.xassidaId,
          quantity: entry.quantity
        };
      }),
    zikrs: value.zikrs
      .filter((entry) => entry.label.trim().length > 0 && entry.quantity > 0)
      .map((entry) => ({
        label: entry.label.trim(),
        quantity: entry.quantity
      }))
  }));
}
