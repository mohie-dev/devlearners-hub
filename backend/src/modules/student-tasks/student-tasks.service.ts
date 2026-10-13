import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { SubjectStatus, TaskProgressStatus, TaskStatus, UserRole } from '../../common/enums.js';
import { StudentTask } from './entities/student-task.entity.js';
import { TasksService } from '../tasks/tasks.service.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class StudentTasksService {
    constructor(
        @InjectRepository(StudentTask)
        private readonly studentTasksRepository: Repository<StudentTask>,
        private readonly tasksService: TasksService,
        private readonly usersService: UsersService,
    ) { }

    async addTask(userId: string, taskId: string): Promise<StudentTask> {
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new NotFoundException('User account not found');
        }

        if (user.role !== UserRole.STUDENT) {
            throw new ForbiddenException(
                'Only students can add tasks to their personal list',
            );
        }

        const task = await this.tasksService.findOne(taskId);

        if (
            task.status !== TaskStatus.PUBLISHED ||
            task.subject.status !== SubjectStatus.ACTIVE
        ) {
            throw new NotFoundException(
                'Published task not found in an active subject',
            );
        }

        const existingStudentTask =
            await this.studentTasksRepository.findOne({
                where: { studentId: userId, taskId },
                relations: { task: true },
            });

        if (existingStudentTask) {
            return existingStudentTask;
        }

        const studentTask = this.studentTasksRepository.create({
            studentId: userId,
            taskId,
            status: TaskProgressStatus.PENDING,
            completedAt: null,
        });

        try {
            return await this.studentTasksRepository.save(studentTask);
        } catch (error) {
            if (
                error instanceof QueryFailedError &&
                (error as QueryFailedError & {
                    driverError?: { code?: string };
                }).driverError?.code === '23505'
            ) {
                const existing =
                    await this.studentTasksRepository.findOne({
                        where: { studentId: userId, taskId },
                        relations: { task: true },
                    });

                if (existing) {
                    return existing;
                }
            }

            throw error;
        }
    }

    async findMyTasks(userId: string): Promise<StudentTask[]> {
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new NotFoundException('User account not found');
        }

        if (user.role !== UserRole.STUDENT) {
            throw new ForbiddenException(
                'This endpoint is available to students only',
            );
        }

        return this.studentTasksRepository
            .createQueryBuilder('studentTask')
            .innerJoinAndSelect('studentTask.task', 'task')
            .innerJoinAndSelect('task.subject', 'subject')
            .leftJoinAndSelect(
                'task.relatedContentItem',
                'relatedContentItem',
            )
            .where('studentTask.studentId = :userId', { userId })
            .andWhere('task.status = :taskStatus', {
                taskStatus: TaskStatus.PUBLISHED,
            })
            .andWhere('subject.status = :subjectStatus', {
                subjectStatus: SubjectStatus.ACTIVE,
            })
            .orderBy('task.dueAt', 'ASC', 'NULLS LAST')
            .addOrderBy('studentTask.createdAt', 'DESC')
            .getMany();
    }

    async updateProgress(userId: string, taskId: string, status: TaskProgressStatus,): Promise<StudentTask> {
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new NotFoundException('User account not found');
        }

        if (user.role !== UserRole.STUDENT) {
            throw new ForbiddenException(
                'Only students can update their task progress',
            );
        }

        if (!Object.values(TaskProgressStatus).includes(status)) {
            throw new BadRequestException('Invalid task progress status');
        }

        const studentTask = await this.studentTasksRepository.findOne({
            where: { studentId: userId, taskId },
            relations: { task: true },
        });

        if (!studentTask) {
            throw new NotFoundException(
                'Task not found in your personal task list',
            );
        }

        studentTask.status = status;
        studentTask.completedAt =
            status === TaskProgressStatus.COMPLETED
                ? studentTask.completedAt ?? new Date()
                : null;

        return this.studentTasksRepository.save(studentTask);
    }

    async removeTask(userId: string, taskId: string): Promise<void> {
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new NotFoundException('User account not found');
        }

        if (user.role !== UserRole.STUDENT) {
            throw new ForbiddenException(
                'Only students can remove tasks from their personal list',
            );
        }

        const studentTask = await this.studentTasksRepository.findOne({
            where: { studentId: userId, taskId },
        });

        if (!studentTask) {
            throw new NotFoundException(
                'Task not found in your personal task list',
            );
        }

        await this.studentTasksRepository.remove(studentTask);
    }
}
