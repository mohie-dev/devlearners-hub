import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'student@example.com', description: 'Email address registered to the account', maxLength: 254 })
    @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
    @IsEmail()
    @MaxLength(254)
    email: string;

    @ApiProperty({ example: 'StrongPass123!', description: 'Account password', minLength: 8, maxLength: 72, format: 'password' })
    @IsString()
    @MinLength(8)
    @MaxLength(72)
    password: string;
}