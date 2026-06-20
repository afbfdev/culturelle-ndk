"use server";

import { getXassidaOptions, slugifyXassidaLabel } from "@/lib/data/xassidas";
import { prisma } from "@/lib/prisma";
import { createSubmissionSchema } from "@/lib/validations/submission";

export async function submitForm(values: unknown) {
  const xassidaOptions = await getXassidaOptions();
  const parsed = createSubmissionSchema(xassidaOptions).safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ??
        "Les informations soumises sont invalides."
    };
  }

  try {
    const submission = await prisma.submission.create({
      data: {
        date: parsed.data.date,
        nom: parsed.data.nom,
        prenom: parsed.data.prenom,
        kamil: parsed.data.kamil
      } as any
    });

    // Résout chaque Xassida : catalogue (id direct) ou saisie libre
    // (création/récupération via slug). Les quantités sont additionnées par id.
    const quantityByXassidaId = new Map<string, number>();

    for (const entry of parsed.data.xassidas ?? []) {
      let xassidaId = entry.id;

      if (!xassidaId && entry.customLabel) {
        const slug = slugifyXassidaLabel(entry.customLabel);
        if (!slug) {
          continue;
        }

        const xassida = await prisma.xassida.upsert({
          where: { slug },
          update: {},
          create: {
            slug,
            label: entry.customLabel,
            isActive: true,
            sortOrder: 100
          }
        });
        xassidaId = xassida.id;
      }

      if (!xassidaId) {
        continue;
      }

      quantityByXassidaId.set(
        xassidaId,
        (quantityByXassidaId.get(xassidaId) ?? 0) + entry.quantity
      );
    }

    if (quantityByXassidaId.size > 0) {
      await prisma.submissionXassida.createMany({
        data: Array.from(quantityByXassidaId, ([xassidaId, quantity]) => ({
          submissionId: submission.id,
          xassidaId,
          quantity
        }))
      });
    }

    // Zikrs : liste libre (nom + nombre), additionnés par libellé normalisé.
    const quantityByZikr = new Map<string, { label: string; quantity: number }>();
    for (const entry of parsed.data.zikrs ?? []) {
      const key = entry.label.toLowerCase();
      const existing = quantityByZikr.get(key);
      if (existing) {
        existing.quantity += entry.quantity;
      } else {
        quantityByZikr.set(key, { label: entry.label, quantity: entry.quantity });
      }
    }

    if (quantityByZikr.size > 0) {
      await prisma.submissionZikr.createMany({
        data: Array.from(quantityByZikr.values(), ({ label, quantity }) => ({
          submissionId: submission.id,
          label,
          quantity
        }))
      });
    }

    return {
      ok: true,
      message: "Votre déclaration a bien été enregistrée. Qu'Allah accepte vos réalisations."
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      error:
        "La soumission n'a pas pu être enregistrée. Vérifiez la configuration Supabase."
    };
  }
}
