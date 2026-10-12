import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums.js';

export class AuthUserResponseDto {
    @ApiProperty({ example: '8ee2aa0e-10d9-4122-99ac-95efcbbff018', format: 'uuid', description: 'Unique user identifier' })
    id: string;

    @ApiProperty({ example: 'Abdelrahman Mohie', description: 'Full name of the user' })
    fullName: string;

    @ApiProperty({ example: 'student@example.com', description: 'Registered email address' })
    email: string;

    @ApiProperty({ enum: UserRole, example: UserRole.STUDENT, description: 'Current user role' })
    role: UserRole;
}