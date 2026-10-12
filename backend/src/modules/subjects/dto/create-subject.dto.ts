import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { SubjectDepartment } from '../../../common/enums.js';

export class CreateSubjectDto {
    @ApiProperty({ example: 'Data Structures', minLength: 2, maxLength: 150 })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(150)
    name: string;

    @ApiProperty({ example: 'CS201', maxLength: 30, description: 'Unique subject code; normalized to uppercase' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim().toUpperCase() : value)
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    code: string;

    @ApiPropertyOptional({ example: 'Introduction to data structures and algorithms' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() || null : value)
    @IsOptional()
    @IsString()
    description?: string | null;

    @ApiProperty({ enum: [1, 2, 3, 4], example: 2, description: 'Academic level, from 1 to 4' })
    @IsIn([1, 2, 3, 4])
    level: number;

    @ApiProperty({ enum: SubjectDepartment, example: SubjectDepartment.GENERAL })
    @IsEnum(SubjectDepartment)
    department: SubjectDepartment;
}