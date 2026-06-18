import { prisma } from "@/lib/prisma";
import { kamilOptions } from "@/lib/constants";
import { getXassidaCatalogState } from "@/lib/data/xassidas";

export async function getDashboardData() {
  const catalogState = await getXassidaCatalogState({ includeInactive: true });

  if (catalogState.source === "fallback") {
    return {
      source: "fallback" as const,
      overview: {
        totalSubmissions: 0,
        recentSubmissions: 0
      },
      xassida: {
        kpis: {
          totalXassidas: catalogState.options.length,
          activeXassidas: catalogState.options.filter((item) => item.isActive).length,
          totalDeclaredQuantity: 0,
          usedXassidas: 0
        },
        rows: catalogState.options.map((item) => ({
          ...item,
          submissionCount: 0,
          totalQuantity: 0,
          lastSubmissionAt: null as Date | null
        }))
      },
      kamil: {
        kpis: {
          totalSelections: 0,
          uniqueCovered: 0,
          mostSelected: null as number | null,
          averagePerSubmission: 0
        },
        rows: kamilOptions.map((value) => ({
          kamilNumber: value,
          submissionCount: 0
        }))
      },
      zikrs: {
        kpis: {
          totalWithZikrs: 0,
          completionRate: 0,
          totalCharacters: 0,
          averageLength: 0,
          recentWithZikrs: 0
        },
        recentEntries: [] as Array<{
          id: string;
          fullName: string;
          preview: string;
          createdAt: Date;
        }>
      }
    };
  }

  const now = Date.now();
  const recentWindow = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const [submissions, quantityAggregate, xassidas] =
    await Promise.all([
      prisma.submission.findMany({
        orderBy: {
          createdAt: "desc"
        },
        select: {
          id: true,
          nom: true,
          prenom: true,
          kamil: true,
          zikrs: true,
          createdAt: true
        }
      }),
      prisma.submissionXassida.aggregate({
        _sum: {
          quantity: true
        }
      }),
      prisma.xassida.findMany({
        orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
        select: {
          id: true,
          slug: true,
          label: true,
          description: true,
          isActive: true,
          sortOrder: true,
          submissionEntries: {
            select: {
              quantity: true,
              createdAt: true
            },
            orderBy: {
              createdAt: "desc"
            }
          }
        }
      })
    ]);

  const totalSubmissions = submissions.length;
  const recentSubmissions = submissions.filter(
    (submission) => submission.createdAt >= recentWindow
  ).length;

  const xassidaRows = xassidas.map((item) => ({
    id: item.id,
    slug: item.slug,
    label: item.label,
    description: item.description,
    isActive: item.isActive,
    sortOrder: item.sortOrder,
    submissionCount: item.submissionEntries.length,
    totalQuantity: item.submissionEntries.reduce(
      (sum, entry) => sum + entry.quantity,
      0
    ),
    lastSubmissionAt: item.submissionEntries[0]?.createdAt ?? null
  }));

  const allKamilSelections = submissions.flatMap((submission) => submission.kamil);
  const kamilCounter = new Map<number, number>();

  for (const kamil of allKamilSelections) {
    kamilCounter.set(kamil, (kamilCounter.get(kamil) ?? 0) + 1);
  }

  const allKnownKamils = Array.from(
    new Set([...kamilOptions, ...Array.from(kamilCounter.keys())])
  ).sort((left, right) => left - right);

  const kamilRows = allKnownKamils.map((value) => ({
    kamilNumber: value,
    submissionCount: kamilCounter.get(value) ?? 0
  }));

  const topKamilRow = kamilRows.reduce<{
    kamilNumber: number;
    submissionCount: number;
  } | null>((best, current) => {
    if (!best || current.submissionCount > best.submissionCount) {
      return current;
    }

    return best;
  }, null);
  const mostSelectedKamil =
    topKamilRow && topKamilRow.submissionCount > 0 ? topKamilRow.kamilNumber : null;

  const zikrSubmissions = submissions.filter(
    (submission) => submission.zikrs?.trim().length
  );
  const totalZikrCharacters = zikrSubmissions.reduce(
    (sum, submission) => sum + (submission.zikrs?.trim().length ?? 0),
    0
  );
  const recentWithZikrs = zikrSubmissions.filter(
    (submission) => submission.createdAt >= recentWindow
  ).length;
  const recentZikrEntries = zikrSubmissions.slice(0, 5).map((submission) => ({
    id: submission.id,
    fullName: `${submission.prenom} ${submission.nom}`,
    preview: (submission.zikrs ?? "").trim().slice(0, 140),
    createdAt: submission.createdAt
  }));

  return {
    source: "database" as const,
    overview: {
      totalSubmissions,
      recentSubmissions
    },
    xassida: {
      kpis: {
        totalXassidas: xassidaRows.length,
        activeXassidas: xassidaRows.filter((item) => item.isActive).length,
        totalDeclaredQuantity: quantityAggregate._sum.quantity ?? 0,
        usedXassidas: xassidaRows.filter((item) => item.submissionCount > 0).length
      },
      rows: xassidaRows
    },
    kamil: {
      kpis: {
        totalSelections: allKamilSelections.length,
        uniqueCovered: kamilRows.filter((item) => item.submissionCount > 0).length,
        mostSelected: mostSelectedKamil,
        averagePerSubmission:
          totalSubmissions > 0 ? allKamilSelections.length / totalSubmissions : 0
      },
      rows: kamilRows
    },
    zikrs: {
      kpis: {
        totalWithZikrs: zikrSubmissions.length,
        completionRate:
          totalSubmissions > 0 ? (zikrSubmissions.length / totalSubmissions) * 100 : 0,
        totalCharacters: totalZikrCharacters,
        averageLength:
          zikrSubmissions.length > 0
            ? totalZikrCharacters / zikrSubmissions.length
            : 0,
        recentWithZikrs
      },
      recentEntries: recentZikrEntries
    }
  };
}
