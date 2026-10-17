
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMyProfileDto {
    @ApiPropertyOptional({
        description: 'Updated full name',
        example: 'Abdelrahman Mohie',
        minLength: 2,
        maxLength: 120,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(120)
    fullName: string;
}
