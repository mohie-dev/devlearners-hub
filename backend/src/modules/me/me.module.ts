import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { StudentTasksModule } from '../student-tasks/student-tasks.module.js';
import { MeController } from './me.controller.js';
import { MeService } from './me.service.js';

@Module({
    imports: [UsersModule, StudentTasksModule],
    controllers: [MeController],
    providers: [MeService],
})
export class MeModule { }
