import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubjectTags1792247988659 implements MigrationInterface {
    name = 'CreateSubjectTags1792247988659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subject_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(50) NOT NULL, "subject_id" uuid NOT NULL, CONSTRAINT "PK_44fbce506b339be353caf355c7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_subject_tags_subject_name" ON "subject_tags"  ("subject_id", "name") `);
        await queryRunner.query(`CREATE TABLE "content_item_tags" ("content_item_id" uuid NOT NULL, "subject_tag_id" uuid NOT NULL, CONSTRAINT "PK_3ae2ea053d1683b4dd251ca6fb1" PRIMARY KEY ("content_item_id", "subject_tag_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ff11dd36a48509aee379f3a793" ON "content_item_tags"  ("content_item_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab0b2ed50aa8dbc256dd43e42b" ON "content_item_tags"  ("subject_tag_id") `);
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
        await queryRunner.query(`ALTER TABLE "subject_tags" ADD CONSTRAINT "FK_32f51aa99ebef5b2800a4b4eedc" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content_item_tags" ADD CONSTRAINT "FK_ff11dd36a48509aee379f3a7939" FOREIGN KEY ("content_item_id") REFERENCES "content_items"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "content_item_tags" ADD CONSTRAINT "FK_ab0b2ed50aa8dbc256dd43e42bd" FOREIGN KEY ("subject_tag_id") REFERENCES "subject_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content_item_tags" DROP CONSTRAINT "FK_ab0b2ed50aa8dbc256dd43e42bd"`);
        await queryRunner.query(`ALTER TABLE "content_item_tags" DROP CONSTRAINT "FK_ff11dd36a48509aee379f3a7939"`);
        await queryRunner.query(`ALTER TABLE "subject_tags" DROP CONSTRAINT "FK_32f51aa99ebef5b2800a4b4eedc"`);
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
        await queryRunner.query(`DROP INDEX "public"."IDX_ab0b2ed50aa8dbc256dd43e42b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff11dd36a48509aee379f3a793"`);
        await queryRunner.query(`DROP TABLE "content_item_tags"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_subject_tags_subject_name"`);
        await queryRunner.query(`DROP TABLE "subject_tags"`);
    }

}
