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
exports.quizrouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Add a new question
router.post("/quiz/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create the question
    const quiz = yield client.quiz.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            userId: req.id,
        },
    });
    res.json({
        quizId: quiz.id,
    });
}));
///user Specific quiz
//@ts-ignore
router.get("/quiz/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("here");
    const quizes = yield client.quiz.findMany({
        where: {
            userId: req.id
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
}));
//get all the quiz for quizing
router.get("/quizzes/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("here");
    const quizes = yield client.quiz.findMany({});
    if (!quizes) {
        return res.status(404).json({ message: "Question not found" });
    }
    res.json({
        quizes: quizes,
    });
}));
exports.quizrouter = router;
