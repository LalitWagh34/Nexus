import prisma from "../config/prisma"
import { AppError } from "../utils/AppError"
import { signAccessToken , signRefreshToken , verifyRefreshToken } from "../utils/jwt"

export const issuesToken = async(userId:string) =>{
    const accessToken = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);

    await prisma.refreshToken.create({
        data:{
            token:refreshToken,
            userId,
            expiresAt : new Date(Date.now() + 7 * 24 * 60 * 1000),
        },
    });
    return {accessToken , refreshToken}

};

export const refreshTokens = async (oldRefreshToken: string)=>{
    const stored = await prisma.refreshToken.findUnique({
        where:{token :oldRefreshToken}
    })
    if(!stored || stored.revoked || stored.expiresAt< new Date()){
        throw new AppError("Invalid or Expired refresh Token" , 401)
    }
    const payload = verifyRefreshToken(oldRefreshToken);
    await prisma.refreshToken.update({
        where:{token:oldRefreshToken},
        data:{
            revoked:true
        }
    });

    return issuesToken(payload.userId);
};

export const revokeRefreshToken = async(token:string)=>{
    const stored =await prisma.refreshToken.findUnique({
        where:{
            token
        }
    })
    if(!stored) throw new AppError("Token not Found" , 404);

    await prisma.refreshToken.update({
        where:{
            token
        },
        data:{
            revoked:true,
        }
    })

}

