-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_questionId_fkey";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "userId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "_QuestionToResponse" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_QuestionToResponse_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_QuestionToResponse_B_index" ON "_QuestionToResponse"("B");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToResponse" ADD CONSTRAINT "_QuestionToResponse_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToResponse" ADD CONSTRAINT "_QuestionToResponse_B_fkey" FOREIGN KEY ("B") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;
