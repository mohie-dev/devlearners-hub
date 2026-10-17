import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SubjectsService } from '../subjects/subjects.service.js';
import { CreateSubjectTagDto } from './dto/create-subject-tag.dto.js';
import { SubjectTag } from './entities/subject-tag.entity.js';
import { UpdateSubjectTagDto } from './dto/update-subject-tag.dto.js';

@Injectable()
export class SubjectTagsService {
    constructor(
        @InjectRepository(SubjectTag)
        private readonly subjectTagsRepository: Repository<SubjectTag>,
        private readonly subjectsService: SubjectsService,
    ) { }

    async create(subjectId: string, dto: CreateSubjectTagDto): Promise<SubjectTag> {
        const name = dto.name.trim();
        if (!name) {
            throw new BadRequestException('Tag name cannot be empty');
        }

        const subject = await this.subjectsService.findOne(subjectId);
        const existingTag = await this.subjectTagsRepository.findOne({
            where: {
                name,
                subject: { id: subject.id },
            },
        });

        if (existingTag) {
            throw new ConflictException('A tag with this name already exists in this subject');
        }

        try {
            const tag = this.subjectTagsRepository.create({ name, subject, });

            return await this.subjectTagsRepository.save(tag);
        } catch (error) {
            if (this.isUniqueConflict(error)) {
                throw new ConflictException('A tag with this name already exists in this subject');
            }

            throw error;
        }
    }

    async findAllBySubject(subjectId: string): Promise<SubjectTag[]> {
        const subject = await this.subjectsService.findOne(subjectId);
        return this.subjectTagsRepository.find({
            where: {
                subject: { id: subject.id },
            },
            order: {
                name: 'ASC',
            },
        });
    }

    async update(subjectId: string, tagId: string, dto: UpdateSubjectTagDto,): Promise<SubjectTag> {
        if (!Object.keys(dto).length) {
            throw new BadRequestException('At least one field must be provided',);
        }

        const subject = await this.subjectsService.findOne(subjectId);

        const tag = await this.subjectTagsRepository.findOne({
            where: {
                id: tagId,
                subject: { id: subject.id },
            },
        });

        if (!tag) {
            throw new NotFoundException(
                'Tag not found in this subject',
            );
        }

        if (dto.name !== undefined) {
            const name = dto.name.trim();

            if (!name) {
                throw new BadRequestException(
                    'Tag name cannot be empty',
                );
            }

            const existingTag = await this.subjectTagsRepository.findOne({
                where: {
                    name,
                    subject: { id: subject.id },
                },
            });

            if (existingTag && existingTag.id !== tag.id) {
                throw new ConflictException(
                    'A tag with this name already exists in this subject',
                );
            }

            tag.name = name;
        }

        try {
            return await this.subjectTagsRepository.save(tag);
        } catch (error) {
            if (this.isUniqueConflict(error)) {
                throw new ConflictException(
                    'A tag with this name already exists in this subject',
                );
            }

            throw error;
        }
    }

    async remove(subjectId: string, tagId: string): Promise<{ id: string; message: string }> {
        const subject = await this.subjectsService.findOne(subjectId);

        const tag = await this.subjectTagsRepository.findOne({
            where: {
                id: tagId,
                subject: { id: subject.id },
            },
        });

        if (!tag) {
            throw new NotFoundException('Tag not found in this subject');
        }

        await this.subjectTagsRepository.remove(tag);

        return {
            id: tag.id,
            message: 'Tag deleted successfully',
        };
    }

    async findByIdsForSubject(subjectId: string, tagIds: string[],): Promise<SubjectTag[]> {
        if (new Set(tagIds).size !== tagIds.length) {
            throw new BadRequestException(
                'Duplicate tag IDs are not allowed',
            );
        }

        if (!tagIds.length) {
            return [];
        }

        const tags = await this.subjectTagsRepository.find({
            where: {
                id: In(tagIds),
                subject: { id: subjectId },
            },
        });

        if (tags.length !== tagIds.length) {
            throw new BadRequestException(
                'All tags must exist and belong to the content subject',
            );
        }

        return tags;
    }

    private isUniqueConflict(error: unknown): boolean {
        if (!error || typeof error !== 'object' || !('driverError' in error)) {
            return false;
        }
        const driverError = (
            error as { driverError?: { code?: string } }
        ).driverError;

        return driverError?.code === '23505';
    }
}
