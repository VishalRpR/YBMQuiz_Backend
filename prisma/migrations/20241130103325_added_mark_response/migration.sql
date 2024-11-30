-- CreateEnum
CREATE TYPE "mark" AS ENUM ('CORRECT', 'INCORRECT');

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "score" "mark";
