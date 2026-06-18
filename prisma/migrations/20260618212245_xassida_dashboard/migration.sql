-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "kamil" INTEGER[],
    "zikrs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Xassida" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Xassida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionXassida" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "xassidaId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionXassida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Submission_nom_prenom_idx" ON "Submission"("nom", "prenom");

-- CreateIndex
CREATE INDEX "Submission_createdAt_idx" ON "Submission"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Xassida_slug_key" ON "Xassida"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Xassida_label_key" ON "Xassida"("label");

-- CreateIndex
CREATE INDEX "Xassida_isActive_sortOrder_idx" ON "Xassida"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "SubmissionXassida_submissionId_idx" ON "SubmissionXassida"("submissionId");

-- CreateIndex
CREATE INDEX "SubmissionXassida_xassidaId_createdAt_idx" ON "SubmissionXassida"("xassidaId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionXassida_submissionId_xassidaId_key" ON "SubmissionXassida"("submissionId", "xassidaId");

-- AddForeignKey
ALTER TABLE "SubmissionXassida" ADD CONSTRAINT "SubmissionXassida_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionXassida" ADD CONSTRAINT "SubmissionXassida_xassidaId_fkey" FOREIGN KEY ("xassidaId") REFERENCES "Xassida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
