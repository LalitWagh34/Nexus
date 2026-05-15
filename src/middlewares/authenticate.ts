import type { Request ,Response , NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const authenticate = (req :Request , res:Response , next:NextFunction)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith("Bearer ")){
        throw new AppError("No token provided" ,401);
    }
    const token = authHeader.split(" ")[1];

    if(!token){
        throw new AppError("No token provided" ,401);
    }
    try {
        const payload = verifyAccessToken(token);
        (req as any).userId = payload.userId;
        next();
    } catch {
        throw new AppError("Invalid or expired token", 401);
    }
}