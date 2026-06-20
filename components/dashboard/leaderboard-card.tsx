"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";

export type LeaderboardItem = {
  label: string;
  value: number;
};

const nf = new Intl.NumberFormat("fr-FR");
const PAGE_SIZE = 7;

export function LeaderboardCard({
  title,
  icon,
  items,
  emptyLabel
}: {
  title: string;
  icon: React.ReactNode;
  items: LeaderboardItem[];
  emptyLabel: string;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = items.slice(start, start + PAGE_SIZE);
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <Card className="animate-fade-up flex flex-col p-6">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h2 className="font-heading text-xl font-semibold">{title}</h2>
      </div>

      {items.length > 0 ? (
        <>
          <div className="mt-5 space-y-3">
            {visible.map((item, index) => (
              <div key={`${item.label}-${start + index}`} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <span className="grid h-5 w-5 place-items-center rounded-md bg-secondary text-[0.65rem] font-semibold text-primary">
                      {start + index + 1}
                    </span>
                    {item.label}
                  </span>
                  <span className="font-semibold text-primary">
                    {nf.format(item.value)}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-gold"
                    style={{ width: `${Math.max((item.value / max) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm">
              <p className="text-muted-foreground">
                {start + 1}–{Math.min(start + PAGE_SIZE, items.length)} sur {items.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  aria-label="Page précédente"
                  className="grid h-9 w-9 place-items-center rounded-full text-primary transition hover:bg-secondary/60 disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-medium">
                  {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  aria-label="Page suivante"
                  className="grid h-9 w-9 place-items-center rounded-full text-primary transition hover:bg-secondary/60 disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-5 rounded-2xl border border-dashed border-border bg-card/50 px-4 py-6 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      )}
    </Card>
  );
}
