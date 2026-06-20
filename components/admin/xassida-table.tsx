"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { toggleXassidaStatusAction } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";

export type XassidaTableRow = {
  id: string;
  label: string;
  description?: string | null;
  isActive: boolean;
  submissionCount: number;
  totalQuantity: number;
  lastSubmissionAt: Date | null;
};

const PAGE_SIZE = 8;

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

export function XassidaTable({ rows }: { rows: XassidaTableRow[] }) {
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const [page, setPage] = useState(1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = rows.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-semibold">Xassida</th>
              <th className="px-6 py-3 font-semibold">Statut</th>
              <th className="px-6 py-3 font-semibold">Soumissions</th>
              <th className="px-6 py-3 font-semibold">Quantité</th>
              <th className="px-6 py-3 font-semibold">Dernière activité</th>
              <th className="px-6 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {visible.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="px-6 py-4">
                  <p className="font-semibold text-foreground">{item.label}</p>
                  {item.description ? (
                    <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={
                      item.isActive
                        ? "inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"
                        : "inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground"
                    }
                  >
                    {item.isActive ? "Active" : "Masquée"}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold">{item.submissionCount}</td>
                <td className="px-6 py-4 font-semibold">{item.totalQuantity}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatDate(item.lastSubmissionAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <form action={toggleXassidaStatusAction} className="inline">
                    <input type="hidden" name="id" value={item.id} />
                    <input
                      type="hidden"
                      name="nextStatus"
                      value={item.isActive ? "false" : "true"}
                    />
                    <Button
                      type="submit"
                      variant={item.isActive ? "ghost" : "secondary"}
                      className="h-9 px-4"
                    >
                      {item.isActive ? "Masquer" : "Activer"}
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-6 py-4 text-sm">
          <p className="text-muted-foreground">
            {start + 1}–{Math.min(start + PAGE_SIZE, rows.length)} sur {rows.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="h-9 w-9 px-0"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              aria-label="Page précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              Page {safePage} / {totalPages}
            </span>
            <Button
              variant="ghost"
              className="h-9 w-9 px-0"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              aria-label="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
