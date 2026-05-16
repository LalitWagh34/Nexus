import type { Request ,Response ,NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { sendMessage ,getMessages , editMessage ,deleteMessage } from "../services/message.service";

export const send  =async(req:Request,res:Response , next:NextFunction)=>{
    try{
        const userId = (req as any).userId as string;
        const conversationId = req.params["id"] as string;
        const {content} = req.body as {content:string};
        
        if(!content?.trim()) throw new AppError("Message Content is required" , 400);

        const message = await sendMessage(userId ,conversationId ,content);
        res.status(201).json({status:"ok" , message});
    }catch(err){
        next(err);
    }
}

export const list = async(req:Request ,res:Response ,next:NextFunction)=>{
    try{
        const userId = (req as any).userId as string;
        const conversationId = req.params["id"] as string;
        const cursor = req.query["cursor"] as string |undefined;
        const limit =parseInt(req.query["limit"] as string) || 20;

        const result =await getMessages(userId , conversationId , cursor ,limit);
        res.json({status:"ok" , ...result});

    }catch(err){
        next(err)
    }
}

export const edit =async(req:Request ,res:Response,next:NextFunction)=>{
    try{
        const userId = (req as any).userId as string;
        const messageId = req.params["messageId"] as string;
        const { content } = req.body as { content: string };

        if(!content?.trim()) throw new AppError("Message Content is required" , 400);

        const message = await editMessage(userId ,messageId ,content)
        res.json({status:"ok" , message})
    }catch(err){
        next(err)
    }
}

export const remove = async(req:Request , res:Response , next:NextFunction)=>{
    try {
        const userId = (req as any).userId as string;
        const messageId = req.params["messageId"] as string;

        await deleteMessage(userId, messageId);
        res.json({ status: "ok", message: "Message deleted" });
    } catch (err) {
        next(err);
    } 
}