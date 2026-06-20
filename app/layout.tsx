import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Manrope } from "next/font/google";
import { cookies } from "next/headers";

import "./globals.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SESSION_COOKIE, isValidSession } from "@/lib/auth";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"]
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const arabicFont = Amiri({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "Daara NDK — Réalisations spirituelles · Magal 2026",
  description:
    "Plateforme du Daara Nouroud Darayni (Kaolack) pour déclarer ses réalisations spirituelles — Coran, Xassidas et Zikrs — en vue du Magal 2026."
};

export const viewport: Viewport = {
  themeColor: "#0f5132"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const isAdmin = await isValidSession(token);

  return (
    <html lang="fr">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${arabicFont.variable} font-body`}
      >
        <div className="flex min-h-dvh flex-col">
          <SiteHeader isAdmin={isAdmin} />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
