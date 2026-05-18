import cloudinary from "../config/cloudinary"
import { AppError } from "../utils/AppError"

export const uploadToCloudinary = async(
    fileBuffer:Buffer,
    mimetype:string,
    originalName:string
): Promise<{url:string ; publicId:string}>=>{
    const resourceType = mimetype.startsWith("video") ? "video" : mimetype.startsWith("image") ? "image" : "raw";

    return new Promise((resolve, reject)=>{


        const stream =  cloudinary.uploader.upload_stream(
            {
                resource_type:resourceType,
                folder:"nexus",
                public_id:`${Date.now()}-${originalName}`,
            },
            (error ,result)=>{
                if(error||!result){
                    reject(new AppError("Upload failed" , 500));
                    return ;
                }
                resolve({
                    url:result.secure_url,
                    publicId:result.public_id
                })
            }
        );
        stream.end(fileBuffer)
    })
}