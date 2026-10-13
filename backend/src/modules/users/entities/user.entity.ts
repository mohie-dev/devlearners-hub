import { Column, Entity, Index } from 'typeorm';
import { UserRole, SubjectDepartment, SubjectLevel } from '../../../common/enums.js';
import { BaseEntity } from '../../../common/entities/base.entity.js';

@Entity({ name: 'users' })
@Index('UQ_users_email', ['email'], { unique: true })
export class User extends BaseEntity {
    @Column({ name: 'full_name', type: 'varchar', length: 120 })
    fullName: string;

    @Column({ type: 'varchar', length: 254 })
    email: string;

    @Column({ name: 'password_hash', type: 'varchar', select: false })
    passwordHash: string;

    @Column({ type: 'enum', enum: UserRole, enumName: 'users_role_enum', default: UserRole.STUDENT, })
    role: UserRole;

    @Column({ type: 'enum', enum: SubjectDepartment, enumName: 'subject_department_enum', nullable: true, })
    department: SubjectDepartment | null;

    @Column({ name: 'study_level', type: 'enum', enum: SubjectLevel, enumName: 'subject_level_enum', nullable: true, })
    studyLevel: SubjectLevel | null;
}