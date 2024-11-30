"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const question_1 = require("./routes/question");
const quiz_1 = require("./routes/quiz");
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const playquiz_1 = require("./routes/playquiz");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1", question_1.v1router);
app.use("/api/v1", user_1.userRouter);
app.use("/api/v1", quiz_1.quizrouter);
app.use("/api/v1", playquiz_1.palyquizrouter);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});
app.listen(3000, () => {
    console.log("listening on port 3000");
});
