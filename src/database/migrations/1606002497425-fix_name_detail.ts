import {MigrationInterface, QueryRunner} from "typeorm";

export class fixNameDetail1606002497425 implements MigrationInterface {
    name = 'fixNameDetail1606002497425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users_details"."name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "estado" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users_details"."estado" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "users_details"."estado" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "estado" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users_details"."name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users_details" ALTER COLUMN "name" SET NOT NULL`);
    }

}
