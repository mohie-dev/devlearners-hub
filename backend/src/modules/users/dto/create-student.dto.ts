import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsIn, IsInt, IsString, MaxLength, MinLength } from 'class-validator';
import { SubjectDepartment, SubjectLevel } from '../../../common/enums.js';

export class CreateStudentDto {
    @ApiProperty({ example: 'Abdelrahman Mohie', description: 'Full name of the student', minLength: 2, maxLength: 120, })
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    fullName: string;

    @ApiProperty({
        example: 'student@example.com',
        description: 'Normalized email address for the new account',
        maxLength: 254,
    })
    @IsEmail()
    @MaxLength(254)
    email: string;

    @ApiProperty({
        description: 'Bcrypt hash of the password; generated internally by AuthService',
        writeOnly: true,
    })
    @IsString()
    passwordHash: string;

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
