import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Subject])],
    exports: [TypeOrmModule],
})
export class SubjectsModule { }
