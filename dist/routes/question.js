"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1router = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Add a new question
router.post("/quiz/:quizId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, options, correctOptionId } = req.body;
    let mainOption = correctOptionId;
    // Create the question
    const result = yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const question = yield tx.question.create({
            data: {
                text,
                quizId: req.params.quizId,
            },
        });
        // Create options for the question
        for (let i = 0; i < options.length; i++) {
            const optionid = yield tx.option.create({
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
        const updatedQuestion = yield tx.question.update({
            where: {
                id: question.id,
            },
            data: {
                correctOptionId: mainOption,
            },
        });
        return updatedQuestion;
    }));
    res.json({
        message: "Question added successfully",
        question: result,
    });
}));
// Get a question and its options
router.get("/quiz/:quizId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield client.question.findMany({
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
}));
// Update a question
router.put("/quiz/:quizId/:questionId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, options, correctOptionId } = req.body;
    const { quizId, questionId } = req.params;
    // Find the question
    const question = yield client.question.findFirst({
        where: {
            id: questionId,
            quizId,
        },
    });
    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }
    // Update the question text
    const updatedQuestion = yield client.question.update({
        where: { id: questionId },
        data: { text },
    });
    // Delete existing options if any and recreate them
    yield client.option.deleteMany({
        where: { questionId },
    });
    // Recreate options
    let mainOption = correctOptionId;
    for (let i = 0; i < options.length; i++) {
        if (options[i].text == "") {
            continue;
        }
        const optionid = yield client.option.create({
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
        yield client.question.update({
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
}));
// Delete a question
router.delete("/quiz/:quizId/:questionId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId, questionId } = req.params;
    // Find the question to delete
    const question = yield client.question.findFirst({
        where: {
            id: questionId,
            quizId,
        },
    });
    if (!question) {
        return res.status(404).json({ message: "Question not found" });
    }
    // Delete the options first
    yield client.option.deleteMany({
        where: { questionId },
    });
    // Then delete the question
    yield client.question.delete({
        where: { id: questionId },
    });
    res.json({
        message: "Question and its options deleted successfully",
    });
}));
exports.v1router = router;
