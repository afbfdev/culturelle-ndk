# Commission Culturelle NDK

Application Next.js pour remplacer le Google Form de collecte des realisations spirituelles en vue du Magal 2026.

## Stack

- Next.js App Router
- Tailwind CSS
- React Hook Form + Zod
- Lucide React
- Prisma
- Supabase PostgreSQL

## Démarrage

1. Installer les dépendances :

   ```bash
   npm install
   ```

2. Créer le fichier d'environnement :

   ```bash
   cp .env.example .env.local
   ```

3. Renseigner `DATABASE_URL` et `DIRECT_URL` avec les acces Supabase.
   `DATABASE_URL` correspond a l'URL pooler Supabase.
   `DIRECT_URL` correspond a l'URL directe PostgreSQL.

4. Générer le client Prisma puis créer la migration :

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

## Fonctionnalités livrées

- Hero et palette inspires du logo `public/assets/images/logondk.png`
- Formulaire mobile-first en sections avec composants reutilisables
- Validation en temps reel cote client avec Zod + React Hook Form
- Catalogue Xassida alimente cote serveur via `lib/data/xassidas.ts`
- Saisie des Xassida sous forme de select list + quantite
- Server Action `app/actions/submitForm.ts` pour la validation serveur et l'insertion Prisma
- Modele Prisma relationnel `Submission`, `Xassida` et `SubmissionXassida`
- Mini dashboard de pilotage dans `app/dashboard/page.tsx` avec KPI Xassida, Kamil et Zikrs
