/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "userId" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_userId_key" ON "Quiz"("userId");
