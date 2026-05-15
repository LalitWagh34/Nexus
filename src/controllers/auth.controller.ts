import type { NextFunction , Request , Response } from "express";
import { AppError } from "../utils/AppError";
import {refreshTokens , revokeRefreshToken, issuesToken} from "../services/auth.service"
import prisma from "../config/prisma";

export const googleCallback =async(
    req:Request,
    res:Response,
    next :NextFunction
)=>{
    try{
        const user = req.user as {id:string}

        if(!user) throw new AppError("Authentication Failed" , 401)
        
        const {accessToken , refreshToken} = await issuesToken(user.id);
        res.json({
            status: "ok",
            accessToken,
            refreshToken,
        });
    }catch(error){
        next(error)
    }
}

export const refresh =async(
    req:Request,
    res:Response,
    next :NextFunction
)=>{
    try{
        const {refreshToken} =req.body as {refreshToken:string}
        if(!refreshToken) throw new AppError ("Refresh token required" , 400)
          
        const tokens = await refreshTokens(refreshToken);
        res.json({ status: "ok", ...tokens });
    }catch(error){
        next(error)
    }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body as { refreshToken: string };
    if (!refreshToken) throw new AppError("Refresh token required", 400);

    await revokeRefreshToken(refreshToken);
    res.json({ status: "ok", message: "Logged out" });
  } catch (err) {
    next(err);
  }
};


