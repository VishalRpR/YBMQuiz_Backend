import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
):any {
  const token = req.headers.authentication as unknown as string;

try {
     const payload = jwt.verify(token, "jwtsecret");
     //@ts-ignore

     req.id = payload.id;

     next();
    
} catch (error) {

     return res.status(403).json({
       message: "token required",
     });
    
}
 
}
