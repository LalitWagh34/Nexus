import {Server as HttpServer} from "http"
import { Server } from "socket.io"
import { verifyAccessToken } from "../utils/jwt"
import redis from "../config/redis"
import prisma from "../config/prisma"

export const initSocket = (httpServer:HttpServer)=>{
    const io = new Server(httpServer ,{
        cors:{
            origin:"*",
            methods:["GET" ,"POST" ]
        }
    })

    io.use(async(socket , next) =>{
        try{
            const token = socket.handshake.auth["token"] as string;

            if(!token) {
                return next(new Error("No token provided"))
            }

            const payload  =verifyAccessToken(token.replace("Bearer " , ""));
            (socket as any).userId = payload.userId;
            next();
        }catch(err){
            next(new Error("Invalid or expired token "));
        }
    });

    io.on("connection" , async(socket)=>{
        const userId = (socket as any).userId as string;
        console.log(`User connected:${userId}`)

        await redis.set(`user:online:${userId}` , socket.id);

        socket.on("room:join" , async(conversationId:string)=>{
            const member = await prisma.conversationMember.findUnique({
                where:{
                    userId_conversationId:{
                        userId,
                        conversationId
                    }
                }
            })
            if(!member) {
                socket.emit("error" , "You are not a member of this conversation")
                return 
            }
            socket.join(conversationId);
            console.log(`User ${userId} joined room ${conversationId}`);
        })

        socket.on("room:leave" , (conversationId:string)=>{
            socket.leave(conversationId);
            console.log(`User ${userId} left room ${conversationId}`)
        })

        socket.on("typing:start" ,(conversationId:string)=>{
            socket.to(conversationId).emit("user:typing" , {userId ,conversationId})
        })

        socket.on("typing:stop" ,(conversationId:string)=>{
            socket.to(conversationId).emit("user:stopped_typing" , {userId ,conversationId})
        })

        socket.on("disconnect" ,async()=>{
            console.log("User disconnecte: ${userId}")
            await redis.del(`user:online:${userId} `)
        })


    })
    return io;
}