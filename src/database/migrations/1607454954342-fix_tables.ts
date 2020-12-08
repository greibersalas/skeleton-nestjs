import {MigrationInterface, QueryRunner} from "typeorm";

export class fixTables1607454954342 implements MigrationInterface {
    name = 'fixTables1607454954342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "documents"."name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "UQ_f5aa827a6a4f1f29940278412fb"`);
        await queryRunner.query(`COMMENT ON COLUMN "environment_doctor"."name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "environment_doctor" DROP CONSTRAINT "UQ_11c64fc34f4db1fd92758f9c9e6"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "environment_doctor" ADD CONSTRAINT "UQ_11c64fc34f4db1fd92758f9c9e6" UNIQUE ("name")`);
        await queryRunner.query(`COMMENT ON COLUMN "environment_doctor"."name" IS NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "UQ_f5aa827a6a4f1f29940278412fb" UNIQUE ("name")`);
        await queryRunner.query(`COMMENT ON COLUMN "documents"."name" IS NULL`);
    }

}
