import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength, IsUUID, IsArray, ArrayUnique } from 'class-validator';
import { AcademicContext, ContentStatus } from '../../../common/enums.js';

export class UpdateContentDto {
    @ApiPropertyOptional({ example: 'Introduction to Data Structures' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    title?: string;

    @ApiPropertyOptional({ example: 'Updated lecture notes', nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    description?: string | null;

    @ApiPropertyOptional({ enum: AcademicContext })
    @IsOptional()
    @IsEnum(AcademicContext)
    academicContext?: AcademicContext;

    @ApiPropertyOptional({ example: 'subject-uuid' })
    @IsOptional()
    @IsUUID()
    subjectId?: string;

    @ApiPropertyOptional({ example: 'https://drive.google.com/file/d/example/view' })
    @IsOptional()
    @IsUrl({ require_protocol: true })
    @MaxLength(2048)
    resourceUrl?: string;

    @ApiPropertyOptional({ enum: ContentStatus })
    @IsOptional()
    @IsEnum(ContentStatus)
    status?: ContentStatus;

    @ApiPropertyOptional({
        type: [String],
        format: 'uuid',
        description: 'Replaces the current tags. Send an empty array to remove all tags.',
        example: ['550e8400-e29b-41d4-a716-446655440000'],
    })
    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsUUID('all', { each: true })
    tagIds?: string[];
}