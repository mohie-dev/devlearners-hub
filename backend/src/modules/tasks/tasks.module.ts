import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentModule } from '../content/content.module.js';
import { SubjectsModule } from '../subjects/subjects.module.js';
import { UsersModule } from '../users/users.module.js';
import { Task } from './entities/task.entity.js';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        SubjectsModule,
        ContentModule,
        UsersModule,
    ],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule { }