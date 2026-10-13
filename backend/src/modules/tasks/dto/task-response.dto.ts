import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AcademicContext, TaskStatus } from '../../../common/enums.js';

export class TaskResponseDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiProperty({ example: 'Solve Chapter 1 Problems' })
    title: string;

    @ApiPropertyOptional({ example: 'Solve exercises 1 through 10.', nullable: true })
    description: string | null;

    @ApiProperty({ enum: AcademicContext, example: AcademicContext.TUTORIAL })
    academicContext: AcademicContext;

    @ApiPropertyOptional({ example: '2026-11-01T18:00:00.000Z', nullable: true })
    dueAt: Date | null;

    @ApiProperty({ enum: TaskStatus, example: TaskStatus.PUBLISHED })
    status: TaskStatus;

    @ApiPropertyOptional({ example: '2026-10-13T18:00:00.000Z', nullable: true })
    publishedAt: Date | null;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
    subjectId: string;

    @ApiProperty({ example: 'Introduction to Programming' })
    subjectName: string;

    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440001', nullable: true })
    relatedContentItemId: string | null;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440003' })
    createdById: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
