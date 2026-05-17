import type { Request ,Response ,NextFunction } from "express";
import { markMessageAsRead , getUnreadCount } from "../services/readReceipt.service";

export const markAsRead = async(req:Request , res:Response ,next:NextFunction)=>{
    try{
        const userId = (req as any).userId as string;
        const conversationId = req.params["id"] as string;
        
        await markMessageAsRead(userId ,conversationId)
        res.json({status:"ok" , message:"Messages marked as read"});

    }catch(err){    
        next(err);
    }
}

export const unreadCount =async(req:Request , res:Response ,next:NextFunction)=>{
    try{
        const userId = (req as any).userId as string;
        const conversationId = req.params["id"] as string;

        const count = await getUnreadCount(userId , conversationId)
        res.json({status:"ok" , count})
    }catch(err){
        next(err);
    }
}