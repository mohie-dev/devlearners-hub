import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'Abdelrahman Mohie', description: 'Full name of the student', minLength: 2, maxLength: 120 })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    fullName: string;

    @ApiProperty({ example: 'student@example.com', description: 'Unique email address used to sign in', maxLength: 254 })
    @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
    @IsEmail()
    @MaxLength(254)
    email: string;

    @ApiProperty({ example: '12345678', description: 'Password for the new account; minimum 8 characters', minLength: 8, maxLength: 72, format: 'password' })
    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password: string;
}