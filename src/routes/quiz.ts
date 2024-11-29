import { Router } from "express";
import { authMiddleware } from "../middleware";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const router = Router();

// Add a new question
router.post("/quiz/", authMiddleware, async (req, res) => {
 

  // Create the question
  const quiz = await client.quiz.create({
    data: {
      title:req.body.title,
      description:req.body.description,
    },
  });

  res.json({
    quizId:quiz.id
  })

 
});

// Get a question and its options
//@ts-ignore
router.get("/quiz/:quizId", authMiddleware, async (req, res) => {
  const questionId = req.query.questionId as string; // Use query parameter to get the questionId
  const question = await client.question.findFirst({
    where: {
      quizId: req.params.quizId,
      id: questionId,
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

// Update a question
//@ts-ignore
router.put("/quiz/:quizId/:questionId", authMiddleware, async (req, res) => {
  const { text, options, correctOptionId } = req.body;
  const { quizId, questionId } = req.params;

  // Find the question
  const question = await client.question.findFirst({
    where: {
      id: questionId,
      quizId,
    },
  });

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  // Update the question text
  const updatedQuestion = await client.question.update({
    where: { id: questionId },
    data: { text },
  });

  // Delete existing options if any and recreate them
  await client.option.deleteMany({
    where: { questionId },
  });

  // Recreate options
  for (let i = 0; i < options.length; i++) {
    await client.option.create({
      data: {
        text: options[i].text,
        questionId: updatedQuestion.id,
      },
    });
  }

  // Update the correct option
  if (correctOptionId) {
    await client.question.update({
      where: {
        id: questionId,
      },
      data: {
        correctOptionId,
      },
    });
  }

  res.json({
    message: "Question updated successfully",
    question: updatedQuestion,
  });
});

// Delete a question
//@ts-ignore
router.delete("/quiz/:quizId/:questionId", authMiddleware, async (req, res) => {
  const { quizId, questionId } = req.params;

  // Find the question to delete
  const question = await client.question.findFirst({
    where: {
      id: questionId,
      quizId,
    },
  });

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  // Delete the options first
  await client.option.deleteMany({
    where: { questionId },
  });

  // Then delete the question
  await client.question.delete({
    where: { id: questionId },
  });

  res.json({
    message: "Question and its options deleted successfully",
  });
});

export const v1router = router;
