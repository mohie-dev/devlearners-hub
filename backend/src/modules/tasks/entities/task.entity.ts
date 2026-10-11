import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { AcademicContext, TaskStatus } from '../../../common/enums.js';
import { ContentItem } from '../../content/entities/content-item.entity.js';
import { Subject } from '../../subjects/entities/subject.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity({ name: 'tasks' })
@Index('IDX_tasks_subject_status', ['subject', 'status'])
export class Task extends BaseEntity {
    @Column({ type: 'varchar', length: 200, })
    title: string;

    @Column({ type: 'text', nullable: true, })
    description: string | null;

    @Column({ name: 'academic_context', type: 'enum', enum: AcademicContext, enumName: 'task_academic_context_enum', default: AcademicContext.GENERAL, })
    academicContext: AcademicContext;

    @Column({ name: 'due_at', type: 'timestamptz', nullable: true, })
    dueAt: Date | null;

    @Column({ type: 'enum', enum: TaskStatus, enumName: 'task_status_enum', default: TaskStatus.DRAFT, })
    status: TaskStatus;

    @Column({ name: 'published_at', type: 'timestamptz', nullable: true, })
    publishedAt: Date | null;

    @ManyToOne(() => Subject, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    @ManyToOne(() => ContentItem, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'related_content_item_id' })
    relatedContentItem: ContentItem | null;

    @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'created_by' })
    createdBy: User;
}