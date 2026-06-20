import Image from "next/image";

import { Bismillah } from "@/components/site/bismillah";
import { Arabesque } from "@/components/site/arabesque";
import { SubmissionWizard } from "@/components/wizard/submission-wizard";
import { getXassidaOptions } from "@/lib/data/xassidas";

const pillars = [
  {
    image: "/assets/images/coran.png",
    title: "Coran (Jukki)",
    text: "Déclarez chaque lecture complète du Coran achevée."
  },
  {
    image: "/assets/images/khassida.png",
    title: "Xassidas",
    text: "Comptabilisez les Xassidas de Cheikh Ahmadou Bamba récitées."
  },
  {
    image: "/assets/images/zikr.png",
    title: "Zikrs",
    text: "Détaillez vos formules de rappel et leurs quantités."
  }
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const xassidaOptions = await getXassidaOptions();

  return (
    <main className="px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
      <div className="mx-auto max-w-3xl">
        {/* ---- Hero ---- */}
        <section className="relative overflow-hidden rounded-4xl border border-border/70 bg-card/70 px-6 py-10 text-center shadow-soft sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute inset-0 text-primary/[0.05]">
            <Arabesque id="hero-veil" size={60} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full bg-gold/20 blur-3xl" />

          <div className="relative flex flex-col items-center gap-5">
            <Bismillah />

            <p className="inline-flex rounded-full border border-gold/30 bg-gold-soft/60 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-primary">
              Daara Nouroud Darayni · Kaolack
            </p>

            <h1 className="text-balance font-heading text-4xl font-semibold leading-[1.05] text-primary sm:text-5xl">
              Déclarez vos réalisations spirituelles pour le Magal 2026
            </h1>

            <div className="gold-rule w-24" />

            <p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground">
              La Commission Culturelle NDK remplace l&apos;ancien formulaire par un
              parcours guidé, simple et serein. Renseignez vos Jukki, vos Xassidas
              et vos Zikrs en quelques étapes — vos œuvres rejoignent celles de
              toute la Daara.
            </p>

            <div className="mt-2 grid w-full gap-3 sm:grid-cols-3">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-3xl border border-border/70 bg-card/80 p-4 text-left"
                >
                  <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-white p-1.5 ring-1 ring-border/70">
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <p className="mt-3 font-semibold text-foreground">{pillar.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {pillar.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Wizard ---- */}
        <section className="mt-8">
          <SubmissionWizard xassidaOptions={xassidaOptions} />
        </section>
      </div>
    </main>
  );
}
