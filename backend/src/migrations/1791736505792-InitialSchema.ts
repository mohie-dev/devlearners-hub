import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1791736505792 implements MigrationInterface {
    name = 'InitialSchema1791736505792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."subjects_status_enum" AS ENUM('ACTIVE', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "subjects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(150) NOT NULL, "code" character varying(30) NOT NULL, "description" text, "status" "public"."subjects_status_enum" NOT NULL DEFAULT 'ACTIVE', CONSTRAINT "PK_1a023685ac2b051b4e557b0b280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_subjects_code" ON "subjects"  ("code") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('STUDENT', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "full_name" character varying(120) NOT NULL, "email" character varying(254) NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'STUDENT', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_email" ON "users"  ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."content_academic_context_enum" AS ENUM('LECTURE', 'TUTORIAL', 'GENERAL')`);
        await queryRunner.query(`CREATE TYPE "public"."resource_type_enum" AS ENUM('PDF', 'VIDEO', 'DOCUMENT', 'IMAGE', 'LINK', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."content_source_type_enum" AS ENUM('UPLOAD', 'EXTERNAL_LINK')`);
        await queryRunner.query(`CREATE TYPE "public"."content_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "content_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying(200) NOT NULL, "description" text, "academic_context" "public"."content_academic_context_enum" NOT NULL DEFAULT 'GENERAL', "resource_type" "public"."resource_type_enum" NOT NULL, "source_type" "public"."content_source_type_enum" NOT NULL, "resource_url" text, "storage_key" character varying(500), "original_filename" character varying(255), "mime_type" character varying(150), "size_bytes" bigint, "status" "public"."content_status_enum" NOT NULL DEFAULT 'DRAFT', "published_at" TIMESTAMP WITH TIME ZONE, "subject_id" uuid NOT NULL, "created_by" uuid NOT NULL, CONSTRAINT "PK_9c6bf4f28851752cee186915e39" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_content_items_subject_status" ON "content_items"  ("subject_id", "status") `);
        await queryRunner.query(`CREATE TYPE "public"."task_academic_context_enum" AS ENUM('LECTURE', 'TUTORIAL', 'GENERAL')`);
        await queryRunner.query(`CREATE TYPE "public"."task_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying(200) NOT NULL, "description" text, "academic_context" "public"."task_academic_context_enum" NOT NULL DEFAULT 'GENERAL', "due_at" TIMESTAMP WITH TIME ZONE, "status" "public"."task_status_enum" NOT NULL DEFAULT 'DRAFT', "published_at" TIMESTAMP WITH TIME ZONE, "subject_id" uuid NOT NULL, "related_content_item_id" uuid, "created_by" uuid NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_tasks_subject_status" ON "tasks"  ("subject_id", "status") `);
        await queryRunner.query(`CREATE TYPE "public"."task_progress_status_enum" AS ENUM('PENDING', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "task_progress" ("user_id" uuid NOT NULL, "task_id" uuid NOT NULL, "status" "public"."task_progress_status_enum" NOT NULL DEFAULT 'PENDING', "completed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8f65518956d364e550b06a8342b" PRIMARY KEY ("user_id", "task_id"))`);
        await queryRunner.query(`ALTER TABLE "content_items" ADD CONSTRAINT "FK_574d9feea9afe26be938cf01ef4" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content_items" ADD CONSTRAINT "FK_237a7ac2f9cfcc33013eab70165" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_a1c5faec102167f4b27e3ca1bff" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_843865fc24a258bd7068b76e747" FOREIGN KEY ("related_content_item_id") REFERENCES "content_items"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9fc727aef9e222ebd09dc8dac08" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_progress" ADD CONSTRAINT "FK_5c276480a9cb78bef769eae3bc4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_progress" ADD CONSTRAINT "FK_606830285b4d3a4552bc8cc97d3" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_progress" DROP CONSTRAINT "FK_606830285b4d3a4552bc8cc97d3"`);
        await queryRunner.query(`ALTER TABLE "task_progress" DROP CONSTRAINT "FK_5c276480a9cb78bef769eae3bc4"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9fc727aef9e222ebd09dc8dac08"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_843865fc24a258bd7068b76e747"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_a1c5faec102167f4b27e3ca1bff"`);
        await queryRunner.query(`ALTER TABLE "content_items" DROP CONSTRAINT "FK_237a7ac2f9cfcc33013eab70165"`);
        await queryRunner.query(`ALTER TABLE "content_items" DROP CONSTRAINT "FK_574d9feea9afe26be938cf01ef4"`);
        await queryRunner.query(`DROP TABLE "task_progress"`);
        await queryRunner.query(`DROP TYPE "public"."task_progress_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_tasks_subject_status"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."task_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."task_academic_context_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_content_items_subject_status"`);
        await queryRunner.query(`DROP TABLE "content_items"`);
        await queryRunner.query(`DROP TYPE "public"."content_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."content_source_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."resource_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."content_academic_context_enum"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_users_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_subjects_code"`);
        await queryRunner.query(`DROP TABLE "subjects"`);
        await queryRunner.query(`DROP TYPE "public"."subjects_status_enum"`);
    }

}
