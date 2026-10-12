import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubjectDepartmentAndLevel1791826496169 implements MigrationInterface {
    name = 'AddSubjectDepartmentAndLevel1791826496169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subjects" ADD "level" smallint NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."subjects_department_enum" AS ENUM('CS', 'IS', 'IT', 'GENERAL')`);
        await queryRunner.query(`ALTER TABLE "subjects" ADD "department" "public"."subjects_department_enum" NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."subjects_status_enum" RENAME TO "subjects_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."subjects_status_enum" AS ENUM('ACTIVE', 'ARCHIVED')`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" TYPE "public"."subjects_status_enum" USING "status"::"text"::"public"."subjects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`DROP TYPE "public"."subjects_status_enum_old"`);
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
        await queryRunner.query(`CREATE TYPE "public"."subjects_status_enum_old" AS ENUM('ACTIVE', 'ARCHIVED')`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" TYPE "public"."subjects_status_enum_old" USING "status"::"text"::"public"."subjects_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "subjects" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`DROP TYPE "public"."subjects_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."subjects_status_enum_old" RENAME TO "subjects_status_enum"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "department"`);
        await queryRunner.query(`DROP TYPE "public"."subjects_department_enum"`);
        await queryRunner.query(`ALTER TABLE "subjects" DROP COLUMN "level"`);
    }

}
