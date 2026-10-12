import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

const {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error('Cloudinary credentials are missing. Check your .env file.');
    process.exitCode = 1;
} else {
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
        secure: true,
    });

    try {
        const result = await cloudinary.api.ping();
        console.log('Cloudinary connection successful:', result.status);
    } catch {
        console.error('Cloudinary connection failed. Check credentials and network.');
        process.exitCode = 1;
    }
}