"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";

export type DeclarationItem = {
  id: string;
  fullName: string;
  createdAt: Date;
  kamilCount: number;
  xassidaQuantity: number;
  zikrQuantity: number;
};

const PAGE_SIZE = 6;

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

function initials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Pill({
  children,
  gold = false
}: {
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <span
      className={
        gold
          ? "rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-primary"
          : "rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary"
      }
    >
      {children}
    </span>
  );
}

export function DeclarationsFeed({
  declarations,
  lastSubmissionAt
}: {
  declarations: DeclarationItem[];
  lastSubmissionAt: Date | null;
}) {
  const totalPages = Math.max(1, Math.ceil(declarations.length / PAGE_SIZE));
  const [page, setPage] = useState(1);
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = declarations.slice(start, start + PAGE_SIZE);

  return (
    <Card className="animate-fade-up overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-5">
        <h2 className="font-heading text-xl font-semibold text-primary">
          Dernières déclarations
        </h2>
        <span className="text-xs text-muted-foreground">
          Mise à jour : {formatDate(lastSubmissionAt)}
        </span>
      </div>

      {declarations.length > 0 ? (
        <>
          <div className="divide-y divide-border/50">
            {visible.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft font-heading text-base font-semibold text-primary">
                    {initials(entry.fullName)}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">
                      {entry.fullName || "Anonyme"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {entry.kamilCount > 0 ? (
                    <Pill>{entry.kamilCount} Jukki</Pill>
                  ) : null}
                  {entry.xassidaQuantity > 0 ? (
                    <Pill>{entry.xassidaQuantity} Xassidas</Pill>
                  ) : null}
                  {entry.zikrQuantity > 0 ? (
                    <Pill gold>{entry.zikrQuantity} Zikrs</Pill>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-6 py-4 text-sm">
              <p className="text-muted-foreground">
                {start + 1}–{Math.min(start + PAGE_SIZE, declarations.length)} sur{" "}
                {declarations.length}
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
                  Page {safePage} / {totalPages}
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
        <div className="px-6 py-10 text-center">
          <p className="rounded-2xl border border-dashed border-border bg-card/50 px-4 py-6 text-center text-sm text-muted-foreground">
            Aucune déclaration pour l&apos;instant.{" "}
            <Link href="/" className="font-semibold text-primary underline">
              Soyez le premier à déclarer.
            </Link>
          </p>
        </div>
      )}
    </Card>
  );
}
