import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicContext, ContentSourceType, ContentStatus, ResourceType } from '../../common/enums.js';
import { CurrentUserData } from '../../common/interfaces/current-user.interface.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import { SubjectsService } from '../subjects/subjects.service.js';
import { User } from '../users/entities/user.entity.js';
import { ContentItem } from './entities/content-item.entity.js';
import { CreateContentDto } from './dto/create-content.dto.js';
import { FilterContentDto } from './dto/filter-content.dto.js';
import { UpdateContentDto } from './dto/update-content.dto.js';

@Injectable()
export class ContentService {
    constructor(
        @InjectRepository(ContentItem) private readonly contentRepository: Repository<ContentItem>,
        private readonly subjectsService: SubjectsService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    async create(dto: CreateContentDto, user: CurrentUserData, file?: Express.Multer.File): Promise<ContentItem> {
        if (dto.sourceType === ContentSourceType.UPLOAD) {
            if (!file) throw new BadRequestException('A file is required for UPLOAD content');
            if (dto.resourceUrl) throw new BadRequestException('resourceUrl must not be provided for UPLOAD content');
            this.validateResourceType(dto.resourceType, file.mimetype);
        } else {
            if (file) throw new BadRequestException('Files are not allowed for EXTERNAL_LINK content');
            if (!dto.resourceUrl) throw new BadRequestException('resourceUrl is required for EXTERNAL_LINK content');
        }

        const subject = await this.subjectsService.findOne(dto.subjectId);
        let uploadedFile: Awaited<ReturnType<CloudinaryService['uploadFile']>> | undefined;

        if (file) uploadedFile = await this.cloudinaryService.uploadFile(file);

        try {
            const status = dto.status ?? ContentStatus.DRAFT;
            const content = this.contentRepository.create({
                title: dto.title.trim(),
                description: dto.description?.trim() || null,
                academicContext: dto.academicContext ?? AcademicContext.GENERAL,
                resourceType: dto.resourceType,
                sourceType: dto.sourceType,
                resourceUrl: uploadedFile?.url ?? dto.resourceUrl ?? null,
                storageKey: uploadedFile?.publicId ?? null,
                originalFilename: uploadedFile?.originalFilename ?? null,
                mimeType: uploadedFile?.mimeType ?? null,
                sizeBytes: uploadedFile ? String(uploadedFile.sizeBytes) : null,
                status,
                publishedAt: status === ContentStatus.PUBLISHED ? new Date() : null,
                subject,
                createdBy: { id: user.id } as User,
            });

            return await this.contentRepository.save(content);
        } catch (error) {
            if (uploadedFile) {
                try {
                    await this.cloudinaryService.deleteFile(uploadedFile.publicId, uploadedFile.resourceType as 'image' | 'video' | 'raw');
                } catch {
                    // Preserve the original error if cleanup fails.
                }
            }
            throw error;
        }
    }


    async findAll(query: FilterContentDto) {
        const { page = 1, limit = 20 } = query;
        const qb = this.contentRepository.createQueryBuilder('content')
            .leftJoinAndSelect('content.subject', 'subject')
            .where('content.status = :status', { status: ContentStatus.PUBLISHED });

        if (query.subjectId) qb.andWhere('subject.id = :subjectId', { subjectId: query.subjectId });
        if (query.academicContext) qb.andWhere('content.academicContext = :academicContext', { academicContext: query.academicContext });
        if (query.resourceType) qb.andWhere('content.resourceType = :resourceType', { resourceType: query.resourceType });
        if (query.search?.trim()) {
            qb.andWhere('(content.title ILIKE :search OR content.description ILIKE :search)', {
                search: `%${query.search.trim()}%`,
            });
        }

        const [items, total] = await qb
            .orderBy('content.publishedAt', 'DESC', 'NULLS LAST')
            .addOrderBy('content.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOnePublished(id: string): Promise<ContentItem> {
        const content = await this.contentRepository.findOne({
            where: { id, status: ContentStatus.PUBLISHED },
            relations: { subject: true },
        });

        if (!content) throw new NotFoundException('Published content not found');
        return content;
    }

    async findOneForTask(id: string): Promise<ContentItem> {
        const content = await this.contentRepository.findOneBy({ id });

        if (!content) {
            throw new NotFoundException('Content not found');
        }

        return content;
    }

    async update(id: string, dto: UpdateContentDto): Promise<ContentItem> {
        if (!Object.keys(dto).length) throw new BadRequestException('At least one field must be provided');

        const content = await this.contentRepository.findOne({
            where: { id },
            relations: { subject: true },
        });

        if (!content) throw new NotFoundException('Content not found');
        if (content.status === ContentStatus.ARCHIVED) {
            throw new BadRequestException('Archived content cannot be updated');
        }

        if (dto.subjectId) content.subject = await this.subjectsService.findOne(dto.subjectId);
        if (dto.title !== undefined) content.title = dto.title.trim();
        if (dto.description !== undefined) content.description = dto.description?.trim() || null;
        if (dto.academicContext !== undefined) content.academicContext = dto.academicContext;

        if (dto.resourceUrl !== undefined) {
            if (content.sourceType !== ContentSourceType.EXTERNAL_LINK) {
                throw new BadRequestException('Only external-link content can update resourceUrl');
            }
            content.resourceUrl = dto.resourceUrl;
        }

        if (dto.status !== undefined) {
            if (dto.status === ContentStatus.ARCHIVED) {
                throw new BadRequestException('Use the archive endpoint to archive content');
            }
            if (dto.status === ContentStatus.PUBLISHED && content.status !== ContentStatus.PUBLISHED) {
                content.publishedAt = new Date();
            } else if (dto.status === ContentStatus.DRAFT) {
                content.publishedAt = null;
            }
            content.status = dto.status;
        }

        return this.contentRepository.save(content);
    }

    async archive(id: string): Promise<ContentItem> {
        const content = await this.contentRepository.findOne({ where: { id } });
        if (!content) throw new NotFoundException('Content not found');

        if (content.status !== ContentStatus.ARCHIVED) {
            content.status = ContentStatus.ARCHIVED;
            await this.contentRepository.save(content);
        }

        return content;
    }

    private validateResourceType(resourceType: ResourceType, mimeType: string): void {
        const validTypes: Partial<Record<ResourceType, string[]>> = {
            [ResourceType.PDF]: ['application/pdf'],
            [ResourceType.DOCUMENT]: [
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/plain',
            ],
            [ResourceType.IMAGE]: ['image/jpeg', 'image/png', 'image/webp'],
        };

        if (!validTypes[resourceType]?.includes(mimeType)) {
            throw new BadRequestException('Resource type does not match the uploaded file type');
        }
    }
}