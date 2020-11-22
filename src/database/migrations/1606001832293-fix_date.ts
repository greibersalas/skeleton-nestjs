import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDate1606001832293 implements MigrationInterface {
    name = 'fixDate1606001832293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "roles"."created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "roles"."updated_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "users_details"."created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "users_details"."updated_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."updated_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."updated_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "users_details"."updated_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "created_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "users_details"."created_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "updated_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "roles"."updated_at" IS NULL`);
        await queryRunner.query(`ALTER TABLE "roles" ALTER COLUMN "created_at" DROP DEFAULT`);
        await queryRunner.query(`COMMENT ON COLUMN "roles"."created_at" IS NULL`);
    }

}
