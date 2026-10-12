import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength, ValidateIf } from 'class-validator';
import { AcademicContext, ContentSourceType, ContentStatus, ResourceType } from '../../../common/enums.js';

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
}