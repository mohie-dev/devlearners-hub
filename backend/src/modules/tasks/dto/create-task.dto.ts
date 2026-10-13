import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { AcademicContext } from '../../../common/enums.js';

export class CreateTaskDto {
    @ApiProperty({ example: 'Solve Chapter 1 Problems', description: 'Task title', minLength: 2, maxLength: 200 })
    @IsString()
    @MinLength(2)
    @MaxLength(200)
    title: string;

    @ApiPropertyOptional({ example: 'Solve exercises 1 through 10.', description: 'Additional task instructions' })
    @IsOptional()
    @IsString()
    description?: string | null;

    @ApiPropertyOptional({ enum: AcademicContext, example: AcademicContext.TUTORIAL, description: 'Academic context of the task', default: AcademicContext.GENERAL })
    @IsOptional()
    @IsEnum(AcademicContext)
    academicContext?: AcademicContext;

    @ApiPropertyOptional({ example: '2026-11-01T18:00:00.000Z', description: 'Deadline in ISO 8601 format', nullable: true })
    @IsOptional()
    @IsDateString()
    dueAt?: string | null;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID of the subject this task belongs to' })
    @IsUUID()
    subjectId: string;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440001', description: 'Optional UUID of related published or draft content', nullable: true })
    @IsOptional()
    @IsUUID()
    relatedContentItemId?: string | null;
}
