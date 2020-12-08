import {MigrationInterface, QueryRunner} from "typeorm";

export class tableDocuments1607454438381 implements MigrationInterface {
    name = 'tableDocuments1607454438381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clinic_history" ("id" SERIAL NOT NULL, "date" date NOT NULL, "client" bigint NOT NULL, "name" character varying(60) NOT NULL, "lastNameFather" character varying(20), "lastNameMother" character varying(20), "documentNumber" character varying(15) NOT NULL, "relationship" character varying(20) NOT NULL, "birthdate" date, "history" character varying(15) NOT NULL, "sex" character varying(10) NOT NULL, "ruc" character varying(11), "address" character varying NOT NULL, "country" character varying(15), "district" integer NOT NULL, "email" character varying(80), "phone" character varying(15), "cellphone" character varying(15), "studyCenter" character varying(40), "knowledge" character varying(40), "referred" character varying(40), "placeOrigen" character varying(120), "birthPlace" character varying(60), "vip" boolean NOT NULL DEFAULT false, "previousAttentions" text NOT NULL, "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "campus" integer NOT NULL, "insuranceCarrier" integer NOT NULL, CONSTRAINT "UQ_b1d94c7b0ad13466207ce662d13" UNIQUE ("history"), CONSTRAINT "PK_af5edbc6cf49ce3a29cbfbd02a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "description" character varying, "correlative" smallint NOT NULL, "state" smallint NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f5aa827a6a4f1f29940278412fb" UNIQUE ("name"), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD CONSTRAINT "FK_742b28e5eb64132db3e46fbe21d" FOREIGN KEY ("campus") REFERENCES "campus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clinic_history" ADD CONSTRAINT "FK_ee91a09a67edc41ba1ffd6d215d" FOREIGN KEY ("insuranceCarrier") REFERENCES "insurance_carrier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP CONSTRAINT "FK_ee91a09a67edc41ba1ffd6d215d"`);
        await queryRunner.query(`ALTER TABLE "clinic_history" DROP CONSTRAINT "FK_742b28e5eb64132db3e46fbe21d"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TABLE "clinic_history"`);
    }

}
