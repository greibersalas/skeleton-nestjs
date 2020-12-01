import {MigrationInterface, QueryRunner} from "typeorm";

export class tableInsuranceCarrier1606830853295 implements MigrationInterface {
    name = 'tableInsuranceCarrier1606830853295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "insurance_carrier" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "address" character varying NOT NULL, "ruc" bigint NOT NULL, "contacName" character varying(60), "phone" character varying(20), "position" character varying(60), "email" character varying(80), "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_06b65fd9060dd5933d4f6f49f36" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "insurance_carrier"`);
    }

}
