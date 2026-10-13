import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { TasksService } from '../tasks/tasks.service.js';

@Injectable()
export class MeService {
    constructor(
        private readonly usersService: UsersService,
        private readonly tasksService: TasksService,
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
        return this.tasksService.findMyTasks(userId);
    }
}
