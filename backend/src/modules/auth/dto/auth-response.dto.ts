import { ApiProperty } from '@nestjs/swagger';
import { AuthUserResponseDto } from './auth-user-response.dto.js';

export class AuthResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token', type: String })
    accessToken: string;

    @ApiProperty({ example: 'Bearer', description: 'Authentication scheme' })
    tokenType: string;

    @ApiProperty({ example: '15m', description: 'Access token lifetime' })
    expiresIn: string;

    @ApiProperty({ type: AuthUserResponseDto, description: 'Authenticated user information' })
    user: AuthUserResponseDto;
}