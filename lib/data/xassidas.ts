import { prisma } from "@/lib/prisma";

export type XassidaOption = {
  id: string;
  slug: string;
  label: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
};

export const defaultXassidaCatalog: Omit<XassidaOption, "id">[] = [
  { slug: "nourou-darayni", label: "Nourou Darayni", description: "Recitations Nourou Darayni", isActive: true, sortOrder: 1 },
  { slug: "jazboul-qoulob", label: "Jazboul Qoulob", description: "Recitations Jazboul Qoulob", isActive: true, sortOrder: 2 },
  { slug: "matlaboul-fawzayni", label: "Matlaboul Fawzayni", description: "Recitations Matlaboul Fawzayni", isActive: true, sortOrder: 3 },
  { slug: "mawahibou-nafih", label: "Mawahibou Nafih", description: "Recitations Mawahibou Nafih", isActive: true, sortOrder: 4 },
  { slug: "tazawudou-cighar", label: "Tazawudou Cighar", description: "Recitations Tazawudou Cighar", isActive: true, sortOrder: 5 },
  { slug: "massalikoul-jinaan", label: "Massalikoul Jinaan", description: "Recitations Massalikoul Jinaan", isActive: true, sortOrder: 6 },
  { slug: "khadimou-rassoul", label: "Khadimou Rassoul", description: "Recitations Khadimou Rassoul", isActive: true, sortOrder: 7 },
  { slug: "wassilatoul-mouna", label: "Wassilatoul Mouna", description: "Recitations Wassilatoul Mouna", isActive: true, sortOrder: 8 },
  { slug: "tayssir", label: "Tayssir", description: "Recitations Tayssir", isActive: true, sortOrder: 9 },
  { slug: "autre-xassida", label: "Autre Xassida", description: "Autres recitations Xassida", isActive: true, sortOrder: 10 }
];

export function slugifyXassidaLabel(label: string) {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapFallbackCatalog() {
  return defaultXassidaCatalog.map((entry) => ({
    id: entry.slug,
    ...entry
  }));
}

export async function ensureDefaultXassidas() {
  const existingCount = await prisma.xassida.count();

  if (existingCount > 0) {
    return;
  }

  await prisma.xassida.createMany({
    data: defaultXassidaCatalog,
    skipDuplicates: true
  });
}

export async function getXassidaCatalogState(options?: {
  includeInactive?: boolean;
}) {
  try {
    await ensureDefaultXassidas();

    const xassidas = await prisma.xassida.findMany({
      where: options?.includeInactive ? undefined : { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
      select: {
        id: true,
        slug: true,
        label: true,
        description: true,
        isActive: true,
        sortOrder: true
      }
    });

    return {
      source: "database" as const,
      options: xassidas
    };
  } catch (error) {
    console.error(error);

    return {
      source: "fallback" as const,
      options: mapFallbackCatalog()
    };
  }
}

export async function getXassidaOptions() {
  const state = await getXassidaCatalogState();
  return state.options;
}
