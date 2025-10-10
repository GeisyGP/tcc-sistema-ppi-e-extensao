/*
  Warnings:

  - You are about to drop the column `topic` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "topic",
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT '';
