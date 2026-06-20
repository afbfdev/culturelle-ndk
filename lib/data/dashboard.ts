import { prisma } from "@/lib/prisma";
import { kamilOptions } from "@/lib/constants";
import { ensureDefaultXassidas, getXassidaCatalogState } from "@/lib/data/xassidas";

/** Objectif symbolique de Kamil pour le Magal — sert de jauge motivante. */
export const COMMUNITY_KAMIL_OBJECTIVE = 450;

export type CommunityData = Awaited<ReturnType<typeof getCommunityData>>;

function emptyCommunityData(source: "fallback") {
  return {
    source,
    totals: {
      participants: 0,
      kamilDeclared: 0,
      xassidasRecited: 0,
      zikrsRecited: 0,
      totalWorks: 0,
      recentParticipants: 0
    },
    objective: {
      target: COMMUNITY_KAMIL_OBJECTIVE,
      current: 0,
      percent: 0
    },
    topXassidas: [] as Array<{
      label: string;
      totalQuantity: number;
      submissionCount: number;
    }>,
    topZikrs: [] as Array<{
      label: string;
      totalQuantity: number;
      count: number;
    }>,
    kamilDistribution: kamilOptions.map((value) => ({
      kamilNumber: value,
      submissionCount: 0
    })),
    recentDeclarations: [] as Array<{
      id: string;
      fullName: string;
      createdAt: Date;
      kamilCount: number;
      xassidaCount: number;
      xassidaQuantity: number;
      zikrQuantity: number;
    }>,
    lastSubmissionAt: null as Date | null
  };
}

/**
 * Données du « mur communautaire » : totaux collectifs, jauge vers le Magal,
 * classement des Xassidas, couverture des Kamil et flux des dernières déclarations.
 */
export async function getCommunityData() {
  try {
    await ensureDefaultXassidas();

    const recentWindow = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [submissions, quantityAggregate, xassidas] = await Promise.all([
      prisma.submission.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          nom: true,
          prenom: true,
          kamil: true,
          createdAt: true,
          xassidaEntries: { select: { quantity: true } },
          zikrEntries: { select: { label: true, quantity: true } }
        }
      }),
      prisma.submissionXassida.aggregate({ _sum: { quantity: true } }),
      prisma.xassida.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
        select: {
          id: true,
          label: true,
          submissionEntries: { select: { quantity: true } }
        }
      })
    ]);

    const participants = submissions.length;
    const kamilDeclared = submissions.reduce(
      (sum, item) => sum + item.kamil.length,
      0
    );
    const xassidasRecited = quantityAggregate._sum.quantity ?? 0;
    const zikrsRecited = submissions.reduce(
      (sum, item) =>
        sum + item.zikrEntries.reduce((acc, entry) => acc + entry.quantity, 0),
      0
    );
    const recentParticipants = submissions.filter(
      (item) => item.createdAt >= recentWindow
    ).length;

    // Classement des zikrs par libellé normalisé (la casse n'importe pas).
    const zikrCounter = new Map<
      string,
      { label: string; totalQuantity: number; count: number }
    >();
    for (const submission of submissions) {
      for (const entry of submission.zikrEntries) {
        const key = entry.label.trim().toLowerCase();
        const current = zikrCounter.get(key);
        if (current) {
          current.totalQuantity += entry.quantity;
          current.count += 1;
        } else {
          zikrCounter.set(key, {
            label: entry.label,
            totalQuantity: entry.quantity,
            count: 1
          });
        }
      }
    }
    const topZikrs = Array.from(zikrCounter.values()).sort(
      (a, b) => b.totalQuantity - a.totalQuantity
    );

    const topXassidas = xassidas
      .map((item) => ({
        label: item.label,
        totalQuantity: item.submissionEntries.reduce(
          (sum, entry) => sum + entry.quantity,
          0
        ),
        submissionCount: item.submissionEntries.length
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity);

    const kamilCounter = new Map<number, number>();
    for (const submission of submissions) {
      for (const value of submission.kamil) {
        kamilCounter.set(value, (kamilCounter.get(value) ?? 0) + 1);
      }
    }
    const kamilDistribution = Array.from(
      new Set([...kamilOptions, ...kamilCounter.keys()])
    )
      .sort((a, b) => a - b)
      .map((value) => ({
        kamilNumber: value,
        submissionCount: kamilCounter.get(value) ?? 0
      }));

    const recentDeclarations = submissions.map((item) => ({
      id: item.id,
      fullName: `${item.prenom} ${item.nom}`.trim(),
      createdAt: item.createdAt,
      kamilCount: item.kamil.length,
      xassidaCount: item.xassidaEntries.length,
      xassidaQuantity: item.xassidaEntries.reduce(
        (sum, entry) => sum + entry.quantity,
        0
      ),
      zikrQuantity: item.zikrEntries.reduce(
        (sum, entry) => sum + entry.quantity,
        0
      )
    }));

    return {
      source: "database" as const,
      totals: {
        participants,
        kamilDeclared,
        xassidasRecited,
        zikrsRecited,
        totalWorks: kamilDeclared + xassidasRecited + zikrsRecited,
        recentParticipants
      },
      objective: {
        target: COMMUNITY_KAMIL_OBJECTIVE,
        current: kamilDeclared,
        percent: Math.min(
          100,
          Math.round((kamilDeclared / COMMUNITY_KAMIL_OBJECTIVE) * 100)
        )
      },
      topXassidas,
      topZikrs,
      kamilDistribution,
      recentDeclarations,
      lastSubmissionAt: submissions[0]?.createdAt ?? null
    };
  } catch (error) {
    console.error(error);
    return emptyCommunityData("fallback");
  }
}

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
