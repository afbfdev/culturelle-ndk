import Image from "next/image";
import { BookHeart, DatabaseZap, ShieldCheck } from "lucide-react";

import { SubmissionForm } from "@/components/submission-form";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Commission Culturelle NDK
            </p>
            <div className="space-y-4">
              <h1 className="max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-semibold leading-none text-foreground sm:text-6xl">
                Centraliser les realisations spirituelles du Magal 2026, avec une experience simple sur mobile.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Cette interface reprend les codes du logo NDK avec une palette
                vert emeraude, or et blanc, tout en offrant une saisie rapide,
                une validation en temps reel et une soumission securisee via Server Action.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-soft">
                <BookHeart className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">Parcours mobile-first</p>
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-soft">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">Validation client et serveur</p>
              </div>
              <div className="rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-soft">
                <DatabaseZap className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">Prisma pret pour Supabase</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-primary/20 via-accent/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white/82 p-5 shadow-soft backdrop-blur sm:p-6">
              <div className="pattern-overlay rounded-[28px] border border-primary/10 bg-gradient-to-br from-white via-secondary/35 to-white p-6">
                <div className="mx-auto flex max-w-sm items-center gap-4">
                  <div className="rounded-[28px] bg-white/90 p-3 shadow-soft">
                    <Image
                      src="/assets/images/logondk.png"
                      alt="Logo NDK"
                      width={110}
                      height={110}
                      className="h-[88px] w-[88px] object-contain sm:h-[110px] sm:w-[110px]"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                      Nouroud Darayni
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-heading)] text-3xl font-semibold leading-none">
                      Kaolack
                    </p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      Formulaire de declaration culturelle structure par sections, optimise pour smartphone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SubmissionForm />
      </div>
    </main>
  );
}
