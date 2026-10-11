import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentItem } from './entities/content-item.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([ContentItem])],
    exports: [TypeOrmModule],
})
export class ContentModule { }