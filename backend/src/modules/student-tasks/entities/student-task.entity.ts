import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { TaskProgressStatus } from '../../../common/enums.js';
import { Task } from '../../tasks/entities/task.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity({ name: 'student_tasks' })
@Unique('UQ_student_tasks_student_task', ['studentId', 'taskId'])
export class StudentTask extends BaseEntity {
    @Column({ name: 'student_id', type: 'uuid' })
    studentId: string;

    @Column({ name: 'task_id', type: 'uuid' })
    taskId: string;

    @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'student_id' })
    student: User;

    @ManyToOne(() => Task, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'task_id' })
    task: Task;

    @Column({
        type: 'enum',
        enum: TaskProgressStatus,
        enumName: 'task_progress_status_enum',
        default: TaskProgressStatus.PENDING,
    })
    status: TaskProgressStatus;

    @Column({
        name: 'completed_at',
        type: 'timestamptz',
        nullable: true,
    })
    completedAt: Date | null;
}
