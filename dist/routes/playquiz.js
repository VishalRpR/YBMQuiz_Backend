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
// Post question response
router.post("/quizzes/:quizId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { questionId, options, selectedOptionId } = req.body;
    const result = yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const question = yield tx.response.create({
            data: {
                userId: req.id,
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
        if ((correctresponse === null || correctresponse === void 0 ? void 0 : correctresponse.correctOptionId) == question.selectedOptionId) {
            const res = yield tx.response.update({
                where: { id: question.id },
                data: {
                    score: "CORRECT",
                },
            });
            return 1;
        }
        else {
            const res = yield tx.response.update({
                where: { id: question.id },
                data: {
                    score: "INCORRECT",
                },
            });
            return 0;
        }
    }));
    res.json({
        message: "Question added successfully",
        question: result,
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
    const { totalMarks } = req.body;
    const mark = yield client.marks.create({
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
}));
router.get("/marks", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("here");
    const ress = yield client.marks.findMany({
        where: {
            userId: req.id
        }, include: {
            quiz: {
                include: {
                    questions: true
                }
            }
        }
    });
    console.log(ress);
    res.json({
        message: "marks added successfully",
        mark: ress,
    });
}));
exports.palyquizrouter = router;
