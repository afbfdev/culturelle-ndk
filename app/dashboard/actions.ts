"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  defaultXassidaCatalog,
  ensureDefaultXassidas,
  slugifyXassidaLabel
} from "@/lib/data/xassidas";

const createXassidaSchema = z.object({
  label: z
    .string()
    .trim()
    .min(2, "Le libelle doit contenir au moins 2 caracteres.")
    .max(120, "Le libelle est trop long."),
  description: z
    .string()
    .trim()
    .max(500, "La description est trop longue.")
    .optional()
    .or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0)
});

export async function seedDefaultXassidasAction() {
  try {
    await ensureDefaultXassidas();
  } catch (error) {
    console.error(error);
  } finally {
    revalidatePath("/");
    revalidatePath("/dashboard");
  }
}

export async function createXassidaAction(formData: FormData) {
  const parsed = createXassidaSchema.safeParse({
    label: formData.get("label"),
    description: formData.get("description"),
    sortOrder: formData.get("sortOrder")
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Donnees invalides.");
  }

  const slug = slugifyXassidaLabel(parsed.data.label);

  if (!slug) {
    throw new Error("Impossible de generer un identifiant valide pour cette Xassida.");
  }

  try {
    await prisma.xassida.upsert({
      where: {
        slug
      },
      update: {
        label: parsed.data.label,
        description: parsed.data.description || null,
        isActive: true,
        sortOrder: parsed.data.sortOrder
      },
      create: {
        slug,
        label: parsed.data.label,
        description: parsed.data.description || null,
        isActive: true,
        sortOrder: parsed.data.sortOrder
      }
    });
  } catch (error) {
    console.error(error);
  } finally {
    revalidatePath("/");
    revalidatePath("/dashboard");
  }
}

export async function toggleXassidaStatusAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const nextStatus = String(formData.get("nextStatus") ?? "") === "true";

  if (!id) {
    throw new Error("Identifiant Xassida manquant.");
  }

  try {
    await prisma.xassida.update({
      where: {
        id
      },
      data: {
        isActive: nextStatus
      }
    });
  } catch (error) {
    console.error(error);
  } finally {
    revalidatePath("/");
    revalidatePath("/dashboard");
  }
}

export async function restoreDefaultCatalogAction() {
  try {
    for (const item of defaultXassidaCatalog) {
      await prisma.xassida.upsert({
        where: {
          slug: item.slug
        },
        update: {
          label: item.label,
          description: item.description,
          sortOrder: item.sortOrder
        },
        create: item
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    revalidatePath("/");
    revalidatePath("/dashboard");
  }
}
