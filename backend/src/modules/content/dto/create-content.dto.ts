import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { AcademicContext, ContentSourceType, ContentStatus, ResourceType } from '../../../common/enums.js';
import { Transform } from 'class-transformer';

export class CreateContentDto {
    @ApiProperty({ example: 'Introduction to Data Structures' })
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    title: string;

    @ApiPropertyOptional({ example: 'Introduction to arrays and linked lists' })
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    description?: string | null;

    @ApiProperty({ enum: AcademicContext, example: AcademicContext.LECTURE })
    @IsEnum(AcademicContext)
    academicContext: AcademicContext;

    @ApiProperty({ enum: ResourceType, example: ResourceType.PDF })
    @IsEnum(ResourceType)
    resourceType: ResourceType;

    @ApiProperty({ enum: ContentSourceType, example: ContentSourceType.UPLOAD })
    @IsEnum(ContentSourceType)
    sourceType: ContentSourceType;

    @ApiProperty({ example: 'subject-uuid' })
    @IsString()
    @IsNotEmpty()
    subjectId: string;

    @ApiPropertyOptional({
        example: 'https://drive.google.com/file/d/example/view',
        description: 'Required for EXTERNAL_LINK; must be omitted for UPLOAD.',
    })
    @ValidateIf((dto: CreateContentDto) => dto.sourceType === ContentSourceType.EXTERNAL_LINK)
    @IsString()
    @IsUrl({ require_protocol: true })
    @MaxLength(2048)
    resourceUrl?: string;

    @ApiPropertyOptional({ enum: ContentStatus, default: ContentStatus.DRAFT })
    @IsOptional()
    @IsEnum(ContentStatus)
    status?: ContentStatus;

    @ApiPropertyOptional({
        type: [String],
        format: 'uuid',
        description: 'IDs of tags belonging to the selected subject',
        example: ['550e8400-e29b-41d4-a716-446655440000'],
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null || value === '') {
            return undefined;
        }

        if (Array.isArray(value)) {
            return value;
        }

        if (typeof value === 'string') {
            const normalized = value.trim();

            if (normalized.startsWith('[')) {
                try {
                    const parsed: unknown = JSON.parse(normalized);

                    if (Array.isArray(parsed)) {
                        return parsed;
                    }
                } catch {
                    return [normalized];
                }
            }

            return [normalized];
        }

        return value;
    })
    @IsArray()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    tagIds?: string[];
}