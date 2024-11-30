/*
  Warnings:

  - Made the column `score` on table `Response` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Response" ALTER COLUMN "score" SET NOT NULL;
