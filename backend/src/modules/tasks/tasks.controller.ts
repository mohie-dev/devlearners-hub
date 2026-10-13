import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNoContentResponse,
    ApiNotFoundResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRole } from '../../common/enums.js';
import type { CurrentUserData } from '../../common/interfaces/current-user.interface.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService } from './tasks.service.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { FilterTasksDto } from './dto/filter-tasks.dto.js';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a task', description: 'Admin only. Newly created tasks start as DRAFT.' })
    @ApiResponse({ status: 201, description: 'Task created successfully' })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    @ApiNotFoundResponse({ description: 'Subject or related content not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Admin role required' })
    create(@Body() dto: CreateTaskDto, @CurrentUser() user: CurrentUserData) {
        return this.tasksService.create(dto, user);
    }


    @Get('browse')
    @ApiOperation({
        summary: 'Browse published tasks for an active subject',
        description: 'Returns published tasks without department or study-level restrictions.',
    })
    @ApiQuery({
        name: 'subjectId',
        required: true,
        description: 'Subject UUID',
        format: 'uuid',
    })
    @ApiBadRequestResponse({ description: 'Invalid subject UUID' })
    @ApiNotFoundResponse({ description: 'Active subject not found' })
    browse(@Query() query: FilterTasksDto) {
        return this.tasksService.findPublishedBySubject(query.subjectId);
    }


    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List all tasks', description: 'Admin only. Includes tasks in all statuses.' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Admin role required' })
    findAll() {
        return this.tasksService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get task details', description: 'Admin only.' })
    @ApiParam({ name: 'id', description: 'Task UUID', format: 'uuid' })
    @ApiBadRequestResponse({ description: 'Invalid task UUID' })
    @ApiNotFoundResponse({ description: 'Task not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Admin role required' })
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.tasksService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a task', description: 'Admin only. Only provided fields are updated.' })
    @ApiParam({ name: 'id', description: 'Task UUID', format: 'uuid' })
    @ApiBadRequestResponse({ description: 'Invalid UUID, invalid request body, or empty request body' })
    @ApiNotFoundResponse({ description: 'Task, subject, or related content not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Admin role required' })
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a task', description: 'Admin only. Permanently deletes the task.' })
    @ApiParam({ name: 'id', description: 'Task UUID', format: 'uuid' })
    @ApiNoContentResponse({ description: 'Task deleted successfully' })
    @ApiBadRequestResponse({ description: 'Invalid task UUID' })
    @ApiNotFoundResponse({ description: 'Task not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Admin role required' })
    async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
        await this.tasksService.remove(id);
    }
}
