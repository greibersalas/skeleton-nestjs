import {MigrationInterface, QueryRunner} from "typeorm";

export class fixTableDocuments1607454641260 implements MigrationInterface {
    name = 'fixTableDocuments1607454641260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ADD "length" integer`);
        await queryRunner.query(`ALTER TABLE "documents" ALTER COLUMN "correlative" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "documents"."correlative" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "documents"."correlative" IS NULL`);
        await queryRunner.query(`ALTER TABLE "documents" ALTER COLUMN "correlative" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "length"`);
    }

}
