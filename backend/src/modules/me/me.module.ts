import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { TasksModule } from '../tasks/tasks.module.js';
import { MeController } from './me.controller.js';
import { MeService } from './me.service.js';

@Module({
    imports: [UsersModule, TasksModule],
    controllers: [MeController],
    providers: [MeService],
})
export class MeModule { }
