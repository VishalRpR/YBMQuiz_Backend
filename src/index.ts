import express from "express";
import { v1router } from "./routes/question";
const app = express();

app.use(express.json());
app.use("/api/v1", v1router);
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
