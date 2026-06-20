"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { logoutAction } from "@/app/login/actions";
import { cn } from "@/lib/utils";

const publicLinks: { href: Route; label: string }[] = [
  { href: "/", label: "Déclarer" }
];

const adminLinks: { href: Route; label: string }[] = [
  { href: "/", label: "Déclarer" },
  { href: "/dashboard", label: "Le mur" },
  { href: "/admin", label: "Gestion" }
];

export function SiteHeader({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const links = isAdmin ? adminLinks : publicLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-card shadow-ring ring-1 ring-gold/30">
            <Image
              src="/assets/images/logondk.png"
              alt="Logo Daara NDK"
              width={32}
              height={32}
              className="h-7 w-7 object-contain"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-lg font-semibold text-primary">
              Daara NDK
            </span>
            <span className="block text-[0.6rem] uppercase tracking-[0.28em] text-muted-foreground">
              Magal 2026
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1 text-sm">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 font-medium transition sm:px-4",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {isAdmin ? (
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Déconnexion"
                className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <Link
              href={"/login" as Route}
              className="rounded-full px-3 py-1.5 font-medium text-muted-foreground transition hover:text-primary sm:px-4"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
