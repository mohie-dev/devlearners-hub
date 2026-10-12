import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module.js';
import { CloudinaryController } from './cloudinary.controller.js';
import { CloudinaryService } from './cloudinary.service.js';

@Module({
    imports: [ConfigModule, AuthModule],
    controllers: [CloudinaryController],
    providers: [CloudinaryService],
    exports: [CloudinaryService],
})
export class CloudinaryModule { }