import {MigrationInterface, QueryRunner} from "typeorm";

export class tableClinicHistory1606951843148 implements MigrationInterface {
    name = 'tableClinicHistory1606951843148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clinic_history" ("id" SERIAL NOT NULL, "date" date NOT NULL, "client" bigint NOT NULL, "name" character varying(60) NOT NULL, "lastNameFather" character varying(20), "lastNameMother" character varying(20), "documentNumber" bigint NOT NULL, "relationship" character varying(20) NOT NULL, "birthdate" date, "history" character varying(15) NOT NULL, "sex" character varying(10) NOT NULL, "ruc" character varying(11), "address" character varying NOT NULL, "country" character varying(15), "district" integer NOT NULL, "email" character varying(80), "phone" character varying(15), "cellphone" character varying(15), "studyCenter" character varying(40), "knowledge" character varying(40), "referred" character varying(40), "placeOrigen" character varying(120), "birthPlace" character varying(60), "vip" boolean NOT NULL DEFAULT false, "previousAttentions" character varying(10) NOT NULL, "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "capus" integer NOT NULL, "insuranceCarrier" integer NOT NULL, CONSTRAINT "UQ_b1d94c7b0ad13466207ce662d13" UNIQUE ("history"), CONSTRAINT "PK_af5edbc6cf49ce3a29cbfbd02a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD CONSTRAINT "FK_c52179da15d06a56d23e4b3e5bd" FOREIGN KEY ("capus") REFERENCES "campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD CONSTRAINT "FK_ee91a09a67edc41ba1ffd6d215d" FOREIGN KEY ("insuranceCarrier") REFERENCES "insurance_carrier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP CONSTRAINT "FK_ee91a09a67edc41ba1ffd6d215d"`);
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP CONSTRAINT "FK_c52179da15d06a56d23e4b3e5bd"`);
        await queryRunner.query(`DROP TABLE "clinic_history"`);
    }

}
