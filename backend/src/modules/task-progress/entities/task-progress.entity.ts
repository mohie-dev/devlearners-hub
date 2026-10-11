import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TaskProgressStatus } from '../../../common/enums.js';
import { Task } from '../../tasks/entities/task.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity({ name: 'task_progress' })
export class TaskProgress {
    @PrimaryColumn({ name: 'user_id', type: 'uuid', })
    userId: string;

    @PrimaryColumn({ name: 'task_id', type: 'uuid', })
    taskId: string;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Task, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'task_id' })
    task: Task;

    @Column({ type: 'enum', enum: TaskProgressStatus, enumName: 'task_progress_status_enum', default: TaskProgressStatus.PENDING, })
    status: TaskProgressStatus;

    @Column({ name: 'completed_at', type: 'timestamptz', nullable: true, })
    completedAt: Date | null;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz', })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', })
    updatedAt: Date;
}
