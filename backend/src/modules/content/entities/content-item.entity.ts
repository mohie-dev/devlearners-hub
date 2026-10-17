import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { AcademicContext, ContentSourceType, ContentStatus, ResourceType } from '../../../common/enums.js';
import { Subject } from '../../subjects/entities/subject.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { SubjectTag } from '../../subject-tags/entities/subject-tag.entity.js';

@Entity({ name: 'content_items' })
@Index('IDX_content_items_subject_status', ['subject', 'status'])
export class ContentItem extends BaseEntity {
    @Column({ type: 'varchar', length: 200, })
    title: string;

    @Column({ type: 'text', nullable: true, })
    description: string | null;

    @Column({ name: 'academic_context', type: 'enum', enum: AcademicContext, enumName: 'content_academic_context_enum', default: AcademicContext.GENERAL, })
    academicContext: AcademicContext;

    @Column({ name: 'resource_type', type: 'enum', enum: ResourceType, enumName: 'resource_type_enum', })
    resourceType: ResourceType;

    @Column({ name: 'source_type', type: 'enum', enum: ContentSourceType, enumName: 'content_source_type_enum', })
    sourceType: ContentSourceType;

    @Column({ name: 'resource_url', type: 'text', nullable: true, })
    resourceUrl: string | null;

    @Column({ name: 'storage_key', type: 'varchar', length: 500, nullable: true, })
    storageKey: string | null;

    @Column({ name: 'original_filename', type: 'varchar', length: 255, nullable: true, })
    originalFilename: string | null;

    @Column({ name: 'mime_type', type: 'varchar', length: 150, nullable: true, })
    mimeType: string | null;

    @Column({ name: 'size_bytes', type: 'bigint', nullable: true, })
    sizeBytes: string | null;

    @Column({ type: 'enum', enum: ContentStatus, enumName: 'content_status_enum', default: ContentStatus.DRAFT, })
    status: ContentStatus;

    @Column({ name: 'published_at', type: 'timestamptz', nullable: true, })
    publishedAt: Date | null;

    @ManyToOne(() => Subject, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    @ManyToOne(() => User, { nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'created_by' })
    createdBy: User;

    @ManyToMany(() => SubjectTag, (tag) => tag.contentItems)
    @JoinTable({
        name: 'content_item_tags',
        joinColumn: {
            name: 'content_item_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'subject_tag_id',
            referencedColumnName: 'id',
        },
    })
    tags: SubjectTag[];
}