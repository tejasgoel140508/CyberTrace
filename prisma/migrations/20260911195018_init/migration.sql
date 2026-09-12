-- CreateEnum
CREATE TYPE "IOCType" AS ENUM ('IP', 'DOMAIN', 'URL', 'HASH');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('LOW', 'MODERATE', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "Reputation" AS ENUM ('BENIGN', 'UNKNOWN', 'SUSPICIOUS', 'MALICIOUS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IOC" (
    "id" TEXT NOT NULL,
    "type" "IOCType" NOT NULL,
    "value" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "reputation" "Reputation" NOT NULL,
    "country" TEXT,
    "countryCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "asn" TEXT,
    "sources" TEXT[],
    "firstSeen" TIMESTAMP(3),
    "lastSeen" TIMESTAMP(3),
    "malwareAssociated" BOOLEAN NOT NULL DEFAULT false,
    "campaignAssociated" BOOLEAN NOT NULL DEFAULT false,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IOC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IOCRelationship" (
    "id" TEXT NOT NULL,
    "sourceIocId" TEXT NOT NULL,
    "targetIocId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "confidence" INTEGER NOT NULL,
    "reasons" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IOCRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttackProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "attackType" TEXT NOT NULL,
    "severity" "Severity" NOT NULL,
    "confidence" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttackProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttackProfileIOC" (
    "attackProfileId" TEXT NOT NULL,
    "iocId" TEXT NOT NULL,

    CONSTRAINT "AttackProfileIOC_pkey" PRIMARY KEY ("attackProfileId","iocId")
);

-- CreateTable
CREATE TABLE "Technique" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Technique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttackProfileTechnique" (
    "attackProfileId" TEXT NOT NULL,
    "techniqueId" TEXT NOT NULL,

    CONSTRAINT "AttackProfileTechnique_pkey" PRIMARY KEY ("attackProfileId","techniqueId")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IOCLocation" (
    "iocId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "IOCLocation_pkey" PRIMARY KEY ("iocId","locationId")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "iocId" TEXT,
    "attackProfileId" TEXT,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "IOC_value_key" ON "IOC"("value");

-- CreateIndex
CREATE INDEX "IOC_type_idx" ON "IOC"("type");

-- CreateIndex
CREATE INDEX "IOC_severity_idx" ON "IOC"("severity");

-- CreateIndex
CREATE INDEX "IOC_reputation_idx" ON "IOC"("reputation");

-- CreateIndex
CREATE INDEX "IOC_isDemo_idx" ON "IOC"("isDemo");

-- CreateIndex
CREATE INDEX "IOC_riskScore_idx" ON "IOC"("riskScore");

-- CreateIndex
CREATE INDEX "IOCRelationship_sourceIocId_idx" ON "IOCRelationship"("sourceIocId");

-- CreateIndex
CREATE INDEX "IOCRelationship_targetIocId_idx" ON "IOCRelationship"("targetIocId");

-- CreateIndex
CREATE UNIQUE INDEX "IOCRelationship_sourceIocId_targetIocId_relationshipType_key" ON "IOCRelationship"("sourceIocId", "targetIocId", "relationshipType");

-- CreateIndex
CREATE UNIQUE INDEX "AttackProfile_name_key" ON "AttackProfile"("name");

-- CreateIndex
CREATE INDEX "AttackProfileIOC_iocId_idx" ON "AttackProfileIOC"("iocId");

-- CreateIndex
CREATE UNIQUE INDEX "Technique_name_key" ON "Technique"("name");

-- CreateIndex
CREATE INDEX "AttackProfileTechnique_techniqueId_idx" ON "AttackProfileTechnique"("techniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_countryCode_latitude_longitude_key" ON "Location"("countryCode", "latitude", "longitude");

-- CreateIndex
CREATE INDEX "IOCLocation_locationId_idx" ON "IOCLocation"("locationId");

-- CreateIndex
CREATE INDEX "Report_userId_idx" ON "Report"("userId");

-- CreateIndex
CREATE INDEX "Report_iocId_idx" ON "Report"("iocId");

-- CreateIndex
CREATE INDEX "Report_attackProfileId_idx" ON "Report"("attackProfileId");

-- AddForeignKey
ALTER TABLE "IOCRelationship" ADD CONSTRAINT "IOCRelationship_sourceIocId_fkey" FOREIGN KEY ("sourceIocId") REFERENCES "IOC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IOCRelationship" ADD CONSTRAINT "IOCRelationship_targetIocId_fkey" FOREIGN KEY ("targetIocId") REFERENCES "IOC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttackProfileIOC" ADD CONSTRAINT "AttackProfileIOC_attackProfileId_fkey" FOREIGN KEY ("attackProfileId") REFERENCES "AttackProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttackProfileIOC" ADD CONSTRAINT "AttackProfileIOC_iocId_fkey" FOREIGN KEY ("iocId") REFERENCES "IOC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttackProfileTechnique" ADD CONSTRAINT "AttackProfileTechnique_attackProfileId_fkey" FOREIGN KEY ("attackProfileId") REFERENCES "AttackProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttackProfileTechnique" ADD CONSTRAINT "AttackProfileTechnique_techniqueId_fkey" FOREIGN KEY ("techniqueId") REFERENCES "Technique"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IOCLocation" ADD CONSTRAINT "IOCLocation_iocId_fkey" FOREIGN KEY ("iocId") REFERENCES "IOC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IOCLocation" ADD CONSTRAINT "IOCLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_iocId_fkey" FOREIGN KEY ("iocId") REFERENCES "IOC"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_attackProfileId_fkey" FOREIGN KEY ("attackProfileId") REFERENCES "AttackProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
