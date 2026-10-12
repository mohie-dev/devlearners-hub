import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateStudentDto {
    @ApiProperty({ example: 'Abdelrahman Mohie', description: 'Full name of the student', minLength: 2, maxLength: 120 })
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    fullName: string;

    @ApiProperty({ example: 'student@example.com', description: 'Normalized email address for the new account', maxLength: 254 })
    @IsEmail()
    @MaxLength(254)
    email: string;

    @ApiProperty({ description: 'Bcrypt hash of the password; generated internally by AuthService', writeOnly: true })
    @IsString()
    passwordHash: string;
}