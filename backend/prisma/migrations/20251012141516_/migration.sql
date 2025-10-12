/*
  Warnings:

  - Made the column `academicDirector` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `campusDirector` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "academicDirector" SET NOT NULL,
ALTER COLUMN "campusDirector" SET NOT NULL;
