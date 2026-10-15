import type { Repository } from 'typeorm';
import { describe, expect, it, vi } from 'vitest';
import { ContentSourceType } from '../../common/enums.js';
import type { CloudinaryService } from '../cloudinary/cloudinary.service.js';
import type { SubjectsService } from '../subjects/subjects.service.js';
import type { ContentItem } from './entities/content-item.entity.js';
import type { FilterContentDto } from './dto/filter-content.dto.js';
import { ContentService } from './content.service.js';

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
