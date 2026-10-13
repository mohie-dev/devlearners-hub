import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AddStudentTaskDto } from '../student-tasks/dto/add-student-task.dto.js';
import { UpdateStudentTaskProgressDto } from '../student-tasks/dto/update-student-task-progress.dto.js';
import { MeService } from './me.service.js';

@ApiTags('Me')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me')
export class MeController {
    constructor(private readonly meService: MeService) { }

    @Get()
    @ApiOperation({ summary: 'Get the current authenticated user profile' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiNotFoundResponse({ description: 'User account not found' })
    getProfile(@CurrentUser('id') userId: string) {
        return this.meService.getProfile(userId);
    }

    @Get('tasks')
    @ApiOperation({
        summary: 'Get tasks added to the current student personal list',
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Student role required' })
    getMyTasks(@CurrentUser('id') userId: string) {
        return this.meService.getMyTasks(userId);
    }

    @Post('tasks')
    @ApiOperation({ summary: 'Add a published task to my personal list' })
    @ApiResponse({ status: 201, description: 'Task added successfully' })
    @ApiBadRequestResponse({ description: 'Invalid task UUID' })
    @ApiNotFoundResponse({
        description: 'Published task or active subject not found',
    })
    @ApiForbiddenResponse({ description: 'Student role required' })
    addTask(
        @CurrentUser('id') userId: string,
        @Body() dto: AddStudentTaskDto,
    ) {
        return this.meService.addTask(userId, dto.taskId);
    }

    @Patch('tasks/:taskId/progress')
    @ApiOperation({ summary: 'Update my task progress' })
    @ApiParam({ name: 'taskId', format: 'uuid' })
    @ApiBadRequestResponse({
        description: 'Invalid task UUID or progress status',
    })
    @ApiNotFoundResponse({
        description: 'Task not found in your personal list',
    })
    @ApiForbiddenResponse({ description: 'Student role required' })
    updateTaskProgress(
        @CurrentUser('id') userId: string,
        @Param('taskId', ParseUUIDPipe) taskId: string,
        @Body() dto: UpdateStudentTaskProgressDto,
    ) {
        return this.meService.updateTaskProgress(
            userId,
            taskId,
            dto.status,
        );
    }

    @Delete('tasks/:taskId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove a task from my personal list' })
    @ApiParam({ name: 'taskId', format: 'uuid' })
    @ApiNoContentResponse({ description: 'Task removed successfully' })
    @ApiBadRequestResponse({ description: 'Invalid task UUID' })
    @ApiNotFoundResponse({
        description: 'Task not found in your personal list',
    })
    @ApiForbiddenResponse({ description: 'Student role required' })
    async removeTask(
        @CurrentUser('id') userId: string,
        @Param('taskId', ParseUUIDPipe) taskId: string,
    ): Promise<void> {
        await this.meService.removeTask(userId, taskId);
    }
}
