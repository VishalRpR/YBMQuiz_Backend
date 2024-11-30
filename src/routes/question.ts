import { Router } from "express";
import { authMiddleware } from "../middleware";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const router = Router();

// Add a new question
router.post("/quiz/:quizId", authMiddleware, async (req, res) => {
  const { text, options, correctOptionId } = req.body;

  let mainOption = correctOptionId;

  // Create the question
  const result = await client.$transaction(async (tx) => {
    const question = await tx.question.create({
      data: {
        text,
        quizId: req.params.quizId,
      },
    });

    // Create options for the question
    for (let i = 0; i < options.length; i++) {
      const optionid = await tx.option.create({
        data: {
          text: options[i].text,
          questionId: question.id,
        },
        select: {
          id: true,
        },
      });

      if (correctOptionId == options[i].id) {
        mainOption = optionid.id;
      }
    }

    // Update the correct option
    const updatedQuestion = await tx.question.update({
      where: {
        id: question.id,
      },
      data: {
        correctOptionId: mainOption,
      },
    });

    return updatedQuestion;
  });

  res.json({
    message: "Question added successfully",
    question: result,
  });
});

// Get a question and its options
router.get("/quiz/:quizId", authMiddleware, async (req:any, res:any) => {
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

// Update a question
router.put("/quiz/:quizId/:questionId", authMiddleware, async (req:any, res:any) => {
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
  let mainOption = correctOptionId;
  for (let i = 0; i < options.length; i++) {
    if(options[i].text==""){continue}
       const optionid = await client.option.create({
      data: {
        text: options[i].text,
        questionId: updatedQuestion.id,
      },
    });

    if (correctOptionId === options[i].id) {
      mainOption = optionid.id;
    }
  }

  // Update the correct option
  if (mainOption) {
    await client.question.update({
      where: {
        id: questionId,
      },
      data: {
        correctOptionId: mainOption,
      },
    });
  }

  res.json({
    message: "Question updated successfully",
    question: updatedQuestion,
  });
});

// Delete a question
router.delete("/quiz/:quizId/:questionId", authMiddleware, async (req:any, res:any) => {
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
