import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
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