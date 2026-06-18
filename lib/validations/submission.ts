import { z } from "zod";

import type { XassidaOption } from "@/lib/data/xassidas";

export type SubmissionFormValues = {
  date: string;
  nom: string;
  prenom: string;
  kamil: number[];
  xassidas: {
    xassidaId: string;
    quantity: number;
  }[];
  zikrs?: string;
};

const xassidaEntrySchema = z.object({
  xassidaId: z.string(),
  quantity: z.coerce.number().int().min(0).max(999)
});

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
      kamil: z
        .array(z.coerce.number().int().min(1).max(99))
        .min(1, "Sélectionnez au moins un Kamil."),
      xassidas: z.array(xassidaEntrySchema).min(1, "Ajoutez au moins une Xassida."),
      zikrs: z
        .string()
        .trim()
        .max(5000, "Le détail des zikrs est trop long.")
        .optional()
        .or(z.literal(""))
    })
    .superRefine((value, ctx) => {
      const selectedIds = new Set<string>();
      let completeEntries = 0;

      value.xassidas.forEach((entry, index) => {
        const hasId = entry.xassidaId.trim().length > 0;
        const hasQuantity = entry.quantity > 0;

        if (!hasId && !hasQuantity) {
          return;
        }

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
        completeEntries += 1;
      });

      if (completeEntries === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["xassidas"],
          message: "Ajoutez au moins une Xassida avec sa quantité."
        });
      }
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
      .filter((entry) => entry.xassidaId.trim().length > 0 && entry.quantity > 0)
      .map((entry) => ({
        id: entry.xassidaId,
        label: optionMap.get(entry.xassidaId) ?? entry.xassidaId,
        quantity: entry.quantity
      })),
    zikrs: value.zikrs?.trim() ? value.zikrs.trim() : undefined
  }));
}
