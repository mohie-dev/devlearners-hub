import { PartialType } from '@nestjs/swagger';
import { CreateSubjectTagDto } from './create-subject-tag.dto.js';

export class UpdateSubjectTagDto extends PartialType(CreateSubjectTagDto) { }