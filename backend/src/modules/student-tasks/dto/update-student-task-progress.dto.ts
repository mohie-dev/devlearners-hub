import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TaskProgressStatus } from '../../../common/enums.js';

export class UpdateStudentTaskProgressDto {
    @ApiProperty({ enum: TaskProgressStatus })
    @IsEnum(TaskProgressStatus)
    status: TaskProgressStatus;
}
