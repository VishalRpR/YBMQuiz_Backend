/*
  Warnings:

  - Added the required column `markId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Marks" ALTER COLUMN "total" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "markId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_markId_fkey" FOREIGN KEY ("markId") REFERENCES "Marks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
