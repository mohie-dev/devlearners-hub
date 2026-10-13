import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddStudentTaskDto {
    @ApiProperty({ format: 'uuid', description: 'Task UUID' })
    @IsUUID()
    taskId: string;
}
