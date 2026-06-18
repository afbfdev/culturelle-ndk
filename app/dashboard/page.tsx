import {
  BarChart3,
  BookOpenText,
  CircleDot,
  Hash,
  Layers3,
  MessageSquareText,
  RefreshCw,
  ShieldCheck
} from "lucide-react";

import {
  createXassidaAction,
  restoreDefaultCatalogAction,
  seedDefaultXassidasAction,
  toggleXassidaStatusAction
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getDashboardData } from "@/lib/data/dashboard";

function formatDate(date: Date | null) {
  if (!date) {
    return "Aucune soumission";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatDecimal(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0
  }).format(value);
}

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="section-fade overflow-hidden border-primary/10 bg-white/92 p-6 sm:p-8">
            <p className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Dashboard Culturel
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-semibold leading-none text-foreground">
              Pilotage Xassida, Kamil et Zikrs sur un seul ecran.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              Cette interface permet d'alimenter les Xassida cote backend, puis de
              suivre les trois dimensions metier du formulaire avec des KPI separes :
              Xassida, Kamil et Zikrs.
            </p>
            {dashboard.source === "fallback" ? (
              <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                La base Prisma n'est pas encore disponible ou migree. Le dashboard
                affiche le catalogue par defaut sans KPI persistants.
              </div>
            ) : (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" />
                Donnees lues depuis PostgreSQL via Prisma
              </div>
            )}
          </Card>

          <Card className="section-fade p-6 sm:p-8">
            <div className="flex items-center gap-2 text-primary">
              <BookOpenText className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                Alimentation
              </p>
            </div>
            <form action={createXassidaAction} className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="label">Libelle Xassida</Label>
                <Input id="label" name="label" placeholder="Ex: Hizbul Falah" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Contexte ou precision utile pour le dashboard."
                  className="min-h-24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Ordre d'affichage</Label>
                <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} min={0} />
              </div>
              <Button type="submit" className="w-full">
                Ajouter ou mettre a jour la Xassida
              </Button>
            </form>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <form action={seedDefaultXassidasAction}>
                <Button type="submit" variant="secondary" className="w-full gap-2">
                  <Layers3 className="h-4 w-4" />
                  Initialiser le catalogue
                </Button>
              </form>
              <form action={restoreDefaultCatalogAction}>
                <Button type="submit" variant="ghost" className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Restaurer les valeurs par defaut
                </Button>
              </form>
            </div>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card className="section-fade p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Soumissions totales
            </p>
            <p className="mt-3 text-3xl font-semibold">{dashboard.overview.totalSubmissions}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {dashboard.overview.recentSubmissions} sur les 7 derniers jours
            </p>
          </Card>
          <Card className="section-fade p-5">
            <div className="flex items-center gap-2 text-primary">
              <BookOpenText className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Xassida actives
              </p>
            </div>
            <p className="mt-3 text-3xl font-semibold">{dashboard.xassida.kpis.activeXassidas}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              sur {dashboard.xassida.kpis.totalXassidas} dans le catalogue
            </p>
          </Card>
          <Card className="section-fade p-5">
            <div className="flex items-center gap-2 text-primary">
              <Hash className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Kamil saisis
              </p>
            </div>
            <p className="mt-3 text-3xl font-semibold">
              {dashboard.kamil.kpis.totalSelections}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {dashboard.kamil.kpis.uniqueCovered} numeros distincts couverts
            </p>
          </Card>
          <Card className="section-fade p-5">
            <div className="flex items-center gap-2 text-primary">
              <MessageSquareText className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Zikrs renseignes
              </p>
            </div>
            <p className="mt-3 text-3xl font-semibold">{dashboard.zikrs.kpis.totalWithZikrs}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {formatDecimal(dashboard.zikrs.kpis.completionRate)}% des soumissions
            </p>
          </Card>
          <Card className="section-fade p-5">
            <div className="flex items-center gap-2 text-primary">
              <BarChart3 className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Couverture
              </p>
            </div>
            <p className="mt-3 text-3xl font-semibold">
              {dashboard.xassida.kpis.activeXassidas > 0
                ? Math.round(
                    (dashboard.xassida.kpis.usedXassidas /
                      dashboard.xassida.kpis.activeXassidas) *
                      100
                  )
                : 0}
              %
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              des Xassida actives deja sollicitees
            </p>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="section-fade p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Indicateurs Xassida
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Quantite totale</span>
                <span className="font-semibold">{dashboard.xassida.kpis.totalDeclaredQuantity}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Xassida utilisees</span>
                <span className="font-semibold">{dashboard.xassida.kpis.usedXassidas}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Catalogue actif</span>
                <span className="font-semibold">
                  {dashboard.xassida.kpis.activeXassidas}/{dashboard.xassida.kpis.totalXassidas}
                </span>
              </div>
            </div>
          </Card>

          <Card className="section-fade p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Indicateurs Kamil
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Numeros couverts</span>
                <span className="font-semibold">{dashboard.kamil.kpis.uniqueCovered}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Kamil le plus cite</span>
                <span className="font-semibold">
                  {dashboard.kamil.kpis.mostSelected
                    ? `Kamil ${dashboard.kamil.kpis.mostSelected}`
                    : "Aucun"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Moyenne / soumission</span>
                <span className="font-semibold">
                  {formatDecimal(dashboard.kamil.kpis.averagePerSubmission)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="section-fade p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Indicateurs Zikrs
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Longueur moyenne</span>
                <span className="font-semibold">
                  {Math.round(dashboard.zikrs.kpis.averageLength)} caracteres
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Volume texte total</span>
                <span className="font-semibold">
                  {dashboard.zikrs.kpis.totalCharacters} caracteres
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Zikrs recents</span>
                <span className="font-semibold">{dashboard.zikrs.kpis.recentWithZikrs}</span>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <Card className="section-fade overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-border/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Catalogue et KPI
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Vision detaillee par Xassida
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                <CircleDot className="h-4 w-4 text-primary" />
                {dashboard.xassida.rows.length} lignes suivies
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-secondary/45 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Xassida</th>
                    <th className="px-6 py-4 font-semibold">Statut</th>
                    <th className="px-6 py-4 font-semibold">Soumissions</th>
                    <th className="px-6 py-4 font-semibold">Quantite</th>
                    <th className="px-6 py-4 font-semibold">Derniere activite</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.xassida.rows.map((item) => (
                    <tr key={item.id} className="border-t border-border/60 align-top">
                      <td className="px-6 py-4">
                        <p className="font-semibold">{item.label}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {item.slug}
                        </p>
                        {item.description ? (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            item.isActive
                              ? "inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                              : "inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                          }
                        >
                          {item.isActive ? "Active" : "Masquee"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">{item.submissionCount}</td>
                      <td className="px-6 py-4 font-semibold">{item.totalQuantity}</td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(item.lastSubmissionAt)}
                      </td>
                      <td className="px-6 py-4">
                        <form action={toggleXassidaStatusAction}>
                          <input type="hidden" name="id" value={item.id} />
                          <input
                            type="hidden"
                            name="nextStatus"
                            value={item.isActive ? "false" : "true"}
                          />
                          <Button type="submit" variant={item.isActive ? "ghost" : "secondary"}>
                            {item.isActive ? "Masquer" : "Activer"}
                          </Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="section-fade overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-border/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Indicateurs Kamil
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Vision detaillee par numero de Kamil
                </h2>
              </div>
            </div>
            <div className="grid gap-3 p-6 sm:grid-cols-2 xl:grid-cols-3">
              {dashboard.kamil.rows.map((item) => (
                <div
                  key={item.kamilNumber}
                  className="rounded-3xl border border-border/70 bg-white/80 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Kamil {item.kamilNumber}
                  </p>
                  <p className="mt-3 text-2xl font-semibold">{item.submissionCount}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    soumission{item.submissionCount > 1 ? "s" : ""} ayant coche ce numero
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="section-fade overflow-hidden">
            <div className="flex flex-col gap-2 border-b border-border/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Indicateurs Zikrs
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Dernieres saisies de Zikrs
                </h2>
              </div>
            </div>
            <div className="space-y-3 p-6">
              {dashboard.zikrs.recentEntries.length > 0 ? (
                dashboard.zikrs.recentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-3xl border border-border/70 bg-white/80 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold">{entry.fullName}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {entry.preview}
                      {entry.preview.length >= 140 ? "..." : ""}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-border/80 bg-white/70 p-5 text-sm text-muted-foreground">
                  Aucun zikr detaille n'est encore disponible.
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
