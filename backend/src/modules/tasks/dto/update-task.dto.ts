import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto.js';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../../../common/enums.js';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.PUBLISHED, description: 'Task lifecycle status' })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}
