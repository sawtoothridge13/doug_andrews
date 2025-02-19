/*
  Warnings:

  - Added the required column `ticketType` to the `Concert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Concert" ADD COLUMN     "ticketType" TEXT NOT NULL,
ALTER COLUMN "ticketUrl" DROP NOT NULL;
