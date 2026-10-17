import { Column, Entity, Index, JoinColumn, ManyToOne, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Subject } from '../../subjects/entities/subject.entity.js';
import { ContentItem } from '../../content/entities/content-item.entity.js';

@Entity({ name: 'subject_tags' })
@Index('UQ_subject_tags_subject_name', ['subject', 'name'], { unique: true })
export class SubjectTag extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToOne(() => Subject, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    @ManyToMany(() => ContentItem, (contentItem) => contentItem.tags)
    contentItems: ContentItem[];
}
