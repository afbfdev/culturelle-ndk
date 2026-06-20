import { BookOpenText, Database, Plus, ShieldCheck } from "lucide-react";

import { Arabesque } from "@/components/site/arabesque";
import { XassidaForm } from "@/components/admin/xassida-form";
import { XassidaTable } from "@/components/admin/xassida-table";
import { Card } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data/dashboard";

const nf = new Intl.NumberFormat("fr-FR");

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getDashboardData();

  const kpis = [
    { label: "Soumissions", value: data.overview.totalSubmissions },
    {
      label: "Xassidas actives",
      value: `${data.xassida.kpis.activeXassidas}/${data.xassida.kpis.totalXassidas}`
    },
    { label: "Quantité déclarée", value: data.xassida.kpis.totalDeclaredQuantity },
    { label: "Xassidas utilisées", value: data.xassida.kpis.usedXassidas }
  ];

  return (
    <main className="px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* ---- En-tête ---- */}
        <section className="relative overflow-hidden rounded-4xl border border-border/70 bg-card/75 px-6 py-9 shadow-soft sm:px-10">
          <div className="pointer-events-none absolute inset-0 text-primary/[0.05]">
            <Arabesque id="admin-veil" size={60} />
          </div>
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
              Espace gestion
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-primary sm:text-4xl">
              Catalogue des Xassidas
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              Alimentez et pilotez la liste des Xassidas proposées dans le
              formulaire. Les modifications sont reflétées immédiatement côté
              déclarant et sur le mur communautaire.
            </p>
            {data.source === "fallback" ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold-soft/50 px-4 py-2 text-sm text-primary">
                <Database className="h-4 w-4" />
                Base non connectée — catalogue par défaut affiché, sans persistance.
              </p>
            ) : (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="h-4 w-4 text-gold" />
                Données sécurisées
              </p>
            )}
          </div>
        </section>

        {/* ---- KPIs ---- */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {kpi.label}
              </p>
              <p className="mt-3 font-heading text-3xl font-semibold text-primary">
                {typeof kpi.value === "number" ? nf.format(kpi.value) : kpi.value}
              </p>
            </Card>
          ))}
        </section>

        {/* ---- Formulaire d'ajout ---- */}
        <section>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-primary">
              <Plus className="h-5 w-5 text-gold" />
              <h2 className="font-heading text-xl font-semibold">
                Ajouter ou mettre à jour
              </h2>
            </div>
            <XassidaForm />
          </Card>
        </section>

        {/* ---- Tableau du catalogue ---- */}
        <section>
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border/60 px-6 py-5 text-primary">
              <BookOpenText className="h-5 w-5 text-gold" />
              <h2 className="font-heading text-xl font-semibold">
                {data.xassida.rows.length} Xassidas suivies
              </h2>
            </div>
            <XassidaTable rows={data.xassida.rows} />
          </Card>
        </section>
      </div>
    </main>
  );
}
