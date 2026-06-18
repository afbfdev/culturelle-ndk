# Spécification Technique & Prompt pour Assistant IA (Codex/Cursor/Copilot)
## Projet : Plateforme Web - Commission Culturelle NDK (Daara Nouroud Dareyni)

**Rôle de l'IA :** Tu vas agir en tant que Développeur Full-Stack Senior et Architecte Logiciel. Ton objectif est de créer une application web moderne, hautement performante et responsive pour remplacer un Google Form existant. 

### 1. Stack Technique Requise
* **Framework Frontend :** Next.js (App Router) - React
* **Styling :** Tailwind CSS (avec shadcn/ui pour les composants de formulaire accessibles)
* **Gestion du Formulaire & Validation :** React Hook Form + Zod
* **ORM :** Prisma
* **Base de données & Backend :** Supabase (PostgreSQL)
* **Hébergement / CI-CD :** Vercel (Serverless)

### 2. Contexte et Fonctionnalités
L'application permet aux membres de la Daara de soumettre leurs réalisations spirituelles (lecture du Coran, Xassidas, Zikrs) pour le Magal 2026. 

**Champs du Formulaire à implémenter :**
1.  **Informations Personnelles :** Date de soumission (Date picker), Nom (Texte), Prénom (Texte).
2.  **Kamil (Coran) :** Sélection multiple de numéros de Kamil (ex: 1, 2, 3... jusqu'à 12+). Un composant type "Toggle Group" ou "Checkbox Grid" sera idéal.
3.  **Xassida :** Une grille permettant de sélectionner le type de Xassida (ex: Nourou Darayni, Jazboul Qoulob, etc.) et de lui associer un nombre/quantité. 
4.  **Zikr(s) :** Un champ de texte long (Textarea) pour détailler les Zikrs effectués et leur nombre.

### 3. Schéma de Base de Données (Prisma)
Voici le point de départ pour le `schema.prisma`. Tu devras générer les migrations et le client.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Pour Supabase
}

model Submission {
  id        String   @id @default(uuid())
  date      DateTime @default(now())
  nom       String
  prenom    String
  
  // Tableau d'entiers pour stocker les numéros de Kamil sélectionnés
  kamil     Int[]    
  
  // Tableau d'entiers pour stocker les khassidas [{ nom: "Nourou Darayni", quantite: 2 }, ...]
   
  
  // Champ texte libre pour les Zikrs et le nombre de zikr
  zikrs     String?  @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([nom, prenom])
}