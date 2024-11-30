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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const types_1 = require("../types");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = new client_1.PrismaClient();
const router = (0, express_1.Router)();
const signuphandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parseddata = types_1.SignupSchema.safeParse(body);
    if (!parseddata.success) {
        return res.status(411).json({
            message: "invalid inputs",
        });
    }
    const userExist = yield client.user.findFirst({
        where: {
            email: parseddata.data.email,
            password: parseddata.data.password,
        },
    });
    if (userExist) {
        return res.status(403).json({
            message: "Sorry credentials are incorrect",
        });
    }
    const user = yield client.user.create({
        data: {
            name: parseddata.data.name,
            email: parseddata.data.email,
            password: parseddata.data.password,
        },
    });
    res.json({
        message: "user created successfully",
    });
});
router.post("/signup", signuphandler);
const signinhandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const parseddata = types_1.SigninSchema.safeParse(body);
    if (!parseddata.success) {
        return res.status(411).json({
            message: "invalid inputs",
        });
    }
    const user = yield client.user.findFirst({
        where: {
            email: parseddata.data.email,
            password: parseddata.data.password,
        },
    });
    if (!user) {
        return res.status(403).json({
            message: "Sorry credentials are incorrect",
        });
    }
    const token = jsonwebtoken_1.default.sign({ id: user.id }, "jwtsecret");
    res.json({
        token: token,
    });
});
router.post("/signin", signinhandler);
exports.userRouter = router;
