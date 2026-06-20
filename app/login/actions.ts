"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE, deriveSessionToken } from "@/lib/auth";

export type LoginState = { error?: string };

function safeNext(value: unknown): string {
  const raw = typeof value === "string" ? value : "/dashboard";
  return raw.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return {
      error: "Authentification non configurée (variable ADMIN_PASSWORD manquante)."
    };
  }

  if (password !== expected) {
    return { error: "Mot de passe incorrect." };
  }

  const token = await deriveSessionToken(expected);
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 jours
  });

  redirect(next);
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE);
  redirect("/");
}
