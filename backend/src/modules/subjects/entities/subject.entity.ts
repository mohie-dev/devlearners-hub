import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { SubjectStatus } from '../../../common/enums.js';

@Entity({ name: 'subjects' })
@Index('UQ_subjects_code', ['code'], { unique: true })
export class Subject extends BaseEntity {
    @Column({ type: 'varchar', length: 150, })
    name: string;

    @Column({ type: 'varchar', length: 30, })
    code: string;

    @Column({ type: 'text', nullable: true, })
    description: string | null;

    @Column({ type: 'enum', enum: SubjectStatus, enumName: 'subjects_status_enum', default: SubjectStatus.ACTIVE, })
    status: SubjectStatus;
}
