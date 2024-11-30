import { Router } from "express";
import { authMiddleware } from "../middleware";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const router = Router();

// Post question response
router.post("/quizzes/:quizId", authMiddleware, async (req: any, res: any) => {
  const { questionId, options, selectedOptionId } = req.body;

  const result = await client.$transaction(async (tx) => {
    const question = await tx.response.create({
      data: {
        userId: req.id,
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

    if (correctresponse?.correctOptionId == question.selectedOptionId) {
      const res = await tx.response.update({
        where: { id: question.id },
        data: {
          score: "CORRECT",
        },
      });
      

      return 1;
    } else {
      const res = await tx.response.update({
        where: { id: question.id },
        data: {
          score: "INCORRECT",
        },
      });
      return 0;
    }
  });

  res.json({
    message: "Question added successfully",
    question: result,
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
  const { totalMarks } = req.body;

  const mark = await client.marks.create({
    data: {
      userId: req.id,
      total: totalMarks,
      quizId: req.params.quizId,
    },
  });

  res.json({
    message: "marks added successfully",
    mark: mark,
  });
});

router.get("/marks", authMiddleware, async (req: any, res: any) => {
      console.log("here")
  const ress = await client.marks.findMany({
   where:{
    userId:req.id
   },include:{
    quiz:{
        include:{
            questions:true
        }
    }
    }
   
  });

  console.log(ress)

  res.json({
    message: "marks added successfully",
    mark: ress,
  });
});

export const palyquizrouter = router;
