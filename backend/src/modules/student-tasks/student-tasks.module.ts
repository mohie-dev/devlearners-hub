import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentTask } from './entities/student-task.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([StudentTask])],
    exports: [TypeOrmModule],
})
export class StudentTasksModule { }