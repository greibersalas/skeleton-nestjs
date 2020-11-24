import {MigrationInterface, QueryRunner} from "typeorm";

export class tableTariff1606246187167 implements MigrationInterface {
    name = 'tableTariff1606246187167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tariff" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "description" character varying, "price_sol" real DEFAULT '0', "price_usd" real DEFAULT '0', "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "specialty" integer NOT NULL, CONSTRAINT "UQ_b3980ba974e3ae6569836192678" UNIQUE ("name"), CONSTRAINT "PK_bbeac9df199ea1c22c6dea75c2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tariff_history" ("id" SERIAL NOT NULL, "price_sol_old" real DEFAULT '0', "price_usd_old" real DEFAULT '0', "price_sol_new" real DEFAULT '0', "price_usd_new" real DEFAULT '0', "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "tariffId" integer, CONSTRAINT "PK_48db274cc7a5643737511a3739b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tariff" ADD CONSTRAINT "FK_7e866ef874230c3a364ee731c70" FOREIGN KEY ("specialty") REFERENCES "specialty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tariff_history" ADD CONSTRAINT "FK_7ac73f1469d89796f829d3b7877" FOREIGN KEY ("tariffId") REFERENCES "tariff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tariff_history" DROP CONSTRAINT "FK_7ac73f1469d89796f829d3b7877"`);
        await queryRunner.query(`ALTER TABLE "tariff" DROP CONSTRAINT "FK_7e866ef874230c3a364ee731c70"`);
        await queryRunner.query(`DROP TABLE "tariff_history"`);
        await queryRunner.query(`DROP TABLE "tariff"`);
    }

}
