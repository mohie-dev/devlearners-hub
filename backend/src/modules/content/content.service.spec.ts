import type { Repository } from 'typeorm';
import { describe, expect, it, vi } from 'vitest';
import { AcademicContext, ContentSourceType, ResourceType, UserRole } from '../../common/enums.js';
import type { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import type { SubjectsService } from '../subjects/subjects.service.js';
import type { SubjectTagsService } from '../subject-tags/subject-tags.service.js';
import type { ContentItem } from './entities/content-item.entity.js';
import type { CreateContentDto } from './dto/create-content.dto.js';
import type { FilterContentDto } from './dto/filter-content.dto.js';
import { ContentService } from './content.service.js';
import type { CurrentUserData } from '../../common/interfaces/current-user.interface.js';

describe('ContentService.findAll filters', () => {
    it('filters published content by source type', async () => {
        const queryBuilder: Record<string, ReturnType<typeof vi.fn>> = {};
        for (const method of ['leftJoinAndSelect', 'where', 'andWhere', 'orderBy', 'addOrderBy', 'skip', 'take']) {
            queryBuilder[method] = vi.fn().mockReturnValue(queryBuilder);
        }
        queryBuilder.getManyAndCount = vi.fn().mockResolvedValue([[], 0]);
        const repository = {
            createQueryBuilder: vi.fn().mockReturnValue(queryBuilder),
        };
        const service = new ContentService(
            repository as unknown as Repository<ContentItem>,
            {} as SubjectsService,
            {} as CloudinaryService,
            {} as SubjectTagsService,
        );

        await service.findAll({
            sourceType: ContentSourceType.EXTERNAL_LINK,
            page: 1,
            limit: 20,
        } as FilterContentDto);

        expect(queryBuilder.andWhere).toHaveBeenCalledWith(
            'content.sourceType = :sourceType',
            { sourceType: ContentSourceType.EXTERNAL_LINK },
        );
    });
});

describe('ContentService.create tags', () => {
    it('persists the selected subject tags with new content', async () => {
        const tags = [{ id: 'tag-1', name: 'Lecture notes' }];
        const contentRepository = {
            create: vi.fn((content: Partial<ContentItem>) => content),
            save: vi.fn(async (content: Partial<ContentItem>) => content),
        };
        const subjectsService = {
            findOne: vi.fn().mockResolvedValue({ id: 'subject-1' }),
        };
        const subjectTagsService = {
            findByIdsForSubject: vi.fn().mockResolvedValue(tags),
        };
        const service = new ContentService(
            contentRepository as unknown as Repository<ContentItem>,
            subjectsService as unknown as SubjectsService,
            {} as CloudinaryService,
            subjectTagsService as unknown as SubjectTagsService,
        );

        await service.create(
            {
                title: 'Lecture one',
                academicContext: AcademicContext.LECTURE,
                resourceType: ResourceType.PDF,
                sourceType: ContentSourceType.EXTERNAL_LINK,
                subjectId: 'subject-1',
                resourceUrl: 'https://example.com/lecture',
                tagIds: ['tag-1'],
            } as CreateContentDto,
            { id: 'admin-1', email: 'admin@example.com', role: UserRole.ADMIN } as CurrentUserData,
        );

        expect(contentRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ tags }),
        );
        expect(contentRepository.save).toHaveBeenCalledWith(
            expect.objectContaining({ tags }),
        );
    });
});
