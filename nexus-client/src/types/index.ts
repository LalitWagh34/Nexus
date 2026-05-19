export interface User{
    id:string,
    name:string,
    email:string,
    avatar?:string
}

export interface Message{
    id:string,
    content:string,
    type:string,
    senderId:string,
    createdAt:string,
    conversationId:string,
    updatedAt:string,
    deletedAt:string,
    sender:{
        id:string,
        name:string,
        avatar?:string
    }
    readReceipts:{
        userId:string,
        readAt:string
    }[]
    attachments:{
        id:string;
        url:string;
        type:string;
        size:number;
        name?:string
    }[]
}

export interface Conversation{
    id:string,
    isGroup:boolean,
    name?:string,
    avatar?:string,
    updatedAt:string,
    members:{
        role:string,
        user:{
            id:string,
            name:string,
            avatar?:string
        }
    }[]
    messages :Message[]
    lastMessage?: Message
}