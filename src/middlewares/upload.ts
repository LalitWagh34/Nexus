import multer from "multer";

const storage =multer.memoryStorage();

export const upload = multer({
    storage ,
    limits:{
        fileSize:10*1024*1024 // 10 MB
    },
    fileFilter(req, file, callback) {
        const allowed =[
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
            "video/mp4",  
        ];

        if(allowed.includes(file.mimetype)){
            callback(null ,true);
        }else{
            callback(new Error("File type not allowed"));
        }
    },

})