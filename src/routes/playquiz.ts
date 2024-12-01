import { Router } from "express";
import { authMiddleware } from "../middleware";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const router = Router();

router.post("/quizzes/:quizId", authMiddleware, async (req: any, res: any) => {
  const { questionId, markId, selectedOptionId } = req.body;
  let marker = markId;

  const result = await client.$transaction(async (tx) => {
    if (markId == "") {
      const mark = await tx.marks.create({
        data: {
          userId: req.id,
          quizId: req.params.quizId,
        },
      });
      marker = mark.id;
    }

    const question = await tx.response.create({
      data: {
        userId: req.id,
        markId: marker,
        questionId: questionId,
        selectedOptionId: selectedOptionId,
      },
    });

    const correctresponse = await tx.question.findFirst({
      where: {
        id: questionId,
      },
      select: {
        correctOptionId: true,
      },
    });

    let score = "INCORRECT"; // Default score is "INCORRECT"

    if (correctresponse?.correctOptionId === question.selectedOptionId) {
      score = "CORRECT"; // Correct answer
      await tx.response.update({
        where: { id: question.id },
        data: { score: "CORRECT" }, // Storing "CORRECT" or "INCORRECT"
      });
    }

    return score;
  });

  res.json({
    message: "Question added successfully",
    result: result,
    marker,
  });
});

//Get quiz to play
router.get("/quizzes/:quizId", authMiddleware, async (req: any, res: any) => {
  const question = await client.question.findMany({
    where: {
      quizId: req.params.quizId,
    },
    include: {
      options: true,
    },
  });

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json({
    question,
  });
});

// Post Marks to Marks
router.post("/marks/:quizId", authMiddleware, async (req: any, res: any) => {
  const { totalMarks, markid } = req.body;

  const mark = await client.marks.update({
    where: {
      userId: req.id,
      quizId: req.params.quizId,
      id: markid,
    },
    data: {
      total: totalMarks,
    },
  });

  res.json({
    message: "marks added successfully",
    mark: mark,
  });
});

router.get("/marks", authMiddleware, async (req: any, res: any) => {
  const ress = await client.marks.findMany({
    where: {
      userId: req.id,
    },
    include: {
      quiz: {
        include: {
          questions: {
            include: {
              options: true, // Include all options for the question
            },
          },
        },
      },
      response: {
        include: {
          selectedOption: true,
        },
      },
    },
  });

  res.json({
    message: "marks fetched successfully",
    mark: ress,
  });
});

export const palyquizrouter = router;
