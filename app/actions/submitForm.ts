"use server";

import { getXassidaOptions } from "@/lib/data/xassidas";
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
    await prisma.submission.create({
      data: {
        date: parsed.data.date,
        nom: parsed.data.nom,
        prenom: parsed.data.prenom,
        kamil: parsed.data.kamil,
        zikrs: parsed.data.zikrs,
        xassidaEntries: {
          create: parsed.data.xassidas.map((entry) => ({
            quantity: entry.quantity,
            xassida: {
              connect: {
                id: entry.id
              }
            }
          }))
        }
      }
    });

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
