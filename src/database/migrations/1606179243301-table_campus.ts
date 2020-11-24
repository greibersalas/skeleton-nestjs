import {MigrationInterface, QueryRunner} from "typeorm";

export class tableCampus1606179243301 implements MigrationInterface {
    name = 'tableCampus1606179243301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "campus" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "description" character varying, "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_86696218558df8baf68dc71f0f2" UNIQUE ("name"), CONSTRAINT "PK_150aa1747b3517c47f9bd98ea6d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "campus"`);
    }

}
