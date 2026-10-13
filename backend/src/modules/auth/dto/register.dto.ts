import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsIn, IsInt, IsString, MaxLength, MinLength } from 'class-validator';
import { SubjectDepartment, SubjectLevel } from '../../../common/enums.js';

export class RegisterDto {
    @ApiProperty({
        example: 'Abdelrahman Mohie',
        description: 'Full name of the student',
        minLength: 2,
        maxLength: 120,
    })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    fullName: string;

    @ApiProperty({
        example: 'student@example.com',
        description: 'Unique email address used to sign in',
        maxLength: 254,
    })
    @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
    @IsEmail()
    @MaxLength(254)
    email: string;

    @ApiProperty({
        example: '12345678',
        description: 'Password for the new account; minimum 8 characters',
        minLength: 8,
        maxLength: 72,
        format: 'password',
    })
    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password: string;

    @ApiProperty({
        enum: SubjectDepartment,
        example: SubjectDepartment.CS,
        description: 'Academic department of the student',
    })
    @IsEnum(SubjectDepartment)
    department: SubjectDepartment;

    @ApiProperty({
        enum: [SubjectLevel.FIRST, SubjectLevel.SECOND, SubjectLevel.THIRD, SubjectLevel.FOURTH],
        example: SubjectLevel.FIRST,
        description: 'Academic study level of the student',
    })
    @IsInt()
    @IsIn([
        SubjectLevel.FIRST,
        SubjectLevel.SECOND,
        SubjectLevel.THIRD,
        SubjectLevel.FOURTH,
    ])
    studyLevel: SubjectLevel;
}
