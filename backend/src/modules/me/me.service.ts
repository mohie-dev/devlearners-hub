import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { StudentTasksService } from '../student-tasks/student-tasks.service.js';

@Injectable()
export class MeService {
    constructor(
        private readonly usersService: UsersService,
        private readonly studentTasksService: StudentTasksService,
    ) { }

    async getProfile(userId: string) {
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User account no longer exists');
        }

        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            department: user.department,
            studyLevel: user.studyLevel,
        };
    }

    getMyTasks(userId: string) {
        return this.studentTasksService.findMyTasks(userId);
    }

    addTask(userId: string, taskId: string) {
        return this.studentTasksService.addTask(userId, taskId);
    }

    updateTaskProgress(
        userId: string,
        taskId: string,
        status: import('../../common/enums.js').TaskProgressStatus,
    ) {
        return this.studentTasksService.updateProgress(
            userId,
            taskId,
            status,
        );
    }

    removeTask(userId: string, taskId: string) {
        return this.studentTasksService.removeTask(userId, taskId);
    }
}
