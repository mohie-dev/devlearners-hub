import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import 'multer'

@Injectable()
export class CloudinaryService {
    constructor(configService: ConfigService) {
        cloudinary.config({
            cloud_name: configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
            api_secret: configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
            secure: true,
        });
    }

    async uploadFile(file: Express.Multer.File) {
        try {
            const result = await new Promise<UploadApiResponse>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'auto', folder: 'devlearners/materials' },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error('Empty upload result'));
                        resolve(result);
                    },
                ).end(file.buffer);
            });

            return {
                publicId: result.public_id,
                url: result.secure_url,
                downloadUrl: cloudinary.url(result.public_id, {
                    secure: true,
                    resource_type: result.resource_type,
                    type: 'upload',
                    flags: 'attachment',
                }),
                resourceType: result.resource_type,
                originalFilename: file.originalname,
                mimeType: file.mimetype,
                sizeBytes: file.size,
            };
        } catch {
            throw new InternalServerErrorException('Failed to upload file to Cloudinary');
        }
    }

    async deleteFile(publicId: string, resourceType: 'image' | 'video' | 'raw') {
        try {
            return await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType,
            });
        } catch {
            throw new InternalServerErrorException('Failed to delete file from Cloudinary');
        }
    }
}