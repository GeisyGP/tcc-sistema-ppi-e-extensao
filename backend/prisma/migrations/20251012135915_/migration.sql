/*
  Warnings:

  - You are about to drop the `Deliverable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Deliverable" DROP CONSTRAINT "Deliverable_groupId_fkey";

-- DropTable
DROP TABLE "Deliverable";

-- CreateTable
CREATE TABLE "Artifacts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "groupId" TEXT,
    "projectId" TEXT,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "Artifacts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Artifacts" ADD CONSTRAINT "Artifacts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artifacts" ADD CONSTRAINT "Artifacts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
