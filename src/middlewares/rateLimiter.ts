import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:{status:"error" , message:"Too many requests ,slow down"},
    standardHeaders:true,
    legacyHeaders:false
})


export const authLimiter =rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:{status:"error" , message:"Too many auth attempts ,try later"},
    standardHeaders:true,
    legacyHeaders:false 
})