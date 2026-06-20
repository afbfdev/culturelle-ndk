import { cn } from "@/lib/utils";

type BismillahProps = {
  className?: string;
  withTranslit?: boolean;
};

/**
 * Bismillah calligraphié (Amiri). Ouvre les pages dans l'esprit du Daara.
 */
export function Bismillah({ className, withTranslit = false }: BismillahProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1 text-gold", className)}>
      <p
        dir="rtl"
        lang="ar"
        className="font-arabic text-2xl leading-none sm:text-3xl"
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
      {withTranslit ? (
        <p className="text-[0.65rem] uppercase tracking-[0.32em] text-muted-foreground">
          Au nom d&apos;Allah, le Tout Miséricordieux
        </p>
      ) : null}
    </div>
  );
}
