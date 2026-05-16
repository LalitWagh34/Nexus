import { tr } from "zod/locales";
import prisma from "../config/prisma";
import { AppError } from "../utils/AppError";

const assertMember = async(userId:string , conversationId:string)=>{
    const member =await prisma.conversationMember.findUnique({
        where:{
            userId_conversationId:{
                userId,
                conversationId
            }
        }
    })
    if(!member) throw new AppError("You are not member of this conversation" ,403);
    return member;
}

export const sendMessage = async(
    userId:string,
    conversationId:string,
    content :string
)=>{
    await assertMember(userId ,conversationId)

    const message = await prisma.message.create({
        data:{
            content,
            senderId:userId,
            conversationId
        },
        include:{
            sender:{
                select:{
                    id:true,
                    name:true ,
                    avatar:true
                }
            }
        }
    })

    await prisma.conversation.update({
        where:{
            id:conversationId
        },
        data:{
            updatedAt:new Date()
        }
    })

    return message;
}

export const getMessages =async(
    userId:string,
    conversationId:string,
    cursor?:string,
    limit:number =20
)=>{
    await assertMember(userId ,conversationId)

    const messages =await prisma.message.findMany({
        where:{
            conversationId,
            deletedAt:null,
        },
        include:{
            sender:{
                select:{
                    id:true,
                    name:true,
                    avatar:true
                }
            },
            readReceipts:{
                select:{
                    userId:true,
                    readAt:true
                }
            },
        },
        orderBy:{
                createdAt:"desc"
            },
            take:limit+1,
            ...(cursor&&{
                cursor:{id:cursor},
                skip:1,
        })
    });
    const hasNextPage = messages.length > limit
    if(hasNextPage) messages.pop();

    return {
        messages,
        nextCursor:hasNextPage?messages[messages.length-1]?.id:null
    };
};

export const editMessage =async(
    userId:string,
    messageId:string,
    content:string
)=>{
    const message =await prisma.message.findUnique({
        where:{
            id:messageId
        }
    })
    if(!message || message.deletedAt) throw new AppError("Message Not found" ,404);
    if(message.senderId !== userId) throw new AppError("Cannot Edit someone else message" ,403);

    return prisma.message.update({
        where:{id:messageId},
        data:{
            content
        },
        include:{
            sender:{
                select:{
                    id:true,
                    name:true,
                    avatar:true
                }
            }
        }
    })
}

export const deleteMessage =async(
    userId:string,
    messageId:string
)=>{
    const message =await prisma.message.findUnique({
        where:{
            id:messageId
        }
    })
    if(!message || message.deletedAt) throw new AppError("Message not found" , 404);
    if(message.senderId !== userId) throw new AppError("Cannot Edit someone Else's message" ,403);

    return prisma.message.update({
        where:{
            id:messageId
        },
        data:{
            deletedAt:new Date()
        }
    })
}