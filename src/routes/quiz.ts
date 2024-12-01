import { Router } from "express";
import { authMiddleware } from "../middleware";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const router = Router();

// Add a new question
router.post("/quiz/", authMiddleware, async (req: any, res: any) => {
  // Create the question

  const quiz = await client.quiz.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      userId: req.id,
    },
  });

  res.json({
    quizId: quiz.id,
  });
});

///user Specific quiz
//@ts-ignore
router.get("/quiz/", authMiddleware, async (req:any, res:any) => {
 
  const quizes = await client.quiz.findMany({
    where:{
      userId:req.id
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      description: true,
    },
  });

  if (!quizes) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json({
    quizes: quizes,
  });
});





//get all the quiz for quizing
router.get("/quizzes/", authMiddleware, async (req: any, res: any) => {
 
  const quizes = await client.quiz.findMany({
    
  });

  if (!quizes) {
    return res.status(404).json({ message: "Question not found" });
  }

  res.json({
    quizes: quizes,
  });
});

export const quizrouter = router;
