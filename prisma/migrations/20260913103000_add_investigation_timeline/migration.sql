CREATE TABLE "Investigation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "iocId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investigation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InvestigationTimelineEvent" (
    "id" TEXT NOT NULL,
    "investigationId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestigationTimelineEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Investigation_userId_createdAt_idx" ON "Investigation"("userId", "createdAt");
CREATE INDEX "Investigation_iocId_idx" ON "Investigation"("iocId");
CREATE UNIQUE INDEX "InvestigationTimelineEvent_investigationId_sequence_key" ON "InvestigationTimelineEvent"("investigationId", "sequence");
CREATE INDEX "InvestigationTimelineEvent_investigationId_occurredAt_idx" ON "InvestigationTimelineEvent"("investigationId", "occurredAt");

ALTER TABLE "Investigation" ADD CONSTRAINT "Investigation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Investigation" ADD CONSTRAINT "Investigation_iocId_fkey" FOREIGN KEY ("iocId") REFERENCES "IOC"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "InvestigationTimelineEvent" ADD CONSTRAINT "InvestigationTimelineEvent_investigationId_fkey" FOREIGN KEY ("investigationId") REFERENCES "Investigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
