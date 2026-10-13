import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAcademicProfile1791914773116 implements MigrationInterface {
    name = 'AddUserAcademicProfile1791914773116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subject_department_enum" AS ENUM('CS', 'IS', 'IT', 'GENERAL')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "department" "public"."subject_department_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."subject_level_enum" AS ENUM('1', '2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "study_level" "public"."subject_level_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."subjects_status_enum" RENAME TO "subjects_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."subjects_status_enum" AS ENUM('ACTIVE', 'ARCHIVED')`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" TYPE "public"."subjects_status_enum" USING "status"::"text"::"public"."subjects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`DROP TYPE "public"."subjects_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."subjects_department_enum" RENAME TO "subjects_department_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."subjects_department_enum" AS ENUM('CS', 'IS', 'IT', 'GENERAL')`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "department" TYPE "public"."subjects_department_enum" USING "department"::"text"::"public"."subjects_department_enum"`);
        await queryRunner.query(`DROP TYPE "public"."subjects_department_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum" RENAME TO "users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('STUDENT', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum" USING "role"::"text"::"public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STUDENT'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."task_progress_status_enum" RENAME TO "task_progress_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."task_progress_status_enum" AS ENUM('PENDING', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "task_progress" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "task_progress" ALTER COLUMN "status" TYPE "public"."task_progress_status_enum" USING "status"::"text"::"public"."task_progress_status_enum"`);
        await queryRunner.query(`ALTER TABLE "task_progress" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."task_progress_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_progress_status_enum_old" AS ENUM('PENDING', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "task_progress" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "task_progress" ALTER COLUMN "status" TYPE "public"."task_progress_status_enum_old" USING "status"::"text"::"public"."task_progress_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "task_progress" ALTER COLUMN "status" SET DEFAULT 'PENDING'`);
        await queryRunner.query(`DROP TYPE "public"."task_progress_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."task_progress_status_enum_old" RENAME TO "task_progress_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum_old" AS ENUM('STUDENT', 'ADMIN')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."users_role_enum_old" USING "role"::"text"::"public"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STUDENT'`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_role_enum_old" RENAME TO "users_role_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."subjects_department_enum_old" AS ENUM('CS', 'IS', 'IT', 'GENERAL')`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "department" TYPE "public"."subjects_department_enum_old" USING "department"::"text"::"public"."subjects_department_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."subjects_department_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."subjects_department_enum_old" RENAME TO "subjects_department_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."subjects_status_enum_old" AS ENUM('ACTIVE', 'ARCHIVED')`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" TYPE "public"."subjects_status_enum_old" USING "status"::"text"::"public"."subjects_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`DROP TYPE "public"."subjects_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."subjects_status_enum_old" RENAME TO "subjects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "study_level"`);
        await queryRunner.query(`DROP TYPE "public"."subject_level_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "department"`);
        await queryRunner.query(`DROP TYPE "public"."subject_department_enum"`);
    }

}
