import {MigrationInterface, QueryRunner} from "typeorm";

export class tableBusinessLine1606177880823 implements MigrationInterface {
    name = 'tableBusinessLine1606177880823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "business_line" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "description" character varying, "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1b55fa7f1d9d9aa03d34e35c0a3" UNIQUE ("name"), CONSTRAINT "PK_b3f4256a5b0584433a296cf0dc2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "business_line"`);
    }

}
