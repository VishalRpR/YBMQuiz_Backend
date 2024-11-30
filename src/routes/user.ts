import { Router, Request, Response, RequestHandler } from "express";
import { SigninSchema, SignupSchema } from "../types";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const client = new PrismaClient();
const router = Router();

const signuphandler: any = async (req: Request, res: Response) => {
  const body = req.body;
 
  const parseddata = SignupSchema.safeParse(body);

  if (!parseddata.success) {
    return res.status(411).json({
      message: "invalid inputs",
    });
  }

  const userExist = await client.user.findFirst({
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

  const user = await client.user.create({
    data: {
      name: parseddata.data.name,
      email: parseddata.data.email,
      password: parseddata.data.password,
    },
  });

  res.json({
    message: "user created successfully",
  });
};

router.post("/signup", signuphandler);

const signinhandler: any = async (req: Request, res: Response) => {
  const body = req.body;
  
  const parseddata = SigninSchema.safeParse(body);

  if (!parseddata.success) {
    return res.status(411).json({
      message: "invalid inputs",
    });
  }

  const user = await client.user.findFirst({
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

  const token = jwt.sign({ id: user.id }, "jwtsecret");

  res.json({
    token: token,
  });
};

router.post("/signin", signinhandler);

export const userRouter = router;
