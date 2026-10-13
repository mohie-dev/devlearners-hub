import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class FilterTasksDto {
    @ApiPropertyOptional({
        description: 'Filter tasks by subject ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsOptional()
    @IsUUID()
    subjectId!: string;
}
