"use server";

import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validations/submission";

export async function submitForm(values: unknown) {
  const parsed = submissionSchema.safeParse(values);

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
        xassidas: parsed.data.xassidas,
        zikrs: parsed.data.zikrs
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
