import {MigrationInterface, QueryRunner} from "typeorm";

export class tablePaymentMethod1607456238159 implements MigrationInterface {
    name = 'tablePaymentMethod1607456238159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_method" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "description" character varying, "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7744c2b2dd932c9cf42f2b9bc3a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payment_method"`);
    }

}
