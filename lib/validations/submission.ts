import { z } from "zod";

import { xassidaOptions } from "@/lib/constants";

export const xassidaEntrySchema = z.object({
  name: z.enum(xassidaOptions),
  quantity: z.coerce.number().int().min(0).max(999)
});

export const submissionPayloadSchema = z.object({
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
  xassidas: z
    .array(xassidaEntrySchema)
    .min(1)
    .refine(
      (entries) => entries.some((entry) => entry.quantity > 0),
      "Ajoutez au moins une quantité de Xassida."
    ),
  zikrs: z
    .string()
    .trim()
    .max(5000, "Le détail des zikrs est trop long.")
    .optional()
    .or(z.literal(""))
});

export const submissionSchema = submissionPayloadSchema.transform((value) => ({
  date: new Date(value.date),
  nom: value.nom.trim(),
  prenom: value.prenom.trim(),
  kamil: [...new Set(value.kamil)].sort((left, right) => left - right),
  xassidas: value.xassidas
    .filter((entry) => entry.quantity > 0)
    .map((entry) => ({
      name: entry.name,
      quantity: entry.quantity
    })),
  zikrs: value.zikrs?.trim() ? value.zikrs.trim() : undefined
}));

export type SubmissionFormValues = z.input<typeof submissionPayloadSchema>;
