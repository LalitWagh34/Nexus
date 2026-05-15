import prisma from "../config/prisma"
import { AppError } from "../utils/AppError"

export const findOrCreateDirect  =async (userId:string ,participantId: string)=>{
    if(userId === participantId){
        throw new AppError("Cannot start a conversation with yourself",400)
    }
    const exisiting = await prisma.conversation.findFirst({
        where:{
            isGroup:false,
            AND: [
                { members: { some: { userId } } },
                { members: { some: { userId: participantId } } },
            ],
        },
        include:{
            members:{
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            avatar:true
                        }
                    }
                }
            }
        }
        
    })

    if(exisiting) return exisiting;

    return prisma.conversation.create({
        data:{
            isGroup:false,
            members:{
                create:[
                    {userId, role:"MEMBER"},
                    { userId: participantId, role: "MEMBER" }
                ]
            }
        },
        include:{
            members:{
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            avatar:true
                        }
                    }
                }
            }
        }
    })
}

export const createGroup = async (
    userId: string,
    name: string,
    participantIds: string[]
)=>{
    if(!name?.trim()) throw new AppError("Group name is required" ,400);
    if(participantIds.length<2){
        throw new AppError("Group must contain at least 2 other participants" , 400)
    }

    const allMemberIds = [...new Set([userId , ...participantIds])];

    return prisma.conversation.create({
        data:{
            isGroup:true,
            name:name.trim(),
            members:{
                create: allMemberIds.map((id) => ({
                    userId: id,
                    role: id === userId ? "ADMIN" : "MEMBER",
                }))
            },
        },
        include:{
            members:{
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            avatar:true
                        }
                    }
                }
            }
        }
    })
}

export const getUserConversations = async (userId: string) => {
  return prisma.conversation.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1, // last message preview
        where: { deletedAt: null },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const getConversationById = async (userId: string, conversationId: string) => {
    const conversation = await prisma.conversation.findFirst({
        where:{
            id:conversationId,
            members:{
                some:{
                    userId
                }
            }
        },
        include:{
            members:{
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            avatar:true
                        }
                    }
                },
            },
        },
    });
    if (!conversation) throw new AppError("Conversation not found", 404);
    return conversation;
}
