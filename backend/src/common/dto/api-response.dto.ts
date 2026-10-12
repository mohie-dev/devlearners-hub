import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto {
    @ApiProperty({ example: 'success', enum: ['success'], description: 'Indicates that the request succeeded' })
    status: 'success';

    @ApiProperty({ example: 200, description: 'HTTP response status code' })
    code: number;

    @ApiProperty({ description: 'Response payload returned by the endpoint' })
    data: object;
}