import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../../common/enums.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import type { CurrentUserData } from '../../common/interfaces/current-user.interface.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateContentDto } from './dto/create-content.dto.js';
import { FilterContentDto } from './dto/filter-content.dto.js';
import { UpdateContentDto } from './dto/update-content.dto.js';
import { ContentService } from './content.service.js';

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/webp',
]);

const uploadInterceptor = FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    fileFilter: (_req, file, callback) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            return callback(new BadRequestException('Unsupported file type'), false);
        }
        callback(null, true);
    },
});

@ApiTags('Content')
@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) { }

    @Get()
    @ApiOperation({ summary: 'List published content with filters and pagination' })
    findAll(@Query() query: FilterContentDto) {
        return this.contentService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a published content item by ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.contentService.findOnePublished(id);
    }

    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create study content as an admin' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['title', 'academicContext', 'resourceType', 'sourceType', 'subjectId'],
            properties: {
                title: { type: 'string', example: 'Introduction to Data Structures' },
                description: { type: 'string', example: 'Lecture notes' },
                academicContext: { type: 'string', enum: ['LECTURE', 'TUTORIAL', 'GENERAL'] },
                resourceType: { type: 'string', enum: ['PDF', 'VIDEO', 'DOCUMENT', 'IMAGE', 'LINK', 'OTHER'] },
                sourceType: { type: 'string', enum: ['UPLOAD', 'EXTERNAL_LINK'] },
                subjectId: { type: 'string', format: 'uuid' },
                resourceUrl: { type: 'string', example: 'https://www.youtube.com/playlist?list=example' },
                status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
                file: { type: 'string', format: 'binary' },
                tagIds: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'uuid',
                    },
                    description: 'Optional IDs of tags belonging to the selected subject',
                },
            },
        },
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(uploadInterceptor)
    create(@Body() dto: CreateContentDto, @CurrentUser() user: CurrentUserData, @UploadedFile() file?: Express.Multer.File) {
        return this.contentService.create(dto, user, file);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update content metadata or publication status as an admin' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateContentDto) {
        return this.contentService.update(id, dto);
    }

    @Patch(':id/archive')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Archive content as an admin' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    archive(@Param('id', ParseUUIDPipe) id: string) {
        return this.contentService.archive(id);
    }
}