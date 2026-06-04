import prisma from "../config/prisma";

export const findConversationsByUserId = async (userId: string) => {
  return prisma.conversation.findMany({
    where: {
      members: {
        some: { userId }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true }
          }
        }
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          id: true,
          content: true,
          createdAt: true,
          senderId: true,
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  })
}

export const findConversationById = async (id: string, userId: string) => {
  return prisma.conversation.findFirst({
    where: {
      id,
      members: { some: { userId } }
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true }
          }
        }
      }
    }
  })
}

export const createConversation = async (
  userId: string,
  targetUserId: string
) => {
  // Check if 1-1 conversation already exists
  const existing = await prisma.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { members: { some: { userId } } },
        { members: { some: { userId: targetUserId } } }
      ]
    }
  })

  if (existing) return existing

  return prisma.conversation.create({
    data: {
      isGroup: false,
      members: {
        create: [
          { userId, role: 'ADMIN' },
          { userId: targetUserId, role: 'MEMBER' }
        ]
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true }
          }
        }
      }
    }
  })
}

export const createGroupConversation = async (
  userId: string,
  memberIds: string[],
  name: string
) => {
  return prisma.conversation.create({
    data: {
      isGroup: true,
      name,
      members: {
        create: [
          { userId, role: 'ADMIN' },
          ...memberIds.map(id => ({ userId: id, role: 'MEMBER' as const }))
        ]
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true }
          }
        }
      }
    }
  })
}