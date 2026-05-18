import {z} from "zod";

export const sendMessageSchema = z.object({
    content:z.string().min(1, "Message Cannont be Empty").max(2000 , "Message to long"),
    attachment: z.object({
        url: z.string().url(),
        type: z.string(),
        size: z.number(),
        name: z.string(),
    }).optional(),
});

export const createConversation =z.object({
    isGroup:z.boolean().optional().default(false),
    participantId:z.uuid().optional(),
    participantIds:z.array(z.uuid().optional()),
    name:z.string().min(1).max(50).optional(),
});

export const refreshTokenSchema = z.object({
    refreshToken :z.string().min(1, "Refresh token required"),
}) 