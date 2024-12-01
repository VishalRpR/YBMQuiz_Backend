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
exports.palyquizrouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.post("/quizzes/:quizId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { questionId, markId, selectedOptionId } = req.body;
    let marker = markId;
    const result = yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        if (markId == "") {
            const mark = yield tx.marks.create({
                data: {
                    userId: req.id,
                    quizId: req.params.quizId,
                },
            });
            marker = mark.id;
        }
        const question = yield tx.response.create({
            data: {
                userId: req.id,
                markId: marker,
                questionId: questionId,
                selectedOptionId: selectedOptionId,
            },
        });
        const correctresponse = yield tx.question.findFirst({
            where: {
                id: questionId,
            },
            select: {
                correctOptionId: true,
            },
        });
        let score = "INCORRECT"; // Default score is "INCORRECT"
        if ((correctresponse === null || correctresponse === void 0 ? void 0 : correctresponse.correctOptionId) === question.selectedOptionId) {
            score = "CORRECT"; // Correct answer
            yield tx.response.update({
                where: { id: question.id },
                data: { score: "CORRECT" }, // Storing "CORRECT" or "INCORRECT"
            });
        }
        return score;
    }));
    res.json({
        message: "Question added successfully",
        result: result,
        marker,
    });
}));
//Get quiz to play
router.get("/quizzes/:quizId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// Post Marks to Marks
router.post("/marks/:quizId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalMarks, markid } = req.body;
    const mark = yield client.marks.update({
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
}));
router.get("/marks", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ress = yield client.marks.findMany({
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
}));
exports.palyquizrouter = router;
