import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from '../tasks/tasks.module.js';
import { UsersModule } from '../users/users.module.js';
import { StudentTask } from './entities/student-task.entity.js';
import { StudentTasksService } from './student-tasks.service.js';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentTask]),
        TasksModule,
        UsersModule,
    ],
    providers: [StudentTasksService],
    exports: [StudentTasksService],
})
export class StudentTasksModule { }
