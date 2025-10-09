/*
  Warnings:

  - You are about to drop the column `courseContributions` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "courseContributions",
ADD COLUMN     "subjectsContributions" TEXT;
