import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { Subject } from './entities/subject.entity.js';
import { SubjectsController } from './subjects.controller.js';
import { SubjectsService } from './subjects.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([Subject]), AuthModule],
    controllers: [SubjectsController],
    providers: [SubjectsService],
    exports: [SubjectsService],
})
export class SubjectsModule { }