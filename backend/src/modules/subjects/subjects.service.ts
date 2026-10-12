import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectStatus } from '../../common/enums.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { Subject } from './entities/subject.entity.js';
import { FilterSubjectsDto } from './dto/filter-subjects.dto.js';

@Injectable()
export class SubjectsService {
    constructor(@InjectRepository(Subject) private readonly subjectsRepository: Repository<Subject>) { }

    async findAll(filters: FilterSubjectsDto): Promise<Subject[]> {
        const query = this.subjectsRepository.createQueryBuilder('subject')
            .where('subject.status = :status', { status: SubjectStatus.ACTIVE });

        if (filters.level !== undefined) {
            query.andWhere('subject.level = :level', { level: filters.level });
        }

        if (filters.department !== undefined) {
            query.andWhere('subject.department = :department', { department: filters.department });
        }

        if (filters.search) {
            query.andWhere(
                '(subject.name ILIKE :search OR subject.code ILIKE :search)',
                { search: `%${filters.search}%` },
            );
        }

        return query.orderBy('subject.name', 'ASC').getMany();
    }


    async findOne(id: string): Promise<Subject> {
        const subject = await this.subjectsRepository.findOneBy({ id, status: SubjectStatus.ACTIVE });
        if (!subject) throw new NotFoundException('Subject not found');
        return subject;
    }

    async create(dto: CreateSubjectDto): Promise<Subject> {
        const code = dto.code.trim().toUpperCase();
        const existing = await this.subjectsRepository.findOneBy({ code });

        if (existing) throw new ConflictException('Subject code already exists');

        try {
            const subject = this.subjectsRepository.create({ ...dto, code });
            return await this.subjectsRepository.save(subject);
        } catch (error) {
            if (this.isUniqueConflict(error)) {
                throw new ConflictException('Subject code already exists');
            }
            throw error;
        }
    }

    async update(id: string, dto: UpdateSubjectDto): Promise<Subject> {
        if (Object.keys(dto).length === 0) {
            throw new BadRequestException('At least one field must be provided');
        }

        const subject = await this.subjectsRepository.findOneBy({ id });
        if (!subject) throw new NotFoundException('Subject not found');

        const updateData: UpdateSubjectDto = { ...dto };

        if (updateData.code !== undefined) {
            const code = updateData.code.trim().toUpperCase();
            const existing = await this.subjectsRepository.findOneBy({ code });

            if (existing && existing.id !== id) {
                throw new ConflictException('Subject code already exists');
            }

            updateData.code = code;
        }

        Object.assign(subject, updateData);

        try {
            return await this.subjectsRepository.save(subject);
        } catch (error) {
            if (this.isUniqueConflict(error)) {
                throw new ConflictException('Subject code already exists');
            }
            throw error;
        }
    }

    async archive(id: string): Promise<Subject> {
        const subject = await this.subjectsRepository.findOneBy({ id });
        if (!subject) throw new NotFoundException('Subject not found');

        if (subject.status !== SubjectStatus.ARCHIVED) {
            subject.status = SubjectStatus.ARCHIVED;
            return this.subjectsRepository.save(subject);
        }

        return subject;
    }

    private isUniqueConflict(error: unknown): boolean {
        if (!error || typeof error !== 'object' || !('driverError' in error)) return false;
        const driverError = (error as { driverError?: { code?: string } }).driverError;
        return driverError?.code === '23505';
    }
}