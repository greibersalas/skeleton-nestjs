import {MigrationInterface, QueryRunner} from "typeorm";

export class tableDoctor1606833276334 implements MigrationInterface {
    name = 'tableDoctor1606833276334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "doctor" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "nameQuote" character varying(80) NOT NULL, "address" character varying NOT NULL, "district" integer NOT NULL, "dni" bigint NOT NULL, "cop" smallint, "birthdate" date, "email" character varying(80), "phone" character varying(20), "exclusive" boolean NOT NULL DEFAULT false, "cessationDate" date, "environment" integer NOT NULL, "turn" smallint NOT NULL, "documentInssued" smallint NOT NULL, "dateDocumentInssued" date, "number_hours" smallint NOT NULL DEFAULT '0', "percentage" smallint NOT NULL, "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "specialtys" integer NOT NULL, "businessLines" integer NOT NULL, CONSTRAINT "PK_ee6bf6c8de78803212c548fcb94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD CONSTRAINT "FK_83c5a44b3b32ca434d96042d4a4" FOREIGN KEY ("specialtys") REFERENCES "specialty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor" ADD CONSTRAINT "FK_b9383bfd03dcf09648fa363edab" FOREIGN KEY ("businessLines") REFERENCES "business_line"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor" DROP CONSTRAINT "FK_b9383bfd03dcf09648fa363edab"`);
        await queryRunner.query(`ALTER TABLE "doctor" DROP CONSTRAINT "FK_83c5a44b3b32ca434d96042d4a4"`);
        await queryRunner.query(`DROP TABLE "doctor"`);
    }

}
