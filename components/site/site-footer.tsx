export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="gold-ornament mb-6 flex items-center gap-4">
          <span className="font-arabic text-lg text-gold" lang="ar" dir="rtl">
            ﷽
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-heading text-lg font-semibold text-primary">
            Daara Nouroud Darayni — Kaolack
          </p>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            Commission Culturelle NDK · Collecte des réalisations spirituelles
            en vue du Magal 2026. Qu&apos;Allah accepte vos œuvres.
          </p>
          <p className="mt-3 text-xs text-muted-foreground/80">
            © {2026} Commission Culturelle NDK
          </p>
        </div>
      </div>
    </footer>
  );
}
