import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { AcademicContext, ContentSourceType, ResourceType } from '../../../common/enums.js';

export class FilterContentDto {
    @ApiPropertyOptional({ example: 'subject-uuid' })
    @IsOptional()
    @IsUUID()
    subjectId?: string;

    @ApiPropertyOptional({ enum: AcademicContext })
    @IsOptional()
    @IsEnum(AcademicContext)
    academicContext?: AcademicContext;

    @ApiPropertyOptional({
        type: [String],
        format: 'uuid',
        description: 'Filter content by one or more tag IDs. Matches any selected tag.',
        example: ['550e8400-e29b-41d4-a716-446655440000'],
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }

        const values = Array.isArray(value) ? value : [value];

        return values.flatMap((item) =>
            typeof item === 'string'
                ? item.split(',').map((id) => id.trim())
                : [item],
        );
    })
    @IsArray()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    tagIds?: string[];

    @ApiPropertyOptional({ enum: ResourceType })
    @IsOptional()
    @IsEnum(ResourceType)
    resourceType?: ResourceType;

    @ApiPropertyOptional({ enum: ContentSourceType })
    @IsOptional()
    @IsEnum(ContentSourceType)
    sourceType?: ContentSourceType;

    @ApiPropertyOptional({ example: 'data structures' })
    @IsOptional()
    @IsString()
    @MaxLength(150)
    search?: string;

    @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page = 1;

    @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 50, default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit = 20;
}