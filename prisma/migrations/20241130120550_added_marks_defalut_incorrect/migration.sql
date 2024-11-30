-- CreateTable
CREATE TABLE "Marks" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "quizId" TEXT NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "Marks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Marks" ADD CONSTRAINT "Marks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Marks" ADD CONSTRAINT "Marks_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
