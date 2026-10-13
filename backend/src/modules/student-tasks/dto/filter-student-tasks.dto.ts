import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskProgressStatus } from '../../../common/enums.js';

export class FilterStudentTasksDto {
    @ApiPropertyOptional({ enum: TaskProgressStatus })
    @IsOptional()
    @IsEnum(TaskProgressStatus)
    status?: TaskProgressStatus;
}
