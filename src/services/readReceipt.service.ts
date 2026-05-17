import prisma from "../config/prisma"
import {io} from "../index"

// --- Mark all unread MEssage
export const  markMessageAsRead = async(userId:string, conversationId:string)=>{
    const unreadMessages = await prisma.message.findMany({
        where:{
            conversationId,
            deletedAt:null,
            senderId:{not:userId},
            readReceipts:{
                none:{userId}
            },
        },
        select:{
            id:true
        }
    })

    if(unreadMessages.length === 0)return ;

    await prisma.messageReadReceipt.createMany({
        data: unreadMessages.map((msg) =>({
            messageId: msg.id,
            userId,
            readAt: new Date(),
        })),
        skipDuplicates:true,
    })

    io.to(conversationId).emit("message:read" ,{
      conversationId,
      userId,
      readAt:new Date(),  
    })
}

export const getUnreadCount = async (userId:string , conversationId:string)=>{
    return prisma.message.count({
        where:{
            conversationId,
            deletedAt:null,
            senderId:{not:userId},
            readReceipts:{
                none:{userId}
            }
        }
    })
}