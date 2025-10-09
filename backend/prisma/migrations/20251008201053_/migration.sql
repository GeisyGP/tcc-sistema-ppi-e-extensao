-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "scope" DROP NOT NULL,
ALTER COLUMN "justification" DROP NOT NULL,
ALTER COLUMN "generalObjective" DROP NOT NULL,
ALTER COLUMN "specificObjectives" DROP NOT NULL,
ALTER COLUMN "courseContributions" DROP NOT NULL,
ALTER COLUMN "methodology" DROP NOT NULL,
ALTER COLUMN "timeline" DROP NOT NULL;
