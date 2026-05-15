import type { Request, Response, NextFunction } from "express";
import {
  findOrCreateDirect,
  createGroup,
  getUserConversations,
  getConversationById,
} from "../services/conversation.service";
import { AppError } from "../utils/AppError";

export const createConversation = async (req:Request ,res:Response, next:NextFunction)=>{
    try{
        const userId = (req as any).userId as string;
        const {isGroup , participantId , participantIds ,name} = req.body;

        let conversation;

        if(isGroup){
            conversation = await createGroup(userId , name, participantId);
        }else{
            if(!participantId) throw new AppError('ParticipantID is required' ,400);
            conversation =await findOrCreateDirect(userId ,participantId)
        }

        res.status(201).json({status:"ok" ,conversation})
    }catch(error){
        next(error);
    }
}

export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId as string;
    const conversations = await getUserConversations(userId);
    res.json({ status: "ok", conversations });
  } catch (err) {
    next(err);
  }
};

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId as string;
    const id = req.params["id"] as string;
    // if (!id) throw new AppError("Conversation ID required", 400);
    const conversation = await getConversationById(userId, id!);
    res.json({ status: "ok", conversation });
  } catch (err) {
    next(err);
  }
};
