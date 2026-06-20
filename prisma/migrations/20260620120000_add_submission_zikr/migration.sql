-- CreateTable
CREATE TABLE "SubmissionZikr" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionZikr_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubmissionZikr_submissionId_idx" ON "SubmissionZikr"("submissionId");

-- CreateIndex
CREATE INDEX "SubmissionZikr_label_idx" ON "SubmissionZikr"("label");

-- AddForeignKey
ALTER TABLE "SubmissionZikr" ADD CONSTRAINT "SubmissionZikr_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
