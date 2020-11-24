import {MigrationInterface, QueryRunner} from "typeorm";

export class tableSpecialty1606180224936 implements MigrationInterface {
    name = 'tableSpecialty1606180224936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "specialty" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "description" character varying, "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "businessLinesId" integer NOT NULL, CONSTRAINT "UQ_6caedcf8a5f84e3072c5a380a16" UNIQUE ("name"), CONSTRAINT "PK_9cf4ae334dc4a1ab1e08956460e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "specialty" ADD CONSTRAINT "FK_b8d8076463ebe1f4c665f737200" FOREIGN KEY ("businessLinesId") REFERENCES "business_line"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "specialty" DROP CONSTRAINT "FK_b8d8076463ebe1f4c665f737200"`);
        await queryRunner.query(`DROP TABLE "specialty"`);
    }

}
