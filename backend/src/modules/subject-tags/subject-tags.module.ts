import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectsModule } from '../subjects/subjects.module.js';
import { SubjectTag } from './entities/subject-tag.entity.js';
import { SubjectTagsController } from './subject-tags.controller.js';
import { SubjectTagsService } from './subject-tags.service.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([SubjectTag]),
        SubjectsModule,
    ],
    controllers: [SubjectTagsController],
    providers: [SubjectTagsService],
    exports: [SubjectTagsService],
})
export class SubjectTagsModule { }
