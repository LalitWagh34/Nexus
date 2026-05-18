import type { Request, Response , NextFunction } from "express";
import { uploadToCloudinary } from "../services/upload.service";
import { AppError } from "../utils/AppError";

export const uploadFile =async(req :Request , res:Response, next:NextFunction)=>{
    try{
        if(!req.file) throw new AppError("No file provided" , 400);

        const {buffer ,mimetype , originalname} =req.file;
        const {url , publicId} = await uploadToCloudinary(buffer , mimetype,originalname);
        res.json({
            status:"ok",
            url ,
            publicId
        });

    }catch(err){
        next(err);
    }
}