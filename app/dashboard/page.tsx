import {
  BookOpenText,
  Hash,
  Radio,
  Sparkles,
  Trophy,
  Users
} from "lucide-react";

import { Arabesque } from "@/components/site/arabesque";
import { DeclarationsFeed } from "@/components/dashboard/declarations-feed";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { Card } from "@/components/ui/card";
import { getCommunityData } from "@/lib/data/dashboard";

const nf = new Intl.NumberFormat("fr-FR");

export const dynamic = "force-dynamic";

export default async function CommunityWallPage() {
  const data = await getCommunityData();
  const { totals, objective } = data;

  const counters = [
    {
      icon: Users,
      value: totals.participants,
      label: "Participants",
      hint: `${nf.format(totals.recentParticipants)} cette semaine`
    },
    {
      icon: Hash,
      value: totals.kamilDeclared,
      label: "Jukki déclarés",
      hint: "Lectures complètes du Coran"
    },
    {
      icon: BookOpenText,
      value: totals.xassidasRecited,
      label: "Xassidas récitées",
      hint: "Toutes Xassidas confondues"
    },
    {
      icon: Sparkles,
      value: totals.zikrsRecited,
      label: "Zikrs récités",
      hint: "Tous zikrs confondus"
    }
  ];

  const maxKamil = Math.max(
    1,
    ...data.kamilDistribution.map((item) => item.submissionCount)
  );

  return (
    <main className="px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* ---- En-tête ---- */}
        <section className="relative overflow-hidden rounded-4xl border border-border/70 bg-card/75 px-6 py-10 text-center shadow-soft sm:px-10">
          <div className="pointer-events-none absolute inset-0 text-primary/[0.05]">
            <Arabesque id="wall-veil" size={60} />
          </div>
          <div className="relative flex flex-col items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-soft/60 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-primary">
              <Radio className="h-3.5 w-3.5 text-gold" />
              {data.source === "database" ? "En direct" : "Aperçu"}
            </span>
            <h1 className="text-balance font-heading text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              Ensemble vers le Magal 2026
            </h1>
            <div className="gold-rule w-24" />
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Le mur des réalisations spirituelles du Daara Nouroud Darayni.
              Chaque déclaration fait grandir l&apos;œuvre collective.
            </p>
            {data.source === "fallback" ? (
              <p className="rounded-2xl border border-gold/30 bg-gold-soft/50 px-4 py-2 text-sm text-primary">
                La base de données n&apos;est pas encore connectée — les compteurs
                s&apos;animeront dès les premières déclarations.
              </p>
            ) : null}
          </div>
        </section>

        {/* ---- Compteurs ---- */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {counters.map((counter) => (
            <Card key={counter.label} className="animate-fade-up p-5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-soft text-primary">
                <counter.icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-heading text-4xl font-semibold leading-none text-primary">
                {nf.format(counter.value)}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {counter.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{counter.hint}</p>
            </Card>
          ))}
        </section>

        {/* ---- Jauge objectif ---- */}
        <section>
          <Card className="animate-fade-up overflow-hidden p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                  Objectif symbolique du Magal
                </p>
                <h2 className="mt-1.5 font-heading text-2xl font-semibold text-primary">
                  {nf.format(objective.current)} Jukki sur {nf.format(objective.target)}
                </h2>
              </div>
              <p className="font-heading text-4xl font-semibold text-gold">
                {objective.percent}%
              </p>
            </div>
            <div className="progress-track mt-5 h-4 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-[width] duration-700 ease-out"
                style={{ width: `${Math.max(objective.percent, 2)}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Une jauge collective pour porter ensemble la communauté vers le Magal.
              Chaque Jukki déclaré rapproche le Daara de son objectif.
            </p>
          </Card>
        </section>

        {/* ---- Classement Xassidas + Couverture Jukki ---- */}
        <section className="grid gap-4 lg:grid-cols-2">
          <LeaderboardCard
            title="Xassidas les plus récitées"
            icon={<Trophy className="h-5 w-5 text-gold" />}
            items={data.topXassidas
              .filter((item) => item.totalQuantity > 0)
              .map((item) => ({ label: item.label, value: item.totalQuantity }))}
            emptyLabel="Aucune Xassida récitée pour le moment."
          />

          <LeaderboardCard
            title="Zikrs les plus partagés"
            icon={<Sparkles className="h-5 w-5 text-gold" />}
            items={data.topZikrs.map((item) => ({
              label: item.label,
              value: item.totalQuantity
            }))}
            emptyLabel="Aucun zikr déclaré pour le moment."
          />
        </section>

        {/* ---- Couverture des Jukki ---- */}
        <section>
          <Card className="animate-fade-up p-6">
            <div className="flex items-center gap-2 text-primary">
              <Hash className="h-5 w-5 text-gold" />
              <h2 className="font-heading text-xl font-semibold">
                Couverture des Jukki
              </h2>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Intensité = nombre de participants ayant complété chaque Jukki.
            </p>
            <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-10">
              {data.kamilDistribution.map((item) => {
                const ratio = item.submissionCount / maxKamil;
                const active = item.submissionCount > 0;
                return (
                  <div
                    key={item.kamilNumber}
                    title={`Jukki ${item.kamilNumber} · ${item.submissionCount} participant(s)`}
                    className="flex aspect-square flex-col items-center justify-center rounded-xl border text-center"
                    style={
                      active
                        ? {
                            backgroundColor: `hsl(158 66% 18% / ${0.15 + ratio * 0.85})`,
                            borderColor: "transparent",
                            color: ratio > 0.45 ? "hsl(44 56% 97%)" : "hsl(158 44% 12%)"
                          }
                        : {
                            backgroundColor: "hsl(var(--secondary))",
                            borderColor: "hsl(var(--border))",
                            color: "hsl(var(--muted-foreground))"
                          }
                    }
                  >
                    <span className="font-heading text-lg font-semibold leading-none">
                      {item.kamilNumber}
                    </span>
                    <span className="text-[0.6rem] opacity-80">
                      {item.submissionCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* ---- Flux des dernières déclarations ---- */}
        <section>
          <DeclarationsFeed
            declarations={data.recentDeclarations}
            lastSubmissionAt={data.lastSubmissionAt}
          />
        </section>
      </div>
    </main>
  );
}
