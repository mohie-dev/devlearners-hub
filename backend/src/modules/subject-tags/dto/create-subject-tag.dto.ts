import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSubjectTagDto {
    @ApiProperty({
        description: 'Name of the tag within the subject',
        example: 'Lecture Notes',
        minLength: 1,
        maxLength: 50,
    })
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    name: string;
}