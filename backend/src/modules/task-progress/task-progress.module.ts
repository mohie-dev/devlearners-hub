import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskProgress } from './entities/task-progress.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([TaskProgress])],
    exports: [TypeOrmModule],
})
export class TaskProgressModule { }