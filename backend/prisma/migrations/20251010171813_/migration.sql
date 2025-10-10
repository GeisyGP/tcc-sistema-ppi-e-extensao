/*
  Warnings:

  - You are about to drop the column `currentYear` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "currentYear",
ADD COLUMN     "executionPeriod" TEXT NOT NULL DEFAULT '2025/1º';
