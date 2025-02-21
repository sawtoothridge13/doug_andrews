-- AlterTable
ALTER TABLE "Concert" ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "time" DROP NOT NULL;
