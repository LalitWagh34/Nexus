import { z } from "zod";
import type { Request ,Response,NextFunction } from "express";
import { Schema } from "zod/v3";

export const validate = (Schema: z.ZodType)=>{
    return (req:Request , res:Response , next:NextFunction)=>{
        const result = Schema.safeParse(req.body)

        if(!result.success){
            res.status(400).json({
                status:"error",
                message:'Validation Required',
                errors:z.treeifyError(result.error),
            });
            return 
        }
        req.body = result.data;
        next();
    }
}