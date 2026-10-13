import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStudentTasksTable1791926757155 implements MigrationInterface {
    name = 'CreateStudentTasksTable1791926757155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "student_tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "student_id" uuid NOT NULL, "task_id" uuid NOT NULL, "status" "public"."task_progress_status_enum" NOT NULL DEFAULT 'PENDING', "completed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_student_tasks_student_task" UNIQUE ("student_id", "task_id"), CONSTRAINT "PK_21323d16b66c3c780c451031b8f" PRIMARY KEY ("id"))`);
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
        await queryRunner.query(`ALTER TABLE "student_tasks" ADD CONSTRAINT "FK_d9759dfa30812b23a795a29d996" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_tasks" ADD CONSTRAINT "FK_8ce043092c404e14c38c479a373" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_tasks" DROP CONSTRAINT "FK_8ce043092c404e14c38c479a373"`);
        await queryRunner.query(`ALTER TABLE "student_tasks" DROP CONSTRAINT "FK_d9759dfa30812b23a795a29d996"`);
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
        await queryRunner.query(`DROP TABLE "student_tasks"`);
    }

}
