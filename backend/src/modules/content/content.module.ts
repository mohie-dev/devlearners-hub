import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '../cloudinary/cloudinary.module.js';
import { SubjectsModule } from '../subjects/subjects.module.js';
import { ContentItem } from './entities/content-item.entity.js';
import { ContentController } from './content.controller.js';
import { ContentService } from './content.service.js';
import { SubjectTagsModule } from '../subject-tags/subject-tags.module.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([ContentItem]),
        SubjectsModule,
        CloudinaryModule,
        SubjectTagsModule
    ],
    controllers: [ContentController],
    providers: [ContentService],
    exports: [ContentService],
})
export class ContentModule { }