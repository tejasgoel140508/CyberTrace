-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'MONITORING', 'ESCALATED', 'CLOSED');

-- CreateEnum
CREATE TYPE "CaseVerdict" AS ENUM ('PENDING_REVIEW', 'MALICIOUS', 'SUSPICIOUS', 'BENIGN', 'INSUFFICIENT_EVIDENCE');

-- CreateTable
CREATE TABLE "InvestigationCase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "iocId" TEXT,
    "title" TEXT NOT NULL,
    "status" "CaseStatus" NOT NULL DEFAULT 'OPEN',
    "verdict" "CaseVerdict" NOT NULL DEFAULT 'PENDING_REVIEW',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestigationCase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InvestigationCase_userId_idx" ON "InvestigationCase"("userId");
CREATE INDEX "InvestigationCase_iocId_idx" ON "InvestigationCase"("iocId");
CREATE INDEX "InvestigationCase_status_idx" ON "InvestigationCase"("status");

-- AddForeignKey
ALTER TABLE "InvestigationCase" ADD CONSTRAINT "InvestigationCase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InvestigationCase" ADD CONSTRAINT "InvestigationCase_iocId_fkey" FOREIGN KEY ("iocId") REFERENCES "IOC"("id") ON DELETE SET NULL ON UPDATE CASCADE;
