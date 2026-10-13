import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectStatus, TaskStatus, UserRole } from '../../common/enums.js';
import { CurrentUserData } from '../../common/interfaces/current-user.interface.js';
import { ContentService } from '../content/content.service.js';
import { Subject } from '../subjects/entities/subject.entity.js';
import { SubjectsService } from '../subjects/subjects.service.js';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { Task } from './entities/task.entity.js';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
        private readonly subjectsService: SubjectsService,
        private readonly contentService: ContentService,
        private readonly usersService: UsersService,
    ) { }

    async create(dto: CreateTaskDto, user: CurrentUserData): Promise<Task> {
        const subject = await this.subjectsService.findOne(dto.subjectId);

        const relatedContentItem = dto.relatedContentItemId
            ? await this.contentService.findOneForTask(dto.relatedContentItemId)
            : null;

        const task = this.tasksRepository.create({
            title: dto.title.trim(),
            description: dto.description?.trim() || null,
            academicContext: dto.academicContext,
            dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
            status: TaskStatus.DRAFT,
            publishedAt: null,
            subject,
            relatedContentItem,
            createdBy: { id: user.id } as User,
        });

        return this.tasksRepository.save(task);
    }

    async findAll(): Promise<Task[]> {
        return this.tasksRepository.find({
            relations: { subject: true, relatedContentItem: true, createdBy: true },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id },
            relations: { subject: true, relatedContentItem: true, createdBy: true },
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        return task;
    }

    async update(id: string, dto: UpdateTaskDto): Promise<Task> {
        if (Object.keys(dto).length === 0) {
            throw new BadRequestException('At least one field must be provided');
        }

        const task = await this.findOne(id);

        if (dto.subjectId !== undefined) {
            task.subject = await this.subjectsService.findOne(dto.subjectId);
        }

        if (dto.relatedContentItemId !== undefined) {
            task.relatedContentItem = dto.relatedContentItemId
                ? await this.contentService.findOneForTask(dto.relatedContentItemId)
                : null;
        }

        if (dto.title !== undefined) task.title = dto.title.trim();
        if (dto.description !== undefined) task.description = dto.description?.trim() || null;
        if (dto.academicContext !== undefined) task.academicContext = dto.academicContext;
        if (dto.dueAt !== undefined) task.dueAt = dto.dueAt ? new Date(dto.dueAt) : null;

        if (dto.status !== undefined) {
            if (dto.status === TaskStatus.PUBLISHED && task.status !== TaskStatus.PUBLISHED) {
                task.publishedAt = new Date();
            }

            if (dto.status === TaskStatus.DRAFT) {
                task.publishedAt = null;
            }

            task.status = dto.status;
        }

        return this.tasksRepository.save(task);
    }

    async remove(id: string): Promise<void> {
        const task = await this.findOne(id);
        await this.tasksRepository.remove(task);
    }

    async findMyTasks(userId: string): Promise<Task[]> {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new NotFoundException('User account not found');
        }

        if (user.role !== UserRole.STUDENT) {
            throw new ForbiddenException('This endpoint is available to students only');
        }

        if (!user.department || !user.studyLevel) {
            throw new BadRequestException('Complete your academic profile to view your tasks');
        }

        return this.tasksRepository.createQueryBuilder('task')
            .innerJoinAndSelect('task.subject', 'subject')
            .leftJoinAndSelect('task.relatedContentItem', 'relatedContentItem')
            .where('task.status = :status', { status: TaskStatus.PUBLISHED })
            .andWhere('subject.status = :subjectStatus', { subjectStatus: SubjectStatus.ACTIVE })
            .andWhere('subject.department = :department', { department: user.department })
            .andWhere('subject.level = :studyLevel', { studyLevel: user.studyLevel })
            .orderBy('task.dueAt', 'ASC', 'NULLS LAST')
            .addOrderBy('task.createdAt', 'DESC')
            .getMany();
    }
}