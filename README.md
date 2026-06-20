# Daara NDK — Réalisations spirituelles · Magal 2026

Plateforme web du **Daara Nouroud Darayni** (Kaolack) pour déclarer les
réalisations spirituelles — Coran (Kamil), Xassidas et Zikrs — en vue du
Magal 2026. Elle remplace l'ancien Google Form par un parcours guidé,
mobile-first, à l'identité sobre et spirituelle (ivoire, vert émeraude, or).

## Stack

- Next.js 14 (App Router) · React 18
- Tailwind CSS (design system maison à base de tokens HSL)
- React Hook Form + Zod (validation client + serveur)
- Prisma + Supabase (PostgreSQL)
- Lucide React · polices Cormorant Garamond, Manrope, Amiri (calligraphie)

## Parcours & écrans

| Route        | Rôle                                                                 |
| ------------ | -------------------------------------------------------------------- |
| `/`          | Hero + **wizard en 5 étapes** : Identité → Coran → Xassidas → Zikrs → Récapitulatif |
| `/dashboard` | **Mur communautaire** « Ensemble vers le Magal » : compteurs collectifs, jauge d'objectif, classement des Xassidas, couverture des Kamil, flux des dernières déclarations |
| `/admin`     | **Gestion du catalogue** Xassida (ajout/mise à jour, activation, valeurs par défaut) |

## Architecture

```
app/
  layout.tsx              Shell global (header + footer), polices
  page.tsx                Accueil : hero + wizard
  dashboard/page.tsx      Mur communautaire (force-dynamic)
  admin/page.tsx          Gestion du catalogue (force-dynamic)
  dashboard/actions.ts    Server actions catalogue (create / toggle / seed / restore)
  actions/submitForm.ts   Server action de soumission (validation + insertion Prisma)
components/
  site/                   Header, footer, Bismillah, motif arabesque
  wizard/                 Wizard de soumission + stepper de progression
  ui/                     Primitives (Button, Card, Input, Select, Textarea, tuiles…)
lib/
  data/                   Catalogue Xassida + agrégats (mur + admin)
  validations/            Schémas Zod (dynamiques selon le catalogue)
  constants.ts            Numéros de Kamil
prisma/schema.prisma      Modèles Submission · Xassida · SubmissionXassida
```

## Démarrage

```bash
npm install
cp .env.example .env.local      # renseigner DATABASE_URL et DIRECT_URL (Supabase)
npx prisma migrate dev          # créer la base
npm run dev
```

`DATABASE_URL` = URL pooler Supabase · `DIRECT_URL` = URL directe PostgreSQL.
`ADMIN_PASSWORD` = mot de passe protégeant `/login`, `/dashboard` et `/admin`.

> Sans base connectée, l'application reste fonctionnelle : le catalogue par
> défaut s'affiche et le mur communautaire montre un état vide cohérent.

## Accès & authentification

- Le formulaire de déclaration (`/`) est **public**.
- Le **mur** (`/dashboard`) et la **gestion** (`/admin`) sont **réservés à
  l'administrateur**, protégés par `middleware.ts`.
- Connexion via `/login` avec `ADMIN_PASSWORD`. La session est un cookie
  httpOnly contenant un dérivé SHA-256 du mot de passe (jamais le mot de passe
  en clair), valable 7 jours. Bouton de déconnexion dans l'en-tête.

## Notes de design

- **Identité visuelle** sobre & spirituelle : fond ivoire/sable, vert émeraude
  profond, or, motif géométrique islamique (étoile à 8 branches) en filigrane,
  calligraphie Amiri pour le Bismillah.
- **Parcours guidé** : une section à la fois, validation par étape, écran de
  remerciement après soumission.
- **Mur communautaire** : valorise l'effort collectif plutôt qu'un tableau
  d'administration. La jauge d'objectif est symbolique (motivante).
- Accessibilité : focus visibles, contrastes soutenus, `prefers-reduced-motion`
  respecté.
```
