import type { NextFunction , Request , Response } from "express";
import { AppError } from "../utils/AppError";
import {refreshTokens , revokeRefreshToken, issuesToken} from "../services/auth.service"
import prisma from "../config/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'
export const googleCallback = async (req: Request, res: Response) => {
  const user = req.user as any

  const accessToken = signAccessToken(user.id)
  const refreshToken = signRefreshToken(user.id)

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  // Redirect to frontend with tokens in URL
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  res.redirect(
    `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
  )
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


