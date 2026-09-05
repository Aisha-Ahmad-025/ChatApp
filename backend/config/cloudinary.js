import { v2 as cloudinary } from "cloudinary";
import multer from 'multer'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileToCloudinary = async (file) => {
    const options = {
        resource_type: file.mimetype.startsWith('video') ? 'video' : 'image',
    }

    return new Promise((resolve, reject) => {
        // upload_large is for the large files and upload is for small files
        const uploader = file.mimetype.startsWith('video') ? cloudinary.uploader.upload_large : file.mimetype.startsWith('image') ? cloudinary.uploader.upload : null;

        uploader(file.path, options, (error, result) => {
            fs.unlink(file.path, (err) => { });
            if (error) {
                return reject(error);
            }
            resolve(result);
        })
    })
}

const multerMiddleware = multer({ dest: 'uploads/' }).single('media');

export {
    uploadFileToCloudinary,
    multerMiddleware
}