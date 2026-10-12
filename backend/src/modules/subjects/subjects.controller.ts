import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, } from '@nestjs/common';
import {
    ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiForbiddenResponse,
    ApiNotFoundResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { SubjectDepartment, UserRole } from '../../common/enums.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { CreateSubjectDto } from './dto/create-subject.dto.js';
import { UpdateSubjectDto } from './dto/update-subject.dto.js';
import { SubjectsService } from './subjects.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { FilterSubjectsDto } from './dto/filter-subjects.dto.js';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
    constructor(private readonly subjectsService: SubjectsService) { }

    @Get()
    @Public()
    @ApiOperation({ summary: 'List active subjects with optional filters' })
    @ApiQuery({ name: 'level', required: false, enum: [1, 2, 3, 4] })
    @ApiQuery({ name: 'department', required: false, enum: SubjectDepartment })
    @ApiQuery({ name: 'search', required: false, example: 'Data Structures' })
    findAll(@Query() filters: FilterSubjectsDto) {
        return this.subjectsService.findAll(filters);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get an active subject by ID' })
    @ApiParam({ name: 'id', description: 'Subject UUID', format: 'uuid' })
    @ApiBadRequestResponse({ description: 'Invalid subject UUID' })
    @ApiNotFoundResponse({ description: 'Active subject not found' })
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.subjectsService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a subject', description: 'Admin only.' })
    @ApiBadRequestResponse({ description: 'Invalid request body' })
    @ApiConflictResponse({ description: 'Subject code already exists' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Admin role required' })
    create(@Body() dto: CreateSubjectDto) {
        return this.subjectsService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a subject', description: 'Admin only. Only provided fields are updated.' })
    @ApiParam({ name: 'id', description: 'Subject UUID', format: 'uuid' })
    @ApiBadRequestResponse({ description: 'Invalid UUID or empty request body' })
    @ApiConflictResponse({ description: 'Subject code already exists' })
    @ApiNotFoundResponse({ description: 'Subject not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Admin role required' })
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateSubjectDto) {
        return this.subjectsService.update(id, dto);
    }

    @Patch(':id/archive')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Archive a subject', description: 'Admin only. Archived subjects are excluded from public listings.' })
    @ApiParam({ name: 'id', description: 'Subject UUID', format: 'uuid' })
    @ApiBadRequestResponse({ description: 'Invalid subject UUID' })
    @ApiNotFoundResponse({ description: 'Subject not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Admin role required' })
    archive(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.subjectsService.archive(id);
    }
}