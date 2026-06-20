import { Lock } from "lucide-react";

import { Arabesque } from "@/components/site/arabesque";
import { Bismillah } from "@/components/site/bismillah";
import { LoginForm } from "@/components/auth/login-form";

export const dynamic = "force-dynamic";

export default function LoginPage({
  searchParams
}: {
  searchParams: { next?: string | string[] };
}) {
  const raw = Array.isArray(searchParams.next)
    ? searchParams.next[0]
    : searchParams.next;
  const next = raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";

  return (
    <main className="px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-md">
        <div className="relative overflow-hidden rounded-4xl border border-border/70 bg-card/85 px-6 py-10 shadow-soft sm:px-10">
          <div className="pointer-events-none absolute inset-0 text-primary/[0.05]">
            <Arabesque id="login-veil" size={56} />
          </div>
          <div className="relative flex flex-col items-center gap-5 text-center">
            <Bismillah />
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                Accès réservé
              </p>
              <h1 className="mt-1.5 font-heading text-3xl font-semibold text-primary">
                Espace administrateur
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Connectez-vous pour accéder au mur communautaire et à la gestion
                du catalogue.
              </p>
            </div>
            <div className="w-full text-left">
              <LoginForm next={next} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
