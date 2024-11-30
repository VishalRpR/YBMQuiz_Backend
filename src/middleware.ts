import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
):any {
  const authHeader = req.headers.authorization as unknown as string;
  const token = authHeader.split(" ")[1];
  

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
