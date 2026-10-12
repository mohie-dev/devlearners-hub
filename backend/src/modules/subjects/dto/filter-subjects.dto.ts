import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { SubjectDepartment } from '../../../common/enums.js';

export class FilterSubjectsDto {
    @ApiPropertyOptional({ example: 2, enum: [1, 2, 3, 4], description: 'Filter by academic level' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(4)
    level?: number;

    @ApiPropertyOptional({ enum: SubjectDepartment, example: SubjectDepartment.CS, description: 'Filter by department' })
    @IsOptional()
    @IsEnum(SubjectDepartment)
    department?: SubjectDepartment;

    @ApiPropertyOptional({ example: 'Data Structures', description: 'Search by subject name or code' })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MaxLength(150)
    search?: string;
}