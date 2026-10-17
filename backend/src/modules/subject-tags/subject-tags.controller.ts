import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSubjectTagDto } from './dto/create-subject-tag.dto.js';
import { SubjectTagsService } from './subject-tags.service.js';
import { UpdateSubjectTagDto } from './dto/update-subject-tag.dto.js';
import { UserRole } from '../../common/enums.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@ApiTags('Subject Tags')
@Controller()
export class SubjectTagsController {
    constructor(
        private readonly subjectTagsService: SubjectTagsService,
    ) { }

    @Post('subjects/:subjectId/tags')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a tag for a subject' })
    @ApiParam({ name: 'subjectId', description: 'UUID of the subject', })
    @ApiResponse({ status: 201, description: 'Tag created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid subject ID or tag name' })
    @ApiResponse({ status: 404, description: 'Subject not found or inactive' })
    @ApiResponse({ status: 409, description: 'Tag name already exists in this subject' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(
        @Param('subjectId', ParseUUIDPipe) subjectId: string,
        @Body() dto: CreateSubjectTagDto,
    ) {
        return this.subjectTagsService.create(subjectId, dto);
    }

    @Get('subjects/:subjectId/tags')
    @ApiOperation({ summary: 'Get all tags for a subject' })
    @ApiParam({ name: 'subjectId', description: 'UUID of the subject', })
    @ApiResponse({ status: 200, description: 'Subject tags retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Subject not found or inactive' })
    findAll(
        @Param('subjectId', ParseUUIDPipe) subjectId: string,
    ) {
        return this.subjectTagsService.findAllBySubject(subjectId);
    }

    @Patch('subjects/:subjectId/tags/:tagId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a subject tag' })
    @ApiParam({ name: 'subjectId', description: 'UUID of the subject', })
    @ApiParam({ name: 'tagId', description: 'UUID of the tag', })
    @ApiResponse({ status: 200, description: 'Tag updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid UUID or tag name' })
    @ApiResponse({ status: 404, description: 'Subject or tag not found' })
    @ApiResponse({ status: 409, description: 'Tag name already exists in this subject' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(
        @Param('subjectId', ParseUUIDPipe) subjectId: string,
        @Param('tagId', ParseUUIDPipe) tagId: string,
        @Body() dto: UpdateSubjectTagDto,
    ) {
        return this.subjectTagsService.update(subjectId, tagId, dto);
    }

    @Delete('subjects/:subjectId/tags/:tagId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a subject tag' })
    @ApiParam({ name: 'subjectId', description: 'UUID of the subject', })
    @ApiParam({ name: 'tagId', description: 'UUID of the tag', })
    @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
    @ApiResponse({ status: 404, description: 'Subject or tag not found' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(
        @Param('subjectId', ParseUUIDPipe) subjectId: string,
        @Param('tagId', ParseUUIDPipe) tagId: string,
    ) {
        return this.subjectTagsService.remove(subjectId, tagId);
    }
}
